import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { FavoritesContext } from './FavoritesContext';
import { addFavorite, getFavoritesByUser, removeFavorite } from '../api/favoritesApi';

function FavoritesProvider({ children }) {
  const { user } = useContext(AuthContext);
  // userId comes from the auth context, NOT from the DummyJSON recipe.userId (recipe author)
  const userId = user ? user.id : null;

  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [pendingRecipeIds, setPendingRecipeIds] = useState([]); // requests in progress
  const [reloadKey, setReloadKey] = useState(0);

  // Remembers the current user, so a slow response for a previous user is ignored
  const currentUserIdRef = useRef(userId);

  useEffect(() => {
    currentUserIdRef.current = userId;

    // Every time the user changes (login, logout, other user) the old list is cleared
    setFavorites([]);
    setLoadError('');
    setPendingRecipeIds([]);

    if (userId === null) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    getFavoritesByUser(userId, controller.signal)
      .then((data) => setFavorites(data))
      .catch((error) => {
        if (error.name !== 'AbortError') setLoadError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    // Cancels the request if the user changes before it finishes
    return () => controller.abort();
  }, [userId, reloadKey]);

  const getFavorite = (recipeId) => favorites.find((item) => item.recipeId === recipeId);
  const isFavorite = (recipeId) => favorites.some((item) => item.recipeId === recipeId);
  const isPending = (recipeId) => pendingRecipeIds.includes(recipeId);

  const startPending = (recipeId) => setPendingRecipeIds((prev) => [...prev, recipeId]);
  const stopPending = (recipeId) => setPendingRecipeIds((prev) => prev.filter((id) => id !== recipeId));

  // Throws an error on failure, so the button can show it and the UI is not changed
  const addToFavorites = async (recipe) => {
    if (userId === null || isFavorite(recipe.id) || isPending(recipe.id)) return;

    startPending(recipe.id);
    try {
      const created = await addFavorite(userId, recipe);
      if (currentUserIdRef.current !== userId) return; // user changed meanwhile
      // New array instead of push() - state is never mutated directly
      setFavorites((prev) => (prev.some((item) => item.id === created.id) ? prev : [...prev, created]));
    } finally {
      stopPending(recipe.id);
    }
  };

  const removeFromFavorites = async (recipeId) => {
    const favorite = getFavorite(recipeId);
    if (!favorite || isPending(recipeId)) return;

    startPending(recipeId);
    try {
      await removeFavorite(favorite.id); // DELETE /favorites/:id (record id)
    } catch (error) {
      // 404 means the record is already gone on the server, so the UI can drop it too
      if (error.status !== 404) throw error;
    } finally {
      stopPending(recipeId);
    }

    if (currentUserIdRef.current !== userId) return;
    setFavorites((prev) => prev.filter((item) => item.id !== favorite.id));
  };

  const reloadFavorites = () => setReloadKey((prev) => prev + 1);

  const value = {
    favorites,
    isLoading,
    loadError,
    isFavorite,
    isPending,
    addToFavorites,
    removeFromFavorites,
    reloadFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export default FavoritesProvider;
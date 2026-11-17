import { useContext, useState } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

// Toggles a recipe in the favorites list. recipe needs id, name and image.
function FavoriteButton({ recipe }) {
  const { isFavorite, isPending, isLoading, loadError, addToFavorites, removeFromFavorites } =
    useContext(FavoritesContext);
  const [error, setError] = useState('');

  const favorite = isFavorite(recipe.id);
  const pending = isPending(recipe.id);
  // While the list is loading (or failed to load) the real status is unknown
  const disabled = pending || isLoading || Boolean(loadError);

  const handleClick = async () => {
    setError('');
    try {
      if (favorite) {
        await removeFromFavorites(recipe.id);
      } else {
        await addToFavorites(recipe);
      }
    } catch (err) {
      // State was not changed, so the UI does not pretend the action worked
      setError(err.message);
    }
  };

  let label = favorite ? '★ Pašalinti iš mėgstamiausių' : '☆ Į mėgstamiausius';
  if (pending) label = 'Saugoma...';

  return (
    <div className="favorite-action">
      <button
        type="button"
        className={`btn ${favorite ? 'btn-favorite-active' : 'btn-favorite'}`}
        onClick={handleClick}
        disabled={disabled}
        aria-pressed={favorite}
      >
        {label}
      </button>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export default FavoriteButton;
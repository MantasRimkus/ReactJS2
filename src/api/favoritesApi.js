import { API_URL } from './config';
import { request } from './request';

export function getFavoritesByUser(userId, signal) {
  return request(`${API_URL}/favorites?userId=${encodeURIComponent(userId)}`, { signal });
}

export async function addFavorite(userId, recipe) {
  // Server-side check so the same recipe is never saved twice for one user
  // (for example, when the app is open in two tabs)
  const existing = await request(
    `${API_URL}/favorites?userId=${encodeURIComponent(userId)}&recipeId=${encodeURIComponent(recipe.id)}`,
  );
  if (existing.length > 0) {
    return existing[0];
  }

  return request(`${API_URL}/favorites`, {
    method: 'POST',
    body: JSON.stringify({
      userId,
      recipeId: recipe.id,
      name: recipe.name,
      image: recipe.image,
    }),
  });
}

// Deleted by the favorite record id, not by recipeId
export function removeFavorite(favoriteId) {
  return request(`${API_URL}/favorites/${favoriteId}`, { method: 'DELETE' });
}
import { RECIPES_API_URL, RECIPES_PER_PAGE } from './config';
import { request } from './request';

// Returns { recipes, total, skip, limit }
export function getRecipes(page, signal) {
  const skip = (page - 1) * RECIPES_PER_PAGE;
  return request(`${RECIPES_API_URL}?limit=${RECIPES_PER_PAGE}&skip=${skip}`, { signal });
}

export function getRecipeById(id, signal) {
  return request(`${RECIPES_API_URL}/${id}`, { signal });
}
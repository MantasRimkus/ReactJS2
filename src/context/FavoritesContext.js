import { createContext } from 'react';

// Holds the logged-in user's favorites and add/remove actions (provided by FavoritesProvider)
export const FavoritesContext = createContext(null);
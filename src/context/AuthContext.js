import { createContext } from 'react';

// Holds: user, isAuthenticated, register, login, logout (provided by AuthProvider)
export const AuthContext = createContext(null);
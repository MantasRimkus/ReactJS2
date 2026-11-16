import { useState } from 'react';
import { AuthContext } from './AuthContext';
import { loginUser, registerUser } from '../api/authApi';
import { normalizeEmail } from '../utils/validation';

const STORAGE_KEY = 'recipeApp.user';

// Reads the saved user from localStorage. Runs synchronously, so the user is
// already known on the first render and ProtectedRoute does not redirect by mistake.
function readStoredUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (parsed && parsed.id !== undefined && parsed.email) {
      return { id: parsed.id, name: parsed.name, email: parsed.email };
    }
    return null;
  } catch {
    // Broken JSON or blocked storage - start logged out
    return null;
  }
}

function AuthProvider({ children }) {
  // Passing a function means it runs only once, on the first render
  const [user, setUser] = useState(readStoredUser);

  const register = ({ name, email, password }) => {
    return registerUser({ name: name.trim(), email: normalizeEmail(email), password });
  };

  const login = async (email, password) => {
    // If the request fails, an error is thrown and the user is NOT saved
    const loggedInUser = await loginUser({ email: normalizeEmail(email), password });
    setUser(loggedInUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser)); // id, name, email - no password
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    user,
    isAuthenticated: user !== null, // derived from user, not a separate state
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
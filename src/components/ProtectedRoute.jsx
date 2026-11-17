import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Wraps all private routes. Not logged in -> redirect to /login.
// <Navigate> is a component, so no navigation function is called during render.
// The user is restored synchronously from localStorage, so there is no loading phase to wait for.
function ProtectedRoute() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Outlet renders the matched child route (/dashboard, /recipe/:id, /favorites)
  return <Outlet />;
}

export default ProtectedRoute;
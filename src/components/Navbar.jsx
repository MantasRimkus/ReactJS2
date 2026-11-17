import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FavoritesContext } from '../context/FavoritesContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { favorites } = useContext(FavoritesContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
        🍲 Receptai
      </Link>

      <nav className="navbar-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard">Receptai</NavLink>
            <NavLink to="/favorites">Mėgstamiausi ({favorites.length})</NavLink>
            <span className="navbar-user">👤 {user.name}</span>
            <button type="button" className="btn btn-outline" onClick={handleLogout}>
              Atsijungti
            </button>
          </>
        ) : (
          <>
            <NavLink to="/" end>
              Pradžia
            </NavLink>
            <NavLink to="/login">Prisijungti</NavLink>
            <NavLink to="/register">Registruotis</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <section className="hero">
      <h1>Receptų programėlė</h1>
      <p>Naršykite receptus ir kurkite savo mėgstamiausių receptų sąrašą.</p>

      {isAuthenticated ? (
        <div className="hero-actions">
          <p>Sveiki sugrįžę, {user.name}!</p>
          <Link to="/dashboard" className="btn btn-primary">
            Eiti į receptus
          </Link>
        </div>
      ) : (
        <div className="hero-actions">
          <Link to="/login" className="btn btn-primary">
            Prisijungti
          </Link>
          <Link to="/register" className="btn btn-outline">
            Registruotis
          </Link>
        </div>
      )}
    </section>
  );
}

export default Home;
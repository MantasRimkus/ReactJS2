import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Pradžia</Link> | <Link to="/login">Prisijungti</Link> |{' '}
      <Link to="/register">Registruotis</Link> | <Link to="/dashboard">Receptai</Link> |{' '}
      <Link to="/favorites">Mėgstamiausi</Link>
    </nav>
  );
}

export default Navbar;

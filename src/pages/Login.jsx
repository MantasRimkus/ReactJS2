import { useContext, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FormField from '../components/FormField';
import { validateLogin } from '../utils/validation';

function Login() {
  const { isAuthenticated, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Data passed from the Register page after a successful registration
  const justRegistered = location.state?.registered === true;

  const [form, setForm] = useState({ email: location.state?.email ?? '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateLogin(form);
    setErrors(validationErrors);
    setSubmitError('');
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setSubmitError(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Prisijungimas</h1>

      {justRegistered && !submitError && (
        <p className="form-success" role="status">
          Registracija sėkminga! Dabar galite prisijungti.
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          label="El. paštas"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        <FormField
          id="password"
          label="Slaptažodis"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        {submitError && (
          <p className="form-error" role="alert">
            {submitError}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
          {isSubmitting ? 'Jungiamasi...' : 'Prisijungti'}
        </button>
      </form>

      <p className="auth-switch">
        Neturite paskyros? <Link to="/register">Užsiregistruokite</Link>
      </p>
    </section>
  );
}

export default Login;
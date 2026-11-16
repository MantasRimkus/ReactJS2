import { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FormField from '../components/FormField';
import { normalizeEmail, validateRegister } from '../utils/validation';

const initialForm = { name: '', email: '', password: '', confirmPassword: '' };

function Register() {
  const { isAuthenticated, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Copy the old object and change one field (no direct mutation)
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateRegister(form);
    setErrors(validationErrors);
    setSubmitError('');
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await register(form);
      // Success only after the server saved the user
      navigate('/login', {
        replace: true,
        state: { registered: true, email: normalizeEmail(form.email) },
      });
    } catch (error) {
      setSubmitError(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Registracija</h1>

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="name"
          label="Vardas"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
        />
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
          label="Slaptažodis (bent 6 simboliai)"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />
        <FormField
          id="confirmPassword"
          label="Pakartokite slaptažodį"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        {submitError && (
          <p className="form-error" role="alert">
            {submitError}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
          {isSubmitting ? 'Registruojama...' : 'Registruotis'}
        </button>
      </form>

      <p className="auth-switch">
        Jau turite paskyrą? <Link to="/login">Prisijunkite</Link>
      </p>
    </section>
  );
}

export default Register;
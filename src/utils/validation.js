const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function validateEmail(email) {
  if (!email.trim()) return 'Įveskite el. paštą.';
  if (!EMAIL_PATTERN.test(email.trim())) return 'Netinkamas el. pašto formatas.';
  return '';
}

// Each function returns an object { fieldName: errorMessage } with only invalid fields
export function validateLogin({ email, password }) {
  const errors = {};
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  if (!password) errors.password = 'Įveskite slaptažodį.';
  return errors;
}

export function validateRegister({ name, email, password, confirmPassword }) {
  const errors = {};

  if (!name.trim()) errors.name = 'Įveskite vardą.';

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) {
    errors.password = 'Įveskite slaptažodį.';
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Slaptažodis turi būti bent ${MIN_PASSWORD_LENGTH} simbolių.`;
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Pakartokite slaptažodį.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Slaptažodžiai nesutampa.';
  }

  return errors;
}
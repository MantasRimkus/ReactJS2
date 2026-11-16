import { API_URL } from './config';
import { ApiError, request } from './request';

// Only safe fields are returned - the password never leaves this file
function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

async function findUserByEmail(email) {
  // Only the email goes to the URL, the password is never sent as a query parameter
  const users = await request(`${API_URL}/users?email=${encodeURIComponent(email)}`);
  return users.length > 0 ? users[0] : null;
}

export async function registerUser({ name, email, password }) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ApiError('Naudotojas su tokiu el. paštu jau užregistruotas.', 409);
  }

  const createdUser = await request(`${API_URL}/users`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

  return toPublicUser(createdUser);
}

// Educational login imitation: json-server has no real authentication,
// so the user is found by email and the password is compared here.
export async function loginUser({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new ApiError('Neteisingas el. paštas arba slaptažodis.', 401);
  }
  return toPublicUser(user);
}
// Error type that also keeps the HTTP status code (0 = server unreachable)
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Shared fetch wrapper. fetch() does not reject on HTTP errors (404, 500...),
// so response.ok is checked manually and an error is thrown.
export async function request(url, options = {}) {
  const headers = { ...options.headers };
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (error) {
    // Request was cancelled on purpose (component unmounted) - pass it on
    if (error.name === 'AbortError') {
      throw error;
    }
    throw new ApiError('Nepavyko susisiekti su serveriu. Patikrinkite, ar jis paleistas.', 0);
  }

  if (!response.ok) {
    throw new ApiError(`Serverio klaida (${response.status}). Bandykite dar kartą.`, response.status);
  }

  // Some responses (e.g. DELETE) may have an empty body
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
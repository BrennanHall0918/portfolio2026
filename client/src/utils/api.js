const API_URL = import.meta.env.VITE_API_URL;

// Centralized fetch wrapper. Automatically attaches the JSON content
// type, the Authorization header when a token is provided, and throws
// a real Error (with the server's message) on any non-2xx response, so
// every caller can just try/catch instead of manually checking
// response.ok every time.
export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}
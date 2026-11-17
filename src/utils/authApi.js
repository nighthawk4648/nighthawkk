const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// Full-page link that starts "Continue with Patreon" and brings the visitor back to `next`
export const patreonStartUrl = (next = "/") =>
  `${API_BASE_URL}/patreon/start?next=${encodeURIComponent(next)}`;

// Same for "Continue with Google"
export const googleStartUrl = (next = "/") =>
  `${API_BASE_URL}/google/start?next=${encodeURIComponent(next)}`;

// Talks to the backend's /auth routes. The session lives in an HttpOnly cookie, so the browser must send credentials.
export async function authRequest(path, { method = "POST", body } = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, message: json?.message, data: json?.data };
  } catch {
    return { ok: false, status: 0, message: "Could not reach the server. Please try again." };
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// Patreon's own pages: the plans/join page (set up on Patreon) and where a patron manages their plan
export const PATREON_JOIN_URL = "https://www.patreon.com/sketchshaper/join";
export const PATREON_MANAGE_URL = "https://www.patreon.com/settings/memberships";

// Full-page link that starts "Continue with Patreon" and brings the visitor back to `next`
export const patreonStartUrl = (next = "/") =>
  `${API_BASE_URL}/patreon/start?next=${encodeURIComponent(next)}`;

// Same for "Continue with Google"
export const googleStartUrl = (next = "/") =>
  `${API_BASE_URL}/google/start?next=${encodeURIComponent(next)}`;

// The session lives in an HttpOnly cookie, so the browser must send credentials.
async function apiRequest(path, { method = "POST", body } = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
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

// Talks to the backend's /auth routes
export const authRequest = (path, options) => apiRequest(`/auth${path}`, options);

// Polar: the address of the payment page for a plan, and of the billing page for someone who bought one
export const startCheckout = (plan, period) => apiRequest("/polar/checkout", { body: { plan, period } });
export const openBilling = () => apiRequest("/polar/portal", { body: {} });

// The signed-in visitor connects the SketchUp window that shows this code
export const approveExtension = (code) => apiRequest("/extension/approve", { body: { code } });

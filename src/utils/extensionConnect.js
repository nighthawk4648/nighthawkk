const KEY = "ss_extension_connect";
const MAX_AGE_MS = 10 * 60 * 1000; // as long as the server keeps a SketchUp sign-in open

// The 6-character code SketchUp shows, or "" when the value is not one
export function cleanConnectCode(value) {
  const code = String(value ?? "").trim().toUpperCase();
  return /^[0-9A-F]{6}$/.test(code) ? code : "";
}

// An email confirmation link can open in a new tab, so that tab needs to know where to come back to.
// Only a convenience: storage may be blocked, and the code can always be typed again.
export function rememberConnect(code, storage) {
  try {
    (storage ?? window.localStorage).setItem(KEY, JSON.stringify({ code, at: Date.now() }));
  } catch {
    // nothing to remember with
  }
}

export function forgetConnect(storage) {
  try {
    (storage ?? window.localStorage).removeItem(KEY);
  } catch {
    // nothing was remembered
  }
}

export function recallConnectPath(storage, now = Date.now()) {
  try {
    const { code, at } = JSON.parse((storage ?? window.localStorage).getItem(KEY));
    return cleanConnectCode(code) && now - at < MAX_AGE_MS ? `/extension/connect?code=${cleanConnectCode(code)}` : null;
  } catch {
    return null;
  }
}

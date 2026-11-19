// A hint about who the visitor was last time, so the page can look right before the server answers.
// It only decides what to show first: PRO access is still checked by the server on every download.
export const AUTH_NOTE_KEY = "ss_auth";

// "pro" (signed in with PRO), "in" (signed in without PRO) or null (signed out)
export const authNoteFor = (user) => (!user ? null : user.isPro ? "pro" : "in");

// Runs in the page head before anything is drawn; sets <html data-auth="..."> for the CSS in globals.css.
// shortcut: reads the note as is, so a stale note shows the wrong version until the server answers.
export const AUTH_NOTE_SCRIPT = `try{var a=localStorage.getItem("${AUTH_NOTE_KEY}");if(a==="in"||a==="pro")document.documentElement.dataset.auth=a}catch(e){}`;

// Save the note and keep the page's own attribute in step (storage can be blocked, so never throw)
export function rememberAuth(user, storage = globalThis.localStorage, root = globalThis.document?.documentElement) {
  const note = authNoteFor(user);
  try {
    if (note) storage.setItem(AUTH_NOTE_KEY, note);
    else storage.removeItem(AUTH_NOTE_KEY);
  } catch {
    /* blocked storage: the page just waits for the server, as before */
  }
  if (!root) return;
  if (note) root.dataset.auth = note;
  else delete root.dataset.auth;
}

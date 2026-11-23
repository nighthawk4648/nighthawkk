// Pages a visitor needs to sign in or connect the extension; walling them would lock out someone who just paid
export const WALL_FREE_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-email", "/extension/connect"];

const BOT_UA = /bot|crawl|spider|slurp|lighthouse|mediapartners/i;

// Variables only Google's real ad code creates; uBlock's stand-in script creates none of them
export const GOOGLE_AD_VARS = ["google_reactive_ads_global_state", "google_ad_modifications", "google_process_slots", "google_unique_id", "google_sa_queue"];

// Google answers an ad box in about 1.5 s; this leaves plenty of room for slow connections
export const BOX_TIMEOUT_MS = 15000;

// Page-load check: "network" (the ad script failed twice while this site still answered: extensions, Brave,
// Vivaldi, DNS blockers), "fake" (it "loaded" but Google's code never ran: uBlock swaps in a stand-in) or null.
// A visitor who can't reach this site either is offline, not blocking.
export function adBlockReason({ scriptLoaded, googleReady, siteReachable = true }) {
  if (!scriptLoaded) return siteReachable ? "network" : null;
  return googleReady ? null : "fake";
}

// One of our ad boxes. Google gives its ad frame a web address as soon as it starts loading the box, then marks
// the box "filled" or "unfilled". Returns "fake" (marked filled, but the frame has no web address: uBlock's
// stand-in), "waiting" (Google started it, no answer yet) or null (answered, or not started: Google waits
// until a box is scrolled into view).
export function adBoxState({ adStatus, frameSrc }) {
  const googleFrame = /^https:\/\//.test(frameSrc || "");
  if (adStatus === "filled") return googleFrame ? null : "fake";
  if (adStatus === "unfilled") return null;
  return googleFrame ? "waiting" : null;
}

// Kept in the browser once a visitor has seen the wall: from then on their link clicks load real pages, so the
// page-load check runs on every page and catches a blocker switched back on mid-visit (like the ss_auth note)
export const WALL_NOTE_KEY = "ss_adwall";

export function sawWall(storage = globalThis.localStorage) {
  try {
    return storage.getItem(WALL_NOTE_KEY) === "1";
  } catch {
    return false; // blocked storage: Next.js keeps switching pages in place, as before
  }
}

export function rememberWall(storage = globalThis.localStorage) {
  try {
    storage.setItem(WALL_NOTE_KEY, "1");
  } catch {
    /* blocked storage: nothing to remember */
  }
}

// A click to turn into a real page load: a plain left click on a link to another page of this site. Left alone:
// new tabs, downloads, other sites, jumps within the page, and the sign-in pages (their links open the sign-in popup).
export function isPlainSiteLink({ button, modified, target, download, href, pageUrl }) {
  if (button !== 0 || modified || download || (target && target !== "_self") || !href) return false;
  const link = new URL(href, pageUrl);
  const page = new URL(pageUrl);
  if (link.origin !== page.origin) return false;
  if (href.includes("#") && link.pathname === page.pathname && link.search === page.search) return false;
  return !WALL_FREE_PATHS.some((path) => link.pathname === path || link.pathname.startsWith(`${path}/`));
}

export function shouldShowWall({ enabled, adsOn, loading, user, pathname = "/", userAgent = "", blocked }) {
  if (!enabled || !adsOn || !blocked || loading || user?.isPro) return false;
  if (BOT_UA.test(userAgent)) return false;
  return !WALL_FREE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

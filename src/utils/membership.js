import { planName } from "./pricing.js";

// No ads for every paying member: PRO, or an ad-free-only tier such as Early Access.
// An older server sends no adFree yet; then PRO decides, as before.
export const isAdFree = (user) => Boolean(user && (user.adFree ?? user.isPro));

// What kind of access a signed-in visitor has, from the fields /api/auth/me returns: "blocked" (an admin paused PRO),
// "manual" (PRO set by hand), "polar" (PRO bought on our Pricing page), "patreon" (active patron),
// "adfree" (paying tier without PRO models) or "free"
export function membershipKind(user) {
  if (!user) return "free";
  if (user.proSource === "blocked") return "blocked";
  if (user.isPro && user.proSource === "manual") return "manual";
  if (user.isPro && user.proSource === "polar") return "polar";
  if (user.isPro) return "patreon";
  if (isAdFree(user)) return "adfree";
  return "free";
}

// The badge next to the name: the highest plan from any source (Patreon, Polar or set by hand).
// An older server sends no plan; then PRO / ad-free decide, as before.
const BADGES = { sponsor: "SPONSOR", pro: "PRO", early_access: "AD-FREE" };
export function planBadge(user) {
  if (!user || user.proSource === "blocked") return null;
  if (user.plan !== undefined) return BADGES[user.plan] || null;
  return user.isPro ? "PRO" : isAdFree(user) ? "AD-FREE" : null;
}

// "until 17 Dec 2026", or "no end date" for PRO that never ends
export function proUntilText(user) {
  if (!user?.proUntil) return "no end date";
  const date = new Date(user.proUntil);
  if (Number.isNaN(date.getTime())) return "no end date";
  return `until ${date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`;
}

// A plan bought on our Pricing page that still counts (Polar keeps a cancelled one "active" until its paid period ends)
export const hasLivePolar = (user) => ["active", "trialing"].includes(user?.polar?.status);

// A payment on our Pricing page failed: access stops until the card is fixed in Manage billing
export const polarProblem = (user) => ["past_due", "unpaid"].includes(user?.polar?.status);

// "Sketch shaper PRO · yearly · renews 17 Dec 2026", or "... · ends 17 Dec 2026" once cancelled
export function polarText(polar) {
  if (!polar) return "";
  const date = new Date(polar.renewsAt ?? NaN); // new Date(null) would be 1970
  const when = Number.isNaN(date.getTime())
    ? ""
    : ` · ${polar.cancelsAtPeriodEnd ? "ends" : "renews"} ${date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`;
  return `${planName(polar.plan)} · ${polar.period}${when}`;
}

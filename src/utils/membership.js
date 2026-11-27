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

// "20 Nov 2027", or "" when the date is missing or not a date
export function dayText(value) {
  const date = new Date(value || NaN); // new Date(null) would be 1970
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

// "until 17 Dec 2026", or "no end date" for PRO that never ends
export const proUntilText = (user) => {
  const day = dayText(user?.proUntil);
  return day ? `until ${day}` : "no end date";
};

// A plan bought on our Pricing page that still counts (Polar keeps a cancelled one "active" until its paid period ends)
export const hasLivePolar = (user) => ["active", "trialing"].includes(user?.polar?.status);

// A payment on our Pricing page failed: access stops until the card is fixed in Manage billing
export const polarProblem = (user) => ["past_due", "unpaid"].includes(user?.polar?.status);

// "Sketch shaper PRO · yearly · renews 17 Dec 2026", or "... · ends 17 Dec 2026" once cancelled
export function polarText(polar) {
  if (!polar) return "";
  const day = dayText(polar.renewsAt);
  const when = day ? ` · ${polar.cancelsAtPeriodEnd ? "ends" : "renews"} ${day}` : "";
  return `${planName(polar.plan)} · ${polar.period}${when}`;
}

// The status chip on the account page: what is wrong or right with the plan, or null for a free visitor
export function accountStatus(user) {
  if (membershipKind(user) === "blocked") return { label: "Paused", tone: "danger" };
  if (polarProblem(user)) return { label: "Payment problem", tone: "danger" };
  if (hasLivePolar(user) && user.polar.cancelsAtPeriodEnd) return { label: "Cancelled", tone: "warn" };
  if (user?.plan) return { label: "Active", tone: "ok" };
  return null;
}

// The label / value pairs under the plan name on the account page
export function membershipFacts(user) {
  if (!user) return [];
  const { polar } = user;
  const billing = polar?.period ? { label: "Billing", value: polar.period[0].toUpperCase() + polar.period.slice(1) } : null;
  const card = { label: "Paid via", value: "Card (Polar)" };
  if (hasLivePolar(user)) {
    const day = dayText(polar.renewsAt);
    return [billing, day && { label: polar.cancelsAtPeriodEnd ? "Access until" : "Renews on", value: day }, card].filter(Boolean);
  }
  if (user.proSource === "manual") {
    return [{ label: "Access until", value: dayText(user.proUntil) || "No end date" }, { label: "Granted by", value: "Sketch shaper team" }];
  }
  if (user.proSource === "patreon") {
    return [{ label: "Paid via", value: "Patreon" }, user.membershipTier && { label: "Tier", value: user.membershipTier }].filter(Boolean);
  }
  return polarProblem(user) ? [billing, card].filter(Boolean) : [];
}

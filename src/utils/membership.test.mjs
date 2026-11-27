import test from "node:test";
import assert from "node:assert/strict";
import { accountStatus, dayText, hasLivePolar, isAdFree, membershipKind, planBadge, polarProblem, polarText, proUntilText, membershipFacts } from "./membership.js";

test("tells blocked, manual, patron and free visitors apart", () => {
  assert.equal(membershipKind(null), "free");
  assert.equal(membershipKind({ isPro: false, proSource: null }), "free");
  assert.equal(membershipKind({ isPro: true, proSource: "patreon" }), "patreon");
  assert.equal(membershipKind({ isPro: true, proSource: "manual" }), "manual");
  // A blocked patron is blocked even though Patreon says they pledge
  assert.equal(membershipKind({ isPro: false, proSource: "blocked", patreonLinked: true }), "blocked");
});

test("older server answers without proSource still count as patron or free", () => {
  assert.equal(membershipKind({ isPro: true }), "patreon");
  assert.equal(membershipKind({ isPro: false }), "free");
});

test("writes the end date, or says there is none", () => {
  assert.equal(proUntilText({ proUntil: "2026-12-17T23:59:59.000Z" }), "until 17 Dec 2026");
  assert.equal(proUntilText({ proUntil: null }), "no end date");
  assert.equal(proUntilText({ proUntil: "nonsense" }), "no end date");
  assert.equal(proUntilText(null), "no end date");
});

test("Early Access members are ad-free without PRO; older server answers fall back to PRO", () => {
  const early = { isPro: false, adFree: true, proSource: "patreon", membershipTier: "Early Access" };
  assert.equal(membershipKind(early), "adfree");
  assert.equal(isAdFree(early), true);
  assert.equal(isAdFree({ isPro: true }), true);
  assert.equal(isAdFree({ isPro: false }), false);
  assert.equal(isAdFree({ isPro: true, adFree: false }), false);
  assert.equal(isAdFree(null), false);
});

test("a plan bought on the Pricing page is its own kind, and cancelling keeps it until the period ends", () => {
  assert.equal(membershipKind({ isPro: true, adFree: true, proSource: "polar" }), "polar");
  assert.equal(membershipKind({ isPro: false, adFree: true, proSource: "polar" }), "adfree");
  assert.equal(hasLivePolar({ polar: { status: "active", cancelsAtPeriodEnd: true } }), true);
  assert.equal(hasLivePolar({ polar: { status: "canceled" } }), false);
  assert.equal(hasLivePolar({ polar: null }), false);
  assert.equal(hasLivePolar(null), false);
});

test("the plan line names the plan, its period and the date", () => {
  const polar = { plan: "pro", period: "yearly", renewsAt: "2026-12-17T08:00:00Z", cancelsAtPeriodEnd: false };
  assert.equal(polarText(polar), "Sketch shaper PRO · yearly · renews 17 Dec 2026");
  assert.equal(polarText({ ...polar, cancelsAtPeriodEnd: true }), "Sketch shaper PRO · yearly · ends 17 Dec 2026");
  assert.equal(polarText({ ...polar, renewsAt: null }), "Sketch shaper PRO · yearly");
  assert.equal(polarText(null), "");
});

test("the badge shows the highest plan from any source; older servers fall back to PRO / ad-free", () => {
  assert.equal(planBadge({ isPro: true, adFree: true, proSource: "polar", plan: "sponsor" }), "SPONSOR");
  assert.equal(planBadge({ isPro: true, adFree: true, proSource: "patreon", plan: "sponsor" }), "SPONSOR");
  assert.equal(planBadge({ isPro: true, adFree: true, proSource: "manual", plan: "pro" }), "PRO");
  assert.equal(planBadge({ isPro: false, adFree: true, proSource: "polar", plan: "early_access" }), "AD-FREE");
  assert.equal(planBadge({ isPro: false, adFree: false, proSource: null, plan: null }), null);
  assert.equal(planBadge({ isPro: false, proSource: "blocked", plan: null }), null);
  assert.equal(planBadge({ isPro: true }), "PRO");
  assert.equal(planBadge({ isPro: false, adFree: true }), "AD-FREE");
  assert.equal(planBadge(null), null);
});

test("a failed Polar payment is a problem to fix; a cancelled or live plan is not", () => {
  assert.equal(polarProblem({ polar: { status: "past_due" } }), true);
  assert.equal(polarProblem({ polar: { status: "unpaid" } }), true);
  assert.equal(polarProblem({ polar: { status: "active" } }), false);
  assert.equal(polarProblem({ polar: { status: "canceled" } }), false);
  assert.equal(polarProblem({ polar: null }), false);
});

test("writes a day as 20 Nov 2027, or nothing", () => {
  assert.equal(dayText("2027-11-20T23:59:59.000Z"), "20 Nov 2027");
  assert.equal(dayText(null), "");
  assert.equal(dayText("nonsense"), "");
});

test("the status chip follows blocked, payment problem, cancelled, active", () => {
  assert.deepEqual(accountStatus({ proSource: "blocked", plan: "pro" }), { label: "Paused", tone: "danger" });
  assert.deepEqual(accountStatus({ plan: "pro", polar: { status: "past_due" } }), { label: "Payment problem", tone: "danger" });
  assert.deepEqual(accountStatus({ plan: "pro", polar: { status: "active", cancelsAtPeriodEnd: true } }), { label: "Cancelled", tone: "warn" });
  assert.deepEqual(accountStatus({ plan: "pro", polar: { status: "active", cancelsAtPeriodEnd: false } }), { label: "Active", tone: "ok" });
  assert.deepEqual(accountStatus({ plan: "early_access", proSource: "patreon" }), { label: "Active", tone: "ok" });
  assert.equal(accountStatus({ plan: null }), null);
  assert.equal(accountStatus(null), null);
});

test("the account facts depend on where the plan comes from", () => {
  const polar = { status: "active", plan: "pro", period: "yearly", renewsAt: "2027-11-20T08:00:00Z", cancelsAtPeriodEnd: false };
  assert.deepEqual(membershipFacts({ plan: "pro", proSource: "polar", polar }), [
    { label: "Billing", value: "Yearly" },
    { label: "Renews on", value: "20 Nov 2027" },
    { label: "Paid via", value: "Card (Polar)" },
  ]);
  assert.equal(membershipFacts({ plan: "pro", polar: { ...polar, cancelsAtPeriodEnd: true } })[1].label, "Access until");
  assert.deepEqual(membershipFacts({ proSource: "manual", proUntil: "2027-11-20T00:00:00Z" }), [
    { label: "Access until", value: "20 Nov 2027" },
    { label: "Granted by", value: "Sketch shaper team" },
  ]);
  assert.equal(membershipFacts({ proSource: "manual", proUntil: null })[0].value, "No end date");
  assert.deepEqual(membershipFacts({ proSource: "patreon", membershipTier: "Pro" }), [
    { label: "Paid via", value: "Patreon" },
    { label: "Tier", value: "Pro" },
  ]);
  assert.deepEqual(membershipFacts({ proSource: "patreon", membershipTier: "" }), [{ label: "Paid via", value: "Patreon" }]);
  assert.deepEqual(membershipFacts({ polar: { status: "past_due", period: "monthly" } }), [
    { label: "Billing", value: "Monthly" },
    { label: "Paid via", value: "Card (Polar)" },
  ]);
  assert.deepEqual(membershipFacts({ isPro: false, proSource: null, plan: null }), []);
  assert.deepEqual(membershipFacts(null), []);
});

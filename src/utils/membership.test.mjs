import test from "node:test";
import assert from "node:assert/strict";
import { hasLivePolar, isAdFree, membershipKind, polarText, proUntilText } from "./membership.js";

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

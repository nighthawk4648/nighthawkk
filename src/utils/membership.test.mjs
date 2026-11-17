import test from "node:test";
import assert from "node:assert/strict";
import { membershipKind, proUntilText } from "./membership.js";

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

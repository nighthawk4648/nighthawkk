import test from "node:test";
import assert from "node:assert/strict";
import { PLANS, planName, yearlyPrice, yearlyFullPrice } from "./pricing.js";

test("yearly bills 10 months for 12", () => {
  assert.equal(yearlyFullPrice(3), 36);
  assert.equal(yearlyPrice(3), 30);
  assert.deepEqual(PLANS.map((p) => [p.monthly, yearlyPrice(p.monthly)]), [[3, 30], [5, 50], [30, 300]]);
});

test("exactly one plan is most popular in each billing period", () => {
  for (const period of ["monthly", "yearly"]) {
    assert.equal(PLANS.filter((p) => p.popular === period).length, 1);
  }
});

test("plan ids are the names the server knows", () => {
  assert.deepEqual(PLANS.map((p) => p.id), ["early_access", "pro", "sponsor"]);
  assert.equal(planName("pro"), "Sketch shaper PRO");
});

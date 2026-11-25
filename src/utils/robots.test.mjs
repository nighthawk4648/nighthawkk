import test from "node:test";
import assert from "node:assert/strict";
import robots from "../app/robots.js";
import { AI_BOTS } from "./aiBots.js";

test("robots has an AI crawler group that allows the site with the same disallow list as *", () => {
  const { rules, sitemap } = robots();
  const ai = rules.find((r) => Array.isArray(r.userAgent));
  const all = rules.find((r) => r.userAgent === "*");

  assert.ok(ai);
  assert.ok(all);
  assert.equal(rules[0], ai);
  assert.ok(ai.userAgent.includes("GPTBot"));
  assert.ok(ai.userAgent.includes("ClaudeBot"));
  assert.deepEqual(ai.userAgent, AI_BOTS);
  assert.equal(ai.allow, "/");
  assert.deepEqual(ai.disallow, all.disallow);
  assert.equal(sitemap, "https://www.sketchshaper.com/sitemap.xml");
});

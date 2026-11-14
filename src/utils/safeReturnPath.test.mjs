import test from "node:test";
import assert from "node:assert/strict";
import { safeReturnPath } from "./safeReturnPath.js";

test("keeps same-site paths", () => {
  assert.equal(safeReturnPath("/"), "/");
  assert.equal(safeReturnPath("/blog/a-1?x=1#top"), "/blog/a-1?x=1#top");
});

test("rejects anything that could leave the site", () => {
  for (const bad of [
    "//evil.com",
    "/\\evil.com",
    "/\t/evil.com",
    "https://evil.com",
    "javascript:alert(1)",
    "evil.com",
    "",
    null,
    undefined,
    42,
  ]) {
    assert.equal(safeReturnPath(bad), "/", String(bad));
  }
});

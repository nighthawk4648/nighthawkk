import test from "node:test";
import assert from "node:assert/strict";
import { cleanConnectCode, forgetConnect, recallConnectPath, rememberConnect } from "./extensionConnect.js";

const memory = () => {
  const items = new Map();
  return { getItem: (k) => items.get(k) ?? null, setItem: (k, v) => items.set(k, v), removeItem: (k) => items.delete(k) };
};

test("accepts only a 6-character SketchUp code", () => {
  assert.equal(cleanConnectCode(" a1b2c3 "), "A1B2C3");
  for (const bad of ["", null, undefined, "A1B2C", "A1B2C3D", "GGGGGG", "A1B2C3&x=1"]) assert.equal(cleanConnectCode(bad), "");
});

test("remembers the page to return to after confirming an email, for a limited time", () => {
  const storage = memory();
  rememberConnect("A1B2C3", storage);
  assert.equal(recallConnectPath(storage), "/extension/connect?code=A1B2C3");
  assert.equal(recallConnectPath(storage, Date.now() + 11 * 60 * 1000), null, "too old");
  forgetConnect(storage);
  assert.equal(recallConnectPath(storage), null);
});

test("blocked or damaged storage is harmless, and a damaged code never builds a link", () => {
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } };
  assert.doesNotThrow(() => rememberConnect("A1B2C3", blocked));
  assert.doesNotThrow(() => forgetConnect(blocked));
  assert.equal(recallConnectPath(blocked), null);
  const damaged = memory();
  damaged.setItem("ss_extension_connect", JSON.stringify({ code: "//evil.example", at: Date.now() }));
  assert.equal(recallConnectPath(damaged), null);
});

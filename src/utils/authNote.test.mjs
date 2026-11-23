import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { AUTH_NOTE_SCRIPT, authNoteFor, rememberAuth } from "./authNote.js";

const memory = () => {
  const items = new Map();
  return { getItem: (k) => items.get(k) ?? null, setItem: (k, v) => items.set(k, v), removeItem: (k) => items.delete(k) };
};

test("the note says pro, in or nothing", () => {
  assert.equal(authNoteFor({ isPro: true }), "pro");
  assert.equal(authNoteFor({ isPro: false }), "in");
  assert.equal(authNoteFor({ isPro: false, adFree: true }), "pro", "an ad-free tier also hides ads early");
  assert.equal(authNoteFor({}), "in");
  assert.equal(authNoteFor(null), null);
});

test("signing in saves the note and sets the page attribute; signing out clears both", () => {
  const storage = memory(), root = { dataset: {} };
  rememberAuth({ isPro: true }, storage, root);
  assert.equal(storage.getItem("ss_auth"), "pro");
  assert.equal(root.dataset.auth, "pro");
  rememberAuth(null, storage, root);
  assert.equal(storage.getItem("ss_auth"), null);
  assert.equal(root.dataset.auth, undefined);
});

test("blocked storage never throws", () => {
  const broken = { setItem() { throw new Error("denied"); }, removeItem() { throw new Error("denied"); } };
  assert.doesNotThrow(() => rememberAuth({ isPro: true }, broken, { dataset: {} }));
});

test("the head script applies a saved note and ignores anything else", () => {
  const run = (saved, throws = false) => {
    const root = { dataset: {} };
    const localStorage = { getItem: () => { if (throws) throw new Error("denied"); return saved; } };
    vm.runInNewContext(AUTH_NOTE_SCRIPT, { localStorage, document: { documentElement: root } });
    return root.dataset.auth;
  };
  assert.equal(run("pro"), "pro");
  assert.equal(run("in"), "in");
  assert.equal(run(null), undefined);
  assert.equal(run("<script>"), undefined);
  assert.equal(run("pro", true), undefined);
});

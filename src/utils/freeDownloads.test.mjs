import test from "node:test";
import assert from "node:assert/strict";
import { canDownloadFree, countFreeDownload, freeDownloadsUsed } from "./freeDownloads.js";

const fakeStorage = (initial = {}) => {
  const data = { ...initial };
  return { getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); } };
};

test("a fresh visitor can download, after one counted download they cannot", () => {
  const storage = fakeStorage();
  assert.equal(canDownloadFree(storage), true);
  countFreeDownload(storage);
  assert.equal(freeDownloadsUsed(storage), 1);
  assert.equal(canDownloadFree(storage), false);
});

test("a garbage stored value counts as zero", () => {
  for (const bad of ["abc", "-3", ""]) {
    const storage = fakeStorage({ ss_free_downloads: bad });
    assert.equal(freeDownloadsUsed(storage), 0);
    assert.equal(canDownloadFree(storage), true);
  }
});

test("storage that throws or is missing never blocks and never throws", () => {
  const broken = { getItem() { throw new Error("denied"); }, setItem() { throw new Error("denied"); } };
  for (const storage of [broken, null]) {
    assert.equal(canDownloadFree(storage), true);
    assert.doesNotThrow(() => countFreeDownload(storage));
  }
});

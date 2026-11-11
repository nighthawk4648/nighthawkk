import test from "node:test";
import assert from "node:assert/strict";
import { tagsFor, ttlFor, TTL } from "./cacheConfig.js";

test("item paths get a per-item tag", () => {
  assert.deepEqual(tagsFor("assets/15"), ["assets", "asset-15"]);
  assert.deepEqual(tagsFor("categories/2"), ["categories", "category-2"]);
  assert.deepEqual(tagsFor("sub-categories/7"), ["sub-categories", "subcategory-7"]);
  assert.deepEqual(tagsFor("blogs/3"), ["blogs", "blog-3"]);
});

test("list and special paths get only the resource tag", () => {
  assert.deepEqual(tagsFor("assets/pages?page=1&limit=18"), ["assets"]);
  assert.deepEqual(tagsFor("assets/sitemap"), ["assets"]);
  assert.deepEqual(tagsFor("categories/nav"), ["categories", "nav"]);
  assert.deepEqual(tagsFor("general/application-settings"), ["general"]);
  assert.deepEqual(tagsFor("sliders"), ["sliders"]);
});

test("rarely-changing data is cached longer", () => {
  assert.equal(ttlFor("categories/nav"), TTL.long);
  assert.equal(ttlFor("general/about-us"), TTL.long);
  assert.equal(ttlFor("pages"), TTL.long);
  assert.equal(ttlFor("assets/15"), TTL.short);
  assert.equal(ttlFor("blogs?x=1"), TTL.short);
});

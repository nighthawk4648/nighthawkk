import test from "node:test";
import assert from "node:assert/strict";
import { categoryPath, subCategoryPath, blogPath } from "./paths.js";

test("uses the slug when there is one, else slugifies the name", () => {
  assert.equal(categoryPath({ id: 3, slug: "models", name: "X" }), "/models-3");
  assert.equal(categoryPath({ id: 3, slug: null, name: "Sketchup 3D models" }), "/sketchup-3d-models-3");
  assert.equal(
    subCategoryPath({ id: 3, slug: null, name: "Sketchup 3D models" }, { id: 24, slug: null, name: "Chairs" }),
    "/sketchup-3d-models-3/chairs-24",
  );
  assert.equal(blogPath({ id: 9, slug: null, title: "Hello World" }), "/blog/hello-world-9");
});

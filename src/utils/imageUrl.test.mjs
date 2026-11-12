import test from "node:test";
import assert from "node:assert/strict";
import { optimizedImageUrl } from "./imageUrl.js";

test("optimizedImageUrl builds the built-in optimizer URL", () => {
  assert.equal(
    optimizedImageUrl("https://api.sketchshaper.com/api/uploads/a b.png", 1200),
    "/_next/image?url=https%3A%2F%2Fapi.sketchshaper.com%2Fapi%2Fuploads%2Fa%20b.png&w=1200&q=75",
  );
  assert.equal(optimizedImageUrl("", 640), "");
});

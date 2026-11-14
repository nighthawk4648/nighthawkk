import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeHtml } from "./sanitizeHtml.js";

test("escaped markup stays text instead of becoming tags", () => {
  assert.equal(
    sanitizeHtml("<p>use &lt;script&gt;alert(1)&lt;/script&gt;</p>"),
    "<p>use &lt;script&gt;alert(1)&lt;/script&gt;</p>",
  );
});

test("real scripts, handlers and javascript: urls are removed", () => {
  assert.equal(sanitizeHtml('<p>a</p><script>alert(1)</script>'), "<p>a</p>");
  assert.equal(sanitizeHtml('<img src="/x.png" onerror="alert(1)">'), '<img src="/x.png">');
  assert.equal(sanitizeHtml('<a href="javascript:alert(1)">x</a>'), "<a>x</a>");
});

test("plain entities are left for the browser to render", () => {
  assert.equal(sanitizeHtml("<p>Extensions &gt; Manager &amp; more</p>"), "<p>Extensions &gt; Manager &amp; more</p>");
});

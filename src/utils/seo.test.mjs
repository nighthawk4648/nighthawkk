import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCanonicalUrl,
  buildPageMetadata,
  cleanText,
  getOgImageUrl,
} from "./seo.js";

test("cleanText removes markup, decodes entities, and truncates at word boundaries", () => {
  assert.equal(cleanText(" <p>Hi &amp; &#x1F600; &#169;</p> there "), "Hi & 😀 © there");
  assert.equal(cleanText("<b>one two three</b>", 7), "one...");
  assert.equal(cleanText("  <p> </p> "), "");
  assert.equal(cleanText(null), "");
});

test("buildCanonicalUrl allows only a valid page number", () => {
  assert.equal(
    buildCanonicalUrl(
      "/models/",
      { page: "2", search: "chair", utm_source: "newsletter" },
      { preservePage: true },
    ),
    "https://www.sketchshaper.com/models?page=2",
  );
  assert.equal(
    buildCanonicalUrl("/models", { page: "1" }, { preservePage: true }),
    "https://www.sketchshaper.com/models",
  );
  assert.equal(
    buildCanonicalUrl("/models", { page: "2", sort: "lowpoly" }, { preservePage: false }),
    "https://www.sketchshaper.com/models",
  );
  assert.equal(
    buildCanonicalUrl("/models", { page: ["2", "3"] }, { preservePage: true }),
    "https://www.sketchshaper.com/models",
  );
  assert.equal(
    buildCanonicalUrl("/\\\\evil.example"),
    "https://www.sketchshaper.com/",
  );
});

test("getOgImageUrl falls back for missing or invalid values", () => {
  const fallback = "https://www.sketchshaper.com/assets/seo/social-card.png";
  assert.equal(getOgImageUrl(""), fallback);
  assert.equal(getOgImageUrl("http://[invalid"), fallback);
});

test("getOgImageUrl creates a 1200 by 630 Cloudinary crop", () => {
  const originalCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "example-cloud";

  try {
    assert.equal(
      getOgImageUrl(
        "https://res.cloudinary.com/example-cloud/image/upload/v123/photo.jpg",
      ),
      "https://res.cloudinary.com/example-cloud/image/upload/c_fill,w_1200,h_630,f_auto,q_auto/v123/photo.jpg",
    );
    assert.match(
      getOgImageUrl("https://cdn.example.com/photo.jpg"),
      /image\/fetch\/c_fill,w_1200,h_630,f_auto,q_auto\//,
    );
  } finally {
    if (originalCloudName === undefined) {
      delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    } else {
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = originalCloudName;
    }
  }
});

test("buildPageMetadata applies title branding, canonicals, and robots rules", () => {
  const metadata = buildPageMetadata({
    title: "Filtered catalog | SketchShaper",
    description: "Filtered results",
    pathname: "/models",
    noIndex: true,
  });

  assert.equal(metadata.title, "Filtered catalog");
  assert.equal(metadata.alternates.canonical, "https://www.sketchshaper.com/models");
  assert.deepEqual(
    { index: metadata.robots.index, follow: metadata.robots.follow },
    { index: false, follow: true },
  );
  assert.equal(metadata.openGraph.images[0].width, 1200);
  assert.equal(metadata.openGraph.images[0].height, 630);
});

test("buildPageMetadata retains article-specific social metadata", () => {
  const metadata = buildPageMetadata({
    title: "Article",
    description: "Summary",
    pathname: "/blog/article-42",
    type: "article",
    publishedTime: "2026-01-01",
    modifiedTime: "2026-02-01",
    authors: ["Example Author"],
  });

  assert.equal(metadata.openGraph.type, "article");
  assert.equal(metadata.openGraph.publishedTime, "2026-01-01");
  assert.equal(metadata.openGraph.modifiedTime, "2026-02-01");
  assert.deepEqual(metadata.openGraph.authors, ["Example Author"]);
  assert.equal(metadata.twitter.card, "summary_large_image");
});

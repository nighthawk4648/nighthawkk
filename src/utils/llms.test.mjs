import test from "node:test";
import assert from "node:assert/strict";
import { buildLlmsTxt, unitFor } from "./llms.js";
import { PLANS } from "./pricing.js";

const site = "https://www.sketchshaper.com";

const categories = [
  {
    id: 1,
    name: "Furniture",
    slug: "furniture",
    sub_categories: [
      { id: 5, name: "Chairs", slug: "chairs", _count: { assets: 30 } },
      { id: 6, name: "Tables", slug: "tables", _count: { assets: 12 } },
    ],
  },
  { id: 2, name: "Plants", slug: "plants", sub_categories: [{ id: 7, name: "Trees", slug: "trees" }] },
];

test("buildLlmsTxt lists categories with links, counts and nested subcategories", () => {
  const out = buildLlmsTxt({ description: "My library", categories, plans: PLANS, blogs: [], site });

  assert.ok(out.startsWith("# Sketch shaper\n\n> My library\n"));
  assert.ok(out.includes("## Library"));
  assert.ok(out.includes(`- [Furniture](${site}/furniture-1): 42 assets`));
  assert.ok(out.includes(`  - [Chairs](${site}/furniture-1/chairs-5): 30 assets`));
  // No count data: the count is left out
  assert.ok(out.includes(`- [Plants](${site}/plants-2)\n`));
  assert.ok(out.includes(`  - [Trees](${site}/plants-2/trees-7)\n`));
});

test("counts are named after what the category holds: textures, plugins, models, otherwise assets", () => {
  assert.equal(unitFor("Textures"), "textures");
  assert.equal(unitFor("Sketchup plugins"), "plugins");
  assert.equal(unitFor("SketchUp Extensions"), "plugins");
  assert.equal(unitFor("Sketchup 3D models"), "models");
  assert.equal(unitFor("HDRI"), "assets");
  assert.equal(unitFor(undefined), "assets");

  const out = buildLlmsTxt({
    site,
    categories: [
      { id: 4, name: "Textures", slug: "textures", sub_categories: [{ id: 12, name: "Marble", slug: "marble", _count: { assets: 5 } }] },
      { id: 5, name: "Sketchup plugins", slug: "sketchup-plugins", sub_categories: [{ id: 35, name: "Free", slug: "free", _count: { assets: 8 } }] },
    ],
  });
  assert.ok(out.includes(`- [Textures](${site}/textures-4): 5 textures`));
  assert.ok(out.includes(`  - [Marble](${site}/textures-4/marble-12): 5 textures`), "subcategories use their category's word");
  assert.ok(out.includes(`- [Sketchup plugins](${site}/sketchup-plugins-5): 8 plugins`));
});

test("buildLlmsTxt lists key pages and plan prices", () => {
  const out = buildLlmsTxt({ plans: PLANS, site });

  for (const path of ["/extension", "/pricing", "/license", "/about-us", "/contact", "/blog"]) {
    assert.ok(out.includes(`(${site}${path})`), path);
  }
  assert.ok(out.includes("Sketch shaper PRO: $5/month or $50/year"));
  assert.ok(out.includes("Early Access: $3/month or $30/year"));
});

test("buildLlmsTxt lists at most 10 articles", () => {
  const blogs = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, title: `Post ${i + 1}`, slug: `post-${i + 1}` }));
  const out = buildLlmsTxt({ blogs, site });

  assert.ok(out.includes(`- [Post 1](${site}/blog/post-1-1)`));
  assert.ok(out.includes(`- [Post 10](${site}/blog/post-10-10)`));
  assert.ok(!out.includes("Post 11"));
});

test("buildLlmsTxt works with empty inputs and falls back to the default description", () => {
  const out = buildLlmsTxt({ site });

  assert.ok(out.includes("> Free and pro 3D models, textures, and plugins for SketchUp."));
  assert.ok(out.includes("## Latest articles"));
  assert.ok(out.endsWith("\n"));
});

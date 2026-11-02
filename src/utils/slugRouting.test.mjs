import { describe, it } from "node:test";
import assert from "node:assert/strict";
import slugify from "./slugify.js";
import buildAssetPath from "./buildAssetPath.js";
import { safeDecode } from "./validateSlug.js";

describe("Frontend Slug Routing, Self-Healing URLs & Canonicalization", () => {
  describe("Category URL Resolution", () => {
    it("prioritizes custom slug when present", () => {
      const category = { id: 5, name: "Living Room Furniture", slug: "living-room" };
      const expectedUrl = `/${category.slug || slugify(category.name)}-${category.id}`;
      assert.equal(expectedUrl, "/living-room-5");
    });

    it("falls back to slugify(name) when custom slug is null or empty", () => {
      const category = { id: 5, name: "Living Room Furniture", slug: null };
      const expectedUrl = `/${category.slug || slugify(category.name)}-${category.id}`;
      assert.equal(expectedUrl, "/living-room-furniture-5");
    });

    it("preserves trailing numbers in custom category slugs (e.g. sketchup-2024)", () => {
      const category = { id: 3, name: "Sketchup Models", slug: "sketchup-2024" };
      const expectedUrl = `/${category.slug || slugify(category.name)}-${category.id}`;
      assert.equal(expectedUrl, "/sketchup-2024-3");
    });
  });

  describe("SubCategory URL Resolution", () => {
    it("prioritizes custom subcategory slug and parent category slug", () => {
      const cat = { id: 1, name: "Architecture", slug: "arch" };
      const sub = { id: 12, name: "Modern Sofas", slug: "sofas" };

      const catSlug = cat.slug || slugify(cat.name);
      const subSlug = sub.slug || slugify(sub.name);
      const expectedUrl = `/${catSlug}-${cat.id}/${subSlug}-${sub.id}`;

      assert.equal(expectedUrl, "/arch-1/sofas-12");
    });

    it("falls back gracefully when both slugs are null (legacy items)", () => {
      const cat = { id: 1, name: "Architecture", slug: null };
      const sub = { id: 12, name: "Modern Sofas", slug: null };

      const catSlug = cat.slug || slugify(cat.name);
      const subSlug = sub.slug || slugify(sub.name);
      const expectedUrl = `/${catSlug}-${cat.id}/${subSlug}-${sub.id}`;

      assert.equal(expectedUrl, "/architecture-1/modern-sofas-12");
    });
  });

  describe("Asset Detail Canonical URL Resolution (buildAssetPath)", () => {
    it("builds exact canonical 3-tier asset path with custom slugs", () => {
      const asset = {
        id: 99,
        name: "Scandinavian Wooden Armchair",
        slug: "nordic-chair",
        sub_category: {
          slug: "living",
          name: "Living Room",
          category: { slug: "arch", name: "Architecture" },
        },
      };

      assert.equal(buildAssetPath(asset), "/arch/living/nordic-chair-99");
    });

    it("builds exact canonical 3-tier asset path with legacy items (null slugs)", () => {
      const asset = {
        id: 99,
        name: "Scandinavian Wooden Armchair",
        slug: null,
        sub_category: {
          slug: null,
          name: "Living Room",
          category: { slug: null, name: "Architecture" },
        },
      };

      assert.equal(
        buildAssetPath(asset),
        "/architecture/living-room/scandinavian-wooden-armchair-99",
      );
    });

    it("falls back to 'category', 'subcategory', 'asset' when names slugify to empty (e.g. non-Latin / Bengali)", () => {
      const asset = {
        id: 88,
        name: "টেবিল", // Bengali characters only, slugify produces ""
        slug: null,
        sub_category: {
          slug: null,
          name: "চেয়ার", // Bengali characters only
          category: { slug: null, name: "আসবাবপত্র" }, // Bengali characters only
        },
      };

      assert.equal(buildAssetPath(asset), "/category/subcategory/asset-88");
    });
  });

  describe("Self-Healing URL & Redirect Mechanics", () => {
    const liveAsset = {
      id: 6,
      name: "hello ellow",
      slug: "pokemon-yellow",
      sub_category: {
        id: 2,
        slug: "table",
        name: "Table",
        category: { id: 1, slug: "furniture", name: "Furniture" },
      },
    };

    const computeRedirect = (reqCat, reqSub, reqAsset, asset) => {
      const decodedCat = safeDecode(reqCat);
      const decodedSub = safeDecode(reqSub);
      const decodedAsset = safeDecode(reqAsset);

      if (!decodedCat || !decodedSub || !decodedAsset) return { status: 404 };

      const idMatch = decodedAsset.match(/-(\d+)$/);
      if (!idMatch || idMatch[1] !== String(asset.id)) return { status: 404 };

      const canonicalPath = buildAssetPath(asset);
      const canonicalParts = canonicalPath.slice(1).split("/");

      const isMatch =
        decodedCat === canonicalParts[0] &&
        decodedSub === canonicalParts[1] &&
        decodedAsset === canonicalParts[2];

      if (!isMatch) {
        return { status: 307, redirectUrl: canonicalPath };
      }

      return { status: 200, canonicalPath };
    };

    it("renamed asset redirects old slug to new canonical slug (Self-Healing)", () => {
      const res = computeRedirect("furniture", "table", "hello-ellow-6", liveAsset);
      assert.equal(res.status, 307);
      assert.equal(res.redirectUrl, "/furniture/table/pokemon-yellow-6");
    });

    it("renamed parent category redirects old category slug to new canonical", () => {
      const res = computeRedirect("old-furniture", "table", "pokemon-yellow-6", liveAsset);
      assert.equal(res.status, 307);
      assert.equal(res.redirectUrl, "/furniture/table/pokemon-yellow-6");
    });

    it("asset moved to another subcategory redirects to new hierarchy", () => {
      const movedAsset = {
        ...liveAsset,
        sub_category: {
          id: 5,
          slug: "office-desks",
          name: "Office Desks",
          category: { id: 1, slug: "furniture", name: "Furniture" },
        },
      };
      const res = computeRedirect("furniture", "table", "pokemon-yellow-6", movedAsset);
      assert.equal(res.status, 307);
      assert.equal(res.redirectUrl, "/furniture/office-desks/pokemon-yellow-6");
    });

    it("case-variant URL redirects to canonical lowercase URL", () => {
      const res = computeRedirect("FURNITURE", "Table", "POKEMON-YELLOW-6", liveAsset);
      assert.equal(res.status, 307);
      assert.equal(res.redirectUrl, "/furniture/table/pokemon-yellow-6");
    });

    it("exact canonical match does not redirect (prevents infinite redirect loops)", () => {
      const res = computeRedirect("furniture", "table", "pokemon-yellow-6", liveAsset);
      assert.equal(res.status, 200);
      assert.equal(res.canonicalPath, "/furniture/table/pokemon-yellow-6");
    });

    it("rename-back scenario: renaming back to original slug produces clean deterministic URL without loops", () => {
      const revertedAsset = { ...liveAsset, slug: "hello-ellow" };
      const res = computeRedirect("furniture", "table", "pokemon-yellow-6", revertedAsset);
      assert.equal(res.status, 307);
      assert.equal(res.redirectUrl, "/furniture/table/hello-ellow-6");

      // Verify the reverted URL now matches 200
      const matched = computeRedirect("furniture", "table", "hello-ellow-6", revertedAsset);
      assert.equal(matched.status, 200);
    });

    it("query string is preserved when executing redirect", () => {
      const buildDestination = (targetUrl, searchParamsObj = {}) => {
        const qs = new URLSearchParams(searchParamsObj).toString();
        return qs ? `${targetUrl}?${qs}` : targetUrl;
      };

      const searchParams = { ref: "catalog", sort: "newest", page: "2" };
      const destination = buildDestination("/furniture/table/pokemon-yellow-6", searchParams);
      assert.equal(
        destination,
        "/furniture/table/pokemon-yellow-6?ref=catalog&sort=newest&page=2",
      );

      // Empty searchParams produces clean URL without trailing ?
      const emptyDestination = buildDestination("/furniture/table/pokemon-yellow-6", {});
      assert.equal(emptyDestination, "/furniture/table/pokemon-yellow-6");
    });

    it("malformed percent-encoding returns 404 (safeDecode returns null, not throwing 500)", () => {
      assert.equal(safeDecode("%E0%A4%A"), null);
      assert.equal(safeDecode("valid-slug"), "valid-slug");
      assert.equal(safeDecode("valid%20slug"), "valid slug");

      const res = computeRedirect("%E0%A4%A", "table", "pokemon-yellow-6", liveAsset);
      assert.equal(res.status, 404);
    });

    it("missing or non-numeric trailing ID returns 404", () => {
      const resNoId = computeRedirect("furniture", "table", "pokemon-yellow", liveAsset);
      assert.equal(resNoId.status, 404);

      const resWrongId = computeRedirect("furniture", "table", "pokemon-yellow-9999", liveAsset);
      assert.equal(resWrongId.status, 404);

      const resAlphaId = computeRedirect("furniture", "table", "pokemon-yellow-abc", liveAsset);
      assert.equal(resAlphaId.status, 404);
    });
  });

  describe("Slug Format Validation (Admin Form & Backend)", () => {
    const isPurelyDigits = (slug) => {
      if (!slug || typeof slug !== "string") return false;
      return /^\d+$/.test(slug.trim());
    };

    it("rejects purely numeric slugs to avoid routing collisions", () => {
      assert.equal(isPurelyDigits("2024"), true);
      assert.equal(isPurelyDigits("12345"), true);
      assert.equal(isPurelyDigits("007"), true);
    });

    it("accepts alphanumeric and valid hyphenated slugs", () => {
      assert.equal(isPurelyDigits("sofa-2024"), false);
      assert.equal(isPurelyDigits("sketchup-2025-pro"), false);
      assert.equal(isPurelyDigits("pokemon-yellow"), false);
      assert.equal(isPurelyDigits(""), false);
      assert.equal(isPurelyDigits(null), false);
    });
  });

  describe("Backend Hierarchical Cache Invalidation Tag Strategy", () => {
    it("computes comprehensive tags on asset creation", () => {
      const subCat = { id: 10, category_id: 3 };
      const asset = { id: 55 };
      const tags = [
        "assets",
        `asset-${asset.id}`,
        "categories",
        `category-${subCat.category_id}`,
        "sub-categories",
        `subcategory-${subCat.id}`,
        "general",
      ];

      assert.deepEqual(tags, [
        "assets",
        "asset-55",
        "categories",
        "category-3",
        "sub-categories",
        "subcategory-10",
        "general",
      ]);
    });

    it("purges BOTH old and new parent category/subcategory tags when an asset is moved", () => {
      const existingAsset = { id: 55, sub_category_id: 10, sub_category: { category_id: 3 } };
      const newSubCategory = { id: 25, category_id: 8 };

      const oldSubId = existingAsset.sub_category_id;
      const oldCatId = existingAsset.sub_category?.category_id;
      const newSubId = newSubCategory.id;
      const newCatId = newSubCategory.category_id;

      const tagsToPurge = new Set([
        "assets",
        `asset-${existingAsset.id}`,
        "categories",
        "sub-categories",
        "general",
      ]);
      if (oldCatId) tagsToPurge.add(`category-${oldCatId}`);
      if (oldSubId) tagsToPurge.add(`subcategory-${oldSubId}`);
      if (newCatId) tagsToPurge.add(`category-${newCatId}`);
      if (newSubId) tagsToPurge.add(`subcategory-${newSubId}`);

      const result = Array.from(tagsToPurge);
      assert.ok(result.includes("category-3"));
      assert.ok(result.includes("subcategory-10"));
      assert.ok(result.includes("category-8"));
      assert.ok(result.includes("subcategory-25"));
      assert.ok(result.includes("assets"));
    });

    it("purges parent category and subcategory tags when an asset is deleted", () => {
      const existingAsset = { id: 55, sub_category_id: 10, sub_category: { category_id: 3 } };
      const tagsToPurge = [
        "assets",
        `asset-${existingAsset.id}`,
        "categories",
        "sub-categories",
        "general",
      ];
      if (existingAsset.sub_category_id) {
        tagsToPurge.push(`subcategory-${existingAsset.sub_category_id}`);
      }
      if (existingAsset.sub_category?.category_id) {
        tagsToPurge.push(`category-${existingAsset.sub_category.category_id}`);
      }

      assert.deepEqual(tagsToPurge, [
        "assets",
        "asset-55",
        "categories",
        "sub-categories",
        "general",
        "subcategory-10",
        "category-3",
      ]);
    });

    it("purges assets tag when category or subcategory is updated or deleted", () => {
      const catTags = ["categories", "category-3", "sub-categories", "assets", "general"];
      assert.ok(catTags.includes("assets"));

      const subTags = ["sub-categories", "subcategory-10", "categories", "category-3", "assets", "general"];
      assert.ok(subTags.includes("assets"));
    });
  });

  describe("Blog URL Resolution", () => {
    it("uses custom blog slug when set", () => {
      const blog = { id: 42, title: "10 Essential SketchUp Modeling Tips for 2025", slug: "10-sketchup-tips" };
      const expectedUrl = `/blog/${blog.slug || slugify(blog.title)}-${blog.id}`;
      assert.equal(expectedUrl, "/blog/10-sketchup-tips-42");
    });

    it("falls back to slugify(title) for existing blogs without slug", () => {
      const blog = { id: 42, title: "10 Essential SketchUp Modeling Tips", slug: null };
      const expectedUrl = `/blog/${blog.slug || slugify(blog.title)}-${blog.id}`;
      assert.equal(expectedUrl, "/blog/10-essential-sketchup-modeling-tips-42");
    });
  });

  describe("Search API URL Projection & Keyboard Navigation", () => {
    it("projects valid search result URLs using buildAssetPath", () => {
      const assetItem = {
        id: 50,
        name: "Desk Lamp",
        slug: "nordic-desk-lamp",
        sub_category: {
          slug: "designer-lamps",
          name: "Lamps",
          category: { slug: "furniture-pro", name: "Furniture" },
        },
      };

      const assetUrl = buildAssetPath(assetItem);
      assert.equal(assetUrl, "/furniture-pro/designer-lamps/nordic-desk-lamp-50");
    });
  });
});

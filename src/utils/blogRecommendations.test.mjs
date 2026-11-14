import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getBlogRecommendations } from "./blogRecommendations.js";

describe("Blog Recommendations Engine", () => {
  const sampleBlogs = [
    {
      id: 103,
      title: "Mastering V-Ray Lighting for Interior Archviz",
      keywords: "vray, lighting, render, archviz",
    },
    {
      id: 102,
      title: "PBR Material Creation Workflow in SketchUp",
      keywords: "textures, pbr, materials, archviz",
    },
    {
      id: 101,
      title: "Beginner Guide to SketchUp 2026 Modeling",
      keywords: "sketchup, tutorial, modeling",
    },
    {
      id: 100,
      title: "Advanced Lighting and Render Post-Processing",
      keywords: "vray, lighting, photoshop",
    },
    {
      id: 99,
      title: "Architectural Asset Organization Best Practices",
      keywords: "organization, workflow",
    },
  ];

  it("returns null nextArticle and empty similarArticles for empty or single-item library", () => {
    assert.deepEqual(getBlogRecommendations(null, sampleBlogs), {
      nextArticle: null,
      similarArticles: [],
    });
    assert.deepEqual(getBlogRecommendations(sampleBlogs[0], []), {
      nextArticle: null,
      similarArticles: [],
    });
    assert.deepEqual(getBlogRecommendations(sampleBlogs[0], [sampleBlogs[0]]), {
      nextArticle: null,
      similarArticles: [],
    });
  });

  it("selects the next sequential article in reverse-chronological order", () => {
    const current = sampleBlogs[0]; // id 103
    const { nextArticle } = getBlogRecommendations(current, sampleBlogs);
    assert.equal(nextArticle?.id, 102);
  });

  it("wraps around to the newest article when on the oldest article", () => {
    const oldest = sampleBlogs[sampleBlogs.length - 1]; // id 99
    const { nextArticle } = getBlogRecommendations(oldest, sampleBlogs);
    assert.equal(nextArticle?.id, 103);
  });

  it("never includes the current article or the next article in similar articles", () => {
    const current = sampleBlogs[0]; // id 103, next will be 102
    const { nextArticle, similarArticles } = getBlogRecommendations(
      current,
      sampleBlogs
    );

    assert.equal(nextArticle?.id, 102);
    const similarIds = similarArticles.map((a) => a.id);
    assert.equal(similarIds.includes(103), false, "Current post must not appear in similar");
    assert.equal(similarIds.includes(102), false, "Next article must not appear in similar");
  });

  it("ranks similar articles higher when they share title or keyword tokens", () => {
    // Current is id 103 ("V-Ray Lighting")
    // Candidates excluding current (103) and next (102): id 101, 100, 99.
    // id 100 shares "Lighting" (title) + "vray, lighting" (keywords), so it must be ranked #1
    const current = sampleBlogs[0];
    const { similarArticles } = getBlogRecommendations(current, sampleBlogs);

    assert.ok(similarArticles.length > 0);
    assert.equal(similarArticles[0].id, 100);
  });

  it("applies deterministic tie-breaking (newest first) when no keywords match", () => {
    const postWithNoMatch = {
      id: 999,
      title: "Unique Acoustic Ceiling Panels",
      keywords: "soundproof, acoustics",
    };
    const { nextArticle, similarArticles } = getBlogRecommendations(
      postWithNoMatch,
      sampleBlogs
    );

    // Next wraps to newest (103)
    assert.equal(nextArticle?.id, 103);

    // Remaining candidates (102, 101, 100, 99) have 0 match, so they tie-break by newest id
    assert.equal(similarArticles[0].id, 102);
    assert.equal(similarArticles[1].id, 101);
    assert.equal(similarArticles[2].id, 100);
  });
});

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "this", "that", "your", "how", "what",
  "into", "best", "guide", "tips", "models", "sketchup", "free", "pro", "article"
]);

/**
 * Calculates the sequential "Up Next" article and up to 3 "Similar Articles".
 *
 * Guarantees:
 * 1. "Up Next" article follows reverse chronological order, wrapping circularly
 *    from the oldest to the newest article.
 * 2. "Similar Articles" scores candidate posts by title and keyword token overlaps.
 * 3. Never recommends the current article or duplicates the "Up Next" article in similar.
 * 4. Deterministic tie-breaking: falls back to newest available articles.
 */
export function getBlogRecommendations(currentPost, allBlogs = []) {
  if (
    !currentPost ||
    !currentPost.id ||
    !Array.isArray(allBlogs) ||
    allBlogs.length <= 1
  ) {
    return { nextArticle: null, similarArticles: [] };
  }

  // Consistent reverse chronological sort (newest ID first)
  const sortedBlogs = [...allBlogs].sort((a, b) => (b.id || 0) - (a.id || 0));

  // 1. Next Article (chronological sequence with circular wrap)
  const currentIdx = sortedBlogs.findIndex((b) => b.id === currentPost.id);
  let nextArticle = null;
  if (currentIdx !== -1 && currentIdx + 1 < sortedBlogs.length) {
    nextArticle = sortedBlogs[currentIdx + 1];
  } else if (sortedBlogs[0]?.id !== currentPost.id) {
    // If at the oldest/last article (or currentPost not in list), wrap around to newest
    nextArticle = sortedBlogs[0];
  }

  // 2. Similar Articles (exclude currentPost and nextArticle to prevent duplicates)
  const excludeIds = new Set([currentPost.id, nextArticle?.id].filter(Boolean));
  const candidateBlogs = sortedBlogs.filter((b) => !excludeIds.has(b.id));

  // Extract meaningful tokens from current post
  const rawKeywords =
    typeof currentPost.keywords === "string" ? currentPost.keywords : "";
  const postTokens = new Set(
    `${currentPost.title || ""} ${rawKeywords}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  );

  const scoredBlogs = candidateBlogs.map((b) => {
    let score = 0;
    const titleWords = (b.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    for (const word of titleWords) {
      if (postTokens.has(word)) score += 2;
    }

    if (typeof b.keywords === "string" && b.keywords.trim()) {
      const kwWords = b.keywords.toLowerCase().split(/[,\s]+/);
      for (const kw of kwWords) {
        if (postTokens.has(kw)) score += 1;
      }
    }

    return { blog: b, score };
  });

  // Explicit tie-breaker: sort by score desc, then by id desc (newest first)
  scoredBlogs.sort(
    (a, b) => (b.score - a.score) || ((b.blog.id || 0) - (a.blog.id || 0))
  );

  const similarArticles = scoredBlogs.slice(0, 3).map((item) => item.blog);

  return { nextArticle, similarArticles };
}

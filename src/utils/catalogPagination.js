export const ITEMS_PER_PAGE = 22;

export function parsePageParam(rawPage) {
  if (!rawPage) return 1;
  const num = Number(rawPage);
  if (!Number.isInteger(num) || num < 1) return 1;
  return num;
}

export function resolveActiveFilters(searchParams = {}) {
  const rawSearch = (searchParams?.search || "").trim();
  const rawAccess = searchParams?.access || "all";
  const rawSort = searchParams?.sort || "newest";

  return {
    search: rawSearch,
    access: ["all", "free", "paid"].includes(rawAccess) ? rawAccess : "all",
    sort: ["newest", "popular", "lowpoly", "free_first", "paid_first"].includes(rawSort)
      ? rawSort
      : "newest",
  };
}

export function hasActiveFilters(activeFilters = {}) {
  return Boolean(
    (activeFilters.search && activeFilters.search.trim()) ||
    (activeFilters.access && activeFilters.access !== "all") ||
    (activeFilters.sort && activeFilters.sort !== "newest")
  );
}

export function filterAndSortAssets(
  assets = [],
  { search = "", access = "all", sort = "newest" } = {}
) {
  let result = [...assets];

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (a) =>
        a.name?.toLowerCase().includes(q) ||
        a.sub_category_name?.toLowerCase().includes(q) ||
        a.resolution?.toLowerCase().includes(q)
    );
  }

  // Access tier filter
  if (access === "free") {
    result = result.filter((a) => a.access_type !== "paid");
  } else if (access === "paid") {
    result = result.filter((a) => a.access_type === "paid");
  }

  // Sort filter
  if (sort === "newest") {
    result.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
  } else if (sort === "popular") {
    result.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
  } else if (sort === "free_first") {
    result.sort((a, b) => (a.access_type === "paid" ? 1 : -1));
  } else if (sort === "paid_first") {
    result.sort((a, b) => (a.access_type === "paid" ? -1 : 1));
  } else if (sort === "lowpoly") {
    result.sort((a, b) => (a.resolution || "").localeCompare(b.resolution || ""));
  }

  return result;
}

export function buildCatalogMetadata({
  pathname,
  baseTitle,
  baseDesc,
  keywords,
  page = 1,
  hasFilters = false,
}) {
  const pageSuffix = page > 1 ? ` - Page ${page}` : "";
  const title = `${baseTitle || "3D Models"}${pageSuffix}`;
  const description = `${baseDesc || "Download 3D models for SketchUp."}${pageSuffix}`;

  const canonicalUrl =
    !hasFilters && page > 1
      ? `https://www.sketchshaper.com${pathname}?page=${page}`
      : `https://www.sketchshaper.com${pathname}`;

  return {
    title,
    description,
    keywords: keywords || undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !hasFilters,
      follow: true,
      googleBot: {
        index: !hasFilters,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}


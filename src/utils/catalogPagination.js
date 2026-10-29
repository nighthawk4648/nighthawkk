import { buildPageMetadata } from "@/utils/seo";

export const ITEMS_PER_PAGE = 21;

export function parsePageParam(rawPage) {
  if (typeof rawPage !== "string" || !/^[1-9]\d*$/.test(rawPage)) return 1;
  const num = Number(rawPage);
  if (!Number.isSafeInteger(num)) return 1;
  return num;
}

export function resolveActiveFilters(searchParams = {}) {
  const rawSearch =
    typeof searchParams?.search === "string" ? searchParams.search.trim() : "";
  const rawAccess =
    typeof searchParams?.access === "string" ? searchParams.access : "all";
  const rawSort =
    typeof searchParams?.sort === "string" ? searchParams.sort : "newest";

  return {
    search: rawSearch,
    access: ["all", "free", "paid"].includes(rawAccess) ? rawAccess : "all",
    sort: ["newest", "oldest", "lowpoly", "highpoly"].includes(rawSort)
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

function getAssetByteSize(asset) {
  if (asset?.file?.file_size) return Number(asset.file.file_size) || 0;
  const s = String(asset?.size || "").trim().toLowerCase();
  const match = s.match(/([\d.]+)\s*(gb|mb|kb|b)?/);
  if (!match) return 0;
  const val = parseFloat(match[1]);
  const unit = match[2] || "mb";
  if (unit === "gb") return val * 1024 * 1024 * 1024;
  if (unit === "mb") return val * 1024 * 1024;
  if (unit === "kb") return val * 1024;
  return val;
}

function getPolyScore(asset) {
  const text = `${asset?.resolution || ""} ${asset?.name || ""}`.toLowerCase();
  if (text.includes("lowpoly") || text.includes("low poly") || text.includes("low-poly")) return 1;
  if (text.includes("highpoly") || text.includes("high poly") || text.includes("high-poly")) return 10;
  if (text.includes("1k")) return 2;
  if (text.includes("2k")) return 4;
  if (text.includes("4k")) return 6;
  if (text.includes("8k")) return 8;
  return 5;
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
  } else if (sort === "oldest") {
    result.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
  } else if (sort === "lowpoly") {
    result.sort((a, b) => {
      const scoreDiff = getPolyScore(a) - getPolyScore(b);
      if (scoreDiff !== 0) return scoreDiff;
      const sizeDiff = getAssetByteSize(a) - getAssetByteSize(b);
      if (sizeDiff !== 0) return sizeDiff;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
  } else if (sort === "highpoly") {
    result.sort((a, b) => {
      const scoreDiff = getPolyScore(b) - getPolyScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      const sizeDiff = getAssetByteSize(b) - getAssetByteSize(a);
      if (sizeDiff !== 0) return sizeDiff;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
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

  return {
    ...buildPageMetadata({
      title,
      description,
      pathname,
      searchParams: page > 1 ? { page: String(page) } : undefined,
      preservePage: !hasFilters,
      noIndex: hasFilters,
    }),
    keywords: keywords || undefined,
  };
}

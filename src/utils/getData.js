const deriveTagsFromPath = (path) => {
  if (!path || typeof path !== "string") return ["general"];
  const clean = path.split("?")[0];
  const parts = clean.split("/").filter(Boolean);
  const resource = parts[0] || "general";
  const idOrSub = parts[1];

  const tags = [resource];

  if (resource === "assets" && idOrSub && !isNaN(Number(idOrSub))) {
    tags.push(`asset-${idOrSub}`);
  } else if (resource === "categories" && idOrSub && !isNaN(Number(idOrSub))) {
    tags.push(`category-${idOrSub}`);
  } else if (resource === "sub-categories" && idOrSub && !isNaN(Number(idOrSub))) {
    tags.push(`subcategory-${idOrSub}`);
  } else if (resource === "blogs" && idOrSub) {
    tags.push(`blog-${idOrSub}`);
  }

  return tags;
};

// Structural & slow-changing endpoints cache for 1 hour (3600s), while dynamic assets default to 300s
const getResourceTTL = (path) => {
  if (!path || typeof path !== "string") return 300;
  const clean = path.split("?")[0].toLowerCase();
  if (
    clean === "categories" ||
    clean === "sub-categories" ||
    clean === "social" ||
    clean === "pages" ||
    clean.startsWith("general/") ||
    clean === "supportedby" ||
    clean === "innovative" ||
    clean === "sliders"
  ) {
    return 3600;
  }
  return 300;
};

const getData = async (path, options = {}) => {
  try {
    const defaultTags = deriveTagsFromPath(path);
    const customTags = options.tags || options.next?.tags || [];
    const mergedTags = Array.from(new Set([...defaultTags, ...customTags]));
    const defaultRevalidate = getResourceTTL(path);
    const revalidate =
      options.revalidate ?? options.next?.revalidate ?? defaultRevalidate;

    const timeoutMs = options.timeout ?? 30000;
    const fetchOptions = {
      signal: options.signal || AbortSignal.timeout(timeoutMs),
      ...options,
    };
    delete fetchOptions.timeout;

    if (!options.cache && !options.next) {
      fetchOptions.next = {
        revalidate,
        tags: mergedTags,
      };
    } else if (options.next) {
      fetchOptions.next = {
        ...options.next,
        revalidate: options.next.revalidate ?? revalidate,
        tags: Array.from(new Set([...(options.next.tags || []), ...defaultTags])),
      };
    }

    const baseUrl =
      process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

    const response = await fetch(
      `${baseUrl}/${path}`,
      fetchOptions,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${path}:`, error.message);
    return null;
  }
};

export default getData;

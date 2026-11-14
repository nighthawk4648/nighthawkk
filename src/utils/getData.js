import { tagsFor, ttlFor } from "./cacheConfig.js";

// Returns the parsed JSON, or null when the backend says 404. Any other failure throws.
const getData = async (path, options = {}) => {
  try {
    const defaultTags = tagsFor(path);
    const customTags = options.tags || options.next?.tags || [];
    const mergedTags = Array.from(new Set([...defaultTags, ...customTags]));
    const defaultRevalidate = ttlFor(path);
    const revalidate =
      options.revalidate ?? options.next?.revalidate ?? defaultRevalidate;

    const timeoutMs = options.timeout ?? 30000;
    const fetchOptions = {
      signal: options.signal || AbortSignal.timeout(timeoutMs),
      ...options,
    };
    // These are ours, not fetch options
    delete fetchOptions.timeout;
    delete fetchOptions.tags;
    delete fetchOptions.revalidate;

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

    // A missing item is a normal answer, not an error worth logging
    if (response.status === 404) return null;

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Rethrow so a backend failure is never cached as page content: the build fails
    // and a running site keeps serving its last good page.
    console.error(`Error fetching data from ${path}:`, error.message);
    throw error;
  }
};

// For data a page can live without: a backend failure becomes null instead of an error page
export const getOptional = (path, options) =>
  getData(path, options).catch(() => null);

export default getData;

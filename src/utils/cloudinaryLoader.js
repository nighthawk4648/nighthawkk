const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const hasValidCloudName = Boolean(
  cloudName &&
  !cloudName.includes("your_cloudinary") &&
  cloudName.trim() !== ""
);

export default function cloudinaryLoader({ src, width, quality }) {
  if (!src) return "";

  // 1. Pass SVGs, data URLs, and blobs directly
  if (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.endsWith(".svg")
  ) {
    return src;
  }

  // 2. Pass local public assets and Next.js bundled static media with width query
  if (src.startsWith("/assets/") || src.startsWith("/_next/")) {
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}w=${width}`;
  }

  // 3. Normalize to absolute URL for Cloudinary fetch
  let fullUrl = src;
  if (!/^https?:\/\//i.test(src)) {
    const base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE || "";
    fullUrl = `${base}${src}`.replace(/([^:]\/)\/{2,}/g, "$1");
  }

  // 4. If Cloudinary is not configured or URL is local (localhost/127.0.0.1), stream origin URL with width query
  if (
    !hasValidCloudName ||
    fullUrl.includes("localhost") ||
    fullUrl.includes("127.0.0.1")
  ) {
    const separator = fullUrl.includes("?") ? "&" : "?";
    return `${fullUrl}${separator}w=${width}`;
  }

  // 4. If already an existing Cloudinary direct upload URL, insert width transform
  if (fullUrl.includes("res.cloudinary.com") && fullUrl.includes("/image/upload/")) {
    const q = quality || 75;
    return fullUrl.replace(
      "/image/upload/",
      `/image/upload/f_auto,q_auto,c_limit,w_${width},q_${q}/`
    );
  }

  if (fullUrl.includes("res.cloudinary.com") && fullUrl.includes("/image/fetch/")) {
    return fullUrl.replace(
      /\/image\/fetch\/[^/]+\//,
      `/image/fetch/f_auto,q_auto,c_limit,w_${width}/`
    );
  }

  // 5. Build Cloudinary fetch URL with Next.js responsive width bucket
  const q = quality || 75;
  const encodedUrl = encodeURIComponent(fullUrl);
  return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto,c_limit,w_${width},q_${q}/${encodedUrl}`;
}


export function getOriginalImageUrl(imagePath) {
  if (!imagePath) return "";

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE || "";
  return `${baseUrl}${imagePath}`.replace(/([^:]\/)\/{2,}/g, "$1");
}

// Same URL next/image builds, for places that cannot use <Image>.
// width must be one of deviceSizes/imageSizes in next.config.mjs.
export function optimizedImageUrl(src, width, quality = 75) {
  if (!src) return "";
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

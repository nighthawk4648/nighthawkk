import { Cloudinary } from "@cloudinary/url-gen";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const hasValidCloudName = Boolean(
  cloudName && !cloudName.includes("your_cloudinary") && cloudName.trim() !== ""
);

export const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName || "demo",
  },
  url: {
    secure: true,
  },
});

export function getOriginalImageUrl(imagePath) {
  if (!imagePath) return "";

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE || "";
  return `${baseUrl}${imagePath}`.replace(/([^:]\/)\/{2,}/g, "$1");
}

/**
 * Normalizes image paths to absolute URLs.
 * With next/image custom loader active, next/image automatically applies
 * Cloudinary transforms with the exact responsive width.
 * For external usages (e.g. OpenGraph tags, static previews), this returns
 * a clean CDN URL with explicit width without obsolete w_auto/dpr_auto.
 */
export function getOptimizedImageUrl(originalUrl, { width = 1200, quality = 80 } = {}) {
  if (!originalUrl) return "";

  const normalizedUrl = /^https?:\/\//i.test(originalUrl)
    ? originalUrl
    : getOriginalImageUrl(originalUrl);

  if (!hasValidCloudName) {
    return normalizedUrl;
  }

  // If already a Cloudinary URL, return as-is
  if (normalizedUrl.includes("res.cloudinary.com")) {
    return normalizedUrl;
  }

  const encodedUrl = encodeURIComponent(normalizedUrl);
  return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto,c_limit,w_${width},q_${quality}/${encodedUrl}`;
}
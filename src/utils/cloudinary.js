import { Cloudinary } from "@cloudinary/url-gen";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const hasValidCloudName = Boolean(cloudName && !cloudName.includes("your_cloudinary"));

export const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName || "demo"
  },
  url: {
    secure: true
  }
});

export function getOriginalImageUrl(imagePath) {
  if (!imagePath) return "";

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE || "";
  return `${baseUrl}${imagePath}`.replace(/([^:]\/)\/{2,}/g, "$1");
}

export function getOptimizedImageUrl(originalUrl) {
  if (!originalUrl) return "";

  const normalizedUrl = /^https?:\/\//i.test(originalUrl)
    ? originalUrl
    : getOriginalImageUrl(originalUrl);

  if (!hasValidCloudName) {
    return normalizedUrl;
  }

  const encodedUrl = encodeURIComponent(normalizedUrl);
  return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto,w_auto,dpr_auto,c_limit/${encodedUrl}`;
}
import { Cloudinary } from "@cloudinary/url-gen";

export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  },
  url: {
    secure: true
  }
});

// Function to generate optimized image URLs using Cloudinary's fetch feature
export function getOptimizedImageUrl(originalUrl) {
  // Make sure the URL is properly encoded
  const encodedUrl = encodeURIComponent(originalUrl);
  
  // Create fetch URL with optimizations
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto,w_auto,dpr_auto,c_limit/${encodedUrl}`;
}
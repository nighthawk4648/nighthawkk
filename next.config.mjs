/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    cpus: 1,
    // Some upload originals are 3-6 MB PNGs; the default 7s can time out on slow links
    imgOptTimeoutInSeconds: 12,
  },

  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Upload filenames are unique timestamps, so a cached image never goes stale
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.sketchshaper.com",
        pathname: "/api/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/api/uploads/**",
      },
    ],
    // Only lets a local backend's images through during development
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },

  // Add trailing slashes for consistent URLs
  trailingSlash: false,

  // Skip trailing slash redirect for cleaner URLs
  skipTrailingSlashRedirect: false,

  // Prevent indexing of Next.js RSC transport URLs.
  async redirects() {
    return [
      {
        source: "/api.php",
        destination: "/404",
        permanent: true,
      },
      {
        source: "/sketchup-3d-model-3",
        destination: "/sketchup-3d-models-3",
        permanent: true,
      },
      {
        source: "/sketchup-3d-model-3/:path*",
        destination: "/sketchup-3d-models-3/:path*",
        permanent: true,
      },
      {
        source: "/sketchshaperpro",
        destination: "/extension",
        permanent: true,
      },
      {
        source: "/blogs",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blogs/:path*",
        destination: "/blog/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // Block indexing of URLs with _rsc parameter
        source: "/:path*",
        has: [
          {
            type: "query",
            key: "_rsc",
          },
        ],
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

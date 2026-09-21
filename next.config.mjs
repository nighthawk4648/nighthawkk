/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Optimize fonts to reduce CLS
  optimizeFonts: false,

  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "api.sketchshaper.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
      },
    ],
  },

  // Add trailing slashes for consistent URLs
  trailingSlash: false,

  // Skip trailing slash redirect for cleaner URLs
  skipTrailingSlashRedirect: false,

  // Headers for SEO
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
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
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

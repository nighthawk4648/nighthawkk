/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Optimize fonts to reduce CLS
  optimizeFonts: true,

  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com', 'api.sketchshaper.com', 'ik.imagekit.io'],
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
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Reduce layout shift
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },

  // Add trailing slashes for consistent URLs
  trailingSlash: false,

  // Skip trailing slash redirect for cleaner URLs
  skipTrailingSlashRedirect: false,

  // Headers for SEO
  async redirects() {
    return [
      {
        source: '/api.php',
        destination: '/404',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
      {
        // Block indexing of URLs with _rsc parameter
        source: '/:path*',
        has: [
          {
            type: 'query',
            key: '_rsc',
          },
        ],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;





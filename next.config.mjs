// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;



// // FOR LOCAL DATABASE________________
// const nextConfig = {
//     reactStrictMode: true,
//     swcMinify: true,
//     images: {
//       remotePatterns: [
//         {
//           protocol: "http",
//           hostname: "localhost",
//         },
//       ],
//     },
//   };
  
//   export default nextConfig;




/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.nighthawkk.com",
        port: "",
        pathname: "/api/uploads/**",
      }
    ],
    // Optional: Add these configurations
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;





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
    unoptimized: true, // Add this line
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;





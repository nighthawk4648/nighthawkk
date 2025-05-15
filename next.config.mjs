// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   images: {
//     unoptimized: true, // Add this line
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**",
//       },
//     ],
//   },
// };

// export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   images: {
//     domains: ['ik.imagekit.io'], // Add ImageKit domain explicitly
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**",
//       },
//     ],
//   },
// };

// export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "ik.imagekit.io",
//         pathname: "/sketchshaper/**",
//       },
//       // Keep your other pattern if needed for other image sources
//       {
//         protocol: "https",
//         hostname: "**",
//       },
//     ],
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    // Remove the unoptimized: true line since we want to use Cloudinary's optimization
    domains: ['res.cloudinary.com', 'https://api.sketchshaper.com/api'], // Add your hosting domain
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;





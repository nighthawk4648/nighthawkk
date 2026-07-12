export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/',
          '/*?_rsc=*',  // Block all RSC cache URLs
          '/*?*_rsc=*', // Block RSC params anywhere in query string
          '/api.php',   // Block api.php
          '/api/*',     // Block API routes
          '/*?*&*',     // Block URLs with multiple query parameters
        ],
      },
    ],
    sitemap: 'https://www.sketchshaper.com/sitemap.xml',
  }
}
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/',
          '/*?_rsc=*',
          '/*?*_rsc=*',
          '/api.php',
          '/api/*',
        ],
      },
    ],
    sitemap: 'https://www.sketchshaper.com/sitemap.xml',
  }
}
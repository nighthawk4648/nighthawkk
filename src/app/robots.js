import { AI_BOTS } from '../utils/aiBots.js';

const DISALLOW = [
  '/private/',
  '/*?_rsc=*',
  '/*?*_rsc=*',
  '/api.php',
  '/api/*',
];

export default function robots() {
  return {
    rules: [
      {
        userAgent: AI_BOTS,
        allow: '/',
        disallow: DISALLOW,
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
    ],
    sitemap: 'https://www.sketchshaper.com/sitemap.xml',
  }
}

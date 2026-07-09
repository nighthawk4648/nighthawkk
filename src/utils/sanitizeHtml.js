
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

export function sanitizeHtml(html) {
  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'strong', 'b', 'em', 'i', 'u',
      'mark', 'span', 'a',
      'ul', 'ol', 'li',
      'blockquote', 'code', 'pre',
      'div', 'hr'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
    ALLOW_DATA_ATTR: false
  });
}

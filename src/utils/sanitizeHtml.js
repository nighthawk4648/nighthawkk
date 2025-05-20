
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

export function sanitizeHtml(html) {
  return purify.sanitize(html);
}

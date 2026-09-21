const allowedTags = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre",
  "img", "span", "div", "table", "thead", "tbody", "tfoot", "tr", "th", "td"
]);

const allowedAttributes = new Set(["href", "target", "rel", "src", "alt", "title", "class", "id"]);

const decodeHtmlEntities = (input) => {
  if (!input) return "";

  return String(input)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
};

const sanitizeAttributes = (attributeString) => {
  if (!attributeString) return "";

  const allowed = [];
  const attributePattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match;

  while ((match = attributePattern.exec(attributeString)) !== null) {
    const [, rawName, doubleQuoted, singleQuoted, unquoted] = match;
    const name = rawName.toLowerCase();
    const value = doubleQuoted ?? singleQuoted ?? unquoted ?? "";

    if (!allowedAttributes.has(name)) continue;

    if ((name === "href" || name === "src") && value.trim()) {
      const normalized = value.trim();
      const isSafeUrl = /^(https?:|mailto:|tel:|\/|#)/i.test(normalized);
      if (!isSafeUrl) continue;
    }

    allowed.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
  }

  return allowed.length ? ` ${allowed.join(" ")}` : "";
};

export function sanitizeHtml(html) {
  if (!html) return "";

  const decodedHtml = decodeHtmlEntities(html);
  const withoutUnsafeTags = decodedHtml
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<(iframe|object|embed|link|meta)[^>]*>/gi, "");

  return withoutUnsafeTags.replace(/(<\/?)([a-zA-Z0-9]+)([^>]*)>/g, (fullMatch, opener, tagName, attributeString) => {
    const normalizedTag = tagName.toLowerCase();

    if (!allowedTags.has(normalizedTag)) {
      return "";
    }

    const sanitizedAttributes = sanitizeAttributes(attributeString);

    return opener === "</" ? `</${normalizedTag}>` : `<${normalizedTag}${sanitizedAttributes}>`;
  });
}

export function stripHtml(html, maxLength = 160) {
  if (!html) return "";

  const text = String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

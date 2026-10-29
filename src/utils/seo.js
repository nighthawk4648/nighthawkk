const SITE_URL = "https://www.sketchshaper.com";
const DEFAULT_IMAGE = "/assets/seo/social-card.png";
const DEFAULT_DESCRIPTION =
  "Free and pro 3D models, textures, and plugins for SketchUp.";

const namedEntities = {
  amp: "&",
  apos: "'",
  bull: "•",
  copy: "©",
  gt: ">",
  hellip: "…",
  ldquo: "“",
  lsquo: "‘",
  lt: "<",
  mdash: "—",
  nbsp: " ",
  ndash: "–",
  quot: '"',
  rdquo: "”",
  reg: "®",
  rsquo: "’",
  trade: "™",
};

function decodeHtmlEntities(value) {
  return value
    .replace(/&(#x[\da-f]+|#\d+|[a-z][\da-z]+);/gi, (entity, code) => {
      if (code[0] !== "#") return namedEntities[code.toLowerCase()] ?? entity;

      const isHex = code[1]?.toLowerCase() === "x";
      const number = Number.parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      if (!Number.isFinite(number) || number < 0 || number > 0x10ffff) {
        return "\uFFFD";
      }

      try {
        return String.fromCodePoint(number);
      } catch {
        return "\uFFFD";
      }
    });
}

export function cleanText(value, maxLength = 160) {
  if (typeof value !== "string" || !value.trim()) return "";

  const text = decodeHtmlEntities(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!Number.isFinite(maxLength) || maxLength < 1 || text.length <= maxLength) {
    return text;
  }

  const contentLength = Math.max(1, maxLength - 3);
  const boundary = text.lastIndexOf(" ", contentLength);
  const truncated = text
    .slice(0, boundary > 0 ? boundary : contentLength)
    .trim();
  return `${truncated}...`;
}

function normalizeSearchParams(searchParams) {
  if (!searchParams) return null;
  if (searchParams instanceof URLSearchParams) return searchParams;

  const normalized = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === "string") normalized.append(key, item);
      });
    } else if (typeof value === "string") {
      normalized.append(key, value);
    }
  }
  return normalized;
}

export function buildCanonicalUrl(
  pathname,
  searchParams,
  { preservePage = false } = {},
) {
  const rawPath =
    typeof pathname === "string"
      ? pathname.split(/[?#]/, 1)[0].replace(/\\/g, "/")
      : "";
  const path =
    rawPath.startsWith("/") && !rawPath.startsWith("//")
      ? rawPath
      : "/";
  const cleanPath = path.replace(/\/+$/, "") || "/";
  const canonical = new URL(cleanPath, SITE_URL);

  if (preservePage) {
    const params = normalizeSearchParams(searchParams);
    const pages = params?.getAll("page") || [];
    const page = pages.length === 1 ? pages[0] : "";
    if (/^[1-9]\d*$/.test(page)) {
      const pageNumber = Number(page);
      if (Number.isSafeInteger(pageNumber) && pageNumber > 1) {
        canonical.searchParams.set("page", String(pageNumber));
      }
    }
  }

  return canonical.toString();
}

function absoluteImageUrl(image) {
  if (typeof image !== "string" || !image.trim() || image.trim() === "-") {
    return new URL(DEFAULT_IMAGE, SITE_URL).toString();
  }

  const value = image.trim();
  let url;
  try {
    if (/^https?:\/\//i.test(value)) {
      url = new URL(value);
    } else {
      const imageBase =
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE ||
        "https://api.sketchshaper.com/api/uploads/";
      url = new URL(value.replace(/^\/+/, ""), imageBase.endsWith("/") ? imageBase : `${imageBase}/`);
    }
  } catch {
    return new URL(DEFAULT_IMAGE, SITE_URL).toString();
  }

  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    return new URL(DEFAULT_IMAGE, SITE_URL).toString();
  }
  return url.toString();
}

export function getOgImageUrl(image) {
  const imageUrl = absoluteImageUrl(image);
  if (imageUrl.endsWith(DEFAULT_IMAGE)) return imageUrl;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || cloudName.includes("your_cloudinary")) return imageUrl;

  if (imageUrl.includes("res.cloudinary.com")) {
    return imageUrl.replace(
      "/image/upload/",
      "/image/upload/c_fill,w_1200,h_630,f_auto,q_auto/",
    );
  }

  const encodedUrl = encodeURIComponent(imageUrl);
  return `https://res.cloudinary.com/${cloudName}/image/fetch/c_fill,w_1200,h_630,f_auto,q_auto/${encodedUrl}`;
}

export function buildPageMetadata({
  title,
  description,
  pathname = "/",
  searchParams,
  preservePage = false,
  image,
  imageAlt = "SketchShaper",
  type = "website",
  noIndex = false,
  noFollow = false,
  publishedTime,
  modifiedTime,
  authors,
}) {
  const canonical = buildCanonicalUrl(pathname, searchParams, { preservePage });
  const cleanedTitle = cleanText(title, 200) || "SketchShaper";
  const cleanTitle =
    cleanedTitle.replace(/\s*(?:\||-|–|—)\s*SketchShaper(?:\s+Blog)?$/i, "").trim() ||
    "SketchShaper";
  const cleanDescription =
    cleanText(description, 160) || DEFAULT_DESCRIPTION;
  const socialImage = {
    url: getOgImageUrl(image),
    width: 1200,
    height: 630,
    alt: cleanText(imageAlt, 200) || "SketchShaper",
  };
  const robots = {
    index: !noIndex,
    follow: !noFollow,
    googleBot: {
      index: !noIndex,
      follow: !noFollow,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
  const openGraph = {
    title: cleanTitle,
    description: cleanDescription,
    url: canonical,
    type,
    siteName: "SketchShaper",
    images: [socialImage],
  };

  if (type === "article") {
    if (publishedTime) openGraph.publishedTime = publishedTime;
    if (modifiedTime) openGraph.modifiedTime = modifiedTime;
    if (authors?.length) openGraph.authors = authors;
  }

  return {
    title: cleanTitle,
    description: cleanDescription,
    alternates: { canonical },
    robots,
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDescription,
      images: [socialImage.url],
    },
  };
}

export function generateCanonicalUrl(pathname) {
  return buildCanonicalUrl(pathname);
}

export function getCleanMetadata(pathname, metadata = {}) {
  const canonical = buildCanonicalUrl(pathname);
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical: metadata.alternates?.canonical || canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
      ...metadata.robots,
    },
  };
}

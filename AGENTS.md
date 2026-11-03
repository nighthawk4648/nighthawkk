<!-- markdownlint-disable -->
# SketchShaper Frontend — AI Agent Guide & Architecture

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 1. System Ecosystem

SketchShaper operates across three synchronized repositories:

1. **Frontend (`nighthawkk-noyon`):** Next.js 16 App Router, React 19, Tailwind CSS. Public-facing 3D asset showcase, catalog, blog, and conversion platform.
2. **Backend API (`nighthawk-server-mysql_version`):** Node.js / Express 5, Prisma ORM, MariaDB. Handles authentication, asset/category/blog CRUD, S3 uploads, chunked media processing, and on-demand cache revalidation webhooks.
3. **Admin Dashboard (`NightHawk_Admin_Dashboard-main`):** Vite, React, Redux Toolkit, Tailwind. Admin management interface for assets, categories, subcategories, blogs, and media.

---

## 2. Frontend Structure & Directory Layout

```text
src/
├── app/                                  # Next.js App Router root
│   ├── [category]/                       # Category listing route (/[category-slug]-[id])
│   │   ├── [subCategoryName]/            # Subcategory listing (/[category]/[subcategory-slug]-[id])
│   │   │   ├── [assetsName]/             # Canonical 3-tier asset detail route
│   │   │   │   └── page.jsx              # Self-healing asset page (307 redirect + canonical meta)
│   │   │   └── page.jsx
│   │   └── page.jsx
│   ├── api/                              # Next.js server route handlers
│   │   ├── assets/search/route.js        # Instant search API projection
│   │   └── revalidate/route.js           # On-demand cache invalidation webhook
│   ├── blog/                             # Blog listing and detail pages
│   ├── gallery/                          # Interactive 3D render showcase
│   ├── layout.js                         # Root layout (fonts, metadataBase, nav/footer)
│   ├── robots.js                         # Dynamic robots.txt (blocks _rsc crawl waste)
│   └── sitemap.js                        # Dynamic XML sitemap generation
├── components/                           # Modular UI component tree
│   ├── Catalog/                          # Filterable catalog, sort dropdowns, pagination
│   ├── Home/                             # Hero, NewAssets showcase, feature sections
│   ├── SubCategory/                      # SubCategoryDetails & RelatedAssetCards
│   └── Shared/                           # Navbar, Footer, SearchModal, Ads
├── contexts/                             # React context providers (e.g. PatreonAuthContext)
└── utils/                                # Core domain logic, helpers, and test suites
    ├── buildAssetPath.js                 # Single source of truth for asset URL construction
    ├── validateSlug.js                   # Self-healing slug validation & safeDecode
    ├── getData.js                        # Tagged server-side fetch with ISR caching
    ├── seo.js                            # Metadata, OpenGraph & Twitter Card builder
    ├── schema.js                         # JSON-LD Schema.org generators (Product, Breadcrumbs)
    ├── cloudinary.js                     # Image transformation & optimization helpers
    └── slugRouting.test.mjs              # Automated routing & redirect test suite
```

---

## 3. URL Architecture & Self-Healing Pipeline

### Canonical URL Format

All asset detail URLs MUST follow the strict 3-tier structure:

```text
/[category-slug]/[subcategory-slug]/[asset-slug]-[id]
```

### Critical Routing Rules

1. **The Trailing Numeric ID is the Permanent Anchor:**
   - The asset ID is always parsed as the final hyphen-delimited numeric segment via regex: `/-(\d+)$/`.
   - Never split on the first hyphen (asset slugs may contain hyphens and numbers, e.g. `sketchup-2024-pro-99`).

2. **Single Source of Truth (`buildAssetPath`):**
   - All internal links (catalog cards, homepage showcase, related items, search results, and sitemap) MUST use `buildAssetPath(asset)` from `@/utils/buildAssetPath`.
   - Never construct asset URLs using manual template strings.

3. **Deterministic Fallbacks:**
   - Slugs fall back to `slugify(name)`.
   - Any slug that reduces to an empty string (e.g. non-Latin scripts, emojis, or symbols) MUST fall back to `"category"`, `"subcategory"`, or `"asset"`.

4. **Self-Healing 307 Redirects:**
   - If an asset ID exists, any mismatch in slug, category, subcategory, or letter casing automatically triggers a **307 Temporary Redirect** to the canonical path in `validateSlug.js` and `page.jsx`.
   - Query strings (e.g. `?ref=catalog&sort=price`) MUST be preserved during redirect via `new URLSearchParams`.
   - 307 Temporary Redirects are the default to avoid browser redirect lock-in while slugs stabilize. A 308 permanent redirect is enabled via `NEXT_PUBLIC_USE_PERMANENT_REDIRECT=true`.

5. **Safe URL Decoding:**
   - Always wrap `decodeURIComponent` in `safeDecode()`. Malformed percent-encoded sequences (e.g. `%E0%A4%A`) must produce a clean HTTP 404, never a 500 crash.

6. **Request Deduplication:**
   - `validateAsset` in `src/utils/validateSlug.js` MUST remain wrapped in React `cache()`. This guarantees that `generateMetadata` and `Page` share a single database fetch per request cycle.

---

## 4. Caching & Cache Invalidation Pipeline

- **Server Fetches:** Handled by `getData.js` using Next.js tagged fetch caching (`tags: ["assets", "asset-${id}"]`, `revalidate: 300`).
- **Hierarchical Invalidation:**
  - When an asset is created, updated, moved, or deleted, the backend dispatches a webhook to `/api/revalidate` with `x-revalidate-secret`.
  - On asset move: Both the **old** and **new** parent category and subcategory tags are purged simultaneously (`category-${oldId}`, `category-${newId}`, `subcategory-${oldId}`, `subcategory-${newId}`).
  - On category/subcategory rename: The backend purges the `"assets"` tag so child asset cards across the site refresh immediately.
- **Client State:** Search modals and dynamic live interactions use SWR with module-scope LRU cache (`SearchModal.jsx`).

---

## 5. SEO & Crawl Optimization

- **Canonical Meta Tags:** Every asset page outputs `<link rel="canonical" href="...">` matching `buildAssetPath(asset)`.
- **Structured Data:** Every model page includes Schema.org `Product` and `BreadcrumbList` JSON-LD schemas via `src/utils/schema.js`.
- **XML Sitemap:** Dynamic sitemap at `/sitemap.xml` generates absolute canonical URLs using `buildAssetPath`.
- **Robots Exclusion:** `src/app/robots.js` disallows `/*?_rsc=*` to prevent search crawlers from wasting crawl budget on Next.js React Server Component prefetch payloads.

---

## 6. Coding & Senior Developer Guidelines

Agents working in this codebase MUST follow the principles in `.agents/rules/ponytail.md`:

- **Lean Diffs:** The best code is the code never written. Solve problems with the minimum working diff.
- **No Speculative Bloat:** Do not add unused abstraction layers, wrapper libraries, or speculative configuration.
- **Preserve Integrity:** Never bypass validation at trust boundaries, error handling, or security checks.
- **Verify Edge Cases:** When modifying routing, slugs, or data fetching, always run tests:
  ```bash
  node --test src/utils/slugRouting.test.mjs
  ```

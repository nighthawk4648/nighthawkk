# Graph Report - nighthawkk-noyon  (2026-10-31)

## Corpus Check
- 85 files · ~57,490 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .woff2 4, (none) 1, .rbz 1)

## Summary
- 316 nodes · 922 edges · 26 communities (10 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ca60568b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- getData
- next
- react
- package.json
- rbzconverter/page.jsx
- [category]/page.jsx
- Gallery.jsx
- Patreon Integration Guide
- extension.jsx
- revalidate/route.js
- compilerOptions
- next.config.mjs
- postcss.config.mjs
- callback/layout.js
- [blog]/page.jsx
- verify-seo-fixes.sh
- Google AdSense Authorized Digital Sellers Config
- Homepage Second Section Features
- Creative Commons Logo
- Creative Commons Zero Logo
- Models Features Image
- Navbar Logo
- Social Card PNG

## God Nodes (most connected - your core abstractions)
1. `react` - 42 edges
2. `next` - 35 edges
3. `getData()` - 31 edges
4. `slugify()` - 31 edges
5. `getOptimizedImageUrl()` - 27 edges
6. `cleanText()` - 26 edges
7. `buildPageMetadata()` - 25 edges
8. `JsonLd()` - 24 edges
9. `getOriginalImageUrl()` - 21 edges
10. `generateBreadcrumbSchema()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Patron Status Download Access Control` --semantically_similar_to--> `Client Token Storage and Expiry Verification`  [INFERRED] [semantically similar]
  PATREON_INTEGRATION.md → TEST_LOGIN.md
- `Local Environment Configuration` --conceptually_related_to--> `Patreon Integration Guide`  [INFERRED]
  README.md → PATREON_INTEGRATION.md
- `Page()` --calls--> `SubCategoryDetails()`  [EXTRACTED]
  src/app/[category]/[subCategoryName]/[assetsName]/page.jsx → src/components/SubCategory/SubCategoryDetails/SubCategoryDetails.jsx
- `Page()` --calls--> `generateBreadcrumbSchema()`  [EXTRACTED]
  src/app/[category]/[subCategoryName]/page.jsx → src/utils/schema.js
- `Page()` --calls--> `JsonLd()`  [EXTRACTED]
  src/app/[category]/[subCategoryName]/page.jsx → src/utils/schema.js

## Import Cycles
- None detected.

## Communities (26 total, 16 thin omitted)

### Community 0 - "getData"
Cohesion: 0.08
Nodes (57): About Us Image 1, About Us Image 2, About Us Image 3, About Us Image 4, About Us Image 5, aboutPageSchema, AboutUs(), breadcrumbsSchema (+49 more)

### Community 1 - "next"
Cohesion: 0.09
Nodes (35): next, dynamic, GET(), geistMono, geistSans, generateMetadata(), getCachedApplicationSettings(), RootLayout() (+27 more)

### Community 2 - "react"
Cohesion: 0.13
Nodes (25): react, swr, PatreonCallbackContent(), PatreonCallbackPage(), BlogFeedAd(), BlogsPage(), estimateReadingTime(), BlogGutterAd() (+17 more)

### Community 3 - "package.json"
Cohesion: 0.06
Nodes (31): dependencies, js-cookie, next, next-cloudinary, @next/third-parties, react, react-dom, react-hook-form (+23 more)

### Community 4 - "rbzconverter/page.jsx"
Cohesion: 0.38
Nodes (5): breadcrumbsSchema, converterSchema, metadata, RbzConverterPage(), RbzConverterClient()

### Community 5 - "[category]/page.jsx"
Cohesion: 0.20
Nodes (22): generateMetadata(), Page(), revalidate, generateMetadata(), Page(), revalidate, Loader(), SingleSubCategoryPage() (+14 more)

### Community 6 - "Gallery.jsx"
Cohesion: 0.48
Nodes (4): metadata, Page(), Gallery(), useInfiniteScroll()

### Community 8 - "Patreon Integration Guide"
Cohesion: 0.32
Nodes (8): Patron Status Download Access Control, PatreonAuthContext State Management, Patreon OAuth Authentication Flow, Patreon Integration Guide, Local Environment Configuration, Sketch Front Project README, Patreon Login Testing Guide, Client Token Storage and Expiry Verification

### Community 10 - "revalidate/route.js"
Cohesion: 0.29
Nodes (3): constantTimeCompare(), POST(), config

### Community 15 - "[blog]/page.jsx"
Cohesion: 0.15
Nodes (14): react-icons, BlogDetailPage(), estimateReadingTime(), extractHeadingsAndInjectIds(), metadata, BlogLeftRail(), BlogMobileToc(), AboutUs() (+6 more)

## Knowledge Gaps
- **21 isolated node(s):** `js-cookie`, `next-cloudinary`, `react-dom`, `react-hook-form`, `sharp` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 97 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `getData`, `react`, `package.json`, `[category]/page.jsx`, `Gallery.jsx`, `extension.jsx`, `revalidate/route.js`, `[blog]/page.jsx`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **What connects `js-cookie`, `next-cloudinary`, `react-dom` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `getData` be split into smaller, more focused modules?**
  _Cohesion score 0.07885968159940762 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `getData`, `next`, `package.json`, `rbzconverter/page.jsx`, `[category]/page.jsx`, `Gallery.jsx`, `extension.jsx`, `[blog]/page.jsx`?**
  _High betweenness centrality (0.163) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.09461152882205513 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.132890365448505 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
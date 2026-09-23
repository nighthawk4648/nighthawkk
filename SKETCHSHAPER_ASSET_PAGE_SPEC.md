# SketchShaper — 3D Asset Detail Page: Comprehensive Architecture & UI/UX Redesign Brief

> **Purpose of this document**:  
> This specification is designed to provide full project context to AI design assistants (such as Gemini Web) to conceptualize, wireframe, and design a world-class, modern **Asset Detail Page** for **SketchShaper**.

---

## 1. Project Overview & Brand Identity

### What is SketchShaper?

**SketchShaper** (formerly known internally as _Nighthawk_) is a specialized digital marketplace and resource hub offering high-quality **SketchUp 3D models (.skp)**, **PBR textures**, **furniture assets**, and **extensions/plugins** for architects, 3D visualizers, interior designers, and CG artists.

- **Website**: `https://www.sketchshaper.com`
- **Target Audience**: Professional architects, interior designers, architectural visualizers (ArchViz), landscape architects, and 3D modeling students.
- **Core Philosophy**: Fast, accessible, and high-fidelity 3D assets that architects can drop directly into SketchUp and render with V-Ray, Enscape, Lumion, Twinmotion, or D5 Render.
- **Aesthetic Theme**: **Dark Mode First** — deep tones (`bg-gray-950`, `bg-gray-900`, `bg-black`), sleek borders (`border-gray-800`), gradient accents (indigo, purple, amber, emerald), crisp typography, and high-contrast preview imagery.

---

## 2. Technical Stack & Environment

| Layer                     | Technology                                                                                                |
| :------------------------ | :-------------------------------------------------------------------------------------------------------- |
| **Framework**             | Next.js 14 (App Router — Server & Client Components)                                                      |
| **Language**              | React 18 / Modern JavaScript (ES2023+)                                                                    |
| **Styling**               | Tailwind CSS 3.4 (custom utility classes, dark gradients, responsive grid)                                |
| **State & Data Fetching** | React Context (`PatreonAuthContext`), SWR (`useSWR` for related assets), standard `fetch`                 |
| **Carousels & Media**     | Swiper.js (`FreeMode`, `Navigation`, `Thumbs`), Next.js `<Image />` with ImageKit/Cloudinary optimization |
| **Icons**                 | React Icons (`react-icons/fi`, `react-icons/ai`, `react-icons/io5`, `react-icons/fa`)                     |
| **Backend & DB**          | Node.js, Express, MySQL, Prisma ORM                                                                       |
| **Monetization & Auth**   | Patreon OAuth 2.0 (Token-based membership tiers: Free, Standard, Premium)                                 |
| **Advertising**           | Google AdSense (`adsbygoogle.push({})`)                                                                   |

---

## 3. Data Schema & Asset Properties

The detail page receives an `assetDetails` object via route `/[category]/[subCategoryName]/[assetsName]`.

```typescript
interface AssetDetails {
  id: number;
  name: string; // e.g. "Modern Italian Leather Sofa"
  access_type: "free" | "paid"; // "free" = direct download; "paid" = Patreon PRO only
  size: string; // e.g. "45 MB"
  resolution: string; // e.g. "4K PBR" or "Polygon count: 120k"
  short_description: string; // Rich overview of the model and materials
  sub_category_id: number; // ID of parent subcategory (e.g. Sofas)
  sub_category?: {
    id: number;
    name: string;
    category?: {
      id: number;
      name: string; // e.g. "SketchUp 3D Models"
    };
  };
  images: Array<{
    id: number;
    image: string; // Relative path, e.g. "uploads/sofa-angle-1.jpg"
  }>;
  file?: {
    file_type?: string; // ".skp", ".zip", ".rbz"
    file_size?: number | string; // Raw bytes or formatted string
  };
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}
```

---

## 4. Business Logic & Monetization Rules (CRITICAL)

The redesign **must strictly preserve** these core business and monetization rules:

### A. The 3-State Download / Access Button

Depending on `assetDetails.access_type` and user login status from `usePatreonAuth()`:

1. **Free Asset (`access_type === "free"`)**:
   - Shows: **"DOWNLOAD"** (Green / Emerald `#379960` or modern equivalent).
   - Action: Direct browser download via `/api/assets/:id/download`. No login required.
2. **Paid Asset (`access_type === "paid"`) — User Not Logged In**:
   - Shows: **"🔒 UNLOCK WITH PATREON"** (Purple/Amber gradient).
   - Action: Opens the Patreon Subscription Modal or initiates OAuth login via `/api/patreon/auth`.
3. **Paid Asset (`access_type === "paid"`) — User Logged In as Free Member**:
   - Shows: **"SUBSCRIBE TO UNLOCK"** (Patreon brand `#FF424D`).
   - Displays logged-in user email + "Log out" switch link.
   - Action: Opens Patreon modal linking to `https://www.patreon.com/sketchshaper`.
4. **Paid Asset (`access_type === "paid"`) — Active Patreon Subscriber (`user?.is_active_patron === true`)**:
   - Shows: **"💎 PRO DOWNLOAD"** (Emerald/Indigo Gradient with glowing badge).
   - Action: Downloads the protected asset using the user's authenticated token (`/api/assets/:id/download?token=${token}`).

### B. Google AdSense Visibility Rules

- **Free / Logged-Out Users**: Google AdSense banners are displayed (vertical side rails and horizontal units).
- **Active Patreon Subscribers**: **ALL ADS MUST BE 100% HIDDEN**. Patreon PRO members enjoy an ad-free premium experience.

---

## 5. Shortcomings of the Current Page (Why We Are Redesigning)

1. **Cluttered "Squeezed" Gallery Layout**:
   - Two vertical 160px ad banners flank the main image slider, crushing the preview image into an awkward middle box on desktop.
2. **Disconnected Thumbnail Strip**:
   - Thumbnails sit in a separate full-width block below the main image instead of being integrated cleanly into a cohesive media viewer.
3. **Uninspired Technical Specification Presentation**:
   - Specs like `Size - 25MB`, `Resolution - 4K` appear as basic plain-text bullets without visual structure, badges, or architecture-relevant tags (e.g. SketchUp Version, Render Engine compatibility, PBR texture maps included).
4. **Poor Visual Hierarchy & Scroll Friction**:
   - The Action/Download CTA sits below the fold under banner ads. On mobile devices, users must scroll through multiple viewports of images and ads before reaching the download button.
5. **Lack of Modern Marketplace Utilities**:
   - No full-screen image lightbox or zoom lens for inspecting 3D wireframes/renders.
   - No "Copy Link", "Share", or "License info" modal.
   - No breadcrumbs (`Home > 3D Models > Living Room > Modern Sofa`).
6. **Related Assets Section**:
   - Uses basic generic cards rather than the new floating modern cards implemented on the homepage.

---

## 6. Redesign Goals & Desired Experience

### Visual Benchmarks & Inspiration

- **Platforms to reference**: **Poliigon**, **Quixel Megascans**, **TurboSquid / Sketchfab**, **Fab.com (Epic Games)**, **ArtStation Marketplace**.

### What the New Design Should Deliver:

1. **Hero Media Gallery**:
   - Large, high-impact main preview with multi-angle thumbnails (side-rail vertical dock or sleek bottom strip).
   - Fullscreen lightbox or interactive zoom option to inspect fine texture and polygon details.
   - Prominent **PRO** or **FREE** floating badge on the image.
2. **Clean Two-Column Hero Architecture (Desktop)**:
   - **Left (60-65%)**: Cinematic image gallery and render showcase.
   - **Right (35-40%)**: Sticky action column containing:
     - Category Breadcrumb trail.
     - Asset Title & Author/Studio tag.
     - Conversion CTA: Primary Download button (state-driven: Free / Unlock / Pro).
     - Quick Guarantee/Feature Highlights: "✓ Compatible with SketchUp 2021+", "✓ Clean Geometry", "✓ Textures Included".
     - Sleek Technical Specs Card (Grid with icons: Format, File Size, Polygon/Vert count, Render Engine, License).
3. **Smart Ad Placement**:
   - Replace noisy side rails with clean, modern placements (e.g. a dedicated sponsor block in the sidebar or a neat banner between content sections) that disappear cleanly for patrons without disrupting the page structure.
4. **Interactive Asset Tabs / Sections (Below Hero)**:
   - **Overview & Materials**: Description, included texture maps (Diffuse, Normal, Roughness, Displacement).
   - **Software & Compatibility**: V-Ray, Enscape, Lumion, Twinmotion versions.
   - **License & Commercial Terms**: Clear commercial use permission note.
5. **Mobile-First Experience**:
   - Mobile sticky bottom bar with asset title and one-tap Download/Unlock button.
   - Swipeable image carousel with indicator dots.
6. **Related & Recommended Assets**:
   - Modern floating cards with smooth hover zoom and PRO badges matching the updated homepage style.

---

## 7. Prompt Template to Use with Gemini Web

Copy and paste the following prompt into Gemini Web along with this document:

```text
I am redesigning the 3D Asset Detail Page for "SketchShaper" (https://www.sketchshaper.com), a platform offering architectural SketchUp 3D models and PBR textures.

I have attached/provided the full technical architecture and business rules in the document above.

Please act as a Principal Product Designer & UI/UX Expert specializing in 3D marketplaces and SaaS platforms (like Poliigon, Megascans, and TurboSquid).

I want to explore 2 or 3 distinct design concepts for this page:
1. "Cinematic Showcase" (Visuals-first with a sticky technical sidebar)
2. "Architectural Spec-Sheet" (Data-rich, clean, precision-oriented layout)
3. "Streamlined Minimalist" (Focused on fast downloads and seamless mobile experience)

For each concept, please describe:
- Layout wireframe breakdown (Desktop and Mobile)
- How the 3-state Patreon unlock/download CTA is presented
- How Google AdSense is integrated without cluttering the UI (and how it hides cleanly for patrons)
- Technical specification presentation (badges, icons, metadata)
- Media gallery design (lightbox, zoom, thumbnail navigation)

Let's begin by discussing which layout structure fits our platform best!
```

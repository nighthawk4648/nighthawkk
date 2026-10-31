import HeroSection from "@/components/Home/HeroSection";
import Features from "@/components/Home/Features";
import Innovative from "@/components/HomePage/Innovative/Innovative";
import ExtensionBanner from "@/components/Home/ExtensionBanner";
import NewAssets from "@/components/Home/NewAssets";
import ArticlesSection from "@/components/Home/ArticlesSection";
import AboutUs from "@/components/Shared/AboutUs/AboutUs";
import SupportDesk from "@/components/Home/SupportDesk";
import SupportedBy from "@/components/Shared/SupportedBy/SupportedBy";
import getData from "@/utils/getData";
import { buildPageMetadata } from "@/utils/seo";
import { JsonLd, generateWebsiteAndOrgSchema } from "@/utils/schema";

export const metadata = buildPageMetadata({
  title: "Free 3D Models, Textures & SketchUp Plugins",
  description:
    "Discover free and pro SketchUp 3D models, high-quality textures, and helpful plugins for your next creative project.",
  pathname: "/",
});

export default async function Home() {
  const carouselsPromise = getData("sliders");
  const categoriesPromise = getData("categories");
  const extensionPromise = getData("extension-downloads/MyExtension");
  const blogsPromise = getData("blogs");
  const supportedByPromise = getData("supportedby");
  const innovativesPromise = getData("innovative");
  const aboutUsPromise = getData("general/about-us");
  const socialsPromise = getData("social");

  const [
    carousels,
    categories,
    extension,
    blogs,
    supportedby,
    innovatives,
    aboutUs,
    socials,
  ] = await Promise.all([
    carouselsPromise,
    categoriesPromise,
    extensionPromise,
    blogsPromise,
    supportedByPromise,
    innovativesPromise,
    aboutUsPromise,
    socialsPromise,
  ]);

  const socialUrls = (socials?.data || []).map((s) => s.url).filter(Boolean);
  const websiteSchema = generateWebsiteAndOrgSchema(socialUrls);

  // Calculate live total models from database or fallback to 4,280
  const totalModels =
    categories?.data?.reduce(
      (acc, cat) =>
        acc +
        (cat.sub_categories?.reduce(
          (subAcc, sub) => subAcc + (sub.assets?.length || 0),
          0,
        ) || 0),
      0,
    ) || 4280;

  return (
    <main className="w-full overflow-x-hidden selection:bg-action selection:text-canvas">
      <JsonLd data={websiteSchema} />
      {/* 1. Hero Section (CAD Viewport Golden Split 1fr : 1.618fr) */}
      <HeroSection
        sliders={carousels?.data || []}
        totalModels={totalModels}
      />

      {/* 2. Features Category Section (Fluid 0.5-inch 3-Pillar Row) */}
      <Features categories={categories?.data || []} />

      {/* 3. Innovative Highlights Section */}
      <Innovative innovatives={innovatives?.data || []} />

      {/* 4. SketchUp Extension Promo Banner (Mirrored Golden Split 1.618fr : 1fr) */}
      <ExtensionBanner initialDownloads={extension?.data?.count ?? 0} />

      {/* 5. New Assets Feed (Band #0E1611, Segmented Tabs, Responsive CAD Grid) */}
      <NewAssets categories={categories?.data || []} />

      {/* 6. Articles / Editorial Section (Golden Split 1.618fr : 1fr) */}
      <ArticlesSection blogs={blogs?.data || []} />

      {/* 7. About Us Section (Dynamic Studio Mission & Story) */}
      <AboutUs aboutUs={aboutUs?.data} />

      {/* 8. Support & Custom 3D Modeling Desk */}
      <SupportDesk />

      {/* 9. Supported By Partners */}
      <SupportedBy supportedby={supportedby?.data || []} />
    </main>
  );
}

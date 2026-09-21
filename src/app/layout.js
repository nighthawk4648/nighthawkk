import AboutUs from "@/components/Shared/AboutUs/AboutUs";
// ContactUs component for the new contact section below AboutUs
import ContactUs from "@/components/Shared/ContactUs/ContactUs";
import Footer from "@/components/Shared/Footer/Footer";
import Navbar from "@/components/Shared/Navbar/Navbar";
import getData from "@/utils/getData";
import "./globals.css";

import Blogs from "@/components/Shared/Blogs/Blogs";
import SupportedBy from "@/components/Shared/SupportedBy/SupportedBy";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ErrorFallback } from "@/components/Shared/ErrorFallback/ErrorFallback";
import Providers from "@/components/Providers";
const inter = {
  className: "font-sans",
  variable: "--font-inter",
};

let applicationSettingsCache = null;
let applicationSettingsCacheTimestamp = 0;
const APPLICATION_SETTINGS_CACHE_TTL = 10_000;

async function getCachedApplicationSettings() {
  if (
    applicationSettingsCache &&
    Date.now() - applicationSettingsCacheTimestamp <
      APPLICATION_SETTINGS_CACHE_TTL
  ) {
    return applicationSettingsCache;
  }

  applicationSettingsCache = await getData("general/application-settings");
  applicationSettingsCacheTimestamp = Date.now();
  return applicationSettingsCache;
}

export async function generateMetadata() {
  try {
    const applicationSettings = await getCachedApplicationSettings();
    return {
      title: applicationSettings?.data?.site_name || "SketchShaper",
      description:
        applicationSettings?.data?.site_description ||
        "Free & Pro 3D Models, Textures, and Plugins for SketchUp",
    };
  } catch (e) {
    return {
      title: "SketchShaper",
      description: "Free & Pro 3D Models, Textures, and Plugins for SketchUp",
    };
  }
}

export default async function RootLayout({ children }) {
  // Fetch AboutUs data from /general/about-us endpoint
  const aboutUsPromise = getData("general/about-us");
  // ContactUs uses boilerplate UI - no backend fetch needed
  // Later: add getData("general/contact-us") when backend is ready
  const categoriesPromise = getData("categories");
  const subCategoriesPromise = getData("sub-categories");
  const assetsPromise = getData("assets");
  const footerPagesPromise = getData("pages");
  const socialsPromise = getData("social");
  const supportedByPromise = getData("supportedby");
  const blogsPromise = getData("blogs");

  // Parallel fetch all data (Promise.all waits for all to complete)
  const [
    aboutUs,
    categories,
    subCategories,
    assets,
    footerPages,
    socials,
    supportedby,
    blogs,
  ] = await Promise.all([
    aboutUsPromise,
    categoriesPromise,
    subCategoriesPromise,
    assetsPromise,
    footerPagesPromise,
    socialsPromise,
    supportedByPromise,
    blogsPromise,
  ]);

  // Only show full-screen error if the primary backend connection completely failed
  if (!categories && !assets && !subCategories) {
    return (
      <html lang="en" className={`${inter.variable} antialiased font-sans`}>
        <body className="antialiased font-sans">
          <ErrorFallback />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${inter.variable} antialiased font-sans`}>
      <head>
        <link rel="preconnect" href="https://api.sketchshaper.com" />
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5557791257949251"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="sticky top-0 z-50">
            <Navbar
              categories={categories?.data || []}
              subCategories={subCategories?.data || []}
              assets={assets?.data || []}
              footerPages={footerPages?.data || []}
            />
          </div>

          {children}

          {/* About Us Section - from backend /general/about-us */}
          {aboutUs?.data && <AboutUs aboutUs={aboutUs.data} />}
          {/* Contact Us Section - Boilerplate UI (no backend data needed yet) */}
          <ContactUs />
          {supportedby?.data && <SupportedBy supportedby={supportedby.data} />}
          {blogs?.data?.length > 0 && <Blogs blogs={blogs.data} />}
          <Footer
            categories={categories?.data || []}
            footerPages={footerPages?.data || []}
            socials={socials?.data || []}
          />
        </Providers>
        <GoogleAnalytics gaId="G-JCLNX11Z2V" />
      </body>
    </html>
  );
}

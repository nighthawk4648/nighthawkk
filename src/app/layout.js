import Footer from "@/components/Shared/Footer/Footer";
import Navbar from "@/components/Shared/Navbar/Navbar";
import getData from "@/utils/getData";
import "./globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import { ErrorFallback } from "@/components/Shared/ErrorFallback/ErrorFallback";
import Providers from "@/components/Providers";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "../../public/fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../../public/fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

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
      metadataBase: new URL("https://www.sketchshaper.com"),
      title: applicationSettings?.data?.site_name || "SketchShaper",
      description:
        applicationSettings?.data?.site_description ||
        "Free & Pro 3D Models, Textures, and Plugins for SketchUp",
    };
  } catch (e) {
    return {
      metadataBase: new URL("https://www.sketchshaper.com"),
      title: "SketchShaper",
      description: "Free & Pro 3D Models, Textures, and Plugins for SketchUp",
    };
  }
}

export default async function RootLayout({ children }) {
  const categoriesPromise = getData("categories");
  const subCategoriesPromise = getData("sub-categories");
  const footerPagesPromise = getData("pages");
  const socialsPromise = getData("social");

  // Parallel fetch data required by Navbar and Footer
  const [
    categories,
    subCategories,
    footerPages,
    socials,
  ] = await Promise.all([
    categoriesPromise,
    subCategoriesPromise,
    footerPagesPromise,
    socialsPromise,
  ]);

  // Only show full-screen error if the primary backend connection completely failed
  if (!categories && !subCategories) {
    return (
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <body className={`${geistSans.className} antialiased font-sans`}>
          <ErrorFallback />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
      <head>
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fundingchoicesmessages.google.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5557791257949251"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={geistSans.className}>
        <Providers>
          <Navbar
            categories={categories?.data || []}
            subCategories={subCategories?.data || []}
            footerPages={footerPages?.data || []}
          />

          {children}

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

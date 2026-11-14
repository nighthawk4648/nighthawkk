import Footer from "@/components/Shared/Footer/Footer";
import Navbar from "@/components/Shared/Navbar/Navbar";
import getData, { getOptional } from "@/utils/getData";
import "./globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import { ErrorFallback } from "@/components/Shared/ErrorFallback/ErrorFallback";
import Providers from "@/components/Providers";
import localFont from "next/font/local";
import { cleanText } from "@/utils/seo";

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

export async function generateMetadata() {
  let applicationSettings;
  try {
    applicationSettings = await getData("general/application-settings");
  } catch (e) {
    console.error("Failed to load site metadata:", e);
  }

  const siteName = "Sketch shaper";
  const description =
    cleanText(applicationSettings?.data?.site_description, 160) ||
    "Free and pro 3D models, textures, and plugins for SketchUp.";
  const defaultImage = "/assets/seo/social-card.png";

  return {
    metadataBase: new URL("https://www.sketchshaper.com"),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      title: siteName,
      description,
      siteName,
      type: "website",
      images: [{ url: defaultImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [defaultImage],
    },
  };
}

export default async function RootLayout({ children }) {
  const categoriesPromise = getData("categories/nav");
  // Only the navbar's featured card: the navbar has its own fallback if this fails
  const featuredAssetPromise = getOptional("assets/247");
  const footerPagesPromise = getData("pages");
  const socialsPromise = getData("social");

  // Parallel fetch data required by Navbar and Footer
  const [categories, featuredAsset, footerPages, socials] = await Promise.all([
    categoriesPromise,
    featuredAssetPromise,
    footerPagesPromise,
    socialsPromise,
  ]);

  // The Navbar is a client component: send only the fields its featured card reads
  const featuredAssetData = featuredAsset?.data;
  const featuredSub = featuredAssetData?.sub_category;
  const featuredCard = featuredAssetData && {
    id: featuredAssetData.id,
    name: featuredAssetData.name,
    slug: featuredAssetData.slug,
    cover: featuredAssetData.cover,
    access_type: featuredAssetData.access_type,
    size: featuredAssetData.size,
    file: featuredAssetData.file && { file_size: featuredAssetData.file.file_size },
    sub_category: featuredSub && {
      name: featuredSub.name,
      slug: featuredSub.slug,
      category: featuredSub.category && {
        name: featuredSub.category.name,
        slug: featuredSub.category.slug,
      },
    },
  };

  // getData throws on backend failures (global-error.jsx handles those); null here means the nav data is missing (404)
  if (!categories) {
    return (
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <body className={`${geistSans.className} antialiased font-sans`}>
          <ErrorFallback />
        </body>
      </html>
    );
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
    >
      <head>
        {process.env.NODE_ENV === "production" && (
          <>
            <link
              rel="preconnect"
              href="https://fundingchoicesmessages.google.com"
            />
            <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5557791257949251"
              crossOrigin="anonymous"
            ></script>
          </>
        )}
      </head>
      <body className={geistSans.className}>
        <Providers>
          <Navbar
            categories={categories?.data || []}
            featuredAsset={featuredCard || null}
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

import AboutUs from "@/components/Shared/AboutUs/AboutUs";
import Footer from "@/components/Shared/Footer/Footer";
import Navbar from "@/components/Shared/Navbar/Navbar";
import getData from "@/utils/getData";
import { Inter } from "next/font/google";
import "./globals.css";

import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

const applicationSettings = await getData('general/application-settings')

export const metadata = {
  title: `${applicationSettings?.data?.site_name}`,
  description: `${applicationSettings?.data?.site_description}`,
};


<link rel="icon" href="/favicon.ico" sizes="any" />


export default async function RootLayout({ children }) {

  const dataPromise = await getData('general/application-settings');
  const aboutUsPromise = await getData('general/about-us');
  const categoriesPromise = await getData('categories');
  const subCategoriesPromise = await getData('sub-categories');
  const assetsPromise = await getData('assets');
  const footerPagesPromise = await getData('pages');
  const socialsPromise = await getData('social');
  const applicationSettingsPromise = await getData('general/application-settings')



  const [data, aboutUs, categories, subCategories, assets, footerPages, socials, applicationSettings] = await Promise.all([
    dataPromise,
    aboutUsPromise,
    categoriesPromise,
    subCategoriesPromise,
    assetsPromise,
    footerPagesPromise,
    socialsPromise,
    applicationSettingsPromise
  ]);


  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="sticky top-0 z-50">
          <Navbar
            categories={categories?.data}
            subCategories={subCategories?.data}
            assets={assets?.data}
            footerPages={footerPages?.data}
          />
        </div>

        {children}

        <AboutUs aboutUs={aboutUs?.data} />
        <Footer
          categories={categories?.data}
          footerPages={footerPages?.data}
          socials={socials?.data}
        />
      </body>

      <GoogleAnalytics gaId="G-JCLNX11Z2V" />
    </html>
  );
}

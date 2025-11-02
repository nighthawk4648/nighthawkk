import AboutUs from '@/components/Shared/AboutUs/AboutUs';
import Footer from '@/components/Shared/Footer/Footer';
import Navbar from '@/components/Shared/Navbar/Navbar';
import getData from '@/utils/getData';
import { Inter } from 'next/font/google';
import './globals.css';

// import Explore from '@/components/HomePage/Explore/Explore';
import Blogs from '@/components/Shared/Blogs/Blogs';
import SupportedBy from '@/components/Shared/SupportedBy/SupportedBy';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ErrorFallback } from '@/components/Shared/ErrorFallback/ErrorFallback ';
import Providers from '@/components/Providers';

const inter = Inter({ 
	subsets: ['latin'],
	display: 'swap', // Prevents invisible text during font load
	preload: true,
	variable: '--font-inter'
});

const applicationSettings = await getData('general/application-settings');

export const metadata = {
	title: `${applicationSettings?.data?.site_name}`,
	description: `${applicationSettings?.data?.site_description}`,
};

{
	/* <link rel="icon" href="./icon.ico" sizes="any" /> */
}

export default async function RootLayout({ children }) {
	const dataPromise = await getData('general/application-settings');
	const aboutUsPromise = await getData('general/about-us');
	const categoriesPromise = await getData('categories');
	const subCategoriesPromise = await getData('sub-categories');
	const assetsPromise = await getData('assets');
	const footerPagesPromise = await getData('pages');
	const socialsPromise = await getData('social');
	const applicationSettingsPromise = await getData(
		'general/application-settings'
	);
	const supportedByPromise = await getData('supportedby');
	const blogsPromise = await getData('blogs');

	const [
		data,
		aboutUs,
		categories,
		subCategories,
		assets,
		footerPages,
		socials,
		applicationSettings,
		supportedby,
		blogs,
	] = await Promise.all([
		dataPromise,
		aboutUsPromise,
		categoriesPromise,
		subCategoriesPromise,
		assetsPromise,
		footerPagesPromise,
		socialsPromise,
		applicationSettingsPromise,
		supportedByPromise,
		blogsPromise,
	]);

	if (!data || !aboutUs || !categories || !subCategories || !assets || !footerPages || !socials || !applicationSettings || !supportedby || !blogs) {
		return (
			<html lang="en">
				<body className={inter.className}>
					<ErrorFallback />
				</body>
			</html>
		);
	}

	return (
		<html lang="en" className={inter.variable}>
			<head>
				{/* Preconnect to external domains */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link rel="preconnect" href="https://api.sketchshaper.com" />
				<link rel="preconnect" href="https://ik.imagekit.io" />
				
				{/* DNS prefetch for third-party resources */}
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
							categories={categories?.data}
							subCategories={subCategories?.data}
							assets={assets?.data}
							footerPages={footerPages?.data}
						/>
					</div>

					{children}

					<AboutUs aboutUs={aboutUs?.data} />
					<SupportedBy supportedby={supportedby?.data} />
					{/* <Explore categories={categories?.data} /> */}
					<Blogs blogs={blogs?.data} />
					<Footer
						categories={categories?.data}
						footerPages={footerPages?.data}
						socials={socials?.data}
					/>
				</Providers>
				<GoogleAnalytics gaId="G-JCLNX11Z2V" />
			</body>
		</html>
	);
}

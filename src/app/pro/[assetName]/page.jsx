export const dynamic = 'force-dynamic';

import { SketchShaperProFiles } from '@/components/SketchShaperProFiles/SketchShaperProFiles';
import getData from '@/utils/getData';
import { notFound } from 'next/navigation';
import { getCleanMetadata } from '@/utils/seo';
import slugify from '@/utils/slugify';


export async function generateMetadata({ params }) {
    const { assetName } = params;
    const categoryId = assetName?.split("-").slice(-1);

    const metaSettings = await getData(`sketchshaper-pro-categories/${categoryId}`);
    
    if (!metaSettings || !metaSettings?.data) {
        return {
            title: 'Page Not Found',
            description: 'This page does not exist.',
            robots: {
                index: false,
                follow: false,
            },
        };
    }
    
    // Validate slug
    const expectedSlug = `${slugify(metaSettings.data.name)}-${metaSettings.data.id}`;
    if (assetName !== expectedSlug) {
        return {
            title: 'Page Not Found',
            description: 'This page does not exist.',
            robots: { index: false, follow: false },
        };
    }

    const metaTitle = metaSettings?.data?.meta_title;
    const metaDescription = metaSettings?.data?.meta_description;
    const pathname = `/pro/${assetName}`;

    return getCleanMetadata(pathname, {
        title: `${metaTitle}`,
        description: `${metaDescription}`,
    });
}

const Page = async ({ params }) => {

    const { assetName } = params;
    const categoryId = assetName?.split("-").slice(-1);

    const categoryData = await getData(`sketchshaper-pro-categories/${categoryId}`);
    
    if (!categoryData || !categoryData?.data) {
        notFound();
    }

    // Validate slug
    const expectedSlug = `${slugify(categoryData.data.name)}-${categoryData.data.id}`;
    if (assetName !== expectedSlug) {
        notFound();
    }

    return (
        <div>
            <SketchShaperProFiles categoryId={categoryId} />
        </div>

    );
};

export default Page;
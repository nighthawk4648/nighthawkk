export const dynamic = 'force-dynamic';

import SubCategory from '@/components/SubCategory/SubCategory/SubCategory';
import { notFound } from 'next/navigation';
import { validateCategory, notFoundMeta } from '@/utils/validateSlug';
import { getCleanMetadata } from '@/utils/seo';

export async function generateMetadata({ params }) {
    const { category } = params;

    const categoryData = await validateCategory(category);
    if (!categoryData) return notFoundMeta;

    const pathname = `/${category}`;
    
    return getCleanMetadata(pathname, {
        title: `${categoryData.data?.meta_title}`,
        description: `${categoryData.data?.meta_description}`,
    });
}


const Page = async ({ params }) => {
    const { category } = params;

    const categoryData = await validateCategory(category);
    if (!categoryData) notFound();

    return (
        <div>
            <SubCategory subCategoriesByCategoryId={categoryData} />
        </div>
    );
};

export default Page;
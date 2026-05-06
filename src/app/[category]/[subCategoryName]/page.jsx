export const dynamic = 'force-dynamic';

import SingleSubCategoryPage from '@/components/SubCategory/SubCategory/SingleSubCategoryPage';
import { notFound } from 'next/navigation';
import { validateSubCategory, notFoundMeta } from '@/utils/validateSlug';


export async function generateMetadata({ params }) {
    const { category, subCategoryName } = params;

    const result = await validateSubCategory(category, subCategoryName);
    if (!result) return notFoundMeta;

    return {
        title: `${result.subCategoryData.data?.meta_title}`,
        description: `${result.subCategoryData.data?.meta_description}`,
    };
}


const Page = async ({ params }) => {
    const { category, subCategoryName } = params;

    const result = await validateSubCategory(category, subCategoryName);
    if (!result) notFound();

    const categoryId = category?.split("-").slice(-1)?.[0];
    const subCategoryId = subCategoryName?.split("-").slice(-1)?.[0];

    return (
        <div>
            <SingleSubCategoryPage categoryId={categoryId} subCategoryId={subCategoryId} />
        </div>
    );
};

export default Page;
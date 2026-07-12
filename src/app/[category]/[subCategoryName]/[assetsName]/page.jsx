
export const dynamic = 'force-dynamic';

import SubCategoryDetails from '@/components/SubCategory/SubCategoryDetails/SubCategoryDetails';
import { notFound } from 'next/navigation';
import { getCleanMetadata } from '@/utils/seo';
import { validateAsset, notFoundMeta } from '@/utils/validateSlug';


export async function generateMetadata({ params }) {
    const { assetsName, category, subCategoryName } = params;

    const assetData = await validateAsset(category, subCategoryName, assetsName);
    if (!assetData) return notFoundMeta;

    const pathname = `/${category}/${subCategoryName}/${assetsName}`;

    return getCleanMetadata(pathname, {
        title: `${assetData.data?.meta_title}`,
        description: `${assetData.data?.meta_description}`,
    });
}


const Page = async ({ params }) => {
    const { assetsName, category, subCategoryName } = params;

    const assetData = await validateAsset(category, subCategoryName, assetsName);
    if (!assetData) notFound();

    return (
        <div className=''>
            <SubCategoryDetails assetDetails={assetData?.data} />
        </div>
    );
};

export default Page;
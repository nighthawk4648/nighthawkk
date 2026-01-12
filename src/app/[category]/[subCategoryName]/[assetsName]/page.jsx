
import { ErrorFallback } from '@/components/Shared/ErrorFallback/ErrorFallback ';
import SubCategoryDetails from '@/components/SubCategory/SubCategoryDetails/SubCategoryDetails';
import getData from '@/utils/getData';
import { notFound } from 'next/navigation';
import { getCleanMetadata } from '@/utils/seo';



export async function generateMetadata({ params }) {
    const { assetsName, category, subCategoryName } = params;
    const assetId = assetsName?.split("-").slice(-1);

    const metaSettings = await getData(`assets/${assetId}`);
    
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
    
    const metaTitle = metaSettings?.data?.meta_title;
    const metaDescription = metaSettings?.data?.meta_description;
    const pathname = `/${category}/${subCategoryName}/${assetsName}`;

    return getCleanMetadata(pathname, {
        title: `${metaTitle}`,
        description: `${metaDescription}`,
    });
}




const Page = async ({params}) => {


    const {assetsName} = params;
    
    const assetId = assetsName?.split("-").slice(-1);

    const assetDetails = await getData(`assets/${assetId}`);

    if (!assetDetails || !assetDetails?.data) {
        notFound();
    }

   
    return (
        <div className=''>
            <SubCategoryDetails assetDetails={assetDetails?.data}   />
        </div>
    );
};

export default Page;
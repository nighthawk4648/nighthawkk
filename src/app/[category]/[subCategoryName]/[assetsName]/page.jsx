
import { ErrorFallback } from '@/components/Shared/ErrorFallback/ErrorFallback ';
import SubCategoryDetails from '@/components/SubCategory/SubCategoryDetails/SubCategoryDetails';
import getData from '@/utils/getData';



export async function generateMetadata({ params }) {
    const { assetsName } = params;
    const assetId = assetsName?.split("-").slice(-1);

    const metaSettings = await getData(`assets/${assetId}`);
    const metaTitle = metaSettings?.data?.meta_title;
    const metaDescription = metaSettings?.data?.meta_description;

    return {
        title: `${metaTitle}`,
        description: `${metaDescription}`,
    };
}




const Page = async ({params}) => {


    const {assetsName} = params;
    
    const assetId = assetsName?.split("-").slice(-1);

    const assetDetails = await getData(`assets/${assetId}`);

    if (!assetDetails) {
        return <ErrorFallback />
    }

   
    return (
        <div className=''>
            <SubCategoryDetails assetDetails={assetDetails?.data}   />
        </div>
    );
};

export default Page;
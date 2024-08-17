
import SubCategoryDetails from '@/components/SubCategory/SubCategoryDetails/SubCategoryDetails';
import getData from '@/utils/getData';



export async function generateMetadata({ params }) {
    const { assetsName } = params;
    const assetId = assetsName?.split("-").slice(-1);

    const metaSettings = await getData(`assets/${assetId}`); // Replace with actual call to fetch site settings
    const metaTitle = metaSettings?.data?.meta_title;
    const metaDescription = metaSettings?.data?.meta_description;

    // console.log("metaTitle", metaSettings?.data?.meta_title);

    return {
        title: `${metaTitle}`,
        description: `${metaDescription}`,
    };
}




const Page = async ({params}) => {


    const {assetsName} = params;
    
    const assetId = assetsName?.split("-").slice(-1);

    const assetDetails = await getData(`assets/${assetId}`);

   
    return (
        <div className=''>
            <SubCategoryDetails assetDetails={assetDetails?.data}   />
        </div>
    );
};

export default Page;
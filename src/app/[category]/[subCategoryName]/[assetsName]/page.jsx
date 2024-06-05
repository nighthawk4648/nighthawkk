
import SubCategoryDetails from '@/components/SubCategory/SubCategoryDetails/SubCategoryDetails';
import getData from '@/utils/getData';

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
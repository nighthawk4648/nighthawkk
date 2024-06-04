
import SubCategoryDetails from '@/components/SubCategory/SubCategoryDetails/SubCategoryDetails';
import getData from '@/utils/getData';

const Page = async ({params}) => {


    const {assetsName} = params;
    
    const assetId = assetsName?.split("-").slice(-1);

    const assetDetails = await getData(`categories/${categoryId}`);

   
    return (
        <div className=''>
            <SubCategoryDetails/>
        </div>
    );
};

export default Page;
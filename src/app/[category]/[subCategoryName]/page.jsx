import SingleSubCategoryPage from '@/components/SubCategory/SubCategory/SingleSubCategoryPage';
import getData from '@/utils/getData';
import React from 'react';


export async function generateMetadata({ params }) {

    const {category, subCategoryName} = params;

    const subCategoryId = subCategoryName?.split("-").slice(-1);

    const metaSettings = await getData(`sub-categories/${subCategoryId}`); // Replace with actual call to fetch site settings
    const metaTitle = metaSettings?.data?.meta_title;
    const metaDescription = metaSettings?.data?.meta_description;

    return {
        title: `${metaTitle}`,
        description: `${metaDescription}`,
    };
}



const Page = ({params}) => {

    const {category, subCategoryName} = params;

    const categoryId = category?.split("-").slice(-1);

    const subCategoryId = subCategoryName?.split("-").slice(-1);

    


    return (
        <div>
            <SingleSubCategoryPage categoryId={categoryId} subCategoryId={subCategoryId} />
        </div>
    );
};

export default Page;
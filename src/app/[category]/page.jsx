import SubCategory from '@/components/SubCategory/SubCategory/SubCategory';
import getData from '@/utils/getData';
import React from 'react';


// export const metadata = {
//     title: `${applicationSettings?.data?.site_name}`,
//     description: `${applicationSettings?.data?.site_description}`,
// };

export async function generateMetadata({ params }) {
    const { category } = params;
    const categoryId = category?.split("-").slice(-1);

    console.log("looking ", categoryId);

    const metaSettings = await getData(`categories/${categoryId}`); // Replace with actual call to fetch site settings
    const metaTitle = metaSettings?.data?.meta_title;
    const metaDescription = metaSettings?.data?.meta_description;

    return {
        title: `${metaTitle}`,
        description: `${metaDescription}`,
    };
}

const Page = async ({ params }) => {

    const { category } = params;

    const categoryId = category?.split("-").slice(-1);


    const subCategoriesByCategoryId = await getData(`categories/${categoryId}`);



    return (
        <div>
            <SubCategory subCategoriesByCategoryId={subCategoriesByCategoryId} />
        </div>
    );
};

export default Page;
import { ErrorFallback } from '@/components/Shared/ErrorFallback/ErrorFallback ';
import SubCategory from '@/components/SubCategory/SubCategory/SubCategory';
import getData from '@/utils/getData';
import React from 'react';


export async function generateMetadata({ params }) {
    const { category } = params;
    const categoryId = category?.split("-").slice(-1);

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

    if (!subCategoriesByCategoryId) {
        return <ErrorFallback />
    }

    return (
        <div>
            <SubCategory subCategoriesByCategoryId={subCategoriesByCategoryId} />
        </div>
    );
};

export default Page;
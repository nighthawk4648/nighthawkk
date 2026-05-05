export const dynamic = 'force-dynamic';

import SingleSubCategoryPage from '@/components/SubCategory/SubCategory/SingleSubCategoryPage';
import getData from '@/utils/getData';
import { notFound } from 'next/navigation';
import slugify from '@/utils/slugify';
import React from 'react';


export async function generateMetadata({ params }) {

    const {category, subCategoryName} = params;

    const subCategoryId = subCategoryName?.split("-").slice(-1);

    const metaSettings = await getData(`sub-categories/${subCategoryId}`);
    
    // If sub-category doesn't exist, return noindex metadata
    if (!metaSettings || !metaSettings?.data) {
        return {
            title: 'Page Not Found',
            description: 'This page does not exist.',
            robots: { index: false, follow: false },
        };
    }
    
    // Validate slug
    const expectedSlug = `${slugify(metaSettings.data.name)}-${metaSettings.data.id}`;
    if (subCategoryName !== expectedSlug) {
        return {
            title: 'Page Not Found',
            description: 'This page does not exist.',
            robots: { index: false, follow: false },
        };
    }

    const metaTitle = metaSettings?.data?.meta_title;
    const metaDescription = metaSettings?.data?.meta_description;

    return {
        title: `${metaTitle}`,
        description: `${metaDescription}`,
    };
}



const Page = async ({params}) => {

    const {category, subCategoryName} = params;

    const categoryId = category?.split("-").slice(-1);
    const subCategoryId = subCategoryName?.split("-").slice(-1);

    // Validate category exists
    const categoryData = await getData(`categories/${categoryId}`);
    if (!categoryData || !categoryData?.data) {
        notFound();
    }
    const expectedCategorySlug = `${slugify(categoryData.data.name)}-${categoryData.data.id}`;
    if (category !== expectedCategorySlug) {
        notFound();
    }

    // Validate sub-category exists
    const subCategoryData = await getData(`sub-categories/${subCategoryId}`);
    if (!subCategoryData || !subCategoryData?.data) {
        notFound();
    }
    const expectedSubCategorySlug = `${slugify(subCategoryData.data.name)}-${subCategoryData.data.id}`;
    if (subCategoryName !== expectedSubCategorySlug) {
        notFound();
    }

    return (
        <div>
            <SingleSubCategoryPage categoryId={categoryId} subCategoryId={subCategoryId} />
        </div>
    );
};

export default Page;
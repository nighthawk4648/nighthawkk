export const dynamic = 'force-dynamic';

import SubCategory from '@/components/SubCategory/SubCategory/SubCategory';
import getData from '@/utils/getData';
import { notFound } from 'next/navigation';
import slugify from '@/utils/slugify';
import React from 'react';


export async function generateMetadata({ params }) {
    const { category } = params;
    const categoryId = category?.split("-").slice(-1);

    const metaSettings = await getData(`categories/${categoryId}`);
    
    // If category doesn't exist, return noindex metadata
    if (!metaSettings || !metaSettings?.data) {
        return {
            title: 'Page Not Found',
            description: 'This page does not exist.',
            robots: { index: false, follow: false },
        };
    }
    
    // Validate that the URL slug matches the expected slug
    const expectedSlug = `${slugify(metaSettings.data.name)}-${metaSettings.data.id}`;
    if (category !== expectedSlug) {
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


const Page = async ({ params }) => {

    const { category } = params;

    const categoryId = category?.split("-").slice(-1);

    const subCategoriesByCategoryId = await getData(`categories/${categoryId}`);

    // Return 404 if category doesn't exist
    if (!subCategoriesByCategoryId || !subCategoriesByCategoryId?.data) {
        notFound();
    }

    // Validate the full URL slug matches the expected slug
    // e.g. "sketchup-3d-models-3" should only work if category 3's name slugifies to "sketchup-3d-models"
    const expectedSlug = `${slugify(subCategoriesByCategoryId.data.name)}-${subCategoriesByCategoryId.data.id}`;
    if (category !== expectedSlug) {
        notFound();
    }

    return (
        <div>
            <SubCategory subCategoriesByCategoryId={subCategoriesByCategoryId} />
        </div>
    );
};

export default Page;
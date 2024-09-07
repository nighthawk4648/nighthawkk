import SingleSubCategoryPage from '@/components/SubCategory/SubCategory/SingleSubCategoryPage';
import React from 'react';

const Page = ({params}) => {

    console.log("params", params);

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
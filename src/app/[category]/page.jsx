import SubCategory from '@/components/SubCategory/SubCategory/SubCategory';
import getData from '@/utils/getData';
import React from 'react';

const Page = async ({params}) => {

    const { category } = params;

    const categoryId = category?.split("-").slice(-1);
   

    const subCategoriesByCategoryId = await getData(`categories/${categoryId}`);
  


    return (
        <div>
            <SubCategory subCategoriesByCategoryId= {subCategoriesByCategoryId}   />
        </div>
    );
};

export default Page;
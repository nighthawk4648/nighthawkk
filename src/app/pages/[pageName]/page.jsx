import getData from '@/utils/getData';
import React from 'react';

const Page = async ({params}) => {
    
    const {pageName}= params;
    
    const pageId = pageName?.split("-").slice(-1);
   

    const footerPage = await getData(`pages/${pageId}`);

    return (
        <div  dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}  ></div>
    );
};

export default Page;
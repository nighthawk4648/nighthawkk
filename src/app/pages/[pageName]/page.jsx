import getData from '@/utils/getData';
import React from 'react';

const Page = async ({params}) => {
    
    const {pageName}= params;
    
    const pageId = pageName?.split("-").slice(-1);
   

    const footerPage = await getData(`pages/${1}`);

    return (
        <div className='mx-[20px] '>
            {  footerPage?.data?.content && <div  dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}  ></div> }
        </div>
    );
};

export default Page;
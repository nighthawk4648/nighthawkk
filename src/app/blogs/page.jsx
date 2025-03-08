

import getData from '@/utils/getData';
import React from 'react';

const Blogs = async () => {


    const footerPage = await getData(`pages/${5}`);

    return (
        <div className='mx-[20px] '>
            {footerPage?.data?.content && <div dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}  ></div>}
        </div>
    );
};

export default Blogs;
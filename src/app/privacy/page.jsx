

import getData from '@/utils/getData';
import React from 'react';

export const metadata = {
    title: 'Privacy Policy',
    
    description: 'Read out privacy policy include third party services',
};
const privacy = async () => {


    const footerPage = await getData(`pages/${3}`);

    return (
        <div className='bg-[#141414] text-white p-4 flex flex-col items-center'>
            {footerPage?.data?.content && <div dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}  ></div>}
        </div>
    );
};

export default privacy;
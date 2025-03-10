

import getData from '@/utils/getData';
import React from 'react';

export const metadata = {
    title: 'Privacy Policy',
    description: 'Read out privacy policy include third party services',
  };
  

const privacy = async () => {


    const footerPage = await getData(`pages/${3}`);

    return (
        <div className='mx-[20px] '>
            {footerPage?.data?.content && <div dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}  ></div>}
        </div>
    );
};

export default privacy;
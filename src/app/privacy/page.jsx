

import getData from '@/utils/getData';
import React from 'react';

export const metadata = {
    title: 'Privacy Policy',
<<<<<<< HEAD
    description: 'Read out privacy policy include third party services',
  };
  

=======
    description: 'Read out privacy policy include third party services',
  };
>>>>>>> 61538d4e56811bc55c0254461b30b9946c7458e6
const privacy = async () => {


    const footerPage = await getData(`pages/${3}`);

    return (
        <div className='mx-[20px] '>
            {footerPage?.data?.content && <div dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}  ></div>}
        </div>
    );
};

export default privacy;
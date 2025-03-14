import getData from '@/utils/getData';
import React from 'react';

export const metadata = {
<<<<<<< HEAD
    title: 'About/Connect',
    description: '',
  };
  
=======
    title: 'About/Contact',
    description: '',
  };
>>>>>>> 61538d4e56811bc55c0254461b30b9946c7458e6

const AboutUs = async () => {


    const footerPage = await getData(`pages/${1}`);

    return (
        <div className='mx-[20px] '>
            {footerPage?.data?.content && <div dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}  ></div>}
        </div>
    );
};

export default AboutUs;
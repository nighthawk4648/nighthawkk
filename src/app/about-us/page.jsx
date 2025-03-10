import getData from '@/utils/getData';
import React from 'react';

export const metadata = {
    title: 'About/Contact',
    description: '',
  };

const AboutUs = async () => {


    const footerPage = await getData(`pages/${1}`);

    return (
        <div className='mx-[20px] '>
            {footerPage?.data?.content && <div dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}  ></div>}
        </div>
    );
};

export default AboutUs;
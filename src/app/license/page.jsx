import getData from '@/utils/getData';
import React from 'react';

export const metadata = {
    title: 'License',

    description: 'CCO means absolute freedom',
};
const License = async () => {


    const footerPage = await getData(`pages/${2}`);

    return (
        <div className='mx-[20px] '>
            {footerPage?.data?.content && <div dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}  ></div>}
        </div>
    );
};

export default License;
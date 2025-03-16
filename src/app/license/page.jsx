import getData from '@/utils/getData';
import React from 'react';

export const metadata = {
    title: 'License',
<<<<<<< HEAD
    description: 'CCO means absolute freedom',
  };
  

=======
    description: 'CCO means absolute freedom',
  };
>>>>>>> 61538d4e56811bc55c0254461b30b9946c7458e6
const License = async () => {


    const footerPage = await getData(`pages/${2}`);

    return (
        <div className='mx-[20px] '>
            {footerPage?.data?.content && <div dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}  ></div>}
        </div>
    );
};

export default License;
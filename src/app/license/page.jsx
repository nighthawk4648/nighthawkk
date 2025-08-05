import { ErrorFallback } from '@/components/Shared/ErrorFallback/ErrorFallback ';
import getData from '@/utils/getData';
import React from 'react';

export const metadata = {
    title: 'License',

    description: 'CCO means absolute freedom',
};
const License = async () => {


    const footerPage = await getData(`pages/${2}`);

    if (!footerPage) {
        return <ErrorFallback />
    }

    return (
        <div className='bg-[#141414] text-white p-4 flex flex-col items-center'>
            {footerPage?.data?.content && <div dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}  ></div>}
        </div>
    );
};

export default License;
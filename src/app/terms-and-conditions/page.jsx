
import { ErrorFallback } from '@/components/Shared/ErrorFallback/ErrorFallback ';
import getData from '@/utils/getData';
import React from 'react';

export const metadata = {
    title: 'Terms and Conditions',
    
    description: '',
 };

const TermsAndCondition = async () => {


    const footerPage = await getData(`pages/${4}`);

    if (!footerPage) {
        return <ErrorFallback />
    }

    return (
        <div className='bg-[#141414] text-white p-4 flex flex-col items-center'>
            {footerPage?.data?.content && <div dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}  ></div>}
        </div>
    );
};

export default TermsAndCondition;
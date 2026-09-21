

import { ErrorFallback } from '@/components/Shared/ErrorFallback/ErrorFallback';
import getData from '@/utils/getData';
import React from 'react';

export const metadata = {
    title: 'Privacy Policy',
    
    description: 'Read out privacy policy include third party services',
};
const privacy = async () => {


    const footerPage = await getData(`pages/${3}`);

    if (!footerPage) {
        return <ErrorFallback />
    }

    return (
        <div className='bg-[#141414] text-white py-10'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='max-w-4xl mx-auto rounded-3xl border border-white/10 bg-slate-950/95 p-8 shadow-2xl'>
                    <h1 className='text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6'>Privacy Policy</h1>
                    <div className='blog-content text-slate-200 leading-8'>
                        {footerPage?.data?.content && <div dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default privacy;
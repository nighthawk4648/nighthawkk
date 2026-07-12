import { ErrorFallback } from '@/components/Shared/ErrorFallback/ErrorFallback';
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

    const normalizeLicenseContent = (html) => {
        if (!html) return html;
        return html
            .replace(/https:\/\/chooser-beta\.creativecommons\.org\/img\/cc-logo\.[^"']+\.(svg|png)/g, '/assets/licenses/cc-logo.svg')
            .replace(/https:\/\/chooser-beta\.creativecommons\.org\/img\/cc-zero\.[^"']+\.(svg|png)/g, '/assets/licenses/cc-zero.svg');
    };

    const licenseContent = normalizeLicenseContent(footerPage?.data?.content);

    return (
        <div className='bg-[#141414] text-white py-10'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='max-w-4xl mx-auto rounded-3xl border border-white/10 bg-slate-950/95 p-8 shadow-2xl'>
                    <h1 className='text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6'>License</h1>
                    <div className='blog-content text-slate-200 leading-8'>
                        {licenseContent && <div dangerouslySetInnerHTML={{ __html: licenseContent }} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default License;
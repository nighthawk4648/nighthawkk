
// import getData from '@/utils/getData';
// import React from 'react';

// // const applicationSettings = await getData('general/application-settings')

// export const metadata = {
//     title: 'Blogs',
//     description: 'Read our blog',
// };


// const Blogs = async () => {
//     const footerPage = await getData(`pages/${5}`);

//     return (
//         <div className='mx-[20px]'>
//             {footerPage?.data?.content && <div dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}></div>}
//         </div>
//     );
// };

// export default Blogs;




import MaterialCardsGrid from '@/components/BlogMaterialCard/MaterialGrid/MaterialCardGrid';
import getData from '@/utils/getData';
import React from 'react';

// const applicationSettings = await getData('general/application-settings')

export const metadata = {
    title: 'Blogs',
    description: 'Read our blog',
};

const Blogs = async () => {
    const footerPage = await getData(`pages/${5}`);

    return (
        <div className='mx-[20px]'>
            {/* {footerPage?.data?.content && <div dangerouslySetInnerHTML={{ __html: footerPage?.data?.content }}></div>} */}

            {/* Material Cards Grid */}
            <div className="m-12">
                <h2 className="text-2xl font-bold mb-4">Blogs</h2>
                <MaterialCardsGrid />
            </div>
        </div>
    );
};

export default Blogs;
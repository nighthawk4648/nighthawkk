// import React from 'react';
// import bgBlack from '../../../../public/assets/bgImage/bgBlack.jpeg';

// const SupportedBy = () => {
//     return (
//         <div 
//             className="bg-cover bg-center w-full text-white "
//             style={{ 
//                 backgroundImage: `url('https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` 
//             }}
//         >
//             hello
//         </div>
//     );
// };

// export default SupportedBy;


import Image from 'next/image';
import { getOptimizedImageUrl } from '@/utils/cloudinary';
import React from 'react';
// import prime from '/assets/SupportedBy/prime.png';



const SupportedBy = ({ supportedby }) => {
   
    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    };

    return (
        <div>
            {
                supportedby?.map((support) => (
                    // <div className="bg-[url('/assets/bgImage/bgGray.jpeg')] bg-cover bg-center w-full text-white p-5">
                    <div className="bg-gradient-to-bl from-black via-gray-900 to-gray-900 text-white p-5 border-b-2 border-gray-500">
                        <h2 className='text-center font-semibold text-2xl '>{support?.title}</h2>
                        <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2 px-2 mt-5">
                            <Image
                                 src={getOptimizedImageUrl(getOriginalImageUrl(support.imageOne))}
                                alt={support?.short_description}
                                width={500}
                                height={500}
                                className='sm:w-[12.5px] sm:h-[12.5px] md:w-[50px] md:h-[50px] lg:w-[150px] lg:h-[150px] mx-auto'
                            />

                            <Image
                                src={getOptimizedImageUrl(getOriginalImageUrl(support.imageTwo))}
                                alt={support?.short_description}
                                width={500}
                                height={500}
                                className='sm:w-[12.5px] sm:h-[12.5px] md:w-[50px] md:h-[50px] lg:w-[150px] lg:h-[150px] mx-auto'
                            />

                            <Image
                                src={getOptimizedImageUrl(getOriginalImageUrl(support.imageThree))}
                                alt={support?.short_description}
                                width={500}
                                height={500}
                                className='sm:w-[12.5px] sm:h-[12.5px] md:w-[50px] md:h-[50px] lg:w-[150px] lg:h-[150px] mx-auto'
                            />

                            <Image
                                src={getOptimizedImageUrl(getOriginalImageUrl(support.imageFour))}
                                alt={support?.short_description}
                                width={500}
                                height={500}
                                className='sm:w-[12.5px] sm:h-[12.5px] md:w-[50px] md:h-[50px] lg:w-[150px] lg:h-[150px] mx-auto'
                            />

                            <Image
                                src={getOptimizedImageUrl(getOriginalImageUrl(support.imageFive))}
                                alt={support?.short_description}
                                width={500}
                                height={500}
                                className='sm:w-[12.5px] sm:h-[12.5px] md:w-[50px] md:h-[50px] lg:w-[150px] lg:h-[150px] mx-auto'
                            />
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default SupportedBy;
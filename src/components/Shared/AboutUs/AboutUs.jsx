import { getOptimizedImageUrl } from '@/utils/cloudinary';
import Image from 'next/image';
import React from 'react';

const AboutUs = ({ aboutUs }) => {
    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    };

    return (
        <div className="relative w-full min-h-[400px] bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 overflow-hidden shadow-2xl border border-gray-700/50 backdrop-blur-sm">
            {/* Background */}
           <div className="absolute inset-0">
    <Image
        src={getOptimizedImageUrl(getOriginalImageUrl(aboutUs?.cover))}
        fill
        className="object-cover opacity-100" // Slightly visible for better effect
        alt={aboutUs?.title}
    />
    {/* You can remove this overlay or lower its opacity */}
    
    
    {/* Decorative blobs */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
</div>


                    <div className="relative z-10 flex items-center justify-center min-h-[400px] p-6 md:p-12">
                <div className="max-w-3xl w-full space-y-8 text-center">
                    {/* Title & Short Description */}
                    {aboutUs?.title && (
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300 drop-shadow-xl">
                                {aboutUs.title}
                            </h1>
                            <div className="mx-auto w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mt-3 rounded-full"></div>
                        </div>
                    )}
                    {aboutUs?.short_description && (
                        <div className="backdrop-blur-sm bg-white/5 p-4 border border-white/10 shadow-xl rounded-lg">
                            <p className="text-gray-200/90 text-lg leading-relaxed">
                                {aboutUs.short_description}
                            </p>
                        </div>
                    )}

                    {/* Main HTML Content */}
                    {aboutUs?.content && (
                        <div className="backdrop-blur-sm bg-white/5 p-4 border border-white/10 shadow-xl rounded-lg text-gray-200/90 text-lg leading-relaxed">
                            <div
                                className="prose prose-invert max-w-none prose-headings:text-gray-100 prose-p:text-gray-200/90 prose-a:text-blue-400 prose-strong:text-white"
                                dangerouslySetInnerHTML={{ __html: aboutUs.content }}
                            />
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AboutUs;

// import { getOptimizedImageUrl } from '@/utils/cloudinary';
// import Image from 'next/image';
// import React from 'react';

// const AboutUs = ({ aboutUs }) => {

//     const getOriginalImageUrl = (imagePath) => {
//         return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
//     }; 

//     return (
//         // <div className="bg-[url('/assets/bgImage/bgBlack.jpeg')] bg-cover bg-center w-full text-white p-5">
//         <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-5">
//             {aboutUs?.title &&
//                 <div className=''>
//                     <p className='text-center font-semibold text-2xl text-white p-2 '>{aboutUs?.title}</p>
//                 </div>
//                 // <p className='text-center font-semibold text-2xl text-white p-2 '>{aboutUs?.title}</p>

//                 }

//             {
//                 aboutUs?.short_description && <p className='text-center mt-2 text-white'>{aboutUs?.short_description}</p>
//             }

//             <div className=' md:flex md:items-center md:gap-5  mt-5'>

//                 <div className='md:w-[50%] text-white text-justify'>
//                     {aboutUs?.content && <div dangerouslySetInnerHTML={{ __html: aboutUs?.content }} ></div>}
//                 </div>

//                 <div className='md:w-[50%] mx-auto md:mt-0 mt-10 md:flex md:items-center md:justify-center gap-5'>
//                     <div>
//                         <Image
//                                 src={getOptimizedImageUrl(getOriginalImageUrl(aboutUs?.cover))}
//                             height={800}
//                             width={1300}
//                             className='w-[300px] h-[300px] mx-auto rounded-full'
//                             alt={aboutUs?.title}
//                         ></Image>
//                     </div>

//                     {/* <p>{aboutUs?.name}</p> */}
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default AboutUs;


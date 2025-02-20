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
import React from 'react';
// import prime from '/assets/SupportedBy/prime.png';



const SupportedBy = ({ supportedby }) => {
    return (
        <div>
            {
                supportedby?.map((support) => (
                    // <div className="bg-[url('/assets/bgImage/bgGray.jpeg')] bg-cover bg-center w-full text-white p-5">
                    <div className="bg-[#141414] w-full text-white p-5">
                        <h2 className='text-center font-semibold text-2xl '>{support?.title}</h2>
                        <div className='grid grid-cols-2 lg:grid-cols-5 gap-5 mt-10'>
                            <Image
                                src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + support.imageOne}
                                alt={support?.short_description}
                                width={500}
                                height={500}
                                className='w-[200px] h-[200px] mx-auto'
                            />

                            <Image
                                src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + support.imageTwo}
                                alt={support?.short_description}
                                width={500}
                                height={500}
                                className='w-[200px] h-[200px] mx-auto'
                            />

                            <Image
                                src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + support.imageThree}
                                alt={support?.short_description}
                                width={500}
                                height={500}
                                className='w-[200px] h-[200px] mx-auto'
                            />

                            <Image
                                src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + support.imageFour}
                                alt={support?.short_description}
                                width={500}
                                height={500}
                                className='w-[200px] h-[200px] mx-auto'
                            />

                            <Image
                                src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + support.imageFive}
                                alt={support?.short_description}
                                width={500}
                                height={500}
                                className='w-[200px] h-[200px] mx-auto'
                            />
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default SupportedBy;
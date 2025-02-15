import Image from 'next/image';
import React from 'react';
import slugify from '@/utils/slugify';
import Link from 'next/link';

const NewAssets = ({ categories }) => {
    return (
        // <div className="bg-[url('/assets/bgImage/bgBlack.jpeg')] bg-cover bg-center w-full text-white p-5">
        <div className="bg-[#141414] text-white p-5">
            <div className='bg-thirdColor border-black'>
                <h2 className='text-center font-semibold text-2xl text-white p-2'>New Assets</h2>
            </div>
            {/* <h2 className='text-center font-semibold text-2xl text-white p-2'>New Assets</h2> */}


            <div className='grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-5 mt-10 w-full mx-auto'>
                {categories?.[2]?.sub_categories?.[0]?.assets?.slice(-6)?.map((assets) => ( // Adjusted slice(-3) to get last 3 items
                    <div key={assets?.id} className='mt-5'>
                        <Link href={`/${slugify(categories?.[2]?.name)}/${slugify(categories?.[2]?.sub_categories?.[0]?.name)}/${slugify(assets?.name)}-${assets?.id}`}>
                            {assets?.cover && (
                                <Image
                                    src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + assets?.cover}
                                    height={800}
                                    width={800}
                                    alt=''
                                    className='w-[150px] h-[150px] mx-auto rounded-md transform transition-transform duration-1000 hover:scale-150'
                                />
                            )}
                            <div className=' text-white text-center py-2 mx-auto'>
                                <p>{assets?.name}</p>
                            </div>
                        </Link>
                    </div>
                ))}

            </div>


            {/* <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 mt-10 w-full mx-auto'>
                {categories?.[2]?.sub_categories?.[1]?.assets?.slice(-4)?.map((assets) => ( // Adjusted slice(-3) to get last 3 items
                    <div key={assets?.id} className='mt-5'>
                        <Link href={`/${slugify(categories?.[2]?.name)}/${slugify(categories?.[2]?.sub_categories?.[0]?.name)}/${slugify(assets?.name)}-${assets?.id}`}>
                            {assets?.cover && (
                                <Image
                                    src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + assets?.cover}
                                    height={800}
                                    width={800}
                                    alt=''
                                    className='w-[150px] h-[150px]  mx-auto rounded-md'
                                />
                            )}
                            <div className=' text-white text-center py-2 mx-auto'>
                                <p>{assets?.name}</p>
                            </div>
                        </Link>
                    </div>
                ))}

            </div> */}



            <div className='grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-5 mt-10 w-full mx-auto'>
                {categories?.[1]?.sub_categories?.[0]?.assets?.slice(-6)?.map((assets) => ( // Adjusted slice(-3) to get last 3 items
                    <div key={assets?.id} className='mt-5'>
                        <Link href={`/${slugify(categories?.[1]?.name)}/${slugify(categories?.[1]?.sub_categories?.[0]?.name)}/${slugify(assets?.name)}-${assets?.id}`}>
                            {assets?.cover && (
                                <Image
                                    src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + assets?.cover}
                                    height={800}
                                    width={800}
                                    alt=''
                                    className='w-[150px] h-[150px] mx-auto rounded-md transform transition-transform duration-1000 hover:scale-150'
                                />
                            )}
                            <div className=' text-white text-center py-2 mx-auto'>
                                <p>{assets?.name}</p>
                            </div>
                        </Link>
                    </div>
                ))}

            </div>


            {/* <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 mt-10 w-full mx-auto'>
                {categories?.[1]?.sub_categories?.[1]?.assets?.slice(-4)?.map((assets) => ( // Adjusted slice(-3) to get last 3 items
                    <div key={assets?.id} className='mt-5'>
                        <Link href={`/${slugify(categories?.[1]?.name)}/${slugify(categories?.[1]?.sub_categories?.[1]?.name)}/${slugify(assets?.name)}-${assets?.id}`}>
                            {assets?.cover && (
                                <Image
                                    src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + assets?.cover}
                                    height={800}
                                    width={800}
                                    alt=''
                                    className='w-[150px] h-[150px] mx-auto rounded-md'
                                />
                            )}
                            <div className='text-white text-center py-2 mx-auto'>
                                <p>{assets?.name}</p>
                            </div>
                        </Link>
                    </div>
                ))}

            </div> */}


           


        </div>
    );
};

export default NewAssets;











// import Image from 'next/image';
// import React from 'react';
// import slugify from '@/utils/slugify';
// import Link from 'next/link';

// const NewAssets = ({ categories }) => {
//     return (
//         <div className='mt-10 py-5'>
//             <div className='bg-thirdColor border-black'>
//                 <h1 className='text-center font-semibold text-2xl text-white p-2'>New Assets</h1>
//             </div>

//             <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-10 md:w-[70%] mx-auto'>
//                 {categories?.map((category) => (
//                     <div key={category?.id} className=''>
//                         {category?.sub_categories?.[0]?.assets?.slice(-3)?.map((assets) => ( // Adjusted slice(-3) to get last 3 items
//                             <div key={assets?.id} className='mt-5'>
//                                 <Link href={`/${slugify(category?.name)}/${slugify(category?.sub_categories?.[0]?.name)}/${slugify(assets?.name)}-${assets?.id}`}>
//                                     {assets?.cover && (
//                                         <Image
//                                             src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + assets?.cover}
//                                             height={800}
//                                             width={800}
//                                             alt=''
//                                             className='w-[300px] h-[300px] mx-auto rounded-md'
//                                         />
//                                     )}
//                                     <div className='bg-secondary text-white text-center py-2 rounded-md w-[300px] mx-auto'>
//                                         <p>{assets?.name}</p>
//                                     </div>
//                                 </Link>
//                             </div>
//                         ))}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default NewAssets;

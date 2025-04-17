import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import slugify from '@/utils/slugify';
import { getOptimizedImageUrl } from '@/utils/cloudinary';

const Features = ({ categories }) => {
    // Sort categories in ascending order by id
    const sortedCategories = categories.slice().sort((a, b) => a.id - b.id);

    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    }; 

    return (
        // <div className="bg-[url('/assets/bgImage/bgGray.jpeg')] bg-cover bg-center w-full text-white p-5">
        <div className=" text-white p-5 bg-[#141414] ">
          <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8'>
            {sortedCategories.map((category) => (
                <div 
                    key={category.id} 
                    className='border-4 border-gray-800 shadow-lg rounded-xl p-6 '
                >
                    <Link href={`/${slugify(category.name)}-${category.id}`}>
                        <div className='text-center'>
                            {category.image && (
                                <Image
                                     src={getOptimizedImageUrl(getOriginalImageUrl(category.image))}
                                    height={1000}
                                    width={1000}
                                    alt={category.name}
                                    className='w-[150px] h-[150px] mx-auto rounded-full shadow-md transform transition-transform duration-1000 hover:scale-125 hover:mb-3'
                                />
                            )}
                            <h2 className='text-center font-semibold text-white text-xl mt-4'>{category.name}</h2>
                            <h4 className='mt-2 text-center text-gray-400 text-sm leading-relaxed'>
                               {category?.short_description}
                            </h4>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
      </div>
    );
};

export default Features;

import { HorizontalBanner } from '@/components/Shared/GoogleAdsense/HorizontalBanner';
import { getOptimizedImageUrl } from '@/utils/cloudinary';
import slugify from '@/utils/slugify';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Explore = ({ categories }) => {
    
    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    }; 

    return (
        // <div className="bg-[url('/assets/bgImage/bgGray.jpeg')] bg-cover bg-center w-full text-white p-5">
        <div className="bg-gradient-to-br from-gray-900 to-black text-white">
            <h2 className="text-center font-semibold text-2xl">Explore Best Plugins</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
                {categories?.[0]?.sub_categories?.[0]?.assets
                    ?.slice(-4)
                    ?.map((asset, index) => (
                       <Link href={`/${slugify(categories?.[0]?.name)}/${slugify(categories?.[0]?.sub_categories?.[0]?.name)}/${slugify(asset?.name)}-${asset?.id}`}>
                        <Image
                           key={index} 
                            src={getOptimizedImageUrl(getOriginalImageUrl(asset?.cover))}
                            alt="Interior Design"
                            width={500}
                            height={500}
                            className="w-full h-[150px] md:h-[300px] mx-auto"
                        />
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default Explore;

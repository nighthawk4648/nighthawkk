import { getOptimizedImageUrl } from '@/utils/cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';

const Innovative = ({ innovatives }) => {
   
    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    }; 
   
    return (
        <div>
            {
                innovatives?.map((innovative) => (
                    <div className='relative'>
                        <div className='relative'>
                            <Image
                                src={getOptimizedImageUrl(getOriginalImageUrl(innovative?.bgImg ))}
                                height={1600}
                                width={1600}
                                alt={innovative.title}
                                className='w-full h-[200px] md:h-[500px]'
                            />
                        </div>
                        {/* Adjusted icon positioning */}
                        <div className='absolute right-[180px] top-[150px] md:top-1/2 '>
                            <Link href={`${innovative?.urlOne ? innovative?.urlOne : '/'}`} ><AiFillPlusCircle className='text-orange-700 text-2xl md:text-4xl' /></Link>
                        </div>

                        <div className='absolute right-[100px] md:right-[200px] lg:right-[500px] top-1/2 md:top-3/4 '>
                            <Link href={`${innovative?.urlTwo ? innovative?.urlTwo : '/'}`} ><AiFillPlusCircle className='text-orange-700 text-2xl md:text-4xl' /></Link>
                        </div>

                        <div className='absolute left-[40px] md:left-[100px] lg:left-[130px] top-[60px] md:top-[170px] '>
                            <Link href={`${innovative?.urlThree ? innovative?.urlThree : '/'}`} ><AiFillPlusCircle className='text-orange-700 text-2xl md:text-4xl' /></Link>
                        </div>

                        <div className='absolute left-[100px] md:left-[300px] top-3/4 '>
                            <Link href={`${innovative?.urlFour ? innovative?.urlFour : '/'}`}><AiFillPlusCircle className='text-orange-700 text-2xl md:text-4xl' /></Link>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default Innovative;

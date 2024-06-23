import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import slugify from '@/utils/slugify';

const Features = ({categories}) => {

    return (
        <div className='mt-5 grid lg:grid-cols-3  md:grid-cols-2 grid-cols-1 gap-5'>

            {
                categories?.map((category) => (
                    <div key={category?.id} className=' '>
                        <Link href={`/${slugify(category?.name)}-${category?.id}`}>
                        { category?.image &&  <Image
                            src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE +
                                category?.image}
                            height={500}
                            width={500}
                            alt={category?.name}
                            className='md:w-[200px] md:h-[200px] w-[150px] h-[150px] mx-auto rounded-full'
                        ></Image>}
                        

                        <p className='text-center font-semibold text-xl mt-2'>{category?.name}</p>
                        </Link>
                    </div>
                ))
            }

        </div>
    );
};

export default Features;
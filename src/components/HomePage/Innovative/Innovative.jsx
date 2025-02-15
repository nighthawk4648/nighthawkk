import Image from 'next/image';
import React from 'react';

const Innovative = ({ innovatives }) => {
    return (
        <div>
            <Image
                // src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + category.image}
                src={`https://i.ibb.co.com/0V8cTj0R/MF-M1.jpg`}
                height={500}
                width={500}
                alt={innovatives.title}
                className='w-[150px] h-[150px] mx-auto rounded-full shadow-md transform transition-transform duration-1000 hover:scale-125 hover:mb-3'
            />

        </div>
    );
};

export default Innovative;
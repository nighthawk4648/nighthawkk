
import getData from '@/utils/getData';
import React from 'react';

export const metadata = {
    title: 'Blogs',
    description: 'Read our blog',
};

const Blogs = async ({params}) => {
  
    const id = params?.blog?.split('-').pop(); 
    const blog = await getData(`blogs/${id}`);

    return (
        <div className="bg-black p-12">
            <div className="">
                <h2 className="text-2xl font-bold mb-4 text-white">Blogs</h2>
                
            </div>
        </div>
    );
};

export default Blogs;
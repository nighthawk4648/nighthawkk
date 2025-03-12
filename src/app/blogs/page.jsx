
import getData from '@/utils/getData';
import React from 'react';
import MaterialCardGrid from '@/components/BlogMaterialCard/MaterialGrid/MaterialCardGrid';
import img1 from '../../../public/assets/blog/images/img1.jpg'
import img2 from '../../../public/assets/blog/images/img2.jpeg'
import img3 from '../../../public/assets/blog/images/img3.jpeg'
import img4 from '../../../public/assets/blog/images/img4.jpeg'
import img5 from '../../../public/assets/blog/images/img5.jpeg'
import img6 from '../../../public/assets/blog/images/img6.jpeg'

export const metadata = {
    title: 'Blogs',
    description: 'Read our blog',
};

const Blogs = async () => {
    const footerPage = await getData(`pages/${5}`);

    // dynamically added the data to cards
    const materials = [
        {
            imageSrc: img1,
            title: "LUMION 2023\n150 WOOD FLOOR\nMATERIALS LIBRARY",
            href: "/materials/wood-floor"
        },
        {
            imageSrc: img2,
            title: "",
            href: "/materials/pavement"
        },
        {
            imageSrc: img3,
            title: "",
            href: "/materials/wood-wall"
        },
        {
            imageSrc: img4,
            title: "",
            href: "/materials/city"
        },
        {
            imageSrc: img5,
            title: "LUMION",
            href: "/materials/terrain"
        },
        {
            imageSrc: img6,
            title: "",
            href: "/materials/cobblestone"
        },
    ];

    return (
        <div className="bg-black p-12">
            <div className="">
                <h2 className="text-2xl font-bold mb-4 text-white">Blogs</h2>
                <MaterialCardGrid materials={materials} />
            </div>
        </div>
    );
};

export default Blogs;
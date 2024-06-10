import Link from 'next/link';
import React, { useState } from 'react';
import { MdDashboard, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { IoIosArrowDown } from "react-icons/io";
import slugify from '@/utils/slugify';


const MenuBarForMobileScreen = ({ categories }) => {

    const [isDropdownSectionOpen, setIsDropdownSectionOpen] = useState(null);

    const toggleDropdownSection = (index) => {
        setIsDropdownSectionOpen(isDropdownSectionOpen === index ? null : index);
    };

    const [isDropdownSubSectionOpen, setIsDropdownSubSectionOpen] = useState(null);

    const toggleDropdownSubSection = (index) => {
        setIsDropdownSubSectionOpen(
            isDropdownSubSectionOpen === index ? null : index
        );
    };

    const options = ['Option 1', 'Option 2', 'Option 3'];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const closeMenu = () => {
        setIsMenuOpen(false);
    };



    return (
        <div>
            <div className='flex gap-2 items-center mb-4 px-3'>
                <MdDashboard className="text-xl" />
                <div className="text-sm">
                    <Link href="/">Home</Link>
                </div>
            </div>

            <div className="flex-none ">
                {categories?.length
                    ? categories?.map((category, index) => (
                        <div key={index}>
                            <div className="flex  justify-between items-center w-full  py-2 px-3 text-sm   hover:text-blue-600 bg-white rounded-md  focus:outline-none">
                                <button
                                    onClick={() => toggleDropdownSection(index)}
                                    className="flex justify-center items-center"
                                >
                                    <Link href={`/${slugify(category?.name)}-${category?._id}`} ><span className="select-none">{category?.name}</span></Link>

                                    {isDropdownSectionOpen === index ? (
                                        <MdKeyboardArrowUp className="text-xl" />
                                    ) : (
                                        <MdKeyboardArrowDown className="text-xl" />
                                    )}
                                </button>

                            </div>

                            {isDropdownSectionOpen === index && (
                                <div
                                    id="options"
                                    className="w-full py-2  px-3 text-sm bg-white rounded-lg "
                                >
                                    {category?.sub_categories?.map((subCategory, index) => (
                                        <div key={subCategory?._id}>
                                            <div className="flex justify-between items-center  ml-4">
                                                <button
                                                    onClick={() => toggleDropdownSubSection(index)}
                                                    className="flex items-center py-2 text-gray-700  hover:text-blue-600 bg-white rounded-md  focus:outline-none"
                                                >
                                                    <Link href={`/${slugify(category?.name)}-${category?._id}`} ><p className="">{subCategory?.name}</p></Link>
                                                    {isDropdownSubSectionOpen === index ? (
                                                        <MdKeyboardArrowUp className="text-xl" />
                                                    ) : (
                                                        <MdKeyboardArrowDown className="text-xl" />
                                                    )}
                                                </button>

                                            </div>

                                            {isDropdownSubSectionOpen === index && (
                                                <div className='px-3'>
                                                    {subCategory?.assets?.map((asset) => (
                                                        <ul className="ml-8" key={asset?._id}>
                                                            <li className="mb-2">
                                                                <Link href={`/${slugify(category?.name)}/${slugify(subCategory?.name)}/${slugify(asset?.name)}-${asset?._id}`}>{asset.name}</Link>

                                                            </li>
                                                        </ul>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                    : null}
            </div>
        </div>
    );
};

export default MenuBarForMobileScreen;
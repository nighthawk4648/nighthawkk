'use client'
import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineMenuFold } from 'react-icons/ai';
import { IoCloseCircleOutline, IoSearchSharp } from 'react-icons/io5';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import slugify from '@/utils/slugify';
import MenuBarForMobileScreen from './MenuBarForMobileScreen';
import SearchForMobileScreen from './SearchForMobileScreen';
import SearchForDesktopScreen from './SearchForDesktopScreen';

const Navbar = ({ categories, footerPages }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [expandedSubcategory, setExpandedSubcategory] = useState(null);
    const [showCategoryList, setShowCategoryList] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <nav className="bg-black md:px-4 px-3 shadow-sm py-1 h-12">
                <div className="px-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-5">
                            <p className="font-bold text-white text-lg"><Link href="/">Sketchshaper</Link></p>
                        </div>
                        <div className="flex items-center gap-5">
                            <Link href="/rbzconverter">
                                <button className="px-4 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition">
                                    ZIP 2 RBZ
                                </button>
                            </Link>
                        </div>


                        <div className="flex items-center">
                            <div className="hidden md:flex items-center gap-5">
                                <SearchForDesktopScreen />
                                <p className="font-semibold text-white"><Link href='https://blog.sketchshaper.com/'>BLOG</Link></p>
                                <p className="font-semibold text-white"><Link href="/">HOME</Link></p>
                            </div>

                            <div 
                                className="hidden md:block relative ml-5"
                                onMouseEnter={() => setShowCategoryList(true)}
                                onMouseLeave={() => setShowCategoryList(false)}
                            >
                                <p className="font-semibold cursor-pointer text-white flex items-center text-sm px-3 py-2 bg-gray-800 rounded-lg">
                                    MENU {showCategoryList ? <IoIosArrowUp className="ml-1" /> : <IoIosArrowDown className="ml-1" />}
                                </p>

                                {showCategoryList && (
                                    <div className="left-0 fixed w-full bg-black font-semibold text-l text-white p-2">
                                        <div className="flex justify-evenly bg-black border-t border-gray-800 py-2 h-10" >
                                            {categories?.map((category) => (
                                                <div key={category.id} className="relative w-full text-center"
                                                    onMouseEnter={() => setExpandedCategory(category.id)}
                                                    onMouseLeave={() => setExpandedCategory(null)}
                                                >
                                                    <Link href={`/${slugify(category?.name)}-${category?.id}`}><p>{category?.name}</p></Link>
                                                    {expandedCategory === category.id && (
                                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-3/4 bg-black text-white z-40 border border-gray-700">
                                                            {category.sub_categories?.map((subCategory) => (
                                                                <div key={subCategory.id} className="border-b border-gray-700 last:border-b-0"
                                                                    onMouseEnter={() => setExpandedSubcategory(subCategory.id)}
                                                                    onMouseLeave={() => setExpandedSubcategory(null)}
                                                                >
                                                                    <Link href={`/${slugify(category?.name)}-${category?.id}/${subCategory?.name}-${subCategory?.id}`}>
                                                                        <p>{subCategory?.name}</p>
                                                                    </Link>
                                                                    {expandedSubcategory === subCategory.id && (
                                                                        <div className="bg-gray-900 py-2 max-h-48 overflow-y-auto ">
                                                                            {subCategory.assets?.map((asset) => (
                                                                                <div key={asset.id} className="px-4 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-800">
                                                                                    <Link href={`/${slugify(category?.name)}/${slugify(subCategory?.name)}/${slugify(asset?.name)}-${asset?.id}`}>
                                                                                        <p>{asset?.name}</p>
                                                                                    </Link>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="md:hidden">
                                <div className='flex gap-3 items-center mt-2'>
                                    <SearchForMobileScreen />
                                    <button onClick={toggleNavbar} className="font-medium">
                                        <AiOutlineMenuFold className="md:text-2xl text-xl text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isOpen && (
                    <div className="fixed inset-0 z-50 bg-gray-400 opacity-75"></div>
                )}
                <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                    <div className={`fixed inset-y-0 left-0 z-50 w-4/5 bg-white transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}> 
                        <div className="flex items-center justify-end h-16 px-4">
                            <button onClick={toggleNavbar} className="font-medium">
                                <IoCloseCircleOutline className="text-3xl text-gray-500" />
                            </button>
                        </div>
                        <div className="h-full mt-3">
                            <div className="flex gap-3 items-center mb-7 border-b border-gray-200 shadow-sm px-3 py-3">
                                <Link href="/">
                                    <p className='text-2xl font-semibold'>Sketch Shaper</p>
                                </Link>
                            </div>
                            <MenuBarForMobileScreen categories={categories} />
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;

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
            <nav className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-slate-100 md:px-4 px-3 shadow-sm py-1 h-12">
                <div className="px-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-5">
                            <p className="font-bold text-white text-lg"><Link href="/">Sketchshaper</Link></p>
                        </div>


                        <div className="flex items-center">
                            <div className="hidden md:flex items-center gap-5">
                                <SearchForDesktopScreen />
                                <p className="font-semibold cursor-pointer text-slate-100 flex items-center text-sm px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg"><Link href="/pro">Pro</Link></p>
                                <p className="font-semibold cursor-pointer text-slate-100 flex items-center text-sm px-3 py-2 bg-slate-800/20 hover:bg-slate-800 rounded-lg"><Link href="/gallery">Gallery</Link></p>
                                {/* <p className="font-semibold cursor-pointer text-slate-100 flex items-center text-sm px-3 py-2 bg-slate-800/20 hover:bg-slate-800 rounded-lg"><Link href="/rbzconverter"> zip2rbz </Link></p> */}
                                <p className="font-semibold cursor-pointer text-slate-100 flex items-center text-sm px-3 py-2 bg-slate-800/20 hover:bg-slate-800 rounded-lg"><Link href='https://blog.sketchshaper.com/'>Blog</Link></p>
                                <p className="font-semibold cursor-pointer text-slate-100 flex items-center text-sm px-3 py-2 bg-slate-800/20 hover:bg-slate-800 rounded-lg"><Link href="/">Home</Link></p>
                                
                            </div>

                            <div 
                                className="hidden md:block relative ml-5"
                                onMouseEnter={() => setShowCategoryList(true)}
                                onMouseLeave={() => setShowCategoryList(false)}
                            >
                                <p className="font-semibold cursor-pointer text-slate-100 flex items-center text-sm px-3 py-2 bg-slate-800/20 rounded-lg">
                                    Menu {showCategoryList ? <IoIosArrowUp className="ml-1" /> : <IoIosArrowDown className="ml-1" />}
                                </p>

                                {showCategoryList && (
                                    <div className="left-0 fixed w-full bg-black font-semibold text-l text-white p-2">
                                        <div className="flex justify-evenly bg-slate-900 border-t border-slate-800 py-2 h-10" >
                                            {categories?.map((category) => (
                                                <div key={category.id} className="relative w-full text-center"
                                                    onMouseEnter={() => setExpandedCategory(category.id)}
                                                    onMouseLeave={() => setExpandedCategory(null)}
                                                >
                                                    <Link href={`/${slugify(category?.name)}-${category?.id}`}><p className="text-slate-100">{category?.name}</p></Link>
                                                    {expandedCategory === category.id && (
                                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-3/4 bg-slate-900 text-slate-100 z-40 border border-slate-700">
                                                            {category.sub_categories?.map((subCategory) => (
                                                                <div key={subCategory.id} className="border-b border-gray-700 last:border-b-0"
                                                                    onMouseEnter={() => setExpandedSubcategory(subCategory.id)}
                                                                    onMouseLeave={() => setExpandedSubcategory(null)}
                                                                >
                                                                    <Link href={`/${slugify(category?.name)}-${category?.id}/${subCategory?.name}-${subCategory?.id}`}>
                                                                        <p className="text-slate-200">{subCategory?.name}</p>
                                                                    </Link>
                                                                    {expandedSubcategory === subCategory.id && (
                                                                        <div className="bg-slate-800 py-2 max-h-48 overflow-y-auto ">
                                                                            {subCategory.assets?.map((asset) => (
                                                                                <div key={asset.id} className="px-4 py-1 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-800">
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
                    <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
                )}
                <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                    <div className={`fixed inset-y-0 left-0 z-50 w-4/5 bg-slate-900 text-slate-100 transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}> 
                        <div className="flex items-center justify-end h-16 px-4">
                            <button onClick={toggleNavbar} className="font-medium">
                                <IoCloseCircleOutline className="text-3xl text-slate-300" />
                            </button>
                        </div>
                        <div className="h-full mt-3">
                            <div className="flex gap-3 items-center mb-7 border-b border-slate-800 shadow-sm px-3 py-3">
                                <Link href="/">
                                    <p className='text-2xl font-semibold text-slate-100'>Sketch Shaper</p>
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

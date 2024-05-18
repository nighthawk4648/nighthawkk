'use client'
import React, { useState } from 'react';

import { AiOutlineMenuFold } from "react-icons/ai";
import { IoCloseCircleOutline, IoSearchSharp } from "react-icons/io5";
import { FaFileInvoice, FaShirtsinbulk } from "react-icons/fa6";
import Link from 'next/link';
import { MdDashboard, MdKeyboardArrowRight, MdOutlineAccountCircle } from "react-icons/md";
import Image from 'next/image';
import navLogo from '../../../../public/assets/navbar/navbar_logo.png'


const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };


    const navMenu = [
        {
            id: 1,
            title: "Deliveries",
            link: "/merchant/parcel-list",
        },

        {
            id: 2,
            title: "Invoices",
            link: "/merchant/invoices",
        }
    ]

    return (
        <div className=''>

            <nav className="bg-primary md:py-2 py-1  md:px-5 px-1  shadow-sm  ">
                <div className=" px-4">
                    <div className="flex justify-between items-center ">
                        <div className="flex  items-center gap-5">



                            {/* <Link href='/merchant'>
                                <img src="/src/assets/images/logo/promise.png" className="md:w-48 w-24 h-auto " alt="img" />
                            </Link> */}

                            <div>
                                {/* <p className='text-md:2xl text-xl font-semibold'>NIGHTHAWK</p> */}
                              <Link href="/">
                              <Image
                                src={navLogo}
                                height={200}
                                width={500}
                                className='h-auto w-28'
                                alt='nighthawk'
                                ></Image>
                              </Link>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="hidden md:block">
                                <div className="flex items-center  gap-5">
                                    <div>
                                        <div className='relative'>
                                            <input type="text" className='h-8 rounded-md outline-none px-8' />

                                            <div className='absolute top-2 left-2'>
                                                <IoSearchSharp />
                                            </div>
                                        </div>

                                    </div>
                                    <p className='font-semibold'>SEARCH</p>

                                    <p className='font-semibold'>HOME</p>
                                    <p className='font-semibold'>ABOUT</p>


                                </div>
                            </div>
                            <div className="md:hidden">

                                <div >
                                    <button onClick={toggleNavbar} className=" font-medium">
                                        <AiOutlineMenuFold className="md:text-2xl text-xl mt-2 " />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="fixed inset-0 z-50 bg-gray-400 opacity-75"></div>
                    <div className={`fixed inset-y-0 left-0 z-50 w-4/5 bg-white transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="flex items-center justify-end h-16 px-4">
                            <button onClick={toggleNavbar} className="   font-medium">
                                <IoCloseCircleOutline className="text-3xl text-gray-500" />
                            </button>
                        </div>
                        <div className=" h-full  mt-3">

                            <div className="flex gap-3 items-center mb-7 border-b border-gray-200 shadow-sm  px-3 py-3">
                                {/* <MdOutlineAccountCircle className="text-4xl" /> */}
                                <Link href="/">
                              <Image
                                src={navLogo}
                                height={200}
                                width={500}
                                className='h-auto w-28'
                                alt='nighthawk'
                                ></Image>
                              </Link>

                            </div>


                            <div className="flex gap-2 items-center mb-4 px-3 " onClick={toggleNavbar} >
                                <MdDashboard className="text-xl" />
                                <div className="text-sm">
                                    <Link href='/'>
                                        Home
                                    </Link>
                                </div>
                            </div>




                        </div>
                    </div>
                </div>
            </nav>

        </div>
    );
};

export default Navbar;
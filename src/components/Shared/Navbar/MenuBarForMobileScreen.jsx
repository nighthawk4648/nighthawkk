import Link from 'next/link';
import React, { useState } from 'react';
import { MdDashboard } from 'react-icons/md';
import { IoIosArrowDown } from "react-icons/io";


const MenuBarForMobileScreen = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const options = ['Option 1', 'Option 2', 'Option 3'];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

 

    return (
        <div>
            <div className='flex gap-2 items-center mb-4 px-3'>
                <MdDashboard className="text-xl" />
                <div className="text-sm">
                    <Link href="/">Home</Link>
                </div>
            </div>

            <div className="relative">
                <button
                    onClick={toggleDropdown}
                    className=""
                >
                    {'Select an option'}
                    <IoIosArrowDown/>
                </button>

                {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg">
                        <ul>
                            {options.map((option) => (
                                <li
                                    key={option}
                                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuBarForMobileScreen;
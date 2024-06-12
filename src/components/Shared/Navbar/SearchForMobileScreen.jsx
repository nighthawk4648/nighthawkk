"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CiSearch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import slugify from "@/utils/slugify";

import useSWR from "swr";
import { fetcher } from "@/utils/swrFetcher";


const SearchForMobileScreen = () => {

    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const [searchString, setSearchString] = useState("");
    const searchInputRef = useRef(null);


    const { data: searchData, isLoading, } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/search?search=${searchString}`,
        fetcher
    );

    console.log("searchData", searchData);




    // const {
    //     register,
    //     formState: { errors },
    //     handleSubmit,
    //     reset,
    // } = useForm();

    // const params = useParams();






    // Update the search term state on input change
    const handleInputChange = (e) => {
        setSearchString(e.target.value);
    };

    // const handleSearch = (data) => {
    //     // const searchTerm = data.search_term || searchString; // Use the latest value from state
    //     setSearchString(searchString);
    //     setIsSearchOpen(false);

    //     setSearchString("");
    // };

    const handleOpen = () => {
        setIsSearchOpen(true);
    };
    const handleClose = () => {
        setIsSearchOpen(false);
    };


    return (
        <>
            <div>
                <CiSearch onClick={handleOpen} className="text-[26px]" />
            </div>
            {
                // Search Option
                isSearchOpen && (
                    <div className="border-b border-gray-500  w-[100vw] absolute top-0 left-0 z-30">
                        <div className="relative inline-block text-left w-full">
                            <div>
                                {/* <form onSubmit={handleSubmit(handleSearch)}> */}
                                <div className="flex h-[50px]">
                                    <input
                                        // {...register("search_term")}
                                        ref={searchInputRef}
                                        onClick={() => setIsSearchOpen(true)}
                                        onFocus={() => setIsSearchOpen(true)}
                                        onChange={handleInputChange} // Handle input change
                                        type="text"
                                        value={searchString} // Set the value from state
                                        placeholder="Search by Brand or Product"
                                        className="inline-flex justify-center w-full px-2 bg-white text-sm font-medium text-gray-700 focus:outline-none pl-7 h-[50px]"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute top-[7px] right-[45px] bg-primary rounded-[5px] text-white py-2 px-5 "
                                    >
                                        Search
                                    </button>
                                </div>
                                {/* </form> */}

                                {isSearchOpen && (
                                    <div className="origin-top-right absolute right-0 pt-2 w-full  max-h-[100vh] overflow-y-auto  shadow-lg bg-white z-50">
                                        <div className="py-1 ">

                                            {!!searchData?.data?.category?.length ? (
                                                <div className="mt-4 px-5">
                                                    <p className="text-xs text-gray-700 font-bold uppercase">
                                                        Category
                                                    </p>

                                                    {searchData?.data?.category?.map((category) => (
                                                        <div className="mt-3" key={category?._id}>
                                                            <div className="mb-3">
                                                                <div className="flex gap-2 items-center ">
                                                                    <CiSearch className="text-lg text-gray-600" />
                                                                    <div>
                                                                        <Link
                                                                            onClick={handleClose}
                                                                            href={`/${slugify(category?.name)}-${category?._id}`}
                                                                        >
                                                                            <p
                                                                                className="text-xs text-gray-800 cursor-pointer  border-b hover:border-primary"
                                                                                onClick={() => setIsSearchOpen(false)}
                                                                            >
                                                                                {category?.name}
                                                                            </p>
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                <hr className="mt-2" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : null}


                                            {!!searchData?.data?.subCategory?.length ? (
                                                <div className="mt-4 px-5">
                                                    <p className="text-xs text-gray-700 font-bold uppercase">
                                                        Sub Category
                                                    </p>

                                                    {searchData?.data?.subCategory?.map((subCategory) => (
                                                        <div className="mt-3" key={subCategory?._id}>
                                                            <div className="mb-3">
                                                                <div className="flex gap-2 items-center ">
                                                                    <CiSearch className="text-lg text-gray-600" />
                                                                    <div>
                                                                        <Link
                                                                            onClick={handleClose}
                                                                            href={`/${slugify(subCategory?.category?.name)}-${subCategory?.category?._id}`}
                                                                        >
                                                                            <p
                                                                                className="text-xs text-gray-800 cursor-pointer  border-b hover:border-primary"
                                                                                onClick={() => setIsSearchOpen(false)}
                                                                            >
                                                                                {subCategory?.name}
                                                                            </p>
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                <hr className="mt-2" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : null}


                                            {!!searchData?.data?.asset?.length ? (
                                                <div className="mt-4 px-5">
                                                    <p className="text-xs text-gray-700 font-bold uppercase">
                                                        Assets
                                                    </p>

                                                    {searchData?.data?.asset?.map((asset) => (
                                                        <div className="mt-3" key={asset?._id}>
                                                            <div className="mb-3">
                                                                <div className="flex gap-2 items-center ">
                                                                    <CiSearch className="text-lg text-gray-600" />
                                                                    <div>
                                                                        <Link
                                                                            onClick={handleClose}
                                                                            href={`/${slugify(asset?.subCategory?.category?.name)}/${slugify(asset?.subCategory?.name)}/${slugify(asset?.name)}-${asset?._id}`}
                                                                        >
                                                                            <p
                                                                                className="text-xs text-gray-800 cursor-pointer  border-b hover:border-primary"
                                                                                onClick={() => setIsSearchOpen(false)}
                                                                            >
                                                                                {asset?.name}
                                                                            </p>
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                <hr className="mt-2" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : null}




                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className="absolute top-[13px] left-0">
                            <CiSearch className="text-2xl text-gray-600" />
                        </div>

                        {isSearchOpen && (
                            <div
                                className="absolute top-[13px] right-4 cursor-pointer"
                                onClick={handleClose}
                            >
                                <RxCross2 className="text-gray-600 text-2xl border-l" />
                            </div>
                        )}
                    </div>
                )
            }
        </>
    );
};

export default SearchForMobileScreen;

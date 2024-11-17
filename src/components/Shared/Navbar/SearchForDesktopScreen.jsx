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


const SearchForDesktopScreen = () => {
    const router = useRouter();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [categoryId, setCategoryId] = useState();


    const [searchString, setSearchString] = useState("");
    const searchInputRef = useRef(null);


    const { data: searchData, isLoading, } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/search?search=${searchString}`,
        fetcher
    );

    console.log("searchData", searchData);

    const { data: categoryById, categoryIsLoading, } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/categories/${categoryId}`,
        fetcher
    );

    console.log("setCategoryId", setCategoryId);



    // Update the search term state on input change
    const handleInputChange = (e) => {
        setSearchString(e.target.value);
    };



    const handleClose = () => {
        setIsSearchOpen(false);
    };

    const handleClickOutside = (event) => {
        if (
            searchInputRef.current &&
            !searchInputRef.current.contains(event.target)
        ) {
            setIsSearchOpen(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isLinkClick = event.target.closest("a");

            if (
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target) &&
                !isLinkClick
            ) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); // No dependencies here

    // if (isLoading) {
    //   return <p>Loading...</p>;
    // }

    return (
        <div>
            <div className="border-b border-gray-500 w-[400px] relative">
                <div className="relative inline-block text-left w-full">
                    <div>

                        <input

                            ref={searchInputRef}
                            onClick={() => setIsSearchOpen(true)}
                            onFocus={() => setIsSearchOpen(true)}
                            onChange={handleInputChange} // Handle input change
                            type="text"
                            value={searchString} // Set the value from state
                            placeholder="Search by category, subcategory , assets"
                            className="inline-flex justify-center h-10 w-full  bg-white text-sm font-medium text-gray-700 focus:outline-none pl-7  rounded-md"
                        />

                    </div>

                    {isSearchOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-full  max-h-[550px] overflow-y-auto  shadow-lg bg-white z-[9000]  h-fit ">
                            <div className="py-1 ">

                               { searchData?.data?.category?.length || searchData?.data?.subCategory?.length  || searchData?.data?.asset?.length  ? null : <div className="px-3 bg-white">
                                    <p className="text-sm text-gray-500">Search Results will be showing here </p>
                                </div> }

                                {!!searchData?.data?.category?.length ? (
                                    <div className="mt-4 px-5">
                                        <p className="text-xs text-gray-700 font-bold uppercase">
                                            Category
                                        </p>

                                        {searchData?.data?.category?.map((category) => (
                                            <div className="mt-3" key={category?.id}>
                                                <div className="mb-3">
                                                    <div className="flex gap-2 items-center ">
                                                        <CiSearch className="text-lg text-gray-600" />
                                                        <div>
                                                            <Link
                                                                onClick={handleClose}
                                                                href={`/${slugify(category?.name)}-${category?.id}`}
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
                                            <div onClick={() => setCategoryId(subCategory?.category_id) } className="mt-3" key={subCategory?.id}>
                                                <div className="mb-3">
                                                    <div className="flex gap-2 items-center ">
                                                        <CiSearch className="text-lg text-gray-600" />
                                                        <div>
                                                            <Link
                                                                onClick={handleClose}
                                                                href={`/${slugify(categoryById?.data?.name)}-${categoryById?.data?.id}/${subCategory?.name}-${subCategory?.id}`}
                                                                
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
                                            <div className="mt-3" key={asset?.id}>
                                                <div className="mb-3">
                                                    <div className="flex gap-2 items-center ">
                                                        <CiSearch className="text-lg text-gray-600" />
                                                        <div>
                                                            <Link
                                                                onClick={handleClose}
                                                                href={`/${slugify(asset?.subCategory?.category?.name)}/${slugify(asset?.subCategory?.name)}/${slugify(asset?.name)}-${asset?.id}`}
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

                <div className="absolute top-2 left-1">
                    <CiSearch className="text-2xl text-gray-600" />
                </div>

                {isSearchOpen && (
                    <div
                        className="absolute top-3 right-1 cursor-pointer"
                        onClick={handleClose}
                    >
                        <RxCross2 className="text-gray-600" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchForDesktopScreen;

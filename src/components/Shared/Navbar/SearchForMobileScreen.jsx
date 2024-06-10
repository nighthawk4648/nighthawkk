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
    const router = useRouter();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [pageId, setPageId] = useState(null);
    const [searchString, setSearchString] = useState("");
    const searchInputRef = useRef(null);

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();

    const params = useParams();




    const handlePageClick = (id) => {
        setPageId(id);
    };

    // Update the search term state on input change
    const handleInputChange = (e) => {
        setSearchString(e.target.value);
    };

    const handleSearch = (data) => {
        // const searchTerm = data.search_term || searchString; // Use the latest value from state
        setSearchString(searchString);
        setIsSearchOpen(false);

        setSearchString("");
    };

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
                                <form onSubmit={handleSubmit(handleSearch)}>
                                    <div className="flex h-[50px]">
                                        <input
                                            {...register("search_term")}
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
                                </form>
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

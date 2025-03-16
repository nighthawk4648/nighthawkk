

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineMenuFold } from 'react-icons/ai';
import { IoCloseCircleOutline, IoSearchSharp } from 'react-icons/io5';
import { IoIosArrowDown, IoIosArrowUp, IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
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

	const toggleCategory = (categoryId) => {
		setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
	};
	
	const toggleSubcategory = (subcategoryId) => {
		setExpandedSubcategory(expandedSubcategory === subcategoryId ? null : subcategoryId);
	};

	const toggleMenu = () => {
		setShowCategoryList(!showCategoryList);
		// Reset expanded category when closing menu
		if (showCategoryList) {
			setExpandedCategory(null);
			setExpandedSubcategory(null);
		}
	};

	// Find the footer page with id 5
	const footerPage = footerPages?.find(page => page.id === 5);

	return (
		<div className="relative">
			<nav className="bg-black md:px-5 px-1 shadow-sm">
				{/* Top navigation bar */}
				<div className="px-4">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-5">
							<p className="font-bold text-white"><Link href="/">Sketchshaper</Link></p>
						</div>

						<div className="flex items-center">
							<div className="hidden md:block">
								<div className="flex items-center gap-5">
									<div>
										<SearchForDesktopScreen />
									</div>

									<p className="font-semibold text-white"><Link href='https://blog.sketchshaper.com/'>BLOG</Link></p>
									<p className="font-semibold text-white"><Link href="/">HOME</Link></p>
									<div className="relative py-3">
										<p
											className="font-semibold cursor-pointer text-white flex items-center"
											onClick={toggleMenu}
										>
											MENU {showCategoryList ? <IoIosArrowUp className="ml-1" /> : <IoIosArrowDown className="ml-1" />}
										</p>
									</div>
								</div>
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

				{/* Menu Dropdown with Expandable Categories - Only visible when menu is clicked */}
				{showCategoryList && (
					<div className="absolute left-0 w-full bg-black text-white z-50">
						<div className="flex justify-evenly bg-black border-t border-gray-800 py-2">
							{categories?.map((category) => (
								<div key={category.id} className="relative">
									<div
										className="flex items-center font-semibold uppercase cursor-pointer text-white px-3 py-2"
										onClick={() => toggleCategory(category.id)}
									>
										<span className="mr-1">{category.name}</span>
										{expandedCategory === category.id ? (
											<IoIosArrowUp className="text-lg" />
										) : (
											<IoIosArrowDown className="text-lg" />
										)}
									</div>

									{/* Subcategories Dropdown */}
									{expandedCategory === category.id && (
										<div className="absolute left-0 mt-1 w-64 bg-black text-white z-40 border border-gray-700">
											{category.sub_categories?.map((subCategory) => (
												<div key={subCategory.id} className="border-b border-gray-700 last:border-b-0">
													<div 
														className="font-medium p-3 flex items-center justify-between cursor-pointer hover:bg-gray-800"
														onClick={() => toggleSubcategory(subCategory.id)}
													>
														<p>{subCategory.name}</p>
														{expandedSubcategory === subCategory.id ? (
															<IoIosArrowUp className="text-sm" />
														) : (
															<IoIosArrowDown className="text-sm" />
														)}
													</div>

													{expandedSubcategory === subCategory.id && (
														<div className="bg-gray-900 py-2">
															{subCategory.assets?.map((asset) => (
																<div key={asset.id} className="px-4 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-800">
																	<Link
																		href={`/${slugify(category.name)}/${slugify(subCategory.name)}/${slugify(asset.name)}-${asset.id}`}
																		onClick={() => {
																			toggleCategory(null);
																			toggleSubcategory(null);
																			toggleMenu();
																		}}
																	>
																		{asset.name}
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

				{/* Mobile menu */}
				<div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
					<div className="fixed inset-0 z-50 bg-gray-400 opacity-75"></div>
					<div
						className={`fixed inset-y-0 left-0 z-50 w-4/5 bg-white transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
					>
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

							<div>
								<MenuBarForMobileScreen categories={categories} />
							</div>
						</div>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
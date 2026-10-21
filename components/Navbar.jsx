"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/img/logo.svg";
import { FaShoppingCart } from "react-icons/fa";
import { useAppContext } from "@/context/Context";
import { useRouter } from 'next/navigation';
import { DeleteSession } from "./DeleteSession";
import { CATEGORIES } from "@/data/categories";

const Navbar = () => {
  const { itemsList } = useAppContext();
  const [isProfile, setIsProfile] = useState(false);
  const { isLogIn, setIsLogIn } = useAppContext();
  const [navbarDropdownOpen, setNavbarDropdownOpen] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [navCategories, setNavCategories] = useState(CATEGORIES);
  const router = useRouter();
  const profileDropdownRef = useRef(null);
  const navbarDropdownRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/v1/site-categories");
        const { data } = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setNavCategories(data);
          return;
        }
      } catch (_) {}
      try {
        const res = await fetch("/api/v1/categories");
        const { data } = await res.json();
        if (Array.isArray(data) && data.length > 0) setNavCategories(data);
      } catch (_) {}
    })();
  }, []);

  const toggleNavbarDropdown = () => {
    setNavbarDropdownOpen(!navbarDropdownOpen);
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = async () => {
    await DeleteSession();
    setIsLogIn(false);
    router.push('/');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/v1/checkUser");
      const data = await res.json();
      setUser(data?.user);
    };
    fetchUser();
  }, [isLogIn]);

  useEffect(() => {
    setIsProfile(!!(user && user.fromAdminLogin));
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (navbarDropdownRef.current && !navbarDropdownRef.current.contains(event.target)) {
        setNavbarDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileMenuClick = () => {
    setProfileDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/5 backdrop-blur-md border-b border-black/10 supports-[backdrop-filter]:bg-black/5">
      <div className="w-full mx-auto px-8 sm:px-14 py-2 md:py-2.5">
        <div className="flex items-center justify-between w-full">
          {/* Left: logo only */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer shrink-0">
            <Image src={logo} className="h-10 w-10 md:h-12 md:w-12 shrink-0" alt="Logo" width={48} height={48} />
            <span className="hidden sm:flex items-baseline gap-1">
              <span className="text-lg md:text-xl text-headingTxtColor font-lora font-bold">Cardboard</span>
              <span className="text-lg md:text-xl text-gray-400 font-lora font-medium">Package</span>
            </span>
          </Link>
          {/* Right: all nav items in one group (Products, Resources, Quote, Company, cart, Sign-In) */}
          <div className="flex items-center flex-1 min-w-0 h-10 justify-end">
            <div className="hidden md:flex items-center gap-4 lg:gap-5 font-medium h-full">
            <ul className="flex items-center gap-4 lg:gap-6 font-medium h-full">
              <li className="relative h-full flex items-center">
                <button
                  onClick={toggleNavbarDropdown}
                  className="flex items-center gap-1 py-1.5 text-headingTxtColor rounded hover:text-headingHover transition-colors text-sm"
                >
                  Categories
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                  </svg>
                </button>
                {navbarDropdownOpen && (
                  <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 font-normal bg-white rounded-xl shadow-xl border border-gray-200 min-w-[200px] max-w-[260px] py-2" ref={navbarDropdownRef}>
                    <ul className="text-sm text-gray-700">
                      {navCategories
                        .filter((cat) => cat.parent_id == null)
                        .map((cat) => {
                          const subcategories = navCategories.filter(
                            (c) => c.parent_id != null && String(c.parent_id) === String(cat._id)
                          );
                          const hasSub = subcategories.length > 0;
                          return (
                            <li
                              key={cat._id}
                              className="border-b border-gray-100 last:border-0 group/list relative"
                            >
                              {hasSub ? (
                                <Link href={`/cardboard/products-list/${cat._id}`} onClick={toggleNavbarDropdown} className="flex items-center justify-between px-4 py-2 font-medium border-2 border-transparent hover:border-mainBgColor hover:bg-transparent rounded group-hover/list:bg-gray-50">
                                  {cat.cardboardname}
                                  <svg className="w-3 h-3 ml-1 shrink-0 text-gray-500" fill="none" viewBox="0 0 6 10" aria-hidden>
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4-4 4" />
                                  </svg>
                                </Link>
                              ) : (
                                <Link href={`/cardboard/products-list/${cat._id}`} onClick={toggleNavbarDropdown} className="block px-4 py-2 font-medium border-2 border-transparent hover:border-mainBgColor hover:bg-transparent rounded">
                                  {cat.cardboardname}
                                </Link>
                              )}
                              {hasSub && (
                                <ul className="invisible opacity-0 group-hover/list:visible group-hover/list:opacity-100 absolute left-full top-0 min-w-[200px] py-2 pl-0 bg-white rounded-xl shadow-xl border border-gray-200 transition-[visibility,opacity] duration-150 ease-out -ml-px">
                                  {subcategories.map((sub) => (
                                    <li key={sub._id}>
                                      <Link href={`/cardboard/products-list/${sub._id}`} onClick={toggleNavbarDropdown} className="block px-4 py-1.5 text-gray-700 border-2 border-transparent hover:border-mainBgColor hover:bg-transparent rounded">
                                        {sub.cardboardname}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                )}
              </li>
              <li className="h-full flex items-center">
                <Link href="/quotes" className="block py-1.5 text-headingTxtColor rounded hover:text-headingHover transition-colors text-sm">Quote</Link>
              </li>
            </ul>
            {/* Company, cart, Admin */}
            <>
              <Link href="https://reallytics.ai/" target="_blank" className="py-1.5 text-headingTxtColor hover:text-headingHover transition-colors text-sm font-medium">Company</Link>
              <Link
                href="/shopping-cart"
                className="relative flex items-center justify-center w-9 h-9 text-headingTxtColor hover:text-headingHover transition-colors shrink-0 rounded"
                aria-label={itemsList.length === 0 ? "Cart has no items" : `Cart has ${itemsList.length} item(s)`}
                title={itemsList.length === 0 ? "Cart has no items" : `Cart has ${itemsList.length} item(s)`}
              >
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-medium text-white bg-red-500 rounded-full leading-none">
                  {itemsList.length}
                </span>
                <FaShoppingCart className="text-lg flex-shrink-0 block align-middle" />
              </Link>
              {isProfile ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="font-semibold text-headingTxtColor text-sm rounded hover:text-headingHover font-lora flex items-center gap-1 py-1.5 px-2"
                  >
                    Profile
                    <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg ">
                      <Link href="/profile" className="block px-4 py-2 text-sm rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 text-gray-700" onClick={handleProfileMenuClick}>Profile</Link>
                      <Link href="/admin-login" className="block px-4 py-2 text-sm rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 text-gray-700" onClick={handleProfileMenuClick}>Admin Panel</Link>
                      <Link href={`/orderHistory/${user?.id}`} className="block px-4 py-2 text-sm rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 text-gray-700" onClick={handleProfileMenuClick}>Order History</Link>
                      <Link href="/future-products" className="block px-4 py-2 text-sm rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 text-gray-700" onClick={handleProfileMenuClick}>Future Products</Link>
                      <Link href="/discounted-products" className="block px-4 py-2 text-sm rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 text-gray-700" onClick={handleProfileMenuClick}>Discounted Products</Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => { handleProfileMenuClick(); handleLogout(); }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/admin-login" className="text-headingTxtColor font-bold hover:text-headingHover font-lora text-sm py-1.5">
                  Admin
                </Link>
              )}
            </>
            </div>
            {/* Mobile: cart + Admin visible next to hamburger */}
            <div className="flex md:hidden items-center gap-2 shrink-0">
              <Link
                href="/shopping-cart"
                className="relative flex items-center justify-center w-9 h-9 text-headingTxtColor hover:text-headingHover transition-colors shrink-0 rounded"
                aria-label={itemsList.length === 0 ? "Cart has no items" : `Cart has ${itemsList.length} item(s)`}
              >
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-medium text-white bg-red-500 rounded-full leading-none">
                  {itemsList.length}
                </span>
                <FaShoppingCart className="text-lg flex-shrink-0 block align-middle" />
              </Link>
              {isProfile ? (
                <Link href="/profile" className="text-headingTxtColor font-bold hover:text-headingHover font-lora text-sm py-1.5">Profile</Link>
              ) : (
                <Link href="/admin-login" className="text-headingTxtColor font-bold hover:text-headingHover font-lora text-sm py-1.5">Admin</Link>
              )}
            </div>
          <button
            onClick={toggleNavbar}
            type="button"
            className="md:hidden inline-flex items-center p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-expanded={navbarOpen}
          >
            <span className="sr-only">Open menu</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          </div>
        </div>
        {/* Mobile menu */}
        <div className={`md:hidden ${navbarOpen ? 'block' : 'hidden'} border-t border-gray-200 mt-2 pt-4 pb-2`}>
          <ul className="flex flex-col gap-1 font-medium">
            <li className="font-semibold text-gray-700 px-3 py-1">Categories</li>
            {navCategories
              .filter((cat) => cat.parent_id == null)
              .map((cat) => {
                const subcategories = navCategories.filter(
                  (c) => c.parent_id != null && String(c.parent_id) === String(cat._id)
                );
                return (
                  <li key={cat._id}>
                    <Link href={`/cardboard/products-list/${cat._id}`} onClick={toggleNavbar} className="block py-2 px-3 text-headingTxtColor rounded hover:bg-gray-100">{cat.cardboardname}</Link>
                    {subcategories.map((sub) => (
                      <Link key={sub._id} href={`/cardboard/products-list/${sub._id}`} onClick={toggleNavbar} className="block py-1.5 px-5 text-gray-600 rounded hover:bg-gray-100">{sub.cardboardname}</Link>
                    ))}
                  </li>
                );
              })}
            <li><Link href="/quotes" onClick={toggleNavbar} className="block py-2 px-3 text-headingTxtColor rounded hover:bg-gray-100">Quote</Link></li>
            <li><Link href="https://reallytics.ai/" target="_blank" onClick={toggleNavbar} className="block py-2 px-3 text-headingTxtColor rounded hover:bg-gray-100">Company</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

"use client";
import React, { useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {HiOutlineMenu} from "react-icons/hi";
import {MdOutlineClose} from "react-icons/md";


export default function Header() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };


    return (
        <header className="w-full fixed top-0 z-100 bg-blue-400 dark:bg-gray-900 shadow-md">
            <nav className="@container mx-auto flex py-2 px-4 justify-between items-center">
                <div className="flex items-center gap-2">
                    <Link href="/"
                          className="text-2xl flex items-center justify-center   text-white dark:text-gray-100">
                        <Image src="/logos/ts_logo.svg" alt="TypeScript Logo" width={35} height={35}/>
                        <h3 className="pt-2 px-2">Learn TS</h3>
                    </Link>
                </div>

                {/* Masaüstü Menüsü */}
                <ul className="hidden @4xl:flex flex-row space-x-6 text-lg">
                    <li>
                        <Link
                            href="/docs/started"
                            className="text-white dark:text-gray-300 hover:text-blue-200 dark:hover:text-blue-400 transition-colors"
                        >
                            Started
                        </Link>
                    </li>
                </ul>

                {/* Mobil Buton */}
                <button
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    className="@4xl:hidden text-2xl  cursor-pointer text-white dark:text-gray-300"
                >
                    {isOpen ? <MdOutlineClose/> : <HiOutlineMenu/>}
                </button>
            </nav>

            {/* Mobil Menü */}
            {isOpen && (
                <div className="@4xl:hidden absolute top-full left-0 right-0 bg-blue-500 dark:bg-gray-800 z-50 shadow-lg">
                    <ul className="flex flex-col space-y-4 p-4 text-lg">
                        <li>
                            <Link
                                href="/docs/started"
                                onClick={() => setIsOpen(false)}
                                className="text-white dark:text-gray-300 hover:text-blue-200 dark:hover:text-blue-400 transition-colors">
                                Started
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
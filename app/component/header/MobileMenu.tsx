"use client"

import {useState} from "react";
import Link from "next/link";
import ThemeSelector from "@/app/component/ui/ThemeSelector";
import {HiOutlineMenu} from "react-icons/hi";
import {MdOutlineClose} from "react-icons/md";

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu"
                    className="@4xl:hidden text-2xl cursor-pointer text-white dark:text-gray-300">
                {isOpen ? <MdOutlineClose/> : <HiOutlineMenu/>}
            </button>

            {isOpen && (
                <div
                    className="@4xl:hidden absolute top-full left-0 right-0 bg-blue-500 dark:bg-gray-800 z-50 shadow-lg">
                    <ul className="flex flex-col space-y-4 p-4 text-lg">
                        <li>
                            <Link
                                href="/docs/started"
                                onClick={() => setIsOpen(false)}
                                className="text-white dark:text-gray-300 hover:text-blue-200 dark:hover:text-blue-400 transition-colors"
                            >
                                Started
                            </Link>
                        </li>
                        <li>
                            <ThemeSelector/>
                        </li>
                    </ul>
                </div>
            )}
        </>
    )
}
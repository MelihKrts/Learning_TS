"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {getDocTree} from "@/lib/getMdxPageMeta";
import {useEffect, useState} from "react";
import {HiChevronLeft, HiChevronRight, HiOutlineMenu, HiX} from "react-icons/hi";

interface DocsSidebarProps {
    docTree: ReturnType<typeof getDocTree>;
}

export default function DocsSidebar({docTree}: DocsSidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Ekran boyutunu kontrol et
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setIsMobileOpen(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Mobile menü toggle
    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    // Desktop collapse toggle
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Mobile overlay click handler
    const handleOverlayClick = () => {
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileMenu}
                className="lg:hidden fixed top-20 left-4 z-50 bg-white border border-gray-200 rounded-md p-2 shadow-md hover:shadow-lg transition-shadow"
                aria-label="Menüyü Aç"
            >
                <HiOutlineMenu className="w-5 h-5 text-gray-600"/>
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0  bg-opacity-10 z-40"
                    onClick={handleOverlayClick}
                />
            )}

            {/* Sidebar */}
            <aside className={` fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-50 border-r border-gray-200  transition-all duration-300 z-50
                ${isMobile
                ? `${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} w-80`
                : `${isCollapsed ? 'w-12' : 'w-64'} translate-x-0`
            }
            `}>
                {/* Desktop Collapse Button */}
                {!isMobile && (
                    <button
                        onClick={toggleCollapse}
                        className="absolute -right-3 top-4 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow"
                        aria-label={isCollapsed ? "Sidebar'ı Genişlet" : "Sidebar'ı Daralt"}
                    >
                        {isCollapsed ? (
                            <HiChevronRight className="w-4 h-4 text-gray-600"/>
                        ) : (
                            <HiChevronLeft className="w-4 h-4 text-gray-600"/>
                        )}
                    </button>
                )}

                {/* Mobile Close Button */}
                {isMobile && isMobileOpen && (
                    <button
                        onClick={toggleMobileMenu}
                        className="absolute right-4 top-4 bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:shadow-md transition-shadow"
                        aria-label="Menüyü Kapat"
                    >
                        <HiX className="w-4 h-4 text-gray-600"/>
                    </button>
                )}

                {/* Sidebar Content */}
                <div className={`p-4 overflow-y-auto h-full ${!isMobile && isCollapsed ? 'hidden' : 'block'}`}>
                    <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                        Dokümantasyon
                    </h2>

                    <nav>
                        <ul className="space-y-1">
                            {docTree.map((doc) => {
                                const isActive = pathname === `/docs/${doc.slug}`;

                                return (
                                    <li key={doc.slug}>
                                        <Link
                                            href={`/docs/${doc.slug}`}
                                            onClick={() => isMobile && setIsMobileOpen(false)}
                                            className={` block px-3 py-2 rounded-md text-sm transition-colors
                                                ${isActive
                                                ? 'bg-blue-100 text-blue-900 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }
                                            `}
                                        >
                                            <div className="font-medium">
                                                {doc.title}
                                            </div>
                                            {doc.description && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {doc.description}
                                                </div>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                {/* Desktop Collapsed State Icons */}
                {!isMobile && isCollapsed && (
                    <div className="p-2 space-y-2">
                        {docTree.slice(0, 8).map((doc, index) => {
                            const isActive = pathname === `/docs/${doc.slug}`;

                            return (
                                <Link
                                    key={doc.slug}
                                    href={`/docs/${doc.slug}`}
                                    className={`block w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium
                                        ${isActive
                                        ? 'bg-blue-100 text-blue-900'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }
                                    `}
                                    title={doc.title}
                                >
                                    {(index + 1).toString()}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </aside>
        </>
    );
}
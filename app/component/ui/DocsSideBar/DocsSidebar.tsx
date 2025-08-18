"use client"

import { HiChevronLeft, HiChevronRight, HiOutlineMenu, HiX } from "react-icons/hi"
import { useResponsive } from "@/hooks/sidebar/use-responsive"
import { useSidebarState } from "@/hooks/sidebar/use-sidebar"
import type { getDocTree } from "@/lib/getMdxPageMeta"
import {CollapsedSidebarIcons} from "@/app/component/ui/DocsSideBar/CollapsedSidebarIcons";
import {SidebarNavigation} from "@/app/component/ui/DocsSideBar/SideBarNavigation";

interface DocsSidebarProps {
    docTree: ReturnType<typeof getDocTree>
}

export default function DocsSidebar({ docTree }: DocsSidebarProps) {
    const isMobile = useResponsive(1024)
    const { isCollapsed, isMobileOpen, toggleCollapse, toggleMobileMenu, closeMobileMenu } = useSidebarState()

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileMenu}
                className="lg:hidden fixed bottom-20 right-4 z-50 bg-white border border-gray-200 rounded-md p-2 shadow-md hover:shadow-lg transition-shadow"
                aria-label="Menüyü Aç"
            >
                <HiOutlineMenu className="w-5 h-5 text-gray-600" />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && <div className="lg:hidden fixed inset-0 bg-opacity-10 z-40" onClick={closeMobileMenu} />}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-16 h-[calc(100dvh-4rem)] bg-gray-50 border-r border-gray-200 transition-all duration-300 z-50 ${
                    isMobile
                        ? `${isMobileOpen ? "translate-x-0" : "-translate-x-full"} w-80`
                        : `${isCollapsed ? "w-12" : "w-64"} translate-x-0`
                }`}
            >
                {/* Desktop Collapse Button */}
                {!isMobile && (
                    <button
                        onClick={toggleCollapse}
                        className="absolute -right-3 top-4 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow"
                        aria-label={isCollapsed ? "Sidebar'ı Genişlet" : "Sidebar'ı Daralt"}
                    >
                        {isCollapsed ? (
                            <HiChevronRight className="w-4 h-4 text-gray-600" />
                        ) : (
                            <HiChevronLeft className="w-4 h-4 text-gray-600" />
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
                        <HiX className="w-4 h-4 text-gray-600" />
                    </button>
                )}

                {/* Sidebar Content */}
                <div className={`p-4 overflow-y-auto h-full ${!isMobile && isCollapsed ? "hidden" : "block"}`}>
                    <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Dokümantasyon</h2>
                    <SidebarNavigation docTree={docTree} onLinkClick={isMobile ? closeMobileMenu : undefined} />
                </div>

                {/* Desktop Collapsed State Icons */}
                {!isMobile && isCollapsed && <CollapsedSidebarIcons docTree={docTree} />}
            </aside>
        </>
    )
}
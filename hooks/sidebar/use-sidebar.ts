"use client"

import { useState, useCallback } from "react"

export function useSidebarState() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const toggleCollapse = useCallback(() => {
        setIsCollapsed((prev) => !prev)
    }, [])

    const toggleMobileMenu = useCallback(() => {
        setIsMobileOpen((prev) => !prev)
    }, [])

    const closeMobileMenu = useCallback(() => {
        setIsMobileOpen(false)
    }, [])

    return {
        isCollapsed,
        isMobileOpen,
        toggleCollapse,
        toggleMobileMenu,
        closeMobileMenu,
    }
}

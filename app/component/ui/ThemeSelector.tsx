"use client"

import type { Theme } from "@/app/component/ThemeProvider"
import { useTheme } from "@/app/component/ThemeProvider"
import { MdMonitor, MdDarkMode, MdLightMode, MdKeyboardArrowDown, MdCheck } from "react-icons/md"
import { useState, useRef, useEffect, useCallback } from "react"

const themeOptions = [
    { value: "system" as Theme, label: "Sistem", icon: MdMonitor },
    { value: "light" as Theme, label: "Açık Mod", icon: MdLightMode },
    { value: "dark" as Theme, label: "Koyu Mod", icon: MdDarkMode },
]

export default function ThemeSelector() {
    const { theme, setTheme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEvent = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleEvent)
        return () => document.removeEventListener("mousedown", handleEvent)
    }, [])

    const handleSelect = useCallback(
        (value: Theme) => {
            setTheme(value)
            setIsOpen(false)
        },
        [setTheme],
    )

    const SelectedIcon = themeOptions.find((t) => t.value === theme)?.icon ?? themeOptions[0].icon

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="group relative w-full flex items-center justify-between px-4 py-3 sm:py-3 md:py-2.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <div className="flex items-center gap-3 sm:gap-2">
                    <SelectedIcon className="w-6 h-6 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-base sm:text-sm">{themeOptions.find((t) => t.value === theme)?.label ?? themeOptions[0].label}</span>
                </div>
                <MdKeyboardArrowDown
                    className={`w-6 h-6 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>
            {isOpen && <div className="fixed inset-0 bg-black/20 z-40 sm:hidden" onClick={() => setIsOpen(false)} />}
            {isOpen && (
                <div
                    className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 mt-2 w-full sm:min-w-[280px] sm:w-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
                    role="listbox"
                >
                    {themeOptions.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => handleSelect(t.value)}
                            className={`w-full flex items-center gap-3 px-4 py-4 sm:py-3 text-left transition-all duration-150 ${
                                theme === t.value
                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                            role="option"
                            aria-selected={theme === t.value}
                        >
                            <t.icon
                                className={`w-6 h-6 sm:w-5 sm:h-5 ${
                                    theme === t.value ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                                }`}
                            />
                            <span className="flex-1 truncate">{t.label}</span>
                            {theme === t.value && <MdCheck className="w-5 h-5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
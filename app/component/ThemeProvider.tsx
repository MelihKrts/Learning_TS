"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"

export type Theme = "light" | "dark" | "system"

interface ThemeContextType {
    theme: Theme
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    // Initialize theme to a default value (e.g., "system") for both server and client.
    // localStorage will be read in a useEffect after hydration.
    const [theme, setThemeState] = useState<Theme>("system")

    // Function to apply the theme to the document element's class list
    const applyThemeToDocument = useCallback((currentTheme: Theme) => {
        if (typeof window === "undefined") return // Skip if not in browser environment

        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (currentTheme === "dark" || (currentTheme === "system" && isSystemDark)) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [])

    // Effect to read from localStorage and set the initial theme after hydration
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme") as Theme | null
            if (savedTheme) {
                setThemeState(savedTheme)
            }
            // Apply the theme immediately after reading from localStorage
            applyThemeToDocument(savedTheme || "system")
        }
    }, [applyThemeToDocument]) // Run only once on mount

    // Effect to apply theme to document and persist to localStorage whenever theme state changes
    useEffect(() => {
        applyThemeToDocument(theme)
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", theme) // Persist the theme to localStorage
        }
    }, [theme, applyThemeToDocument])

    // Effect to listen for system theme changes
    useEffect(() => {
        if (typeof window === "undefined") return

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const handleSystemThemeChange = () => {
            // If the current theme is 'system', re-apply to reflect the new system preference
            if (theme === "system") {
                applyThemeToDocument("system")
            }
        }

        mediaQuery.addEventListener("change", handleSystemThemeChange)

        // Cleanup the event listener on component unmount
        return () => {
            mediaQuery.removeEventListener("change", handleSystemThemeChange)
        }
    }, [theme, applyThemeToDocument])

    // Expose a wrapper for setTheme that updates the state
    const setTheme = useCallback((newTheme: Theme | ((prevState: Theme) => Theme)) => {
        setThemeState((prevTheme) => {
            const resolvedTheme = typeof newTheme === "function" ? newTheme(prevTheme) : newTheme
            return resolvedTheme
        })
    }, [])

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) throw new Error("useTheme must be used within a ThemeProvider")
    return context
}

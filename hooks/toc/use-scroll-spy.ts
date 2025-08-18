"use client"

import { useEffect, useState } from "react"
import type { Heading } from "./use-headings"

export function useScrollSpy(headings: Heading[]) {
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        if (headings.length === 0) return

        const handleScroll = () => {
            const headingElements = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[]

            let current = ""

            for (let i = headingElements.length - 1; i >= 0; i--) {
                const el = headingElements[i]
                if (el && el.getBoundingClientRect().top <= 150) {
                    current = el.id
                    break
                }
            }

            setActiveId(current)
        }

        handleScroll()

        let ticking = false
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll()
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener("scroll", throttledScroll, { passive: true })
        return () => window.removeEventListener("scroll", throttledScroll)
    }, [headings])

    return activeId
}

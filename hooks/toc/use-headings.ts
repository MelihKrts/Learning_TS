"use client"

import { useEffect, useState } from "react"

export type Heading = {
    id: string
    text: string
    level: number
}

const EXCLUDED_SELECTORS = ["footer", "header", "nav", ".sidebar", "#sidebar", ".toc", "#toc", "aside", ".title"]

export function useHeadings() {
    const [headings, setHeadings] = useState<Heading[]>([])

    useEffect(() => {
        const extractHeadings = () => {
            const contentContainer = document.querySelector("main")
            let elements: HTMLElement[]

            if (contentContainer) {
                const allHeadingsInMain = Array.from(contentContainer.querySelectorAll("h1,h2,h3,h4,h5,h6")) as HTMLElement[]

                elements = allHeadingsInMain.filter((el) => !EXCLUDED_SELECTORS.some((selector) => el.closest(selector)))
            } else {
                const allHeadings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")) as HTMLElement[]

                elements = allHeadings.filter((el) => !EXCLUDED_SELECTORS.some((selector) => el.closest(selector)))
            }

            const mapped = elements.map((el) => {
                if (!el.id) {
                    el.id = el.innerText
                        .toLowerCase()
                        .replace(/[^a-zA-Z0-9\s]/g, "")
                        .replace(/\s+/g, "_")
                        .trim()
                }

                return {
                    id: el.id,
                    text: el.innerText,
                    level: Number.parseInt(el.tagName.replace("H", ""), 10),
                }
            })

            setHeadings(mapped)
        }

        extractHeadings()
    }, [])

    return headings
}

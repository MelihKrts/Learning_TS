"use client"
import {LuTableOfContents} from "react-icons/lu"
import {useCallback, useState} from "react"
import {useHeadings} from "@/hooks/toc/use-headings"
import {useScrollSpy} from "@/hooks/toc/use-scroll-spy"
import {TOCPanel} from "@/app/component/ui/TableOfContents/TocPanel";

export default function TOCBtn() {
    const [show, setShow] = useState<boolean>(false)
    const headings = useHeadings()
    const activeId = useScrollSpy(headings)

    const handleOpen = useCallback(() => {
        setShow((prev) => !prev)
    }, [])

    const handleClose = useCallback(() => {
        setShow(false)
    }, [])

    const handleLinkClick = useCallback((id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const yOffset = -100
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

            window.scrollTo({top: y, behavior: "smooth"})
            setShow(false)
        }
    }, [])

    return (
        <>
            <button
                onClick={handleOpen}
                className="size-8 flex justify-center items-center cursor-pointer fixed top-1/2 right-0 bg-purple-200 hover:bg-purple-300 transition-all duration-300 ease-in-out rounded-l-md shadow-md z-50"
                title="İçindekiler Tablosu"
            >
                <LuTableOfContents/>
            </button>

            {show &&
                <TOCPanel headings={headings} activeId={activeId} onClose={handleClose} onLinkClick={handleLinkClick}/>}
        </>
    )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { memo } from "react"

interface Doc {
    slug: string
    title: string
}

interface CollapsedSidebarIconsProps {
    docTree: Doc[]
}

export const CollapsedSidebarIcons = memo(function CollapsedSidebarIcons({ docTree }: CollapsedSidebarIconsProps) {
    const pathname = usePathname()

    return (
        <div className="p-2 space-y-2">
            {docTree.slice(0, 8).map((doc, index) => {
                const isActive = pathname === `/docs/${doc.slug}`

                return (
                    <Link
                        key={doc.slug}
                        href={`/docs/${doc.slug}`}
                        className={`block w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium ${
                            isActive ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-100"
                        }`}
                        title={doc.title}
                    >
                        {(index + 1).toString()}
                    </Link>
                )
            })}
        </div>
    )
})

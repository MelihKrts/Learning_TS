"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { memo } from "react"

interface Doc {
    slug: string
    title: string
    description?: string
}

interface SidebarNavigationProps {
    docTree: Doc[]
    onLinkClick?: () => void
}

export const SidebarNavigation = memo(function SidebarNavigation({ docTree, onLinkClick }: SidebarNavigationProps) {
    const pathname = usePathname()

    return (
        <nav>
            <ul className="space-y-1">
                {docTree.map((doc) => {
                    const isActive = pathname === `/docs/${doc.slug}`

                    return (
                        <li key={doc.slug}>
                            <Link
                                href={`/docs/${doc.slug}`}
                                onClick={onLinkClick}
                                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                    isActive
                                        ? "bg-blue-100 text-blue-900 font-medium"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                                <div className="font-medium">{doc.title}</div>
                                {doc.description && <div className="text-xs text-gray-500 mt-1">{doc.description}</div>}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
})

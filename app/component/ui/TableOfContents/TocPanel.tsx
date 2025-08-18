"use client"

import { memo } from "react"
import type { Heading } from "@/hooks/toc/use-headings"

interface TOCPanelProps {
    headings: Heading[]
    activeId: string
    onClose: () => void
    onLinkClick: (id: string) => void
}

export const TOCPanel = memo(function TOCPanel({ headings, activeId, onClose, onLinkClick }: TOCPanelProps) {
    return (
        <>
            <div
                className="fixed inset-0 bg-white/10 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out"
                onClick={onClose}
            />

            <div className="bg-white shadow-xl p-4 rounded-lg w-72 max-h-96 overflow-y-auto fixed top-1/2 right-10 -translate-y-1/2 z-50 border transition-all duration-300 ease-in-out transform">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold text-lg">İçindekiler</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl leading-none transition-colors duration-200"
                    >
                        ×
                    </button>
                </div>

                {headings.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                        {headings.map((h) => (
                            <li
                                key={h.id}
                                style={{ marginLeft: `${(h.level - 1) * 12}px` }}
                                className={`pl-2 transition-all duration-200 ${
                                    h.id === activeId
                                        ? "bg-purple-50 border-l-3 border-purple-500 text-purple-700 font-medium rounded-r"
                                        : "border-l-3 border-transparent"
                                }`}
                            >
                                <button
                                    onClick={() => onLinkClick(h.id)}
                                    className={`text-left w-full py-1 px-2 rounded transition-all duration-200 ${
                                        h.id === activeId ? "text-purple-700 font-medium" : "hover:text-purple-600 hover:bg-purple-25"
                                    }`}
                                >
                                    {h.text}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-sm">Başlık bulunamadı</p>
                )}
            </div>
        </>
    )
})

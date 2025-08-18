"use client"

import { type TabType, TABS, TAB_LABELS } from "@/lib/editor/types"

interface TabNavigationProps {
    activeTab: TabType
    onTabChange: (tab: TabType) => void
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="flex-shrink-0 flex border-b border-gray-700 bg-gray-800 overflow-x-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
            {TABS.map((tab) => (
                <button
                    key={tab}
                    className={`flex-shrink-0 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 font-medium transition-all duration-200 border-b-2 text-xs sm:text-sm lg:text-base whitespace-nowrap ${
                        activeTab === tab
                            ? "bg-gray-700 text-white border-blue-500"
                            : "text-gray-400 hover:bg-gray-700 hover:text-white border-transparent"
                    }`}
                    onClick={() => onTabChange(tab)}
                >
                    {TAB_LABELS[tab]}
                </button>
            ))}
        </div>
    )
}

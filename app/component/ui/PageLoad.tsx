"use client"
import React, {useEffect, useState} from "react";

export const PageLoadTime = () => {
    const [loadTime, setLoadTime] = useState<number | null>(null)

    useEffect(() => {
        const navEntries = performance.getEntriesByType("navigation")
        if (navEntries.length > 0) {
            const navTiming = navEntries[0] as PerformanceNavigationTiming
            const time = navTiming.loadEventEnd - navTiming.startTime
            setLoadTime(Number((time / 1000).toFixed(2)))
        }
    }, [])
    if (loadTime === null) return null
    return (
        <div
            className="fixed bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-3 py-1 rounded shadow-md z-50">
            Sayfa Yüklenme Süresi: {loadTime}s
        </div>
    )
}
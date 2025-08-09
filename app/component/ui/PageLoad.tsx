"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const PageLoadTime = () => {
    const [loadTime, setLoadTime] = useState<number | null>(null);
    const pathname = usePathname();

    const measureLoadTime = (start: number) => {
        const time = (performance.now() - start) / 1000;
        setLoadTime(Number(time.toFixed(2)));
    };

    useEffect(() => {
        const navEntries = performance.getEntriesByType("navigation");
        const navTiming = navEntries[0] as PerformanceNavigationTiming | undefined;

        if (navTiming && pathname === "/") {
            const time = (navTiming.loadEventEnd - navTiming.startTime) / 1000;
            setLoadTime(Number(time.toFixed(2)));
        } else {
            const now = performance.now();
            requestAnimationFrame(() => {
                measureLoadTime(now);
            });
        }
    }, [pathname]);

    if (loadTime === null) return null;

    return (
        <div className="fixed bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-3 py-1 rounded shadow-md z-50">
            Sayfa Yüklenme Süresi: {loadTime}s
        </div>
    );
};

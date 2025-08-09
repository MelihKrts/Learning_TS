"use client"

import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";

export const PageLoadTime = () => {
    const [loadTime, setLoadTime] = useState<number | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const navigationStart = performance.now()
        const timer = setTimeout(() => {
            const now = performance.now()
            const seconds = (now - navigationStart) / 1000
            setLoadTime(seconds)
        }, 0)

        return () => clearTimeout(timer)
    }, [pathname]);

    if (loadTime === null) return null;

    const formattedTime = loadTime < 0.01 ? "<0.01s" : `${loadTime.toFixed(2)}s`

    return (
        <div className="fixed bottom-2 right-2 bg-black/80 text-white text-xs px-3 py-1 rounded shadow-md z-50">
            Sayfa Yüklenme Süresi: {formattedTime}
        </div>
    )
};
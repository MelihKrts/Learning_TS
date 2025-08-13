"use client"
import {useEffect} from "react";
import {useTheme} from "./ThemeProvider"

export default function ThemeColorUpdater() {
    const {theme} = useTheme();

    useEffect(() => {
        if(typeof window ==="undefined") return

        const setColor = () => {
            const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            const finalTheme = theme === "system" ? (isSystemDark ? "dark":"light"):theme

            const color = finalTheme === "dark" ? "#5D4037" : "#F4E6D8";

            let metaTag = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
            if (!metaTag) {
                metaTag = document.createElement("meta");
                metaTag.name = "theme-color";
                document.head.appendChild(metaTag);
            }
            metaTag.content=color
        }

        setColor()

        const mq = window.matchMedia("(prefers-color-scheme: dark)")
        mq.addEventListener("change", setColor)

        return () => mq.removeEventListener("change",setColor)

    }, [theme]);

    return null
}
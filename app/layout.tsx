import type {Metadata} from "next";
import localFont from "next/font/local"
import "./globals.css";
import Footer from "@/app/component/layout/Footer";
import Header from "@/app/component/layout/Header";
import type React from "react";
import {ThemeProvider} from "@/app/component/ThemeProvider";
import dynamic from "next/dynamic";

const CheckConnectionControl = dynamic(()=> import("@/app/component/ui/CheckConnectionControl"));

const delivery = localFont({
    src: [
        {
            path: "../public/fonts/Delivery_W_Rg.woff2",
            weight:"normal",
            style:"normal"
        },
    ],
})

export const metadata: Metadata = {
    title: "Learn TypeScript",
    description: "Learning TypeScript.",
};

export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr" className={delivery.className}>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
        <meta name="theme-color" content="#F4E6D8" media="(prefers-color-scheme: light)"/>
        <meta name="theme-color" content="#5D4037" media="(prefers-color-scheme: dark)"/>
        <link rel="manifest" href="/manifest.json"/>
        <body className="dark:bg-black">
        <ThemeProvider>
            <Header/>
            <CheckConnectionControl/>
            <main className="mt-16 min-h-dvh w-full relative">
                {children}
            </main>
            <Footer/>
        </ThemeProvider>
        </body>
        </html>
    );
}

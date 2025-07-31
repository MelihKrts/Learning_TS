import type {Metadata} from "next";
import localFont from "next/font/local"
import "./globals.css";
import Footer from "@/app/component/layout/Footer";
import Header from "@/app/component/layout/Header";
import type React from "react";

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
        <link rel="icon" href="/favicon.ico" type="image/svg+xml"/>

        <body>
        <Header/>
        <main className="mt-16 min-h-dvh w-full relative">
            {children}
        </main>
        <Footer/>
        </body>
        </html>
    );
}

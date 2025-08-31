import type {Metadata} from "next";
import localFont from "next/font/local"
import "./globals.css";
import Footer from "@/app/component/layout/Footer";
import Header from "@/app/component/layout/Header";
import type React from "react";
import {ThemeProvider} from "@/app/component/ThemeProvider";
import dynamic from "next/dynamic";
import ThemeColorUpdater from "@/app/component/ThemeColorUpdater";

const CheckConnectionControl = dynamic(()=> import("@/app/component/ui/CheckConnectionControl/CheckConnectionControl"));

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
        <link rel="apple-touch-icon" href="/ios/128.png"/>
        {/* iPhone 5, SE (1st gen) – 4 inch */}
        <link rel="apple-touch-startup-image" href="/ios-splash-img/ip5-ipSE4.png"
              media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>

        {/* iPhone 6, 7, 8 */}
        <link rel="apple-touch-startup-image" href="/ios-splash-img/ip6.png" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)
  and (orientation: portrait)"/>

        {/* iPhone X, XS, 11 Pro */}
        <link
            rel="apple-touch-startup-image" href="/ios-splash-img/ip11XS.png"
            media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>

        {/* iPhone XR, iPhone 11 */}
        <link rel="apple-touch-startup-image" href="/ios-splash-img/ipXR.png"
              media="screen and (device-width: 414px) and (device-height: 896px) and(-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />

        {/* iPhone XS Max, 11 Pro Max */}
        <link rel="apple-touch-startup-image" href="/ios-splash-img/ipX-XII.png"
              media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />

        {/* iPhone 12, 13, 14, 16 (standart modeller) */}
        <link rel="apple-touch-startup-image" href="/ios-splash-img/ipXII-XIV.png"
              media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />

        {/* iPhone 14 Plus, 14 Pro Max, 15 Pro Max, 16 Plus */}
        <link rel="apple-touch-startup-image" href="/ios-splash-img/ipXIV-XVI.png"
              media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />

        {/* iPhone 14 Pro, 15 Pro, 16 Pro */}
        <link rel="apple-touch-startup-image" href="/ios-splash-img/ipXIV-XVIpro.png"
              media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />

        {/* iPhone 16e */}
        <link rel="apple-touch-startup-image" href="/ios-splash-img/ip16e.png"
              media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <meta name="theme-color" content="#F4E6D8" media="(prefers-color-scheme: light)"/>
        <meta name="theme-color" content="#5D4037" media="(prefers-color-scheme: dark)"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-touch-fullscreen" content="yes"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-title" content="Learn TS"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
        <link rel="manifest" href="/manifest.json"/>
        <body className="dark:bg-black">
        <ThemeProvider>
            <ThemeColorUpdater/>
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

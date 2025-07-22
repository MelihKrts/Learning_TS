import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/app/component/layout/Footer";
import Header from "@/app/component/layout/Header";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Learn TypeScript",
  description: "Learning TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Header/>
      <main className="mt-16 min-h-dvh w-full relative">
          {children}
      </main>
      <Footer/>
      </body>
    </html>
  );
}

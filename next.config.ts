// next.config.mjs
import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache"; // Standart caching kuralları

const pwa = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    runtimeCaching, // Hazır offline cache kuralları
    buildExcludes: [/middleware-manifest.json$/],
    globPatterns: [
        "**/*.{js,css,html,svg,png,jpg,jpeg,webp,json,mdx,woff,woff2}"
    ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    compress: true,
    reactStrictMode: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
    turbopack: {
        resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".json"],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default pwa(nextConfig);

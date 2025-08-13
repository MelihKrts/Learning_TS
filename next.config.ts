import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache";

const pwa = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    workboxOptions: {
        globPatterns: [
            "**/*.{js,css,html,svg,png,jpg,jpeg,webp,json,mdx,woff,woff2}"
        ],
        runtimeCaching,
    },
    buildExcludes: [/middleware-manifest.json$/],
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
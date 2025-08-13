import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const pwaConfig = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: isDev,
    runtimeCaching,
    buildExcludes: [/middleware-manifest\.json$/],
    globPatterns: [
        "**/*.{js,css,html,svg,png,jpg,jpeg,webp,json,mdx,woff,woff2,eot,ttf}"
    ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    compress: true,
    reactStrictMode: true,
    compiler: {
        removeConsole: !isDev,
    },
    turbopack: {
        resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".json"],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default pwaConfig(nextConfig);

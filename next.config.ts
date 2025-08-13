import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const pwaConfig = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: isDev,
    globPatterns: [
        "**/*.{js,css,html,svg,png,jpg,jpeg,webp,json,mdx,woff,woff2,eot,ttf}"
    ],
    buildExcludes: [/middleware-manifest\.json$/],
    // globPatterns ve workboxOptions kaldırıldı
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

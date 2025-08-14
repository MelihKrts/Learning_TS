import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache";

const pwaConfig = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    cacheStartUrl: true,
    reloadOnOnline: true,
    disable: process.env.NODE_ENV === "development",
    buildExcludes: [/app-build-manifest.json$/],
    fallbacks: {
        document: "/offline", // Next.js page fallback
    },
    runtimeCaching, // JS/CSS/HTML/asset caching
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
    compress: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
};

export default pwaConfig(nextConfig);

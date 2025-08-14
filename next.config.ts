import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache";

/** Next PWA config */
const pwaConfig = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    cacheStartUrl: true,
    reloadOnOnline: true,
    generateSW: ({
        globPattern:[
            "**/*.{js,css,html,svg,png,jpg,jpeg,webp,json,mdx}"
        ],
    }),
    disable: process.env.NODE_ENV === "development",
    buildExcludes: [/app-build-manifest.json$/],
    fallbacks: {
        document: "/offline.html", // internet yoksa gösterilecek fallback
    },
    runtimeCaching, // JS/CSS/HTML ve asset cache
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

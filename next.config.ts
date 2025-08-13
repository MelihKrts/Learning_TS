// next.config.js
import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache";

const isDev = process.env.NODE_ENV === "development";

const pwaConfig = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: isDev,           // development sırasında SW devre dışı
    runtimeCaching,           // default runtime caching
    buildExcludes: [/middleware-manifest\.json$/], // SW cache dışında bırak
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

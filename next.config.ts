import withPWA from "next-pwa"

const pwa = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    sw: "sw.js",
    workboxOptions: {
        disableDevLogs: true,
        // Runtime caching
        runtimeCaching: [
            {
                urlPattern: /^https?.*/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'offlineCache',
                    expiration: {
                        maxEntries: 200,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 gün
                    },
                }
            },
            // TypeScript Editor için özel cache
            {
                urlPattern: /^https:\/\/unpkg\.com\/monaco-editor/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'monaco-cache',
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 365 * 24 * 60 * 60 // 1 yıl
                    },
                }
            }
        ],
        buildExcludes: [/app-build-manifest.json$/],
        globPatterns: [
            "**/*.{js,css,html,svg,png,jpg,jpeg,webp,json,mdx}"
        ],
    }
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    compress: true,
    reactStrictMode: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    turbopack: {
        resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default pwa(nextConfig)
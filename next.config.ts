// import withPWA from "next-pwa"
// import runtimeCaching from "next-pwa/cache"
//
// const pwaConfig = withPWA({
//     dest:"public",
//     register:true,
//     skipWaiting:true,
//     disable: process.env.NODE_ENV === 'development',
//     buildExcludes: [/app-build-manifest.json$/],
//
//     workboxOptions: {
//         globPattern:[
//             "**/*.{js,css,html,svg,png,jpg,jpeg,webp,json,mdx}"
//         ],
//     },
//     runtimeCaching
// })
//
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
//     compress: true,
//     reactStrictMode: true,
//     compiler: {
//         removeConsole: process.env.NODE_ENV === 'production',
//     },
//     turbopack: {
//         resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
//     }
// }
//
//
// export default pwaConfig(nextConfig)

import withPWA from "next-pwa";

const pwaConfig = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    buildExcludes: [/app-build-manifest.json$/],
    runtimeCaching: [
        {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'offlineCache',
                expiration: {
                    maxEntries: 200,
                    maxAgeSeconds: 24 * 60 * 60, // 24 hours
                },
            },
        },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'images',
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
            },
        },
        {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-resources',
            },
        },
    ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    compress: true,
    reactStrictMode: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
};

export default pwaConfig(nextConfig);

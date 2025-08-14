// @ts-check
import withPWA from "next-pwa";

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
    // MDX için gerekli
    experimental: {
        mdxRs: true,
    },
};

const pwaConfig = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    buildExcludes: [/app-build-manifest\.json$/],

    // MDX + SSR için optimize edilmiş cache stratejileri
    runtimeCaching: [
        // Next.js data (getStaticProps, getServerSideProps verisi)
        {
            urlPattern: /\/_next\/data\/.+\.json$/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'next-ssg-data',
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 60 * 60, // 1 saat (SSR data için)
                },
                networkTimeoutSeconds: 3,
            },
        },
        // Static chunks (MDX derlenmiş dosyalar)
        {
            urlPattern: /\/_next\/static\/.+\.js$/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'next-static-chunks',
                expiration: {
                    maxEntries: 64,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 gün
                },
            },
        },
        // CSS dosyaları (MDX styling dahil)
        {
            urlPattern: /\/_next\/static\/.+\.css$/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'next-static-css',
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 gün
                },
            },
        },
        // Resimler (MDX içindeki resimler dahil)
        {
            urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-image-cache',
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 * 7, // 7 gün
                },
            },
        },
        // Next.js Image Optimization
        {
            urlPattern: /\/_next\/image\?url=.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'next-image-cache',
                expiration: {
                    maxEntries: 64,
                    maxAgeSeconds: 60 * 60 * 24 * 7, // 7 gün
                },
            },
        },
        // Fontlar
        {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 60 * 60 * 24 * 365, // 1 yıl
                },
            },
        },
        {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 60 * 60 * 24 * 365, // 1 yıl
                },
            },
        },
        // API rotaları (eğer varsa)
        {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-cache',
                expiration: {
                    maxEntries: 16,
                    maxAgeSeconds: 60 * 5, // 5 dakika (API için kısa)
                },
                networkTimeoutSeconds: 5,
            },
        },
        // External assets (CDN'lerden gelen dosyalar)
        {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'external-resources',
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 60 * 60 * 24, // 1 gün
                },
            },
        },
        // HTML sayfaları (MDX sayfaları dahil) - en son
        {
            urlPattern: ({ request }:any) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
                cacheName: 'pages-cache',
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 60 * 60 * 2, // 2 saat
                },
                networkTimeoutSeconds: 3,
            },
        },
    ],
});

export default pwaConfig(nextConfig);
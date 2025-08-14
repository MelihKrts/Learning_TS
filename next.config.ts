import withPWA from "next-pwa"
import runtimeCaching from "next-pwa/cache"

const pwaConfig = withPWA({
    dest:"public",
    register:true,
    skipWaiting:true,
    cacheStartUrl:true,
    reloadOnOnline:true,
    disable: process.env.NODE_ENV === 'development',
    buildExcludes: [/app-build-manifest.json$/],
    runtimeCaching
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
    }
}


export default pwaConfig(nextConfig)
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure `pageExtensions` to include content and MDX files
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    // Optionally, add any other Next.js config belowü
}

const withMDX = createMDX({
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)

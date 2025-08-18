import { compileMDX } from "next-mdx-remote/rsc"
import fs from "fs"
import path from "path"
import { mdxComponents } from "@/mdx-components"
import { rehypeConfig } from "@/lib/mdx-config"

interface Frontmatter {
    title?: string
    description?: string
    prev?: string
    next?: string
    prevTitle?: string
    nextTitle?: string
    order?: number
    tags?: string[]
    lastUpdated?: string
}

export async function useMdxContent(slug: string) {
    const filePath = path.join(process.cwd(), "content", `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
        return null
    }

    try {
        const mdxSource = fs.readFileSync(filePath, "utf8")

        const { content, frontmatter } = await compileMDX<Frontmatter>({
            source: mdxSource,
            options: {
                parseFrontmatter: true,
                mdxOptions: {
                    // @ts-ignore
                    rehypePlugins: [rehypeConfig],
                },
            },
            components: mdxComponents,
        })

        return { content, frontmatter }
    } catch (error) {
        console.error("MDX compile error:", error)
        return null
    }
}

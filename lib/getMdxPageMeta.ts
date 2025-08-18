import fs from "fs"
import path from "path"
import matter from "gray-matter"

interface DocMeta {
    title: string
    description?: string
    prev?: string
    next?: string
    prevTitle?: string
    nextTitle?: string
    order?: number
    tags?: string[]
    lastUpdated?: string
}

interface DocTreeItem {
    slug: string
    title: string
    order?: number
    children?: DocTreeItem[]
}

export function getMdxPageMeta(slug: string): DocMeta {
    const filePath = path.join(process.cwd(), "content", `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${slug}.mdx`)
    }

    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data } = matter(fileContent)

    return {
        title: data.title || slug,
        description: data.description,
        prev: data.prev,
        next: data.next,
        prevTitle: data.prevTitle,
        nextTitle: data.nextTitle,
        order: data.order,
        tags: data.tags,
        lastUpdated: data.lastUpdated,
    }
}

export function getAllDocSlugs(): string[] {
    const contentDir = path.join(process.cwd(), "content")

    if (!fs.existsSync(contentDir)) {
        return []
    }

    const files = fs.readdirSync(contentDir)
    return files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(".mdx", ""))
}

export function getDocTree(): DocTreeItem[] {
    const slugs = getAllDocSlugs()
    const docs: DocTreeItem[] = []

    for (const slug of slugs) {
        try {
            const meta = getMdxPageMeta(slug)
            docs.push({
                slug,
                title: meta.title,
                order: meta.order,
            })
        } catch {
            // Skip files that can't be parsed
            continue
        }
    }

    // Sort by order if available, otherwise alphabetically
    return docs.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order
        }
        if (a.order !== undefined) return -1
        if (b.order !== undefined) return 1
        return a.title.localeCompare(b.title)
    })
}

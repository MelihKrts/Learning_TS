// lib/getMdxPageMeta.ts
import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface DocMeta {
    title?: string;
    description?: string;
    prev?: string;
    next?: string;
    order?: number;
    tags?: string[];
    lastUpdated?: string;
}

export interface DocWithSlug extends DocMeta {
    slug: string;
}

export function getMdxPageMeta(slug: string): DocMeta {
    const filepath = path.join(process.cwd(), "content", `${slug}.mdx`)

    if (!fs.existsSync(filepath)) {
        throw new Error(`MDX file not found: ${slug}.mdx`)
    }

    const fileContent = fs.readFileSync(filepath, "utf8")
    const { data } = matter(fileContent)
    return data as DocMeta
}

// Tüm dokümantasyon sayfalarını listele
export function getAllDocSlugs(): string[] {
    const docsDirectory = path.join(process.cwd(), "content")

    if (!fs.existsSync(docsDirectory)) {
        return []
    }

    return fs.readdirSync(docsDirectory)
        .filter(file => file.endsWith('.mdx'))
        .map(file => file.replace('.mdx', ''))
}

// Tüm dokümantasyon meta verilerini al
export function getAllDocsMeta(): DocWithSlug[] {
    const slugs = getAllDocSlugs()

    return slugs.map(slug => ({
        slug,
        ...getMdxPageMeta(slug)
    })).sort((a, b) => (a.order || 999) - (b.order || 999))
}

// Sidebar için dokümantasyon ağacı oluştur
export function getDocTree() {
    const allDocs = getAllDocsMeta()

    return allDocs.map(doc => ({
        slug: doc.slug,
        title: doc.title || doc.slug,
        order: doc.order || 999,
        description: doc.description
    }))
}

// Önceki/sonraki sayfa bilgilerini al
export function getNavigation(currentSlug: string) {
    const allDocs = getAllDocsMeta()
    const currentIndex = allDocs.findIndex(doc => doc.slug === currentSlug)

    return {
        prev: currentIndex > 0 ? allDocs[currentIndex - 1] : null,
        next: currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null
    }
}
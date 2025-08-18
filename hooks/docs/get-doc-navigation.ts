import { getMdxPageMeta } from "@/lib/getMdxPageMeta"

interface Frontmatter {
    prev?: string
    next?: string
    prevTitle?: string
    nextTitle?: string
}

function getNavigationTitle(slug: string): string {
    try {
        const meta = getMdxPageMeta(slug)
        return meta.title || slug
    } catch {
        return slug
    }
}

export function getDocNavigation(slug: string, frontmatter: Frontmatter) {
    const meta = getMdxPageMeta(slug)

    const prevSlug = frontmatter?.prev || meta.prev
    const nextSlug = frontmatter?.next || meta.next

    const prevTitle = prevSlug ? frontmatter?.prevTitle || meta.prevTitle || getNavigationTitle(prevSlug) : undefined

    const nextTitle = nextSlug ? frontmatter?.nextTitle || meta.nextTitle || getNavigationTitle(nextSlug) : undefined

    return {
        prevSlug,
        nextSlug,
        prevTitle: prevTitle || undefined,
        nextTitle: nextTitle || undefined,
    }
}

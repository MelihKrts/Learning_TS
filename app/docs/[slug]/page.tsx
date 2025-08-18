import { getAllDocSlugs, getMdxPageMeta } from "@/lib/getMdxPageMeta"
import { notFound } from "next/navigation"
import { useMdxContent } from "@/hooks/docs/use-mdx-content"
import { useDocNavigation } from "@/hooks/docs/use-doc-navigation"
import DocPageNavigation from "@/app/component/ui/DocsSideBar/DocPageNavigation";
import DocPageHeader from "@/app/component/ui/DocsSideBar/DocPageHeader";

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const slugs = getAllDocSlugs()
    return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    try {
        const meta = getMdxPageMeta(slug)
        return {
            title: meta.title || slug,
            description: meta.description || "",
        }
    } catch {
        return {
            title: "Sayfa Bulunamadı",
        }
    }
}

export default async function DocPage({ params }: PageProps) {
    const { slug } = await params

    const mdxResult = await useMdxContent(slug)
    if (!mdxResult) {
        notFound()
    }

    const { content, frontmatter } = mdxResult
    const meta = getMdxPageMeta(slug)
    const navigation = useDocNavigation(slug, frontmatter)

    const title = frontmatter?.title || meta.title
    const description = frontmatter?.description || meta.description

    return (
        <div className="w-full">
            <DocPageHeader title={title} description={description} />
            <article className="max-w-none">{content}</article>
            <DocPageNavigation {...navigation} />
        </div>
    )
}

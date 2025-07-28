// app/docs/[slug]/page.tsx
import { getMdxPageMeta, getAllDocSlugs } from "@/lib/getMdxPageMeta";
import { compileMDX } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/mdx-components";

// Frontmatter tipini tanımla
interface Frontmatter {
    title?: string;
    description?: string;
    prev?: string;
    next?: string;
    prevTitle?: string;
    nextTitle?: string;
    order?: number;
    tags?: string[];
    lastUpdated?: string;
}

// Next.js 15 için params tipi
interface PageProps {
    params: Promise<{ slug: string }>;
}

// Navigation bilgilerini almak için helper fonksiyon
function getNavigationTitle(slug: string): string {
    try {
        const meta = getMdxPageMeta(slug);
        return meta.title || slug;
    } catch {
        return slug;
    }
}

// SSG için zorunlu - tüm slug'ları build time'da generate et
export async function generateStaticParams() {
    const slugs = getAllDocSlugs();

    return slugs.map((slug) => ({
        slug: slug,
    }));
}

// SEO için metadata - Next.js 15 uyumlu
export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;

    try {
        const meta = getMdxPageMeta(slug);
        return {
            title: meta.title || slug,
            description: meta.description || "",
        };
    } catch {
        return {
            title: "Sayfa Bulunamadı",
        };
    }
}

export default async function DocPage({ params }: PageProps) {
    const { slug } = await params;

    const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);

    // Dosya kontrolü
    if (!fs.existsSync(filePath)) {
        notFound();
    }

    try {
        const mdxSource = fs.readFileSync(filePath, "utf8");

        const { content, frontmatter } = await compileMDX<Frontmatter>({
            source: mdxSource,
            options: { parseFrontmatter: true },
            components: mdxComponents
        });

        // Meta bilgilerini al (frontmatter + fallback)
        const meta = getMdxPageMeta(slug);

        // Navigation için konu başlıklarını al
        const prevSlug = frontmatter?.prev || meta.prev;
        const nextSlug = frontmatter?.next || meta.next;

        // Başlık önceliği: frontmatter'daki özel başlık > otomatik başlık
        const prevTitle = prevSlug ? (
            frontmatter?.prevTitle ||
            meta.prevTitle ||
            getNavigationTitle(prevSlug)
        ) : null;

        const nextTitle = nextSlug ? (
            frontmatter?.nextTitle ||
            meta.nextTitle ||
            getNavigationTitle(nextSlug)
        ) : null;

        return (
            <div className="w-full">
                {/* Başlık */}
                <header className="mb-6 lg:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-900">
                        {frontmatter?.title || meta.title}
                    </h1>
                    {(frontmatter?.description || meta.description) && (
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                            {frontmatter?.description || meta.description}
                        </p>
                    )}
                </header>

                {/* MDX İçerik */}
                <article className="max-w-none">
                    {content}
                </article>

                {/* Navigation */}
                <nav className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        {prevSlug && prevTitle && (
                            <Link
                                href={`/docs/${prevSlug}`}
                                className="group inline-flex items-start text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold tracking-wide text-gray-500 group-hover:text-gray-700">
                                        Önceki
                                    </span>
                                    <span className="font-medium group-hover:underline">
                                        {prevTitle}
                                    </span>
                                </div>
                            </Link>
                        )}

                        {nextSlug && nextTitle && (
                            <Link
                                href={`/docs/${nextSlug}`}
                                className="group inline-flex items-start text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base sm:ml-auto sm:text-right"
                            >
                                <div className="flex flex-col sm:items-end">
                                    <span className="text-sm font-bold tracking-wide text-gray-500 group-hover:text-gray-700">
                                        Sonraki
                                    </span>
                                    <span className="font-medium group-hover:underline">
                                        {nextTitle}
                                    </span>
                                </div>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        );
    } catch (error) {
        console.error("MDX compile error:", error);
        notFound();
    }
}
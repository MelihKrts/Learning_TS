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
    order?: number;
    tags?: string[];
    lastUpdated?: string;
}

// Next.js 15 için params tipi
interface PageProps {
    params: Promise<{ slug: string }>;
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
    // Next.js 15'te params await edilmeli
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
                        {(frontmatter?.prev || meta.prev) && (
                            <Link
                                href={`/docs/${frontmatter?.prev || meta.prev}`}
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm sm:text-base font-medium"
                            >
                                <span className="mr-2">←</span>
                                Önceki Konu
                            </Link>
                        )}

                        {(frontmatter?.next || meta.next) && (
                            <Link
                                href={`/docs/${frontmatter?.next || meta.next}`}
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm sm:text-base font-medium sm:ml-auto"
                            >
                                Sonraki Konu
                                <span className="ml-2">→</span>
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
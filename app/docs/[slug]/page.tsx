// app/docs/[slug]/page.tsx
import { getMdxPageMeta, getAllDocSlugs } from "@/lib/getMdxPageMeta";
import { compileMDX } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useMDXComponents } from "@/mdx-components";

// SSG için zorunlu - tüm slug'ları build time'da generate et
export async function generateStaticParams() {
    const slugs = getAllDocSlugs();

    return slugs.map((slug) => ({
        slug: slug,
    }));
}

// SEO için metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
    try {
        const meta = getMdxPageMeta(params.slug);
        return {
            title: meta.title || params.slug,
            description: meta.description || "",
        };
    } catch {
        return {
            title: "Sayfa Bulunamadı",
        };
    }
}

export default async function DocPage({ params }: { params: { slug: string } }) {
    const filePath = path.join(process.cwd(), "content", `${params.slug}.mdx`);

    // Dosya kontrolü
    if (!fs.existsSync(filePath)) {
        notFound();
    }

    try {
        const mdxSource = fs.readFileSync(filePath, "utf8");

        // MDX komponentlerini al
        const components = useMDXComponents({});

        const { content, frontmatter } = await compileMDX({
            source: mdxSource,
            options: { parseFrontmatter: true },
            components: components
        });

        // Meta bilgilerini al (frontmatter + fallback)
        const meta = getMdxPageMeta(params.slug);

        return (
            <div className="w-full">
                {/* Başlık */}
                <header className="mb-6 lg:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-900">
                        {(frontmatter as any)?.title || meta.title}
                    </h1>
                    {((frontmatter as any)?.description || meta.description) && (
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                            {(frontmatter as any)?.description || meta.description}
                        </p>
                    )}
                </header>

                {/* MDX İçerik */}
                <article className=" prose prose-sm sm:prose lg:prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-pre:bg-gray-900  prose-pre:text-gray-100  prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                    {content}
                </article>

                {/* Navigation */}
                <nav className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        {((frontmatter as any)?.prev || meta.prev) && (
                            <Link
                                href={`/docs/${(frontmatter as any)?.prev || meta.prev}`}
                                className=" inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm sm:text-base  font-medium">
                                <span className="mr-2">←</span>
                                Önceki Konu
                            </Link>
                        )}

                        {((frontmatter as any)?.next || meta.next) && (
                            <Link
                                href={`/docs/${(frontmatter as any)?.next || meta.next}`}
                                className=" inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm sm:text-base font-medium sm:ml-auto">
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
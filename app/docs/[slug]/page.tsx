// // app/docs/[slug]/page.tsx
// import { getMdxPageMeta, getAllDocSlugs } from "@/lib/getMdxPageMeta";
// import { compileMDX } from "next-mdx-remote/rsc";
// import fs from "fs";
// import path from "path";
// import { notFound } from "next/navigation";
// import Link from "next/link";
// import rehypePrettyCode from "rehype-pretty-code";
// import { mdxComponents } from "@/mdx-components";
//
// interface Frontmatter {
//     title?: string;
//     description?: string;
//     prev?: string;
//     next?: string;
//     prevTitle?: string;
//     nextTitle?: string;
//     order?: number;
//     tags?: string[];
//     lastUpdated?: string;
// }
//
// interface PageProps {
//     params: Promise<{ slug: string }>;
// }
//
// function getNavigationTitle(slug: string): string {
//     try {
//         const meta = getMdxPageMeta(slug);
//         return meta.title || slug;
//     } catch {
//         return slug;
//     }
// }
//
// export async function generateStaticParams() {
//     const slugs = getAllDocSlugs();
//     return slugs.map((slug) => ({ slug }));
// }
//
// export async function generateMetadata({ params }: PageProps) {
//     const { slug } = await params;
//     try {
//         const meta = getMdxPageMeta(slug);
//         return {
//             title: meta.title || slug,
//             description: meta.description || "",
//         };
//     } catch {
//         return {
//             title: "Sayfa Bulunamadı",
//         };
//     }
// }
//
// export default async function DocPage({ params }: PageProps) {
//     const { slug } = await params;
//     const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);
//
//     if (!fs.existsSync(filePath)) {
//         notFound();
//     }
//
//     try {
//         const mdxSource = fs.readFileSync(filePath, "utf8");
//
//         const { content, frontmatter } = await compileMDX<Frontmatter>({
//             source: mdxSource,
//             options: {
//                 parseFrontmatter: true,
//                 mdxOptions: {
//                     rehypePlugins: [
//                         [
//                             rehypePrettyCode,
//                             {
//                                 theme: 'andromeeda',
//                                 // defaultLang: 'txt',
//                                 onVisitLine(node:any) {
//                                     // Satırları boş bile olsa koru
//                                     if (node.children.length === 0) {
//                                         node.children = [{ type: 'text', value: ' ' }];
//                                     }
//                                 },
//                                 onVisitHighlightedLine(node:any) {
//                                     node.properties.className.push('highlighted');
//                                 },
//                                 onVisitHighlightedWord(node:any) {
//                                     node.properties.className = ['highlighted-word'];
//                                 },
//                             },
//                         ],
//                     ],
//                 }
//             },
//             components: mdxComponents,
//         });
//
//         const meta = getMdxPageMeta(slug);
//         const prevSlug = frontmatter?.prev || meta.prev;
//         const nextSlug = frontmatter?.next || meta.next;
//
//         const prevTitle = prevSlug
//             ? frontmatter?.prevTitle || meta.prevTitle || getNavigationTitle(prevSlug)
//             : null;
//
//         const nextTitle = nextSlug
//             ? frontmatter?.nextTitle || meta.nextTitle || getNavigationTitle(nextSlug)
//             : null;
//
//         return (
//             <div className="w-full">
//                 <div className="mb-6 lg:mb-8">
//                     <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-900">
//                         {frontmatter?.title || meta.title}
//                     </h1>
//                     {(frontmatter?.description || meta.description) && (
//                         <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
//                             {frontmatter?.description || meta.description}
//                         </p>
//                     )}
//                 </div>
//
//                 <article className="max-w-none">{content}</article>
//
//                 <nav className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200">
//                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//                         {prevSlug && prevTitle && (
//                             <Link
//                                 href={`/docs/${prevSlug}`}
//                                 className="group inline-flex items-start text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
//                             >
//                                 <div className="flex flex-col">
//                   <span className="text-sm font-bold tracking-wide text-gray-500 group-hover:text-gray-700">
//                     Önceki
//                   </span>
//                                     <span className="font-medium group-hover:underline">{prevTitle}</span>
//                                 </div>
//                             </Link>
//                         )}
//                         {nextSlug && nextTitle && (
//                             <Link
//                                 href={`/docs/${nextSlug}`}
//                                 className="group inline-flex items-start text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base sm:ml-auto sm:text-right"
//                             >
//                                 <div className="flex flex-col sm:items-end">
//                   <span className="text-sm font-bold tracking-wide text-gray-500 group-hover:text-gray-700">
//                     Sonraki
//                   </span>
//                                     <span className="font-medium group-hover:underline">{nextTitle}</span>
//                                 </div>
//                             </Link>
//                         )}
//                     </div>
//                 </nav>
//             </div>
//         );
//     } catch (error) {
//         console.error("MDX compile error:", error);
//         notFound();
//     }
// }

// app/docs/[slug]/page.tsx
import { getMdxPageMeta, getAllDocSlugs } from "@/lib/getMdxPageMeta";
import { compileMDX } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/mdx-components";
import type { Element } from "hast";

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

interface PageProps {
    params: Promise<{ slug: string }>;
}

interface ClassNameElement extends Element {
    properties: Element["properties"] & { className?: string[] | string };
}

function getNavigationTitle(slug: string): string {
    try {
        const meta = getMdxPageMeta(slug);
        return meta.title || slug;
    } catch {
        return slug;
    }
}

export async function generateStaticParams() {
    const slugs = getAllDocSlugs();
    return slugs.map((slug) => ({ slug }));
}

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

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    try {
        const mdxSource = fs.readFileSync(filePath, "utf8");

        const { content, frontmatter } = await compileMDX<Frontmatter>({
            source: mdxSource,
            options: {
                parseFrontmatter: true,
                mdxOptions: {
                    rehypePlugins: [
                        [
                            rehypePrettyCode,
                            {
                                theme: "andromeeda",
                                onVisitLine(node: Element) {
                                    if (node.children.length === 0) {
                                        node.children = [{ type: "text", value: " " }];
                                    }
                                },
                                onVisitHighlightedLine(node: ClassNameElement) {
                                    const className = node.properties.className;
                                    if (Array.isArray(className)) {
                                        className.push("highlighted");
                                    } else {
                                        node.properties.className = ["highlighted"];
                                    }
                                },
                                onVisitHighlightedWord(node: ClassNameElement) {
                                    node.properties.className = ["highlighted-word"];
                                },
                            },
                        ],
                    ],
                },
            },
            components: mdxComponents,
        });

        const meta = getMdxPageMeta(slug);
        const prevSlug = frontmatter?.prev || meta.prev;
        const nextSlug = frontmatter?.next || meta.next;

        const prevTitle = prevSlug
            ? frontmatter?.prevTitle || meta.prevTitle || getNavigationTitle(prevSlug)
            : null;

        const nextTitle = nextSlug
            ? frontmatter?.nextTitle || meta.nextTitle || getNavigationTitle(nextSlug)
            : null;

        return (
            <div className="w-full">
                <div className="mb-6 lg:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-900">
                        {frontmatter?.title || meta.title}
                    </h1>
                    {(frontmatter?.description || meta.description) && (
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                            {frontmatter?.description || meta.description}
                        </p>
                    )}
                </div>

                <article className="max-w-none">{content}</article>

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
                                    <span className="font-medium group-hover:underline">{prevTitle}</span>
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
                                    <span className="font-medium group-hover:underline">{nextTitle}</span>
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
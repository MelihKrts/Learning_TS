import type {MDXComponents} from 'mdx/types'
import AlertBox from "@/app/component/ui/AlertBox";
import ImageWithCaption from "@/app/component/ui/ImageWithCaption";
import {CopyButton} from "@/app/component/ui/CopyButton";

const detectLanguage = (className?: string): string => {
    if (!className) return '';
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : '';
}

export const mdxComponents: MDXComponents = {
    AlertBox,
    ImageWithCaption,
    h1: (props) => (
        <h1 className="text-3xl font-bold mb-6 mt-8 text-gray-900 first:mt-0" {...props} />
    ),
    h2: (props) => (
        <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-900" {...props} />
    ),
    h3: (props) => (
        <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-900" {...props} />
    ),
    h4: (props) => (
        <h4 className="text-xl font-bold mb-3  py-2 text-gray-900" {...props} />
    ),
    p: (props) => (
        <p className="mb-4 text-gray-700 leading-relaxed" {...props} />
    ),

    pre: (props) => <div {...props} className="code-block"/>,
    code: (props: any) => {
        const hasLang = props["data-language"];
        const lang = hasLang ? props["data-language"] : "txt";
        const filename = props["data-filename"];

        function extractText(node: any): string {
            if (typeof node === "string") return node;
            if (Array.isArray(node)) return node.map(extractText).join("");
            if (typeof node === "object" && node?.props?.children) return extractText(node.props.children);
            return "";
        }

        const text = extractText(props.children);

        return (
            <figure className="relative my-2 rounded-xl overflow-hidden shadow-sm">
                <figcaption
                    className="absolute top-0 right-2 text-xs font-mono text-gray-400 px-2 py-1 rounded-bl z-10">
                    {lang}
                </figcaption>

                <div className="absolute top-0 left-2 z-10">
                    <CopyButton text={text}/>
                </div>

                <pre className="mt-6 whitespace-pre-wrap break-words overflow-x-auto text-sm leading-none text-gray-100 p-4 rounded-none">
                    <code className={`language-${lang}`}>{props.children}</code>
                </pre>
            </figure>
        );
    },

    ul: (props) => (
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 ml-2" {...props} />
    ),
    ol: (props) => (
        <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 ml-2" {...props} />
    ),
    li: (props) => (
        <li className="leading-relaxed" {...props} />
    ),
    a: (props) => (
        <a className="text-blue-600 no-underline hover:text-blue-800 break-all leading-relaxed transition-colors" {...props} target="_blank" rel="noopener noreferrer" />
    ),
    blockquote: (props) => (
        <blockquote
            className="border-l-4 border-blue-500 px-4 text-gray-600 mb-4 bg-blue-50 py-2 rounded-tr-md rounded-br-md"
            {...props}
        />
    ),
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...mdxComponents,
        AlertBox,
        ImageWithCaption,
        ...components,
    }
}
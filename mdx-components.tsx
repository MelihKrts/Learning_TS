import type {MDXComponents} from 'mdx/types'
import AlertBox from "@/app/component/ui/Alertbox/AlertBox";
import ImageWithCaption from "@/app/component/ui/ImageWithCaption";
import {CopyButton} from "@/app/component/ui/CopyButton/CopyButton";
import FadeInOnView from "@/app/component/ui/FadeInOnView";
import React from "react";

const withDark = (style:string) => `${style} text-gray-600 dark:text-white`

const headingStyles:Record<string, string> = {
    h1: withDark("text-3xl font-bold mb-6 mt-8"),
    h2: withDark("text-2xl font-semibold mb-4 mt-8"),
    h3: withDark("text-xl font-semibold mb-3 mt-6"),
    h4: withDark("text-xl font-bold mb-3 py-2"),
}

const headingComponents = Object.fromEntries(
    Object.entries(headingStyles).map(([Tag,className]) =>[
        Tag,
        (props:any) => (
            <FadeInOnView>
                {React.createElement(Tag,{className, ...props})}
            </FadeInOnView>
        )
    ])
)

export const mdxComponents: MDXComponents = {
    AlertBox,
    ImageWithCaption,
    ...headingComponents,
    p: (props) => (
        <FadeInOnView>
            <p className="mb-4 text-gray-700 leading-relaxed dark:text-white" {...props} />
        </FadeInOnView>
    ),

    pre: (props) => <div {...props} className="code-block"/>,
    code: (props: any) => {
        const hasLang = props["data-language"];
        const lang = hasLang ? props["data-language"] : "txt";


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
                    className="absolute top-0 right-2 text-md font-mono text-gray-400 px-2 py-1 rounded-bl z-10">
                    {lang}
                </figcaption>

                <div className="absolute top-0 left-2 z-10">
                    <CopyButton text={text}/>
                </div>

                <pre className="mt-6 whitespace-pre-wrap break-words overflow-x-auto text-sm leading-none text-gray-100 p-6 rounded-none">
                    <code className={`language-${lang}`}>{props.children}</code>
                </pre>
            </figure>
        );
    },

    ul: (props) => (
        <ul className="list-disc dark:text-white list-inside mb-4 space-y-2 text-gray-700 ml-2" {...props} />
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
            className="border-l-4 border-blue-500 px-4 text-gray-600 mb-4 bg-blue-50 py-2 rounded-tr-md rounded-br-md dark:bg-[#1e293b] dark:text-[#bfdbfe]"
            {...props}
        />
    ),
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...mdxComponents,
        AlertBox,
        ImageWithCaption,
        ...headingComponents,
        ...components,

    }
}
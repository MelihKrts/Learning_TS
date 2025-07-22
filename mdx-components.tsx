// mdx-components.tsx
import type {MDXComponents} from 'mdx/types';
import Container from "@/app/component/layout/Container";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        wrapper: ({children}) => (
            <Container>
                {children}
            </Container>
        ),

        h1: ({children, ...props}) => (
            <h1 className="font-bold text-4xl py-4" {...props}>
                {children}
            </h1>
        ),

        p: ({children, ...props}) => (
            <p className="text-left py-2">
                {children}
            </p>
        ),

        h2: ({children, ...props}) => (
            <h2 className="text-3xl font-bold py-2">
                {children}
            </h2>
        ),

        h3: ({children, ...props}) => (
            <h3 className="text-2xl font-bold py-2">
                {children}
            </h3>
        ),

        h4:({children,...props}) => (
            <h4 className="text-xl font-bold py-2">
                {children}
            </h4>
        ),

        a: ({ href = '', children, ...props }) => {
            const isInternal = href.startsWith('/');
            // Liste içindeki linkler için daha uygun stil
            const className = "text-blue-600 no-underline hover:text-blue-800  break-all leading-relaxed";

            return isInternal ? (
                <Link href={href} {...props} className={className}>
                    {children}
                </Link>
            ) : (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                    className={className}
                >
                    {children}
                </a>
            );
        },

        ul: ({ children, ...props }) => (
            <ul className="list-disc pl-4 space-y-2 my-4" {...props}>
                {children}
            </ul>
        ),

        li: ({ children, ...props }) => (
            <li className="text-base leading-relaxed" {...props}>
                {children}
            </li>
        ),

        blockquote: ({children,...props}) => (
            // <blockquote className=" w-1/2 @3xs:@max-4xl:w-full overflow-hidden rounded-md rounded-tr-xl rounded-br-xl bg-gray-200 px-4 py-2 border-l-4 border-gray-400 my-4">
            //     {children}
            // </blockquote>
            <blockquote
                className="w-4/6 @3xs:@max-4xl:w-full overflow-hidden rounded-tr-xl rounded-br-xl rounded-tl-sm rounded-bl-sm bg-gray-200 px-4 py-2 border-l-4 border-gray-400 my-4">
                {children}
            </blockquote>
        ),


        ...components,
    };
}

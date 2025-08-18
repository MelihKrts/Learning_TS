import rehypePrettyCode from "rehype-pretty-code"
import type { Element } from "hast"

interface ClassNameElement extends Element {
    properties: Element["properties"] & { className?: string[] | string }
}

export const rehypeConfig = [
    rehypePrettyCode,
    {
        theme: {
            light: "rose-pine-dawn",
            dark: "synthwave-84",
        },
        onVisitLine(node: Element) {
            if (node.children.length === 0) {
                node.children = [{ type: "text", value: " " }]
            }
        },
        onVisitHighlightedLine(node: ClassNameElement) {
            const className = node.properties.className
            if (Array.isArray(className)) {
                className.push("highlighted")
            } else {
                node.properties.className = ["highlighted"]
            }
        },
        onVisitHighlightedWord(node: ClassNameElement) {
            node.properties.className = ["highlighted-word"]
        },
    },
]

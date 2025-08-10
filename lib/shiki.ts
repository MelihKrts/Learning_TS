// lib/shiki.ts
import { createHighlighter } from "shiki";

export const loadHighlighter = async () => {
    const highlighter = await createHighlighter({
        themes: ['rose-pine-dawn', 'synthwave-84'],
        langs: ["ts", "tsx", "js", "html", "css", "bash", "json"],
    });

    return highlighter;
};

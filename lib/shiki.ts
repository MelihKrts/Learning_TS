// lib/shiki.ts
import { createHighlighter } from "shiki";

export const loadHighlighter = async () => {
    const highlighter = await createHighlighter({
        themes: ['github-dark'],
        langs: ["ts", "tsx", "js", "html", "css", "bash", "json"],
    });

    return highlighter;
};

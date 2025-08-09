// lib/shiki.ts
import { createHighlighter } from "shiki";

export const loadHighlighter = async () => {
    const highlighter = await createHighlighter({
        themes: ['andromeeda'],
        langs: ["ts", "tsx", "js", "html", "css", "bash", "json"],
    });

    return highlighter;
};

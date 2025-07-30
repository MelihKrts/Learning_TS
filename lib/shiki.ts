// lib/shiki.ts
const { getHighlighter } = require('shiki/core');

export const loadHighlighter = async () => {
    const highlighter = await getHighlighter({
        theme: 'github-dark',
        langs: ['ts', 'tsx', 'js', 'html', 'css', 'bash', 'json'],
    });

    return highlighter;
};

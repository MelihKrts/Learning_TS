export const EDITOR_OPTIONS = {
    // Temel Ayarlar
    automaticLayout: true,
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontLigatures: true,
    lineHeight: 22,
    // Layout ve Görünüm
    minimap: {enabled: false},
    wordWrap: "on" as const,
    tabSize: 2,
    insertSpaces: true,
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    cursorBlinking: "smooth" as const,
    cursorSmoothCaretAnimation: "on" as const,
    renderLineHighlight: "gutter" as const,
    // Autocomplete ve Suggestions
    quickSuggestions: {other: true, comments: true, strings: true},
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: "on" as const,
    wordBasedSuggestions: "matchingDocuments" as const,
    parameterHints: {enabled: true},
    // Code Folding ve Structure
    folding: true,
    foldingHighlight: true,
    foldingStrategy: "indentation" as const,
    showFoldingControls: "mouseover" as const,
    // Indentation
    detectIndentation: true,
    trimAutoWhitespace: true,
    renderIndentGuides: true,
    highlightActiveIndentGuide: true,
    // Selection ve Multi-cursor
    multiCursorModifier: "ctrlCmd" as const,
    multiCursorMergeOverlapping: true,
    selectOnLineNumbers: true,
    // Scrolling
    scrollbar: {
        vertical: "visible" as const,
        horizontal: "visible" as const,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
        arrowSize: 11,
    },
    // Context Menu ve Mouse
    contextmenu: true,
    mouseWheelZoom: true,
    links: true,
    colorDecorators: true,
    // Whitespace ve Formatting
    renderWhitespace: "selection" as const,
    renderControlCharacters: false,
    formatOnType: true,
    formatOnPaste: true,
    // Performance
    useTabStops: true,
    wordWrapColumn: 120,
    wrappingIndent: "indent" as const,
    // Accessibility
    accessibilitySupport: "auto" as const,
    ariaLabel: "Code Editor",
    // Advanced Features
    bracketPairColorization: {enabled: true},
    guides: {
        bracketPairs: true,
        bracketPairsHorizontal: true,
        highlightActiveBracketPair: true,
        indentation: true,
        highlightActiveIndentation: true,
    },
    // Error and Warning Display
    glyphMargin: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    rulers: [80, 120],
    // Find and Replace
    find: {
        seedSearchStringFromSelection: "selection" as const,
        autoFindInSelection: "never" as const,
        addExtraSpaceOnTop: true,
    },
    // HTML ve XML Özellikler
    autoClosingBrackets: "always" as const,
    autoClosingQuotes: "always" as const,
    autoSurround: "quotes" as const,
    autoIndent: "full" as const,
    emptySelectionClipboard: false,
    copyWithSyntaxHighlighting: true,
    matchBrackets: "always" as const,
    autoClosingOvertype: "always" as const,
}

export function getResponsiveEditorOptions(windowWidth: number) {
    const isMobile = windowWidth < 768
    const isTablet = windowWidth < 1024

    return {
        ...EDITOR_OPTIONS,
        padding: {
            top: isMobile ? 8 : 24,
            right: isMobile ? 16 : 8,
            bottom: 8,
            left: isMobile ? 16 : 8,
        },
        scrollbar: {
            ...EDITOR_OPTIONS.scrollbar,
            verticalScrollbarSize: isMobile ? 6 : 10,
            horizontalScrollbarSize: isMobile ? 6 : 10,
            arrowSize: isMobile ? 8 : 11,
            useShadows: true,
            verticalHasArrows: false,
            horizontalHasArrows: false,
        },
        fontSize: isMobile ? 12 : isTablet ? 13 : 14,
        lineHeight: isMobile ? 18 : isTablet ? 20 : 22,
        minimap: {enabled: !isMobile && !isTablet},
        mouseWheelScrollSensitivity: isMobile ? 0.5 : 1,
        fastScrollSensitivity: isMobile ? 2 : 5,
    }
}

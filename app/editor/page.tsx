"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as ts from "typescript"
import dynamic from "next/dynamic"
import type { editor, languages } from "monaco-editor"

// Monaco Editor lazy load
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full text-gray-400">Monaco Editor yükleniyor...</div>
    ),
})

declare global {
    interface Window {
        monaco?: typeof import("monaco-editor")
    }
}

interface MonacoEditorInstance {
    getModel(): editor.ITextModel | null
    getValue(): string
    setValue(value: string): void
}

interface LogEntry {
    id: string
    text: string
    color: string
    timestamp: number
}

type TabType = "ts" | "js" | "html" | "css"
type Theme = "vs-dark" | "vs-light"

const TABS: readonly TabType[] = ["ts", "js", "html", "css"] as const
const TAB_LABELS: Record<TabType, string> = {
    ts: "TypeScript",
    js: "JavaScript",
    html: "HTML",
    css: "CSS",
}

const EDITOR_OPTIONS = {
    // Temel Ayarlar
    automaticLayout: true,
    fontSize: 14,
    fontFamily:
        "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontLigatures: true,
    lineHeight: 22,

    // Layout ve Görünüm
    minimap: { enabled: false },
    wordWrap: "on" as const,
    tabSize: 2,
    insertSpaces: true,
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    cursorBlinking: "smooth" as const,
    cursorSmoothCaretAnimation: "on" as const, // FIXED: "on" instead of true
    renderLineHighlight: "gutter" as const,

    // Autocomplete ve Suggestions
    quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
    },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: "on" as const,
    wordBasedSuggestions: "matchingDocuments" as const,
    parameterHints: { enabled: true },

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
    bracketPairColorization: { enabled: true },
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
    rulers: [80, 120], // Vertical rulers at 80 and 120 chars

    // Find and Replace - FIXED
    find: {
        seedSearchStringFromSelection: "selection" as const,
        autoFindInSelection: "never" as const,
        addExtraSpaceOnTop: true,
    },

    // HTML ve XML Özellikler - AUTO CLOSING TAGS
    autoClosingBrackets: "always" as const,
    autoClosingQuotes: "always" as const,
    autoSurround: "quotes" as const,
    autoIndent: "full" as const,

    // Emmet benzeri özellikler için
    emptySelectionClipboard: false,
    copyWithSyntaxHighlighting: true,

    // Bracket matching
    matchBrackets: "always" as const,

    // Auto closing tags için (HTML için özel)
    autoClosingOvertype: "always" as const,
}

const DEFAULT_CODES: Record<TabType, string> = {
    ts: `let message: string = "Merhaba TypeScript!"; 
console.log(message);`,
    js: `const message = "Merhaba JavaScript!"; 
console.log(message);`,
    html: `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Merhaba Dünya</h1>
    <button onclick="alert('Merhaba Dünya')">Tıkla</button>
</body>
</html>`,
    css: `* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: sans-serif;
    background: #f0f0f0;
    text-align: center;
}`,
}

export default function EditorPage() {
    const [activeTab, setActiveTab] = useState<TabType>("ts")
    const [theme, setTheme] = useState<Theme>("vs-dark")
    const [codes, setCodes] = useState<Record<TabType, string>>(DEFAULT_CODES)
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [isRunning, setIsRunning] = useState(false)

    const iframeRef = useRef<HTMLIFrameElement>(null)
    const editorRef = useRef<MonacoEditorInstance>(null)
    const logIdCounter = useRef(0)

    // Tema güncelleme
    useEffect(() => {
        const html = document.documentElement
        const updateTheme = () => {
            setTheme(html.classList.contains("dark") ? "vs-light" : "vs-dark")
        }
        updateTheme()
        const observer = new MutationObserver(updateTheme)
        observer.observe(html, { attributes: true, attributeFilter: ["class"] })
        return () => observer.disconnect()
    }, [])

    const updateCode = useCallback((tab: TabType, value: string) => {
        setCodes((prev) => ({ ...prev, [tab]: value }))
    }, [])

    const addLog = useCallback((text: string, color: string) => {
        const logEntry: LogEntry = {
            id: `log-${++logIdCounter.current}`,
            text,
            color,
            timestamp: Date.now(),
        }
        setLogs((prev) => [...prev, logEntry])
    }, [])

    const stringifyValue = useCallback((value: unknown) => {
        if (value === null) return "null"
        if (value === undefined) return "undefined"
        if (typeof value === "string") return value
        if (typeof value === "number" || typeof value === "boolean") return String(value)
        try {
            return JSON.stringify(value, null, 2)
        } catch {
            return String(value)
        }
    }, [])

    const checkTypeScriptErrors = useCallback(() => {
        if (!editorRef.current || !window.monaco?.editor) return []
        const model = editorRef.current.getModel()
        if (!model) return []
        try {
            const markers = window.monaco.editor.getModelMarkers({ resource: model.uri })
            const errorSeverity = window.monaco.MarkerSeverity?.Error
            if (!errorSeverity) return []
            return markers
                .filter((m) => m.severity === errorSeverity)
                .map((e) => `🚫 Satır ${e.startLineNumber}: ${e.message}`)
        } catch {
            return []
        }
    }, [])

    const createConsoleOverride = useCallback(() => {
        const original = { log: console.log, error: console.error, warn: console.warn, info: console.info }
        const override = {
            log: (...args: unknown[]) => addLog(args.map(stringifyValue).join(" "), "#4ade80"),
            error: (...args: unknown[]) => addLog("❌ " + args.map(stringifyValue).join(" "), "#f87171"),
            warn: (...args: unknown[]) => addLog("⚠️ " + args.map(stringifyValue).join(" "), "#fbbf24"),
            info: (...args: unknown[]) => addLog("ℹ️ " + args.map(stringifyValue).join(" "), "#60a5fa"),
        }
        Object.assign(console, override)
        return () => Object.assign(console, original)
    }, [addLog, stringifyValue])

    const runCode = useCallback(async () => {
        if (isRunning) return
        setIsRunning(true)
        setLogs([])

        try {
            const code = codes[activeTab]

            if (activeTab === "ts" || activeTab === "js") {
                if (activeTab === "ts") {
                    const errors = checkTypeScriptErrors()
                    if (errors.length > 0) {
                        errors.forEach((error) => addLog(error, "#f87171"))
                        return
                    }
                }

                const restoreConsole = createConsoleOverride()
                try {
                    let jsToRun = code
                    if (activeTab === "ts") {
                        jsToRun = ts.transpileModule(code, {
                            compilerOptions: {
                                module: ts.ModuleKind.ESNext,
                                target: ts.ScriptTarget.ES2020,
                            },
                        }).outputText
                    }
                    const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor as new (
                        ...args: string[]
                    ) => () => Promise<void>
                    const fn = new AsyncFunction(`return (async()=>{${jsToRun}})()`)
                    await fn()
                } catch (err) {
                    addLog("💥 " + (err instanceof Error ? err.message : String(err)), "#f87171")
                } finally {
                    restoreConsole()
                }
            }

            if (activeTab === "html" && iframeRef.current) {
                const doc = iframeRef.current.contentDocument
                if (doc) {
                    doc.open()
                    doc.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <style>${codes.css}</style>
                          <script>
                            const sendLog=(type,...args)=>parent.postMessage({type,args},"*");
                            console.log=(...args)=>sendLog("log",...args);
                            console.error=(...args)=>sendLog("error",...args);
                            console.warn=(...args)=>sendLog("warn",...args);
                            console.info=(...args)=>sendLog("info",...args);
                          </script>
                        </head>
                        <body>${codes.html.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>/i, "").replace(/<\/body>[\s\S]*$/i, "")}</body>
                        </html>
                      `)
                    doc.close()
                }
            }
        } finally {
            setIsRunning(false)
        }
    }, [activeTab, codes, isRunning, checkTypeScriptErrors, createConsoleOverride, addLog])

    // iframe postMessage listener
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (!event.data) return
            const { type, args } = event.data
            if (!Array.isArray(args)) return
            const msg = args.map((a: unknown) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")
            switch (type) {
                case "log":
                    addLog(msg, "#4ade80")
                    break
                case "error":
                    addLog("❌ " + msg, "#f87171")
                    break
                case "warn":
                    addLog("⚠️ " + msg, "#fbbf24")
                    break
                case "info":
                    addLog("ℹ️ " + msg, "#60a5fa")
                    break
            }
        }
        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [addLog])

    const currentCode = useMemo(() => codes[activeTab], [codes, activeTab])
    const editorLanguage = useMemo(() => {
        switch (activeTab) {
            case "ts":
                return "typescript"
            case "js":
                return "javascript"
            case "html":
                return "html"
            case "css":
                return "css"
            default:
                return "javascript"
        }
    }, [activeTab])
    const showOutput = useMemo(() => activeTab !== "css", [activeTab])
    const showRunButton = useMemo(() => activeTab === "ts" || activeTab === "js" || activeTab === "html", [activeTab])

    // Ctrl+Enter ile çalıştır
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault()
                runCode()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [runCode])

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 flex border-b border-gray-700 bg-gray-800 overflow-x-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        className={`flex-shrink-0 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 font-medium transition-all duration-200 border-b-2 text-xs sm:text-sm lg:text-base whitespace-nowrap ${activeTab === tab ? "bg-gray-700 text-white border-blue-500" : "text-gray-400 hover:bg-gray-700 hover:text-white border-transparent"}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {TAB_LABELS[tab]}
                    </button>
                ))}
            </div>

            {/* Editor + Output */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
                {/* Editor */}
                <div className="flex-1 lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-700 min-h-0 overflow-hidden">
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <MonacoEditor
                            height="100%"
                            language={editorLanguage}
                            value={currentCode}
                            theme={theme}
                            onChange={(value) => updateCode(activeTab, value || "")}
                            onMount={(editor, monaco) => {
                                editorRef.current = editor

                                // HTML için auto-closing tags ve Emmet benzeri snippet'ler
                                if (activeTab === "html") {
                                    monaco.languages.html.htmlDefaults.setOptions({
                                        format: {
                                            tabSize: 2,
                                            insertSpaces: true,
                                            wrapLineLength: 120,
                                            unformatted:
                                                "a, abbr, acronym, b, bdo, big, br, button, cite, code, dfn, em, i, img, input, kbd, label, map, object, q, samp, script, select, small, span, strong, sub, sup, textarea, tt, var",
                                            contentUnformatted: "pre",
                                            indentInnerHtml: false,
                                            preserveNewLines: true,
                                            maxPreserveNewLines: 2,
                                            indentHandlebars: false,
                                            endWithNewline: false,
                                            extraLiners: "head, body, /html",
                                            wrapAttributes: "auto",
                                        },
                                        suggest: {
                                            html5: true,
                                            angular1: true,
                                            ionic: true,
                                        },
                                    })

                                    // Emmet benzeri snippet'ler
                                    monaco.languages.registerCompletionItemProvider("html", {
                                        provideCompletionItems: (model, position) => {
                                            const range = {
                                                startLineNumber: position.lineNumber,
                                                endLineNumber: position.lineNumber,
                                                startColumn: position.column,
                                                endColumn: position.column,
                                            }

                                            const suggestions: languages.CompletionItem[] = [
                                                {
                                                    label: "!",
                                                    kind: monaco.languages.CompletionItemKind.Snippet,
                                                    insertText: [
                                                        "<!DOCTYPE html>",
                                                        '<html lang="tr">',
                                                        "<head>",
                                                        '    <meta charset="UTF-8">',
                                                        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                                                        "    <title>${1:Document}</title>",
                                                        "</head>",
                                                        "<body>",
                                                        "    ${2}",
                                                        "</body>",
                                                        "</html>",
                                                    ].join("\n"),
                                                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                                    documentation: "HTML5 boilerplate",
                                                    range,
                                                },
                                                {
                                                    label: "ul>li*3",
                                                    kind: monaco.languages.CompletionItemKind.Snippet,
                                                    insertText: [
                                                        "<ul>",
                                                        "    <li>${1}</li>",
                                                        "    <li>${2}</li>",
                                                        "    <li>${3}</li>",
                                                        "</ul>",
                                                    ].join("\n"),
                                                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                                    documentation: "Unordered list with 3 items",
                                                    range,
                                                },
                                            ]

                                            return { suggestions }
                                        },
                                    })
                                }

                                // CSS için snippet'ler
                                if (activeTab === "css") {
                                    monaco.languages.registerCompletionItemProvider("css", {
                                        provideCompletionItems: (model, position) => {
                                            const range = {
                                                startLineNumber: position.lineNumber,
                                                endLineNumber: position.lineNumber,
                                                startColumn: position.column,
                                                endColumn: position.column,
                                            }

                                            const suggestions: languages.CompletionItem[] = [
                                                {
                                                    label: "flex-center",
                                                    kind: monaco.languages.CompletionItemKind.Snippet,
                                                    insertText: ["display: flex;", "justify-content: center;", "align-items: center;"].join("\n"),
                                                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                                    documentation: "Flexbox centering",
                                                    range,
                                                },
                                            ]

                                            return { suggestions }
                                        },
                                    })
                                }
                            }}
                            options={{
                                ...EDITOR_OPTIONS,
                                scrollbar: {
                                    vertical: "visible" as const,
                                    horizontal: "visible" as const,
                                    verticalScrollbarSize: window.innerWidth < 768 ? 6 : 10,
                                    horizontalScrollbarSize: window.innerWidth < 768 ? 6 : 10,
                                    arrowSize: window.innerWidth < 768 ? 8 : 11,
                                    useShadows: true,
                                    verticalHasArrows: false,
                                    horizontalHasArrows: false,
                                    alwaysConsumeMouseWheel: false,
                                    handleMouseWheel: true,
                                },
                                fontSize: window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 13 : 14,
                                lineHeight: window.innerWidth < 640 ? 18 : window.innerWidth < 1024 ? 20 : 22,
                                minimap: { enabled: window.innerWidth >= 1024 },
                                mouseWheelScrollSensitivity: window.innerWidth < 768 ? 0.5 : 1,
                                fastScrollSensitivity: window.innerWidth < 768 ? 2 : 5,
                            }}
                        />
                    </div>
                </div>

                {/* Output */}
                {showOutput && (
                    <div className="flex-1 lg:w-1/2 flex flex-col bg-gray-900 min-h-0 overflow-hidden">
                        {/* Output Header */}
                        <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2 lg:gap-3 p-2 sm:p-3 bg-gray-800 border-b border-gray-700 overflow-x-auto">
                            {showRunButton && (
                                <button
                                    onClick={runCode}
                                    disabled={isRunning}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded font-medium transition-all text-xs sm:text-sm whitespace-nowrap ${
                                        isRunning ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:scale-95"
                                    }`}
                                >
                                    {isRunning ? "⏳ Çalışıyor..." : "▶ Çalıştır"}
                                </button>
                            )}
                            <div className="text-xs sm:text-sm text-gray-400 truncate">
                                {activeTab === "ts" ? "TypeScript Console" : activeTab === "js" ? "JavaScript Console" : "HTML Preview"}
                            </div>
                            <div className="hidden sm:flex ml-auto text-xs text-gray-500 items-center gap-2">
                                {(activeTab === "ts" || activeTab === "js") && `${logs.length} mesaj`}
                                <span className="text-gray-600 hidden lg:inline">Ctrl+Enter ile çalıştır</span>
                            </div>
                            {logs.length > 0 && (
                                <button
                                    onClick={() => setLogs([])}
                                    className="text-gray-400 hover:text-white text-xs sm:text-sm px-1.5 sm:px-2 py-1 rounded hover:bg-gray-700 flex-shrink-0"
                                >
                                    Temizle
                                </button>
                            )}
                        </div>

                        {/* Output Content */}
                        <div className="flex-1 min-h-0 bg-gray-900 overflow-hidden">
                            {activeTab === "ts" || activeTab === "js" ? (
                                <div className="h-full overflow-y-auto overflow-x-hidden p-2 sm:p-3 font-mono text-xs sm:text-sm scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                                    {logs.length === 0 ? (
                                        <div className="text-gray-500 italic text-center py-8">
                                            Kodu çalıştırmak için ▶ Çalıştır butonuna basın veya Ctrl+Enter kullanın
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {logs.map((log) => (
                                                <div key={log.id} style={{ color: log.color }}>
                                                    <pre className="whitespace-pre-wrap break-words font-mono leading-relaxed">{log.text}</pre>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <iframe
                                    ref={iframeRef}
                                    className="w-full h-full bg-white border-0"
                                    title="HTML Preview"
                                    sandbox="allow-scripts allow-same-origin allow-modals"
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

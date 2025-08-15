"use client"
import { useRef, useState } from "react"
import * as ts from "typescript"
import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

// Monaco Editor için tip tanımları
declare global {
    interface Window {
        monaco: {
            editor: {
                getModelMarkers: (filter: { resource: unknown }) => MonacoMarker[]
            }
            MarkerSeverity: {
                Error: number
            }
        }
    }
}

interface MonacoEditorInstance {
    getModel(): {
        uri: unknown
    } | null
}

interface MonacoMarker {
    severity: number
    startLineNumber: number
    message: string
}

// Console method tipleri
type ConsoleMethod = (...args: unknown[]) => void

// Log entry tipi
interface LogEntry {
    text: string
    color: string
}

// Tab tipleri
type TabType = "ts" | "js" | "html" | "css"

export default function EditorPage() {
    const [activeTab, setActiveTab] = useState<TabType>("ts")
    const [tsCode, setTsCode] = useState(`let text: string = "Merhaba Dünya";
// text = 15; // Bu hata verecek
console.log(text);`)
    const [jsCode, setJsCode] = useState(`let message = "Hello JS";
console.log(message);`)
    const [htmlCode, setHtmlCode] = useState(`<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Merhaba Dünya</h1>
</body>
</html>`)
    const [cssCode, setCssCode] = useState(`* {
    box-sizing: border-box;
} 

h1 { 
    color: red; 
    text-align: center;
    font-family: Arial, sans-serif;
}`)

    const [logs, setLogs] = useState<LogEntry[]>([])

    const iframeRef = useRef<HTMLIFrameElement | null>(null)
    const editorRef = useRef<MonacoEditorInstance | null>(null)

    // Değeri string'e dönüştüren yardımcı fonksiyon
    const stringifyValue = (value: unknown): string => {
        if (typeof value === "object" && value !== null) {
            try {
                return JSON.stringify(value, null, 2)
            } catch {
                return String(value)
            }
        }
        return String(value)
    }

    const runCode = async () => {
        setLogs([])

        if (activeTab === "ts" || activeTab === "js") {
            const code = activeTab === "ts" ? tsCode : jsCode

            // TypeScript hata kontrolü
            if (activeTab === "ts" && editorRef.current && window.monaco) {
                const model = editorRef.current.getModel()
                if (model) {
                    const markers = window.monaco.editor.getModelMarkers({ resource: model.uri })
                    const errors = markers.filter((m: MonacoMarker) => m.severity === window.monaco.MarkerSeverity.Error)
                    if (errors.length) {
                        setLogs(
                            errors.map((e: MonacoMarker) => ({
                                text: `🚫 Satır ${e.startLineNumber}: ${e.message}`,
                                color: "#f87171",
                            })),
                        )
                        return
                    }
                }
            }

            const tempLogs: LogEntry[] = []

            // Orijinal console methodlarını sakla
            const originalLog: ConsoleMethod = console.log
            const originalError: ConsoleMethod = console.error
            const originalWarn: ConsoleMethod = console.warn

            // Console methodlarını override et
            console.log = (...args: unknown[]) =>
                tempLogs.push({
                    text: args.map(stringifyValue).join(" "),
                    color: activeTab === "ts" ? "#facc15" : "#4ade80",
                })

            console.error = (...args: unknown[]) =>
                tempLogs.push({
                    text: "❌ ERROR: " + args.map(stringifyValue).join(" "),
                    color: "#f87171"
                })

            console.warn = (...args: unknown[]) =>
                tempLogs.push({
                    text: "⚠️ WARNING: " + args.map(stringifyValue).join(" "),
                    color: "#fbbf24"
                })

            try {
                let jsToRun = code

                // TypeScript'i JavaScript'e dönüştür
                if (activeTab === "ts") {
                    jsToRun = ts.transpileModule(code, {
                        compilerOptions: {
                            module: ts.ModuleKind.ESNext,
                            target: ts.ScriptTarget.ES2020,
                        },
                    }).outputText
                }

                // Async function constructor
                const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor as new (...args: string[]) => (() => Promise<void>)
                await new AsyncFunction(`(async () => { ${jsToRun} })()`)()

            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : String(err)
                tempLogs.push({ text: "💥 Runtime Hatası: " + errorMessage, color: "#f87171" })
            } finally {
                // Console methodlarını geri yükle
                console.log = originalLog
                console.error = originalError
                console.warn = originalWarn
            }

            setLogs(tempLogs)
        }

        // HTML+CSS render
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument
            if (!doc) return
            doc.open()
            doc.write(`
                <style>${cssCode}</style>
                ${htmlCode}
            `)
            doc.close()
        }
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Sekmeler */}
            <div className="flex border-b border-gray-700">
                {(["ts", "js", "html", "css"] as const).map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === tab
                                ? "bg-gray-700 text-white"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Editor */}
            <div className="flex-1">
                {activeTab === "ts" && (
                    <MonacoEditor
                        height="100%"
                        defaultLanguage="typescript"
                        value={tsCode}
                        theme="vs-dark"
                        onMount={(editor: MonacoEditorInstance) => (editorRef.current = editor)}
                        onChange={(val: string | undefined) => setTsCode(val ?? "")}
                        options={{
                            automaticLayout: true,
                            fontSize: 14,
                            minimap: { enabled: false },
                            wordWrap: "on",
                            tabSize: 2,
                            insertSpaces: true,
                            scrollBeyondLastLine: false,
                        }}
                    />
                )}
                {activeTab === "js" && (
                    <MonacoEditor
                        height="100%"
                        defaultLanguage="javascript"
                        value={jsCode}
                        theme="vs-dark"
                        onChange={(val: string | undefined) => setJsCode(val ?? "")}
                        options={{
                            automaticLayout: true,
                            fontSize: 14,
                            minimap: { enabled: false },
                            wordWrap: "on",
                            tabSize: 2,
                            insertSpaces: true,
                            scrollBeyondLastLine: false,
                        }}
                    />
                )}
                {activeTab === "html" && (
                    <MonacoEditor
                        height="100%"
                        defaultLanguage="html"
                        value={htmlCode}
                        theme="vs-dark"
                        onChange={(val: string | undefined) => setHtmlCode(val ?? "")}
                        options={{
                            automaticLayout: true,
                            fontSize: 14,
                            minimap: { enabled: false },
                            wordWrap: "on",
                            tabSize: 2,
                            insertSpaces: true,
                            scrollBeyondLastLine: false,
                        }}
                    />
                )}
                {activeTab === "css" && (
                    <MonacoEditor
                        height="100%"
                        defaultLanguage="css"
                        value={cssCode}
                        theme="vs-dark"
                        onChange={(val: string | undefined) => setCssCode(val ?? "")}
                        options={{
                            automaticLayout: true,
                            fontSize: 14,
                            minimap: { enabled: false },
                            wordWrap: "on",
                            tabSize: 2,
                            insertSpaces: true,
                            scrollBeyondLastLine: false,
                        }}
                    />
                )}
            </div>

            {/* Output Panel - CSS sekmesinde gizli */}
            {activeTab !== "css" && (
                <div className="p-2 bg-gray-900 text-white h-64 overflow-auto font-mono text-sm border-t border-gray-700 flex flex-col">
                    <div className="flex gap-2 mb-2 items-center">
                        <button
                            onClick={runCode}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors flex items-center gap-2"
                        >
                            ▶ Çalıştır
                        </button>
                        <span className="text-gray-400 italic">
                            {activeTab === "ts" && "TypeScript Console"}
                            {activeTab === "js" && "JavaScript Console"}
                            {activeTab === "html" && "HTML Render"}
                        </span>
                        <div className="ml-auto text-xs text-gray-500">
                            {(activeTab === "ts" || activeTab === "js") && `${logs.length} log`}
                        </div>
                    </div>

                    {/* Console Logs */}
                    {(activeTab === "ts" || activeTab === "js") && (
                        <div className="flex-1 overflow-auto">
                            {logs.length === 0 ? (
                                <div className="text-gray-500 italic">Kodu çalıştırmak için ▶ butonuna basın</div>
                            ) : (
                                logs.map((l, i) => (
                                    <div key={i} style={{ color: l.color, whiteSpace: "pre-wrap" }}>
                                        {l.text}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* HTML Preview */}
                    {activeTab === "html" && (
                        <iframe
                            ref={iframeRef}
                            className="flex-1 border border-gray-700 rounded"
                            style={{ width: "100%", height: "100%" }}
                            title="HTML Preview"
                        />
                    )}
                </div>
            )}
        </div>
    )
}
"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import * as ts from "typescript";
import type * as monaco from "monaco-editor";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

declare global {
    interface Window {
        monaco: typeof monaco;
    }
}

type TabType = "ts" | "js" | "html" | "css";
type LogItem = { text: string; color: string };

export default function EditorPage() {
    const [activeTab, setActiveTab] = useState<TabType>("ts");
    const [tsCode, setTsCode] = useState(`let text: any = "Merhaba Dünya";
text = 15;
console.log(text);`);
    const [jsCode, setJsCode] = useState(`let message = "Hello JS";
console.log(message);`);
    const [htmlCode, setHtmlCode] = useState(`<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <h1>Merhaba Dünya</h1>
</head>
<body>

</body>
</html>`);
    const [cssCode, setCssCode] = useState(`*{box-sizing:border-box;} 
h1 { color: red; }`);

    const [logs, setLogs] = useState<LogItem[]>([]);

    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    const runCode = async () => {
        setLogs([]);

        if (activeTab === "ts" || activeTab === "js") {
            const code = activeTab === "ts" ? tsCode : jsCode;

            if (activeTab === "ts" && editorRef.current) {
                const model = editorRef.current.getModel();
                if (model) {
                    const markers = window.monaco.editor.getModelMarkers({ resource: model.uri });
                    const errors = markers.filter((m) => m.severity === window.monaco.MarkerSeverity.Error);
                    if (errors.length) {
                        setLogs(
                            errors.map((e) => ({
                                text: `🚫 Satır ${e.startLineNumber}: ${e.message}`,
                                color: "#f87171",
                            }))
                        );
                        return;
                    }
                }
            }

            const tempLogs: LogItem[] = [];
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;

            console.log = (...args: unknown[]) =>
                tempLogs.push({
                    text: args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" "),
                    color: activeTab === "ts" ? "#facc15" : "#4ade80",
                });
            console.error = (...args: unknown[]) =>
                tempLogs.push({ text: "❌ ERROR: " + args.join(" "), color: "#f87171" });
            console.warn = (...args: unknown[]) =>
                tempLogs.push({ text: "⚠️ WARNING: " + args.join(" "), color: "#fbbf24" });

            try {
                let jsToRun = code;
                if (activeTab === "ts") {
                    jsToRun = ts.transpileModule(code, {
                        compilerOptions: {
                            module: ts.ModuleKind.ESNext,
                            target: ts.ScriptTarget.ES2020,
                        },
                    }).outputText;
                }

                const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as FunctionConstructor;
                await new AsyncFunction(`(async () => { ${jsToRun} })()`)();
            } catch (err) {
                if (err instanceof Error) {
                    tempLogs.push({ text: "💥 Runtime Hatası: " + err.message, color: "#f87171" });
                } else {
                    tempLogs.push({ text: "💥 Runtime Hatası: " + String(err), color: "#f87171" });
                }
            } finally {
                console.log = originalLog;
                console.error = originalError;
                console.warn = originalWarn;
            }

            setLogs(tempLogs);
        }

        // HTML+CSS iframe render
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (!doc) return;
            doc.open();
            doc.write(`
        <style>${cssCode}</style>
        ${htmlCode}
      `);
            doc.close();
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Sekmeler */}
            <div className="flex border-b border-gray-700">
                {(["ts", "js", "html", "css"] as TabType[]).map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 font-medium ${
                            activeTab === tab ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"
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
                        onMount={(editor) => (editorRef.current = editor)}
                        onChange={(val) => setTsCode(val || "")}
                        options={{ automaticLayout: true, fontSize: 14, minimap: { enabled: false }, wordWrap: "on" }}
                    />
                )}
                {activeTab === "js" && (
                    <MonacoEditor
                        height="100%"
                        defaultLanguage="javascript"
                        value={jsCode}
                        theme="vs-dark"
                        onChange={(val) => setJsCode(val || "")}
                        options={{ automaticLayout: true, fontSize: 14, minimap: { enabled: false }, wordWrap: "on" }}
                    />
                )}
                {activeTab === "html" && (
                    <MonacoEditor
                        height="100%"
                        defaultLanguage="html"
                        value={htmlCode}
                        theme="vs-dark"
                        onChange={(val) => setHtmlCode(val || "")}
                        options={{ automaticLayout: true, fontSize: 14, minimap: { enabled: false }, wordWrap: "on" }}
                    />
                )}
                {activeTab === "css" && (
                    <MonacoEditor
                        height="100%"
                        defaultLanguage="css"
                        value={cssCode}
                        theme="vs-dark"
                        onChange={(val) => setCssCode(val || "")}
                        options={{ automaticLayout: true, fontSize: 14, minimap: { enabled: false }, wordWrap: "on" }}
                    />
                )}
            </div>

            {/* Run / Output panel */}
            <div className="p-2 bg-gray-900 text-white h-64 overflow-auto font-mono text-sm border-t border-gray-700 flex flex-col">
                <div className="flex gap-2 mb-2">
                    <button onClick={runCode} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                        ▶ Çalıştır
                    </button>
                    <span className="text-gray-400 italic">
            {activeTab === "ts"
                ? "TS console"
                : activeTab === "js"
                    ? "JS console"
                    : activeTab === "html"
                        ? "HTML render"
                        : "CSS edit"}
          </span>
                </div>

                {(activeTab === "ts" || activeTab === "js") && (
                    <div className="flex-1 overflow-auto">
                        {logs.map((l, i) => (
                            <div key={i} style={{ color: l.color, whiteSpace: "pre-wrap" }}>
                                {l.text}
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === "html" && (
                    <iframe ref={iframeRef} className="flex-1 border border-gray-700" style={{ width: "100%", height: "100%" }} />
                )}
            </div>
        </div>
    );
}
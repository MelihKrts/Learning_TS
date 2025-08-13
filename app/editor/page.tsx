// "use client";
// import dynamic from "next/dynamic";
// import { useState, useRef } from "react";
//
// // Monaco Editor'u dinamik yükle
// const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
//
// // TypeScript için window.monaco bildirimi
// declare global {
//     interface Window {
//         monaco: any;
//     }
// }
//
// export default function EditorPage() {
//     const [code, setCode] = useState(`let name: string = "Merhaba Dünya";
// name = 15; // Hata olacak
// console.log(name);`);
//     const [output, setOutput] = useState<string>("");
//     const editorRef = useRef<any>(null);
//
//     const runCode = async () => {
//         if (!editorRef.current) return;
//         const editor = editorRef.current;
//         const model = editor.getModel();
//         if (!model) return;
//
//         // TypeScript hatalarını al
//         const markers = window.monaco.editor.getModelMarkers({ resource: model.uri });
//         const errors = markers.filter((m: any) => m.severity === window.monaco.MarkerSeverity.Error);
//
//         if (errors.length) {
//             setOutput(
//                 "🚫 TypeScript Hataları:\n" +
//                 errors.map((e: any) => `Satır ${e.startLineNumber}: ${e.message}`).join("\n")
//             );
//             return;
//         }
//
//         // Hata yoksa JS olarak çalıştır
//         const logs: string[] = [];
//         const originalLog = console.log;
//         const originalError = console.error;
//         const originalWarn = console.warn;
//
//         console.log = (...args) => logs.push(args.join(" "));
//         console.error = (...args) => logs.push("❌ ERROR: " + args.join(" "));
//         console.warn = (...args) => logs.push("⚠️ WARNING: " + args.join(" "));
//
//         try {
//             const jsCode = code; // Tipleri kaldırmaya gerek yok, hatalı kod zaten çalıştırılmıyor
//             const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
//             await new AsyncFunction(jsCode)();
//             setOutput(logs.length ? logs.join("\n") : "✅ Kod başarıyla çalıştırıldı! (Çıktı yok)");
//         } catch (err: any) {
//             setOutput("💥 Runtime Hatası: " + err.message);
//         } finally {
//             console.log = originalLog;
//             console.error = originalError;
//             console.warn = originalWarn;
//         }
//     };
//
//     return (
//         <div className="flex flex-col h-screen">
//             <div className="flex-1">
//                 <MonacoEditor
//                     height="100%"
//                     defaultLanguage="typescript"
//                     defaultValue={code}
//                     theme="vs-dark"
//                     onMount={(editor) => (editorRef.current = editor)}
//                     onChange={(val) => setCode(val || "")}
//                     options={{
//                         automaticLayout: true,
//                         fontSize: 14,
//                         minimap: { enabled: false },
//                         wordWrap: "on",
//                     }}
//                 />
//             </div>
//
//             {/* Run / Output panel */}
//             <div className="p-4 bg-gray-900 text-white h-64 overflow-auto font-mono text-sm border-t border-gray-700">
//                 <button
//                     onClick={runCode}
//                     className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mb-2"
//                 >
//                     ▶ Çalıştır (Run)
//                 </button>
//                 <pre className="whitespace-pre-wrap">{output}</pre>
//             </div>
//         </div>
//     );
// }

// "use client";
// import dynamic from "next/dynamic";
// import { useState, useRef } from "react";
//
// // Monaco Editor dinamik import
// const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
//
// // TS için window.monaco bildirimi
// declare global {
//     interface Window {
//         monaco: any;
//     }
// }
//
// export default function EditorPage() {
//     const [activeTab, setActiveTab] = useState<"ts" | "js" | "html" | "css">("ts");
//     const [tsCode, setTsCode] = useState(`let text: any = "Merhaba Dünya";
// text = 15;
// console.log(text);`);
//     const [jsCode, setJsCode] = useState(`let message = "Hello JS";
// console.log(message);`);
//     const [htmlCode, setHtmlCode] = useState(`<!doctype html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport"
//           content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
//     <meta http-equiv="X-UA-Compatible" content="ie=edge">
//     <title>Document</title>
// </head>
// <body>
//
// </body>
// </html>`);
//     const [cssCode, setCssCode] = useState(`h1 { color: red; }`);
//     const [output, setOutput] = useState<string>("");
//
//     const iframeRef = useRef<HTMLIFrameElement | null>(null);
//     const editorRef = useRef<any>(null);
//
//     const runCode = async () => {
//         if (activeTab === "ts") {
//             if (!editorRef.current) return;
//             const model = editorRef.current.getModel();
//             if (!model) return;
//
//             // TS hatalarını al
//             const markers = window.monaco.editor.getModelMarkers({ resource: model.uri });
//             const errors = markers.filter((m: any) => m.severity === window.monaco.MarkerSeverity.Error);
//
//             if (errors.length) {
//                 setOutput(
//                     errors.map((e: any) => `🚫 Satır ${e.startLineNumber}: ${e.message}`).join("\n")
//                 );
//             } else {
//                 // Logları göster
//                 const logs: string[] = [];
//                 const originalLog = console.log;
//                 console.log = (...args) => logs.push(args.join(" "));
//                 try {
//                     // TS sadece logları göstermek için eval kullanmadan
//                     setOutput(logs.length ? logs.join("\n") : "✅ Tip hatası yok, console log yok");
//                 } finally {
//                     console.log = originalLog;
//                 }
//             }
//         } else if (activeTab === "js") {
//             const logs: string[] = [];
//             const originalLog = console.log;
//             console.log = (...args) =>
//                 logs.push("%c" + args.map(a => (typeof a === "object" ? JSON.stringify(a) : a)).join(" "), "color: #4ade80"); // JS yeşil
//             try {
//                 const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
//                 await new AsyncFunction(jsCode)();
//                 setOutput(logs.join("\n") || "✅ Kod başarıyla çalıştırıldı (Çıktı yok)");
//             } catch (err: any) {
//                 setOutput("💥 Runtime Hatası: " + err.message);
//             } finally {
//                 console.log = originalLog;
//             }
//         } else if (activeTab === "html" || activeTab === "css") {
//             if (!iframeRef.current) return;
//             const doc = iframeRef.current.contentDocument;
//             if (!doc) return;
//             doc.open();
//             doc.write(`<style>${cssCode}</style>${htmlCode}`);
//             doc.close();
//         }
//     };
//
//     return (
//         <div className="flex flex-col h-screen">
//             {/* Sekmeler */}
//             <div className="flex border-b border-gray-700">
//                 {["ts", "js", "html", "css"].map(tab => (
//                     <button
//                         key={tab}
//                         className={`px-4 py-2 font-medium ${
//                             activeTab === tab ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"
//                         }`}
//                         onClick={() => setActiveTab(tab as any)}
//                     >
//                         {tab.toUpperCase()}
//                     </button>
//                 ))}
//             </div>
//
//             {/* Editor */}
//             <div className="flex-1">
//                 {activeTab === "ts" && (
//                     <MonacoEditor
//                         height="100%"
//                         defaultLanguage="typescript"
//                         value={tsCode}
//                         theme="vs-dark"
//                         onMount={editor => (editorRef.current = editor)}
//                         onChange={val => setTsCode(val || "")}
//                         options={{ automaticLayout: true, fontSize: 14, minimap: { enabled: false }, wordWrap: "on" }}
//                     />
//                 )}
//                 {activeTab === "js" && (
//                     <MonacoEditor
//                         height="100%"
//                         defaultLanguage="javascript"
//                         value={jsCode}
//                         theme="vs-dark"
//                         onChange={val => setJsCode(val || "")}
//                         options={{ automaticLayout: true, fontSize: 14, minimap: { enabled: false }, wordWrap: "on" }}
//                     />
//                 )}
//                 {(activeTab === "html" || activeTab === "css") && (
//                     <MonacoEditor
//                         height="100%"
//                         defaultLanguage={activeTab === "html" ? "html" : "css"}
//                         value={activeTab === "html" ? htmlCode : cssCode}
//                         theme="vs-dark"
//                         onChange={val =>
//                             activeTab === "html" ? setHtmlCode(val || "") : setCssCode(val || "")
//                         }
//                         options={{ automaticLayout: true, fontSize: 14, minimap: { enabled: false }, wordWrap: "on" }}
//                     />
//                 )}
//             </div>
//
//             {/* Run / Output panel */}
//             <div className="p-2 bg-gray-900 text-white h-64 overflow-auto font-mono text-sm border-t border-gray-700 flex flex-col">
//                 <div className="flex gap-2 mb-2">
//                     <button onClick={runCode} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
//                         ▶ Çalıştır
//                     </button>
//                     <span className="text-gray-400 italic">
//                         {activeTab === "ts" ? "TS hataları + log" : activeTab === "js" ? "JS console çıktısı" : "HTML+CSS render"}
//                     </span>
//                 </div>
//
//                 {activeTab === "ts" || activeTab === "js" ? (
//                     <pre
//                         className="whitespace-pre-wrap"
//                         style={{ color: activeTab === "ts" ? "#facc15" : "#4ade80" }} // TS sarı, JS yeşil
//                     >
//                         {output}
//                     </pre>
//                 ) : (
//                     <iframe
//                         ref={iframeRef}
//                         className="flex-1 border border-gray-700"
//                         style={{ width: "100%", height: "100%" }}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// }

// "use client";
// import dynamic from "next/dynamic";
// import { useState, useRef } from "react";
// import ts from "typescript";
//
// const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
//
// declare global {
//     interface Window {
//         monaco: any;
//     }
// }
//
// export default function EditorPage() {
//     const [activeTab, setActiveTab] = useState<"ts" | "js" | "html" | "css">("ts");
//     const [tsCode, setTsCode] = useState(`let text: any = "Merhaba Dünya";
// text = 15;
// console.log(text);`);
//     const [jsCode, setJsCode] = useState(`let message = "Hello JS";
// console.log(message);`);
//     const [htmlCode, setHtmlCode] = useState(`<h1>Hello World</h1>`);
//     const [cssCode, setCssCode] = useState(`h1 { color: red; }`);
//     const [output, setOutput] = useState<string>("");
//
//     const iframeRef = useRef<HTMLIFrameElement | null>(null);
//     const editorRef = useRef<any>(null);
//
//     const runCode = async () => {
//         if (activeTab === "ts" || activeTab === "js") {
//             const code = activeTab === "ts" ? tsCode : jsCode;
//
//             // TS hatalarını al (sadece TS için)
//             if (activeTab === "ts" && editorRef.current) {
//                 const model = editorRef.current.getModel();
//                 if (model) {
//                     const markers = window.monaco.editor.getModelMarkers({ resource: model.uri });
//                     const errors = markers.filter((m: any) => m.severity === window.monaco.MarkerSeverity.Error);
//                     if (errors.length) {
//                         setOutput(errors.map((e: any) => `🚫 Satır ${e.startLineNumber}: ${e.message}`).join("\n"));
//                         return;
//                     }
//                 }
//             }
//
//             // Console log yakalama
//             const logs: string[] = [];
//             const originalLog = console.log;
//             console.log = (...args) => logs.push(args.map(a => (typeof a === "object" ? JSON.stringify(a) : a)).join(" "));
//
//             try {
//                 let jsToRun = code;
//                 if (activeTab === "ts") {
//                     // TS -> JS
//                     jsToRun = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
//                 }
//
//                 const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
//                 await new AsyncFunction(jsToRun)();
//
//                 setOutput(logs.length ? logs.join("\n") : "✅ Kod başarıyla çalıştırıldı! (Çıktı yok)");
//             } catch (err: any) {
//                 setOutput("💥 Runtime Hatası: " + err.message);
//             } finally {
//                 console.log = originalLog;
//             }
//         } else if (activeTab === "html" || activeTab === "css") {
//             if (!iframeRef.current) return;
//             const doc = iframeRef.current.contentDocument;
//             if (!doc) return;
//             doc.open();
//             doc.write(`<style>${cssCode}</style>${htmlCode}`);
//             doc.close();
//         }
//     };
//
//     return (
//         <div className="flex flex-col h-screen">
//             {/* Sekmeler */}
//             <div className="flex border-b border-gray-700">
//                 {["ts", "js", "html", "css"].map(tab => (
//                     <button
//                         key={tab}
//                         className={`px-4 py-2 font-medium ${activeTab === tab ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"}`}
//                         onClick={() => setActiveTab(tab as any)}
//                     >
//                         {tab.toUpperCase()}
//                     </button>
//                 ))}
//             </div>
//
//             {/* Editor */}
//             <div className="flex-1">
//                 {activeTab === "ts" && (
//                     <MonacoEditor
//                         height="100%"
//                         defaultLanguage="typescript"
//                         value={tsCode}
//                         theme="vs-dark"
//                         onMount={editor => (editorRef.current = editor)}
//                         onChange={val => setTsCode(val || "")}
//                         options={{ automaticLayout: true, fontSize: 14, minimap: { enabled: false }, wordWrap: "on" }}
//                     />
//                 )}
//                 {activeTab === "js" && (
//                     <MonacoEditor
//                         height="100%"
//                         defaultLanguage="javascript"
//                         value={jsCode}
//                         theme="vs-dark"
//                         onChange={val => setJsCode(val || "")}
//                         options={{ automaticLayout: true, fontSize: 14, minimap: { enabled: false }, wordWrap: "on" }}
//                     />
//                 )}
//                 {(activeTab === "html" || activeTab === "css") && (
//                     <MonacoEditor
//                         height="100%"
//                         defaultLanguage={activeTab === "html" ? "html" : "css"}
//                         value={activeTab === "html" ? htmlCode : cssCode}
//                         theme="vs-dark"
//                         onChange={val => (activeTab === "html" ? setHtmlCode(val || "") : setCssCode(val || ""))}
//                         options={{ automaticLayout: true, fontSize: 14, minimap: { enabled: false }, wordWrap: "on" }}
//                     />
//                 )}
//             </div>
//
//             {/* Run / Output panel */}
//             <div className="p-2 bg-gray-900 text-white h-64 overflow-auto font-mono text-sm border-t border-gray-700 flex flex-col">
//                 <div className="flex gap-2 mb-2">
//                     <button onClick={runCode} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
//                         ▶ Çalıştır
//                     </button>
//                     <span className="text-gray-400 italic">
//             {activeTab === "ts" ? "TS -> JS console çıktısı" : activeTab === "js" ? "JS console çıktısı" : "HTML+CSS render"}
//           </span>
//                 </div>
//
//                 {activeTab === "ts" || activeTab === "js" ? (
//                     <pre style={{ color: activeTab === "ts" ? "#facc15" : "#4ade80" }} className="whitespace-pre-wrap">
//             {output}
//           </pre>
//                 ) : (
//                     <iframe ref={iframeRef} className="flex-1 border border-gray-700" style={{ width: "100%", height: "100%" }} />
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";
import dynamic from "next/dynamic";
import {useRef, useState} from "react";
import * as ts from "typescript";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {ssr: false});

declare global {
    interface Window {
        monaco: any;
    }
}

export default function EditorPage() {
    const [activeTab, setActiveTab] = useState<"ts" | "js" | "html" | "css">("ts");
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

    const [logs, setLogs] = useState<{ text: string; color: string }[]>([]);

    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const editorRef = useRef<any>(null);

    const runCode = async () => {
        setLogs([]);

        if (activeTab === "ts" || activeTab === "js") {
            const code = activeTab === "ts" ? tsCode : jsCode;

            if (activeTab === "ts" && editorRef.current) {
                const model = editorRef.current.getModel();
                if (model) {
                    const markers = window.monaco.editor.getModelMarkers({resource: model.uri});
                    const errors = markers.filter((m: any) => m.severity === window.monaco.MarkerSeverity.Error);
                    if (errors.length) {
                        setLogs(errors.map((e: any) => ({
                            text: `🚫 Satır ${e.startLineNumber}: ${e.message}`,
                            color: "#f87171"
                        })));
                        return;
                    }
                }
            }

            const tempLogs: { text: string; color: string }[] = [];
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;

            console.log = (...args) =>
                tempLogs.push({
                    text: args.map(a => (typeof a === "object" ? JSON.stringify(a, null, 2) : a)).join(" "),
                    color: activeTab === "ts" ? "#facc15" : "#4ade80",
                });
            console.error = (...args) =>
                tempLogs.push({text: "❌ ERROR: " + args.join(" "), color: "#f87171"});
            console.warn = (...args) =>
                tempLogs.push({text: "⚠️ WARNING: " + args.join(" "), color: "#fbbf24"});

            try {
                let jsToRun = code;
                if (activeTab === "ts") {
                    jsToRun = ts.transpileModule(code, {
                        compilerOptions: {
                            module: ts.ModuleKind.ESNext,
                            target: ts.ScriptTarget.ES2020
                        }
                    }).outputText;
                }

                const AsyncFunction = Object.getPrototypeOf(async function () {
                }).constructor;
                await new AsyncFunction(`(async () => { ${jsToRun} })()`)();
            } catch (err: any) {
                tempLogs.push({text: "💥 Runtime Hatası: " + err.message, color: "#f87171"});
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
                {["ts", "js", "html", "css"].map(tab => (
                    <button
                        key={tab}
                        className={`px-4 py-2 font-medium ${activeTab === tab ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"}`}
                        onClick={() => setActiveTab(tab as any)}
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
                        onMount={editor => (editorRef.current = editor)}
                        onChange={val => setTsCode(val || "")}
                        options={{automaticLayout: true, fontSize: 14, minimap: {enabled: false}, wordWrap: "on"}}
                    />
                )}
                {activeTab === "js" && (
                    <MonacoEditor
                        height="100%"
                        defaultLanguage="javascript"
                        value={jsCode}
                        theme="vs-dark"
                        onChange={val => setJsCode(val || "")}
                        options={{automaticLayout: true, fontSize: 14, minimap: {enabled: false}, wordWrap: "on"}}
                    />
                )}
                {activeTab === "html" && (
                    <MonacoEditor
                        height="100%"
                        defaultLanguage="html"
                        value={htmlCode}
                        theme="vs-dark"
                        onChange={val => setHtmlCode(val || "")}
                        options={{automaticLayout: true, fontSize: 14, minimap: {enabled: false}, wordWrap: "on"}}
                    />
                )}
                {activeTab === "css" && (
                    <MonacoEditor
                        height="100%"
                        defaultLanguage="css"
                        value={cssCode}
                        theme="vs-dark"
                        onChange={val => setCssCode(val || "")}
                        options={{automaticLayout: true, fontSize: 14, minimap: {enabled: false}, wordWrap: "on"}}
                    />
                )}
            </div>

            {/* Run / Output panel */}
            <div
                className="p-2 bg-gray-900 text-white h-64 overflow-auto font-mono text-sm border-t border-gray-700 flex flex-col">
                <div className="flex gap-2 mb-2">
                    <button onClick={runCode} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                        ▶ Çalıştır
                    </button>
                    <span className="text-gray-400 italic">
            {activeTab === "ts" ? "TS console" : activeTab === "js" ? "JS console" : activeTab === "html" ? "HTML render" : "CSS edit"}
          </span>
                </div>

                {(activeTab === "ts" || activeTab === "js") && (
                    <div className="flex-1 overflow-auto">
                        {logs.map((l, i) => (
                            <div key={i} style={{color: l.color, whiteSpace: "pre-wrap"}}>
                                {l.text}
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === "html" && (
                    <iframe ref={iframeRef} className="flex-1 border border-gray-700"
                            style={{width: "100%", height: "100%"}}/>
                )}
            </div>
        </div>
    );
}


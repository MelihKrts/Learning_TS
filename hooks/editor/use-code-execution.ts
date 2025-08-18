"use client"

import type React from "react"

import { useCallback } from "react"
import type { TabType } from "@/lib/editor/types"

const loadTypeScript = () => import("typescript")

export function useCodeExecution(
    activeTab: TabType,
    codes: Record<TabType, string>,
    isRunning: boolean,
    setIsRunning: (running: boolean) => void,
    editorRef: React.RefObject<any>,
    addLog: (text: string, color: string) => void,
    clearLogs: () => void,
    createConsoleOverride: () => () => void,
    iframeRef: React.RefObject<HTMLIFrameElement | null>,
) {
    const checkTypeScriptErrors = useCallback(async () => {
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
        } catch (error) {
            console.warn("[v0] TypeScript error checking failed:", error)
            return []
        }
    }, [editorRef])

    const runCode = useCallback(async () => {
        if (isRunning) return
        setIsRunning(true)
        clearLogs()

        try {
            const code = codes[activeTab]

            if (activeTab === "ts" || activeTab === "js") {
                if (activeTab === "ts") {
                    const errors = await checkTypeScriptErrors()
                    if (errors.length > 0) {
                        errors.forEach((error) => addLog(error, "#f87171"))
                        return
                    }
                }

                const restoreConsole = createConsoleOverride()
                try {
                    let jsToRun = code

                    if (activeTab === "ts") {
                        try {
                            const ts = await loadTypeScript()
                            const result = ts.transpileModule(code, {
                                compilerOptions: {
                                    module: ts.ModuleKind.ESNext,
                                    target: ts.ScriptTarget.ES2020,
                                    strict: false,
                                    skipLibCheck: true,
                                },
                            })
                            jsToRun = result.outputText
                        } catch (tsError) {
                            addLog(
                                `💥 TypeScript compilation error: ${tsError instanceof Error ? tsError.message : String(tsError)}`,
                                "#f87171",
                            )
                            return
                        }
                    }

                    const AsyncFunction = (async () => {}).constructor as new (...args: string[]) => () => Promise<void>
                    const fn = new AsyncFunction(`return (async()=>{${jsToRun}})()`)
                    await fn()
                } catch (err) {
                    const errorMsg = err instanceof Error ? err.message : String(err)
                    addLog(`💥 ${errorMsg}`, "#f87171")
                } finally {
                    restoreConsole()
                }
            }

            if (activeTab === "html" && iframeRef.current?.contentDocument) {
                const doc = iframeRef.current.contentDocument
                const cleanHtml = codes.html.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>/i, "").replace(/<\/body>[\s\S]*$/i, "")

                doc.open()
                doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${codes.css}</style>
  <script>
    const sendLog=(type,...args)=>parent.postMessage({type,args},"*");
    ['log','error','warn','info'].forEach(type=>console[type]=(...args)=>sendLog(type,...args));
  </script>
</head>
<body>${cleanHtml}</body>
</html>`)
                doc.close()
            }
        } catch (error) {
            addLog(`💥 Unexpected error: ${error instanceof Error ? error.message : String(error)}`, "#f87171")
        } finally {
            setIsRunning(false)
        }
    }, [
        activeTab,
        codes,
        isRunning,
        setIsRunning,
        checkTypeScriptErrors,
        createConsoleOverride,
        addLog,
        clearLogs,
        iframeRef,
    ])

    return { runCode }
}

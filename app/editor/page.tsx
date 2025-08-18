"use client"

import { useEffect, useRef, useState } from "react"
import { TabNavigation } from "@/app/editor/components/tab-navigation"
import { MonacoWrapper } from "@/app/editor/components/monaco-wrapper"
import { OutputPanel } from "@/app/editor/components/output-panel"
import { useEditorState } from "@/hooks/editor/use-editor"
import { useCodeExecution } from "@/hooks/editor/use-code-execution"
import { LOG_COLORS, LOG_PREFIXES } from "@/lib/editor/types"

declare global {
    interface Window {
        monaco?: typeof import("monaco-editor")
    }
}

export default function EditorPage() {
    const [theme, setTheme] = useState<"vs-dark" | "vs-light">("vs-dark")
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    const {
        activeTab,
        setActiveTab,
        codes,
        updateCode,
        logs,
        addLog,
        clearLogs,
        isRunning,
        setIsRunning,
        editorRef,
        createConsoleOverride,
    } = useEditorState()

    const { runCode } = useCodeExecution(
        activeTab,
        codes,
        isRunning,
        setIsRunning,
        editorRef,
        addLog,
        clearLogs,
        createConsoleOverride,
        iframeRef,
    )

    useEffect(() => {
        const updateWindowSize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }

        updateWindowSize()
        window.addEventListener("resize", updateWindowSize)
        return () => window.removeEventListener("resize", updateWindowSize)
    }, [])

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

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, args } = event.data || {}
            if (!Array.isArray(args) || !(type in LOG_COLORS)) return

            const msg = args.map((a: unknown) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")
            const prefix = LOG_PREFIXES[type as keyof typeof LOG_PREFIXES]
            const color = LOG_COLORS[type as keyof typeof LOG_COLORS]

            addLog(prefix + msg, color)
        }

        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [addLog])

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
                <div className="flex-1 lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-700 min-h-0 overflow-hidden">
                    <MonacoWrapper
                        activeTab={activeTab}
                        code={codes[activeTab]}
                        theme={theme}
                        windowWidth={windowSize.width}
                        onCodeChange={(value) => updateCode(activeTab, value)}
                        onEditorMount={(editor) => {
                            editorRef.current = editor
                        }}
                    />
                </div>

                <OutputPanel
                    ref={iframeRef}
                    activeTab={activeTab}
                    logs={logs}
                    isRunning={isRunning}
                    onRunCode={runCode}
                    onClearLogs={clearLogs}
                />
            </div>
        </div>
    )
}

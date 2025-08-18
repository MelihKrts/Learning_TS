"use client"

import { forwardRef } from "react"
import type { TabType, LogEntry } from "@/lib/editor/types"
import { ConsoleOutput } from "./console-output"

interface OutputPanelProps {
    activeTab: TabType
    logs: LogEntry[]
    isRunning: boolean
    onRunCode: () => void
    onClearLogs: () => void
}

export const OutputPanel = forwardRef<HTMLIFrameElement | null, OutputPanelProps>(
    ({ activeTab, logs, isRunning, onRunCode, onClearLogs }, iframeRef) => {
        const showOutput = activeTab !== "css"
        const showRunButton = activeTab === "ts" || activeTab === "js" || activeTab === "html"

        if (!showOutput) return null

        return (
            <div className="flex-1 lg:w-1/2 flex flex-col bg-gray-900 min-h-0 overflow-hidden">
                {/* Output Header */}
                <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2 lg:gap-3 p-2 sm:p-3 bg-gray-800 border-b border-gray-700 overflow-x-auto">
                    {showRunButton && (
                        <button
                            onClick={onRunCode}
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
                            onClick={onClearLogs}
                            className="text-gray-400 hover:text-white text-xs sm:text-sm px-1.5 sm:px-2 py-1 rounded hover:bg-gray-700 flex-shrink-0"
                        >
                            Temizle
                        </button>
                    )}
                </div>

                {/* Output Content */}
                <div className="flex-1 min-h-0 bg-gray-900 overflow-hidden">
                    {activeTab === "ts" || activeTab === "js" ? (
                        <ConsoleOutput logs={logs} onClearLogs={onClearLogs} />
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
        )
    },
)

OutputPanel.displayName = "OutputPanel"

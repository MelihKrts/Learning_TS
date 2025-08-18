"use client"

import { useCallback } from "react"
import dynamic from "next/dynamic"
import type { TabType, MonacoEditorInstance } from "@/lib/editor/types"
import { getResponsiveEditorOptions } from "@/lib/editor/config"
import type * as monaco from "monaco-editor" // 🔑 tip importu

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full text-gray-400">
            Monaco Editor yükleniyor...
        </div>
    ),
})

interface MonacoWrapperProps {
    activeTab: TabType
    code: string
    theme: "vs-dark" | "vs-light"
    windowWidth: number
    onCodeChange: (value: string) => void
    onEditorMount: (editor: MonacoEditorInstance) => void
}

export function MonacoWrapper({
                                  activeTab,
                                  code,
                                  theme,
                                  windowWidth,
                                  onCodeChange,
                                  onEditorMount,
                              }: MonacoWrapperProps) {
    const getLanguage = useCallback(() => {
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

    const handleEditorMount = useCallback(
        (editor: MonacoEditorInstance, monacoInstance: typeof monaco) => {
            onEditorMount(editor)

            if (activeTab === "html") {
                monacoInstance.languages.registerCompletionItemProvider("html", {
                    provideCompletionItems: (model, position) => ({
                        suggestions: [
                            {
                                label: "!",
                                kind: monacoInstance.languages.CompletionItemKind.Snippet,
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
                                insertTextRules:
                                monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "HTML5 boilerplate",
                                range: {
                                    startLineNumber: position.lineNumber,
                                    endLineNumber: position.lineNumber,
                                    startColumn: position.column,
                                    endColumn: position.column,
                                },
                            },
                        ],
                    }),
                })
            }
        },
        [activeTab, onEditorMount],
    )

    return (
        <div className="flex-1 min-h-0 overflow-hidden">
            <MonacoEditor
                height="100%"
                language={getLanguage()}
                value={code}
                theme={theme}
                onChange={(value) => onCodeChange(value || "")}
                onMount={handleEditorMount}
                options={getResponsiveEditorOptions(windowWidth)}
            />
        </div>
    )
}
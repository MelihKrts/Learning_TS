"use client"

import { useState, useCallback, useRef } from "react"
import {
    type TabType,
    type LogEntry,
    type MonacoEditorInstance,
    DEFAULT_CODES,
    MAX_LOG_ENTRIES,
    LOG_COLORS,
    LOG_PREFIXES,
} from "@/lib/editor/types"

export function useEditorState() {
    const [activeTab, setActiveTab] = useState<TabType>("ts")
    const [codes, setCodes] = useState<Record<TabType, string>>(DEFAULT_CODES)
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [isRunning, setIsRunning] = useState(false)
    const editorRef = useRef<MonacoEditorInstance>(null)
    const logIdCounter = useRef(0)

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
        setLogs((prev) => {
            const newLogs = [...prev, logEntry]
            return newLogs.length > MAX_LOG_ENTRIES ? newLogs.slice(-MAX_LOG_ENTRIES) : newLogs
        })
    }, [])

    const clearLogs = useCallback(() => setLogs([]), [])

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

    const createConsoleOverride = useCallback(() => {
        const original = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info,
        }

        const createLogFunction =
            (type: keyof typeof LOG_COLORS) =>
                (...args: unknown[]) => {
                    const message = LOG_PREFIXES[type] + args.map(stringifyValue).join(" ")
                    addLog(message, LOG_COLORS[type])
                }

        const override = {
            log: createLogFunction("log"),
            error: createLogFunction("error"),
            warn: createLogFunction("warn"),
            info: createLogFunction("info"),
        }

        Object.assign(console, override)
        return () => Object.assign(console, original)
    }, [addLog, stringifyValue])

    return {
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
    }
}

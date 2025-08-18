export interface MonacoEditorInstance {
    getModel(): import("monaco-editor").editor.ITextModel | null
    getValue(): string
    setValue(value: string): void
}

export interface LogEntry {
    id: string
    text: string
    color: string
    timestamp: number
}

export type TabType = "ts" | "js" | "html" | "css"
export type Theme = "vs-dark" | "vs-light"

export const TABS: readonly TabType[] = ["ts", "js", "html", "css"] as const

export const TAB_LABELS: Record<TabType, string> = {
    ts: "TypeScript",
    js: "JavaScript",
    html: "HTML",
    css: "CSS",
}

export const DEFAULT_CODES: Record<TabType, string> = {
    ts: `// TypeScript
let message: string = "Merhaba TypeScript!";
console.log(message);`,
    js: `// JavaScript
const message = "Merhaba JavaScript!";
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

export const MAX_LOG_ENTRIES = 1000

export const LOG_COLORS = {
    log: "#4ade80",
    error: "#f87171",
    warn: "#fbbf24",
    info: "#60a5fa",
} as const

export const LOG_PREFIXES = {
    log: "",
    error: "❌ ",
    warn: "⚠️ ",
    info: "ℹ️ ",
} as const

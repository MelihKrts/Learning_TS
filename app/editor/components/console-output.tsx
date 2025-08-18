import type { LogEntry } from "@/lib/editor/types"

interface ConsoleOutputProps {
    logs: LogEntry[]
    onClearLogs: () => void
}

export function ConsoleOutput({ logs, onClearLogs }: ConsoleOutputProps) {
    return (
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
    )
}

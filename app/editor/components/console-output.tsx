import type { LogEntry } from "@/lib/editor/types"

interface ConsoleOutputProps {
    logs: LogEntry[]
    onClearLogs: () => void
}

export function ConsoleOutput({ logs, onClearLogs }: ConsoleOutputProps) {
    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-2 sm:px-3 py-1 border-b border-gray-700">
                <span className="text-gray-400 text-xs sm:text-sm">Konsol</span>
                {logs.length > 0 && (
                    <button
                        onClick={onClearLogs}
                        className="text-red-400 hover:text-red-300 text-xs sm:text-sm"
                    >
                        Temizle
                    </button>
                )}
            </div>

            {/* Logs */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 font-mono text-xs sm:text-sm scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                {logs.length === 0 ? (
                    <div className="text-gray-500 italic text-center py-8">
                        Kodu çalıştırmak için ▶ Çalıştır butonuna basın veya Ctrl+Enter kullanın
                    </div>
                ) : (
                    <div className="space-y-1">
                        {logs.map((log) => (
                            <div key={log.id} style={{ color: log.color }}>
                                <pre className="whitespace-pre-wrap break-words font-mono leading-relaxed">
                                    {log.text}
                                </pre>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
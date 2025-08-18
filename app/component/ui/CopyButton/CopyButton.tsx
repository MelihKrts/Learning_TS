"use client"

import { useState } from "react"
import { FaCopy, FaCheck } from "react-icons/fa"

export const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch (err) {
            console.error("Kopyalama başarısız:", err)
        }
    }

    return (
        <button
            onClick={handleCopy}
            className="p-2 rounded border text-xs transition-colors
               bg-rose-100 text-rose-700 border-rose-200
               hover:bg-rose-200 hover:text-rose-800
               dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700/50
               dark:hover:bg-purple-800/50 dark:hover:text-purple-200"
            title={copied ? "Kopyalandı!" : "Kopyala"}
        >
            {copied ? <FaCheck className="w-4 h-4 text-green-400" /> : <FaCopy className="w-4 h-4" />}
        </button>
    )
}

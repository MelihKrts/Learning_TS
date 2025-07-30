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
            className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-white text-xs transition"
            title={copied ? "Kopyalandı!" : "Kopyala"}
        >
            {copied ? <FaCheck className="w-4 h-4 text-green-400" /> : <FaCopy className="w-4 h-4" />}
        </button>
    )
}

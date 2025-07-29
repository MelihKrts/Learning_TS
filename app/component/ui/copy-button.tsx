"use client"

import {useState} from "react";
import { FaCheck,FaCopy  } from "react-icons/fa";


export const CopyButton = ({text}: { text: string }) => {
    const [copied, setCopied] = useState<boolean>(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Kopyalama Başarısız", err)
        }
    }

    return (
        <button onClick={handleCopy}       className="absolute top-3 right-3 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors duration-200 group" title={copied ? "Kopyalandı": "Kopyala"}>
            {copied ? (
                <FaCheck className="w-4 h-4 text-green-400" />
            ) : (
                <FaCopy className="w-4 h-4 text-gray-400 group-hover:text-gray-200" />
            )}
        </button>
    )
}
"use client"
import { useEffect, useState } from "react"
import { AnimatePresence, motion, Variants } from "framer-motion"

export default function CheckConnectionControl() {
    const [isOnline, setIsOnline] = useState<boolean | null>(null)
    const [show, setShow] = useState<boolean>(false)

    useEffect(() => {
        setIsOnline(navigator.onLine)

        const updateStatus = () => {
            const online = navigator.onLine
            setIsOnline(online)
            setShow(true)

            if (online) {
                const timer = setTimeout(() => setShow(false), 3000)
                return () => clearTimeout(timer)
            }
        }

        window.addEventListener("online", updateStatus)
        window.addEventListener("offline", updateStatus)

        return () => {
            window.removeEventListener("online", updateStatus)
            window.removeEventListener("offline", updateStatus)
        }
    }, [])

    if (isOnline === null) return null

    // Animasyon varyantları
    const containerVariants: Variants = {
        initial: { x: -500, opacity: 0, scale: 0.8 },
        animate: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 200, damping: 25 }
        },
        exit: { x: isOnline ? 500 : -500, opacity: 0, scale: 0.8 },
    }

    const boxClasses = `
        w-4/5 max-w-lg mx-4 px-6 py-4 rounded-2xl font-semibold text-base text-white text-center
        backdrop-blur-sm transition-colors duration-300 pointer-events-auto shadow-2xl
        ${isOnline
        ? "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 shadow-green-500/30 border border-green-400/20"
        : "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 shadow-amber-500/30 border border-yellow-400/20"
    }`

    return (
        <div className="fixed inset-x-0 bottom-5 flex justify-center z-50 pointer-events-none">
            <AnimatePresence mode="wait">
                {show && (
                    <motion.div
                        key={isOnline ? "online" : "offline"}
                        variants={containerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={boxClasses}
                    >
                        <motion.div
                            className="flex items-center justify-center gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <StatusMessage
                                emoji={isOnline ? "✅" : "⚠️"}
                                text={isOnline ? "Bağlantı tekrar sağlandı" : "İnternet bağlantınız yok"}
                                isOnline={isOnline}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function StatusMessage({ emoji, text, isOnline }: { emoji: string; text: string; isOnline: boolean }) {
    const emojiVariants: Variants = {
        online: {
            scale: [0, 1],
            transition: { type: "spring", stiffness: 400, damping: 10, delay: 0.3 }
        },
        offline: {
            rotate: [0, -10, 10, -10, 10, 0],
            scale: [1, 1.1, 1],
            transition: { duration: 2, repeat: Infinity, repeatDelay: 1 }
        },
    }

    return (
        <>
            <motion.span
                className="text-xl"
                variants={emojiVariants}
                animate={isOnline ? "online" : "offline"}
            >
                {emoji}
            </motion.span>
            <span>{text}</span>
        </>
    )
}
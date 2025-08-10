"use client"
import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

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
                setTimeout(() => setShow(false), 3000)
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

    return (
        <div className="fixed inset-x-0 bottom-5 flex justify-center z-50 pointer-events-none">
            <AnimatePresence mode="wait">
                {show && (
                    <motion.div
                        key={isOnline ? "online" : "offline"}
                        initial={{
                            x: isOnline ? -500 : -500,
                            opacity: 0,
                            scale: 0.8
                        }}
                        animate={{
                            x: 0,
                            opacity: 1,
                            scale: 1
                        }}
                        exit={{
                            x: isOnline ? 500 : -500,
                            opacity: 0,
                            scale: 0.8
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 25,
                            mass: 1
                        }}
                        className={`w-4/5 max-w-lg mx-4 px-6 py-4 rounded-2xl shadow-2xl font-semibold text-base text-white text-center backdrop-blur-sm
                            transition-colors duration-300
                            ${isOnline
                            ? "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 shadow-green-500/30 border border-green-400/20"
                            : "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 shadow-amber-500/30 border border-yellow-400/20"
                        }
                        `}
                        style={{
                            boxShadow: isOnline
                                ? '0 25px 50px -12px rgba(34, 197, 94, 0.4), 0 0 30px rgba(34, 197, 94, 0.2)'
                                : '0 25px 50px -12px rgba(245, 158, 11, 0.4), 0 0 30px rgba(245, 158, 11, 0.2)'
                        }}
                    >
                        <motion.div
                            className="flex items-center justify-center gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {isOnline ? (
                                <>
                                    <motion.span
                                        className="text-xl"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 10,
                                            delay: 0.3
                                        }}
                                    >
                                        ✅
                                    </motion.span>
                                    <span>Bağlantı tekrar sağlandı</span>
                                </>
                            ) : (
                                <>
                                    <motion.span
                                        className="text-xl"
                                        animate={{
                                            rotate: [0, -10, 10, -10, 10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 1
                                        }}
                                    >
                                        ⚠️
                                    </motion.span>
                                    <span>İnternet bağlantınız yok</span>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
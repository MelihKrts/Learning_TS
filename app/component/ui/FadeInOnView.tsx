"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ReactNode } from "react"

interface Props  {
    children: ReactNode
    delay?: number
    duration?: number
}

export default function FadeInOnView({ children, delay = 0.1, duration = 0.6 }: Props) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay, duration }}
        >
            {children}
        </motion.div>
    )
}
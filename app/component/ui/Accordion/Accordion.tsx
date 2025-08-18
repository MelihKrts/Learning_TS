"use client"
import {useState} from "react";
import Image from "next/image";
import {motion} from "framer-motion";
import AccordionItem from "@/app/component/ui/Accordion/AccordionItem";

export default function Accordion() {
    const [open, setOpen] = useState<string | null>(null)

    interface AccorData {
        id: string;
        title: string;
        content: string;
    }

    const toggle = (id: string) => {
        setOpen(prev => (prev === id ? null : id))
    }

    const accorData: AccorData[] = [
        {
            id: "ts-notes",
            title: "Learn TypeScript Repo Notları Nedir?",
            content: "TypeScript öğrenirken yararlandığım kaynaklardan edindiğim bilgileri paylaştığım web sitesidir. Not aldığım bilgiler eksik veya daha gelişmiş hali mevcut ise Github üzerinden katkıda bulunabilirsiniz. Yararlandığım kaynakları ve egzersiz çalışmalarını ilgili konunun sonunda ulaşabilirsiniz.",
        },
        {
            id: "repo-içerik",
            title: "İçindekiler Neler?",
            content: "Mümkün olduğunca TypeScript'in bütün konuları anlatılması planlanıyor. Bunun yanı sıra TypeScript ile yapılan çalışmalarda mevcut olacaktır."
        },
        {
            id: "efektif-site",
            title: "Siteyi Efektif Yapan Nedir?",
            content: "Klasik dokümantasyon sitelerinde ilgili konu anlatılır. Bu çalışmada farkı kod editörü ile kendiniz bu site üzerinden TypeScript kodlarını çalıştırabilirsiniz. Aynı anda TypeScript öğrenebilir/pekiştirip aynı zamanda kodları da çalıştırabilirsiniz.",
        },
        {
            id: "destek-ver",
            title: "Destek Verebilirsin",
            content: "Bu çalışmaları ilk amacım kendim için yapsam da herkesin yararlanmasını istiyorum. Teşekkür, şikayet, öneri için, Github, Linkedin, X(Eski adı ile Twitter) ile bana ulaşabilir veya Github üzerinden katkı da verebilirsin. Desteğin için şimdiden teşekkürler dostum iyi ki varsın. 🙂"

        },
    ]

    return (
        <div className="@container min-h-dvh flex justify-center items-center flex-col mx-auto px-4 py-8">
            <div className="w-full text-center mb-8 flex flex-col justify-center items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg">
                        <Image src="/logos/ts_logo.svg" alt="TypeScript Logo" priority width={40} height={40}/>
                    </div>
                    <h1 className="text-[clamp(2rem,4vw,4rem)] font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                        Learn TypeScript
                    </h1>
                </div>
            </div>

            {/* Accordion Items */}
            <motion.div initial={{x: "-100%"}}
                        animate={{x: 0}}
                        transition={{duration: 0.8, ease: "easeOut"}}
                        className="w-full max-w-6xl space-y-4 px-6">
                {accorData.map((item)=>(
                    <AccordionItem key={item.id} item={item} open={open} toggle={toggle} />
                ))}
            </motion.div>
        </div>
    )
}
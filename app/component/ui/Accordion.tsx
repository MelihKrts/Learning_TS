"use client"
import {useState} from "react";
import {FaAngleDown, FaAngleUp} from "react-icons/fa6";
import Image from "next/image";
import {motion} from "framer-motion";

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
                        transition={{duration: 0.8, ease: "easeOut"}} className="w-full max-w-6xl space-y-4 px-6">
                {accorData.map((item) => (
                    <div key={item.id}
                         className="group mb-8 bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:scale-[1.02]">

                        <div
                            onClick={() => toggle(item.id)}
                            className="flex justify-between items-center p-4 cursor-pointer bg-gradient-to-r from-slate-50 to-gray-50 hover:from-blue-50 hover:to-teal-50 transition-all duration-300"
                        >
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-500 group-hover:text-blue-700">
                                {item.title}
                            </h2>
                            <div
                                className="ml-4 p-2 rounded-full bg-white shadow-sm group-hover:bg-blue-100 transition-all duration-300">
                                {open === item.id ?
                                    <FaAngleUp className="text-blue-600 transition-transform duration-300 rotate-0"/> :
                                    <FaAngleDown
                                        className="text-gray-500 group-hover:text-blue-600 transition-all duration-300"/>
                                }
                            </div>
                        </div>

                        {/* Content */}
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            open === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                            <div className="p-4 pt-0 border-t border-gray-100">
                                <p className="text-gray-700 py-4 leading-relaxed text-sm md:text-base">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}
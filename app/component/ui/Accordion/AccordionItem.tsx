import {FaAngleDown, FaAngleUp} from 'react-icons/fa6';
import {motion} from 'framer-motion';

interface AccordionItemProps {
    item: {
        id: string;
        title: string;
        content: string;
    };
    open: string | null
    toggle: (id: string) => void
}

export default function AccordionItem({item, open, toggle}: AccordionItemProps) {
    return (
        <motion.div
            key={item.id}
            className="group mb-8 bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:scale-[1.02]"
        >
            <div onClick={() => toggle(item.id)}
                 className="flex justify-between items-center p-4 cursor-pointer bg-gradient-to-r from-slate-50 to-gray-50 hover:from-blue-50 hover:to-teal-50 transition-all duration-300"
            >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-500 group-hover:text-blue-700">
                    {item.title}
                </h2>
                <div
                    className="ml-4 p-2 rounded-full bg-white shadow-sm group-hover:bg-blue-100 transition-all duration-300">
                    {open === item.id ? (
                        <FaAngleUp className="text-blue-600 transition-transform duration-300 rotate-0"/>) : (
                        <FaAngleDown className="text-gray-500 group-hover:text-blue-600 transition-all duration-300"/>
                    )}
                </div>
            </div>

            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${open === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 pt-0 border-t border-gray-100">
                    <p className="text-gray-700 py-4 leading-relaxed text-sm md:text-base">
                        {item.content}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
import React from "react";
import { HiExclamationTriangle, HiInformationCircle } from "react-icons/hi2";

type Props = {
    title?: string;
    children: React.ReactNode;
    type: "info" | "warning";
};

export default function AlertBox({ children, type, title }: Props) {
    const baseClasses = "w-full p-4 my-6 rounded-lg border shadow-sm";
    const styles = {
        info: "bg-blue-50 text-blue-900 border-blue-200",
        warning: "bg-amber-50 text-amber-900 border-amber-200",
    };

    const iconStyles = {
        info: "text-blue-600",
        warning: "text-amber-600",
    };

    const icons = {
        info: <HiInformationCircle className={`size-10 shrink-0 ${iconStyles.info}`} />,
        warning: <HiExclamationTriangle className={`size-10 shrink-0 ${iconStyles.warning}`} />,
    };

    return (
        <div className={`${baseClasses} ${styles[type]}`}>
            <div className="flex items-start gap-3">
                {icons[type]}
                <div className="flex-1">
                    {title && (
                        <h4 className="text-[clamp(1.5rem,2vw,4rem)] font-semibold leading-snug mb-1">
                            {title}
                        </h4>
                    )}

                    <div className="text-base leading-relaxed [&>p]:py-2 [&>p]:m-0">
                        <>
                            {children}
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
}

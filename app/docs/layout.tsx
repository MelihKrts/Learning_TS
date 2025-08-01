import {getDocTree} from "@/lib/getMdxPageMeta";
import DocsSidebar from "@/app/component/ui/DocsSidebar";
import {PageLoadTime} from "@/app/component/ui/PageLoad";
import React from "react";

export default function DocsLayout({children,}: { children: React.ReactNode; }) {
    const docTree = getDocTree();

    return (
        <>
            <DocsSidebar docTree={docTree}/>
            <div className="transition-all duration-300  lg:ml-64 pt-4">
                <div className="mx-auto p-6 ">
                    {children}
                </div>
            </div>
            <PageLoadTime/>
        </>
    )
}
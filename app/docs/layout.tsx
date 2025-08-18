import {getDocTree} from "@/lib/getMdxPageMeta";
import DocsSidebar from "@/app/component/ui/DocsSideBar/DocsSidebar";
import {PageLoadTime} from "@/app/component/ui/PageLoad/PageLoad";
import React from "react";
import TOCBtn from "@/app/component/ui/TableOfContents/TocBtn";

export default function DocsLayout({children,}: { children: React.ReactNode; }) {
    const docTree = getDocTree();

    return (
        <>
            <DocsSidebar docTree={docTree}/>
            <div className="transition-all duration-300  lg:ml-64 pt-4">
                <div className="mx-auto p-6 ">
                    {children}
                </div>
                <TOCBtn/>
            </div>
            <PageLoadTime/>
        </>
    )
}
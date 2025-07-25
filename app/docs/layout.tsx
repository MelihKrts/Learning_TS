import {getDocTree} from "@/lib/getMdxPageMeta";
import DocsSidebar from "@/app/component/DocsSidebar";

export default function DocsLayout({children,}: { children: React.ReactNode; }) {
    const docTree = getDocTree();

    return (
        <>
            <DocsSidebar docTree={docTree}/>
            <div className="transition-all duration-300  lg:ml-64 pt-16">
                <div className="mx-auto px-4 lg:px-6 py-6 lg:py-8 ">
                    {children}
                </div>
            </div>
        </>
    )
}
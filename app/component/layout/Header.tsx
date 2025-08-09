import Link from "next/link";
import Image from "next/image";
import ThemeSelector from "@/app/component/ui/ThemeSelector";
import dynamic from "next/dynamic";

const MobileMenu = dynamic(() => import("@/app/component/header/MobileMenu"));

export default function Header() {

    return (
        <header className="w-full fixed top-0 z-100 bg-blue-600 dark:bg-gray-900 shadow-md">
            <nav className="@container mx-auto flex py-2 px-4 justify-between items-center">
                <div className="flex items-center gap-2">
                    <Link href="/"
                          className="text-2xl flex items-center justify-center text-white dark:text-gray-100">
                        <Image src="/logos/ts_logo.svg" alt="TypeScript Logo" width={35} height={35}/>
                        <span className="pt-2 px-2 text-white dark:text-gray-100 font-semibold">Learn TS</span>
                    </Link>
                </div>

                <ul className="hidden @4xl:flex flex-row space-x-6 text-lg items-center">
                    <li>
                        <Link
                            href="/docs/started"
                            className="text-white dark:text-gray-300 hover:text-blue-200 dark:hover:text-blue-400 transition-colors"
                        >
                            Started
                        </Link>
                    </li>

                    <ThemeSelector/>
                </ul>

                {/* Mobil Menü */}
                <MobileMenu/>
            </nav>

        </header>
    );
}
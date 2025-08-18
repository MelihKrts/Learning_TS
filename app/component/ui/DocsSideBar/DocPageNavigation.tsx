import Link from "next/link"

interface DocPageNavigationProps {
    prevSlug?: string
    nextSlug?: string
    prevTitle?: string
    nextTitle?: string
}

export default function DocPageNavigation({ prevSlug, nextSlug, prevTitle, nextTitle }: DocPageNavigationProps) {
    if (!prevSlug && !nextSlug) return null

    return (
        <nav className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                {prevSlug && prevTitle && (
                    <Link
                        href={`/docs/${prevSlug}`}
                        className="group inline-flex items-start text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-wide text-gray-500 group-hover:text-gray-700">Önceki</span>
                            <span className="font-medium group-hover:underline">{prevTitle}</span>
                        </div>
                    </Link>
                )}
                {nextSlug && nextTitle && (
                    <Link
                        href={`/docs/${nextSlug}`}
                        className="group inline-flex items-start text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base sm:ml-auto sm:text-right"
                    >
                        <div className="flex flex-col sm:items-end">
                            <span className="text-sm font-bold tracking-wide text-gray-500 group-hover:text-gray-700">Sonraki</span>
                            <span className="font-medium group-hover:underline">{nextTitle}</span>
                        </div>
                    </Link>
                )}
            </div>
        </nav>
    )
}

interface DocPageHeaderProps {
    title: string
    description?: string
}

export default function DocPageHeader({ title, description }: DocPageHeaderProps) {
    return (
        <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h1>
            {description && <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">{description}</p>}
        </div>
    )
}

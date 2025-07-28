import React from "react"

type Props = {
    srcWebp: string,            // webp format image path
    srcFallBack: string,       //  JPG,PNG fallback image path ?
    alt: string,              //   SEO image text
    caption: string,         //    Caption
    className?: string,
}

export default function ImageWithCaption({srcWebp, alt, caption, className, srcFallBack}: Props) {
    return (
        <figure className={`my-2 text-center ${className}`}>
            <picture>
                <source srcSet={srcWebp} type="image/webp"/>
                <img
                    src={srcFallBack}
                    alt={alt}
                    loading="lazy"
                    className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"/>
            </picture>
            <figcaption className="text-sm text-gray-600 mt-2 italic">
                {caption}
            </figcaption>
        </figure>
    )
}

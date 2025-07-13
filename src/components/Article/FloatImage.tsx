import { FloatImageProps } from "./types"

export default function FloatImage({
    children,
    src,
    alt,
    caption,
    direction = "right",
    content,
}: FloatImageProps) {
    // Use direction prop to determine float class names
    const floatClasses =
        direction === "left"
            ? "xl:float-left xl:mx-0 xl:mb-0 xl:-ml-28 xl:max-w-xl xl:pr-8 xl:pb-6"
            : "xl:float-right xl:mx-0 xl:mb-0 xl:-mr-28 xl:max-w-xl xl:pl-8 xl:pb-6"

    return (
        <div className="flex flex-col xl:flow-root">
            <div className={`mx-auto ${floatClasses}`}>
                <figure className="mb-0">
                    {content ? (
                        content
                    ) : src ? (
                        <div
                            className={`transition duration-700 ease-in-out hover:-translate-y-0.5 hover:transform-gpu ${
                                direction === "left"
                                    ? "hover:rotate-[0.5deg]" // Left images rotate clockwise
                                    : "hover:rotate-[-0.5deg]" // Right images rotate counterclockwise
                            }`}
                        >
                            <img
                                src={src}
                                alt={alt || ""}
                                className="mb-0 h-auto max-h-[70vh] w-full rounded-lg object-contain transition duration-700 ease-in-out hover:scale-[1.01]"
                            />
                            {caption && (
                                <figcaption className="mt-2 text-center text-sm text-gray-500">
                                    {caption}
                                </figcaption>
                            )}
                        </div>
                    ) : null}
                </figure>
            </div>
            <div className="mt-4 xl:mt-0">{children}</div>
        </div>
    )
}

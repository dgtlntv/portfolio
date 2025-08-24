import { FanImagesProps } from "./types"

export default function FanImages({ images, caption }: FanImagesProps) {
    if (!images || images.length === 0) return null

    // Calculate rotation angles and positions based on number of images
    const getFanLayout = (index: number, total: number) => {
        if (total === 1) return { rotation: 0, xOffset: 0 }

        // For 2+ images, create a true fan spread
        const maxAngle = total === 2 ? 16 : Math.min(25, total * 6)
        const step = total === 1 ? 0 : (maxAngle * 2) / (total - 1)
        const rotation = -maxAngle + index * step

        // Horizontal spread for fan effect - more subtle spread
        const maxSpread = total === 2 ? 40 : Math.min(60, total * 20)
        const xOffset =
            total === 1
                ? 0
                : -maxSpread + (index * (maxSpread * 2)) / (total - 1)

        return { rotation, xOffset }
    }

    return (
        <div className="mt-6 mb-12 flex flex-col items-center">
            <div
                className="relative h-96 w-full max-w-4xl overflow-hidden"
                style={{
                    transform: "perspective(1000px) rotateX(12deg)",
                }}
            >
                {images.map((image, index) => {
                    const { rotation, xOffset } = getFanLayout(
                        index,
                        images.length,
                    )
                    // Rightmost image should be on top - higher index = higher z-index
                    const zIndex = index + 1

                    return (
                        <div
                            key={index}
                            className="absolute bottom-0 left-1/2 origin-bottom transition-all duration-700 ease-in-out"
                            style={{
                                transform: `translateX(calc(-50% + ${xOffset}px)) rotate(${rotation}deg)`,
                                zIndex: zIndex,
                            }}
                        >
                            <div className="transition duration-700 ease-in-out hover:-translate-y-0.5 hover:rotate-[-0.5deg] hover:transform-gpu">
                                <img
                                    src={image.src}
                                    alt={image.alt || ""}
                                    className="mt-0 mb-0 h-auto max-h-80 w-auto rounded-lg border border-gray-200 object-contain transition duration-700 ease-in-out hover:scale-[1.01]"
                                />
                            </div>
                        </div>
                    )
                })}

                {/* Gradient fade overlay covering full height */}
                <div className="pointer-events-none absolute bottom-0 left-0 z-50 h-full w-full bg-gradient-to-t from-white via-transparent via-white/60 to-transparent"></div>
            </div>

            {caption && (
                <figcaption className="mt-12 text-center text-sm text-gray-500">
                    {caption}
                </figcaption>
            )}
        </div>
    )
}

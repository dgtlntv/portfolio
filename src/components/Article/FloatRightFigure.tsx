import { FloatRightFigureProps } from "./types"

export default function FloatRightFigure({ children, src, alt, caption }: FloatRightFigureProps) {
    return (
        <div className="mx-auto xl:float-right xl:mx-0 xl:mb-0 xl:-mr-60 xl:max-w-xl xl:pl-8 xl:pb-8">
            <figure>
                {src ? (
                    <>
                        <img src={src} alt={alt || ''} className="rounded-lg shadow-md" />
                        {caption && (
                            <figcaption className="mt-2 text-sm text-center text-gray-500">
                                {caption}
                            </figcaption>
                        )}
                    </>
                ) : (
                    children
                )}
            </figure>
        </div>
    )
}

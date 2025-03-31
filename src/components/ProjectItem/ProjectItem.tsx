import { Link } from "@tanstack/react-router"
import GridLayout from "../Grid/GridLayout"
import { ProjectItemProps } from "./types" // Assuming this defines the props correctly

export default function ProjectItem({
    className,
    title,
    imageUrl,
    url,
    children,
    isLeft = false,
    heroLocation,
}: ProjectItemProps) {
    const isVideo = imageUrl?.endsWith(".webm")

    return (
        <div className="col-span-9 mt-12 sm:mt-16 lg:mt-18">
            <GridLayout>
                {/* Content section */}
                <div
                    className={`col-span-9 md:col-span-2 ${
                        isLeft ? "md:col-start-1" : "md:col-start-8"
                    } order-2 md:order-${isLeft ? "1" : "2"}`}
                >
                    <h3 className="font-fancy text-4xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                        {title}
                    </h3>
                    <p className="mt-3 text-lg text-gray-500">{children}</p>
                    <p className="mt-3 font-bold text-red-500">
                        <Link to={url}>⤳ view project</Link>
                    </p>
                </div>

                {/* Image/Video section */}
                <div
                    className={`col-span-9 md:col-span-6 ${
                        isLeft ? "md:col-start-4" : "md:col-start-1"
                    } order-1 mt-10 md:mt-0 md:order-${isLeft ? "2" : "1"} ${
                        className || ""
                    }`}
                >
                    <Link to={url}>
                        <div
                            className={`relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 shadow-md transition duration-700 ease-in-out hover:-translate-y-0.5 hover:transform-gpu hover:shadow-lg ${
                                isLeft
                                    ? "hover:rotate-[0.5deg]"
                                    : "hover:rotate-[-0.5deg]"
                            } hover:scale-[1.01]`}
                        >
                            {/* Image/Video: Use absolute positioning pinned to edges */}
                            {isVideo ? (
                                <video
                                    className={`h-full w-full ${
                                        heroLocation === "cover"
                                            ? "object-cover"
                                            : "object-contain"
                                    } bg-white object-center transition-transform duration-700 ease-in-out`}
                                    src={imageUrl}
                                    controls={false}
                                    autoPlay={true}
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img
                                    className={`h-full w-full ${
                                        heroLocation === "cover"
                                            ? "object-cover"
                                            : "object-contain"
                                    } bg-white object-center transition-transform duration-700 ease-in-out`}
                                    src={imageUrl}
                                    alt={title || "Project image"}
                                    loading="lazy"
                                />
                            )}
                        </div>
                    </Link>
                </div>
            </GridLayout>
        </div>
    )
}

import { Link } from "@tanstack/react-router"
import { ProjectItemProps } from "./types"

export default function ProjectItem({
    className,
    title,
    imageUrl,
    url,
    children,
    isLeft = false,
}: ProjectItemProps) {
    return (
        <div
            className={`relative mt-12 sm:mt-16 lg:mt-24 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start lg:gap-32 ${
                isLeft ? "lg:grid-flow-row-dense" : ""
            }`}
        >
            <div
                className={`order-last lg:order-first ${
                    isLeft ? "lg:col-start-3" : "lg:col-span-1"
                }`}
            >
                <h3 className="font-fancy text-4xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                    {title}
                </h3>
                <p className="mt-3 text-lg text-gray-500">{children}</p>
                <p className="mt-3 font-bold text-red-500">
                    <Link to={url}>⤳ view project</Link>
                </p>
            </div>

            <div
                className={`relative order-first mt-10 lg:order-last lg:col-span-2 lg:-mx-4 lg:mt-0 ${
                    isLeft ? "lg:col-start-1" : "flex justify-end"
                } ${className || ""}`}
            >
                <Link to={url}>
                    <img
                        className="relative rounded-xl shadow-md"
                        src={imageUrl}
                        alt=""
                    />
                </Link>
            </div>
        </div>
    )
}

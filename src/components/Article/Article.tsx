import GridLayout from "../Grid/GridLayout"
import WidthLayout from "../Grid/WidthLayout"
import ArticleText from "./ArticleText"
import { ArticleProps } from "./types"

export default function Article({
    stats,
    heroUrl,
    heroLocation,
    title,
    children,
}: ArticleProps) {
    const isVideo = heroUrl?.endsWith(".webm")

    return (
        <div className="relative overflow-hidden bg-white pt-8 pb-16 lg:py-12">
            <WidthLayout>
                <GridLayout>
                    {/* Hero Image/Video - Full width */}
                    <div
                        className={`mb-8 flex overflow-hidden rounded-xl shadow-md sm:aspect-[16/8] md:col-span-9 ${
                            heroLocation === "center"
                                ? "items-center"
                                : heroLocation === "start"
                                  ? "items-start"
                                  : heroLocation === "end"
                                    ? "items-end"
                                    : ""
                        }`}
                    >
                        {isVideo ? (
                            <video
                                className={`w-full ${heroLocation === "cover" ? "h-full object-cover object-top" : ""}`}
                                src={heroUrl}
                                controls={false}
                                autoPlay={true}
                                loop
                            />
                        ) : (
                            <img
                                className={`w-full ${heroLocation === "cover" ? "h-full object-cover object-top" : ""}`}
                                src={heroUrl}
                                alt=""
                            />
                        )}
                    </div>

                    {/* Title - Full width to match hero image */}
                    <div className="text-lg md:col-span-9">
                        <h1>
                            <span className="font-fancy mt-6 block text-center text-5xl leading-tight font-extrabold tracking-normal text-gray-900">
                                {title}
                            </span>
                        </h1>
                    </div>

                    {/* Stats - Center 5 columns */}
                    <div className="font-fancy mt-8 md:col-span-7 md:col-start-2">
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="border-y border-gray-100 py-3 text-center"
                                >
                                    <dt className="text-sm font-medium text-gray-500">
                                        {stat.label}
                                    </dt>
                                    <dd className="text-lg font-bold tracking-tight text-gray-900 lg:text-xl">
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {/* Article content - Center 5 columns */}
                    <div className="md:col-span-7 md:col-start-2">
                        <ArticleText>{children}</ArticleText>
                    </div>
                </GridLayout>
            </WidthLayout>
        </div>
    )
}

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
    return (
        <div className="relative overflow-hidden bg-white pb-16 pt-8 lg:py-12">
            <WidthLayout>
                <GridLayout>
                    {/* Hero Image - Full width */}
                    <div
                        className={`mb-8 flex overflow-hidden rounded-xl shadow-md sm:aspect-[16/8] md:col-span-9 ${
                            heroLocation === "center"
                                ? "items-center"
                                : heroLocation === "start"
                                  ? "items-start"
                                  : ""
                        }`}
                    >
                        <img className="w-full" src={heroUrl} alt="" />
                    </div>

                    {/* Title - Center 5 columns */}
                    <div className="text-lg md:col-span-7 md:col-start-2">
                        <h1>
                            <span className="font-fancy mt-2 block text-center text-5xl font-extrabold leading-8 tracking-tight text-gray-900">
                                {title}
                            </span>
                        </h1>
                    </div>

                    {/* Stats - Center 5 columns */}
                    <div className="font-fancy mt-10 text-lg md:col-span-7 md:col-start-2">
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="border-y-2 border-gray-100 py-6 text-center"
                                >
                                    <dt className="text-base font-medium text-gray-500">
                                        {stat.label}
                                    </dt>
                                    <dd className="text-2xl font-extrabold tracking-tight text-gray-900 lg:text-3xl">
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

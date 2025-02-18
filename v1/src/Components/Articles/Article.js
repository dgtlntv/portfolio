export default function Article({ stats, heroUrl, heroLocation, title, children }) {
    return (
        <div className="relative overflow-hidden bg-white pb-16 pt-8 lg:py-12">
            <div className="relative px-4 sm:px-6 lg:px-8">
                <div
                    className={`mx-auto mb-8 flex max-w-5xl overflow-hidden rounded-xl shadow-md sm:aspect-[16/8] ${
                        heroLocation === "center" ? "items-center" : heroLocation === "start" ? "items-start" : ""
                    }`}>
                    <img className="" src={heroUrl} alt="" />
                </div>

                <div className="mx-auto max-w-prose text-lg">
                    <h1>
                        <span className="mt-2 block text-center font-fancy text-5xl font-extrabold leading-8 tracking-tight text-gray-900">
                            {title}
                        </span>
                    </h1>
                </div>

                <div className="mx-auto mt-10 max-w-prose font-fancy text-lg">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="border-y-2 border-gray-100 py-6 text-center">
                                <dt className="text-base font-medium text-gray-500">{stat.label}</dt>
                                <dd className="text-2xl font-extrabold tracking-tight text-gray-900 lg:text-3xl">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
                {children}
            </div>
        </div>
    )
}

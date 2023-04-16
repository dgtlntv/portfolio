import Navigation from "../Components/GlobalLayout/Navigation"
import Footer from "../Components/GlobalLayout/Footer"
import { useState } from "react"
import ArticleTextWrapper from "../Components/Articles/ArticleTextWrapper"
import Map from "../Components/Leaflet/Map"

export default function Boulderspotat() {
    const stats = [
        { label: "Context", value: "Personal Projects" },
        { label: "Period", value: "2023" },
    ]

    const [heroExpanded, setHeroExpanded] = useState(false)

    return (
        <div>
            <div className={`relative ${heroExpanded ? "flex h-screen flex-none flex-col" : ""} `}>
                <Navigation />
                <div
                    className={`relative h-full w-full px-4 sm:px-6 lg:px-6 ${
                        heroExpanded ? "flex-1 pb-8" : "pt-8 lg:py-12"
                    }`}>
                    <div
                        className={`relative mx-auto mb-8 flex overflow-hidden rounded-xl shadow-md ${
                            heroExpanded ? "h-full w-full" : "aspect-[1/1] max-w-5xl sm:aspect-[16/8]"
                        }
                    `}>
                        <button
                            className="absolute top-0 right-0 z-50 mr-3 mt-3 h-10 w-10 rounded-md border border-black bg-white p-1"
                            onClick={() => {
                                window.dispatchEvent(new Event("resize"))
                                setHeroExpanded((prevState) => !prevState)
                            }}>
                            {heroExpanded ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 96 960 960">
                                    <path d="m122 976-42-42 298-298H180v-60h300v300h-60V678L122 976Zm358-400V276h60v198l298-298 42 42-298 298h198v60H480Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 96 960 960">
                                    <path d="M120 936V636h60v198l558-558H540v-60h300v300h-60V318L222 876h198v60H120Z" />
                                </svg>
                            )}
                        </button>
                        <Map />
                    </div>
                </div>
            </div>

            <div className={`relative overflow-hidden bg-white pb-16`}>
                <div className="relative px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-prose text-lg">
                        <h1>
                            <span className="mt-2 block text-center font-fancy text-5xl font-extrabold leading-8 tracking-tight text-gray-900">
                                BoulderSpot.at
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
                    <ArticleTextWrapper>
                        <p>
                            As an avid boulderer, I really wanted to explore more outdoor bouldering areas this year. At the
                            beginning of the year, I came across an interesting machine learning project called BoulderSpot,
                            developed by <a href="https://peterszemraj.ch/">Peter Szemraj</a>, that piqued my interest.
                            Behind BoulderSpot is a machine learning model that is capable of identifying potential
                            bouldering areas on satellite imagery. The model was trained on a dataset of about 15,000
                            satellite images of Switzerland and classifies potential bouldering areas. The dataset includes
                            known bouldering areas and a large number of terrain samples from all over Switzerland. More
                            details and the website can be found at <a href="https://boulderspot.io">boulderspot.io</a> , and
                            the open-source models are{" "}
                            <a href="https://github.com/pszemraj/BoulderAreaDetector">available on GitHub</a>.
                        </p>
                        <p>
                            Inspired by Peter's project, I set out to replicate it for Austria. I acquired high-resolution
                            satellite imagery of Austria from <a href="https://basemap.at/">basemap.at</a> and collected
                            about 31 million 256x256 pixel images. I ran Peter's models on the entire Austrian satellite
                            image dataset using P4000 GPUs from <a href="https://www.paperspace.com/">paperspace.com</a>. The
                            results were raw points which still appeared to have several false positives. I saw that the true
                            positives often formed clusters, while the false positives were mostly single points. To get
                            better results, I clustered the points using the DBSCAN algorithm, setting at least four points
                            within a 300 m radius, filtering out the rest. The filtering of false positives can still be
                            improved, and I am open to any ideas!
                        </p>
                        <p>
                            For better visualization, I outlined the clusters and included a road data layer from{" "}
                            <a href="https://basemap.at/">basemap.at</a>. In the near future I will explore some of these
                            places and update this page with my discoveries. If you have any questions, recommendations or
                            want to share your knowledge, please get in touch!
                        </p>
                    </ArticleTextWrapper>
                </div>
            </div>
            <Footer slim={true} />
        </div>
    )
}

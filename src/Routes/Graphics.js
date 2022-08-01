import { Tab } from "@headlessui/react"

export default function Graphics() {
    const product = {
        images: [
            {
                id: 1,
                name: "Poster 1",
                src: "/graphics/posters/p1.jpg",
                alt: "Poster 1",
            },
            {
                id: 2,
                name: "Poster 2",
                src: "/graphics/posters/p2.jpg",
                alt: "Poster 2",
            },
            {
                id: 3,
                name: "Poster 3",
                src: "/graphics/posters/p3.jpg",
                alt: "Poster 3",
            },
            {
                id: 4,
                name: "Poster 4",
                src: "/graphics/posters/p4.jpg",
                alt: "Poster 4",
            },
            {
                id: 5,
                name: "Poster 5",
                src: "/graphics/posters/p5.jpg",
                alt: "Poster 5",
            },
            {
                id: 6,
                name: "Poster 6",
                src: "/graphics/posters/p6.jpg",
                alt: "Poster 6",
            },
        ],
    }

    const product2 = {
        images: [
            {
                id: 1,
                name: "Poster 1",
                src: "/graphics/knowledgement/knowledgement_poster.jpg",
                alt: "Poster 1",
            },
            {
                id: 2,
                name: "Poster 2",
                src: "/graphics/knowledgement/ussr_poster.jpg",
                alt: "Poster 2",
            },
        ],
    }

    const stats = [{ label: "Context", value: "University & Personal Projects" }]

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ")
    }

    return (
        <div className="relative py-16 bg-white overflow-hidden">
            <div className="relative px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto aspect-[16/8] overflow-hidden rounded-xl flex items-center shadow-md mb-8">
                    <img className="" src="/Graphics/Hero.png" />
                </div>

                <div className="text-lg max-w-prose mx-auto">
                    <h1>
                        <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl">Graphics</span>
                    </h1>
                </div>

                <div className="mt-10 max-w-prose text-lg mx-auto">
                    <dl className="grid grid-cols-1">
                        {stats.map((stat) => (
                            <div key={stat.label} className="border-y-2 border-gray-100 py-6 text-center">
                                <dt className="text-base font-medium text-gray-500">{stat.label}</dt>
                                <dd className="text-3xl font-extrabold tracking-tight text-gray-900">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="mt-16 prose prose-zinc prose-red prose-xl mx-auto font-sans">
                    <h2 className="mb-0">SprechenÜber</h2>
                    <div className="flow-root">
                        <div className="float-right -mr-52 max-w-lg pl-8 not-prose">
                            <Tab.Group as="div" className="flex flex-col-reverse">
                                {/* Image selector */}
                                <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                                    <Tab.List className="grid grid-cols-4 gap-6">
                                        {product.images.map((image) => (
                                            <Tab
                                                key={image.id}
                                                className="relative aspect-[1/1.4142] bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50">
                                                {({ selected }) => (
                                                    <>
                                                        <span className="sr-only">{image.name}</span>
                                                        <span className="absolute inset-0 rounded-md overflow-hidden">
                                                            <img src={image.src} alt="" className="w-full h-full object-center object-cover" />
                                                        </span>
                                                        <span
                                                            className={classNames(
                                                                selected ? "ring-indigo-500" : "ring-transparent",
                                                                "absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none"
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                    </>
                                                )}
                                            </Tab>
                                        ))}
                                    </Tab.List>
                                </div>

                                <Tab.Panels className="w-full aspect-w-1 aspect-h-2">
                                    {product.images.map((image) => (
                                        <Tab.Panel key={image.id}>
                                            <img src={image.src} alt={image.alt} className="w-full h-full object-center object-cover sm:rounded-lg" />
                                        </Tab.Panel>
                                    ))}
                                </Tab.Panels>
                            </Tab.Group>
                        </div>

                        <p>
                            SprechenÜber (which means 'talking about') is a student organized talk series at my university about all things design. From the wintersemester of 2018/19 until the
                            wintersemester of 2019/20 me and a colleague of mine organize these talks. Because of a lack of a proper CD, I designed one when we took over. The logo is a deconstruction
                            of the name SprechenÜber, so that the two r's create a bracket for the title of the talk. Our main goal with the CD was to make our posters as easily readable as possible,
                            aswell as having a high recognition value. In parallel to the poster we also developed formats for digital distribution on social media platforms, our website and our in
                            campus communication platform.
                        </p>
                    </div>

                    <div className="flow-root mt-24">
                        <h2 className="mb-0">Knowledgement</h2>
                        <div className="float-right -mr-52 max-w-lg pl-8 not-prose">
                            <Tab.Group as="div" className="flex flex-col-reverse">
                                {/* Image selector */}
                                <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                                    <Tab.List className="grid grid-cols-4 gap-6">
                                        {product2.images.map((image) => (
                                            <Tab
                                                key={image.id}
                                                className="relative aspect-[1/1.4142] bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50">
                                                {({ selected }) => (
                                                    <>
                                                        <span className="sr-only">{image.name}</span>
                                                        <span className="absolute inset-0 rounded-md overflow-hidden">
                                                            <img src={image.src} alt="" className="w-full h-full object-center object-cover" />
                                                        </span>
                                                        <span
                                                            className={classNames(
                                                                selected ? "ring-indigo-500" : "ring-transparent",
                                                                "absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none"
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                    </>
                                                )}
                                            </Tab>
                                        ))}
                                    </Tab.List>
                                </div>

                                <Tab.Panels className="w-full aspect-w-1 aspect-h-2">
                                    {product2.images.map((image) => (
                                        <Tab.Panel key={image.id}>
                                            <img src={image.src} alt={image.alt} className="w-full h-full object-center object-cover sm:rounded-lg" />
                                        </Tab.Panel>
                                    ))}
                                </Tab.Panels>
                            </Tab.Group>
                        </div>

                        <p>
                            I made this graphic for the documentation of my university project Knowledgement. Knowledgement is a concept about personalized protocols on the basis of an intelligent
                            knowledge management system. With that in mind I tried to create a cover art that conveys easy access to the knowledge of an organisation at a moments notice. The motive
                            was inspired by a social awarness poster from the USSR called "Young People, Go to the Textile Industry" from the 1970s, which I found in the book "Designed in the USSR"
                            (ISBN 9780714875576).
                        </p>
                    </div>
                    <div className="mt-24">
                        <h2>Moon and Earth</h2>
                        <video controls className="rounded-xl shadow-md">
                            <source src="/graphics/optimized_Rueschenbeck_Animation_4k_60fps.mp4" type="video/mp4"></source>
                        </video>
                        <p>
                            In my time working at NOMOS Glashütte my assignment often was to conceptualise visual marketing material for social media. One of which was for the special edition Tangente
                            Update Rüschenbeck. I found, that if you visualy deconstruct the watchface of the Tangente Update it almost looks like a moon orbiting a planet. So in my concept I reversed
                            that deconstruction, to make this clip, which was so well liked, that they ended up actually using it as marketing material on Instagram and the online shop of Rüschenbeck.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

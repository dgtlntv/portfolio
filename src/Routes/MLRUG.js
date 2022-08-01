import { Tab } from "@headlessui/react"

export default function MLRUG() {
    const product1 = {
        images: [
            {
                id: 1,
                name: "Original 1",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370895/portfolio/MLRUG/optimized_og1_abjily.jpg",
                alt: "Original 1",
            },
            {
                id: 2,
                name: "Original 2",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370894/portfolio/MLRUG/optimized_og2_kntmvj.jpg",
                alt: "Original 2",
            },
            {
                id: 3,
                name: "Original 3",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370893/portfolio/MLRUG/optimized_og3_zn2xem.jpg",
                alt: "Original 3",
            },
            {
                id: 4,
                name: "Original 4",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370893/portfolio/MLRUG/optimized_og4_wuyclb.jpg",
                alt: "Original 4",
            },
            {
                id: 5,
                name: "Original 5",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370893/portfolio/MLRUG/optimized_og5_rpqo0a.jpg",
                alt: "Original 5",
            },
        ],
    }

    const product2 = {
        images: [
            {
                id: 1,
                name: "Result 1",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370894/portfolio/MLRUG/optimized_test1_q0ickq.jpg",
                alt: "Result 1",
            },
            {
                id: 2,
                name: "Result 2",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370894/portfolio/MLRUG/optimized_test2_bsazdb.jpg",
                alt: "Result 2",
            },
            {
                id: 3,
                name: "Result 3",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370895/portfolio/MLRUG/optimized_test3_tp3e7l.jpg",
                alt: "Result 3",
            },
            {
                id: 4,
                name: "Result 4",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370895/portfolio/MLRUG/optimized_test4_w4wlpv.jpg",
                alt: "Result 4",
            },
            {
                id: 5,
                name: "Result 5",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370894/portfolio/MLRUG/optimized_test5_u7ssfr.jpg",
                alt: "Result 5",
            },
        ],
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ")
    }

    const stats = [
        { label: "Context", value: "Personal Project" },
        { label: "Period", value: "6 Months" },
    ]

    return (
        <div className="relative py-16 bg-white overflow-hidden">
            <div className="relative px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto aspect-[16/8] overflow-hidden rounded-xl flex items-center justify-center mb-8 shadow-md">
                    <img className="h-full" src="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370894/portfolio/MLRUG/Hero_mesip5.png" />
                </div>

                <div className="text-lg max-w-prose mx-auto">
                    <h1>
                        <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl">MLRUG</span>
                    </h1>
                </div>

                <div className="mt-10 max-w-prose text-lg mx-auto">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="border-y-2 border-gray-100 py-6 text-center">
                                <dt className="text-base font-medium text-gray-500">{stat.label}</dt>
                                <dd className="text-3xl font-extrabold tracking-tight text-gray-900">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="mt-16 prose prose-zinc prose-red prose-xl mx-auto font-sans">
                    <p>
                        In the design theory class at my college, we often discussed the role of machine learning algorithms and artificial intelligence in the design process. One conclusion from this
                        discussion was that generative algorithms will play an increasingly important role in the design process, to the point where the role of the designer might change from creator
                        to curator. With that in mind I wanted to do a project where I experiment with generative algorithms as a design tool.
                    </p>
                    <h2>Data</h2>

                    <div className="flow-root">
                        <div className="float-right -mr-52 max-w-lg pl-8 not-prose">
                            <Tab.Group as="div" className="flex flex-col-reverse">
                                {/* Image selector */}
                                <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                                    <Tab.List className="grid grid-cols-4 gap-6">
                                        {product1.images.map((image) => (
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
                                    {product1.images.map((image) => (
                                        <Tab.Panel key={image.id}>
                                            <img src={image.src} alt={image.alt} className="w-full h-full object-center object-cover sm:rounded-lg" />
                                        </Tab.Panel>
                                    ))}
                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                        <p>
                            As with so many machine learning projects, one of the biggest considerations for me was the data I would feed my generative algorithm with. I wanted to choose a design
                            object that I was reasonably familiar with, could get a sufficient amount of data, and could be represented as an image (since 3d generative design from scratch is much
                            more difficult). Through these considerations I chose Moroccan carpets. I am very familiar with Moroccan carpets, as my father deals with them, which also gives me access
                            to image data of Moroccan carpets. The data I could get through my father I supplemented with images from the internet which I collected with a web-crawler. In the end I
                            was able to obtain about 3000 images of Moroccan carpets. This is not a huge amount in the context of a generative algorithm, but enough to get reasonably useful results.
                        </p>
                    </div>

                    <h2>Algorithm and Computing</h2>
                    <p>
                        I investigated various architectures and algorithms and finally settled on HyperGan. At the time, it was an appropriately powerful architecture for this project and was
                        specifically designed to lower the barrier to entry for artists and designers. For my first test, I ran HyperGAN on my laptop, but I quickly realized that my laptop's graphics
                        card (GTX1050) would not be sufficient for a full run. So I turned to a cloud solution. In the process, I landed on Paperspace, which is based on AWS but offers a simpler user
                        experience and is optimized for machine learning There, I did a number of different runs with my data, using different resolutions and parameters. In the end, I found that
                        HyperGAN's default algorithm and a resolution of 256x256 worked best for me.
                    </p>

                    <h2>Results</h2>
                    <div className="flow-root">
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
                            I wouldn't call the results perfect, but for the amount of data and technical knowledge I had, I think they were reasonable. At this point, it's clear that training an
                            algorithm on a small scale like this isn't really going to replace a designer's design process. But it can serve as inspiration. And it definitely did in this project. I'm
                            currently working with my father to make a rug (in Morocco) inspired by the designs that came through this GAN.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

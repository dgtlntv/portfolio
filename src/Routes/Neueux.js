import { Tab } from "@headlessui/react"

export default function Neueux() {
    const product2 = {
        images: [
            {
                id: 1,
                name: "Screenshot 1",
                src: "/neueux/screenshot_1.png",
                alt: "Screenshot 1",
            },
            {
                id: 2,
                name: "Screenshot 2",
                src: "/neueux/screenshot_2.png",
                alt: "Screenshot 2",
            },
            {
                id: 3,
                name: "Screenshot 3",
                src: "/neueux/screenshot_3.png",
                alt: "Screenshot 3",
            },
            {
                id: 4,
                name: "Screenshot 4",
                src: "/neueux/screenshot_4.png",
                alt: "Screenshot 4",
            },
            {
                id: 5,
                name: "Screenshot 5",
                src: "/neueux/screenshot_5.png",
                alt: "Screenshot 5",
            },
        ],
    }

    const stats = [
        { label: "Context", value: "Work Project" },
        { label: "Period", value: "6 months" },
    ]

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ")
    }

    return (
        <div className="relative py-16 bg-white overflow-hidden">
            <div className="relative px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto aspect-[16/8] overflow-hidden rounded-xl flex items-center shadow-md mb-8">
                    <img className="" src="/neueux/Hero.png" />
                </div>

                <div className="text-lg max-w-prose mx-auto">
                    <h1>
                        <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl">neueUX</span>
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
                    <h2 className="mb-6">Problem</h2>
                    <div className="flow-root">
                        <figure className="float-right -mr-60 pl-8 pb-8 max-w-lg -mt-8 mb-0">
                            <video autoPlay muted loop>
                                <source src="/neueux/designnotes_scroll.webm" type="video/webm"></source>
                            </video>
                            <figcaption>A fraction of the design resources available on designnotes.co.</figcaption>
                        </figure>
                        <p>
                            While researching common UX pitfalls in blockchain apps at my previous employer{" "}
                            <a href="https://apeunit.com/" target="_blank">
                                ApeUnit
                            </a>{" "}
                            , I realized how few free resources are available to start blockchain projects' design process. For projects outside the blockchain space, designers and developers have an
                            endless supply of UX/UI resources (like the ones found at{" "}
                            <a target="_blank" href="https://designnotes.co">
                                designnotes.co
                            </a>
                            ). There's a whole world of resources for finding inspiration or UX best practices for nearly every niche app, website, or product. The exact opposite is true for the
                            blockchain space — where I couldn't find anything similar.
                        </p>
                        <p>
                            Blockchain is a technically complex subject that still in its infancy. So, most of the discussion on Blockchain user experiences occurs within developers' circles held at a
                            very high technical level that few designers will be able to follow. These problems create a significant barrier to entry that most designers are not willing to surmount.
                            Unsurprisingly, there aren’t many user experience designers who have broken into this field. Because of this barrier to entry, many blockchain startups have to start their
                            design process from scratch, as with few freely available design resources, and without people who possess the necessary design experience to avoid having to start from
                            square one. Even if there are designers or design-savvy developers in a blockchain company, their daily work process is likely to be slower than what’s necessary, because
                            of the lack of design resources and standardized design patterns to draw upon. These problems have caused the relatively poor UX that most blockchain apps have, despite the
                            industry’s rapid maturation in recent years.
                        </p>
                    </div>

                    <h2 className="mb-6">Idea</h2>
                    <p>
                        To make blockchain more accessible to everyone, there needs to be an open innovation process that facilitates discussions between developers and designers. By including
                        designers in the development process of decentralized apps and providing a better starting point for common UX challenges in blockchain, we will improve the overall user
                        experience of blockchain applications.
                        <p>
                            <strong>I believe many problems could be mitigated by a platform that offers the following resources:</strong>
                        </p>
                    </p>
                    <ul className="marker:text-red-500" role="list">
                        <li>Blockchain UX case studies</li>
                        <li>Blockchain UX best practices</li>
                        <li>Collection of screenshots of popular blockchain applications</li>
                        <li>Blockchain specific iconography</li>
                        <li>Blockchain specific illustrations</li>
                        <li>Blockchain UI kit</li>
                        <li>Interviews with designers working in blockchain</li>
                        <li>Blockchain UX/UI specific news</li>
                    </ul>
                    <p>
                        These resources should make it easier for designers to work in the blockchain space. Thats why I then approached my previouse employer{" "}
                        <a href="https://apeunit.com/" target="_blank">
                            ApeUnit
                        </a>{" "}
                        with the idea of{" "}
                        <a href="https://www.neueux.com" target="_blank">
                            neueUX.com
                        </a>{" "}
                        , an open-source platform that provides these design resources and discusses common design patterns in a decentralized industry. NeueUX goal was to provide a good starting
                        point to learn about design issues in blockchain and offer resources that make the daily work of designing blockchain applications easier and faster.
                    </p>
                    <h2 className="mb-6">Implementation</h2>
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
                            The idea was well received, so we decided to apply for a grant at{" "}
                            <a href="https://molochdao.com/" target="_blank">
                                MolochDAO
                            </a>
                            , one of the first grant giving DAOs. There, we received a grant to implement an initial version of neueUX, which included a gallery of screenshots of popular blockchain
                            applications and a series of articles about the most common UX pitfalls in blockchain. I took on the project lead for this project and in a time frame of about 6 months we
                            designed and implemented the platform and created the content. I unfortunately left Berlin and ApeUnit relatively soon after the first release and it seems that without me
                            advocating for the platform ApeUnit decided not to further pursue the development of the platform. Nevertheless, neueux is still online and hopefully its articles and
                            screenshots will help at least some people take their first steps in blockchain.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

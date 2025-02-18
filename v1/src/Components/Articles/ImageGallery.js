import { Tab } from "@headlessui/react"

export default function ImageGallery({ content }) {
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ")
    }
    return (
        <Tab.Group as="div" className="not-prose flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6  w-full max-w-2xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                    {content.images.map((image) => (
                        <Tab
                            key={image.id}
                            className="relative flex aspect-[1/1.4142] cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4">
                            {({ selected }) => (
                                <>
                                    <span className="sr-only">{image.name}</span>
                                    <span className="absolute inset-0 overflow-hidden rounded-md">
                                        <img src={image.src} alt="" className="h-full w-full object-cover object-center p-2" />
                                    </span>
                                    <span
                                        className={classNames(selected ? "ring-red-500" : "ring-transparent", "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2")}
                                        aria-hidden="true"
                                    />
                                </>
                            )}
                        </Tab>
                    ))}
                </Tab.List>
            </div>

            <Tab.Panels className="aspect-w-1 aspect-h-2 w-full">
                {content.images.map((image) => (
                    <Tab.Panel key={image.id}>
                        <img src={image.src} alt={image.alt} className="h-full w-full object-cover object-center sm:rounded-lg" />
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    )
}

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { ImageGalleryProps } from "./types"

export default function ImageGallery({ images }: ImageGalleryProps) {
    function classNames(...classes: string[]): string {
        return classes.filter(Boolean).join(" ")
    }

    // Support both direct images array or legacy content.images format
    const imageArray = Array.isArray(images) ? images : images?.content?.images || []

    return (
        <TabGroup as="div" className="not-prose flex flex-col-reverse my-8">
            {/* Image selector */}
            <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
                <TabList className="grid grid-cols-4 gap-6">
                    {imageArray.map((image) => (
                        <Tab
                            key={image.id || image.src}
                            className="relative flex aspect-[1/1.4142] cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                        >
                            {({ selected }: { selected: boolean }) => (
                                <>
                                    <span className="sr-only">
                                        {image.name || image.alt}
                                    </span>
                                    <span className="absolute inset-0 overflow-hidden rounded-md">
                                        <img
                                            src={image.src}
                                            alt=""
                                            className="h-full w-full object-cover object-center p-2"
                                        />
                                    </span>
                                    <span
                                        className={classNames(
                                            selected
                                                ? "ring-red-500"
                                                : "ring-transparent",
                                            "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                                        )}
                                        aria-hidden="true"
                                    />
                                </>
                            )}
                        </Tab>
                    ))}
                </TabList>
            </div>

            <TabPanels className="aspect-w-1 aspect-h-2 w-full">
                {imageArray.map((image) => (
                    <TabPanel key={image.id || image.src}>
                        <figure>
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="h-full w-full object-cover object-center sm:rounded-lg"
                            />
                            {image.caption && (
                                <figcaption className="mt-2 text-sm text-center text-gray-500">
                                    {image.caption}
                                </figcaption>
                            )}
                        </figure>
                    </TabPanel>
                ))}
            </TabPanels>
        </TabGroup>
    )
}

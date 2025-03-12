import {
    Popover,
    PopoverButton,
    PopoverPanel,
    Transition,
} from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"

import { Fragment } from "react/jsx-runtime"
import ContactButton from "./ContactButton"
import Logo from "./Logo"
import NavigationItem from "./NavigationItem"
import { NavigationLink } from "./types"

const NAVIGATION_LINKS: NavigationLink[] = [
    { to: "/projects", label: "Projects", isExternal: false },
    { to: "/blog", label: "Blog", isExternal: false },
    { to: "/onepager.pdf", label: "Onepager", isExternal: true },
]

export default function Navigation() {
    return (
        <Popover className="relative z-50 bg-white font-fancy">
            <div className="flex items-center justify-between px-4 py-6 sm:px-6 md:justify-start">
                <div className="flex justify-start lg:w-0 lg:flex-1">
                    <Logo />
                </div>
                <div className="-my-2 -mr-2 md:hidden">
                    <PopoverButton className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
                        <span className="sr-only">Open menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </PopoverButton>
                </div>
                <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
                    <div className="flex items-center gap-8">
                        {NAVIGATION_LINKS.map((link) => (
                            <NavigationItem
                                key={link.to}
                                {...link}
                                variant="desktop"
                            />
                        ))}
                        <ContactButton />
                    </div>
                </div>
            </div>

            <Transition
                as={Fragment}
                enter="duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <PopoverPanel
                    focus
                    className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden"
                >
                    <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="px-5 pt-5 pb-6">
                            <div className="flex items-center justify-between">
                                <Logo />
                                <div className="-mr-2">
                                    <PopoverButton className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
                                        <span className="sr-only">
                                            Close menu
                                        </span>
                                        <XMarkIcon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </PopoverButton>
                                </div>
                            </div>
                        </div>
                        <div className="py-6 px-5">
                            <div className="grid grid-cols-1 gap-4">
                                {NAVIGATION_LINKS.map((link) => (
                                    <NavigationItem
                                        key={link.to}
                                        {...link}
                                        variant="mobile"
                                    />
                                ))}
                                <ContactButton />
                            </div>
                        </div>
                    </div>
                </PopoverPanel>
            </Transition>
        </Popover>
    )
}

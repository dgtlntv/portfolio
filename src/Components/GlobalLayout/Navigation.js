import { Fragment } from "react"
import { Popover, Transition } from "@headlessui/react"
import { MenuIcon, XIcon } from "@heroicons/react/outline"
import { MailIcon } from "@heroicons/react/solid"
import { Link } from "react-router-dom"

export default function Navigation() {
    return (
        <Popover className="relative z-50 bg-white font-fancy">
            <div className="flex items-center justify-between px-4 py-6 sm:px-6 md:justify-start">
                <div className="flex justify-start lg:w-0 lg:flex-1">
                    <Link to="/" className="text-xl font-semibold text-gray-900 hover:text-gray-500">
                        mblazek
                    </Link>
                </div>
                <div className="-my-2 -mr-2 md:hidden">
                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
                        <span className="sr-only">Open menu</span>
                        <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                </div>
                <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
                    <div className="flex items-center gap-8 md:mr-4">
                        <Link
                            to="/portfolio"
                            className="text-base font-medium text-gray-500 hover:text-gray-900 hover:underline hover:decoration-dashed hover:decoration-1 hover:underline-offset-8">
                            Portfolio
                        </Link>
                        <a
                            href="/Onepager.pdf"
                            className="text-base font-medium text-gray-500 hover:text-gray-900 hover:underline hover:decoration-dashed hover:decoration-1 hover:underline-offset-8">
                            Onepager
                        </a>
                        <a
                            href=" mailto:mail@mblazek.xyz "
                            className="inline-flex items-center rounded-md border border-transparent bg-gray-900 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
                            <MailIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                            Send me a Mail!
                        </a>
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
                leaveTo="opacity-0 scale-95">
                <Popover.Panel
                    focus
                    className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden">
                    <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="px-5 pt-5 pb-6">
                            <div className="flex items-center justify-between">
                                <Link to="/" className="text-xl font-semibold text-gray-900 hover:text-gray-500">
                                    mblazek
                                </Link>
                                <div className="-mr-2">
                                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
                                        <span className="sr-only">Close menu</span>
                                        <XIcon className="h-6 w-6" aria-hidden="true" />
                                    </Popover.Button>
                                </div>
                            </div>
                        </div>
                        <div className="py-6 px-5">
                            <div className="grid grid-cols-1 gap-4">
                                <Link to="/portfolio" className="text-base font-medium text-gray-900 hover:text-gray-700">
                                    Portfolio
                                </Link>
                                <a href="/Onepager.pdf" className="text-base font-medium text-gray-900 hover:text-gray-700">
                                    Onepager
                                </a>
                                <a
                                    href=" mailto:mail@mblazek.xyz "
                                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-900 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
                                    <MailIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                                    Send me a Mail!
                                </a>
                            </div>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}

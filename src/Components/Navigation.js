import { Fragment } from "react"
import { Popover, Transition } from "@headlessui/react"
import { MenuIcon, XIcon } from "@heroicons/react/outline"
import { MailIcon } from "@heroicons/react/solid"
import { Link } from "react-router-dom"

export default function Navigation() {
    return (
        <Popover className="relative bg-white z-10">
            <div className="flex justify-between items-center px-4 py-6 sm:px-6 md:justify-start">
                <div className="flex justify-start lg:w-0 lg:flex-1">
                    <a href="#">
                        <Link to="/" className="text-xl font-semibold text-gray-900 hover:text-gray-500">
                            mblazek
                        </Link>
                    </a>
                </div>
                <div className="-mr-2 -my-2 md:hidden">
                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
                        <span className="sr-only">Open menu</span>
                        <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                </div>
                <div className="hidden md:flex-1 md:flex items-center justify-end lg:w-0">
                    <div className="flex items-center gap-8 md:mr-4">
                        <Link to="/portfolio" className="text-base font-medium text-gray-500 hover:text-gray-900 hover:underline hover:decoration-1 hover:underline-offset-8 hover:decoration-dashed">
                            Portfolio
                        </Link>
                        <a href="/Onepager.pdf" className="text-base font-medium text-gray-500 hover:text-gray-900 hover:underline hover:decoration-1 hover:underline-offset-8 hover:decoration-dashed">
                            Onepager
                        </a>
                        <a
                            href=" mailto:mail@mblazek.xyz "
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
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
                <Popover.Panel focus className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                        <div className="pt-5 pb-6 px-5">
                            <div className="flex items-center justify-between">
                                <Link to="/" className="text-xl font-semibold text-gray-900 hover:text-gray-500">
                                    mblazek
                                </Link>
                                <div className="-mr-2">
                                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
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
                                <Link to="/portfolio" className="text-base font-medium text-gray-900 hover:text-gray-700">
                                    Onepager
                                </Link>
                                <Link to="/portfolio" className="text-base font-medium text-gray-900 hover:text-gray-700">
                                    Contact
                                </Link>
                            </div>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}

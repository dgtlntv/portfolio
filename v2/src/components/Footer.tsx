import { EnvelopeIcon } from "@heroicons/react/24/solid"

export default function Footer({ slim = false }) {
    return (
        <footer id="footer" className="bg-white">
            <div
                className={`mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 ${
                    slim
                        ? "flex items-center justify-between py-2 md:py-4"
                        : "py-12 md:flex md:items-center md:justify-between"
                }`}
            >
                <div
                    className={`flex justify-center space-x-4 ${slim ? "order-2" : "md:order-2"}`}
                >
                    <a
                        href="https://www.linkedin.com/in/maxblazek/"
                        className="flex flex-col justify-center text-gray-400 hover:text-gray-500"
                    >
                        <span className="sr-only">Linkedin</span>
                        <svg
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                    <a
                        href="mailto:mail@mblazek.xyz"
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <span className="sr-only">Mail</span>
                        <EnvelopeIcon className="h-6 w-6" aria-hidden="true" />
                    </a>
                </div>
                <div
                    className={`${slim ? "order-1" : "mt-8 md:order-1 md:mt-0"}`}
                >
                    <p className="text-center font-fancy text-base text-gray-400">
                        2025 Maximilian Blazek
                    </p>
                </div>
            </div>
        </footer>
    )
}

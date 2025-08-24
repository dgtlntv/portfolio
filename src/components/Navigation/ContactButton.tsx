import { EnvelopeIcon } from "@heroicons/react/24/solid"
import { ContactLink } from "./types"

const CONTACT_LINK: ContactLink = {
    to: "mailto:mail@mblazek.xyz",
    label: "Send me a Mail!",
    icon: EnvelopeIcon,
}

export default function ContactButton() {
    return (
        <a
            href={CONTACT_LINK.to}
            className="inline-flex items-center rounded-md border border-transparent bg-gray-900 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
        >
            <CONTACT_LINK.icon
                className="-ml-0.5 mr-2 h-4 w-4"
                aria-hidden="true"
            />
            {CONTACT_LINK.label}
        </a>
    )
}

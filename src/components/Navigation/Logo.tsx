import { Link } from "@tanstack/react-router"

export default function Logo() {
    return (
        <Link
            to="/"
            className="text-xl font-semibold text-gray-900 hover:text-gray-500"
        >
            mblazek
        </Link>
    )
}

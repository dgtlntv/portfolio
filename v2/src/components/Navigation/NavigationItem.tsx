import { Link } from "@tanstack/react-router"
import { NavigationItemProps } from "./types"

export default function NavigationItem({
    to,
    label,
    isExternal,
    variant,
}: NavigationItemProps) {
    const className =
        variant === "mobile"
            ? "text-base font-medium text-gray-900 hover:text-gray-700"
            : "text-base font-medium text-gray-500 hover:text-gray-900 hover:underline hover:decoration-dashed hover:decoration-1 hover:underline-offset-8"

    if (isExternal) {
        return (
            <a href={to} className={className}>
                {label}
            </a>
        )
    }

    return (
        <Link to={to} className={className}>
            {label}
        </Link>
    )
}

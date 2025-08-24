import { WithChildren } from "../../types"

export default function WidthLayout({ children }: WithChildren) {
    return (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">{children}</div>
    )
}

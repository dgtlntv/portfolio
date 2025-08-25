import * as React from "react"
import { Link } from "../../types"

export interface NavigationLink extends Link {
    isExternal: boolean
}

export interface ContactLink extends Link {
    icon: React.ForwardRefExoticComponent<
        React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
            title?: string
            titleId?: string
        } & React.RefAttributes<SVGSVGElement>
    >
}

export interface NavigationItemProps extends NavigationLink {
    variant: "mobile" | "desktop"
    onClose?: () => void
}

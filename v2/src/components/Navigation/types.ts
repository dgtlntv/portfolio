import * as React from "react"

export interface NavigationLink {
    to: string
    label: string
    isExternal: boolean
}

export interface ContactLink {
    to: string
    label: string
    icon: React.ForwardRefExoticComponent<
        React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
            title?: string
            titleId?: string
        } & React.RefAttributes<SVGSVGElement>
    >
}

export interface NavigationItemProps extends NavigationLink {
    variant: "mobile" | "desktop"
}

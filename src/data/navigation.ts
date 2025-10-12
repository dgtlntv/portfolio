export interface NavigationLink {
    /** The URL or path to navigate to */
    to: string
    /** The display label for the link */
    label: string
    /** Whether the link opens in a new tab */
    isExternal: boolean
}

const BASE_URL = import.meta.env.BASE_URL || "/"

export const NAVIGATION_LINKS: readonly NavigationLink[] = [
    { to: "/projects", label: "Projects", isExternal: false },
    { to: "/blog", label: "Blog", isExternal: false },
    {
        to: `${BASE_URL}onepager.pdf`.replace("//", "/"),
        label: "Onepager",
        isExternal: true,
    },
] as const

export const CONTACT_EMAIL = "mail@mblazek.xyz"

interface Stat {
    label: string
    value: string | number
}

export interface ArticleProps {
    stats: Stat[]
    heroUrl: string
    heroLocation: "center" | "start" | "end"
    title: string
    children: React.ReactNode
}

export interface ArticleTextProps {
    children: React.ReactNode
}

export interface FloatRightFigureProps {
    children: React.ReactNode
}

export interface FloatRightWrapperProps {
    children: React.ReactNode
}

interface Image {
    id: string | number
    name: string
    src: string
    alt: string
}

interface Content {
    images: Image[]
}

export interface ImageGalleryProps {
    content: Content
}

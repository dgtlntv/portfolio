import { Image, Stat, WithChildren } from "../../types"

export interface ArticleProps extends WithChildren {
    stats: Stat[]
    heroUrl: string
    heroLocation: "center" | "start" | "end"
    title: string
}

export interface ArticleTextProps extends WithChildren {}

export interface FloatRightFigureProps extends WithChildren {
    src?: string
    alt?: string
    caption?: string
}

export interface FloatRightWrapperProps extends WithChildren {}

interface Content {
    images: Image[]
}

export interface ImageWithCaption extends Image {
    caption?: string
}

// Supports both legacy format and newer, simpler format
export interface ImageGalleryProps {
    content?: Content
    images?: ImageWithCaption[]
}

import { Image, Stat, WithChildren } from "../../types"

export interface ArticleProps extends WithChildren {
    stats: Stat[]
    heroUrl: string
    heroLocation: "center" | "start" | "end"
    title: string
}

export interface ArticleTextProps extends WithChildren {}

export interface FloatRightFigureProps extends WithChildren {}

export interface FloatRightWrapperProps extends WithChildren {}

interface Content {
    images: Image[]
}

export interface ImageGalleryProps {
    content: Content
}

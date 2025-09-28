import { Image, Stat, WithChildren } from "../../types"

export interface ArticleProps extends WithChildren {
    stats: Stat[]
    heroUrl: string
    heroLocation: "center" | "start" | "end" | "cover"
    title: string
}

export interface ArticleTextProps extends WithChildren {}

export interface FloatRightFigureProps extends WithChildren {
    src?: string
    alt?: string
    caption?: string
}

export interface FloatRightWrapperProps extends WithChildren {}

export interface FloatImageProps extends WithChildren {
    src?: string
    alt?: string
    caption?: string
    direction?: "left" | "right"
}

export interface ImageWithCaption extends Image {
    caption?: string
}

export interface FanImagesProps {
    images: Array<{
        src: string
        alt?: string
    }>
    caption?: string
}

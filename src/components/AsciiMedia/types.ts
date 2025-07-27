import { CSSProperties } from "react"

export interface AsciiEffectOptions {
    resolution?: number
    color?: boolean
    alpha?: boolean
    invert?: boolean
    objectFit?: 'cover' | 'contain' | 'fill'
    textColor?: string
}

export interface AsciiEffectConfig {
    charSet: string
    fResolution: number
    iScale: number
    bColor: boolean
    bAlpha: boolean
    bBlock: boolean
    bInvert: boolean
    strResolution: string
    offsetX: number
    offsetY: number
    letterSpacingMultiplier: number
}

export type DrawableElement =
    | HTMLImageElement
    | HTMLVideoElement
    | HTMLCanvasElement

export interface AsciiImageProps {
    src: string
    alt?: string
    charSet?: string
    resolution?: number
    color?: boolean
    invert?: boolean
    className?: string
    style?: CSSProperties
    onLoad?: () => void
    objectFit?: 'cover' | 'contain' | 'fill'
    textColor?: string
}

export interface AsciiVideoProps {
    src: string
    charSet?: string
    resolution?: number
    color?: boolean
    invert?: boolean
    autoPlay?: boolean
    muted?: boolean
    loop?: boolean
    controls?: boolean
    className?: string
    style?: CSSProperties
    onLoad?: () => void
    onPlay?: () => void
    onPause?: () => void
    objectFit?: 'cover' | 'contain' | 'fill'
    textColor?: string
}

export interface AsciiMediaProps {
    src: string
    type?: "image" | "video"
    alt?: string
    charSet?: string
    resolution?: number
    color?: boolean
    invert?: boolean
    autoPlay?: boolean
    muted?: boolean
    loop?: boolean
    controls?: boolean
    className?: string
    style?: CSSProperties
    onLoad?: () => void
    onPlay?: () => void
    onPause?: () => void
    objectFit?: 'cover' | 'contain' | 'fill'
    textColor?: string
}

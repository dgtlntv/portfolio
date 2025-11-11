import imageManifest from "../data/image-manifest.json"

export interface ResponsiveVariant {
    width: number
    height?: number
    path: string
}

export interface ResponsiveFormats {
    webp: ResponsiveVariant[]
    avif: ResponsiveVariant[]
}

export interface ResponsiveManifestEntry {
    width: number
    height?: number
    formats: ResponsiveFormats
}

type ImageManifest = Record<string, ResponsiveManifestEntry>

const manifest = imageManifest as ImageManifest

export interface ResponsiveSource {
    type: string
    srcset: string
    sizes: string
}

export interface ResponsiveImageConfig {
    fallbackSrc: string
    width?: number
    height?: number
    sizes: string
    sources: ResponsiveSource[]
}

export const DEFAULT_RESPONSIVE_SIZES =
    "(max-width: 640px) 100vw, (max-width: 1280px) 75vw, 960px"

function stripQueryAndFragment(src: string): string {
    return src.replace(/[?#].*$/, "")
}

function removeImagesPrefix(src: string): string {
    if (src.startsWith("images/")) {
        return src.slice("images/".length)
    }

    const publicImagesPrefix = "public/images/"
    if (src.startsWith(publicImagesPrefix)) {
        return src.slice(publicImagesPrefix.length)
    }

    return src
}

function toManifestKey(src: string): string {
    const cleaned = stripQueryAndFragment(src).replace(/^\/+/, "")
    const withoutImages = removeImagesPrefix(cleaned)
    return withoutImages.replace(/\.(?:avif|webp|jpe?g|png)$/i, "")
}

export function getManifestEntry(
    src: string,
): ResponsiveManifestEntry | undefined {
    const key = toManifestKey(src)
    return manifest[key]
}

export function buildSrcSet(variants: ResponsiveVariant[]): string {
    return variants
        .slice()
        .sort((a, b) => a.width - b.width)
        .map(({ path, width }) => `${path} ${width}w`)
        .join(", ")
}

export function getResponsiveImageConfig(
    src: string,
    options?: {
        sizes?: string
    },
): ResponsiveImageConfig | undefined {
    const entry = getManifestEntry(src)
    const sizes = options?.sizes ?? DEFAULT_RESPONSIVE_SIZES

    if (!entry) {
        return undefined
    }

    const webpVariants = entry.formats.webp?.slice() ?? []
    const avifVariants = entry.formats.avif?.slice() ?? []

    webpVariants.sort((a, b) => a.width - b.width)
    avifVariants.sort((a, b) => a.width - b.width)

    const sources: ResponsiveSource[] = []

    if (avifVariants.length > 0) {
        sources.push({
            type: "image/avif",
            srcset: buildSrcSet(avifVariants),
            sizes,
        })
    }

    if (webpVariants.length > 0) {
        sources.push({
            type: "image/webp",
            srcset: buildSrcSet(webpVariants),
            sizes,
        })
    }

    const fallbackSrc =
        webpVariants.length > 0
            ? webpVariants[webpVariants.length - 1].path
            : src

    return {
        fallbackSrc,
        width: entry.width,
        height: entry.height,
        sizes,
        sources,
    }
}

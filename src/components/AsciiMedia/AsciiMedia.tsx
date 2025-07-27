import AsciiImage from "./AsciiImage"
import AsciiVideo from "./AsciiVideo"
import { AsciiMediaProps } from "./types"

export default function AsciiMedia(props: AsciiMediaProps) {
    const {
        src,
        type: explicitType,
        alt = "",
        onLoad,
        onPlay,
        onPause,
        objectFit,
        textColor,
        ...sharedProps
    } = props

    // Auto-detect media type from file extension if not explicitly provided
    const getMediaType = (): "image" | "video" => {
        if (explicitType) return explicitType

        const extension = src.split(".").pop()?.toLowerCase()
        const videoExtensions = [
            "mp4",
            "webm",
            "ogg",
            "avi",
            "mov",
            "wmv",
            "flv",
            "m4v",
        ]
        const imageExtensions = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "bmp",
            "webp",
            "svg",
        ]

        if (videoExtensions.includes(extension || "")) {
            return "video"
        } else if (imageExtensions.includes(extension || "")) {
            return "image"
        }

        // Default to image for unknown extensions
        return "image"
    }

    const mediaType = getMediaType()

    if (mediaType === "video") {
        return (
            <AsciiVideo
                {...sharedProps}
                src={src}
                onLoad={onLoad}
                onPlay={onPlay}
                onPause={onPause}
                objectFit={objectFit}
                textColor={textColor}
            />
        )
    } else {
        return (
            <AsciiImage {...sharedProps} src={src} alt={alt} onLoad={onLoad} objectFit={objectFit} textColor={textColor} />
        )
    }
}

import { useRef, useEffect, useState } from "react"
import { AsciiEffect } from "./AsciiEffect"
import { AsciiImageProps } from "./types"

export default function AsciiImage({
    src,
    alt = "",
    charSet = " .:-=+*#%@",
    resolution = 0.15,
    color = false,
    invert = false,
    className = "",
    style = {},
    onLoad,
}: AsciiImageProps) {
    const imageRef = useRef<HTMLImageElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const asciiEffectRef = useRef<AsciiEffect | null>(null)
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    // Initialize ASCII effect when image loads
    useEffect(() => {
        if (!imageRef.current || !isImageLoaded) return

        // Clean up existing effect
        if (asciiEffectRef.current) {
            asciiEffectRef.current.destroy()
        }

        // Create new ASCII effect
        const options = { resolution, color, invert }
        asciiEffectRef.current = new AsciiEffect(
            imageRef.current,
            charSet,
            options,
        )
        asciiEffectRef.current.render()

        // Set initial states: show ASCII, hide image
        if (imageRef.current) {
            imageRef.current.style.opacity = "0"
        }
        if (asciiEffectRef.current) {
            asciiEffectRef.current.getAsciiContainer().style.opacity = "1"
        }

        // Cleanup function
        return () => {
            if (asciiEffectRef.current) {
                asciiEffectRef.current.destroy()
                asciiEffectRef.current = null
            }
        }
    }, [src, charSet, resolution, color, invert, isImageLoaded])

    // Update effect when props change
    useEffect(() => {
        if (!asciiEffectRef.current) return

        asciiEffectRef.current.setCharacterSet(charSet)
        asciiEffectRef.current.setOptions({ resolution, color, invert })
        asciiEffectRef.current.render()
    }, [charSet, resolution, color, invert])

    const handleImageLoad = () => {
        setIsImageLoaded(true)
        onLoad?.()
    }

    const handleMouseEnter = () => {
        if (imageRef.current && asciiEffectRef.current) {
            imageRef.current.style.opacity = "1"
            asciiEffectRef.current.getAsciiContainer().style.opacity = "0"
        }
    }

    const handleMouseLeave = () => {
        if (imageRef.current && asciiEffectRef.current) {
            imageRef.current.style.opacity = "0"
            asciiEffectRef.current.getAsciiContainer().style.opacity = "1"
        }
    }

    return (
        <div
            ref={containerRef}
            className={`relative inline-block cursor-pointer ${className}`}
            style={style}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img
                ref={imageRef}
                src={src}
                alt={alt}
                className="m-0 block h-auto max-w-full border-0 p-0 align-top transition-opacity duration-[600ms] ease-in-out"
                onLoad={handleImageLoad}
            />
        </div>
    )
}

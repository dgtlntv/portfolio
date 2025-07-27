import { useRef, useEffect, useState, useCallback } from "react"
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
    objectFit = 'fill',
    textColor = 'black',
}: AsciiImageProps) {
    const imageRef = useRef<HTMLImageElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const asciiEffectRef = useRef<AsciiEffect | null>(null)
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [showingImage, setShowingImage] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    
    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Mobile scroll reveal logic
    useEffect(() => {
        if (!isMobile || !containerRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                        // Project is well in view, start timer to reveal image
                        if (timeoutRef.current) clearTimeout(timeoutRef.current)
                        timeoutRef.current = setTimeout(() => {
                            setShowingImage(true)
                        }, 1500) // 1.5 second delay
                    } else {
                        // Project scrolled out of view, hide image
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current)
                            timeoutRef.current = null
                        }
                        setShowingImage(false)
                    }
                })
            },
            { threshold: [0, 0.6, 1] }
        )

        observer.observe(containerRef.current)

        return () => {
            observer.disconnect()
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [isMobile])

    // Initialize ASCII effect when image loads
    useEffect(() => {
        if (!imageRef.current || !isImageLoaded) return

        // Clean up existing effect
        if (asciiEffectRef.current) {
            asciiEffectRef.current.destroy()
        }

        // Create new ASCII effect
        const options = { resolution, color, invert, objectFit, textColor }
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
    }, [src, charSet, resolution, color, invert, objectFit, textColor, isImageLoaded])

    // Update effect when props change
    useEffect(() => {
        if (!asciiEffectRef.current) return

        asciiEffectRef.current.setCharacterSet(charSet)
        asciiEffectRef.current.setOptions({ resolution, color, invert, objectFit, textColor })
        asciiEffectRef.current.render()
    }, [charSet, resolution, color, invert, objectFit, textColor])

    const handleImageLoad = () => {
        setIsImageLoaded(true)
        onLoad?.()
    }

    const handleMouseEnter = () => {
        if (!isMobile && imageRef.current && asciiEffectRef.current) {
            imageRef.current.style.opacity = "1"
            asciiEffectRef.current.getAsciiContainer().style.opacity = "0"
        }
    }

    const handleMouseLeave = () => {
        if (!isMobile && imageRef.current && asciiEffectRef.current) {
            imageRef.current.style.opacity = "0"
            asciiEffectRef.current.getAsciiContainer().style.opacity = "1"
        }
    }

    // Handle mobile scroll reveal state
    useEffect(() => {
        if (isMobile && imageRef.current && asciiEffectRef.current) {
            if (showingImage) {
                imageRef.current.style.opacity = "1"
                asciiEffectRef.current.getAsciiContainer().style.opacity = "0"
            } else {
                imageRef.current.style.opacity = "0"
                asciiEffectRef.current.getAsciiContainer().style.opacity = "1"
            }
        }
    }, [showingImage, isMobile])

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
                className={`w-full h-full block transition-opacity duration-[1200ms] ease-in-out m-0 p-0 border-0 align-top ${objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : 'object-fill'}`}
                onLoad={handleImageLoad}
            />
        </div>
    )
}

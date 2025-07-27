import { useRef, useEffect, useState, useCallback } from "react"
import { AsciiEffect } from "./AsciiEffect"
import { AsciiVideoProps } from "./types"

export default function AsciiVideo({
    src,
    charSet = " .:-=+*#%@",
    resolution = 0.15,
    color = false,
    invert = false,
    autoPlay = false,
    muted = true,
    loop = false,
    controls = true,
    className = "",
    style = {},
    onLoad,
    onPlay,
    onPause,
    objectFit = 'fill',
    textColor = 'black',
}: AsciiVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const asciiEffectRef = useRef<AsciiEffect | null>(null)
    const animationIdRef = useRef<number | null>(null)
    const [isVideoLoaded, setIsVideoLoaded] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)

    // Animation loop for video frames
    const renderLoop = useCallback(() => {
        if (!asciiEffectRef.current || !isPlaying) return

        asciiEffectRef.current.render()
        animationIdRef.current = requestAnimationFrame(renderLoop)
    }, [isPlaying])

    const startRenderLoop = useCallback(() => {
        if (animationIdRef.current !== null) return
        setIsPlaying(true)
    }, [])

    const stopRenderLoop = useCallback(() => {
        setIsPlaying(false)
        if (animationIdRef.current !== null) {
            cancelAnimationFrame(animationIdRef.current)
            animationIdRef.current = null
        }
    }, [])

    // Handle render loop when playing state changes
    useEffect(() => {
        if (isPlaying) {
            renderLoop()
        } else {
            stopRenderLoop()
        }
    }, [isPlaying, renderLoop, stopRenderLoop])

    // Initialize ASCII effect when video loads
    useEffect(() => {
        if (!videoRef.current || !isVideoLoaded) return

        // Clean up existing effect
        if (asciiEffectRef.current) {
            asciiEffectRef.current.destroy()
        }

        // Create new ASCII effect
        const options = { resolution, color, invert, objectFit, textColor }
        asciiEffectRef.current = new AsciiEffect(
            videoRef.current,
            charSet,
            options,
        )
        asciiEffectRef.current.render()

        // Set initial states: show ASCII, hide video
        if (videoRef.current) {
            videoRef.current.style.opacity = "0"
        }
        if (asciiEffectRef.current) {
            asciiEffectRef.current.getAsciiContainer().style.opacity = "1"
        }

        // Cleanup function
        return () => {
            stopRenderLoop()
            if (asciiEffectRef.current) {
                asciiEffectRef.current.destroy()
                asciiEffectRef.current = null
            }
        }
    }, [src, charSet, resolution, color, invert, objectFit, textColor, isVideoLoaded, stopRenderLoop])

    // Update effect when props change
    useEffect(() => {
        if (!asciiEffectRef.current) return

        asciiEffectRef.current.setCharacterSet(charSet)
        asciiEffectRef.current.setOptions({ resolution, color, invert, objectFit, textColor })
    }, [charSet, resolution, color, invert, objectFit, textColor])

    const handleVideoLoadedData = () => {
        setIsVideoLoaded(true)
        onLoad?.()
    }

    const handleVideoPlay = () => {
        startRenderLoop()
        onPlay?.()
    }

    const handleVideoPause = () => {
        stopRenderLoop()
        onPause?.()
    }

    const handleVideoEnded = () => {
        stopRenderLoop()
    }

    const handleMouseEnter = () => {
        if (videoRef.current && asciiEffectRef.current) {
            videoRef.current.style.opacity = "1"
            asciiEffectRef.current.getAsciiContainer().style.opacity = "0"
        }
    }

    const handleMouseLeave = () => {
        if (videoRef.current && asciiEffectRef.current) {
            videoRef.current.style.opacity = "0"
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
            <video
                ref={videoRef}
                src={src}
                className={`w-full h-full block transition-opacity duration-[1200ms] ease-in-out m-0 p-0 border-0 align-top ${objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : 'object-fill'}`}
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
                controls={controls}
                onLoadedData={handleVideoLoadedData}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
            />
        </div>
    )
}

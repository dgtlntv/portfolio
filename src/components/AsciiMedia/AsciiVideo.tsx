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
    const [showingVideo, setShowingVideo] = useState(false)
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
                        // Project is well in view, start timer to reveal video
                        if (timeoutRef.current) clearTimeout(timeoutRef.current)
                        timeoutRef.current = setTimeout(() => {
                            setShowingVideo(true)
                        }, 800) // 0.8 second delay
                    } else {
                        // Project scrolled out of view, hide video
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current)
                            timeoutRef.current = null
                        }
                        setShowingVideo(false)
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
            // Set platform-specific transition duration
            const duration = isMobile ? '1.8s' : '1.2s'
            asciiEffectRef.current.setTransitionDuration(duration)
        }

        // Cleanup function
        return () => {
            stopRenderLoop()
            if (asciiEffectRef.current) {
                asciiEffectRef.current.destroy()
                asciiEffectRef.current = null
            }
        }
    }, [src, charSet, resolution, color, invert, objectFit, textColor, isVideoLoaded, stopRenderLoop, isMobile])

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
        if (!isMobile && videoRef.current && asciiEffectRef.current) {
            videoRef.current.style.opacity = "1"
            asciiEffectRef.current.getAsciiContainer().style.opacity = "0"
        }
    }

    const handleMouseLeave = () => {
        if (!isMobile && videoRef.current && asciiEffectRef.current) {
            videoRef.current.style.opacity = "0"
            asciiEffectRef.current.getAsciiContainer().style.opacity = "1"
        }
    }

    // Handle mobile scroll reveal state
    useEffect(() => {
        if (isMobile && videoRef.current && asciiEffectRef.current) {
            if (showingVideo) {
                videoRef.current.style.opacity = "1"
                asciiEffectRef.current.getAsciiContainer().style.opacity = "0"
            } else {
                videoRef.current.style.opacity = "0"
                asciiEffectRef.current.getAsciiContainer().style.opacity = "1"
            }
        }
    }, [showingVideo, isMobile])



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
                className={`w-full h-full block transition-opacity ${isMobile ? 'duration-[1800ms]' : 'duration-[1200ms]'} ease-in-out m-0 p-0 border-0 align-top ${objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : 'object-fill'}`}
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

import { useCallback, useEffect, useRef, useState } from "react"
import { AsciiEffect } from "./AsciiEffect"
import { AsciiVideoProps } from "./types"

export default function AsciiVideo({
    src,
    charSet = " .:-=+*#%@",
    resolution = 0.18,
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
    objectFit = "fill",
    textColor = "black",
    darken = 1,
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
            setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
        }
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Mobile scroll reveal logic
    useEffect(() => {
        if (!isMobile || !containerRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
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
            { threshold: [0, 0.4, 0.6, 1] },
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
        if (!asciiEffectRef.current) return

        console.log('[AsciiVideo] Render loop tick', { isPlaying })
        asciiEffectRef.current.render()
        animationIdRef.current = requestAnimationFrame(renderLoop)
    }, [isPlaying])

    const startRenderLoop = useCallback(() => {
        if (animationIdRef.current !== null) return
        console.log('[AsciiVideo] Starting render loop')
        setIsPlaying(true)
        // Immediately start the render loop
        animationIdRef.current = requestAnimationFrame(renderLoop)
    }, [renderLoop])

    const stopRenderLoop = useCallback(() => {
        setIsPlaying(false)
        if (animationIdRef.current !== null) {
            cancelAnimationFrame(animationIdRef.current)
            animationIdRef.current = null
        }
    }, [])

    // Initialize ASCII effect when video loads
    useEffect(() => {
        console.log('[AsciiVideo] ASCII effect initialization check', {
            hasVideoRef: !!videoRef.current,
            isVideoLoaded,
            videoSrc: src
        })
        if (!videoRef.current || !isVideoLoaded) return

        // Clean up existing effect
        if (asciiEffectRef.current) {
            asciiEffectRef.current.destroy()
        }

        // Create new ASCII effect
        const options = {
            resolution,
            color,
            invert,
            objectFit,
            textColor,
            darken,
        }
        console.log('[AsciiVideo] Creating ASCII effect with options', options)
        asciiEffectRef.current = new AsciiEffect(
            videoRef.current,
            charSet,
            options,
        )
        console.log('[AsciiVideo] ASCII effect created, attempting first render')
        asciiEffectRef.current.render()

        // Set initial states: show ASCII, hide video
        if (videoRef.current) {
            videoRef.current.style.opacity = "0"
        }
        if (asciiEffectRef.current) {
            asciiEffectRef.current.getAsciiContainer().style.opacity = "1"
            // Set platform-specific transition duration
            const duration = isMobile ? "1.8s" : "1.2s"
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
    }, [
        src,
        charSet,
        resolution,
        color,
        invert,
        objectFit,
        textColor,
        darken,
        isVideoLoaded,
        stopRenderLoop,
        isMobile,
    ])

    // Update effect when props change
    useEffect(() => {
        if (!asciiEffectRef.current) return

        asciiEffectRef.current.setCharacterSet(charSet)
        asciiEffectRef.current.setOptions({
            resolution,
            color,
            invert,
            objectFit,
            textColor,
            darken,
        })
    }, [charSet, resolution, color, invert, objectFit, textColor, darken])

    const handleVideoLoadedData = () => {
        console.log('[AsciiVideo] Video loaded data event fired', {
            videoWidth: videoRef.current?.videoWidth,
            videoHeight: videoRef.current?.videoHeight,
            readyState: videoRef.current?.readyState,
            paused: videoRef.current?.paused
        })
        setIsVideoLoaded(true)
        
        // Check if video is actually playing (important for iOS autoplay)
        if (videoRef.current && !videoRef.current.paused) {
            startRenderLoop()
        }
        
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
                className={`block h-full w-full transition-opacity ${isMobile ? "duration-[1800ms]" : "duration-[1200ms]"} m-0 border-0 p-0 align-top ease-in-out opacity-0 ${objectFit === "cover" ? "object-cover" : objectFit === "contain" ? "object-contain" : "object-fill"}`}
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
                controls={controls}
                playsInline={true}
                webkit-playsinline="true"
                crossOrigin="anonymous"
                onLoadedData={handleVideoLoadedData}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
                onError={(e) => console.error('[AsciiVideo] Video error:', e)}
                onLoadStart={() => console.log('[AsciiVideo] Video load started')}
                onProgress={() => console.log('[AsciiVideo] Video loading progress')}
            />
        </div>
    )
}

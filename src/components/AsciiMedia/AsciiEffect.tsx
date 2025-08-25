import { AsciiEffectOptions, AsciiEffectConfig, DrawableElement } from "./types"

/**
 * Unified ASCII effect that works with any drawable HTML element (img, video, canvas)
 * Based on the Three.js AsciiEffect implementation
 */
export class AsciiEffect {
    private element: DrawableElement
    private charSet: string
    private config: AsciiEffectConfig
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private asciiContainer: HTMLDivElement
    private isInitialized: boolean = false
    private iWidth: number = 0
    private iHeight: number = 0
    private objectFit: "cover" | "contain" | "fill" = "fill"
    private textColor: string = "black"
    private darken: number = 1
    private resizeObserver: ResizeObserver | null = null
    private resizeTimeout: NodeJS.Timeout | null = null

    constructor(
        element: DrawableElement,
        charSet: string = " .:-=+*#%@",
        options: AsciiEffectOptions = {},
    ) {
        this.element = element
        this.charSet = charSet
        this.objectFit = options.objectFit || "fill"
        this.textColor = options.textColor || "black"
        this.darken = options.darken || 1

        // ASCII settings
        this.config = {
            charSet,
            fResolution: options.resolution || 0.15,
            iScale: 1,
            bColor: options.color || false,
            bAlpha: options.alpha || false,
            bBlock: false,
            bInvert: options.invert || false,
            strResolution: "low",
            offsetX: 0,
            offsetY: 0,
            letterSpacingMultiplier: 1.25,
        }

        // Create canvas for element analysis
        this.canvas = document.createElement("canvas")
        const context = this.canvas.getContext("2d", {
            willReadFrequently: true,
        })
        if (!context) {
            throw new Error("Unable to get 2D context from canvas")
        }
        this.ctx = context

        // Create ASCII overlay container
        this.asciiContainer = document.createElement("div")
        this.setupContainer()
        this.calculateFontSettings()
    }

    private setupContainer(): void {
        this.asciiContainer.style.position = "absolute"
        this.asciiContainer.style.top = "0"
        this.asciiContainer.style.left = "0"
        this.asciiContainer.style.pointerEvents = "none"
        this.asciiContainer.style.whiteSpace = "pre"
        this.asciiContainer.style.margin = "0"
        this.asciiContainer.style.padding = "0"
        this.asciiContainer.style.fontFamily = "courier new, monospace"
        this.asciiContainer.style.textAlign = "left"
        this.asciiContainer.style.textDecoration = "none"
        this.asciiContainer.style.lineHeight = "1"
        this.asciiContainer.style.overflow = "hidden"
        this.asciiContainer.style.backgroundColor = "white"
        this.asciiContainer.style.transition = "opacity 1.2s ease-in-out" // Will be updated dynamically
        this.asciiContainer.style.color = this.textColor
        this.asciiContainer.classList.add("ascii-overlay")
    }

    private calculateFontSettings(): void {
        const fFontSize = (2 / this.config.fResolution) * this.config.iScale
        const fLineHeight = (2 / this.config.fResolution) * this.config.iScale

        let fLetterSpacing = 0

        if (this.config.strResolution === "low") {
            switch (this.config.iScale) {
                case 1:
                    fLetterSpacing =
                        -fFontSize * 0.08 * this.config.letterSpacingMultiplier
                    break
                case 2:
                case 3:
                    fLetterSpacing =
                        -fFontSize * 0.16 * this.config.letterSpacingMultiplier
                    break
                case 4:
                    fLetterSpacing =
                        -fFontSize * 0.24 * this.config.letterSpacingMultiplier
                    break
                case 5:
                    fLetterSpacing =
                        -fFontSize * 0.32 * this.config.letterSpacingMultiplier
                    break
            }
        }

        this.asciiContainer.style.fontSize = fFontSize + "px"
        this.asciiContainer.style.lineHeight = fLineHeight + "px"
        this.asciiContainer.style.letterSpacing = fLetterSpacing + "px"
    }

    public init(): void {
        if (this.isInitialized) return

        // Make sure element container is positioned relative
        const elementParent = this.element.parentNode as HTMLElement
        if (
            elementParent &&
            getComputedStyle(elementParent).position === "static"
        ) {
            elementParent.style.position = "relative"
        }

        // Insert ASCII container after the element
        if (this.element.nextSibling) {
            elementParent.insertBefore(
                this.asciiContainer,
                this.element.nextSibling,
            )
        } else {
            elementParent.appendChild(this.asciiContainer)
        }

        this.setupResizeObserver()
        this.isInitialized = true
    }

    private setupResizeObserver(): void {
        // Set up ResizeObserver to watch the element for size changes
        this.resizeObserver = new ResizeObserver((entries) => {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout)
            }

            // Debounce the resize handling to avoid excessive renders
            this.resizeTimeout = setTimeout(() => {
                if (this.isElementReady()) {
                    this.render()
                }
            }, 100)
        })

        // Observe the element for size changes
        this.resizeObserver.observe(this.element)

        // Also observe the parent container in case it changes size
        const elementParent = this.element.parentNode as HTMLElement
        if (elementParent) {
            this.resizeObserver.observe(elementParent)
        }
    }

    private calculateObjectFitDimensions(): {
        renderWidth: number
        renderHeight: number
        offsetX: number
        offsetY: number
    } {
        const containerWidth = this.element.offsetWidth
        const containerHeight = this.element.offsetHeight

        let naturalWidth: number
        let naturalHeight: number

        if (this.element instanceof HTMLImageElement) {
            naturalWidth = this.element.naturalWidth
            naturalHeight = this.element.naturalHeight
        } else if (this.element instanceof HTMLVideoElement) {
            naturalWidth = this.element.videoWidth
            naturalHeight = this.element.videoHeight
        } else {
            // Canvas or unknown element - use actual dimensions
            naturalWidth = containerWidth
            naturalHeight = containerHeight
        }

        if (naturalWidth === 0 || naturalHeight === 0) {
            // Fallback to container dimensions if natural dimensions are not available
            return {
                renderWidth: containerWidth,
                renderHeight: containerHeight,
                offsetX: 0,
                offsetY: 0,
            }
        }

        const containerAspect = containerWidth / containerHeight
        const naturalAspect = naturalWidth / naturalHeight

        let renderWidth: number
        let renderHeight: number
        let offsetX = 0
        let offsetY = 0

        if (this.objectFit === "cover") {
            // For cover, the ASCII should always fill the container completely
            // The browser handles the cropping via CSS object-fit
            renderWidth = containerWidth
            renderHeight = containerHeight
            offsetX = 0
            offsetY = 0
        } else if (this.objectFit === "contain") {
            if (naturalAspect > containerAspect) {
                // Image is wider - fit to width, letterbox height
                renderWidth = containerWidth
                renderHeight = containerWidth / naturalAspect
                offsetY = (containerHeight - renderHeight) / 2
            } else {
                // Image is taller - fit to height, letterbox width
                renderHeight = containerHeight
                renderWidth = containerHeight * naturalAspect
                offsetX = (containerWidth - renderWidth) / 2
            }
        } else {
            // fill - stretch to container
            renderWidth = containerWidth
            renderHeight = containerHeight
        }

        return { renderWidth, renderHeight, offsetX, offsetY }
    }

    private updateSize(): void {
        const { renderWidth, renderHeight, offsetX, offsetY } =
            this.calculateObjectFitDimensions()

        // Ensure minimum canvas size to prevent errors
        this.iWidth = Math.max(
            1,
            Math.floor(renderWidth * this.config.fResolution),
        )
        this.iHeight = Math.max(
            1,
            Math.floor(renderHeight * this.config.fResolution),
        )

        this.canvas.width = this.iWidth
        this.canvas.height = this.iHeight

        // Get the exact position of the element relative to its parent
        const elementRect = this.element.getBoundingClientRect()
        const parentRect = (
            this.element.parentNode as HTMLElement
        ).getBoundingClientRect()

        const leftOffset =
            elementRect.left - parentRect.left + this.config.offsetX + offsetX
        const topOffset =
            elementRect.top - parentRect.top + this.config.offsetY + offsetY

        // Position ASCII container to match the visible media area
        this.asciiContainer.style.width = renderWidth + "px"
        this.asciiContainer.style.height = renderHeight + "px"
        this.asciiContainer.style.left = leftOffset + "px"
        this.asciiContainer.style.top = topOffset + "px"
    }

    private isElementReady(): boolean {
        if (this.element instanceof HTMLVideoElement) {
            // iOS needs stricter video ready checks
            return this.element.readyState >= 3 && 
                   this.element.videoWidth > 0 && 
                   this.element.videoHeight > 0
        }
        if (this.element instanceof HTMLImageElement) {
            return this.element.complete && this.element.naturalWidth > 0
        }
        // Canvas elements are always ready
        return true
    }

    public render(): void {
        if (!this.isInitialized) {
            this.init()
        }

        // Skip rendering if element isn't ready
        if (!this.isElementReady()) {
            return
        }

        this.updateSize()

        // Safety check for valid canvas dimensions
        if (this.iWidth <= 0 || this.iHeight <= 0) {
            return
        }

        // Draw element to canvas respecting object-fit
        this.ctx.clearRect(0, 0, this.iWidth, this.iHeight)

        try {
            if (this.objectFit === "fill") {
                // Simple stretch to fill canvas
                this.ctx.drawImage(this.element, 0, 0, this.iWidth, this.iHeight)
        } else {
            // For cover and contain, we need to calculate source coordinates
            const containerWidth = this.element.offsetWidth
            const containerHeight = this.element.offsetHeight

            let naturalWidth: number
            let naturalHeight: number

            if (this.element instanceof HTMLImageElement) {
                naturalWidth = this.element.naturalWidth
                naturalHeight = this.element.naturalHeight
            } else if (this.element instanceof HTMLVideoElement) {
                naturalWidth = this.element.videoWidth
                naturalHeight = this.element.videoHeight
            } else {
                naturalWidth = containerWidth
                naturalHeight = containerHeight
            }

            if (naturalWidth > 0 && naturalHeight > 0) {
                if (this.objectFit === "cover") {
                    // For cover: calculate which part of the source to use to fill the canvas
                    const containerAspect = containerWidth / containerHeight
                    const naturalAspect = naturalWidth / naturalHeight

                    if (naturalAspect > containerAspect) {
                        // Image is wider - crop sides, scale to fit height
                        const scaledWidth = naturalHeight * containerAspect
                        const sourceX = (naturalWidth - scaledWidth) / 2

                        this.ctx.drawImage(
                            this.element,
                            sourceX,
                            0,
                            scaledWidth,
                            naturalHeight,
                            0,
                            0,
                            this.iWidth,
                            this.iHeight,
                        )
                    } else {
                        // Image is taller - crop top/bottom, scale to fit width
                        const scaledHeight = naturalWidth / containerAspect
                        const sourceY = (naturalHeight - scaledHeight) / 2

                        this.ctx.drawImage(
                            this.element,
                            0,
                            sourceY,
                            naturalWidth,
                            scaledHeight,
                            0,
                            0,
                            this.iWidth,
                            this.iHeight,
                        )
                    }
                } else if (this.objectFit === "contain") {
                    // Draw the entire source image, letterboxed
                    this.ctx.drawImage(
                        this.element,
                        0,
                        0,
                        naturalWidth,
                        naturalHeight,
                        0,
                        0,
                        this.iWidth,
                        this.iHeight,
                    )
                }
            } else {
                // Fallback to simple draw if natural dimensions are not available
                this.ctx.drawImage(
                    this.element,
                    0,
                    0,
                    this.iWidth,
                    this.iHeight,
                )
            }
        }

        // Apply darkening effect if specified
        if (this.darken !== 1) {
            const imageData = this.ctx.getImageData(
                0,
                0,
                this.iWidth,
                this.iHeight,
            )
            const data = imageData.data

            for (let i = 0; i < data.length; i += 4) {
                // Apply darkening to RGB channels - multiply by darken factor
                // darken < 1 = darken, darken > 1 = brighten, darken = 1 = no change
                data[i] = Math.min(255, Math.max(0, data[i] * this.darken)) // Red
                data[i + 1] = Math.min(
                    255,
                    Math.max(0, data[i + 1] * this.darken),
                ) // Green
                data[i + 2] = Math.min(
                    255,
                    Math.max(0, data[i + 2] * this.darken),
                ) // Blue
                // Alpha channel remains unchanged
            }

            this.ctx.putImageData(imageData, 0, 0)
        }

        } catch (error) {
            // iOS/Safari may block canvas access to video elements
            console.warn('Canvas drawing failed (likely iOS security restriction):', error)
            return
        }

        // Sample colors AFTER darkening is applied
        const oImgData = this.ctx.getImageData(
            0,
            0,
            this.iWidth,
            this.iHeight,
        ).data

        let strChars = ""

        for (let y = 0; y < this.iHeight; y += 2) {
            for (let x = 0; x < this.iWidth; x++) {
                const iOffset = (y * this.iWidth + x) * 4

                const iRed = oImgData[iOffset]
                const iGreen = oImgData[iOffset + 1]
                const iBlue = oImgData[iOffset + 2]
                const iAlpha = oImgData[iOffset + 3]

                let fBrightness =
                    (0.3 * iRed + 0.59 * iGreen + 0.11 * iBlue) / 255

                if (iAlpha === 0) {
                    fBrightness = 1
                }

                let iCharIdx = Math.floor(
                    (1 - fBrightness) * (this.charSet.length - 1),
                )

                if (this.config.bInvert) {
                    iCharIdx = this.charSet.length - iCharIdx - 1
                }

                let strThisChar = this.charSet[iCharIdx]

                if (strThisChar === undefined || strThisChar === " ") {
                    strThisChar = "&nbsp;"
                }

                if (this.config.bColor) {
                    strChars +=
                        "<span style='" +
                        "color:rgb(" +
                        iRed +
                        "," +
                        iGreen +
                        "," +
                        iBlue +
                        ");" +
                        "'>" +
                        strThisChar +
                        "</span>"
                } else {
                    strChars += strThisChar
                }
            }

            strChars += "<br/>"
        }

        this.asciiContainer.innerHTML = `<div style="display:block;width:${this.element.offsetWidth}px;height:${this.element.offsetHeight}px;overflow:hidden">${strChars}</div>`
    }

    public destroy(): void {
        // Clean up resize observer
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
            this.resizeObserver = null
        }

        // Clean up resize timeout
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout)
            this.resizeTimeout = null
        }

        if (this.asciiContainer && this.asciiContainer.parentNode) {
            this.asciiContainer.parentNode.removeChild(this.asciiContainer)
        }
        this.isInitialized = false
    }

    public setCharacterSet(charSet: string): void {
        this.charSet = charSet
        this.config.charSet = charSet
    }

    public setResolution(resolution: number): void {
        this.config.fResolution = resolution
        this.calculateFontSettings()
    }

    public setOptions(options: AsciiEffectOptions): void {
        if (options.resolution !== undefined)
            this.config.fResolution = options.resolution
        if (options.color !== undefined) this.config.bColor = options.color
        if (options.invert !== undefined) this.config.bInvert = options.invert
        if (options.objectFit !== undefined) this.objectFit = options.objectFit
        if (options.textColor !== undefined) {
            this.textColor = options.textColor
            this.asciiContainer.style.color = this.textColor
        }
        if (options.darken !== undefined) this.darken = options.darken

        this.calculateFontSettings()
    }

    public getAsciiContainer(): HTMLDivElement {
        return this.asciiContainer
    }

    public setTransitionDuration(duration: string): void {
        this.asciiContainer.style.transition = `opacity ${duration} ease-in-out`
    }
}

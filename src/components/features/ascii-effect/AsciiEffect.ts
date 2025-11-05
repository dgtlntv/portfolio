/*
 * Shared ASCII conversion effect used by media and three.js integrations.
 */

export type DrawableElement =
    | HTMLImageElement
    | HTMLVideoElement
    | HTMLCanvasElement

export type AsciiObjectFit = "cover" | "contain" | "fill"

export type AsciiLayoutMode = "overlay" | "static"

type ResolutionSetting = "low" | "medium" | "high"

export interface AsciiEffectOptions {
    resolution?: number
    scale?: number
    color?: boolean
    alpha?: boolean
    block?: boolean
    invert?: boolean
    strResolution?: ResolutionSetting
    letterSpacingMultiplier?: number
    objectFit?: AsciiObjectFit
    textColor?: string
    backgroundColor?: string
    darken?: number
    offsetX?: number
    offsetY?: number
    layout?: AsciiLayoutMode
    observeResize?: boolean
    manageContainerLayout?: boolean
    containerClassName?: string
}

interface AsciiEffectConfig {
    resolution: number
    scale: number
    color: boolean
    alpha: boolean
    block: boolean
    invert: boolean
    strResolution: ResolutionSetting
    letterSpacingMultiplier: number
    objectFit: AsciiObjectFit
    textColor: string
    backgroundColor: string
    darken: number
    offsetX: number
    offsetY: number
    layout: AsciiLayoutMode
    observeResize: boolean
    manageContainerLayout: boolean
}

interface LayoutMetrics {
    renderWidth: number
    renderHeight: number
    left: number
    top: number
}

const DEFAULT_CHARSET = " .:-=+*#%@"

export class AsciiEffect {
    private readonly element: DrawableElement
    private readonly canvas: HTMLCanvasElement
    private readonly ctx: CanvasRenderingContext2D
    private readonly asciiContainer: HTMLDivElement

    private charSet: string
    private config: AsciiEffectConfig
    private containerClassName: string

    private isInitialized = false
    private sampleWidth = 0
    private sampleHeight = 0
    private resizeObserver: ResizeObserver | null = null
    private resizeTimeout: number | null = null

    constructor(
        element: DrawableElement,
        charSet: string = DEFAULT_CHARSET,
        options: AsciiEffectOptions = {},
    ) {
        this.element = element
        this.charSet = charSet.length > 0 ? charSet : DEFAULT_CHARSET
        this.config = this.normalizeOptions(options)
        this.containerClassName =
            options.containerClassName ?? "ascii-effect-container"

        this.canvas = document.createElement("canvas")
        const context = this.canvas.getContext("2d", {
            willReadFrequently: true,
        })

        if (!context) {
            throw new Error("AsciiEffect: Unable to acquire 2D context")
        }

        this.ctx = context
        this.asciiContainer = document.createElement("div")
        this.asciiContainer.className = this.containerClassName
        this.initContainerStyles()
        this.calculateFontSettings()
    }

    public init(): void {
        if (this.isInitialized) {
            return
        }

        const parent = this.element.parentElement

        if (parent && this.config.layout === "overlay") {
            const parentStyle = getComputedStyle(parent)
            if (parentStyle.position === "static") {
                parent.style.position = "relative"
            }
        }

        if (parent && !this.asciiContainer.parentNode) {
            if (this.element.nextSibling) {
                parent.insertBefore(
                    this.asciiContainer,
                    this.element.nextSibling,
                )
            } else {
                parent.appendChild(this.asciiContainer)
            }
        }

        if (
            this.config.observeResize &&
            typeof ResizeObserver !== "undefined"
        ) {
            this.setupResizeObserver()
        }

        this.isInitialized = true
    }

    public render(): string | null {
        if (!this.isInitialized) {
            this.init()
        }

        if (!this.isElementReady()) {
            return null
        }

        const metrics = this.updateLayoutMetrics()

        if (this.sampleWidth === 0 || this.sampleHeight === 0) {
            return null
        }

        this.ctx.clearRect(0, 0, this.sampleWidth, this.sampleHeight)

        try {
            if (
                this.config.objectFit === "fill" ||
                this.config.layout === "static"
            ) {
                this.ctx.drawImage(
                    this.element,
                    0,
                    0,
                    this.sampleWidth,
                    this.sampleHeight,
                )
            } else {
                this.drawWithObjectFit()
            }

            if (this.config.darken !== 1) {
                this.applyDarken()
            }
        } catch (error) {
            console.warn("AsciiEffect: canvas draw failed", error)
            return null
        }

        const ascii = this.sampleAscii()
        const width = Math.max(1, Math.round(metrics.renderWidth))
        const height = Math.max(1, Math.round(metrics.renderHeight))
        const wrapper =
            `<div style="display:block;width:${width}px;height:${height}px;overflow:hidden">` +
            `${ascii}</div>`

        this.asciiContainer.innerHTML = wrapper

        return wrapper
    }

    public destroy(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
            this.resizeObserver = null
        }

        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout)
            this.resizeTimeout = null
        }

        if (this.asciiContainer.parentNode) {
            this.asciiContainer.parentNode.removeChild(this.asciiContainer)
        }

        this.isInitialized = false
    }

    public getAsciiContainer(): HTMLDivElement {
        return this.asciiContainer
    }

    public setCharacterSet(charSet: string): void {
        this.charSet = charSet.length > 0 ? charSet : DEFAULT_CHARSET
    }

    public setResolution(resolution: number): void {
        if (!Number.isFinite(resolution) || resolution <= 0) {
            return
        }

        this.config = {
            ...this.config,
            resolution,
        }

        this.calculateFontSettings()
    }

    public setOptions(options: AsciiEffectOptions): void {
        this.config = this.normalizeOptions({
            ...this.config,
            ...options,
        })
        if (options.containerClassName) {
            this.containerClassName = options.containerClassName
            this.asciiContainer.className = options.containerClassName
        }

        this.updateContainerStyles()
        this.calculateFontSettings()
    }

    public setTransitionDuration(duration: string): void {
        this.asciiContainer.style.transition = `opacity ${duration} ease-in-out`
    }

    private normalizeOptions(
        options: AsciiEffectOptions | AsciiEffectConfig,
    ): AsciiEffectConfig {
        const layout = options.layout ?? "overlay"
        const manageContainerLayout =
            options.manageContainerLayout ?? layout !== "static"

        return {
            resolution: options.resolution ?? 0.15,
            scale: options.scale ?? 1,
            color: options.color ?? false,
            alpha: options.alpha ?? false,
            block: options.block ?? false,
            invert: options.invert ?? false,
            strResolution: options.strResolution ?? "low",
            letterSpacingMultiplier: options.letterSpacingMultiplier ?? 1.25,
            objectFit: options.objectFit ?? "fill",
            textColor: options.textColor ?? "black",
            backgroundColor: options.backgroundColor ?? "white",
            darken: options.darken ?? 1,
            offsetX: options.offsetX ?? 0,
            offsetY: options.offsetY ?? 0,
            layout,
            observeResize: options.observeResize ?? true,
            manageContainerLayout,
        }
    }

    private initContainerStyles(): void {
        const style = this.asciiContainer.style
        style.position =
            this.config.layout === "overlay" ? "absolute" : "relative"
        style.top = "0"
        style.left = "0"
        style.pointerEvents = "none"
        style.whiteSpace = "pre"
        style.margin = "0"
        style.padding = "0"
        style.fontFamily = "courier new, monospace"
        style.textAlign = "left"
        style.textDecoration = "none"
        style.lineHeight = "1"
        style.overflow = "hidden"
        style.color = this.config.textColor
        style.backgroundColor = this.config.backgroundColor
        style.transition = "opacity 1.2s ease-in-out"
    }

    private updateContainerStyles(): void {
        const style = this.asciiContainer.style
        style.position =
            this.config.layout === "overlay" ? "absolute" : "relative"
        style.color = this.config.textColor
        style.backgroundColor = this.config.backgroundColor
    }

    private calculateFontSettings(): void {
        const fontSize = (2 / this.config.resolution) * this.config.scale
        const lineHeight = (2 / this.config.resolution) * this.config.scale

        let letterSpacing = 0

        if (this.config.strResolution === "low") {
            switch (this.config.scale) {
                case 1:
                    letterSpacing =
                        -fontSize * 0.08 * this.config.letterSpacingMultiplier
                    break
                case 2:
                case 3:
                    letterSpacing =
                        -fontSize * 0.16 * this.config.letterSpacingMultiplier
                    break
                case 4:
                    letterSpacing =
                        -fontSize * 0.24 * this.config.letterSpacingMultiplier
                    break
                case 5:
                    letterSpacing =
                        -fontSize * 0.32 * this.config.letterSpacingMultiplier
                    break
            }
        } else if (this.config.strResolution === "medium") {
            switch (this.config.scale) {
                case 1:
                    letterSpacing = 0
                    break
                case 2:
                    letterSpacing =
                        -fontSize * 0.08 * this.config.letterSpacingMultiplier
                    break
                case 3:
                    letterSpacing =
                        -fontSize * 0.1 * this.config.letterSpacingMultiplier
                    break
                case 4:
                case 5:
                    letterSpacing =
                        -fontSize * 0.16 * this.config.letterSpacingMultiplier
                    break
            }
        } else if (this.config.strResolution === "high") {
            switch (this.config.scale) {
                case 1:
                case 2:
                    letterSpacing = 0
                    break
                case 3:
                case 4:
                case 5:
                    letterSpacing =
                        -fontSize * 0.08 * this.config.letterSpacingMultiplier
                    break
            }
        }

        this.asciiContainer.style.fontSize = `${fontSize}px`
        this.asciiContainer.style.lineHeight = `${lineHeight}px`
        this.asciiContainer.style.letterSpacing = `${letterSpacing}px`
    }

    private setupResizeObserver(): void {
        const observer = new ResizeObserver(() => {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout)
            }

            this.resizeTimeout = window.setTimeout(() => {
                if (this.isElementReady()) {
                    this.render()
                }
            }, 100)
        })

        observer.observe(this.element)

        if (this.config.manageContainerLayout) {
            const parent = this.element.parentElement
            if (parent) {
                observer.observe(parent)
            }
        }

        this.resizeObserver = observer
    }

    private isElementReady(): boolean {
        if (this.element instanceof HTMLVideoElement) {
            return (
                this.element.readyState >= 2 &&
                this.element.videoWidth > 0 &&
                this.element.videoHeight > 0
            )
        }

        if (this.element instanceof HTMLImageElement) {
            return this.element.complete && this.element.naturalWidth > 0
        }

        return true
    }

    private updateLayoutMetrics(): LayoutMetrics {
        const metrics = this.calculateLayoutMetrics()

        this.sampleWidth = Math.max(
            1,
            Math.floor(metrics.renderWidth * this.config.resolution),
        )
        this.sampleHeight = Math.max(
            1,
            Math.floor(metrics.renderHeight * this.config.resolution),
        )

        this.canvas.width = this.sampleWidth
        this.canvas.height = this.sampleHeight

        if (this.config.manageContainerLayout) {
            this.asciiContainer.style.width = `${metrics.renderWidth}px`
            this.asciiContainer.style.height = `${metrics.renderHeight}px`
            this.asciiContainer.style.left = `${metrics.left}px`
            this.asciiContainer.style.top = `${metrics.top}px`
        }

        return metrics
    }

    private calculateLayoutMetrics(): LayoutMetrics {
        const { offsetWidth: containerWidth, offsetHeight: containerHeight } =
            this.element

        let naturalWidth = containerWidth
        let naturalHeight = containerHeight

        if (this.element instanceof HTMLImageElement) {
            if (
                this.element.naturalWidth > 0 &&
                this.element.naturalHeight > 0
            ) {
                naturalWidth = this.element.naturalWidth
                naturalHeight = this.element.naturalHeight
            }
        } else if (this.element instanceof HTMLVideoElement) {
            if (this.element.videoWidth > 0 && this.element.videoHeight > 0) {
                naturalWidth = this.element.videoWidth
                naturalHeight = this.element.videoHeight
            }
        } else if (this.element instanceof HTMLCanvasElement) {
            naturalWidth = this.element.width || containerWidth
            naturalHeight = this.element.height || containerHeight
        }

        if (naturalWidth === 0 || naturalHeight === 0) {
            return {
                renderWidth: containerWidth,
                renderHeight: containerHeight,
                left: this.config.offsetX,
                top: this.config.offsetY,
            }
        }

        if (this.config.layout !== "overlay") {
            return {
                renderWidth: containerWidth,
                renderHeight: containerHeight,
                left: this.config.offsetX,
                top: this.config.offsetY,
            }
        }

        const parent = this.element.parentElement
        const elementRect = this.element.getBoundingClientRect()
        const parentRect = parent?.getBoundingClientRect()

        let renderWidth = containerWidth
        let renderHeight = containerHeight
        let left = this.config.offsetX
        let top = this.config.offsetY

        const containerAspect = containerWidth / containerHeight
        const naturalAspect = naturalWidth / naturalHeight

        if (this.config.objectFit === "contain") {
            if (naturalAspect > containerAspect) {
                renderWidth = containerWidth
                renderHeight = containerWidth / naturalAspect
                top += (containerHeight - renderHeight) / 2
            } else {
                renderHeight = containerHeight
                renderWidth = containerHeight * naturalAspect
                left += (containerWidth - renderWidth) / 2
            }
        }

        if (parentRect) {
            left += elementRect.left - parentRect.left
            top += elementRect.top - parentRect.top
        }

        return { renderWidth, renderHeight, left, top }
    }

    private drawWithObjectFit(): void {
        const containerWidth = this.element.offsetWidth
        const containerHeight = this.element.offsetHeight

        let naturalWidth = containerWidth
        let naturalHeight = containerHeight

        if (this.element instanceof HTMLImageElement) {
            naturalWidth = this.element.naturalWidth
            naturalHeight = this.element.naturalHeight
        } else if (this.element instanceof HTMLVideoElement) {
            naturalWidth = this.element.videoWidth
            naturalHeight = this.element.videoHeight
        } else if (this.element instanceof HTMLCanvasElement) {
            naturalWidth = this.element.width || containerWidth
            naturalHeight = this.element.height || containerHeight
        }

        if (naturalWidth <= 0 || naturalHeight <= 0) {
            this.ctx.drawImage(
                this.element,
                0,
                0,
                this.sampleWidth,
                this.sampleHeight,
            )
            return
        }

        const containerAspect = containerWidth / containerHeight
        const naturalAspect = naturalWidth / naturalHeight

        if (this.config.objectFit === "cover") {
            if (naturalAspect > containerAspect) {
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
                    this.sampleWidth,
                    this.sampleHeight,
                )
                return
            }

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
                this.sampleWidth,
                this.sampleHeight,
            )
            return
        }

        this.ctx.drawImage(
            this.element,
            0,
            0,
            naturalWidth,
            naturalHeight,
            0,
            0,
            this.sampleWidth,
            this.sampleHeight,
        )
    }

    private applyDarken(): void {
        const imageData = this.ctx.getImageData(
            0,
            0,
            this.sampleWidth,
            this.sampleHeight,
        )
        const { data } = imageData
        const factor = this.config.darken

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, data[i] * factor))
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor))
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor))
        }

        this.ctx.putImageData(imageData, 0, 0)
    }

    private sampleAscii(): string {
        const imageData = this.ctx.getImageData(
            0,
            0,
            this.sampleWidth,
            this.sampleHeight,
        ).data
        const chars: string[] = []
        const lastRow = this.sampleHeight
        const charSetLength = this.charSet.length

        for (let y = 0; y < lastRow; y += 2) {
            for (let x = 0; x < this.sampleWidth; x++) {
                const offset = (y * this.sampleWidth + x) * 4

                const r = imageData[offset]
                const g = imageData[offset + 1]
                const b = imageData[offset + 2]
                const a = imageData[offset + 3]

                let brightness = (0.3 * r + 0.59 * g + 0.11 * b) / 255

                if (a === 0) {
                    brightness = 1
                }

                let charIndex = Math.floor(
                    (1 - brightness) * (charSetLength - 1),
                )

                if (this.config.invert) {
                    charIndex = charSetLength - charIndex - 1
                }

                let char = this.charSet[charIndex] ?? "&nbsp;"

                if (char === " ") {
                    char = "&nbsp;"
                }

                if (this.config.color) {
                    const opacity = this.config.alpha ? a / 255 : 1
                    const blockStyle = this.config.block
                        ? `background-color:rgb(${r},${g},${b});`
                        : ""
                    const alphaStyle =
                        opacity !== 1 ? `opacity:${opacity};` : ""

                    chars.push(
                        `<span style="color:rgb(${r},${g},${b});${blockStyle}${alphaStyle}">${char}</span>`,
                    )
                } else {
                    chars.push(char)
                }
            }

            chars.push("<br/>")
        }

        return chars.join("")
    }
}

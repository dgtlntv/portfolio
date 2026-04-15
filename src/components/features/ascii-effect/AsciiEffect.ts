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
    /** Bias character selection towards lighter or darker chars. 0 = lighter, 0.5 = no change, 1 = darker. Default 0.5. */
    charDarkness?: number
    /** Bias color output towards lighter or darker. 0 = lighter, 0.5 = no change, 1 = darker. Default 0.5. */
    colorDarkness?: number
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
    charDarkness: number
    colorDarkness: number
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
            charDarkness: Math.max(0, Math.min(1, options.charDarkness ?? 0.5)),
            colorDarkness: Math.max(0, Math.min(1, options.colorDarkness ?? 0.5)),
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

    private static srgbToLinear(x: number): number {
        return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
    }

    private static linearToSrgb(x: number): number {
        const abs = Math.abs(x)
        if (abs <= 0.0031308) return 12.92 * x
        return Math.sign(x) * (1.055 * abs ** (1 / 2.4) - 0.055)
    }

    /**
     * Convert sRGB (0–255) to Oklab lightness (0–1).
     * OKLCH L equals Oklab L, so no polar conversion needed.
     * Uses pre-multiplied linearRGB→LMS matrix (colorjs.io srgb-linear.js × oklab.js).
     */
    private static srgbToOklabL(r: number, g: number, b: number): number {
        const lr = AsciiEffect.srgbToLinear(r / 255)
        const lg = AsciiEffect.srgbToLinear(g / 255)
        const lb = AsciiEffect.srgbToLinear(b / 255)

        const l = 0.4122214694707629 * lr + 0.5363325372617349 * lg + 0.05144599326750220 * lb
        const m = 0.2119034958178252 * lr + 0.6806995506452345 * lg + 0.1073969535369406 * lb
        const s = 0.08830245919005639 * lr + 0.2817188391361215 * lg + 0.6299787016738223 * lb

        const lc = Math.cbrt(l)
        const mc = Math.cbrt(m)
        const sc = Math.cbrt(s)

        return 0.2104542683093140 * lc + 0.7936177747023054 * mc - 0.0040720430116193 * sc
    }

    /**
     * Darken a color using Oklab, preserving hue and chroma.
     * Returns adjusted [r, g, b] values (0–255).
     * bias=0.5 → no change, bias=1 → much darker, bias=0 → much lighter.
     * Uses pre-multiplied matrices from colorjs.io source.
     */
    private adjustColorOklab(
        r: number,
        g: number,
        b: number,
        bias: number,
    ): [number, number, number] {
        const lr = AsciiEffect.srgbToLinear(r / 255)
        const lg = AsciiEffect.srgbToLinear(g / 255)
        const lb = AsciiEffect.srgbToLinear(b / 255)

        // linearRGB → LMS (pre-multiplied)
        const l = 0.4122214694707629 * lr + 0.5363325372617349 * lg + 0.05144599326750220 * lb
        const m = 0.2119034958178252 * lr + 0.6806995506452345 * lg + 0.1073969535369406 * lb
        const s = 0.08830245919005639 * lr + 0.2817188391361215 * lg + 0.6299787016738223 * lb

        // Cube root
        const lc = Math.cbrt(l)
        const mc = Math.cbrt(m)
        const sc = Math.cbrt(s)

        // cbrt(LMS) → Oklab
        let L = 0.2104542683093140 * lc + 0.7936177747023054 * mc - 0.0040720430116193 * sc
        const a = 1.9779985324311684 * lc - 2.4285922420485799 * mc + 0.4505937096174110 * sc
        const b2 = 0.0259040424655478 * lc + 0.7827717124575296 * mc - 0.8086757549230774 * sc

        // Adjust lightness
        const factor = 2 * (1 - bias)
        L = Math.max(0, Math.min(1, L * factor))

        // Oklab → cbrt(LMS)
        const lc2 = L + 0.3963377773761749 * a + 0.2158037573099136 * b2
        const mc2 = L - 0.1055613458156586 * a - 0.0638541728258133 * b2
        const sc2 = L - 0.0894841775298119 * a - 1.2914855480194092 * b2

        // Cube
        const l2 = lc2 * lc2 * lc2
        const m2 = mc2 * mc2 * mc2
        const s2 = sc2 * sc2 * sc2

        // LMS → linearRGB (pre-multiplied)
        const or = 4.076741636075960 * l2 - 3.307711539258063 * m2 + 0.2309699031821049 * s2
        const og = -1.268437973285031 * l2 + 2.609757349287688 * m2 - 0.3413193760026573 * s2
        const ob = -0.004196076138675495 * l2 - 0.7034186179359363 * m2 + 1.707614694074612 * s2

        return [
            Math.round(Math.max(0, Math.min(255, AsciiEffect.linearToSrgb(or) * 255))),
            Math.round(Math.max(0, Math.min(255, AsciiEffect.linearToSrgb(og) * 255))),
            Math.round(Math.max(0, Math.min(255, AsciiEffect.linearToSrgb(ob) * 255))),
        ]
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
        const { charDarkness, colorDarkness } = this.config
        const hasCharBias = charDarkness !== 0.5
        const charFactor = 2 * (1 - charDarkness)
        const hasColorBias = colorDarkness !== 0.5

        for (let y = 0; y < lastRow; y += 2) {
            for (let x = 0; x < this.sampleWidth; x++) {
                const offset = (y * this.sampleWidth + x) * 4

                const r = imageData[offset]
                const g = imageData[offset + 1]
                const b = imageData[offset + 2]
                const a = imageData[offset + 3]

                const isWhite = r >= 250 && g >= 250 && b >= 250

                // Use OKLCH lightness for character selection
                let brightness: number
                if (a === 0 || isWhite) {
                    brightness = 1
                } else {
                    brightness = AsciiEffect.srgbToOklabL(r, g, b)

                    // Apply char darkness bias to lightness for character selection
                    if (hasCharBias) {
                        brightness = Math.max(0, Math.min(1, brightness * charFactor))
                    }
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
                    // Adjust color lightness in Oklab, preserving hue and chroma
                    const [dr, dg, db] = hasColorBias
                        ? this.adjustColorOklab(r, g, b, colorDarkness)
                        : [r, g, b]

                    const opacity = this.config.alpha ? a / 255 : 1
                    const blockStyle = this.config.block
                        ? `background-color:rgb(${dr},${dg},${db});`
                        : ""
                    const alphaStyle =
                        opacity !== 1 ? `opacity:${opacity};` : ""

                    chars.push(
                        `<span style="color:rgb(${dr},${dg},${db});${blockStyle}${alphaStyle}">${char}</span>`,
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

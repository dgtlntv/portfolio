import type { Camera, Scene, WebGLRenderer } from "three"

type ResolutionSetting = "low" | "medium" | "high"

interface AsciiEffectOptions {
    resolution?: number
    scale?: number
    color?: boolean
    alpha?: boolean
    block?: boolean
    invert?: boolean
    strResolution?: ResolutionSetting
}

interface FontMetrics {
    fontSize: number
    lineHeight: number
    letterSpacing: number
}

const DEFAULT_MONO_CHARSET = " .,:;i1tfLCG08@"
const DEFAULT_COLOR_CHARSET = " CGO08@"

export class AsciiEffect {
    public readonly domElement: HTMLDivElement

    private readonly renderer: WebGLRenderer
    private readonly tableElement: HTMLTableElement
    private readonly sourceCanvas: HTMLCanvasElement
    private readonly canvas: HTMLCanvasElement
    private readonly context: CanvasRenderingContext2D

    private width = 0
    private height = 0
    private sampleWidth = 0
    private sampleHeight = 0

    private charList: string[]

    private readonly options: Required<AsciiEffectOptions>

    constructor(
        renderer: WebGLRenderer,
        charSet: string = DEFAULT_MONO_CHARSET,
        options: AsciiEffectOptions = {},
    ) {
        this.renderer = renderer
        this.sourceCanvas = renderer.domElement
        this.options = {
            resolution: options.resolution ?? 0.15,
            scale: options.scale ?? 1,
            color: options.color ?? false,
            alpha: options.alpha ?? false,
            block: options.block ?? false,
            invert: options.invert ?? false,
            strResolution: options.strResolution ?? "low",
        }

        const initialCharSet =
            charSet.length > 0
                ? charSet
                : this.options.color
                  ? DEFAULT_COLOR_CHARSET
                  : DEFAULT_MONO_CHARSET

        this.charList = initialCharSet.split("")

        this.domElement = document.createElement("div")
        this.domElement.style.cursor = "default"

        this.tableElement = document.createElement("table")
        this.domElement.appendChild(this.tableElement)

        this.tableElement.cellSpacing = "0"
        this.tableElement.cellPadding = "0"
        this.applyTableStyling()

        // Ensure table has at least one cell so we can style it before rendering
        if (!this.tableElement.rows.length) {
            const row = this.tableElement.insertRow()
            row.insertCell()
        }

        this.canvas = document.createElement("canvas")
        const context = this.canvas.getContext("2d", {
            willReadFrequently: true,
        })

        if (!context) {
            throw new Error("AsciiEffect: Unable to access 2D canvas context")
        }

        this.context = context
    }

    public setSize(width: number, height: number): void {
        this.width = width
        this.height = height

        this.renderer.setSize(width, height)
        this.initAsciiSize()
    }

    public render(scene: Scene, camera: Camera): void {
        if (this.sampleWidth === 0 || this.sampleHeight === 0) {
            return
        }

        this.renderer.render(scene, camera)
        this.asciify()
    }

    public setCharSet(characters: string): void {
        const nextCharSet =
            characters.length > 0
                ? characters
                : this.options.color
                  ? DEFAULT_COLOR_CHARSET
                  : DEFAULT_MONO_CHARSET

        this.charList = nextCharSet.split("")
    }

    public setResolution(resolution: number): void {
        if (Number.isNaN(resolution) || resolution <= 0) {
            return
        }

        this.options.resolution = resolution
        this.initAsciiSize()
    }

    public dispose(): void {
        this.tableElement.innerHTML = ""
        this.domElement.remove()
        this.canvas.width = 0
        this.canvas.height = 0
    }

    private initAsciiSize(): void {
        if (this.width === 0 || this.height === 0) {
            return
        }

        this.sampleWidth = Math.floor(this.width * this.options.resolution)
        this.sampleHeight = Math.floor(this.height * this.options.resolution)

        if (this.sampleWidth === 0 || this.sampleHeight === 0) {
            this.sampleWidth = 0
            this.sampleHeight = 0
            return
        }

        this.canvas.width = this.sampleWidth
        this.canvas.height = this.sampleHeight

        const cell = this.tableElement.rows[0]?.cells[0]

        if (cell && this.sourceCanvas.style.backgroundColor) {
            cell.style.backgroundColor = this.sourceCanvas.style.backgroundColor
            cell.style.color = this.sourceCanvas.style.color
        }

        const metrics = this.computeFontMetrics()
        const style = this.tableElement.style

        style.whiteSpace = "pre"
        style.margin = "0px"
        style.padding = "0px"
        style.letterSpacing = `${metrics.letterSpacing}px`
        style.fontFamily = "courier new, monospace"
        style.fontSize = `${metrics.fontSize}px`
        style.lineHeight = `${metrics.lineHeight}px`
        style.textAlign = "left"
        style.textDecoration = "none"
    }

    private applyTableStyling(): void {
        const style = this.tableElement.style
        style.whiteSpace = "pre"
        style.margin = "0"
        style.padding = "0"
        style.textAlign = "left"
        style.textDecoration = "none"
    }

    private computeFontMetrics(): FontMetrics {
        const fontSize = (2 / this.options.resolution) * this.options.scale
        const lineHeight = (2 / this.options.resolution) * this.options.scale

        let letterSpacing = 0

        if (this.options.strResolution === "low") {
            switch (this.options.scale) {
                case 1:
                    letterSpacing = -1
                    break
                case 2:
                case 3:
                    letterSpacing = -2.1
                    break
                case 4:
                    letterSpacing = -3.1
                    break
                case 5:
                    letterSpacing = -4.15
                    break
                default:
                    letterSpacing = -2.1
                    break
            }
        }

        if (this.options.strResolution === "medium") {
            switch (this.options.scale) {
                case 1:
                    letterSpacing = 0
                    break
                case 2:
                    letterSpacing = -1
                    break
                case 3:
                    letterSpacing = -1.04
                    break
                case 4:
                case 5:
                    letterSpacing = -2.1
                    break
                default:
                    letterSpacing = -1
                    break
            }
        }

        if (this.options.strResolution === "high") {
            switch (this.options.scale) {
                case 1:
                case 2:
                    letterSpacing = 0
                    break
                case 3:
                case 4:
                case 5:
                    letterSpacing = -1
                    break
                default:
                    letterSpacing = -1
                    break
            }
        }

        return {
            fontSize,
            lineHeight,
            letterSpacing,
        }
    }

    private asciify(): void {
        if (this.sampleWidth === 0 || this.sampleHeight === 0) {
            return
        }

        this.context.clearRect(0, 0, this.sampleWidth, this.sampleHeight)
        this.context.drawImage(
            this.sourceCanvas,
            0,
            0,
            this.sampleWidth,
            this.sampleHeight,
        )

        const imageData = this.context.getImageData(
            0,
            0,
            this.sampleWidth,
            this.sampleHeight,
        )
        const data = imageData.data

        let asciiOutput = ""

        for (let y = 0; y < this.sampleHeight; y += 2) {
            for (let x = 0; x < this.sampleWidth; x += 1) {
                const offset = (y * this.sampleWidth + x) * 4

                const red = data[offset]
                const green = data[offset + 1]
                const blue = data[offset + 2]
                const alpha = data[offset + 3]

                let brightness = (0.3 * red + 0.59 * green + 0.11 * blue) / 255

                if (alpha === 0) {
                    brightness = 1
                }

                let charIndex = Math.floor(
                    (1 - brightness) * (this.charList.length - 1),
                )

                if (this.options.invert) {
                    charIndex = this.charList.length - charIndex - 1
                }

                let character = this.charList[charIndex]

                if (!character || character === " ") {
                    character = "&nbsp;"
                }

                if (this.options.color) {
                    const opacity = this.options.alpha ? alpha / 255 : 1
                    const blockStyle = this.options.block
                        ? `background-color:rgb(${red},${green},${blue});`
                        : ""

                    asciiOutput +=
                        `<span style="color:rgb(${red},${green},${blue});${blockStyle}` +
                        (opacity !== 1 ? `opacity:${opacity};` : "") +
                        `">${character}</span>`
                } else {
                    asciiOutput += character
                }
            }

            asciiOutput += "<br/>"
        }

        this.tableElement.innerHTML = `<tr><td style="display:block;width:${this.width}px;height:${this.height}px;overflow:hidden">${asciiOutput}</td></tr>`
    }
}

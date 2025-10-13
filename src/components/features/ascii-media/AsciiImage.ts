import { LitElement, html, css } from "lit"
import { customElement, property, state, query } from "lit/decorators.js"
import { AsciiEffect } from "./AsciiEffect"

@customElement("ascii-image")
export class AsciiImage extends LitElement {
    @property({ type: String }) src = ""
    @property({ type: String }) alt = ""
    @property({ type: String }) charSet = " .:-=+*#%@"
    @property({ type: Number }) resolution = 0.18
    @property({ type: Boolean }) color = false
    @property({ type: Boolean }) invert = false
    @property({ type: String }) objectFit: "cover" | "contain" | "fill" = "fill"
    @property({ type: String }) textColor = "black"
    @property({ type: Number }) darken = 1

    @state() private isImageLoaded = false
    @state() private showingImage = false
    @state() private isMobile = false

    @query("img") private imageElement!: HTMLImageElement
    @query(".container") private containerElement!: HTMLDivElement

    private asciiEffect: AsciiEffect | null = null
    private resizeHandler: (() => void) | null = null
    private intersectionObserver: IntersectionObserver | null = null
    private revealTimeout: number | null = null

    static styles = css`
        :host {
            display: block;
            height: 100%;
            width: 100%;
        }

        .container {
            position: relative;
            display: block;
            height: 100%;
            width: 100%;
            cursor: pointer;
        }

        img {
            display: block;
            height: 100%;
            width: 100%;
            margin: 0;
            border: 0;
            padding: 0;
            vertical-align: top;
            opacity: 0;
            transition: opacity 1.2s ease-in-out;
        }

        img.mobile {
            transition: opacity 1.8s ease-in-out;
        }

        img.cover {
            object-fit: cover;
        }

        img.contain {
            object-fit: contain;
        }

        img.fill {
            object-fit: fill;
        }
    `

    connectedCallback() {
        super.connectedCallback()
        this.checkMobile()
        this.resizeHandler = () => this.checkMobile()
        window.addEventListener("resize", this.resizeHandler)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        if (this.resizeHandler) {
            window.removeEventListener("resize", this.resizeHandler)
        }
        this.cleanupAsciiEffect()
        this.cleanupIntersectionObserver()
        if (this.revealTimeout !== null) {
            clearTimeout(this.revealTimeout)
        }
    }

    firstUpdated() {
        if (this.isMobile) {
            this.setupIntersectionObserver()
        }
    }

    updated(changedProperties: Map<string, any>) {
        if (changedProperties.has("src")) {
            this.isImageLoaded = false
            this.showingImage = false
            this.cleanupAsciiEffect()
        }

        if (this.isImageLoaded && this.asciiEffect) {
            let shouldRender = false

            if (
                changedProperties.has("charSet") ||
                changedProperties.has("resolution") ||
                changedProperties.has("color") ||
                changedProperties.has("invert") ||
                changedProperties.has("objectFit") ||
                changedProperties.has("textColor") ||
                changedProperties.has("darken")
            ) {
                this.asciiEffect.setCharacterSet(this.charSet)
                this.asciiEffect.setOptions({
                    resolution: this.resolution,
                    color: this.color,
                    invert: this.invert,
                    objectFit: this.objectFit,
                    textColor: this.textColor,
                    darken: this.darken,
                })
                shouldRender = true
            }

            if (shouldRender) {
                this.asciiEffect.render()
            }
        }

        if (changedProperties.has("isMobile")) {
            if (this.isMobile) {
                this.setupIntersectionObserver()
            } else {
                this.cleanupIntersectionObserver()
            }

            if (this.asciiEffect) {
                const duration = this.isMobile ? "1.8s" : "1.2s"
                this.asciiEffect.setTransitionDuration(duration)
            }
        }

        if (changedProperties.has("showingImage")) {
            this.updateVisibility()
        }
    }

    private checkMobile() {
        this.isMobile = window.innerWidth < 768 || "ontouchstart" in window
    }

    private setupIntersectionObserver() {
        this.cleanupIntersectionObserver()

        if (!this.containerElement) return

        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                        if (this.revealTimeout !== null) {
                            clearTimeout(this.revealTimeout)
                        }
                        this.revealTimeout = window.setTimeout(() => {
                            this.showingImage = true
                        }, 800)
                    } else {
                        if (this.revealTimeout !== null) {
                            clearTimeout(this.revealTimeout)
                            this.revealTimeout = null
                        }
                        this.showingImage = false
                    }
                })
            },
            { threshold: [0, 0.6, 1] },
        )

        this.intersectionObserver.observe(this.containerElement)
    }

    private cleanupIntersectionObserver() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect()
            this.intersectionObserver = null
        }
    }

    private cleanupAsciiEffect() {
        if (this.asciiEffect) {
            this.asciiEffect.destroy()
            this.asciiEffect = null
        }
    }

    private handleImageLoad() {
        this.isImageLoaded = true

        if (!this.imageElement) return

        this.cleanupAsciiEffect()

        const options = {
            resolution: this.resolution,
            color: this.color,
            invert: this.invert,
            objectFit: this.objectFit,
            textColor: this.textColor,
            darken: this.darken,
        }

        this.asciiEffect = new AsciiEffect(
            this.imageElement,
            this.charSet,
            options,
        )
        this.asciiEffect.render()

        this.imageElement.style.opacity = "0"
        if (this.asciiEffect) {
            this.asciiEffect.getAsciiContainer().style.opacity = "1"
            const duration = this.isMobile ? "1.8s" : "1.2s"
            this.asciiEffect.setTransitionDuration(duration)
        }

        this.dispatchEvent(new CustomEvent("load"))
    }

    private handleMouseEnter() {
        if (!this.isMobile && this.imageElement && this.asciiEffect) {
            this.imageElement.style.opacity = "1"
            this.asciiEffect.getAsciiContainer().style.opacity = "0"
        }
    }

    private handleMouseLeave() {
        if (!this.isMobile && this.imageElement && this.asciiEffect) {
            this.imageElement.style.opacity = "0"
            this.asciiEffect.getAsciiContainer().style.opacity = "1"
        }
    }

    private updateVisibility() {
        if (this.isMobile && this.imageElement && this.asciiEffect) {
            if (this.showingImage) {
                this.imageElement.style.opacity = "1"
                this.asciiEffect.getAsciiContainer().style.opacity = "0"
            } else {
                this.imageElement.style.opacity = "0"
                this.asciiEffect.getAsciiContainer().style.opacity = "1"
            }
        }
    }

    render() {
        const imageClasses = [this.isMobile ? "mobile" : "", this.objectFit]
            .filter(Boolean)
            .join(" ")

        return html`
            <div
                class="container"
                @mouseenter=${this.handleMouseEnter}
                @mouseleave=${this.handleMouseLeave}
            >
                <img
                    src=${this.src}
                    alt=${this.alt}
                    class=${imageClasses}
                    @load=${this.handleImageLoad}
                />
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ascii-image": AsciiImage
    }
}

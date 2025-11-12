import type { CSSResultGroup, PropertyValues } from "lit"
import { LitElement, css, html } from "lit"
import { customElement, property, query, state } from "lit/decorators.js"
import {
    AsciiEffect,
    type AsciiEffectOptions,
    type AsciiObjectFit,
} from "../ascii-effect/AsciiEffect"

@customElement("ascii-image")
export class AsciiImage extends LitElement {
    @property({ type: String }) src = ""
    @property({ type: String }) alt = ""
    @property({ type: String }) charSet = " .:-=+*#%@"
    @property({ type: Number }) resolution = 0.18
    @property({ type: Boolean }) color = false
    @property({ type: Boolean }) invert = false
    @property({ type: String }) objectFit: AsciiObjectFit = "fill"
    @property({ type: String }) textColor = "black"
    @property({ type: Number }) darken = 1
    @property({ type: String, attribute: "link-href" }) linkHref = ""

    @state() protected isImageLoaded = false
    @state() protected showingImage = false
    @state() protected isMobile = false

    @query("img") private imageElement!: HTMLImageElement
    @query(".container") private containerElement!: HTMLDivElement

    private asciiEffect: AsciiEffect | null = null
    private resizeHandler: (() => void) | null = null
    private intersectionObserver: IntersectionObserver | null = null
    private revealTimeout: number | null = null

    static override styles: CSSResultGroup = css`
        :host {
            display: block;
            height: 100%;
            width: 100%;
        }

        a.link-wrapper {
            display: block;
            height: 100%;
            width: 100%;
            text-decoration: none;
            color: inherit;
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

    private static readonly MOBILE_BREAKPOINT = 768
    private static readonly INTERSECTION_THRESHOLD = [0, 0.6, 1] as const

    connectedCallback(): void {
        super.connectedCallback()
        this.checkMobile()
        if (typeof window !== "undefined") {
            this.resizeHandler = () => this.checkMobile()
            window.addEventListener("resize", this.resizeHandler)
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()
        if (this.resizeHandler && typeof window !== "undefined") {
            window.removeEventListener("resize", this.resizeHandler)
        }
        this.cleanupAsciiEffect()
        this.cleanupIntersectionObserver()
        if (this.revealTimeout !== null) {
            clearTimeout(this.revealTimeout)
        }
    }

    firstUpdated(_changedProperties: PropertyValues<this>): void {
        if (this.isMobile) {
            this.setupIntersectionObserver()
        }
    }

    updated(changedProperties: PropertyValues<this>): void {
        if (changedProperties.has("src")) {
            this.isImageLoaded = false
            this.showingImage = false
            this.cleanupAsciiEffect()
        }

        if (this.isImageLoaded && this.asciiEffect) {
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
                this.asciiEffect.render()
            }
        }

        const isMobileChanged = changedProperties.has("isMobile" as never)
        if (isMobileChanged) {
            if (this.isMobile) {
                this.setupIntersectionObserver()
            } else {
                this.cleanupIntersectionObserver()
            }

            if (this.asciiEffect) {
                this.updateAsciiTransition()
            }
        }

        const showingImageChanged = changedProperties.has(
            "showingImage" as never,
        )
        if (showingImageChanged) {
            this.updateVisibility()
        }
    }

    private checkMobile(): void {
        if (typeof window === "undefined") {
            this.isMobile = false
            return
        }

        this.isMobile =
            window.innerWidth < AsciiImage.MOBILE_BREAKPOINT ||
            "ontouchstart" in window
    }

    private setupIntersectionObserver(): void {
        this.cleanupIntersectionObserver()

        if (!this.containerElement) return
        if (typeof window === "undefined") return
        if (!("IntersectionObserver" in window)) return

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
            { threshold: [...AsciiImage.INTERSECTION_THRESHOLD] },
        )

        this.intersectionObserver.observe(this.containerElement)
    }

    private cleanupIntersectionObserver(): void {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect()
            this.intersectionObserver = null
        }
    }

    private cleanupAsciiEffect(): void {
        if (this.asciiEffect) {
            this.asciiEffect.destroy()
            this.asciiEffect = null
        }
    }

    private handleImageLoad(): void {
        this.isImageLoaded = true

        if (!this.imageElement) return

        this.cleanupAsciiEffect()

        const options: AsciiEffectOptions = {
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
        this.updateAsciiTransition()
        this.asciiEffect?.getAsciiContainer().style.setProperty("opacity", "1")

        this.dispatchEvent(new CustomEvent("load"))
    }

    private handleMouseEnter(): void {
        if (!this.isMobile && this.imageElement && this.asciiEffect) {
            this.imageElement.style.opacity = "1"
            this.asciiEffect.getAsciiContainer().style.opacity = "0"
        }
    }

    private handleMouseLeave(): void {
        if (!this.isMobile && this.imageElement && this.asciiEffect) {
            this.imageElement.style.opacity = "0"
            this.asciiEffect.getAsciiContainer().style.opacity = "1"
        }
    }

    private updateVisibility(): void {
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

    private updateAsciiTransition(): void {
        if (!this.asciiEffect) {
            return
        }

        const duration = this.isMobile ? "1.8s" : "1.2s"
        this.asciiEffect.setTransitionDuration(duration)
    }

    render() {
        const imageClasses = [this.isMobile ? "mobile" : "", this.objectFit]
            .filter(Boolean)
            .join(" ")

        const content = html`
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

        if (this.linkHref) {
            return html`
                <a
                    class="link-wrapper"
                    href=${this.linkHref}
                    data-astro-router="client"
                >
                    ${content}
                </a>
            `
        }

        return content
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ascii-image": AsciiImage
    }
}

import type { CSSResultGroup, PropertyValues } from "lit"
import { LitElement, css, html } from "lit"
import { customElement, property, query, state } from "lit/decorators.js"
import {
    AsciiEffect,
    type AsciiEffectOptions,
    type AsciiObjectFit,
} from "../ascii-effect/AsciiEffect"

@customElement("ascii-video")
export class AsciiVideo extends LitElement {
    @property({ type: String }) src = ""
    @property({ type: String }) charSet = " .:-=+*#%@"
    @property({ type: Number }) resolution = 0.18
    @property({ type: Boolean }) color = false
    @property({ type: Boolean }) invert = false
    @property({ type: String }) objectFit: AsciiObjectFit = "fill"
    @property({ type: String }) textColor = "black"
    @property({ type: Number }) charDarkness = 0.5
    @property({ type: Number }) colorDarkness = 0.5
    @property({ type: String, attribute: "link-href" }) linkHref = ""

    @state() protected isVideoLoaded = false
    @state() protected isPlaying = false
    @state() protected showingVideo = false
    @state() protected isMobile = false

    @query("video") private videoElement!: HTMLVideoElement
    @query(".container") private containerElement!: HTMLDivElement

    private asciiEffect: AsciiEffect | null = null
    private animationId: number | null = null
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

        video {
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

        video.mobile {
            transition: opacity 1.8s ease-in-out;
        }

        video.cover {
            object-fit: cover;
        }

        video.contain {
            object-fit: contain;
        }

        video.fill {
            object-fit: fill;
        }
    `

    private static readonly MOBILE_BREAKPOINT = 768
    private static readonly INTERSECTION_THRESHOLD = [0, 0.4, 0.6, 1] as const

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
        this.stopRenderLoop()
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
            this.isVideoLoaded = false
            this.showingVideo = false
            this.stopRenderLoop()
            this.cleanupAsciiEffect()
        }

        if (this.isVideoLoaded && this.asciiEffect) {
            if (
                changedProperties.has("charSet") ||
                changedProperties.has("resolution") ||
                changedProperties.has("color") ||
                changedProperties.has("invert") ||
                changedProperties.has("objectFit") ||
                changedProperties.has("textColor") ||
                changedProperties.has("charDarkness") ||
                changedProperties.has("colorDarkness")
            ) {
                this.asciiEffect.setCharacterSet(this.charSet)
                this.asciiEffect.setOptions({
                    resolution: this.resolution,
                    color: this.color,
                    invert: this.invert,
                    objectFit: this.objectFit,
                    textColor: this.textColor,
                    charDarkness: this.charDarkness,
                    colorDarkness: this.colorDarkness,
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

        const showingVideoChanged = changedProperties.has(
            "showingVideo" as never,
        )
        if (showingVideoChanged) {
            this.updateVisibility()
        }
    }

    private checkMobile(): void {
        if (typeof window === "undefined") {
            this.isMobile = false
            return
        }

        this.isMobile =
            window.innerWidth < AsciiVideo.MOBILE_BREAKPOINT ||
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
                            this.showingVideo = true
                        }, 800)
                    } else {
                        if (this.revealTimeout !== null) {
                            clearTimeout(this.revealTimeout)
                            this.revealTimeout = null
                        }
                        this.showingVideo = false
                    }
                })
            },
            { threshold: [...AsciiVideo.INTERSECTION_THRESHOLD] },
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

    private renderLoop = (): void => {
        if (!this.asciiEffect) return

        this.asciiEffect.render()
        this.animationId = requestAnimationFrame(this.renderLoop)
    }

    private startRenderLoop(): void {
        if (this.animationId !== null) return
        this.isPlaying = true
        this.animationId = requestAnimationFrame(this.renderLoop)
    }

    private stopRenderLoop(): void {
        this.isPlaying = false
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId)
            this.animationId = null
        }
    }

    private handleVideoLoadedData(): void {
        this.isVideoLoaded = true

        if (!this.videoElement) return

        this.cleanupAsciiEffect()

        const options: AsciiEffectOptions = {
            resolution: this.resolution,
            color: this.color,
            invert: this.invert,
            objectFit: this.objectFit,
            textColor: this.textColor,
            charDarkness: this.charDarkness,
                    colorDarkness: this.colorDarkness,
        }

        this.asciiEffect = new AsciiEffect(
            this.videoElement,
            this.charSet,
            options,
        )
        this.asciiEffect.render()

        this.videoElement.style.opacity = "0"
        this.updateAsciiTransition()
        this.asciiEffect?.getAsciiContainer().style.setProperty("opacity", "1")

        this.dispatchEvent(new CustomEvent("load"))
    }

    private handleVideoPlay(): void {
        this.startRenderLoop()
        this.dispatchEvent(new CustomEvent("play"))
    }

    private handleVideoPause(): void {
        this.stopRenderLoop()
        this.dispatchEvent(new CustomEvent("pause"))
    }

    private handleVideoEnded(): void {
        this.stopRenderLoop()
    }

    private handleVideoError(e: Event): void {
        console.error("[AsciiVideo] Video error:", e)
    }

    private handleMouseEnter(): void {
        if (!this.isMobile && this.videoElement && this.asciiEffect) {
            this.videoElement.style.opacity = "1"
            this.asciiEffect.getAsciiContainer().style.opacity = "0"
        }
    }

    private handleMouseLeave(): void {
        if (!this.isMobile && this.videoElement && this.asciiEffect) {
            this.videoElement.style.opacity = "0"
            this.asciiEffect.getAsciiContainer().style.opacity = "1"
        }
    }

    private updateVisibility(): void {
        if (this.isMobile && this.videoElement && this.asciiEffect) {
            if (this.showingVideo) {
                this.videoElement.style.opacity = "1"
                this.asciiEffect.getAsciiContainer().style.opacity = "0"
            } else {
                this.videoElement.style.opacity = "0"
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
        const videoClasses = [this.isMobile ? "mobile" : "", this.objectFit]
            .filter(Boolean)
            .join(" ")

        const content = html`
            <div
                class="container"
                @mouseenter=${this.handleMouseEnter}
                @mouseleave=${this.handleMouseLeave}
            >
                <video
                    src=${this.src}
                    class=${videoClasses}
                    autoplay
                    muted
                    loop
                    playsinline
                    webkit-playsinline
                    crossorigin="anonymous"
                    @loadeddata=${this.handleVideoLoadedData}
                    @play=${this.handleVideoPlay}
                    @pause=${this.handleVideoPause}
                    @ended=${this.handleVideoEnded}
                    @error=${this.handleVideoError}
                ></video>
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
        "ascii-video": AsciiVideo
    }
}

import { LitElement, html, css } from "lit"
import { customElement, property, state, query } from "lit/decorators.js"
import { AsciiEffect } from "./AsciiEffect"

@customElement("ascii-video")
export class AsciiVideo extends LitElement {
    @property({ type: String }) src = ""
    @property({ type: String }) charSet = " .:-=+*#%@"
    @property({ type: Number }) resolution = 0.18
    @property({ type: Boolean }) color = false
    @property({ type: Boolean }) invert = false
    @property({ type: String }) objectFit: "cover" | "contain" | "fill" = "fill"
    @property({ type: String }) textColor = "black"
    @property({ type: Number }) darken = 1

    @state() private isVideoLoaded = false
    @state() private isPlaying = false
    @state() private showingVideo = false
    @state() private isMobile = false

    @query("video") private videoElement!: HTMLVideoElement
    @query(".container") private containerElement!: HTMLDivElement

    private asciiEffect: AsciiEffect | null = null
    private animationId: number | null = null
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
        this.stopRenderLoop()
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

        if (changedProperties.has("showingVideo")) {
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
            { threshold: [0, 0.4, 0.6, 1] },
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

    private renderLoop = () => {
        if (!this.asciiEffect) return

        this.asciiEffect.render()
        this.animationId = requestAnimationFrame(this.renderLoop)
    }

    private startRenderLoop() {
        if (this.animationId !== null) return
        this.isPlaying = true
        this.animationId = requestAnimationFrame(this.renderLoop)
    }

    private stopRenderLoop() {
        this.isPlaying = false
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId)
            this.animationId = null
        }
    }

    private handleVideoLoadedData() {
        this.isVideoLoaded = true

        if (!this.videoElement) return

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
            this.videoElement,
            this.charSet,
            options,
        )
        this.asciiEffect.render()

        this.videoElement.style.opacity = "0"
        if (this.asciiEffect) {
            this.asciiEffect.getAsciiContainer().style.opacity = "1"
            const duration = this.isMobile ? "1.8s" : "1.2s"
            this.asciiEffect.setTransitionDuration(duration)
        }

        this.dispatchEvent(new CustomEvent("load"))
    }

    private handleVideoPlay() {
        this.startRenderLoop()
        this.dispatchEvent(new CustomEvent("play"))
    }

    private handleVideoPause() {
        this.stopRenderLoop()
        this.dispatchEvent(new CustomEvent("pause"))
    }

    private handleVideoEnded() {
        this.stopRenderLoop()
    }

    private handleVideoError(e: Event) {
        console.error("[AsciiVideo] Video error:", e)
    }

    private handleMouseEnter() {
        if (!this.isMobile && this.videoElement && this.asciiEffect) {
            this.videoElement.style.opacity = "1"
            this.asciiEffect.getAsciiContainer().style.opacity = "0"
        }
    }

    private handleMouseLeave() {
        if (!this.isMobile && this.videoElement && this.asciiEffect) {
            this.videoElement.style.opacity = "0"
            this.asciiEffect.getAsciiContainer().style.opacity = "1"
        }
    }

    private updateVisibility() {
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

    render() {
        const videoClasses = [this.isMobile ? "mobile" : "", this.objectFit]
            .filter(Boolean)
            .join(" ")

        return html`
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
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ascii-video": AsciiVideo
    }
}

import { LitElement, html, css } from "lit"
import { customElement, property } from "lit/decorators.js"
import "./AsciiImage"
import "./AsciiVideo"

@customElement("ascii-media")
export class AsciiMedia extends LitElement {
    @property({ type: String }) src = ""
    @property({ type: String }) type?: "image" | "video"
    @property({ type: String }) alt = ""
    @property({ type: String }) charSet = " .:-=+*#%@"
    @property({ type: Number }) resolution = 0.18
    @property({ type: Boolean }) color = false
    @property({ type: Boolean }) invert = false
    @property({ type: String }) objectFit: "cover" | "contain" | "fill" = "fill"
    @property({ type: String }) textColor = "black"
    @property({ type: Number }) darken = 1

    static styles = css`
        :host {
            display: block;
            height: 100%;
            width: 100%;
        }
    `

    // Auto-detect media type from file extension if not explicitly provided
    private getMediaType(): "image" | "video" {
        if (this.type) return this.type

        const extension = this.src.split(".").pop()?.toLowerCase()
        const videoExtensions = [
            "mp4",
            "webm",
            "ogg",
            "avi",
            "mov",
            "wmv",
            "flv",
            "m4v",
        ]
        const imageExtensions = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "bmp",
            "webp",
            "svg",
        ]

        if (videoExtensions.includes(extension || "")) {
            return "video"
        } else if (imageExtensions.includes(extension || "")) {
            return "image"
        }

        // Default to image for unknown extensions
        return "image"
    }

    private handleLoad() {
        this.dispatchEvent(new CustomEvent("load"))
    }

    private handlePlay() {
        this.dispatchEvent(new CustomEvent("play"))
    }

    private handlePause() {
        this.dispatchEvent(new CustomEvent("pause"))
    }

    render() {
        const mediaType = this.getMediaType()

        if (mediaType === "video") {
            return html`
                <ascii-video
                    src=${this.src}
                    charSet=${this.charSet}
                    resolution=${this.resolution}
                    ?color=${this.color}
                    ?invert=${this.invert}
                    objectFit=${this.objectFit}
                    textColor=${this.textColor}
                    darken=${this.darken}
                    @load=${this.handleLoad}
                    @play=${this.handlePlay}
                    @pause=${this.handlePause}
                ></ascii-video>
            `
        } else {
            return html`
                <ascii-image
                    src=${this.src}
                    alt=${this.alt}
                    charSet=${this.charSet}
                    resolution=${this.resolution}
                    ?color=${this.color}
                    ?invert=${this.invert}
                    objectFit=${this.objectFit}
                    textColor=${this.textColor}
                    darken=${this.darken}
                    @load=${this.handleLoad}
                ></ascii-image>
            `
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ascii-media": AsciiMedia
    }
}

import type { CSSResultGroup } from "lit"
import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import type { AsciiObjectFit } from "../ascii-effect/AsciiEffect"
import "./AsciiImage"
import "./AsciiVideo"

type MediaType = "image" | "video"

@customElement("ascii-media")
export class AsciiMedia extends LitElement {
    @property({ type: String }) src = ""
    @property({ type: String }) type?: MediaType
    @property({ type: String }) alt = ""
    @property({ type: String }) charSet = " .:-=+*#%@"
    @property({ type: Number }) resolution = 0.18
    @property({ type: Boolean }) color = false
    @property({ type: Boolean }) invert = false
    @property({ type: String }) objectFit: AsciiObjectFit = "fill"
    @property({ type: String }) textColor = "black"
    @property({ type: Number }) charDarkness = 0.5
    @property({ type: Number }) colorDarkness = 0.5
    @property({ type: String, attribute: "link-href" }) linkHref = ""

    static override styles: CSSResultGroup = css`
        :host {
            display: block;
            height: 100%;
            width: 100%;
        }
    `

    private static readonly VIDEO_EXTENSIONS = new Set([
        "mp4",
        "webm",
        "ogg",
        "avi",
        "mov",
        "wmv",
        "flv",
        "m4v",
    ])

    private static readonly IMAGE_EXTENSIONS = new Set([
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
        "svg",
    ])

    // Auto-detect media type from file extension if not explicitly provided
    private getMediaType(): MediaType {
        if (this.type) return this.type

        const extension = this.src.split(".").pop()?.toLowerCase() ?? ""

        if (AsciiMedia.VIDEO_EXTENSIONS.has(extension)) {
            return "video"
        }

        if (AsciiMedia.IMAGE_EXTENSIONS.has(extension)) {
            return "image"
        }

        return "image"
    }

    private handleLoad(): void {
        this.dispatchEvent(new CustomEvent("load"))
    }

    private handlePlay(): void {
        this.dispatchEvent(new CustomEvent("play"))
    }

    private handlePause(): void {
        this.dispatchEvent(new CustomEvent("pause"))
    }

    render() {
        const mediaType = this.getMediaType()

        if (mediaType === "video") {
            return html`
                <ascii-video
                    .src=${this.src}
                    .charSet=${this.charSet}
                    .resolution=${this.resolution}
                    .color=${this.color}
                    .invert=${this.invert}
                    .objectFit=${this.objectFit}
                    .textColor=${this.textColor}
                    .charDarkness=${this.charDarkness}
                    .colorDarkness=${this.colorDarkness}
                    .linkHref=${this.linkHref}
                    @load=${this.handleLoad}
                    @play=${this.handlePlay}
                    @pause=${this.handlePause}
                ></ascii-video>
            `
        } else {
            return html`
                <ascii-image
                    .src=${this.src}
                    .alt=${this.alt}
                    .charSet=${this.charSet}
                    .resolution=${this.resolution}
                    .color=${this.color}
                    .invert=${this.invert}
                    .objectFit=${this.objectFit}
                    .textColor=${this.textColor}
                    .charDarkness=${this.charDarkness}
                    .colorDarkness=${this.colorDarkness}
                    .linkHref=${this.linkHref}
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

import { LitElement, css, html, nothing, type PropertyValues } from "lit"
import { property, queryAll, state } from "lit/decorators.js"
import { classMap } from "lit/directives/class-map.js"
import { webComponentStyleSheet } from "../../../styles/webComponentStyleSheet.js"
import {
    DEFAULT_RESPONSIVE_SIZES,
    getResponsiveImageConfig,
} from "../../../utils/responsive-image"

interface ImageWithCaption {
    id: string | number
    src: string
    alt: string
    name?: string
    caption?: string
}

type LoadingSetting = "lazy" | "eager"
type DecodingSetting = "async" | "auto" | "sync"
type FetchPrioritySetting = "high" | "low" | "auto"

interface ResponsiveRenderOptions {
    sizes?: string
    className?: string
    pictureClass?: string
    loading?: LoadingSetting
    decoding?: DecodingSetting
    alt?: string
    fetchpriority?: FetchPrioritySetting
}

const MAIN_IMAGE_SIZES =
    "(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 960px"
const THUMBNAIL_SIZES = "(max-width: 768px) 22vw, 160px"

class ImageGallery extends LitElement {
    static styles = [
        webComponentStyleSheet,
        css`
            :host {
                display: block;
            }

            /* Hide panels that aren't selected */
            .tab-panel[aria-hidden="true"] {
                display: none;
            }
        `,
    ]

    @property({ type: Array })
    images: ImageWithCaption[] = []

    @state()
    private selectedIndex = 0

    @queryAll('button[role="tab"]')
    private tabs!: NodeListOf<HTMLButtonElement>

    private handleGlobalKeyDown = (event: KeyboardEvent): void => {
        // Only handle if the component or one of its children has focus
        if (!this.contains(event.target as Node) && event.target !== this) {
            return
        }

        let newIndex = this.selectedIndex

        switch (event.key) {
            case "ArrowLeft":
            case "ArrowUp":
                event.preventDefault()
                newIndex = this.selectedIndex - 1
                // Wrap around to last if at first
                if (newIndex < 0) {
                    newIndex = this.images.length - 1
                }
                break
            case "ArrowRight":
            case "ArrowDown":
                event.preventDefault()
                newIndex = this.selectedIndex + 1
                // Wrap around to first if at last
                if (newIndex >= this.images.length) {
                    newIndex = 0
                }
                break
            case "Home":
                event.preventDefault()
                newIndex = 0
                break
            case "End":
                event.preventDefault()
                newIndex = this.images.length - 1
                break
            default:
                return // Don't handle other keys
        }

        this.selectedIndex = newIndex

        // Focus the corresponding tab button
        if (this.tabs[newIndex]) {
            this.tabs[newIndex].focus()
        }
    }

    connectedCallback(): void {
        super.connectedCallback()
        // Make the component focusable
        if (!this.hasAttribute("tabindex")) {
            this.setAttribute("tabindex", "0")
        }

        // Add keyboard event listener to the component itself
        this.addEventListener("keydown", this.handleGlobalKeyDown)
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()
        this.removeEventListener("keydown", this.handleGlobalKeyDown)
    }

    protected willUpdate(changedProperties: PropertyValues<this>): void {
        // Reset selected index if it's out of bounds
        if (
            changedProperties.has("images") &&
            this.selectedIndex >= this.images.length
        ) {
            this.selectedIndex = 0
        }
    }

    private handleTabClick(index: number): void {
        this.selectedIndex = index
    }

    private handleTabKeyDown(event: KeyboardEvent, index: number): void {
        // Only handle space and enter locally, let the global handler manage arrows
        if (event.key === " " || event.key === "Enter") {
            event.preventDefault()
            event.stopPropagation()
            this.selectedIndex = index
        }
    }

    private renderResponsivePicture(
        image: ImageWithCaption,
        options: ResponsiveRenderOptions = {},
    ) {
        const {
            sizes = DEFAULT_RESPONSIVE_SIZES,
            className = "",
            pictureClass = "",
            loading = "lazy",
            decoding = "async",
            alt = image.alt,
            fetchpriority,
        } = options

        const config = getResponsiveImageConfig(image.src, { sizes })
        const sources = config?.sources ?? []
        const fallbackSrc = config?.fallbackSrc ?? image.src
        const hasSources = sources.length > 0
        const width = config?.width
        const height = config?.height
        const fallbackSizes = hasSources ? nothing : sizes
        const resolvedFetchPriority =
            fetchpriority ?? (loading === "eager" ? "high" : undefined)

        return html`
            <picture class=${pictureClass}>
                ${sources.map(
                    (source) => html`
                        <source
                            type=${source.type}
                            srcset=${source.srcset}
                            sizes=${source.sizes}
                        />
                    `,
                )}
                <img
                    src=${fallbackSrc}
                    alt=${alt ?? ""}
                    class=${className}
                    loading=${loading}
                    decoding=${decoding}
                    width=${width ?? nothing}
                    height=${height ?? nothing}
                    sizes=${fallbackSizes}
                    fetchpriority=${resolvedFetchPriority ?? nothing}
                />
            </picture>
        `
    }

    render() {
        if (!this.images.length) {
            return nothing
        }

        return html`
            <div class="not-prose my-8 flex flex-col-reverse">
                <!-- Image selector -->
                <div
                    class="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none"
                >
                    <div
                        class="grid grid-cols-4 gap-6"
                        role="tablist"
                        aria-orientation="horizontal"
                    >
                        ${this.images.map(
                            (image, index) => html`
                                <button
                                    role="tab"
                                    aria-selected="${this.selectedIndex ===
                                    index}"
                                    aria-controls="panel-${index}"
                                    tabindex="${this.selectedIndex === index
                                        ? "0"
                                        : "-1"}"
                                    class="focus:ring-opacity-50 relative flex aspect-[1/1.4142] cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 focus:ring focus:ring-offset-4 focus:outline-none"
                                    @click="${() => this.handleTabClick(index)}"
                                    @keydown="${(e: KeyboardEvent) =>
                                        this.handleTabKeyDown(e, index)}"
                                >
                                    <span class="sr-only">
                                        ${image.name || image.alt}
                                    </span>
                                    <span
                                        class="absolute inset-0 overflow-hidden rounded-md"
                                    >
                                        ${this.renderResponsivePicture(image, {
                                            sizes: THUMBNAIL_SIZES,
                                            className:
                                                "h-full w-full object-cover object-center p-2",
                                            pictureClass: "block h-full w-full",
                                            alt: "",
                                            loading: "lazy",
                                        })}
                                    </span>
                                    <span
                                        class="${classMap({
                                            "ring-red-500":
                                                this.selectedIndex === index,
                                            "ring-transparent":
                                                this.selectedIndex !== index,
                                            "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2":
                                                true,
                                        })}"
                                        aria-hidden="true"
                                    ></span>
                                </button>
                            `,
                        )}
                    </div>
                </div>

                <!-- Tab panels -->
                <div class="aspect-w-1 aspect-h-2 w-full">
                    ${this.images.map(
                        (image, index) => html`
                            <div
                                id="panel-${index}"
                                role="tabpanel"
                                aria-labelledby="tab-${index}"
                                aria-hidden="${this.selectedIndex !== index}"
                                class="tab-panel"
                            >
                                <figure>
                                    ${this.renderResponsivePicture(image, {
                                        sizes: MAIN_IMAGE_SIZES,
                                        className:
                                            "h-full w-full object-cover object-center sm:rounded-lg",
                                        pictureClass: "block h-full w-full",
                                        loading:
                                            this.selectedIndex === index
                                                ? "eager"
                                                : "lazy",
                                        decoding: "async",
                                    })}
                                    ${image.caption
                                        ? html`
                                              <figcaption
                                                  class="mt-2 text-center text-sm text-gray-500"
                                              >
                                                  ${image.caption}
                                              </figcaption>
                                          `
                                        : nothing}
                                </figure>
                            </div>
                        `,
                    )}
                </div>
            </div>
        `
    }
}

customElements.define("image-gallery", ImageGallery)

declare global {
    interface HTMLElementTagNameMap {
        "image-gallery": ImageGallery
    }
}

export { ImageGallery }

import { LitElement, html, css, nothing } from "lit"
import { property, state } from "lit/decorators.js"
import { ref } from "lit/directives/ref.js"
import { globalStyleSheet } from "../../styles/styleSheet.js"

interface ImageWithCaption {
    id: string | number
    src: string
    alt: string
    name?: string
    caption?: string
}

class ImageGallery extends LitElement {
    static styles = [
        globalStyleSheet,
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

    @property({ type: String })
    images: string = "[]"

    @state()
    private selectedIndex: number = 0

    @state()
    private parsedImages: ImageWithCaption[] = []

    private tabs: HTMLButtonElement[] = []
    private panels: HTMLDivElement[] = []

    connectedCallback() {
        super.connectedCallback()
        this.parseImages()
        // Make the component focusable
        if (!this.hasAttribute("tabindex")) {
            this.setAttribute("tabindex", "0")
        }

        // Add keyboard event listener to the component itself
        this.addEventListener("keydown", this.handleGlobalKeyDown.bind(this))
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener("keydown", this.handleGlobalKeyDown.bind(this))
    }

    private handleGlobalKeyDown(event: KeyboardEvent) {
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
                    newIndex = this.parsedImages.length - 1
                }
                break
            case "ArrowRight":
            case "ArrowDown":
                event.preventDefault()
                newIndex = this.selectedIndex + 1
                // Wrap around to first if at last
                if (newIndex >= this.parsedImages.length) {
                    newIndex = 0
                }
                break
            case "Home":
                event.preventDefault()
                newIndex = 0
                break
            case "End":
                event.preventDefault()
                newIndex = this.parsedImages.length - 1
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

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        if (changedProperties.has("images")) {
            this.parseImages()
        }
    }

    private parseImages() {
        try {
            this.parsedImages = JSON.parse(this.images) as ImageWithCaption[]
            if (this.selectedIndex >= this.parsedImages.length) {
                this.selectedIndex = 0
            }
        } catch (e) {
            console.error("Failed to parse images JSON:", e)
            this.parsedImages = []
        }
    }

    private classNames(...classes: (string | false | undefined)[]): string {
        return classes.filter(Boolean).join(" ")
    }

    private handleTabClick(index: number) {
        this.selectedIndex = index
    }

    private handleTabKeyDown(event: KeyboardEvent, index: number) {
        // Only handle space and enter locally, let the global handler manage arrows
        if (event.key === " " || event.key === "Enter") {
            event.preventDefault()
            event.stopPropagation()
            this.selectedIndex = index
            return
        }
    }

    private updateTabsRef(el: Element | undefined, index: number) {
        if (el && el instanceof HTMLButtonElement) {
            this.tabs[index] = el
        }
    }

    private updatePanelRef(el: Element | undefined, index: number) {
        if (el && el instanceof HTMLDivElement) {
            this.panels[index] = el
        }
    }

    render() {
        if (!this.parsedImages.length) {
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
                        ${this.parsedImages.map(
                            (image, index) => html`
                                <button
                                    ${ref((el?: Element) =>
                                        this.updateTabsRef(el, index),
                                    )}
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
                                        <img
                                            src="${image.src}"
                                            alt=""
                                            class="h-full w-full object-cover object-center p-2"
                                        />
                                    </span>
                                    <span
                                        class="${this.classNames(
                                            this.selectedIndex === index
                                                ? "ring-red-500"
                                                : "ring-transparent",
                                            "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2",
                                        )}"
                                        aria-hidden="true"
                                    ></span>
                                </button>
                            `,
                        )}
                    </div>
                </div>

                <!-- Tab panels -->
                <div class="aspect-w-1 aspect-h-2 w-full">
                    ${this.parsedImages.map(
                        (image, index) => html`
                            <div
                                ${ref((el?: Element) =>
                                    this.updatePanelRef(el, index),
                                )}
                                id="panel-${index}"
                                role="tabpanel"
                                aria-labelledby="tab-${index}"
                                tabindex="${this.selectedIndex === index
                                    ? "0"
                                    : "-1"}"
                                aria-hidden="${this.selectedIndex !== index}"
                                class="tab-panel"
                            >
                                <figure>
                                    <img
                                        src="${image.src}"
                                        alt="${image.alt}"
                                        class="h-full w-full object-cover object-center sm:rounded-lg"
                                    />
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

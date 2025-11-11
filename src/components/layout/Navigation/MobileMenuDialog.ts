import { LitElement, css, html, type PropertyValues } from "lit"
import { property } from "lit/decorators.js"
import { webComponentStyleSheet } from "../../../styles/webComponentStyleSheet.js"

/**
 * MobileMenuDialog - A modal dialog component for mobile navigation
 *
 * @fires mobile-menu-opened - Dispatched when the menu opens
 * @fires mobile-menu-closed - Dispatched when the menu closes
 *
 * @slot default - The menu content (navigation items)
 */
export class MobileMenuDialog extends LitElement {
    static styles = [
        webComponentStyleSheet,
        css`
            :host {
                display: block;
            }

            dialog {
                animation-duration: 200ms;
                animation-timing-function: ease-out;
                animation-fill-mode: both;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-10px);
                }
            }

            dialog[data-state="opening"] {
                animation-name: slideDown;
            }

            dialog[data-state="closing"] {
                animation-name: slideUp;
            }

            /* Backdrop styling */
            dialog::backdrop {
                background-color: rgba(0, 0, 0, 0.5);
                animation: fadeIn 200ms ease-out;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        `,
    ]

    @property({ type: Boolean, reflect: true })
    isOpen = false

    private _dialog: HTMLDialogElement | null = null
    private _animationTimeout: number | null = null
    private _isAnimating = false

    firstUpdated(): void {
        this._dialog = this.shadowRoot?.querySelector("dialog") ?? null

        // Set up close button event listener from light DOM
        const closeButton = this.querySelector("#mobile-menu-close")
        closeButton?.addEventListener("click", this._handleCloseButtonClick)

        // Close menu after navigation item is clicked
        this.addEventListener("click", this._handleNavigationClick)

        // Handle backdrop clicks
        this._dialog?.addEventListener("click", this._handleBackdropClick)
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()

        const closeButton = this.querySelector("#mobile-menu-close")
        if (closeButton) {
            closeButton.removeEventListener(
                "click",
                this._handleCloseButtonClick,
            )
        }

        this.removeEventListener("click", this._handleNavigationClick)

        if (this._dialog) {
            this._dialog.removeEventListener("click", this._handleBackdropClick)
        }

        if (this._animationTimeout !== null) {
            clearTimeout(this._animationTimeout)
        }
    }

    protected updated(changedProperties: PropertyValues): void {
        if (changedProperties.has("isOpen")) {
            if (this.isOpen) {
                this._openDialog()
            } else {
                this._closeDialog()
            }
        }
    }

    private _handleCloseButtonClick = (): void => {
        this.close()
    }

    private _handleBackdropClick = (e: MouseEvent): void => {
        if (e.target === this._dialog) {
            this.close()
        }
    }

    private _handleNavigationClick = (e: Event): void => {
        const target = e.target as HTMLElement
        if (target.closest("a[href]") && this._dialog?.open) {
            // Small delay to allow the click to register before closing
            setTimeout(() => this.close(), 150)
        }
    }

    private _stopPropagation = (e: Event): void => {
        e.stopPropagation()
    }

    private _openDialog(): void {
        if (!this._dialog || this._isAnimating) return

        this._isAnimating = true
        this._dialog.showModal()
        this._dialog.dataset.state = "opening"

        // Prevent body scroll when modal is open
        document.body.style.overflow = "hidden"

        this.dispatchEvent(
            new CustomEvent("mobile-menu-opened", {
                bubbles: true,
                composed: true,
            }),
        )

        this._animationTimeout = window.setTimeout(() => {
            if (this._dialog) {
                delete this._dialog.dataset.state
            }
            this._isAnimating = false
        }, 200)
    }

    private _closeDialog(): void {
        if (!this._dialog || !this._dialog.open || this._isAnimating) return

        this._isAnimating = true
        this._dialog.dataset.state = "closing"

        this._animationTimeout = window.setTimeout(() => {
            this._dialog?.close()
            if (this._dialog) {
                delete this._dialog.dataset.state
            }

            // Re-enable body scroll
            document.body.style.overflow = ""

            this._isAnimating = false

            this.dispatchEvent(
                new CustomEvent("mobile-menu-closed", {
                    bubbles: true,
                    composed: true,
                }),
            )
        }, 200)
    }

    render() {
        return html`
            <dialog
                class="fixed top-2 right-2 left-2 m-0 w-auto max-w-none rounded-md border border-black bg-white p-0 shadow-lg"
                aria-label="Mobile navigation menu"
            >
                <div
                    class="border-t-2 border-b-2 border-gray-100"
                    @click=${this._stopPropagation}
                >
                    <slot></slot>
                </div>
            </dialog>
        `
    }

    /**
     * Opens the mobile menu dialog
     */
    open(): void {
        this.isOpen = true
    }

    /**
     * Closes the mobile menu dialog
     */
    close(): void {
        this.isOpen = false
    }
}

// Define the custom element
customElements.define("mobile-menu-dialog", MobileMenuDialog)

// Type augmentation for TypeScript
declare global {
    interface HTMLElementTagNameMap {
        "mobile-menu-dialog": MobileMenuDialog
    }
}

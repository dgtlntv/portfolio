import { LitElement, html, css } from "lit"
import { globalStyleSheet } from "../../styles/styleSheet.js"

class DevicePermissionModal extends LitElement {
    static styles = [
        globalStyleSheet,
        css`
            .backdrop\\:bg-black\\/50::backdrop {
                background-color: rgb(0 0 0 / 0.5);
            }
        `,
    ]

    private _dialog: HTMLDialogElement | null = null

    firstUpdated(): void {
        // Cache the dialog reference
        this._dialog = this.shadowRoot?.querySelector("dialog") ?? null
        
        if (this._dialog) {
            this._dialog.addEventListener("click", this.handleBackdropClick)
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()
        if (this._dialog) {
            this._dialog.removeEventListener("click", this.handleBackdropClick)
        }
    }

    private handleBackdropClick = (event: MouseEvent): void => {
        if (event.target === this._dialog) {
            this.handleDeny()
        }
    }

    private stopPropagation = (event: Event): void => {
        event.stopPropagation()
    }

    private handleAllow = async (): Promise<void> => {
        try {
            const status = await (DeviceOrientationEvent as any).requestPermission()
            this.close()
            this.dispatchEvent(new CustomEvent('permission-result', { 
                detail: status,
                bubbles: true 
            }))
        } catch (error) {
            console.error("Permission request failed:", error)
            this.close()
            this.dispatchEvent(new CustomEvent('permission-result', { 
                detail: 'denied',
                bubbles: true 
            }))
        }
    }

    private handleDeny = (): void => {
        this.close()
        this.dispatchEvent(new CustomEvent('permission-result', { 
            detail: 'denied',
            bubbles: true 
        }))
    }

    render() {
        return html`
            <dialog class="backdrop:bg-black/50">
                <div
                    class="fixed bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 transform transition-transform duration-300 ease-out"
                    @click=${this.stopPropagation}
                >
                    <div class="mx-auto w-full max-w-lg rounded-t-xl bg-white p-6 shadow-xl">
                        <div class="text-center">
                            <h3 class="font-fancy text-lg leading-6 font-medium text-gray-900">
                                Device Orientation Permission
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">
                                    For the cover of my portfolio website, I would like to
                                    access the orientation sensor of your smartphone to
                                    animate a 3D scene. To do this, you need to give
                                    permission to access these sensors.
                                </p>
                            </div>
                        </div>
                        <div class="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                class="font-fancy inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none"
                                @click=${this.handleDeny}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                class="font-fancy inline-flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none"
                                @click=${this.handleAllow}
                            >
                                Grant Permission
                            </button>
                        </div>
                    </div>
                </div>
            </dialog>
        `
    }

    open(): void {
        if (this._dialog) {
            this._dialog.showModal()
        }
    }

    close(): void {
        if (this._dialog) {
            this._dialog.close()
        }
    }
}

customElements.define("device-permission-modal", DevicePermissionModal)

declare global {
    interface HTMLElementTagNameMap {
        "device-permission-modal": DevicePermissionModal
    }
}

export { DevicePermissionModal }
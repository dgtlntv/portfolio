import type { CSSResultGroup, TemplateResult } from "lit"
import { LitElement, css, html } from "lit"
import { customElement, query } from "lit/decorators.js"
import { webComponentStyleSheet } from "../../../styles/webComponentStyleSheet.js"

export const MODAL_TAG_NAME = "device-permission-modal" as const

type DeviceOrientationPermissionStatus = "granted" | "denied"

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<DeviceOrientationPermissionStatus>
}

@customElement(MODAL_TAG_NAME)
export class DevicePermissionModal extends LitElement {
    static override styles: CSSResultGroup = [
        webComponentStyleSheet,
        css`
            .backdrop\\:bg-black\\/50::backdrop {
                background-color: rgb(0 0 0 / 0.5);
            }
        `,
    ]

    @query("dialog")
    private readonly dialogElement?: HTMLDialogElement

    private handleBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.handleDeny()
        }
    }

    private stopPropagation(event: Event): void {
        event.stopPropagation()
    }

    private dispatchPermissionResult(
        status: DeviceOrientationPermissionStatus,
    ): void {
        this.dispatchEvent(
            new CustomEvent<DeviceOrientationPermissionStatus>(
                "permission-result",
                {
                    detail: status,
                    bubbles: true,
                    composed: true,
                },
            ),
        )
    }

    private async requestDeviceOrientationPermission(): Promise<DeviceOrientationPermissionStatus> {
        const orientationEvent =
            (globalThis.DeviceOrientationEvent as
                | DeviceOrientationEventWithPermission
                | undefined) ?? undefined

        if (
            !orientationEvent ||
            typeof orientationEvent.requestPermission !== "function"
        ) {
            // Non-iOS platforms don't require explicit permission via this API
            return "granted"
        }

        try {
            const status = await orientationEvent.requestPermission()
            return status === "granted" ? "granted" : "denied"
        } catch (error) {
            console.error(
                "Device orientation permission request failed:",
                error,
            )
            return "denied"
        }
    }

    private async handleAllow(): Promise<void> {
        const status = await this.requestDeviceOrientationPermission()
        this.close()
        this.dispatchPermissionResult(status)
    }

    private handleDeny(): void {
        this.close()
        this.dispatchPermissionResult("denied")
    }

    render(): TemplateResult {
        return html`
            <dialog
                class="backdrop:bg-black/50"
                @click=${this.handleBackdropClick}
            >
                <div
                    class="fixed bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 transform transition-transform duration-300 ease-out"
                    @click=${this.stopPropagation}
                >
                    <div
                        class="mx-auto w-full max-w-lg rounded-t-xl bg-white p-6 shadow-xl"
                    >
                        <div class="text-center">
                            <h3
                                class="font-fancy text-lg leading-6 font-medium text-gray-900"
                            >
                                Device Orientation Permission
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">
                                    For the cover of my portfolio website, I
                                    would like to access the orientation sensor
                                    of your smartphone to animate a 3D scene. To
                                    do this, you need to give permission to
                                    access these sensors.
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
        const dialog = this.dialogElement
        if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
            dialog.showModal()
        }
    }

    close(): void {
        const dialog = this.dialogElement
        if (dialog?.open) {
            dialog.close()
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [MODAL_TAG_NAME]: DevicePermissionModal
    }
}

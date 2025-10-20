import {
    MODAL_TAG_NAME,
    DevicePermissionModal,
} from "../components/features/three-scene/DevicePermissionModal.js"

/**
 * Permission states for device orientation/motion access
 */
export type PermissionState = "granted" | "denied" | "prompt"

/**
 * iOS 13+ adds a static requestPermission method to DeviceOrientationEvent
 * that's not in the standard TypeScript DOM types
 */
interface DeviceOrientationEventConstructor {
    new (
        type: string,
        eventInitDict?: DeviceOrientationEventInit,
    ): DeviceOrientationEvent
    prototype: DeviceOrientationEvent
    requestPermission?: () => Promise<PermissionState>
}

const PERMISSION_TIMEOUT_MS = 30000 // 30 seconds

/**
 * Checks if device orientation/motion permissions are already granted
 * using the Permissions API
 *
 * @returns A promise that resolves to:
 *          - "granted" if both accelerometer and gyroscope permissions are granted
 *          - The current permission state if not granted
 *          - null if the Permissions API is not available or the check fails
 */
async function checkExistingPermissions(): Promise<PermissionState | null> {
    if (!navigator.permissions) {
        return null
    }

    try {
        const [accelerometerPermission, gyroscopePermission] =
            await Promise.all([
                navigator.permissions.query({
                    name: "accelerometer" as PermissionName,
                }),
                navigator.permissions.query({
                    name: "gyroscope" as PermissionName,
                }),
            ])

        if (
            accelerometerPermission.state === "granted" &&
            gyroscopePermission.state === "granted"
        ) {
            return "granted"
        }

        return accelerometerPermission.state as PermissionState
    } catch (error) {
        console.warn(
            "Failed to check existing permissions via Permissions API:",
            error,
        )
        return null
    }
}

/**
 * Attempts to request permission directly using iOS 13+ API
 *
 * @returns A promise that resolves to:
 *          - The permission state ("granted" or "denied") if iOS API is available
 *          - null if the API is not available or the request fails
 */
async function requestPermissionDirectly(): Promise<PermissionState | null> {
    const DeviceOrientationEventIOS =
        DeviceOrientationEvent as unknown as DeviceOrientationEventConstructor

    if (typeof DeviceOrientationEventIOS.requestPermission !== "function") {
        return null
    }

    try {
        const status = await DeviceOrientationEventIOS.requestPermission()
        return status
    } catch (error) {
        console.warn(
            "Failed to request permission via DeviceOrientationEvent.requestPermission:",
            error,
        )
        return null
    }
}

/**
 * Gets or creates the device permission modal element
 *
 * @returns The device permission modal element, either existing or newly created
 */
function getOrCreateModal(): DevicePermissionModal {
    let modal = document.querySelector(
        MODAL_TAG_NAME,
    ) as DevicePermissionModal | null

    if (!modal) {
        modal = document.createElement(MODAL_TAG_NAME) as DevicePermissionModal
        document.body.appendChild(modal)
    }

    return modal
}

/**
 * Requests permission via custom modal UI
 * Uses a timeout to prevent hanging if the modal never responds
 *
 * @returns A promise that resolves to the permission state from the modal
 * @throws {Error} If the modal fails to load or times out after 30 seconds
 */
async function requestPermissionViaModal(): Promise<PermissionState> {
    return new Promise((resolve, reject) => {
        const modal = getOrCreateModal()
        let timeoutId: number | undefined
        let resolved = false

        const cleanup = () => {
            if (timeoutId !== undefined) {
                window.clearTimeout(timeoutId)
            }
            modal.removeEventListener("permission-result", handleResult)
        }

        const handleResult = (event: Event) => {
            if (resolved) return
            resolved = true
            cleanup()
            const customEvent = event as CustomEvent<PermissionState>
            resolve(customEvent.detail)
        }

        const handleTimeout = () => {
            if (resolved) return
            resolved = true
            cleanup()
            reject(
                new Error(
                    `Permission request timed out after ${PERMISSION_TIMEOUT_MS}ms`,
                ),
            )
        }

        timeoutId = window.setTimeout(handleTimeout, PERMISSION_TIMEOUT_MS)

        modal.addEventListener("permission-result", handleResult)

        if (customElements.get(MODAL_TAG_NAME)) {
            requestAnimationFrame(() => {
                modal.open()
            })
        } else {
            customElements
                .whenDefined(MODAL_TAG_NAME)
                .then(() => {
                    requestAnimationFrame(() => {
                        modal.open()
                    })
                })
                .catch((error) => {
                    cleanup()
                    reject(
                        new Error(
                            `Failed to load modal component: ${error.message}`,
                        ),
                    )
                })
        }
    })
}

/**
 * Requests device orientation and motion permission from the user.
 *
 * This function implements a fallback strategy:
 * 1. First checks if permissions are already granted (Permissions API)
 * 2. Then tries direct permission request (iOS 13+ API)
 * 3. Finally falls back to custom modal UI if direct request fails
 *
 * @returns A promise that resolves to the permission state:
 *          - "granted": User allowed access to device sensors
 *          - "denied": User denied access
 *          - "prompt": Permission request failed or was cancelled
 *
 * @example
 * const permission = await requestDevicePermission();
 * if (permission === "granted") {
 *   // Start listening to device orientation events
 * }
 */
export async function requestDevicePermission(): Promise<PermissionState> {
    // Strategy 1: Check existing permissions via Permissions API
    const existingPermission = await checkExistingPermissions()
    if (existingPermission === "granted") {
        return "granted"
    }

    // Strategy 2: Try direct iOS API request
    const directPermission = await requestPermissionDirectly()
    if (directPermission !== null) {
        return directPermission
    }

    // Strategy 3: Fall back to custom modal UI
    try {
        const modalPermission = await requestPermissionViaModal()
        return modalPermission
    } catch (error) {
        console.error("Failed to request permission via modal:", error)
        return "prompt"
    }
}

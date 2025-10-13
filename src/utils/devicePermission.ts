import type { DevicePermissionModal } from "../components/features/three-scene/DevicePermissionModal.js"

export async function requestDevicePermission(): Promise<PermissionState> {
    if (navigator.permissions) {
        try {
            const [accelerometerPermission, gyroscopePermission] = await Promise.all([
                navigator.permissions.query({
                    name: "accelerometer" as PermissionName,
                }),
                navigator.permissions.query({
                    name: "gyroscope" as PermissionName,
                }),
            ])

            // Check if both permissions are granted
            if (
                accelerometerPermission.state === "granted" &&
                gyroscopePermission.state === "granted"
            ) {
                return "granted"
            }
            return accelerometerPermission.state as PermissionState
        } catch {
            // Fall through to the next method if this fails
        }
    }

    try {
        // Try direct request first
        const status = await (DeviceOrientationEvent as any).requestPermission()
        return status
    } catch {
        // If direct request fails, show modal
        return new Promise((resolve) => {
            // Find or create modal
            let modal = document.querySelector('device-permission-modal') as DevicePermissionModal

            if (!modal) {
                modal = document.createElement('device-permission-modal') as DevicePermissionModal
                document.body.appendChild(modal)
            }

            // Listen for result
            const handleResult = (event: CustomEvent) => {
                modal.removeEventListener('permission-result', handleResult as EventListener)
                resolve(event.detail as PermissionState)
            }

            modal.addEventListener('permission-result', handleResult as EventListener)
            
            // Wait for the next frame to ensure element is rendered before opening
            requestAnimationFrame(() => {
                modal.open()
            })
        })
    }
}
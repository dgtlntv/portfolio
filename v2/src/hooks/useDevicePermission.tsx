import { useCallback } from "react"
import { useModal } from "../components/Modal/ModalContext"
import { PermissionModalProps, PermissionState } from "./types"

function PermissionModal({ onAllow, onDeny }: PermissionModalProps) {
    return (
        <div>
            <h2>Permission Required</h2>
            <p>This application needs access to device orientation.</p>
            <button onClick={onAllow}>Allow</button>
            <button onClick={onDeny}>Deny</button>
        </div>
    )
}

export function useDevicePermission() {
    const { openModal, closeModal } = useModal()

    const requestPermission =
        useCallback(async (): Promise<PermissionState> => {
            if (navigator.permissions) {
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
                const status = await (
                    DeviceOrientationEvent as any
                ).requestPermission()
                return status
            } catch {
                // If direct request fails, show modal
                return new Promise((resolve) => {
                    const handleAllow = async () => {
                        try {
                            const status = await (
                                DeviceOrientationEvent as any
                            ).requestPermission()
                            closeModal()
                            resolve(status)
                        } catch (error) {
                            console.error("Permission request failed:", error)
                            closeModal()
                            resolve("denied")
                        }
                    }

                    const handleDeny = () => {
                        closeModal()
                        resolve("denied")
                    }

                    openModal(
                        <PermissionModal
                            onAllow={handleAllow}
                            onDeny={handleDeny}
                        />
                    )
                })
            }
        }, [openModal, closeModal])

    return { requestPermission }
}

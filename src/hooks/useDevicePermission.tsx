import { useCallback } from "react"
import { useModal } from "../components/Modal/ModalContext"
import { PermissionModalProps } from "./types"

function PermissionModal({ onAllow, onDeny }: PermissionModalProps) {
    return (
        <div className="bg-white rounded-t-xl shadow-xl p-6 w-full max-w-lg mx-auto">
            <div className="text-center">
                <h3 className="font-fancy text-lg font-medium leading-6 text-gray-900">
                    Device Orientation Permission
                </h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        For the cover of my portfolio website, I would like to access the orientation sensor of your smartphone to animate a 3D scene. To do this, you need to give
                        permission to access these sensors.
                    </p>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-fancy font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    onClick={onDeny}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-3 py-2 text-sm font-fancy font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                    onClick={onAllow}>
                    Grant Permission
                </button>
            </div>
        </div>
    )
}

export function useDevicePermission() {
    const { openModal, closeModal } = useModal()

    // DEBUG: Set to true to force modal open for styling/testing
    const DEBUG_FORCE_MODAL = true

    const requestPermission =
        useCallback(async (): Promise<PermissionState> => {
            
            // DEBUG: Force modal to open
            if (DEBUG_FORCE_MODAL) {
                return new Promise((resolve) => {
                    const handleAllow = async () => {
                        // Simulate slight delay like real permission request
                        setTimeout(() => {
                            closeModal()
                            resolve("granted")
                        }, 100)
                    }

                    const handleDeny = () => {
                        setTimeout(() => {
                            closeModal()
                            resolve("denied")
                        }, 100)
                    }

                    openModal(
                        <PermissionModal
                            onAllow={handleAllow}
                            onDeny={handleDeny}
                        />
                    )
                })
            }
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

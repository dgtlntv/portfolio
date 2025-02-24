import { Quaternion } from "three"

export interface OrientationState {
    quaternion: Quaternion | null
}

export interface DeviceOrientationHookReturn {
    orientation: OrientationState
    resetInitialOrientation: () => void
}

export interface MousePosition {
    x: number
    y: number
}

export type PermissionState = "granted" | "denied" | "prompt"

export interface PermissionModalProps {
    onAllow: () => Promise<void>
    onDeny: () => void
}

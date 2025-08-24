import { Orientation } from "../types"

export interface DeviceOrientationHookReturn {
    orientation: Orientation
    resetInitialOrientation: () => void
}

export interface PermissionModalProps {
    onAllow: () => Promise<void>
    onDeny: () => void
}

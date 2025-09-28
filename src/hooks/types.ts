import { Orientation } from "../types"

export interface DeviceOrientationHookReturn {
    orientation: Orientation
    resetInitialOrientation: () => void
}


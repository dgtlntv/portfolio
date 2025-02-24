import * as THREE from "three"

export interface ModelLoaderProps {
    model: string
}

export interface MouseState {
    x: number
    y: number
}

export interface OrientationState {
    quaternion: THREE.Quaternion | null
}

import { RelativeOrientationSensor } from "motion-sensors-polyfill"
import { Quaternion } from "three"
import { Orientation } from "../types/common"
import { requestDevicePermission } from "./devicePermission"

export interface DeviceOrientationTracker {
    orientation: Orientation
    resetInitialOrientation: () => void
    subscribe: (callback: (orientation: Orientation) => void) => () => void
    destroy: () => void
}

export class DeviceOrientationTrackerImpl implements DeviceOrientationTracker {
    orientation: Orientation = { quaternion: null }
    private initialOrientation: Orientation = { quaternion: null }
    private sensor?: RelativeOrientationSensor
    private listeners: Set<(orientation: Orientation) => void> = new Set()
    private isInitialized = false

    constructor() {
        this.initializeSensor()
    }

    private async initializeSensor() {
        if (this.isInitialized) return

        try {
            const permissionStatus = await requestDevicePermission()
            
            if (permissionStatus === "granted") {
                this.sensor = new RelativeOrientationSensor({
                    frequency: 60,
                    referenceFrame: "device",
                })

                this.sensor.addEventListener("reading", this.handleSensorReading)
                this.sensor.start()
                this.isInitialized = true
            } else {
                console.error("Permission to access sensor was rejected.")
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === "SecurityError") {
                    console.error("Sensor construction was blocked by a feature policy.")
                } else if (error.name === "ReferenceError") {
                    console.error("Sensor is not supported by the User Agent.")
                } else {
                    console.error("Sensor error:", error)
                }
            }
        }
    }

    private handleSensorReading = () => {
        if (!this.sensor) return

        this.updateOrientation()
        this.notifyListeners()
    }

    private updateOrientation() {
        if (!this.sensor || this.deepEqual(this.sensor.quaternion, [0, 0, 0, 1])) {
            return
        }

        if (this.initialOrientation.quaternion === null) {
            this.initialOrientation.quaternion = new Quaternion().fromArray([
                this.sensor.quaternion[2],
                this.sensor.quaternion[1],
                this.sensor.quaternion[3],
                this.sensor.quaternion[0],
            ])
        }

        const iquat = new Quaternion().copy(this.initialOrientation.quaternion)
        const cquat = new Quaternion().fromArray([
            this.sensor.quaternion[2],
            this.sensor.quaternion[1],
            this.sensor.quaternion[3],
            this.sensor.quaternion[0],
        ])
        
        this.orientation.quaternion = iquat.multiply(cquat.invert()).invert()
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this.orientation))
    }

    private deepEqual(array1: number[], array2: number[]): boolean {
        if (array1.length !== array2.length) return false
        return array1.every((value, index) => value === array2[index])
    }

    subscribe(callback: (orientation: Orientation) => void): () => void {
        this.listeners.add(callback)
        
        // Return unsubscribe function
        return () => {
            this.listeners.delete(callback)
        }
    }

    resetInitialOrientation(): void {
        this.initialOrientation.quaternion = null
    }

    destroy() {
        if (this.sensor) {
            this.sensor.stop()
            this.sensor.removeEventListener("reading", this.handleSensorReading)
        }
        this.listeners.clear()
        this.isInitialized = false
    }
}

// Global singleton instance
export const deviceOrientationTracker = new DeviceOrientationTrackerImpl()
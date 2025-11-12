import { RelativeOrientationSensor } from "motion-sensors-polyfill"
import { Quaternion } from "three"
import { requestDevicePermission } from "./devicePermission"

export interface Orientation {
    quaternion: Quaternion | null
}

/**
 * Tracks device orientation using sensors with throttling and subscription support.
 * Automatically manages sensor lifecycle and provides relative orientation from initial position.
 *
 * @example
 * ```typescript
 * const tracker = new DeviceOrientationTracker(60, 16);
 * const unsubscribe = tracker.subscribe((orientation) => {
 *   console.log(orientation.quaternion);
 * });
 * unsubscribe(); // Stop tracking
 * ```
 */
export class DeviceOrientationTracker {
    private static readonly ZERO_QUATERNION = [0, 0, 0, 1]
    /**
     * Mapping indices to convert from sensor quaternion format [x, y, z, w]
     * to Three.js quaternion format. This accounts for different coordinate systems.
     */
    private static readonly SENSOR_TO_THREEJS_INDICES = [2, 1, 3, 0] as const

    orientation: Orientation = { quaternion: null }
    private initialOrientation: Orientation = { quaternion: null }
    private sensor?: RelativeOrientationSensor
    private readonly listeners: Set<(orientation: Orientation) => void> =
        new Set()
    private isInitialized = false
    private throttleTimeout: number | null = null
    private readonly throttleMs: number
    private readonly sensorFrequency: number

    /**
     * Creates a new DeviceOrientationTracker instance.
     * @param sensorFrequency - Sensor reading frequency in Hz. Default is 60Hz
     * @param throttleMs - Minimum time in milliseconds between listener notifications. Default is 16ms (~60fps)
     */
    constructor(sensorFrequency: number = 60, throttleMs: number = 16) {
        this.sensorFrequency = sensorFrequency
        this.throttleMs = throttleMs
        this.initializeSensor()
    }

    /**
     * Initializes the orientation sensor after requesting permission.
     * Sets up the sensor with device reference frame and starts reading.
     */
    private async initializeSensor(): Promise<void> {
        if (this.isInitialized) return

        try {
            const permissionStatus = await requestDevicePermission()

            if (permissionStatus === "granted") {
                this.setupSensor()
                this.isInitialized = true
            } else {
                console.error("Permission to access sensor was rejected.")
            }
        } catch (error) {
            this.handleSensorError(error)
        }
    }

    /**
     * Creates and configures the RelativeOrientationSensor instance.
     */
    private setupSensor(): void {
        this.sensor = new RelativeOrientationSensor({
            frequency: this.sensorFrequency,
            referenceFrame: "device",
        })

        this.sensor.addEventListener("reading", this.handleSensorReading)
        this.sensor.start()
    }

    /**
     * Handles errors that occur during sensor initialization.
     * @param error - The error object thrown during sensor setup
     */
    private handleSensorError(error: unknown): void {
        if (!(error instanceof Error)) {
            console.error("Unknown sensor error:", error)
            return
        }

        const errorMessages: Record<string, string> = {
            SecurityError:
                "Sensor construction was blocked by a feature policy.",
            ReferenceError: "Sensor is not supported by the User Agent.",
        }

        console.error(
            errorMessages[error.name] || `Sensor error: ${error.message}`,
        )
    }

    /**
     * Callback handler for sensor reading events with throttling.
     * Updates orientation and notifies all subscribers.
     */
    private handleSensorReading = (): void => {
        if (!this.sensor) return

        if (this.throttleTimeout !== null) {
            return
        }

        this.throttleTimeout = window.setTimeout(() => {
            this.throttleTimeout = null
        }, this.throttleMs)

        this.updateOrientation()
        this.notifyListeners()
    }

    /**
     * Updates the current orientation based on sensor readings.
     * Calculates relative orientation from the initial orientation.
     */
    private updateOrientation(): void {
        if (!this.sensor?.quaternion) return

        if (this.isZeroQuaternion(this.sensor.quaternion)) return

        if (this.initialOrientation.quaternion === null) {
            this.initialOrientation.quaternion = this.sensorQuaternionToThreeJS(
                this.sensor.quaternion,
            )
        }

        const initialQuat = new Quaternion().copy(
            this.initialOrientation.quaternion,
        )
        const currentQuat = this.sensorQuaternionToThreeJS(
            this.sensor.quaternion,
        )

        this.orientation.quaternion = initialQuat
            .multiply(currentQuat.invert())
            .invert()
    }

    /**
     * Converts sensor quaternion format to Three.js quaternion format.
     * Sensor format uses device coordinate system [x, y, z, w].
     * Three.js requires remapped coordinates for its coordinate system.
     * @param sensorQuat - Quaternion array from the sensor [x, y, z, w]
     * @returns Three.js Quaternion object with remapped coordinates
     */
    private sensorQuaternionToThreeJS(sensorQuat: number[]): Quaternion {
        const [x, y, z, w] = DeviceOrientationTracker.SENSOR_TO_THREEJS_INDICES
        return new Quaternion().fromArray([
            sensorQuat[x],
            sensorQuat[y],
            sensorQuat[z],
            sensorQuat[w],
        ])
    }

    /**
     * Checks if the sensor quaternion is the zero/identity quaternion.
     * @param quaternion - Quaternion array to check
     * @returns True if the quaternion represents no rotation
     */
    private isZeroQuaternion(quaternion: number[]): boolean {
        return this.quaternionsEqual(
            quaternion,
            DeviceOrientationTracker.ZERO_QUATERNION,
        )
    }

    /**
     * Compares two quaternion arrays for equality.
     * @param quat1 - First quaternion array
     * @param quat2 - Second quaternion array
     * @returns True if all components are equal
     */
    private quaternionsEqual(quat1: number[], quat2: number[]): boolean {
        if (quat1.length !== quat2.length) return false
        return quat1.every((value, index) => value === quat2[index])
    }

    /**
     * Notifies all subscribed listeners with the current orientation.
     * Each listener receives a copy of the orientation to ensure immutability.
     * Errors in individual listeners are caught and logged without affecting other listeners.
     */
    private notifyListeners(): void {
        this.listeners.forEach((listener) => {
            try {
                listener({ ...this.orientation })
            } catch (error) {
                console.error(
                    "Error in DeviceOrientationTracker listener:",
                    error,
                )
            }
        })
    }

    /**
     * Subscribes to orientation updates.
     * The callback is immediately invoked with the current orientation.
     * @param callback - Function to call when orientation changes
     * @returns Unsubscribe function to stop receiving updates
     * @throws {TypeError} If callback is not a function
     * @example
     * ```typescript
     * const unsubscribe = tracker.subscribe((orientation) => {
     *   console.log(orientation.quaternion);
     * });
     * // Later: unsubscribe();
     * ```
     */
    subscribe(callback: (orientation: Orientation) => void): () => void {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function")
        }

        this.listeners.add(callback)

        try {
            callback({ ...this.orientation })
        } catch (error) {
            console.error(
                "Error in DeviceOrientationTracker listener on initial call:",
                error,
            )
        }

        return () => {
            this.listeners.delete(callback)
        }
    }

    /**
     * Resets the initial orientation reference point.
     * The next sensor reading will be used as the new baseline.
     */
    resetInitialOrientation(): void {
        this.initialOrientation.quaternion = null
    }

    /**
     * Gets the current device orientation.
     * Returns a copy to maintain immutability.
     * @returns A copy of the current orientation
     */
    getCurrentOrientation(): Orientation {
        return {
            quaternion: this.orientation.quaternion
                ? this.orientation.quaternion.clone()
                : null,
        }
    }

    /**
     * Cleans up resources and stops the sensor.
     * Removes all event listeners and clears subscriptions.
     * Should be called when the tracker is no longer needed to prevent memory leaks.
     */
    destroy(): void {
        if (this.sensor) {
            this.sensor.stop()
            this.sensor.removeEventListener("reading", this.handleSensorReading)
        }

        if (this.throttleTimeout !== null) {
            window.clearTimeout(this.throttleTimeout)
            this.throttleTimeout = null
        }

        this.listeners.clear()
        this.isInitialized = false
    }
}

/**
 * Global singleton instance of the device orientation tracker.
 * Provides a single shared instance for tracking device orientation throughout the application.
 */
export const deviceOrientationTracker = new DeviceOrientationTracker()

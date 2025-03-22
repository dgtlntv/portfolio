import { RelativeOrientationSensor } from "motion-sensors-polyfill"
import { useEffect, useRef } from "react"
import { Quaternion } from "three"
import { Orientation } from "../types"
import { DeviceOrientationHookReturn } from "./types"
import { useDevicePermission } from "./useDevicePermission"

export default function useDeviceOrientation(): DeviceOrientationHookReturn {
    const { requestPermission } = useDevicePermission()
    const orientation = useRef<Orientation>({
        quaternion: null,
    }).current

    const initialOrientation = useRef<Orientation>({
        quaternion: null,
    }).current

    useEffect(() => {
        const sensor = new RelativeOrientationSensor({
            frequency: 60,
            referenceFrame: "device",
        })

        // Create a stable reference to the handler function
        const sensorReadingHandler = () =>
            initSensor(orientation, sensor, initialOrientation)

        requestPermission()
            .then((permissionStatus: PermissionState) => {
                if (permissionStatus === "granted") {
                    try {
                        sensor.addEventListener("reading", sensorReadingHandler)
                        sensor.start()
                    } catch (error) {
                        if (error instanceof Error) {
                            if (error.name === "SecurityError") {
                                console.error(
                                    "Sensor construction was blocked by a feature policy."
                                )
                            } else if (error.name === "ReferenceError") {
                                console.error(
                                    "Sensor is not supported by the User Agent."
                                )
                            } else {
                                console.error("Sensor error:", error)
                            }
                        }
                    }
                } else {
                    console.error("Permission to access sensor was rejected.")
                }
            })
            .catch((error) => {
                console.error("Error requesting permissions:", error)
            })

        return () => {
            sensor.stop()
            sensor.removeEventListener("reading", sensorReadingHandler)
        }
    }, [requestPermission])

    return {
        orientation: orientation,
        resetInitialOrientation: () => {
            resetInitialOrientation(initialOrientation)
        },
    }
}

// Helper function to replace lodash.isEqual
function deepEqual(array1: number[], array2: number[]): boolean {
    if (array1.length !== array2.length) return false
    return array1.every((value, index) => value === array2[index])
}

function initSensor(
    orientation: Orientation,
    sensor: RelativeOrientationSensor,
    initialOrientation: Orientation
): void {
    if (!deepEqual(sensor.quaternion, [0, 0, 0, 1])) {
        if (initialOrientation.quaternion === null) {
            initialOrientation.quaternion = new Quaternion().fromArray([
                sensor.quaternion[2],
                sensor.quaternion[1],
                sensor.quaternion[3],
                sensor.quaternion[0],
            ])
        }

        const iquat = new Quaternion().copy(initialOrientation.quaternion)
        const cquat = new Quaternion().fromArray([
            sensor.quaternion[2],
            sensor.quaternion[1],
            sensor.quaternion[3],
            sensor.quaternion[0],
        ])
        orientation.quaternion = iquat.multiply(cquat.invert()).invert()
    }
}

function resetInitialOrientation(initialOrientation: Orientation): void {
    initialOrientation.quaternion = null
}

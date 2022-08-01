import { RelativeOrientationSensor } from "motion-sensors-polyfill"
import { useRef, useEffect } from "react"
import { Quaternion } from "three"

export default function useDeviceOrientation() {
    const orientation = useRef({
        quaternion: null,
    }).current

    const initialOrientation = useRef({
        quaternion: null,
    }).current

    let sensor = null

    useEffect(function () {
        try {
            sensor = new RelativeOrientationSensor({ frequency: 60, referenceFrame: "device" })
            sensor.addEventListener("error", (event) => {
                // Handle runtime errors.
                if (event.error.name === "NotAllowedError") {
                    if (navigator.permissions) {
                        Promise.all([navigator.permissions.query({ name: "accelerometer" }), navigator.permissions.query({ name: "gyroscope" })])
                            .then((results) => {
                                if (results.every((result) => result.state === "granted")) {
                                    sensor.addEventListener("reading", () => initSensor(orientation, sensor, initialOrientation))
                                    sensor.start()
                                } else {
                                    console.log("No permissions to use AbsoluteOrientationSensor.")
                                }
                            })
                            .catch((err) => {
                                try {
                                    DeviceOrientationEvent.requestPermission().then(function (response) {
                                        if (response === "granted") {
                                            sensor.addEventListener("reading", () => initSensor(orientation, sensor, initialOrientation))
                                            sensor.start()
                                        }
                                    })
                                } catch (err) {
                                    console.error(err)
                                }
                            })
                    } else {
                        try {
                            DeviceOrientationEvent.requestPermission().then(function (response) {
                                if (response === "granted") {
                                    sensor.addEventListener("reading", () => initSensor(orientation, sensor, initialOrientation))
                                    sensor.start()
                                }
                            })
                        } catch (err) {
                            console.error(err)
                        }
                    }
                } else if (event.error.name === "NotReadableError") {
                    console.log("Cannot connect to the sensor.")
                }
            })
            sensor.addEventListener("reading", () => initSensor(orientation, sensor, initialOrientation))
            sensor.start()
        } catch (error) {
            // Handle construction errors.
            if (error.name === "SecurityError") {
                // See the note above about feature policy.
                console.log("Sensor construction was blocked by a feature policy.")
            } else if (error.name === "ReferenceError") {
                console.log("Sensor is not supported by the User Agent.")
            } else {
                throw error
            }
        }
        return function () {
            sensor.stop()
            sensor.removeEventListener("reading", () => initSensor(orientation, sensor, initialOrientation))
        }
    }, [])

    return orientation
}

function initSensor(orientation, sensor, initialOrientation) {
    if (initialOrientation.quaternion === null) {
        initialOrientation.quaternion = new Quaternion().fromArray([sensor.quaternion[2], sensor.quaternion[1], sensor.quaternion[3], sensor.quaternion[0]])
    }

    const iquat = new Quaternion().copy(initialOrientation.quaternion)
    const cquat = new Quaternion().fromArray([sensor.quaternion[2], sensor.quaternion[1], sensor.quaternion[3], sensor.quaternion[0]])

    orientation.quaternion = iquat.multiply(cquat.invert()).invert()
}

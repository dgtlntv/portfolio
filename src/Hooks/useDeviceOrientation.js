import { RelativeOrientationSensor } from "motion-sensors-polyfill"
import { useRef, useEffect } from "react"
import { Quaternion } from "three"
import isEqual from "lodash.isequal"
import Perm from "./Perm"

export default function useDeviceOrientation() {
    const orientation = useRef({
        quaternion: null,
    }).current

    const initialOrientation = useRef({
        quaternion: null,
    }).current

    useEffect(function () {
        const sensor = new RelativeOrientationSensor({ frequency: 60, referenceFrame: "device" })

        Perm().then(function (permission) {
            try {
                sensor.addEventListener("error", (event) => {
                    console.log(event.error)
                })
                sensor.addEventListener("reading", () => initSensor(orientation, sensor, initialOrientation))
                sensor.start()
            } catch (error) {
                if (error.name === "SecurityError") {
                    console.log("Sensor construction was blocked by a feature policy.")
                } else if (error.name === "ReferenceError") {
                    console.log("Sensor is not supported by the User Agent.")
                } else {
                    console.log(error)
                }
            }
        })

        return function () {
            sensor.stop()
            sensor.removeEventListener("reading", () => initSensor(orientation, sensor, initialOrientation))
        }
    }, [])

    return {
        orientation: orientation,
        resetInitialOrientation: () => {
            resetInitialOrientation(initialOrientation)
        },
    }
}

function initSensor(orientation, sensor, initialOrientation) {
    if (!isEqual(sensor.quaternion, [0, 0, 0, 1])) {
        if (initialOrientation.quaternion === null) {
            console.log(sensor.quaternion)
            console.log(sensor)
            initialOrientation.quaternion = new Quaternion().fromArray([sensor.quaternion[2], sensor.quaternion[1], sensor.quaternion[3], sensor.quaternion[0]])
            console.log(initialOrientation.quaternion)
        }

        const iquat = new Quaternion().copy(initialOrientation.quaternion)
        const cquat = new Quaternion().fromArray([sensor.quaternion[2], sensor.quaternion[1], sensor.quaternion[3], sensor.quaternion[0]])
        orientation.quaternion = iquat.multiply(cquat.invert()).invert()
    }
}

function resetInitialOrientation(initialOrientation) {
    initialOrientation.quaternion = null
}

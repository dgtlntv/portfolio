import { isMobileSafari } from "react-device-detect"
import Modal from "../Components/Modal"
import ReactDOM from "react-dom/client"

export default async function Perm() {
    if (!isMobileSafari) {
        return await deviceOrientationPermission()
    } else {
        return await getPermissionFromModal()
    }
}

function getPermissionFromModal() {
    return new Promise((resolve, reject) => {
        addDialog(resolve)
    })
}

function addDialog(resolve) {
    const body = document.getElementsByTagName("body")[0]
    const div = document.createElement("div")
    div.setAttribute("id", "DialogDiv")
    body.appendChild(div)
    ReactDOM.render(<Modal action={deviceOrientationPermission} resolve={resolve} remove={removeDialog} />, div)
}

function removeDialog() {
    const div = document.getElementById("DialogDiv")
    const body = document.getElementsByTagName("body")[0]
    body.removeChild(div)
}

async function deviceOrientationPermission() {
    return new Promise((resolve, reject) => {
        if (navigator.permissions) {
            Promise.all([navigator.permissions.query({ name: "accelerometer" }), navigator.permissions.query({ name: "gyroscope" })])
                .then((results) => {
                    if (results.every((result) => result.state === "granted")) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
                .catch(() => {
                    try {
                        DeviceOrientationEvent.requestPermission().then(function (response) {
                            if (response === "granted") {
                                resolve(true)
                            } else {
                                resolve(false)
                            }
                        })
                    } catch (err) {
                        resolve(false)
                    }
                })
        } else {
            try {
                DeviceOrientationEvent.requestPermission().then(function (response) {
                    if (response === "granted") {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            } catch {
                resolve(false)
            }
        }
    })
}

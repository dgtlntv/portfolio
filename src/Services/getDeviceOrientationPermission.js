import Modal from "../Components/Modal"
import * as ReactDOM from "react-dom"

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
    ReactDOM.createPortal(<Modal action={DeviceOrientationEvent.requestPermission} resolve={resolve} remove={removeDialog} />, div)
}

function removeDialog() {
    const body = document.getElementsByTagName("body")[0]
    const div = document.getElementById("DialogDiv")
    body.removeChild(div)
}

export default async function getDeviceOrientationPermission() {
    return new Promise((resolve, reject) => {
        if (navigator.permissions) {
            Promise.all([navigator.permissions.query({ name: "accelerometer" }), navigator.permissions.query({ name: "gyroscope" })])
                .then(() => {
                    resolve("granted")
                })
                .catch(() => {
                    resolve("granted")
                })
        } else {
            DeviceOrientationEvent.requestPermission().catch(function () {
                getPermissionFromModal().then((permissionStatus) => {
                    resolve(permissionStatus)
                })
            })
        }
    })
}

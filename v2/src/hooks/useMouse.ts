import { useEffect, useRef } from "react"
import { MousePosition } from "./types"

export default function useMouse(): MousePosition {
    const position = useRef<MousePosition>({
        x: 0,
        y: 0,
    }).current

    useEffect(() => {
        const setFromEvent = function (e: MouseEvent) {
            position.x = -1 + (e.clientX / window.innerWidth) * 2
            position.y = 1 - (e.clientY / window.innerHeight) * 2
        }

        window.addEventListener("mousemove", setFromEvent)

        return () => {
            window.removeEventListener("mousemove", setFromEvent)
        }
    }, [])

    return position
}

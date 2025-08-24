import { useEffect, useRef } from "react"
import { Mouse2D } from "../types"

export default function useMouse(): Mouse2D {
    const position = useRef<Mouse2D>({
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

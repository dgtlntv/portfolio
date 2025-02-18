import { useEffect, useRef } from "react"

export default function useMouse() {
    const position = useRef({
        x: 0,
        y: 0,
    }).current

    useEffect(() => {
        const setFromEvent = function (e) {
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

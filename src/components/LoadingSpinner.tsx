import { randomSpinner } from "cli-spinners"
import { useEffect, useState, useMemo } from "react"

interface LoadingSpinnerProps {
    scale?: number
}

export default function LoadingSpinner({ scale = 2 }: LoadingSpinnerProps) {
    const [frameIndex, setFrameIndex] = useState(0)
    
    // Use useMemo to ensure the spinner is only created once
    const spinner = useMemo(() => randomSpinner(), [])

    useEffect(() => {
        const interval = setInterval(() => {
            setFrameIndex((prev) => (prev + 1) % spinner.frames.length)
        }, spinner.interval)

        return () => clearInterval(interval)
    }, [spinner.frames.length, spinner.interval])

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div
                className="font-fancy text-black"
                style={{
                    fontSize: `${scale}rem`,
                    lineHeight: 1,
                }}
            >
                {spinner.frames[frameIndex]}
            </div>
        </div>
    )
}

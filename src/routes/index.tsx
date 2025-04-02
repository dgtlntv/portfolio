import { CubeTransparentIcon } from "@heroicons/react/24/outline"
import { createFileRoute } from "@tanstack/react-router"
import { lazy, Suspense } from "react"
import LoadingSpinner from "../components/LoadingSpinner"
import useDeviceOrientation from "../hooks/useDeviceOrientation"
import useMouse from "../hooks/useMouse"

// Lazy load all Three.js related components in a single chunk
const ThreeScene = lazy(() => import("../components/ThreeScene"))

export const Route = createFileRoute("/")({
    component: Index,
})

export default function Index() {
    const { orientation, resetInitialOrientation } = useDeviceOrientation()
    const mouse = useMouse()

    return (
        <>
            <div className="absolute top-0 right-0 bottom-0 left-0">
                <Suspense fallback={<LoadingSpinner scale={4} />}>
                    <ThreeScene orientation={orientation} mouse={mouse} />
                </Suspense>
            </div>
            <div className="absolute right-0 bottom-4 left-0 flex justify-center lg:hidden">
                <button
                    onClick={() => resetInitialOrientation()}
                    className="inline-flex items-center rounded-md border border-transparent bg-gray-900 px-3 py-2 text-sm leading-4 font-medium text-white shadow-sm hover:bg-gray-700 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none"
                >
                    <CubeTransparentIcon
                        className="mr-2 -ml-0.5 h-4 w-4"
                        aria-hidden="true"
                    />
                    Reset Rotation
                </button>
            </div>
        </>
    )
}

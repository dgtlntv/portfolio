import { CubeTransparentIcon } from "@heroicons/react/24/outline"
import { Canvas } from "@react-three/fiber"
import { createFileRoute } from "@tanstack/react-router"
import { lazy, Suspense } from "react"
import useDeviceOrientation from "../hooks/useDeviceOrientation"
import useMouse from "../hooks/useMouse"

// Lazy load heavy Three.js components
const ProfileModel = lazy(() => import("../components/Three/ProfileModel"))
const AsciiRenderer = lazy(() => import("../components/Three/Asciirenderer"))

export const Route = createFileRoute("/")({
    component: Index,
})

export default function Index() {
    const { orientation, resetInitialOrientation } = useDeviceOrientation()
    const mouse = useMouse()

    return (
        <>
            <div className="absolute top-0 right-0 bottom-0 left-0">
                <Canvas>
                    <directionalLight position={[-2, 6, 6]} intensity={1} />
                    <Suspense fallback={null}>
                        <ProfileModel orientation={orientation} mouse={mouse} />
                    </Suspense>
                    <Suspense fallback={null}>
                        <AsciiRenderer resolution={0.18} />
                    </Suspense>
                </Canvas>
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

import { CubeTransparentIcon } from "@heroicons/react/24/outline"
import { Canvas } from "@react-three/fiber"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import AsciiRenderer from "../components/Three/Asciirenderer"
import ProfileModel from "../components/Three/ProfileModel"
import useDeviceOrientation from "../hooks/useDeviceOrientation"
import useMouse from "../hooks/useMouse"

export const Route = createFileRoute("/")({
    component: Index,
})

export default function Index() {
    const { orientation, resetInitialOrientation } = useDeviceOrientation()
    const mouse = useMouse()

    // TODO: Fix light problems with threejs - make the rendered 3D model look shit
    // TODO: Maybe create a better 3D mdoel

    return (
        <>
            <div className="absolute top-0 bottom-0 left-0 right-0 ">
                <Canvas>
                    <directionalLight position={[-2, 6, 6]} intensity={1} />
                    <Suspense fallback={null}>
                        <ProfileModel orientation={orientation} mouse={mouse} />
                    </Suspense>
                    <AsciiRenderer resolution={0.18} />
                </Canvas>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center lg:hidden">
                <button
                    onClick={() => resetInitialOrientation()}
                    className="inline-flex items-center rounded-md border border-transparent bg-gray-900 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                >
                    <CubeTransparentIcon
                        className="-ml-0.5 mr-2 h-4 w-4"
                        aria-hidden="true"
                    />
                    Reset Rotation
                </button>
            </div>
        </>
    )
}

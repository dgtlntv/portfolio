import { Canvas, useFrame } from "@react-three/fiber"
import { Center } from "@react-three/drei"
import ModelLoader from "../Services/ModelLoader"
import { Suspense, useRef } from "react"
import Navigation from "../Components/GlobalLayout/Navigation"
import * as THREE from "three"
import { CubeTransparentIcon } from "@heroicons/react/outline"
import AsciiRenderer from "../Services/AsciiRenderer"
import useDeviceOrientation from "../Hooks/useDeviceOrientation"
import useMouse from "../Hooks/useMouse"

export default function Landing() {
    const { orientation, resetInitialOrientation } = useDeviceOrientation()
    const mouse = useMouse()

    return (
        <>
            <Navigation />
            <div className="absolute top-0 bottom-0 left-0 right-0 ">
                <Canvas>
                    <pointLight position={[-2, 6, 6]} intensity={1} />
                    <Suspense fallback={null}>
                        <Group orientation={orientation} mouse={mouse} />
                    </Suspense>

                    <AsciiRenderer resolution={0.18} />
                </Canvas>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center lg:hidden">
                <button
                    onClick={() => resetInitialOrientation()}
                    className="inline-flex items-center rounded-md border border-transparent bg-gray-900 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
                    <CubeTransparentIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    Reset Rotation
                </button>
            </div>
        </>
    )
}

function Group({ orientation, mouse }) {
    const meshRef = useRef()

    useFrame(function () {
        if (orientation.quaternion != null) {
            meshRef.current.setRotationFromQuaternion(orientation.quaternion)
        } else {
            meshRef.current.rotation.x = -mouse.y * 0.2
            meshRef.current.rotation.y = mouse.x * 0.2
        }
    })

    return (
        <Center ref={meshRef}>
            <group>
                <mesh position={[2.3, 2, 1.5]} rotation={[-Math.PI / 2, -0.01, Math.PI / 2]} scale={12}>
                    <ModelLoader
                        model={
                            "https://res.cloudinary.com/drsfxkvt1/raw/upload/v1659444196/portfolio/landing/profile_febfp5.stl"
                        }
                    />
                    <meshStandardMaterial color={"white"} side={THREE.DoubleSide} flatShading={true} />
                </mesh>
            </group>
        </Center>
    )
}

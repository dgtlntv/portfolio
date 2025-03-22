import { Center } from "@react-three/drei/core/Center"
import { useFrame } from "@react-three/fiber"
import { Suspense, useRef } from "react"
import { DoubleSide, Group } from "three"
import ModelLoader from "./ModelLoader"
import { ProfileModelProps } from "./types"

export default function ProfileModel({
    orientation,
    mouse,
}: ProfileModelProps) {
    const meshRef = useRef<Group>(null)

    useFrame(() => {
        if (!meshRef.current) return

        if (orientation.quaternion !== null) {
            meshRef.current.setRotationFromQuaternion(orientation.quaternion)
        } else {
            meshRef.current.rotation.x = -mouse.y * 0.2
            meshRef.current.rotation.y = mouse.x * 0.2
        }
    })

    return (
        <Center ref={meshRef}>
            <group>
                <mesh
                    position={[2, 2, 1.5]}
                    rotation={[-Math.PI / 2, -0.01, Math.PI / 2]}
                    scale={13}
                >
                    <Suspense fallback={<boxGeometry />}>
                        <ModelLoader model={"/profile_febfp5.stl"} />
                    </Suspense>
                    <meshStandardMaterial
                        color={"white"}
                        side={DoubleSide}
                        flatShading={true}
                    />
                </mesh>
            </group>
        </Center>
    )
}

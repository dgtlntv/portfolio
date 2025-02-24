import { Center } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import ModelLoader from "./ModelLoader"
import { MouseState, OrientationState } from "./types"

interface ProfileModelProps {
    orientation: OrientationState
    mouse: MouseState
}

export default function ProfileModel({
    orientation,
    mouse,
}: ProfileModelProps) {
    const meshRef = useRef<THREE.Group>(null)

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
                    position={[2.3, 2, 1.5]}
                    rotation={[-Math.PI / 2, -0.01, Math.PI / 2]}
                    scale={12}
                >
                    <ModelLoader
                        model={
                            "https://res.cloudinary.com/drsfxkvt1/raw/upload/v1659444196/portfolio/landing/profile_febfp5.stl"
                        }
                    />
                    <meshStandardMaterial
                        color={"white"}
                        side={THREE.DoubleSide}
                        flatShading={true}
                    />
                </mesh>
            </group>
        </Center>
    )
}

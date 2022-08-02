import { Canvas, useFrame } from "@react-three/fiber"
import { Text3D, Center } from "@react-three/drei"
import ModelLoader from "../Services/ModelLoader"
import { useRef } from "react"
import Navigation from "../Components/GlobalLayout/Navigation"
import * as THREE from "three"
import AsciiRenderer from "../Services/AsciiRenderer"
import useDeviceOrientation from "../Hooks/useDeviceOrientation"
import useMouse from "../Hooks/useMouse"

export default function Landing() {
    return (
        <>
            <Navigation />
            <div className="absolute top-0 bottom-0 left-0 right-0 ">
                <Canvas>
                    <pointLight position={[-2, 6, 6]} intensity={1} />
                    <Group />
                    <AsciiRenderer resolution={0.18} />
                </Canvas>
            </div>
        </>
    )
}

function Group() {
    const sensor = useDeviceOrientation()
    const mouse = useMouse()
    const meshRef = useRef()

    useFrame(function () {
        if (sensor.quaternion != null) {
            meshRef.current.setRotationFromQuaternion(sensor.quaternion)
        } else {
            meshRef.current.rotation.x = -mouse.y * 0.2
            meshRef.current.rotation.y = mouse.x * 0.2
        }
    })

    return (
        <Center ref={meshRef}>
            <group>
                <Text3D height={0.4} font="/Courier.json" curveSegments={20}>
                    Blazek
                    <meshNormalMaterial />
                </Text3D>

                <mesh position={[2.3, 2.2, 1.5]} rotation={[-Math.PI / 2, -0.01, Math.PI / 2]} scale={12}>
                    <ModelLoader model={"https://res.cloudinary.com/drsfxkvt1/raw/upload/v1659444196/portfolio/landing/profile_febfp5.stl"} />
                    <meshStandardMaterial color={"white"} side={THREE.DoubleSide} flatShading={true} />
                </mesh>
            </group>
        </Center>
    )
}

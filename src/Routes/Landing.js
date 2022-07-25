import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import AsciiRenderer from "../Services/AsciiRenderer";
import ModelLoader from "../Services/ModelLoader";
import { useRef } from "react";
import Navigation from "../Components/Navigation";

export default function Landing() {
    return (
        <div className="h-screen w-screen flex flex-col">
            <Navigation />
            <div className="flex-1 relative">
                <div className="absolute top-0 bottom-0 left-0 right-0">
                    <Canvas camera={{ position: [0, 0, 4] }}>
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                        <pointLight position={[-10, -10, -10]} />
                        <Center>
                            <Group />
                        </Center>
                        <AsciiRenderer resolution={0.2} />
                    </Canvas>
                </div>
            </div>
        </div>
    );
}

function Group(params) {
    const rotationMultiplicator = 0.1;
    const ref = useRef();

    useFrame(
        (state) => (
            (ref.current.rotation.x = state.mouse.x * rotationMultiplicator), (ref.current.rotation.y = state.mouse.y * rotationMultiplicator)
        )
    );

    return (
        <group {...params} ref={ref}>
            <Text3D height={0.4} font="/Courier.json" curveSegments={20}>
                Blazek
                <meshNormalMaterial />
            </Text3D>

            <mesh position={[2.5, 2.2, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.045}>
                <ModelLoader model={"/test2.stl"} />
                <meshStandardMaterial color="orange" />
            </mesh>
        </group>
    );
}

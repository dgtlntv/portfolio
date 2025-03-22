import { useLoader } from "@react-three/fiber"
import { BufferGeometry } from "three"
import { STLLoader } from "three/examples/jsm/Addons.js"
import { ModelLoaderProps } from "./types"

export default function ModelLoader({ model }: ModelLoaderProps) {
    const geometry = useLoader(STLLoader, model) as BufferGeometry

    return (
        <>
            <primitive object={geometry} attach="geometry" />
        </>
    )
}

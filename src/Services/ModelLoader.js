import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

export default function ModelLoader({ model, scale }) {
    const geometry = useLoader(STLLoader, model);
    return (
        <>
            <primitive object={geometry} attach="geometry" />
        </>
    );
}

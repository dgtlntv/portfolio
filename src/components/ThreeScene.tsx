import { Canvas } from "@react-three/fiber"
import { lazy, Suspense } from "react"
import useDeviceOrientation from "../hooks/useDeviceOrientation"
import useMouse from "../hooks/useMouse"

// Lazy load heavy Three.js components
const ProfileModel = lazy(() => import("./Three/ProfileModel"))
const AsciiRenderer = lazy(() => import("./Three/Asciirenderer"))

interface ThreeSceneProps {
  orientation: ReturnType<typeof useDeviceOrientation>["orientation"]
  mouse: ReturnType<typeof useMouse>
}

export default function ThreeScene({ orientation, mouse }: ThreeSceneProps) {
  return (
    <Canvas>
      <directionalLight position={[-2, 6, 6]} intensity={1} />
      <Suspense fallback={null}>
        <ProfileModel orientation={orientation} mouse={mouse} />
      </Suspense>
      <Suspense fallback={null}>
        <AsciiRenderer resolution={0.18} characters=" .:-+*=%#" />
      </Suspense>
    </Canvas>
  )
}
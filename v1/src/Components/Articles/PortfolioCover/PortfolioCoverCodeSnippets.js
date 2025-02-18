export const CanvasSetupCode = `function Cover() {
    return (
     <Canvas>
       <pointLight />
       <Center>
         <group>
           <Text3D font="/Courier.json">
             Blazek
             <meshNormalMaterial />
           </Text3D>
  
           <mesh>
             <ModelLoader model={"/max.stl"} />
             <meshStandardMaterial />
           </mesh>
         </group>
       </Center>
       <AsciiRenderer />
     </Canvas>
   )
  }`

export const MouseCoordinatesCode = `useFrame(function () {
    meshRef.current.rotation.x = -mouse.y * 0.2
    meshRef.current.rotation.y = mouse.x * 0.2
})`

export const GyroCoordinatesCode = `useFrame(function () {
    if (sensor.quaternion != null) {
      meshRef.current.setRotationFromQuaternion(sensor.quaternion)
    }
  })`

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function Website() {
    const stats = [
        { label: "Context", value: "Personal Project" },
        { label: "Period", value: "3 Days" },
    ]

    return (
        <div className="relative py-16 bg-white overflow-hidden">
            <div className="relative px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto aspect-[16/8] overflow-hidden rounded-xl flex items-center justify-center mb-8 shadow-md">
                    <img className="h-full" src="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370932/portfolio/portfolio%20cover/Hero_woejwx.png" />
                </div>

                <div className="text-lg max-w-prose mx-auto">
                    <h1>
                        <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl">Portfolio Cover Page</span>
                    </h1>
                </div>

                <div className="mt-10 max-w-prose text-lg mx-auto">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="border-y-2 border-gray-100 py-6 text-center">
                                <dt className="text-base font-medium text-gray-500">{stat.label}</dt>
                                <dd className="text-3xl font-extrabold tracking-tight text-gray-900">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="mt-16 prose prose-zinc prose-red prose-xl mx-auto font-sans">
                    <p>
                        I had the idea that a 3D scene rendered in ASCII characters would look really good. When I learned that Three.js has an effect that can render any scene in ASCII characters, I
                        knew I had to use it for the cover of my portfolio. I decided on a simple 3D scene with my face and last name (since it's my portfolio) as the subject.
                    </p>
                    <h2>3D Model</h2>
                    <p>
                        The first thing I had to do was create the 3D model of my face. I decided to use photogammetry because it is the easiest way to create 3D models. To do this, I had to
                        photograph my head in broad daylight to get bright and evenly exposed photos without harsh shadows. One mistake I made the first time I tried photogammetry was that I rotated
                        the object rather than the camera around object, which turned out to be a problem because photogammetry requires an environment to place the images in space.
                    </p>
                    <h2>Code</h2>
                    <p>
                        After I was done creating the 3D model, I had to set up the Three.js scene with the 3D Model and 3D Text. This was as simple as adding the Three.js Canvas to the React
                        component and adding the 3D models and a light to the scene and adding the ASCII renderer.
                    </p>
                    <SyntaxHighlighter showLineNumbers wrapLines language="jsx" style={a11yDark}>{`function Cover() {
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
}`}</SyntaxHighlighter>

                    <h3>Interactivity</h3>
                    <p>
                        The next step was to add the interactive part of the experience. This turned out to be the more difficult part because I wanted to rotate the 3D model and not the camera. All
                        the off-the-shelf controls that come with Three.js can only control the camera, but not the 3D models. So I had to program them myself. The ability to rotate the 3D model with
                        the mouse was not that hard. I just had to map the x and y coordinates of the mouse to the x and y rotation of the 3D models.
                    </p>
                    <SyntaxHighlighter showLineNumbers wrapLines language="jsx" style={a11yDark}>{`useFrame(function () {
    meshRef.current.rotation.x = -mouse.y * 0.2
    meshRef.current.rotation.y = mouse.x * 0.2
})`}</SyntaxHighlighter>
                    <p>
                        The more difficult problem was mapping the rotation of the cell phones to the rotation of the 3D models. The problem was that the Web Api, which is supported by all major
                        browsers, returns the cell phone rotation data in{" "}
                        <a href="https://en.wikipedia.org/wiki/Euler_angles" target="_blank">
                            Euler angles
                        </a>
                        . And as I learned, Euler angles are susceptible to{" "}
                        <a href="https://en.wikipedia.org/wiki/Gimbal_lock" target="_blank">
                            gimbal lock
                        </a>
                        . In terms of the web API, this means that for certain rotations of the mobile device, the returned values jump around. This proved problematic because it meant that if I
                        mapped the rotation of the mobile device directly to the 3D model, it would also jump around. Which was aesthetically not acceptable. I had to struggle with this problem for
                        quite some time. The solution I found in the end is a competing web API that outputs the rotations in{" "}
                        <a href="https://en.wikipedia.org/wiki/Quaternion" target="_blank">
                            quaternions
                        </a>
                        , bypassing the gimbal lock problem. The only problem with this API is that it is not supported by all major browsers. However, there is a polyfill for it that I was able to
                        use to ensure compatibility with all browsers. This finally allowed me to map rotation from mobile devices to the 3D model.
                    </p>
                    <SyntaxHighlighter showLineNumbers wrapLines language="jsx" style={a11yDark}>{`useFrame(function () {
  if (sensor.quaternion != null) {
    meshRef.current.setRotationFromQuaternion(sensor.quaternion)
  }
})`}</SyntaxHighlighter>
                </div>
            </div>
        </div>
    )
}

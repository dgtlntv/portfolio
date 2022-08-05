import Article from "../Components/Articles/Article"
import ArticleTextWrapper from "../Components/Articles/ArticleTextWrapper"
import CodeBlock from "../Components/Articles/CodeBlock"
import { CanvasSetupCode, MouseCoordinatesCode, GyroCoordinatesCode } from "../Components/Articles/PortfolioCover/PortfolioCoverCodeSnippets"
import FloatRightWrapper from "../Components/Articles/FloatRightWrapper"
import FloatRightFigure from "../Components/Articles/FloatRightFigure"

export default function PortfolioCover() {
    const stats = [
        { label: "Context", value: "Personal Project" },
        { label: "Period", value: "3 Days" },
    ]

    return (
        <Article stats={stats} title="Portfolio Cover" heroLocation="center" heroUrl="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659639674/portfolio/portfolio%20cover/Hero_f4prxt.png">
            <ArticleTextWrapper>
                <p>
                    I had the idea that a 3D scene rendered in ASCII characters would look really good. When I learned that Three.js has an effect that can render any scene in ASCII characters, I knew
                    I had to use it for the cover of my portfolio. I decided on a simple 3D scene with my face and last name (since it's my portfolio) as the subject.
                </p>
                <h2 className="mb-0">3D Model</h2>
                <FloatRightWrapper>
                    <FloatRightFigure>
                        <img className="rounded-lg shadow-md" src="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659640742/portfolio/portfolio%20cover/photogammetry_oo7z2t.png" alt="" />
                        <figcaption>The result of photogammetry software.</figcaption>
                    </FloatRightFigure>
                    <p className="order-first">
                        The first thing I had to do was create the 3D model of my face. I decided to use photogammetry because it is the easiest way to create 3D models. To do this, I had to
                        photograph my head in broad daylight to get bright and evenly exposed photos without harsh shadows. One mistake I made the first time I tried photogammetry was that I rotated
                        the object rather than the camera around object, which turned out to be a problem because photogammetry requires an environment to place the images in space.
                    </p>
                </FloatRightWrapper>
                <h2>Code</h2>
                <p>
                    After I was done creating the 3D model, I had to set up the Three.js scene with the 3D Model and 3D Text. This was as simple as adding the Three.js Canvas to the React component
                    and adding the 3D models and a light to the scene and adding the ASCII renderer.
                </p>
                <CodeBlock code={CanvasSetupCode} />
                <h3>Interactivity</h3>
                <p>
                    The next step was to add the interactive part of the experience. This turned out to be the more difficult part, because I wanted to rotate the 3D model and not the camera. All the
                    off-the-shelf controls that come with Three.js can only control the camera, but not the 3D models. So I had to program them myself.
                </p>
                <h4>Mouse</h4>
                <p>The ability to rotate the 3D model with the mouse was not that hard. I just had to map the x and y coordinates of the mouse to the x and y rotation of the 3D models.</p>
                <CodeBlock code={MouseCoordinatesCode} />
                <h4>Smartphone Gyroscope</h4>
                <p>
                    The more difficult problem was mapping the rotation of a smartphone to the rotation of the 3D models. The problem was that the Web Api, which is supported by all major browsers,
                    returns the smartphone rotation data in{" "}
                    <a href="https://en.wikipedia.org/wiki/Euler_angles" target="_blank" rel="noreferrer">
                        Euler angles
                    </a>
                    . And as I learned, Euler angles are susceptible to{" "}
                    <a href="https://en.wikipedia.org/wiki/Gimbal_lock" target="_blank" rel="noreferrer">
                        gimbal lock
                    </a>
                    . In terms of this project, this means that for certain rotations of the mobile device, the returned values are unstable. This proved problematic because it meant that if I mapped
                    the rotation of the mobile device directly to the 3D model, it would jump around. Which was aesthetically not acceptable.{" "}
                </p>{" "}
                <p>
                    {" "}
                    I had to struggle with this problem for quite some time. The solution I found in the end is a competing Web API that outputs the rotations in{" "}
                    <a href="https://en.wikipedia.org/wiki/Quaternion" target="_blank" rel="noreferrer">
                        quaternions
                    </a>
                    , bypassing the gimbal lock problem. The only problem with this API is that it is not supported by all major browsers. However, there is a polyfill for it that I was able to use to
                    ensure compatibility with all browsers. This finally allowed me to map rotation from mobile devices to the 3D model.
                </p>
                <CodeBlock code={GyroCoordinatesCode} />
            </ArticleTextWrapper>
        </Article>
    )
}

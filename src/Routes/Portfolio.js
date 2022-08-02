import PortfolioItemRight from "../Components/PortfolioOverview/PortfolioItemRight"
import PortfolioItemLeft from "../Components/PortfolioOverview/PortfolioItemLeft"

export default function Portfolio() {
    return (
        <div className="overflow-hidden pb-16 pt-0 lg:py-12">
            <div className="mx-auto grid grid-cols-1 items-center gap-8 px-6 lg:max-w-5xl lg:grid-cols-5 lg:px-8 lg:py-6">
                <img className="mx-auto h-40 rounded-full lg:mx-0 lg:h-28" src="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659375088/portfolio/profile_pic_wzxape.jpg" alt="" />
                <p className="mx-auto max-w-xl px-4 font-fancy text-2xl font-medium tracking-tight text-gray-900 sm:px-6 sm:text-3xl lg:col-span-4 lg:max-w-5xl lg:px-0">
                    I am Maximilian Blazek a UX Designer with a focus on Machine Learning and Blockchain Applications.
                </p>
            </div>

            <div className="relative mx-auto max-w-xl px-4 sm:px-6 lg:max-w-5xl lg:px-8">
                <PortfolioItemRight title={"Talk"} url={"/talk"} imageUrl={"https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370945/portfolio/talk/Hero_y4nmks.png"}>
                    Everyone knows the numbing feeling that comes with a 50-slide PowerPoint presentation.
                    <br />
                    <br />
                    Talk is a concept of speech controlled presentations (powered by Machine Learning), that aims to solve the shortcomings of PowerPoint.
                </PortfolioItemRight>

                <PortfolioItemLeft className="bg-gray-50" title={"neueUX"} url={"/neueux"} imageUrl={"https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370908/portfolio/neueux/Hero_gvqwex.png"}>
                    For projects outside the blockchain space, designers have an endless supply of UX/UI resources. The exact opposite is true for the blockchain space.
                    <br />
                    <br />
                    neueUX.com is a platform dedicated to provide UI and UX ressources for blockchain applications.
                </PortfolioItemLeft>

                <PortfolioItemRight title={"MLRUG"} url={"/mlrug"} imageUrl={"https://res.cloudinary.com/drsfxkvt1/image/upload/v1659467706/portfolio/MLRUG/Hero2_qpj0sb.png"}>
                    Generative algorithms will play an increasingly important role in the working process of designers, perhaps placing the designer in the role of curator rather than creator.
                    <br />
                    <br />
                    MLRUG is a personal project where I experimented with generative adversarial networks (GANs) as a tool for carpet design.
                </PortfolioItemRight>

                <PortfolioItemLeft title={"Knowledgement"} url={"/knowledgement"} imageUrl={"https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370880/portfolio/knowledgement/Hero_xsqlow.jpg"}>
                    It is often difficult to store the knowledge gained in a meeting in such a way that it is actionable and does not get lost.
                    <br />
                    <br />
                    Knowledgement is a concept about personalized meeting protocols on the basis of an intelligent knowledge management system.
                </PortfolioItemLeft>

                <PortfolioItemRight
                    title={"Portfolio Cover Page"}
                    url={"/portfoliocover"}
                    imageUrl={"https://res.cloudinary.com/drsfxkvt1/image/upload/v1659467877/portfolio/portfolio%20cover/Hero_zsvnje.png"}>
                    The browser is getting more capable by the day. The ability to run 3D games, Python, and resource-intensive neural networks locally in the browser is exciting.
                    <br />
                    <br />I took the opportunity of revamping my portfolio website to learn one of these interesting technologies: Three.js.
                </PortfolioItemRight>

                <PortfolioItemLeft title={"Graphics"} url={"/graphics"} imageUrl={"https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370848/portfolio/graphics/Hero_et9sdw.png"}>
                    I enjoy making vector graphics and animations as a hobby.
                    <br />
                    <br />
                    This page is a selection of some of those graphics and animations I made over the years in a university, work and personal context.
                </PortfolioItemLeft>
            </div>
        </div>
    )
}

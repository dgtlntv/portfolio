import { createFileRoute } from "@tanstack/react-router"
import PortfolioItem from "../components/PortfolioItem/PortfolioItem"

export const Route = createFileRoute("/portfolio")({
    component: Portfolio,
})

function Portfolio() {
    return (
        <div className="overflow-hidden pb-16 pt-0 lg:py-12">
            <div className="mx-auto grid grid-cols-1 items-center gap-8 px-6 lg:max-w-5xl lg:grid-cols-5 lg:px-16 lg:py-6">
                <img
                    className="mx-auto h-40 rounded-full lg:mx-0 lg:h-28"
                    src="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659375088/portfolio/profile_pic_wzxape.jpg"
                    alt=""
                />
                <p className="mx-auto max-w-xl px-4 font-fancy text-2xl font-medium tracking-tight text-gray-900 sm:px-6 sm:text-3xl lg:col-span-4 lg:max-w-5xl lg:px-0">
                    I am Maximilian Blazek a UX Designer with a focus on
                    Enterprise applications and Design systems.
                </p>
            </div>

            <div className="relative mx-auto max-w-xl px-4 sm:px-6 lg:max-w-5xl lg:px-8">
                <PortfolioItem
                    title="Talk"
                    url="/talk"
                    imageUrl="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370945/portfolio/talk/Hero_y4nmks.png"
                >
                    Everyone knows the numbing feeling that comes with a
                    50-slide PowerPoint presentation.
                    <br />
                    <br />
                    Talk is a concept of speech controlled presentations
                    (powered by Machine Learning), that aims to solve the
                    shortcomings of PowerPoint.
                </PortfolioItem>

                <PortfolioItem
                    title="MLRUG"
                    url="/mlrug"
                    imageUrl="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659467706/portfolio/MLRUG/Hero2_qpj0sb.png"
                >
                    Generative algorithms will play an increasingly important
                    role in the working process of designers, perhaps placing
                    the designer in the role of curator rather than creator.
                    <br />
                    <br />
                    MLRUG is a personal project where I experimented with
                    generative adversarial networks (GANs) as a tool for carpet
                    design.
                </PortfolioItem>
            </div>
        </div>
    )
}

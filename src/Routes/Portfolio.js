import PortfolioItemRight from "../Components/PortfolioItemRight";
import PortfolioItemLeft from "../Components/PortfolioItemLeft";

export default function Portfolio() {
    return (
        <div className="py-16 overflow-hidden lg:py-12">
            <div className="lg:max-w-5xl lg:grid lg:grid-cols-5 lg:gap-8 mx-auto lg:px-8 items-center p-6">
                <img className="rounded-full h-28" src="/profile_pic.jpg" />
                <p className="text-2xl font-medium text-gray-900 tracking-tight sm:text-3xl lg:col-span-4">
                    I am Maximilian Blazek a UX Designer with a focus on Machine Learning and Blockchain Applications.
                </p>
            </div>

            <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-5xl">
                <PortfolioItemRight title={"neueUX"} url={"/neueux"} imageUrl={"https://tailwindui.com/img/features/feature-example-1.png"}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit ex obcaecati natus eligendi delectus, cum deleniti sunt in labore
                    nihil quod quibusdam expedita nemo.
                </PortfolioItemRight>

                <PortfolioItemLeft
                    title={"Portfolio with Rust"}
                    url={"/website"}
                    imageUrl={"https://tailwindui.com/img/features/feature-example-2.png"}
                >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit ex obcaecati natus eligendi delectus, cum deleniti sunt in labore
                    nihil quod quibusdam expedita nemo.
                </PortfolioItemLeft>

                <PortfolioItemRight title={"Talk"} url={"/talk"} imageUrl={"https://tailwindui.com/img/features/feature-example-1.png"}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit ex obcaecati natus eligendi delectus, cum deleniti sunt in labore
                    nihil quod quibusdam expedita nemo.
                </PortfolioItemRight>

                <PortfolioItemLeft
                    title={"Knowledgement"}
                    url={"/knowledgement"}
                    imageUrl={"https://tailwindui.com/img/features/feature-example-2.png"}
                >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit ex obcaecati natus eligendi delectus, cum deleniti sunt in labore
                    nihil quod quibusdam expedita nemo.
                </PortfolioItemLeft>

                <PortfolioItemRight title={"Dadadazed"} url={"/dadadazed"} imageUrl={"https://tailwindui.com/img/features/feature-example-1.png"}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit ex obcaecati natus eligendi delectus, cum deleniti sunt in labore
                    nihil quod quibusdam expedita nemo.
                </PortfolioItemRight>

                <PortfolioItemLeft title={"Graphics"} url={"/graphics"} imageUrl={"https://tailwindui.com/img/features/feature-example-2.png"}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit ex obcaecati natus eligendi delectus, cum deleniti sunt in labore
                    nihil quod quibusdam expedita nemo.
                </PortfolioItemLeft>
            </div>
        </div>
    );
}

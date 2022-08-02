import TalkAnimation from "./TalkAnimation"

export default function TalkHeroAnimation() {
    return (
        <div className="not-prose">
            <div className=" relative mt-16 mb-12 lg:mt-40">
                <div className="mx-auto mt-6 max-w-6xl px-4 sm:mt-10 sm:px-6">
                    <div className="lg:text-center">
                        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-7xl">
                            <span className="font-head leading-tight">
                                Holding presentations just with <span className="font-logo text-primary">Talk.</span>
                            </span>
                        </h1>
                    </div>
                </div>
            </div>

            <div className="mx-auto mb-24 max-w-4xl">
                <TalkAnimation />
            </div>
        </div>
    )
}

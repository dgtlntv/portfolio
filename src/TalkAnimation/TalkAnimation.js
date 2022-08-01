import Lottie from "react-lottie-player"
import talk_animation from "../talk_animation.json"

export default function TalkAnimation() {
    return (
        <div className="relative aspect-video self-center px-2 sm:px-8 lg:mb-8 lg:min-h-0 lg:max-w-full lg:flex-1 lg:px-0">
            <Lottie loop animationData={talk_animation} play rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }} className="overflow-hidden rounded-lg shadow-md" />
            <video className="absolute -bottom-10 -left-6 z-50 h-32 rounded-full bg-yellow-400 shadow-xl sm:left-0 sm:h-36 md:-left-14 md:h-48 lg:-bottom-28 lg:-left-48 lg:h-72" autoPlay muted loop>
                <source src="https://res.cloudinary.com/drsfxkvt1/video/upload/v1659371520/portfolio/talk/talk_fj8qnm.webm" type="video/webm"></source>
            </video>
        </div>
    )
}

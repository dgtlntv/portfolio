import Lottie from "react-lottie-player"
import preperation_animation from "../../../LottieAnimationFiles/preperation_animation.json"

export default function TalkExplanationAnimation() {
    return <Lottie speed={1.5} loop animationData={preperation_animation} play rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }} className="overflow-hidden " />
}

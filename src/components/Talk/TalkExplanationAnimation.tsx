import { Player } from '@lottiefiles/react-lottie-player';
import preparationAnimation from './animations/preperation_animation.json';

export default function TalkExplanationAnimation() {
    return (
        <Player 
            speed={1.5} 
            loop 
            src={preparationAnimation} 
            autoplay
            className="overflow-hidden" 
        />
    );
}
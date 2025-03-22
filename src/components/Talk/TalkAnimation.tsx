import { Player } from '@lottiefiles/react-lottie-player';
import talkAnimation from './animations/talk_animation.json';

export default function TalkAnimation() {
    return (
        <div className="relative aspect-video self-center px-2 sm:px-8 lg:mb-8 lg:min-h-0 lg:max-w-full lg:flex-1 lg:px-0">
            <Player 
                loop 
                src={talkAnimation} 
                autoplay
                className="overflow-hidden rounded-lg shadow-md" 
            />
            <video 
                className="absolute -bottom-10 -left-12 z-50 h-32 rounded-full bg-yellow-400 shadow-xl sm:left-0 sm:h-36 md:-left-14 md:h-48 lg:-bottom-28 lg:-left-48 lg:h-72" 
                autoPlay 
                muted 
                loop
            >
                <source src="https://res.cloudinary.com/drsfxkvt1/video/upload/v1659534498/portfolio/talk/n6conwrmbobliu88uh9g_qu3deu.webm" type="video/webm" />
            </video>
        </div>
    );
}
import Article from "../Components/Articles/Article"
import ArticleTextWrapper from "../Components/Articles/ArticleTextWrapper"
import FloatRightWrapper from "../Components/Articles/FloatRightWrapper"
import FloatRightFigure from "../Components/Articles/FloatRightFigure"
import ImageGallery from "../Components/Articles/ImageGallery"

export default function Neueux() {
    const ScreenshotsNeueUX = {
        images: [
            {
                id: 1,
                name: "Screenshot 1",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370909/portfolio/neueux/screenshot_1_atn7vt.png",
                alt: "Screenshot 1",
            },
            {
                id: 2,
                name: "Screenshot 2",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370909/portfolio/neueux/screenshot_2_ox1gbg.png",
                alt: "Screenshot 2",
            },
            {
                id: 3,
                name: "Screenshot 3",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370909/portfolio/neueux/screenshot_3_qsjxt7.png",
                alt: "Screenshot 3",
            },
            {
                id: 4,
                name: "Screenshot 4",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370909/portfolio/neueux/screenshot_4_jipb4s.png",
                alt: "Screenshot 4",
            },
            {
                id: 5,
                name: "Screenshot 5",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370908/portfolio/neueux/screenshot_5_zrszlu.png",
                alt: "Screenshot 5",
            },
        ],
    }

    const stats = [
        { label: "Context", value: "Work Project" },
        { label: "Period", value: "6 months" },
    ]

    return (
        <Article stats={stats} title="neueUX" heroLocation="center" heroUrl="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370908/portfolio/neueux/Hero_gvqwex.png">
            <ArticleTextWrapper>
                <h2 className="mb-6">Problem</h2>
                <FloatRightWrapper>
                    <FloatRightFigure>
                        <video autoPlay muted loop>
                            <source src="https://res.cloudinary.com/drsfxkvt1/video/upload/v1659534554/portfolio/neueux/t2gpw4cz1aeboyhpmqdj_aoitv1.webm" type="video/webm"></source>
                        </video>
                        <figcaption>A fraction of the design resources available on designnotes.co.</figcaption>
                    </FloatRightFigure>

                    <p className="order-first">
                        While researching common UX pitfalls in blockchain apps at my previous employer{" "}
                        <a href="https://apeunit.com/" target="_blank" rel="noreferrer">
                            ApeUnit
                        </a>{" "}
                        , I realized how few free resources are available to start blockchain projects' design process. For projects outside the blockchain space, designers and developers have an
                        endless supply of UX/UI resources (like the ones found at{" "}
                        <a target="_blank" href="https://designnotes.co" rel="noreferrer">
                            designnotes.co
                        </a>
                        ). There's a whole world of resources for finding inspiration or UX best practices for nearly every niche app, website, or product. The exact opposite is true for the
                        blockchain space — where I couldn't find anything similar.
                    </p>
                    <p className="order-last">
                        Blockchain is a technically complex subject that still in its infancy. So, most of the discussion on Blockchain user experiences occurs within developers' circles held at a
                        very high technical level that few designers will be able to follow. These problems create a significant barrier to entry that most designers are not willing to surmount.
                        Unsurprisingly, there aren’t many user experience designers who have broken into this field. Because of this barrier to entry, many blockchain startups have to start their
                        design process from scratch, as with few freely available design resources, and without people who possess the necessary design experience to avoid having to start from square
                        one. Even if there are designers or design-savvy developers in a blockchain company, their daily work process is likely to be slower than what’s necessary, because of the lack
                        of design resources and standardized design patterns to draw upon. These problems have caused the relatively poor UX that most blockchain apps have, despite the industry’s
                        rapid maturation in recent years.
                    </p>
                </FloatRightWrapper>

                <h2 className="mb-6">Idea</h2>
                <p>
                    To make blockchain more accessible to everyone, there needs to be an open innovation process that facilitates discussions between developers and designers. By including designers
                    in the development process of decentralized apps and providing a better starting point for common UX challenges in blockchain, we will improve the overall user experience of
                    blockchain applications.
                    <p>
                        <strong>I believe many problems could be mitigated by a platform that offers the following resources:</strong>
                    </p>
                </p>
                <ul>
                    <li>Blockchain UX case studies</li>
                    <li>Blockchain UX best practices</li>
                    <li>Collection of screenshots of popular blockchain applications</li>
                    <li>Blockchain specific iconography</li>
                    <li>Blockchain specific illustrations</li>
                    <li>Blockchain UI kit</li>
                    <li>Interviews with designers working in blockchain</li>
                    <li>Blockchain UX/UI specific news</li>
                </ul>
                <p>
                    These resources should make it easier for designers to work in the blockchain space. Thats why I then approached my previouse employer{" "}
                    <a href="https://apeunit.com/" rel="noreferrer" target="_blank">
                        ApeUnit
                    </a>{" "}
                    with the idea of{" "}
                    <a href="https://www.neueux.com" rel="noreferrer" target="_blank">
                        neueUX.com
                    </a>{" "}
                    , an open-source platform that provides these design resources and discusses common design patterns in a decentralized industry. NeueUX goal was to provide a good starting point to
                    learn about design issues in blockchain and offer resources that make the daily work of designing blockchain applications easier and faster.
                </p>
                <h2 className="mb-6">Implementation</h2>
                <FloatRightWrapper>
                    <FloatRightFigure>
                        <ImageGallery content={ScreenshotsNeueUX} />
                    </FloatRightFigure>

                    <p className="order-first">
                        The idea was well received, so we decided to apply for a grant at{" "}
                        <a href="https://molochdao.com/" target="_blank" rel="noreferrer">
                            MolochDAO
                        </a>
                        , one of the first grant giving DAOs. There, we received a grant to implement an initial version of neueUX, which included a gallery of screenshots of popular blockchain
                        applications and a series of articles about the most common UX pitfalls in blockchain. I took on the project lead for this project and in a time frame of about 6 months we
                        designed and implemented the platform and created the content.
                    </p>

                    <p className="order-last">
                        I unfortunately left Berlin and ApeUnit relatively soon after the first release and it seems that without me advocating for the platform ApeUnit decided not to further pursue
                        the development of the platform. Nevertheless, neueux is still online and hopefully its articles and screenshots will help at least some people take their first steps in
                        blockchain.
                    </p>
                </FloatRightWrapper>
            </ArticleTextWrapper>
        </Article>
    )
}

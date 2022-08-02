import Article from "../Components/Articles/Article"
import FloatRightWrapper from "../Components/Articles/FloatRightWrapper"
import FloatRightFigure from "../Components/Articles/FloatRightFigure"
import ImageGallery from "../Components/Articles/ImageGallery"
import ArticleTextWrapper from "../Components/Articles/ArticleTextWrapper"

export default function Graphics() {
    const SprechenUberPoster = {
        images: [
            {
                id: 1,
                name: "Poster 1",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370835/portfolio/graphics/posters/p1_bzaqqo.jpg",
                alt: "Poster 1",
            },
            {
                id: 2,
                name: "Poster 2",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370836/portfolio/graphics/posters/p2_lfqesw.jpg",
                alt: "Poster 2",
            },
            {
                id: 3,
                name: "Poster 3",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370836/portfolio/graphics/posters/p3_gjdomi.jpg",
                alt: "Poster 3",
            },
            {
                id: 4,
                name: "Poster 4",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370836/portfolio/graphics/posters/p4_oaooxs.jpg",
                alt: "Poster 4",
            },
            {
                id: 5,
                name: "Poster 5",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370836/portfolio/graphics/posters/p5_lmv7xh.jpg",
                alt: "Poster 5",
            },
            {
                id: 6,
                name: "Poster 6",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370836/portfolio/graphics/posters/p6_mv7wxp.jpg",
                alt: "Poster 6",
            },
        ],
    }

    const KnowledgementPoster = {
        images: [
            {
                id: 1,
                name: "Poster 1",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370810/portfolio/graphics/knowledgement/knowledgement_poster_nwnfi9.jpg",
                alt: "Poster 1",
            },
            {
                id: 2,
                name: "Poster 2",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370809/portfolio/graphics/knowledgement/ussr_poster_he5myj.jpg",
                alt: "Poster 2",
            },
        ],
    }

    const stats = [
        { label: "Context", value: "University & Personal Projects" },
        { label: "Period", value: "2018 - now" },
    ]

    return (
        <Article stats={stats} title="Graphics" heroUrl="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370848/portfolio/graphics/Hero_et9sdw.png">
            <ArticleTextWrapper>
                <h2 className="mb-0">SprechenÜber</h2>

                <FloatRightWrapper>
                    <FloatRightFigure>
                        <ImageGallery content={SprechenUberPoster} />
                    </FloatRightFigure>
                    <p>
                        SprechenÜber (which means 'talking about') is a student organized talk series at my university about all things design. From the wintersemester of 2018/19 until the
                        wintersemester of 2019/20 me and a colleague of mine organize these talks. Because of a lack of a proper CD, I designed one when we took over. The logo is a deconstruction of
                        the name SprechenÜber, so that the two r's create a bracket for the title of the talk. Our main goal with the CD was to make our posters as easily readable as possible, aswell
                        as having a high recognition value. In parallel to the poster we also developed formats for digital distribution on social media platforms, our website and our in campus
                        communication platform.
                    </p>
                </FloatRightWrapper>
                <h2 className="mb-0">Knowledgement</h2>

                <FloatRightWrapper>
                    <FloatRightFigure>
                        <ImageGallery content={KnowledgementPoster} />
                    </FloatRightFigure>
                    <p>
                        I made this graphic for the documentation of my university project Knowledgement. Knowledgement is a concept about personalized protocols on the basis of an intelligent
                        knowledge management system. With that in mind I tried to create a cover art that conveys easy access to the knowledge of an organisation at a moments notice. The motive was
                        inspired by a social awarness poster from the USSR called "Young People, Go to the Textile Industry" from the 1970s, which I found in the book "Designed in the USSR" (ISBN
                        9780714875576).
                    </p>
                </FloatRightWrapper>

                <div className="lg:mt-24">
                    <h2>Moon and Earth</h2>
                    <figure>
                        <video controls className="rounded-xl shadow-md">
                            <source
                                src="https://res.cloudinary.com/drsfxkvt1/video/upload/v1659370856/portfolio/graphics/optimized_Rueschenbeck_Animation_4k_60fps_isjvup.mp4"
                                type="video/mp4"></source>
                        </video>
                    </figure>

                    <p>
                        In my time working at NOMOS Glashütte my assignment often was to conceptualise visual marketing material for social media. One of which was for the special edition Tangente
                        Update Rüschenbeck. I found, that if you visualy deconstruct the watchface of the Tangente Update it almost looks like a moon orbiting a planet. So in my concept I reversed
                        that deconstruction, to make this clip, which was so well liked, that they ended up actually using it as marketing material on Instagram and the online shop of Rüschenbeck.
                    </p>
                </div>
            </ArticleTextWrapper>
        </Article>
    )
}

import Article from "../Components/Articles/Article"
import FloatRightWrapper from "../Components/Articles/FloatRightWrapper"
import FloatRightFigure from "../Components/Articles/FloatRightFigure"
import ImageGallery from "../Components/Articles/ImageGallery"
import ArticleTextWrapper from "../Components/Articles/ArticleTextWrapper"

export default function MLRUG() {
    const OriginalRugs = {
        images: [
            {
                id: 1,
                name: "Original 1",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370895/portfolio/MLRUG/optimized_og1_abjily.jpg",
                alt: "Original 1",
            },
            {
                id: 2,
                name: "Original 2",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370894/portfolio/MLRUG/optimized_og2_kntmvj.jpg",
                alt: "Original 2",
            },
            {
                id: 3,
                name: "Original 3",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370893/portfolio/MLRUG/optimized_og3_zn2xem.jpg",
                alt: "Original 3",
            },
            {
                id: 4,
                name: "Original 4",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370893/portfolio/MLRUG/optimized_og4_wuyclb.jpg",
                alt: "Original 4",
            },
            {
                id: 5,
                name: "Original 5",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370893/portfolio/MLRUG/optimized_og5_rpqo0a.jpg",
                alt: "Original 5",
            },
        ],
    }

    const GeneratedRugs = {
        images: [
            {
                id: 1,
                name: "Result 1",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370894/portfolio/MLRUG/optimized_test1_q0ickq.jpg",
                alt: "Result 1",
            },
            {
                id: 2,
                name: "Result 2",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370894/portfolio/MLRUG/optimized_test2_bsazdb.jpg",
                alt: "Result 2",
            },
            {
                id: 3,
                name: "Result 3",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370895/portfolio/MLRUG/optimized_test3_tp3e7l.jpg",
                alt: "Result 3",
            },
            {
                id: 4,
                name: "Result 4",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370895/portfolio/MLRUG/optimized_test4_w4wlpv.jpg",
                alt: "Result 4",
            },
            {
                id: 5,
                name: "Result 5",
                src: "https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370894/portfolio/MLRUG/optimized_test5_u7ssfr.jpg",
                alt: "Result 5",
            },
        ],
    }

    const stats = [
        { label: "Context", value: "Personal Project" },
        { label: "Period", value: "6 Months" },
    ]

    return (
        <Article stats={stats} title="MLRUG" heroLocation="center" heroUrl="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659467706/portfolio/MLRUG/Hero2_qpj0sb.png">
            <ArticleTextWrapper>
                <p>
                    In the design theory class at my college, we often discussed the role of machine learning algorithms and artificial intelligence in the design process. One conclusion from this
                    discussion was that generative algorithms will play an increasingly important role in the design process, to the point where the role of the designer might change from creator to
                    curator. With that in mind I wanted to do a project where I experiment with generative algorithms as a design tool.
                </p>

                <h2 className="mb-0">Data</h2>

                <FloatRightWrapper>
                    <FloatRightFigure>
                        <ImageGallery content={OriginalRugs} />
                    </FloatRightFigure>
                    <p>
                        As with so many machine learning projects, one of the biggest considerations for me was the data I would feed my generative algorithm with. I wanted to choose a design object
                        that I was reasonably familiar with, could get a sufficient amount of data, and could be represented as an image (since 3d generative design from scratch is much more
                        difficult). Through these considerations I chose Moroccan carpets. I am very familiar with Moroccan carpets, as my father deals with them, which also gives me access to image
                        data of Moroccan carpets. The data I could get through my father I supplemented with images from the internet which I collected with a web-crawler. In the end I was able to
                        obtain about 3000 images of Moroccan carpets. This is not a huge amount in the context of a generative algorithm, but enough to get reasonably useful results.
                    </p>
                </FloatRightWrapper>

                <h2>Algorithm and Computing</h2>
                <p>
                    I investigated various architectures and algorithms and finally settled on HyperGan. At the time, it was an appropriately powerful architecture for this project and was
                    specifically designed to lower the barrier to entry for artists and designers. For my first test, I ran HyperGAN on my laptop, but I quickly realized that my laptop's graphics card
                    (GTX1050) would not be sufficient for a full run. So I turned to a cloud solution. In the process, I landed on Paperspace, which is based on AWS but offers a simpler user
                    experience and is optimized for machine learning. There, I did a number of different runs with my data, using different resolutions and parameters. In the end, I found that
                    HyperGAN's default algorithm and a resolution of 256x256 worked best for me.
                </p>

                <h2 className="mb-0">Results</h2>
                <FloatRightWrapper>
                    <FloatRightFigure>
                        <ImageGallery content={GeneratedRugs} />
                    </FloatRightFigure>
                    <p>
                        I wouldn't call the results perfect, but for the amount of data and technical knowledge I had, I think they were reasonable. At this point, it's clear that training an
                        algorithm on a small scale like this isn't really going to replace a designer's design process. But it can serve as inspiration. And it definitely did in this project. I'm
                        currently working with my father to produce a rug (in Morocco) inspired by the designs that came through this GAN.
                    </p>
                </FloatRightWrapper>
            </ArticleTextWrapper>
        </Article>
    )
}

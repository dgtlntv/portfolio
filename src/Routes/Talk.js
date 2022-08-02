import Article from "../Components/Articles/Article"
import FloatRightWrapper from "../Components/Articles/FloatRightWrapper"
import FloatRightFigure from "../Components/Articles/FloatRightFigure"
import TalkHeroAnimation from "../Components/Articles/Talk/TalkHeroAnimation"
import TalkExplanationAnimation from "../Components/Articles/Talk/TalkExplanationAnimation"
import ArticleTextWrapper from "../Components/Articles/ArticleTextWrapper"

export default function Talk() {
    const stats = [
        { label: "Context", value: "Bachelor Thesis" },
        { label: "Period", value: "6 Months" },
    ]

    return (
        <Article stats={stats} title="Talk" heroLocation="start" heroUrl="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370945/portfolio/talk/Hero_y4nmks.png">
            <ArticleTextWrapper>
                <h2 className="mb-0">Problem</h2>
                <FloatRightWrapper>
                    <FloatRightFigure>
                        <img src="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370946/portfolio/talk/NASA_fk7r6c.png" alt="" />
                        <figcaption>PowerPoint Slide as seen in the report of the Nasa accident investigation committee.</figcaption>
                    </FloatRightFigure>

                    <p className="order-first">
                        Everyone knows the numbing feeling that comes with an 80-slide presentation. This phenomenon is often called Death by PowerPoint. A deadly boring presentation, in which the
                        interest of the recipient dies through "the PowerPoint" alone. Edward Tufte, a renowned scientist, even assigns partial blame for the crash of the space shuttle Columbia to
                        this phenomenon in the report of the Nasa accident investigation committee.
                    </p>
                    <p className="order-last">
                        It may not have as fatal consequences in most organizations as the space shuttle crash. It does, however, lead to an inefficient communication culture plagued by inattention,
                        misunderstandings, and the resulting extra expenditure of time, energy, and thus capital.
                    </p>
                </FloatRightWrapper>
            </ArticleTextWrapper>
            <TalkHeroAnimation />
            <ArticleTextWrapper>
                <p>
                    But what would a presentation look like that does justice to today's dynamic, flexible and interactive communication? The ideal situation would be one in which the person
                    presenting can speak freely and interact with the audience without having to worry about the navigation or layout of the presentation. The core idea of Talk is therefore to
                    automatically create the navigation of the visualizations and the structuring elements (layout, animations, etc.) based on what is spoken. This means that during a presentation the
                    spoken words are recorded with a microphone and based on that the correct visualizations are displayed, arranged and animated.
                </p>

                <h2 className="mb-0">How it works</h2>

                <FloatRightWrapper>
                    <FloatRightFigure>
                        <TalkExplanationAnimation />
                        <figcaption>Connecting paragraphs of the script with visualizations.</figcaption>
                    </FloatRightFigure>
                    <p className="order-first">
                        Unlike traditional presentation software, Talk requires a script when creating the presentation. This script can consist of either complete sentences or meaningful keywords.
                        Passages from this script are then linked to the visualizations that are to be displayed when that passage is spoken.
                    </p>
                    <p className="order-last">
                        During the presentation, the person presenting speaks freely. What is spoken is recorded and analyzed by the software. The spoken word is compared with the passages from the
                        script, the most similar one is found and the associated visualization is displayed. It is important here that the comparison does not take place on the basis of keywords or
                        the like. The comparison takes place based on semantic content. This means that not the exact same words have to be pronounced as they appear in the script, but only the same
                        content. Furthermore, what is spoken is examined for sentiment, emphasis and figures of speech. The purpose of structuring elements in a presentation is to create a visual
                        hierarchy. That is, to emphasize what is of high (or low) importance at that moment in the presentation. In language, sentiment, emphasis, and figures of speech are used to
                        convey this hierarchy. Everyone has an intuitive sense of how to use these to convey what information is important in a (spoken) sentence. This hierarchy, already present in
                        language, can be translated into the visual to create structuring elements that have a strong relationship to what is being said.
                    </p>
                </FloatRightWrapper>

                <blockquote>
                    <p>
                        For example, if one were to say during a presentation, "We are going to implement X and Y. However, implementing Y is still a long way off." In the presentation, X would remain
                        in the foreground and Y would move to the background.
                    </p>
                </blockquote>
                <h2>Technology</h2>
                <p>
                    Talk differs from conventional presentation software by the described interaction concept and by the technologies, that make it possible. The technological core of Talk are Machine
                    Learning algorithms of the category{" "}
                    <a target="_blank" href="https://en.wikipedia.org/wiki/Natural_language_processing" rel="noreferrer">
                        Natural Language Processing
                    </a>{" "}
                    (techniques and methods for the machine processing of natural language). In particular, three subcategories of NLP are important to the function of of Talk:{" "}
                    <a target="_blank" href="https://en.wikipedia.org/wiki/Speech_recognition" rel="noreferrer">
                        Speech-to-Text
                    </a>
                    ,{" "}
                    <a target="_blank" href="https://en.wikipedia.org/wiki/Semantic_similarity" rel="noreferrer">
                        Semantic Similarity
                    </a>{" "}
                    and{" "}
                    <a target="_blank" href="https://en.wikipedia.org/wiki/Document_classification" rel="noreferrer">
                        Text Classification
                    </a>
                    .
                </p>
                <h2>Talk</h2>
                <p>
                    Talk would be completely new way of presenting and is not comparable to any offering on the market. All presentation programs currently available on the market are slide-based and
                    therefore have the same problems (including Prezi). Since both the structuring elements and the navigation are generated automatically, based on what is spoken, the person
                    presenting does not have to worry about the layout or navigation of the presentation, unlike traditional presentation software. This solves the shortcomings of PowerPoint and
                    creates a better presentation and communication culture:
                </p>
                <ul>
                    <li>One can respond to questions immediately. One does not have to navigate to the right slide first.</li>
                    <li>One can move freely on the "stage". One no longer has to stand by the laptop to navigate the presentation.</li>
                    <li>You are not tempted to read from slides.</li>
                    <li>Layouts no longer have to be created by hand.</li>
                    <ul>
                        <li>No more slides with 20 bullet points.</li>
                    </ul>
                </ul>
            </ArticleTextWrapper>
        </Article>
    )
}

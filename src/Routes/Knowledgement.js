import Article from "../Components/Articles/Article"
import ArticleTextWrapper from "../Components/Articles/ArticleTextWrapper"
import FloatRightWrapper from "../Components/Articles/FloatRightWrapper"
import FloatRightFigure from "../Components/Articles/FloatRightFigure"

export default function Knowledgement() {
    const stats = [
        { label: "Context", value: "University Project" },
        { label: "Period", value: "3 months" },
    ]

    return (
        <Article stats={stats} title="Knowledgement" heroLocation="start" heroUrl="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370880/portfolio/knowledgement/Hero_xsqlow.jpg">
            <ArticleTextWrapper>
                <h2>Problem</h2>
                <p>
                    It is often difficult to capture institutional knowledge and store it in a way that makes it easily retrievable and usable. In many organizations, moments of knowledge sharing
                    (e.g., meetings) are not captured, and knowledge is stored only in the minds of participants. Even when data from such events is captured, it is often not processed into knowledge,
                    but merely stored as data in a database where it expires. This makes it difficult for companies and organizations to retain institutional knowledge that is not tied to specific
                    individuals, leading to risk and inefficiency. In contrast to the traditional database that archives quantified data, knowledge management systems play with the idea of creating a
                    knowledge archive by capturing data, contextualizing it as information, and making it accessible to the user. What is missing in both forms of data management is a networked
                    archiving of information, as well as the lack of implicit knowledge. Even structures that are laboriously organized through keywording lack intelligent contextualization.
                </p>
                <h2>Idea</h2>
                <p>
                    Artificial intelligence can not only capture the enormous amount of data, but also contextualize and process it simultaneously. It can - instead of a folder-based structure - link
                    data and reveal causalities that are not apparent to a human. In addition, personalized search results and protocols can be generated in which all relevant implicit information is
                    included in a processed form.
                </p>
                <p>
                    A meeting situation in a corporate context is chosen as an exemplary illustration of the concept. By systematically recording and structuring exchanged information, personalized
                    protocols are created for direct and indirect stakeholders. In this form of protocolling explicit information as well as implicit data like intensity of what was said, intention
                    and personal relations are visualized. Thus, a largely unbiased and differentiated presentation of the meeting - adapted to the respective actors - is provided. In addition, the
                    basic framework of a user-oriented knowledge management system is conceptually elaborated and described. User-orientedness here means, on the one hand, ensuring intuitive access in
                    the form of PULL functions to the information contained in the archive. On the other hand, to provide suggestions in the form of PUSH functions on the basis of the networked
                    archive, which provides further information relevant to the individual search query.
                </p>
                <h2>Ordinary Flow</h2>
            </ArticleTextWrapper>

            <figure className="overflow-y-auto">
                <img className="mt-12 max-w-7xl lg:mx-auto" alt="" src="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370880/portfolio/knowledgement/normal_flow_ccbxua.png" />
            </figure>

            <ArticleTextWrapper>
                <div className="prose prose-xl prose-zinc prose-red mx-auto mt-16 font-sans">
                    <p>This flow depicts pain-points and possible sources of error in the manual recording of a meeting. The meeting is about the design of visual material.</p>
                    <h2>Knowledgement Flow</h2>
                </div>
            </ArticleTextWrapper>

            <figure className="overflow-y-auto">
                <img className="mt-12 max-w-7xl lg:mx-auto" alt="" src="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370880/portfolio/knowledgement/knowledgement_flow_fvl7j1.png" />
            </figure>

            <ArticleTextWrapper>
                <p>
                    Throughout the meeting, Knowledgement captures and structures exchanged data and information. Speech- and image recognition systems are constantly getting better at interpreting
                    even complex meeting situations. Knowledgement composes information according to a search request and offers aggregated, as well as interpreted and transcribed protocols,
                    optionally complemented by the meeting’s key scenes in the form of video sequences.
                </p>

                <p>
                    The personalized protocols of the Knowledgement are segmented into different layers of complexity. The layers differ in quantity and personalized preparation of the contained
                    information. The user does not have to read all through a uniform continuous text, but has all individually relevant content at only one glance. It is up to the user with which
                    amount of unfiltered information he/she is confronted by navigating through the different layers.
                </p>
                <FloatRightWrapper>
                    <h2>User Interface</h2>
                    <FloatRightFigure>
                        <img src="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659370880/portfolio/knowledgement/Interface_nnrg5b.jpg" alt="" />
                    </FloatRightFigure>
                    <h3 className="mt-0">Personalized Space</h3>
                    <p>
                        All personally relevant topics discussed in the meeting, as well as votes and commentaries are shown here. Also metadata like the number of attached files, attendees, place and
                        date are displayed.
                    </p>
                    <h3 className="mt-0">Protocol</h3>
                    <p>The protocol represents a cleaned version of the transcript. Expressions are edited and cut for a better reading flow, though content is not distorted.</p>
                    <h3 className="mt-0">Transcript</h3>
                    <p>The transcript is the unadjusted, raw written record of the meeting.</p>
                    <h3 className="mt-0">Video</h3>
                    <p>The video layer shows an uncut video-recording of the meeting.</p>
                </FloatRightWrapper>
                <p>
                    The personalization of the protocol depends on the attendees’ different roles. The AI contextualizes discussed topics and provides differently filtered content depending on the
                    recipient.
                </p>
            </ArticleTextWrapper>

            <div className="mt-16 grid grid-cols-1 gap-12 lg:mx-auto lg:max-w-7xl lg:grid-cols-2 ">
                <div>
                    <img src="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659469698/portfolio/knowledgement/vergleich1_itkbrc_l532di.png" alt="" />
                    <ArticleTextWrapper>
                        <h3>Graphic Designer’s main topics</h3>
                        <p>
                            In the example of the poster, content regarding the formal aesthetics are relevant for the designer. He/She finds evaluations and opinions about formal aspects of the
                            design.
                        </p>
                    </ArticleTextWrapper>
                </div>
                <div>
                    <img src="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659469698/portfolio/knowledgement/vergleich2_gu3zln_mw0tk3.png" alt="" />
                    <ArticleTextWrapper>
                        <h3>Financial Officer’s main topics</h3>
                        <p>
                            Questions that go beyond the poster’s design are relevant for the financial officer. The focus in his/her personalized space lies on financing and logistics, as well as
                            votes concerning the print run.
                        </p>
                    </ArticleTextWrapper>
                </div>
            </div>
        </Article>
    )
}

import FloatContent from "../components/Content/FloatContent.astro"
import AnimatedImage from "../components/Content/Image/AnimatedImage.astro"
import FanImages from "../components/Content/Image/FanImages.astro"
import DocumentSkeleton from "../components/Content/Embeds/DocumentSkeleton.astro"
import ColorPaletteMockup from "../components/Content/Embeds/ColorPaletteMockup.astro"
import MetricsMockup from "../components/Content/Embeds/MetricsMockup.astro"
import TalkExplanationAnimation from "../components/Content/Embeds/Talk/TalkExplanationAnimation.astro"
import TalkHeroAnimation from "../components/Content/Embeds/Talk/TalkHeroAnimation.astro"
import MDXParagraph from "../components/Content/MDX/MDXParagraph.astro"
import MDXH1 from "../components/Content/MDX/MDXH1.astro"
import MDXH2 from "../components/Content/MDX/MDXH2.astro"
import MDXH3 from "../components/Content/MDX/MDXH3.astro"
import MDXH4 from "../components/Content/MDX/MDXH4.astro"
import MDXH5 from "../components/Content/MDX/MDXH5.astro"
import MDXH6 from "../components/Content/MDX/MDXH6.astro"
import MDXUnorderedList from "../components/Content/MDX/MDXUnorderedList.astro"
import MDXOrderedList from "../components/Content/MDX/MDXOrderedList.astro"
import MDXListItem from "../components/Content/MDX/MDXListItem.astro"
import MDXBlockquote from "../components/Content/MDX/MDXBlockquote.astro"
import MDXAnchor from "../components/Content/MDX/MDXAnchor.astro"
import MDXPre from "../components/Content/MDX/MDXPre.astro"
import MDXCode from "../components/Content/MDX/MDXCode.astro"
import MDXImage from "../components/Content/MDX/MDXImage.astro"
import MDXFigure from "../components/Content/MDX/MDXFigure.astro"

export const components = {
    FloatContent,
    AnimatedImage,
    FanImages,
    DocumentSkeleton,
    ColorPaletteMockup,
    MetricsMockup,
    TalkExplanationAnimation,
    TalkHeroAnimation,
    MDXFigure,
    p: MDXParagraph,
    h1: MDXH1,
    h2: MDXH2,
    h3: MDXH3,
    h4: MDXH4,
    h5: MDXH5,
    h6: MDXH6,
    ul: MDXUnorderedList,
    ol: MDXOrderedList,
    li: MDXListItem,
    blockquote: MDXBlockquote,
    a: MDXAnchor,
    pre: MDXPre,
    code: MDXCode,
    img: MDXImage,
}

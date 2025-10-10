import FloatImage from "./Article/FloatImage.astro"
import FanImages from "./Article/FanImages.astro"
import DocumentSkeleton from "./DocumentSkeleton.astro"
import ColorPaletteMockup from "./ColorPaletteMockup.astro"
import MetricsMockup from "./MetricsMockup.astro"
import TalkExplanationAnimation from "./Talk/TalkExplanationAnimation.astro"
import TalkHeroAnimation from "./Talk/TalkHeroAnimation.astro"
import MDXParagraph from "./Content/MDX/MDXParagraph.astro"
import MDXH1 from "./Content/MDX/MDXH1.astro"
import MDXH2 from "./Content/MDX/MDXH2.astro"
import MDXH3 from "./Content/MDX/MDXH3.astro"
import MDXH4 from "./Content/MDX/MDXH4.astro"
import MDXH5 from "./Content/MDX/MDXH5.astro"
import MDXH6 from "./Content/MDX/MDXH6.astro"
import MDXUnorderedList from "./Content/MDX/MDXUnorderedList.astro"
import MDXOrderedList from "./Content/MDX/MDXOrderedList.astro"
import MDXListItem from "./Content/MDX/MDXListItem.astro"
import MDXBlockquote from "./Content/MDX/MDXBlockquote.astro"
import MDXAnchor from "./Content/MDX/MDXAnchor.astro"
import MDXPre from "./Content/MDX/MDXPre.astro"
import MDXCode from "./Content/MDX/MDXCode.astro"
import MDXImage from "./Content/MDX/MDXImage.astro"
import MDXFigure from "./Content/MDX/MDXFigure.astro"

export const components = {
    FloatImage,
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

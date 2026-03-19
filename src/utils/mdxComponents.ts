import FloatContent from "../components/embeds/FloatContent.astro"
import AnimatedImage from "../components/ui/images/AnimatedImage.astro"
import FanImages from "../components/ui/images/FanImages.astro"
import DocumentSkeleton from "../components/embeds/DocumentSkeleton.astro"
import ColorPaletteMockup from "../components/embeds/ColorPaletteMockup.astro"
import MetricsMockup from "../components/embeds/MetricsMockup.astro"
import DockitFlowDiagram from "../components/embeds/DockitFlowDiagram.astro"
import MDXParagraph from "../components/content/mdx/MDXParagraph.astro"
import MDXH1 from "../components/content/mdx/MDXH1.astro"
import MDXH2 from "../components/content/mdx/MDXH2.astro"
import MDXH3 from "../components/content/mdx/MDXH3.astro"
import MDXH4 from "../components/content/mdx/MDXH4.astro"
import MDXH5 from "../components/content/mdx/MDXH5.astro"
import MDXH6 from "../components/content/mdx/MDXH6.astro"
import MDXUnorderedList from "../components/content/mdx/MDXUnorderedList.astro"
import MDXOrderedList from "../components/content/mdx/MDXOrderedList.astro"
import MDXListItem from "../components/content/mdx/MDXListItem.astro"
import MDXBlockquote from "../components/content/mdx/MDXBlockquote.astro"
import MDXAnchor from "../components/content/mdx/MDXAnchor.astro"
import MDXPre from "../components/content/mdx/MDXPre.astro"
import MDXCode from "../components/content/mdx/MDXCode.astro"
import MDXImage from "../components/content/mdx/MDXImage.astro"
import MDXFigure from "../components/content/mdx/MDXFigure.astro"

export const components = {
    FloatContent,
    AnimatedImage,
    FanImages,
    DocumentSkeleton,
    ColorPaletteMockup,
    MetricsMockup,
    DockitFlowDiagram,
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

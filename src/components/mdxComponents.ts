// Import Astro components (static)
import FloatImage from "./Article/FloatImage.astro"
import FanImages from "./Article/FanImages.astro"
import DocumentSkeleton from "./DocumentSkeleton.astro"
import ColorPaletteMockup from "./ColorPaletteMockup.astro"
import MetricsMockup from "./MetricsMockup.astro"
import TalkExplanationAnimation from "./Talk/TalkExplanationAnimation.astro"
import TalkHeroAnimation from "./Talk/TalkHeroAnimation.astro"

// TODO: replace the custom html components with the ones from react

export const components = {
    FloatImage,
    FanImages,
    DocumentSkeleton,
    ColorPaletteMockup,
    MetricsMockup,
    TalkExplanationAnimation,
    TalkHeroAnimation,

    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    ul: "ul",
    ol: "ol",
    li: "li",
    blockquote: "blockquote",
    pre: "pre",
    code: "code",
    img: "img",
}

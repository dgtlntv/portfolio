// Import Astro components (static)
import FloatImage from "./Article/FloatImage.astro";
import FanImages from "./Article/FanImages.astro";
import DocumentSkeleton from "./DocumentSkeleton.astro";
import ColorPaletteMockup from "./ColorPaletteMockup.astro";
import MetricsMockup from "./MetricsMockup.astro";

// HTML element overrides with Tailwind styling
export const components = {
    // Custom components - Static (Astro)
    FloatImage,
    FanImages,
    DocumentSkeleton,
    ColorPaletteMockup,
    MetricsMockup,

    // GitHubCodeExplorer: (props) => <GitHubCodeExplorer {...props} client:load />,
    // TagList: (props) => <TagList {...props} client:load />,

    // HTML element overrides - simplified
    h1: 'h1',
    h2: 'h2', 
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    ul: 'ul',
    ol: 'ol',
    li: 'li',
    blockquote: 'blockquote',
    pre: 'pre',
    code: 'code',
    img: 'img',
};
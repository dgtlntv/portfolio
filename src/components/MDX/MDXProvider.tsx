import { MDXProvider as BaseMDXProvider } from "@mdx-js/react"
import React from "react"
import FloatImage from "../Article/FloatImage"
import FanImages from "../Article/FanImages"
import ImageGallery from "../Article/ImageGallery"
import DocumentSkeleton from "../DocumentSkeleton"
import MetricsMockup from "../MetricsMockup"
import ColorPaletteMockup from "../ColorPaletteMockup"
import { GitHubCodeExplorer } from "../GitHubCodeExplorer"
import { CodeBlock } from "./CodeBlock"
import { ErrorBoundary } from "./ErrorBoundary"
import { TagList } from "./TagList"
import { MDXProviderComponentProps } from "./types"

// Define custom components to use in MDX files
export const components = {
    // Text components
    p: (props: React.HTMLProps<HTMLParagraphElement>) => <p {...props} />,
    h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
        <h1 className="mt-8 mb-4 text-4xl font-bold" {...props} />
    ),
    h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
        <h2 className="mt-6 mb-3 text-3xl font-bold" {...props} />
    ),
    h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
        <h3 className="mt-5 mb-2 text-2xl font-bold" {...props} />
    ),
    h4: (props: React.HTMLProps<HTMLHeadingElement>) => (
        <h4 className="mt-4 mb-2 text-xl font-bold" {...props} />
    ),
    h5: (props: React.HTMLProps<HTMLHeadingElement>) => (
        <h5 className="mt-4 mb-2 text-lg font-bold" {...props} />
    ),
    h6: (props: React.HTMLProps<HTMLHeadingElement>) => (
        <h6 className="mt-4 mb-2 text-base font-bold" {...props} />
    ),
    ul: (props: React.HTMLProps<HTMLUListElement>) => (
        <ul className="my-4 list-disc pl-6" {...props} />
    ),
    ol: (props: React.HTMLProps<HTMLOListElement>) => (
        <ol className="my-4 list-decimal pl-6" {...props} />
    ),
    li: (props: React.HTMLProps<HTMLLIElement>) => (
        <li className="mb-1" {...props} />
    ),
    blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
        <blockquote
            className="my-4 border-l-4 border-gray-300 pl-4 italic"
            {...props}
        />
    ),
    a: (props: React.HTMLProps<HTMLAnchorElement>) => (
        <a {...props} />
    ),

    // Code blocks with syntax highlighting
    pre: (props: React.HTMLProps<HTMLPreElement>) => (
        <pre className="my-6 whitespace-pre overflow-x-auto text-sm font-mono bg-gray-100 p-4 rounded-sm" {...props} />
    ),
    code: (props: any) => {
        const { children, className } = props
        return className ? (
            <CodeBlock className={className}>{children}</CodeBlock>
        ) : (
            <code className="rounded bg-gray-100 px-1 py-0.5 text-sm font-mono whitespace-pre">
                {children}
            </code>
        )
    },

    // Images and figures
    img: (props: React.HTMLProps<HTMLImageElement>) => (
        <div className="relative mx-auto md:-mx-6 lg:-mx-8 xl:-mx-28 my-8 transition duration-700 ease-in-out hover:-translate-y-0.5 hover:rotate-[0.2deg] hover:transform-gpu">
            <img className="w-full h-auto rounded-lg transition duration-700 ease-in-out hover:scale-[1.01]" {...props} />
        </div>
    ),

    // Custom components
    FloatImage,
    FanImages,
    ImageGallery,
    DocumentSkeleton,
    MetricsMockup,
    ColorPaletteMockup,
    GitHubCodeExplorer,
    TagList,
}

export const MDXProvider: React.FC<MDXProviderComponentProps> = ({
    children,
}) => {
    return (
        <ErrorBoundary>
            <BaseMDXProvider components={components}>
                {children}
            </BaseMDXProvider>
        </ErrorBoundary>
    )
}

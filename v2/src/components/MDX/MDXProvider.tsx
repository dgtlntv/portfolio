import { MDXProvider as BaseMDXProvider } from "@mdx-js/react"
import React from "react"
import ArticleText from "../Article/ArticleText"
import FloatRightFigure from "../Article/FloatRightFigure"
import FloatRightWrapper from "../Article/FloatRightWrapper"
import ImageGallery from "../Article/ImageGallery"
import { CodeBlock } from "./CodeBlock"
import { ErrorBoundary } from "./ErrorBoundary"
import { TagList } from "./TagList"
import { MDXProviderComponentProps } from "./types"

// Define custom components to use in MDX files
export const components = {
    // Text components
    p: (props: React.HTMLProps<HTMLParagraphElement>) => (
        <ArticleText {...props} />
    ),
    h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
        <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />
    ),
    h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
        <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />
    ),
    h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
        <h3 className="text-2xl font-bold mt-5 mb-2" {...props} />
    ),
    h4: (props: React.HTMLProps<HTMLHeadingElement>) => (
        <h4 className="text-xl font-bold mt-4 mb-2" {...props} />
    ),
    h5: (props: React.HTMLProps<HTMLHeadingElement>) => (
        <h5 className="text-lg font-bold mt-4 mb-2" {...props} />
    ),
    h6: (props: React.HTMLProps<HTMLHeadingElement>) => (
        <h6 className="text-base font-bold mt-4 mb-2" {...props} />
    ),
    ul: (props: React.HTMLProps<HTMLUListElement>) => (
        <ul className="list-disc pl-6 my-4" {...props} />
    ),
    ol: (props: React.HTMLProps<HTMLOListElement>) => (
        <ol className="list-decimal pl-6 my-4" {...props} />
    ),
    li: (props: React.HTMLProps<HTMLLIElement>) => (
        <li className="mb-1" {...props} />
    ),
    blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
        <blockquote
            className="border-l-4 border-gray-300 pl-4 my-4 italic"
            {...props}
        />
    ),
    a: (props: React.HTMLProps<HTMLAnchorElement>) => (
        <a className="text-blue-600 hover:underline" {...props} />
    ),

    // Code blocks with syntax highlighting
    pre: (props: React.HTMLProps<HTMLPreElement>) => (
        <div className="my-6" {...props} />
    ),
    code: (props: any) => {
        const { children, className } = props
        return className ? (
            <CodeBlock className={className}>{children}</CodeBlock>
        ) : (
            <code className="bg-gray-100 rounded px-1 py-0.5 text-sm">
                {children}
            </code>
        )
    },

    // Images and figures
    img: (props: React.HTMLProps<HTMLImageElement>) => (
        <img className="rounded-lg my-4 mx-auto" {...props} />
    ),

    // Custom components
    FloatRightFigure,
    FloatRightWrapper,
    ImageGallery,
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

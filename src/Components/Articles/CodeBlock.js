import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function CodeBlock({ code }) {
    return (
        <SyntaxHighlighter showLineNumbers wrapLines language="jsx" style={a11yDark}>
            {code}
        </SyntaxHighlighter>
    )
}

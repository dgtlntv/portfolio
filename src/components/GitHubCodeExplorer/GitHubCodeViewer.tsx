import { Highlight, themes } from "prism-react-renderer"
import { GitHubCodeViewerProps } from "./types"

function getLanguageFromPath(filePath: string): string {
    const extension = filePath.split(".").pop()?.toLowerCase() || ""

    // Map extensions to Prism language identifiers
    const extensionMap: Record<string, string> = {
        js: "javascript",
        jsx: "jsx",
        ts: "typescript",
        tsx: "tsx",
        py: "python",
        rb: "ruby",
        php: "php",
        java: "java",
        c: "c",
        cpp: "cpp",
        cs: "csharp",
        go: "go",
        rs: "rust",
        swift: "swift",
        kt: "kotlin",
        dart: "dart",
        vue: "vue",
        svelte: "svelte",
        html: "html",
        htm: "html",
        xml: "xml",
        css: "css",
        scss: "scss",
        sass: "sass",
        less: "less",
        json: "json",
        yaml: "yaml",
        yml: "yaml",
        toml: "toml",
        md: "markdown",
        mdx: "mdx",
        sh: "bash",
        bash: "bash",
        zsh: "bash",
        fish: "bash",
        dockerfile: "docker",
        sql: "sql",
        graphql: "graphql",
        gql: "graphql",
    }

    return extensionMap[extension] || "text"
}

export function GitHubCodeViewer({
    filePath,
    fileContent,
    isLoading,
    error,
    owner,
    repo,
    branch = "main",
}: GitHubCodeViewerProps) {
    if (!filePath) {
        return (
            <div className="flex h-full items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-2 text-lg text-gray-400">
                        No file selected
                    </div>
                    <div className="text-sm text-gray-500">
                        Select a file from the explorer to view its contents
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-600"></div>
                    <div className="text-sm text-gray-500">
                        Loading file content...
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center bg-gray-50">
                <div className="max-w-md text-center">
                    <div className="mb-2 text-lg text-red-600">
                        Error loading file
                    </div>
                    <div className="text-sm text-gray-600">{error}</div>
                </div>
            </div>
        )
    }

    if (!fileContent) {
        return (
            <div className="flex h-full items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-2 text-lg text-gray-400">
                        File is empty
                    </div>
                    <div className="text-sm text-gray-500">
                        This file has no content
                    </div>
                </div>
            </div>
        )
    }

    const language = getLanguageFromPath(filePath)
    const fileName = filePath.split("/").pop() || filePath

    return (
        <div className="flex h-full w-full flex-col bg-white">
            {/* File header */}
            {owner && repo ? (
                <a
                    href={`https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-shrink-0 items-center border-b border-gray-200 bg-gray-50 px-4 py-2 no-underline"
                >
                    <div className="flex min-w-0 items-center space-x-2">
                        <div className="truncate text-sm font-medium text-gray-900">
                            {fileName}
                        </div>
                        <div className="truncate text-xs text-gray-500">
                            {filePath}
                        </div>
                    </div>
                </a>
            ) : (
                <div className="flex flex-shrink-0 items-center border-b border-gray-200 bg-gray-50 px-4 py-2">
                    <div className="flex min-w-0 items-center space-x-2">
                        <div className="truncate text-sm font-medium text-gray-900">
                            {fileName}
                        </div>
                        <div className="truncate text-xs text-gray-500">
                            {filePath}
                        </div>
                    </div>
                </div>
            )}

            {/* Code content */}
            <div className="relative min-h-0 flex-1 overflow-auto">
                <Highlight
                    theme={themes.vsLight}
                    code={fileContent}
                    language={language}
                >
                    {({
                        className,
                        style,
                        tokens,
                        getLineProps,
                        getTokenProps,
                    }) => (
                        <div className="flex min-w-max">
                            {/* Fixed line numbers */}
                            <div className="sticky left-0 z-10 flex-shrink-0 border-r border-gray-200 bg-gray-50">
                                <pre
                                    className="text-right text-sm"
                                    style={{
                                        fontFamily: "Courier Prime, monospace",
                                        backgroundColor: "#f9fafb",
                                        minHeight: "100%",
                                    }}
                                >
                                    {tokens.map((line, i) => (
                                        <div
                                            key={i}
                                            className="px-3 py-0.5 opacity-50 select-none"
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                </pre>
                            </div>
                            {/* Scrollable code content */}
                            <pre
                                className={`${className} flex-1 text-sm`}
                                style={{
                                    ...style,
                                    minHeight: "100%",
                                    backgroundColor: "#f9fafb",
                                    fontFamily: "Courier Prime, monospace",
                                }}
                            >
                                {tokens.map((line, i) => (
                                    <div
                                        key={i}
                                        {...getLineProps({ line, key: i })}
                                        className="px-4 py-0.5 whitespace-pre"
                                    >
                                        {line.map((token, key) => (
                                            <span
                                                key={key}
                                                {...getTokenProps({
                                                    token,
                                                    key,
                                                })}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </pre>
                        </div>
                    )}
                </Highlight>
            </div>
        </div>
    )
}

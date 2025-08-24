import React from "react"
import ReactMarkdown from "react-markdown"
import { components } from "../MDX/MDXProvider"

interface GitHubMarkdownViewerProps {
    filePath: string
    fileContent: string
    owner?: string
    repo?: string
    branch?: string
}

export function GitHubMarkdownViewer({
    filePath,
    fileContent,
    owner,
    repo,
    branch = "main",
}: GitHubMarkdownViewerProps) {
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

            {/* Markdown content */}
            <div className="relative min-h-0 flex-1 overflow-auto">
                <div className="prose prose-gray max-w-none p-6">
                    <ReactMarkdown components={components}>
                        {fileContent}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )
}
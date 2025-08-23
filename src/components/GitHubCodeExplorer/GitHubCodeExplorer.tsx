import { useState, useEffect } from "react"
import {
    LinkIcon,
    CodeBracketIcon,
    FolderIcon,
} from "@heroicons/react/24/outline"
import { GitHubCodeExplorerProps, FileNode, ApiError } from "./types"
import { GitHubFileExplorer } from "./GitHubFileExplorer"
import { GitHubCodeViewer } from "./GitHubCodeViewer"
import { fetchRepositoryTree, fetchFileContent } from "./githubApi"
import {
    getCachedData,
    setCachedData,
    updateCachedFileContent,
    clearExpiredCaches,
} from "./cache"

function GitHubRepoHeader({ owner, repo }: { owner: string; repo: string }) {
    const repoUrl = `https://github.com/${owner}/${repo}`

    return (
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-3">
            <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 no-underline transition-colors duration-200 hover:text-gray-900"
            >
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5 fill-slate-900"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
                    ></path>
                </svg>
                <div className="flex items-center gap-1 text-sm font-medium">
                    <span>{owner}</span>
                    <span className="text-gray-400">/</span>
                    <span>{repo}</span>
                </div>
            </a>
        </div>
    )
}

function RateLimitError({ owner, repo }: { owner: string; repo: string }) {
    const repoUrl = `https://github.com/${owner}/${repo}`

    return (
        <div className="not-prose flex h-[600px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
            <div className="max-w-md text-center">
                <div className="mb-2 text-lg font-semibold text-yellow-600">
                    Rate limit exceeded
                </div>
                <div className="mb-4 text-sm text-gray-600">
                    GitHub API rate limit has been reached. You can view the
                    repository directly on GitHub.
                </div>
                <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
                >
                    <LinkIcon className="h-4 w-4" />
                    View on GitHub
                </a>
            </div>
        </div>
    )
}

function ErrorState({
    error,
    owner,
    repo,
}: {
    error: ApiError
    owner: string
    repo: string
}) {
    if (error.type === "rate_limit") {
        return <RateLimitError owner={owner} repo={repo} />
    }

    const repoUrl = `https://github.com/${owner}/${repo}`

    return (
        <div className="not-prose flex h-[600px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
            <div className="max-w-md text-center">
                <div className="mb-2 text-lg font-semibold text-red-600">
                    Error loading repository
                </div>
                <div className="mb-4 text-sm text-gray-600">
                    {error.message}
                </div>
                <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
                >
                    <LinkIcon className="h-4 w-4" />
                    View on GitHub
                </a>
            </div>
        </div>
    )
}

export function GitHubCodeExplorer({
    owner,
    repo,
    branch = "main",
    className = "",
    defaultPath,
}: GitHubCodeExplorerProps) {
    const [fileTree, setFileTree] = useState<FileNode[]>([])
    const [currentPath, setCurrentPath] = useState<string | null>(null)
    const [fileContent, setFileContent] = useState<string | null>(null)
    const [isLoadingTree, setIsLoadingTree] = useState(true)
    const [isLoadingFile, setIsLoadingFile] = useState(false)
    const [treeError, setTreeError] = useState<ApiError | null>(null)
    const [fileError, setFileError] = useState<string | null>(null)
    const [showFileExplorer, setShowFileExplorer] = useState(true)

    // Helper function to check if a file exists in the tree
    const fileExists = (tree: FileNode[], path: string): boolean => {
        const checkNode = (nodes: FileNode[]): boolean => {
            for (const node of nodes) {
                if (node.path === path && node.type === "file") {
                    return true
                }
                if (node.children && checkNode(node.children)) {
                    return true
                }
            }
            return false
        }
        return checkNode(tree)
    }

    // Clear expired caches on mount
    useEffect(() => {
        clearExpiredCaches()
    }, [])

    // Load repository file tree
    useEffect(() => {
        async function loadFileTree() {
            setIsLoadingTree(true)
            setTreeError(null)

            // Check cache first
            const cachedData = getCachedData(owner, repo)
            if (cachedData) {
                setFileTree(cachedData.fileTree)
                setIsLoadingTree(false)
                // Try to auto-select default path if it exists
                if (
                    defaultPath &&
                    fileExists(cachedData.fileTree, defaultPath)
                ) {
                    handleFileSelect(defaultPath)
                }
                return
            }

            // Fetch from API
            const result = await fetchRepositoryTree(owner, repo, branch)

            if ("error" in result) {
                setTreeError(result.error)
            } else {
                setFileTree(result.data)
                // Cache the result
                setCachedData(owner, repo, {
                    fileTree: result.data,
                    fileContents: {},
                })
                // Try to auto-select default path if it exists
                if (defaultPath && fileExists(result.data, defaultPath)) {
                    handleFileSelect(defaultPath)
                }
            }

            setIsLoadingTree(false)
        }

        loadFileTree()
    }, [owner, repo, branch])

    // Load individual file content
    const handleFileSelect = async (filePath: string) => {
        setCurrentPath(filePath)
        setFileContent(null)
        setFileError(null)
        setIsLoadingFile(true)
        // Hide file explorer on mobile when a file is selected
        if (window.innerWidth < 768) {
            setShowFileExplorer(false)
        }

        // Check cache first
        const cachedData = getCachedData(owner, repo)
        if (cachedData && cachedData.fileContents[filePath]) {
            setFileContent(cachedData.fileContents[filePath])
            setIsLoadingFile(false)
            return
        }

        // Fetch from API
        const result = await fetchFileContent(owner, repo, filePath, branch)

        if ("error" in result) {
            setFileError(result.error.message)
        } else {
            setFileContent(result.data)
            // Cache the file content
            updateCachedFileContent(owner, repo, filePath, result.data)
        }

        setIsLoadingFile(false)
    }

    if (treeError) {
        return <ErrorState error={treeError} owner={owner} repo={repo} />
    }

    return (
        <div
            className={`not-prose flex h-[600px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
        >
            <GitHubRepoHeader owner={owner} repo={repo} />

            {/* Mobile toggle button */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 md:hidden">
                <button
                    onClick={() => setShowFileExplorer(!showFileExplorer)}
                    className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm transition-colors hover:bg-gray-50"
                >
                    {showFileExplorer ? (
                        <CodeBracketIcon className="h-4 w-4" />
                    ) : (
                        <FolderIcon className="h-4 w-4" />
                    )}
                    {showFileExplorer ? "Show Code" : "Show Files"}
                </button>
                {currentPath && (
                    <span className="ml-2 truncate text-xs text-gray-600">
                        {currentPath.split("/").pop()}
                    </span>
                )}
            </div>

            <div className="flex min-h-0 flex-1">
                {/* File Explorer - hidden on mobile when showFileExplorer is false */}
                <div
                    className={`${showFileExplorer ? "flex flex-1" : "hidden"} md:flex md:flex-none`}
                >
                    <GitHubFileExplorer
                        fileTree={fileTree}
                        currentPath={currentPath}
                        onFileSelect={handleFileSelect}
                        isLoading={isLoadingTree}
                    />
                </div>

                {/* Code Viewer - takes full width on mobile when file explorer is hidden */}
                <div
                    className={`${showFileExplorer ? "hidden md:flex" : "flex"} h-full min-w-0 flex-1`}
                >
                    <GitHubCodeViewer
                        filePath={currentPath}
                        fileContent={fileContent}
                        isLoading={isLoadingFile}
                        error={fileError}
                        owner={owner}
                        repo={repo}
                        branch={branch}
                    />
                </div>
            </div>
        </div>
    )
}

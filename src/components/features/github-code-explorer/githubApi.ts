import type {
    ApiError,
    FileNode,
    GitHubFileContent,
    GitHubTreeResponse,
} from "./types"

const GITHUB_API_ROOT = "https://api.github.com/repos"
const RATE_LIMIT_STATUS = 403
const NOT_FOUND_STATUS = 404
const utf8Decoder =
    typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8") : null

type DirectoryNode = FileNode & { children: FileNode[] }

function buildFileTree(treeItems: GitHubTreeResponse["tree"]): FileNode[] {
    const nodes: FileNode[] = []
    const directories = new Map<string, DirectoryNode>()

    const sortedItems = [...treeItems].sort((a, b) => {
        if (a.type === "tree" && b.type === "blob") return -1
        if (a.type === "blob" && b.type === "tree") return 1
        return a.path.localeCompare(b.path)
    })

    for (const item of sortedItems) {
        const pathParts = item.path.split("/")
        const fileName = pathParts[pathParts.length - 1]
        const node: FileNode = {
            name: fileName,
            path: item.path,
            type: item.type === "tree" ? "directory" : "file",
            size: item.size,
            ...(item.type === "tree" && { children: [] }),
        }

        if (pathParts.length === 1) {
            nodes.push(node)
            if (node.type === "directory") {
                directories.set(node.path, node as DirectoryNode)
            }
            continue
        }

        const parentPath = pathParts.slice(0, -1).join("/")
        const parentDir = directories.get(parentPath)

        if (parentDir) {
            parentDir.children.push(node)
            if (node.type === "directory") {
                directories.set(node.path, node as DirectoryNode)
            }
        }
    }

    return nodes
}

function decodeBase64Content(encoded: string): string {
    const cleanContent = encoded.replace(/\s/g, "")

    if (typeof globalThis.atob !== "function") {
        throw new Error("No base64 decoder available in this environment")
    }

    const binary = globalThis.atob(cleanContent)

    if (utf8Decoder) {
        const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
        return utf8Decoder.decode(bytes)
    }

    try {
        return decodeURIComponent(
            binary
                .split("")
                .map(
                    (char) =>
                        `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`,
                )
                .join(""),
        )
    } catch {
        return binary
    }
}

function buildRepositoryUrl(owner: string, repo: string, path: string): string {
    return `${GITHUB_API_ROOT}/${owner}/${repo}/${path}`
}

function toRateLimitError(): { error: ApiError } {
    return {
        error: {
            type: "rate_limit",
            message:
                "GitHub API rate limit exceeded. Try again later or view the repository directly on GitHub.",
        },
    }
}

function toNotFoundError(message: string): { error: ApiError } {
    return {
        error: {
            type: "not_found",
            message,
        },
    }
}

function toNetworkError(message: string): { error: ApiError } {
    return {
        error: {
            type: "network",
            message,
        },
    }
}

export async function fetchRepositoryTree(
    owner: string,
    repo: string,
    branch = "main",
): Promise<{ data: FileNode[] } | { error: ApiError }> {
    try {
        const url = buildRepositoryUrl(
            owner,
            repo,
            `git/trees/${branch}?recursive=1`,
        )
        const response = await fetch(url)

        if (response.status === RATE_LIMIT_STATUS) {
            const remaining = response.headers.get("X-RateLimit-Remaining")
            if (remaining === "0") {
                return toRateLimitError()
            }
        }

        if (!response.ok) {
            if (response.status === NOT_FOUND_STATUS) {
                return toNotFoundError(
                    "Repository not found or branch does not exist.",
                )
            }

            return toNetworkError(
                `Failed to fetch repository data: ${response.status} ${response.statusText}`,
            )
        }

        const data: GitHubTreeResponse = await response.json()
        return { data: buildFileTree(data.tree) }
    } catch (error) {
        return toNetworkError(
            error instanceof Error ? error.message : "Network error occurred",
        )
    }
}

export async function fetchFileContent(
    owner: string,
    repo: string,
    filePath: string,
    branch = "main",
): Promise<{ data: string } | { error: ApiError }> {
    try {
        const url = buildRepositoryUrl(
            owner,
            repo,
            `contents/${filePath}?ref=${branch}`,
        )
        const response = await fetch(url)

        if (response.status === RATE_LIMIT_STATUS) {
            const remaining = response.headers.get("X-RateLimit-Remaining")
            if (remaining === "0") {
                return toRateLimitError()
            }
        }

        if (!response.ok) {
            if (response.status === NOT_FOUND_STATUS) {
                return toNotFoundError("File not found.")
            }

            return toNetworkError(
                `Failed to fetch file: ${response.status} ${response.statusText}`,
            )
        }

        const data: GitHubFileContent = await response.json()
        return { data: decodeBase64Content(data.content) }
    } catch (error) {
        return toNetworkError(
            error instanceof Error ? error.message : "Network error occurred",
        )
    }
}

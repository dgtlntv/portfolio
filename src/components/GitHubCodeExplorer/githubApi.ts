import { GitHubTreeResponse, GitHubFileContent, FileNode, ApiError } from './types'

function buildFileTree(treeItems: GitHubTreeResponse['tree']): FileNode[] {
  const nodes: FileNode[] = []
  const directories = new Map<string, FileNode>()

  // Sort items so directories come before files
  const sortedItems = [...treeItems].sort((a, b) => {
    if (a.type === 'tree' && b.type === 'blob') return -1
    if (a.type === 'blob' && b.type === 'tree') return 1
    return a.path.localeCompare(b.path)
  })

  for (const item of sortedItems) {
    const pathParts = item.path.split('/')
    const fileName = pathParts[pathParts.length - 1]
    
    if (pathParts.length === 1) {
      // Root level item
      const node: FileNode = {
        name: fileName,
        path: item.path,
        type: item.type === 'tree' ? 'directory' : 'file',
        size: item.size,
        ...(item.type === 'tree' && { children: [] })
      }
      nodes.push(node)
      if (item.type === 'tree') {
        directories.set(item.path, node)
      }
    } else {
      // Nested item - find parent directory
      const parentPath = pathParts.slice(0, -1).join('/')
      const parentDir = directories.get(parentPath)
      
      if (parentDir && parentDir.children) {
        const node: FileNode = {
          name: fileName,
          path: item.path,
          type: item.type === 'tree' ? 'directory' : 'file',
          size: item.size,
          ...(item.type === 'tree' && { children: [] })
        }
        parentDir.children.push(node)
        if (item.type === 'tree') {
          directories.set(item.path, node)
        }
      }
    }
  }

  return nodes
}

export async function fetchRepositoryTree(
  owner: string,
  repo: string,
  branch: string = 'main'
): Promise<{ data: FileNode[] } | { error: ApiError }> {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    const response = await fetch(url)

    // Check for rate limiting
    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
      if (rateLimitRemaining === '0') {
        return {
          error: {
            type: 'rate_limit',
            message: 'GitHub API rate limit exceeded. Try again later or view the repository directly on GitHub.'
          }
        }
      }
    }

    if (!response.ok) {
      if (response.status === 404) {
        return {
          error: {
            type: 'not_found',
            message: 'Repository not found or branch does not exist.'
          }
        }
      }
      
      return {
        error: {
          type: 'network',
          message: `Failed to fetch repository data: ${response.status} ${response.statusText}`
        }
      }
    }

    const data: GitHubTreeResponse = await response.json()
    const fileTree = buildFileTree(data.tree)
    
    return { data: fileTree }
  } catch (error) {
    return {
      error: {
        type: 'network',
        message: error instanceof Error ? error.message : 'Network error occurred'
      }
    }
  }
}

export async function fetchFileContent(
  owner: string,
  repo: string,
  filePath: string,
  branch: string = 'main'
): Promise<{ data: string } | { error: ApiError }> {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`
    const response = await fetch(url)

    // Check for rate limiting
    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
      if (rateLimitRemaining === '0') {
        return {
          error: {
            type: 'rate_limit',
            message: 'GitHub API rate limit exceeded. Try again later.'
          }
        }
      }
    }

    if (!response.ok) {
      if (response.status === 404) {
        return {
          error: {
            type: 'not_found',
            message: 'File not found.'
          }
        }
      }
      
      return {
        error: {
          type: 'network',
          message: `Failed to fetch file: ${response.status} ${response.statusText}`
        }
      }
    }

    const data: GitHubFileContent = await response.json()
    
    // Decode base64 content with proper UTF-8 handling
    const base64Clean = data.content.replace(/\s/g, '')
    const decodedContent = decodeURIComponent(escape(atob(base64Clean)))
    
    return { data: decodedContent }
  } catch (error) {
    return {
      error: {
        type: 'network',
        message: error instanceof Error ? error.message : 'Network error occurred'
      }
    }
  }
}
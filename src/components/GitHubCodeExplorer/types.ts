export interface GitHubTreeItem {
  path: string
  type: 'blob' | 'tree'
  sha: string
  size?: number
  url: string
}

export interface GitHubFileContent {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: 'file'
  content: string
  encoding: 'base64'
}

export interface GitHubTreeResponse {
  sha: string
  url: string
  tree: GitHubTreeItem[]
  truncated: boolean
}

export interface FileNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileNode[]
  size?: number
}

export interface CacheData {
  timestamp: number
  fileTree: FileNode[]
  fileContents: Record<string, string>
}

export interface GitHubCodeExplorerProps {
  owner: string
  repo: string
  branch?: string
  className?: string
  defaultPath?: string
}

export interface GitHubFileExplorerProps {
  fileTree: FileNode[]
  currentPath: string | null
  onFileSelect: (path: string) => void
  isLoading: boolean
}

export interface GitHubCodeViewerProps {
  filePath: string | null
  fileContent: string | null
  isLoading: boolean
  error: string | null
  owner?: string
  repo?: string
  branch?: string
}

export type ApiError = {
  type: 'rate_limit' | 'network' | 'not_found' | 'unknown'
  message: string
}
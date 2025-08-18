import React, { useState, useEffect } from 'react'
import { LinkIcon, CodeBracketIcon } from '@heroicons/react/24/outline'
import { GitHubCodeExplorerProps, FileNode, ApiError } from './types'
import { GitHubFileExplorer } from './GitHubFileExplorer'
import { GitHubCodeViewer } from './GitHubCodeViewer'
import { fetchRepositoryTree, fetchFileContent } from './githubApi'
import { getCachedData, setCachedData, updateCachedFileContent, clearExpiredCaches } from './cache'

function GitHubRepoHeader({ owner, repo }: { owner: string; repo: string }) {
  const repoUrl = `https://github.com/${owner}/${repo}`
  
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors duration-200 no-underline"
      >
        {/* Using CodeBracketIcon as placeholder for GitHub icon */}
        <CodeBracketIcon className="w-5 h-5" />
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
    <div className="not-prose h-[600px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
      <div className="text-center max-w-md">
        <div className="text-yellow-600 text-lg font-semibold mb-2">
          Rate limit exceeded
        </div>
        <div className="text-gray-600 text-sm mb-4">
          GitHub API rate limit has been reached. You can view the repository directly on GitHub.
        </div>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          <LinkIcon className="w-4 h-4" />
          View on GitHub
        </a>
      </div>
    </div>
  )
}

function ErrorState({ error, owner, repo }: { error: ApiError; owner: string; repo: string }) {
  if (error.type === 'rate_limit') {
    return <RateLimitError owner={owner} repo={repo} />
  }

  const repoUrl = `https://github.com/${owner}/${repo}`
  
  return (
    <div className="not-prose h-[600px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
      <div className="text-center max-w-md">
        <div className="text-red-600 text-lg font-semibold mb-2">
          Error loading repository
        </div>
        <div className="text-gray-600 text-sm mb-4">
          {error.message}
        </div>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          <LinkIcon className="w-4 h-4" />
          View on GitHub
        </a>
      </div>
    </div>
  )
}

export function GitHubCodeExplorer({ 
  owner, 
  repo, 
  branch = 'main', 
  className = '',
  defaultPath
}: GitHubCodeExplorerProps) {
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const [currentPath, setCurrentPath] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [isLoadingTree, setIsLoadingTree] = useState(true)
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [treeError, setTreeError] = useState<ApiError | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  // Helper function to check if a file exists in the tree
  const fileExists = (tree: FileNode[], path: string): boolean => {
    const checkNode = (nodes: FileNode[]): boolean => {
      for (const node of nodes) {
        if (node.path === path && node.type === 'file') {
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
        if (defaultPath && fileExists(cachedData.fileTree, defaultPath)) {
          handleFileSelect(defaultPath)
        }
        return
      }

      // Fetch from API
      const result = await fetchRepositoryTree(owner, repo, branch)
      
      if ('error' in result) {
        setTreeError(result.error)
      } else {
        setFileTree(result.data)
        // Cache the result
        setCachedData(owner, repo, {
          fileTree: result.data,
          fileContents: {}
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

    // Check cache first
    const cachedData = getCachedData(owner, repo)
    if (cachedData && cachedData.fileContents[filePath]) {
      setFileContent(cachedData.fileContents[filePath])
      setIsLoadingFile(false)
      return
    }

    // Fetch from API
    const result = await fetchFileContent(owner, repo, filePath, branch)
    
    if ('error' in result) {
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
    <div className={`not-prose flex flex-col h-[600px] rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white ${className}`}>
      <GitHubRepoHeader owner={owner} repo={repo} />
      <div className="flex flex-1 min-h-0">
        <GitHubFileExplorer
          fileTree={fileTree}
          currentPath={currentPath}
          onFileSelect={handleFileSelect}
          isLoading={isLoadingTree}
        />
        <div className="flex-1 min-w-0 h-full">
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
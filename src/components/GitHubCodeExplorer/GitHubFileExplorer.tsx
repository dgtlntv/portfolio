import React, { useState } from 'react'
import { GitHubFileExplorerProps, FileNode } from './types'
import { FileIcon, FolderIcon } from './fileIcons'

// Files and directories to ignore in the file explorer
const IGNORED_FILES = new Set([
  '.gitignore',
  '.gitattributes',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'tsconfig.json',
  'tsconfig.build.json',
  '.DS_Store',
  'Thumbs.db',
])

const IGNORED_DIRECTORIES = new Set([
  'node_modules',
  '.git',
  '.next',
  '.nuxt',
  'coverage',
])

function shouldIgnoreItem(node: FileNode): boolean {
  const pathParts = node.path.split('/')
  
  if (node.type === 'directory') {
    // Check if any part of the path contains ignored directories
    return pathParts.some(part => IGNORED_DIRECTORIES.has(part))
  } else {
    // Check if file should be ignored
    return IGNORED_FILES.has(node.name)
  }
}

function filterFileTree(nodes: FileNode[]): FileNode[] {
  return nodes
    .filter(node => !shouldIgnoreItem(node))
    .map(node => ({
      ...node,
      ...(node.children && { children: filterFileTree(node.children) })
    }))
}

interface FileTreeItemProps {
  node: FileNode
  onFileSelect: (path: string) => void
  currentPath: string | null
  depth: number
  expandedFolders: Set<string>
  onToggleFolder: (path: string) => void
}

function FileTreeItem({ node, onFileSelect, currentPath, depth, expandedFolders, onToggleFolder }: FileTreeItemProps) {
  const isExpanded = expandedFolders.has(node.path)
  const isSelected = currentPath === node.path
  const indentPx = depth * 16

  const handleClick = () => {
    if (node.type === 'directory') {
      onToggleFolder(node.path)
    } else {
      onFileSelect(node.path)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors duration-200 flex items-center gap-2 hover:bg-gray-100 ${
          isSelected && node.type === 'file'
            ? 'bg-blue-100 text-blue-900'
            : 'text-gray-700'
        }`}
        style={{ paddingLeft: `${indentPx + 8}px` }}
      >
        {node.type === 'directory' ? (
          <FolderIcon isOpen={isExpanded} className="w-4 h-4 flex-shrink-0" />
        ) : (
          <FileIcon fileName={node.name} className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="truncate">{node.name}</span>
        {node.type === 'file' && node.size && (
          <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
            {formatFileSize(node.size)}
          </span>
        )}
      </button>

      {node.type === 'directory' && node.children && isExpanded && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              onFileSelect={onFileSelect}
              currentPath={currentPath}
              depth={depth + 1}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`
  return `${Math.round(bytes / (1024 * 1024))}MB`
}

export function GitHubFileExplorer({ fileTree, currentPath, onFileSelect, isLoading }: GitHubFileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  // Helper function to get all parent directories for a file path
  const getParentDirectories = (filePath: string): string[] => {
    const parts = filePath.split('/')
    const parents: string[] = []
    
    for (let i = 1; i < parts.length; i++) {
      parents.push(parts.slice(0, i).join('/'))
    }
    
    return parents
  }

  // Auto-expand folders when currentPath changes
  React.useEffect(() => {
    if (currentPath) {
      const parentDirs = getParentDirectories(currentPath)
      setExpandedFolders(prev => {
        const newSet = new Set(prev)
        parentDirs.forEach(dir => newSet.add(dir))
        return newSet
      })
    }
  }, [currentPath])
  const [sidebarWidth, setSidebarWidth] = useState(300)
  const [isResizing, setIsResizing] = useState(false)

  // Filter out ignored files and directories
  const filteredFileTree = filterFileTree(fileTree)

  const handleToggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const startResize = React.useRef({
    startX: 0,
    startWidth: 0,
  })

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsResizing(true)
    startResize.current = {
      startX: 'touches' in e ? e.touches[0].clientX : e.clientX,
      startWidth: sidebarWidth,
    }
  }

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isResizing) return

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const diff = clientX - startResize.current.startX
      const newWidth = startResize.current.startWidth + diff

      if (newWidth >= 200 && newWidth <= 600) {
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleMouseMove)
      document.addEventListener('touchend', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleMouseMove)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [isResizing])

  if (isLoading) {
    return (
      <>
        <div
          style={{ width: sidebarWidth }}
          className="bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0 h-full"
        >
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto mb-2"></div>
            <div className="text-sm text-gray-500">Loading files...</div>
          </div>
        </div>
        <div
          className="w-1 cursor-col-resize hover:bg-gray-300 bg-gray-200"
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
        />
      </>
    )
  }

  return (
    <>
      <div
        style={{ width: sidebarWidth }}
        className="bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0 h-full"
      >
        <div className="p-2">
          {filteredFileTree.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-sm">No files found</div>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredFileTree.map((node) => (
                <FileTreeItem
                  key={node.path}
                  node={node}
                  onFileSelect={onFileSelect}
                  currentPath={currentPath}
                  depth={0}
                  expandedFolders={expandedFolders}
                  onToggleFolder={handleToggleFolder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={`w-1 cursor-col-resize hover:bg-gray-300 bg-gray-200 ${
          isResizing ? 'bg-gray-400' : ''
        }`}
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart}
      />
    </>
  )
}
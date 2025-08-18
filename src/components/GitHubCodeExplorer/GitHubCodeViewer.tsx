import React from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { GitHubCodeViewerProps } from './types'

function getLanguageFromPath(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase() || ''
  
  // Map extensions to Prism language identifiers
  const extensionMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'py': 'python',
    'rb': 'ruby',
    'php': 'php',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'go': 'go',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'dart': 'dart',
    'vue': 'vue',
    'svelte': 'svelte',
    'html': 'html',
    'htm': 'html',
    'xml': 'xml',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'less': 'less',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'toml': 'toml',
    'md': 'markdown',
    'mdx': 'mdx',
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
    'fish': 'bash',
    'dockerfile': 'docker',
    'sql': 'sql',
    'graphql': 'graphql',
    'gql': 'graphql',
  }
  
  return extensionMap[extension] || 'text'
}

export function GitHubCodeViewer({ filePath, fileContent, isLoading, error, owner, repo, branch = 'main' }: GitHubCodeViewerProps) {
  if (!filePath) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">No file selected</div>
          <div className="text-gray-500 text-sm">Select a file from the explorer to view its contents</div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
          <div className="text-gray-500 text-sm">Loading file content...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-lg mb-2">Error loading file</div>
          <div className="text-gray-600 text-sm">{error}</div>
        </div>
      </div>
    )
  }

  if (!fileContent) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">File is empty</div>
          <div className="text-gray-500 text-sm">This file has no content</div>
        </div>
      </div>
    )
  }

  const language = getLanguageFromPath(filePath)
  const fileName = filePath.split('/').pop() || filePath

  return (
    <div className="flex flex-col h-full bg-white">
      {/* File header */}
      {owner && repo ? (
        <a
          href={`https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0 no-underline"
        >
          <div className="flex items-center space-x-2 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {fileName}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {filePath}
            </div>
          </div>
        </a>
      ) : (
        <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {fileName}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {filePath}
            </div>
          </div>
        </div>
      )}

      {/* Code content */}
      <div className="flex-1 overflow-auto min-h-0">
        <Highlight
          theme={themes.vsLight}
          code={fileContent}
          language={language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre 
              className={`${className} text-sm min-w-max`} 
              style={{ 
                ...style, 
                minHeight: '100%',
                backgroundColor: '#f9fafb',
                fontFamily: 'Courier Prime, monospace'
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })} className="px-4 py-0.5 whitespace-pre">
                  <span className="inline-block w-12 text-right opacity-50 mr-4 select-none">
                    {i + 1}
                  </span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}
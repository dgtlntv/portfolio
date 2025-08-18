import React from 'react'
import {
  DocumentIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  FolderIcon as HeroFolderIcon,
  FolderOpenIcon as HeroFolderOpenIcon,
  PhotoIcon,
  CogIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

// Easy to extend mapping for file extensions
const FILE_ICON_MAP: Record<string, IconComponent> = {
  // Code files
  'js': CodeBracketIcon,
  'jsx': CodeBracketIcon,
  'ts': CodeBracketIcon,
  'tsx': CodeBracketIcon,
  'py': CodeBracketIcon,
  'rb': CodeBracketIcon,
  'php': CodeBracketIcon,
  'java': CodeBracketIcon,
  'c': CodeBracketIcon,
  'cpp': CodeBracketIcon,
  'cs': CodeBracketIcon,
  'go': CodeBracketIcon,
  'rs': CodeBracketIcon,
  'swift': CodeBracketIcon,
  'kt': CodeBracketIcon,
  'dart': CodeBracketIcon,
  'vue': CodeBracketIcon,
  'svelte': CodeBracketIcon,
  
  // Markup and styling
  'html': DocumentTextIcon,
  'htm': DocumentTextIcon,
  'xml': DocumentTextIcon,
  'css': DocumentTextIcon,
  'scss': DocumentTextIcon,
  'sass': DocumentTextIcon,
  'less': DocumentTextIcon,
  'stylus': DocumentTextIcon,
  
  // Data and config files
  'json': CogIcon,
  'yaml': CogIcon,
  'yml': CogIcon,
  'toml': CogIcon,
  'ini': CogIcon,
  'cfg': CogIcon,
  'config': CogIcon,
  'conf': CogIcon,
  
  // Documentation
  'md': DocumentTextIcon,
  'mdx': DocumentTextIcon,
  'txt': DocumentTextIcon,
  'rtf': DocumentTextIcon,
  'doc': DocumentTextIcon,
  'docx': DocumentTextIcon,
  'pdf': DocumentDuplicateIcon,
  
  // Images
  'jpg': PhotoIcon,
  'jpeg': PhotoIcon,
  'png': PhotoIcon,
  'gif': PhotoIcon,
  'svg': PhotoIcon,
  'webp': PhotoIcon,
  'ico': PhotoIcon,
  
  // Default fallback
  'default': DocumentIcon,
}

export function getFileIcon(fileName: string): IconComponent {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''
  return FILE_ICON_MAP[extension] || FILE_ICON_MAP.default
}

export function getFolderIcon(isOpen: boolean): IconComponent {
  return isOpen ? HeroFolderOpenIcon : HeroFolderIcon
}

interface FileIconProps {
  fileName: string
  className?: string
}

export function FileIcon({ fileName, className = "w-4 h-4" }: FileIconProps) {
  const IconComponent = getFileIcon(fileName)
  return <IconComponent className={className} />
}

interface FolderIconProps {
  isOpen: boolean
  className?: string
}

export function FolderIcon({ isOpen, className = "w-4 h-4" }: FolderIconProps) {
  const IconComponent = getFolderIcon(isOpen)
  return <IconComponent className={className} />
}
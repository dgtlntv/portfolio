import { ReactNode } from 'react'

export interface FrontMatter {
  title: string
  date: string
  slug: string
  excerpt: string
  coverImage?: string
  tags?: string[]
  author?: string
  website?: string
  github?: string
  [key: string]: unknown
}

export interface MDXContent {
  frontMatter: FrontMatter
  slug: string
  content: React.ComponentType
}

export interface MDXProviderProps {
  children: ReactNode
}
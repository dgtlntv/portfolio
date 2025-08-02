import { ReactNode } from 'react'
import { Stat } from './common'

export interface FrontMatter {
  title: string
  date: string
  slug: string
  excerpt: string
  coverImage?: string
  stats?: Stat[]
  heroLocation?: 'center' | 'start' | 'end'
  author?: string
  website?: string
  github?: string
  asciiDarken?: number
  [key: string]: unknown
}

export interface MDXContent {
  frontMatter: FrontMatter
  slug: string
  content: React.ComponentType | (() => Promise<React.ComponentType>)
}

export interface MDXProviderProps {
  children: ReactNode
}
import { ReactNode } from 'react'
import { WithChildren } from '../../types'

export interface MDXProviderComponentProps extends WithChildren {}

export interface ErrorBoundaryProps extends WithChildren {
  fallback?: ReactNode
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}
import React, { Component, ErrorInfo } from 'react'
import { ErrorBoundaryProps, ErrorBoundaryState } from './types'

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MDX rendering error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      return (
        <div className="p-8 bg-red-50 rounded-lg my-4">
          <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-700 mb-4">There was an error rendering this content.</p>
          {this.state.error && (
            <pre className="bg-white p-4 rounded text-sm text-red-500 overflow-auto">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
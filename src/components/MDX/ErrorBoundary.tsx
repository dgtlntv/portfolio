import { Component, ErrorInfo } from "react"
import { ErrorBoundaryProps, ErrorBoundaryState } from "./types"

export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    public state: ErrorBoundaryState = {
        hasError: false,
        error: null,
    }

    public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("MDX rendering error:", error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="my-4 rounded-lg bg-red-50 p-8">
                    <h2 className="mb-2 text-xl font-bold text-red-800">
                        Something went wrong
                    </h2>
                    <p className="mb-4 text-red-700">
                        There was an error rendering this content.
                    </p>
                    {this.state.error && (
                        <pre className="overflow-auto rounded bg-white p-4 text-sm text-red-500">
                            {this.state.error.toString()}
                        </pre>
                    )}
                </div>
            )
        }

        return this.props.children
    }
}

import { LitElement, html, css } from "lit"
import type { TemplateResult } from "lit"
import { customElement, property } from "lit/decorators.js"
import { unsafeHTML } from "lit/directives/unsafe-html.js"
import Prism from "prismjs"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-json"
import "prismjs/components/prism-css"
import "prismjs/components/prism-markup"
import { globalStyleSheet } from "../../../styles/styleSheet.js"

@customElement("github-code-viewer")
export class GitHubCodeViewer extends LitElement {
    @property({ type: String }) filePath: string | null = null
    @property({ type: String }) fileContent: string | null = null
    @property({ type: Boolean }) isLoading = false
    @property({ type: String }) error: string | null = null
    @property({ type: String }) owner = ""
    @property({ type: String }) repo = ""
    @property({ type: String }) branch = "main"

    static styles = [
        globalStyleSheet,
        css`
            :host {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
                background-color: white;
            }

            .code-container {
                display: flex;
                min-width: max-content;
            }

            .line-numbers-column {
                position: sticky;
                left: 0;
                z-index: 10;
                flex-shrink: 0;
                border-right: 1px solid #e5e7eb;
                background-color: #f9fafb;
            }

            .line-numbers-pre {
                font-family:
                    Courier Prime,
                    monospace;
                font-size: 0.875rem;
                text-align: right;
                background-color: #f9fafb;
                min-height: 100%;
                margin: 0;
                padding: 0;
            }

            .line-number {
                padding: 0.125rem 0.75rem;
                opacity: 0.5;
                user-select: none;
            }

            .code-content-pre {
                flex: 1;
                font-family:
                    Courier Prime,
                    monospace;
                font-size: 0.875rem;
                min-height: 100%;
                background-color: #f9fafb;
                margin: 0;
                padding: 0;
            }

            .code-line {
                padding: 0.125rem 1rem;
                white-space: pre;
            }
        `,
    ]

    private getLanguageFromPath(filePath: string): string {
        const extension = filePath.split(".").pop()?.toLowerCase() || ""

        const extensionMap: Record<string, string> = {
            js: "javascript",
            jsx: "jsx",
            ts: "typescript",
            tsx: "tsx",
            py: "python",
            json: "json",
            html: "markup",
            htm: "markup",
            xml: "markup",
            css: "css",
            scss: "css",
            md: "markdown",
            sh: "bash",
            bash: "bash",
        }

        return extensionMap[extension] || "plaintext"
    }

    private renderHeader(): TemplateResult {
        if (!this.filePath) return html``

        const fileName = this.filePath.split("/").pop() || this.filePath

        if (this.owner && this.repo) {
            return html`
                <a
                    class="flex flex-shrink-0 items-center border-b border-gray-200 bg-gray-50 px-4 py-2 no-underline"
                    href="https://github.com/${this.owner}/${this
                        .repo}/blob/${this.branch}/${this.filePath}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div class="flex min-w-0 items-center space-x-2">
                        <div class="truncate text-sm font-medium text-gray-900">
                            ${fileName}
                        </div>
                        <div class="truncate text-xs text-gray-500">
                            ${this.filePath}
                        </div>
                    </div>
                </a>
            `
        }

        return html`
            <div
                class="flex flex-shrink-0 items-center border-b border-gray-200 bg-gray-50 px-4 py-2"
            >
                <div class="flex min-w-0 items-center space-x-2">
                    <div class="truncate text-sm font-medium text-gray-900">
                        ${fileName}
                    </div>
                    <div class="truncate text-xs text-gray-500">
                        ${this.filePath}
                    </div>
                </div>
            </div>
        `
    }

    render(): TemplateResult {
        if (!this.filePath) {
            return html`
                <div class="flex h-full items-center justify-center bg-gray-50">
                    <div class="text-center">
                        <div class="mb-2 text-lg text-gray-400">
                            No file selected
                        </div>
                        <div class="text-sm text-gray-500">
                            Select a file from the explorer to view its contents
                        </div>
                    </div>
                </div>
            `
        }

        if (this.isLoading) {
            return html`
                <div class="flex h-full items-center justify-center bg-gray-50">
                    <div class="text-center">
                        <div
                            class="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-600"
                        ></div>
                        <div class="text-sm text-gray-500">
                            Loading file content...
                        </div>
                    </div>
                </div>
            `
        }

        if (this.error) {
            return html`
                <div class="flex h-full items-center justify-center bg-gray-50">
                    <div class="max-w-md text-center">
                        <div class="mb-2 text-lg text-red-600">
                            Error loading file
                        </div>
                        <div class="text-sm text-gray-600">${this.error}</div>
                    </div>
                </div>
            `
        }

        if (!this.fileContent) {
            return html`
                <div class="flex h-full items-center justify-center bg-gray-50">
                    <div class="text-center">
                        <div class="mb-2 text-lg text-gray-400">
                            File is empty
                        </div>
                        <div class="text-sm text-gray-500">
                            This file has no content
                        </div>
                    </div>
                </div>
            `
        }

        const language = this.getLanguageFromPath(this.filePath)
        const lines = this.fileContent.split("\n")

        // Highlight the entire content at once
        let highlightedCode = this.fileContent
        const grammar = Prism.languages[language]
        if (grammar) {
            try {
                highlightedCode = Prism.highlight(
                    this.fileContent,
                    grammar,
                    language,
                )
            } catch (e) {
                console.error("Prism highlighting failed:", e)
            }
        }

        // Split highlighted code back into lines
        const highlightedLines = highlightedCode.split("\n")

        return html`
            ${this.renderHeader()}

            <div class="relative min-h-0 flex-1 overflow-auto">
                <div class="code-container">
                    <!-- Fixed line numbers column -->
                    <div class="line-numbers-column">
                        <pre class="line-numbers-pre">
${lines.map((_, i) => html`<div class="line-number">${i + 1}</div>`)}
</pre
                        >
                    </div>
                    <!-- Scrollable code content -->
                    <pre class="code-content-pre">
${highlightedLines.map(
                            (lineCode) =>
                                html`<div class="code-line">
                                    ${unsafeHTML(lineCode || " ")}
                                </div>`,
                        )}
</pre
                    >
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "github-code-viewer": GitHubCodeViewer
    }
}

import type { CSSResultGroup, TemplateResult } from "lit"
import { LitElement, css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { unsafeHTML } from "lit/directives/unsafe-html.js"
import Prism from "prismjs"
import "prismjs/components/prism-css"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-json"
import "prismjs/components/prism-markup"
import "prismjs/components/prism-python"
import "prismjs/components/prism-typescript"
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

    static override styles: CSSResultGroup = [
        globalStyleSheet,
        css`
            :host {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
                background-color: white;
            }

            pre {
                margin: 0;
                padding: 0;
            }

            .code-surface {
                position: relative;
                display: grid;
                grid-template-columns: auto 1fr;
                width: 100%;
                min-height: 100%;
                background-color: #f9fafb;
            }

            .line-numbers,
            .code-lines {
                font-family:
                    "Courier Prime", ui-monospace, SFMono-Regular, SFMono,
                    Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
                    monospace;
                font-size: 0.875rem;
                line-height: 1.3rem;
                letter-spacing: 0.005em;
            }

            .line-numbers {
                text-align: right;
                padding: 0.25rem 0.5rem 0.35rem;
                border-right: 1px solid #e5e7eb;
                background: linear-gradient(
                    180deg,
                    rgba(249, 250, 251, 0.95) 0%,
                    rgba(249, 250, 251, 0.9) 20%,
                    rgba(249, 250, 251, 0.75) 100%
                );
                position: sticky;
                left: 0;
                top: 0;
                width: 3rem;
            }

            .line-numbers span {
                display: block;
                padding: 0 0.25rem;
                color: #9ca3af;
                user-select: none;
            }

            .code-lines {
                padding: 0.25rem 1.25rem 0.35rem 1rem;
                color: #1f2937;
                background-color: #f9fafb;
                min-width: 100%;
                width: max-content;
            }

            .code-lines div {
                white-space: pre;
            }

            .code-lines div:empty::before {
                content: " ";
            }

            .scroller {
                position: relative;
                flex: 1;
                overflow: auto;
            }

            .scroller::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }

            .scroller::-webkit-scrollbar-thumb {
                background-color: rgba(156, 163, 175, 0.4);
                border-radius: 999px;
            }

            .scroller::-webkit-scrollbar-thumb:hover {
                background-color: rgba(107, 114, 128, 0.5);
            }

            .scroller::-webkit-scrollbar-track {
                background-color: transparent;
            }
        `,
    ]

    @state() private highlightedLines: string[] = []
    @state() private lineNumbers: string[] = []

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

    override updated(changed: Map<string, unknown>): void {
        if (
            changed.has("fileContent") ||
            changed.has("filePath") ||
            changed.has("isLoading") ||
            changed.has("error")
        ) {
            this.prepareHighlightedContent()
        }
    }

    private prepareHighlightedContent(): void {
        if (this.isLoading || this.error) {
            this.lineNumbers = []
            this.highlightedLines = []
            return
        }

        if (!this.filePath || !this.fileContent) {
            this.lineNumbers = []
            this.highlightedLines = []
            return
        }

        const language = this.getLanguageFromPath(this.filePath)
        const grammar = Prism.languages[language]

        const rawLines = this.fileContent.split("\n")
        while (rawLines.length > 1 && rawLines[rawLines.length - 1] === "") {
            rawLines.pop()
        }
        this.lineNumbers = rawLines.map((_, index) => `${index + 1}`)

        if (!grammar) {
            this.highlightedLines = rawLines
            return
        }

        try {
            const highlightedCode = Prism.highlight(
                this.fileContent,
                grammar,
                language,
            )
            const highlightedLines = highlightedCode.split("\n")
            if (highlightedLines.length < this.lineNumbers.length) {
                highlightedLines.push(
                    ...new Array(
                        this.lineNumbers.length - highlightedLines.length,
                    ).fill(""),
                )
            } else if (highlightedLines.length > this.lineNumbers.length) {
                highlightedLines.length = this.lineNumbers.length
            }
            this.highlightedLines = highlightedLines
        } catch (error) {
            console.error("Prism highlighting failed:", error)
            this.highlightedLines = rawLines
        }
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

        return html`
            ${this.renderHeader()}

            <div class="scroller">
                <div class="code-surface">
                    <pre class="line-numbers">
                        ${this.lineNumbers.map(
                            (line) => html`<span>${line}</span>`,
                        )}
                    </pre
                    >
                    <pre class="code-lines">
                        ${this.highlightedLines.map(
                            (line) => html`<div>${unsafeHTML(line)}</div>`,
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

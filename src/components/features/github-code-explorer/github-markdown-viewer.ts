import type { TemplateResult } from "lit"
import { LitElement, css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { unsafeHTML } from "lit/directives/unsafe-html.js"
import { marked } from "marked"
import { webComponentStyleSheet } from "../../../styles/webComponentStyleSheet.js"

@customElement("github-markdown-viewer")
export class GitHubMarkdownViewer extends LitElement {
    @property({ type: String }) filePath = ""
    @property({ type: String }) fileContent = ""
    @property({ type: String }) owner = ""
    @property({ type: String }) repo = ""
    @property({ type: String }) branch = "main"
    @state() private renderedHtml = ""

    static styles = [
        webComponentStyleSheet,
        css`
            :host {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
            }
        `,
    ]

    updated(changedProperties: Map<string, any>): void {
        if (changedProperties.has("fileContent")) {
            this.renderMarkdown()
        }
    }

    private async renderMarkdown(): Promise<void> {
        try {
            this.renderedHtml = await marked(this.fileContent)
        } catch (error) {
            console.error("Failed to render markdown:", error)
            this.renderedHtml = `<p>Failed to render markdown</p>`
        }
    }

    private renderHeader(): TemplateResult {
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
        return html`
            ${this.renderHeader()}

            <div class="relative min-h-0 flex-1 overflow-auto">
                <div class="prose prose-gray max-w-none p-6">
                    ${unsafeHTML(this.renderedHtml)}
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "github-markdown-viewer": GitHubMarkdownViewer
    }
}

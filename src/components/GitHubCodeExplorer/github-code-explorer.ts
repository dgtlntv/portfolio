import { LitElement, html, css } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { FileNode, ApiError } from "./types"
import { fetchRepositoryTree, fetchFileContent } from "./githubApi"
import {
    getCachedData,
    setCachedData,
    updateCachedFileContent,
    clearExpiredCaches,
} from "./cache"
import { globalStyleSheet } from "../../styles/styleSheet.js"
import "./github-file-explorer"
import "./github-code-viewer"
import "./github-markdown-viewer"

@customElement("github-code-explorer")
export class GitHubCodeExplorer extends LitElement {
    @property({ type: String }) owner = ""
    @property({ type: String }) repo = ""
    @property({ type: String }) branch = "main"
    @property({ type: String }) defaultPath = ""

    @state() private fileTree: FileNode[] = []
    @state() private currentPath: string | null = null
    @state() private fileContent: string | null = null
    @state() private isLoadingTree = true
    @state() private isLoadingFile = false
    @state() private treeError: ApiError | null = null
    @state() private fileError: string | null = null
    @state() private showFileExplorer = true

    static styles = [
        globalStyleSheet,
        css`
            :host {
                display: flex;
                flex-direction: column;
                height: 600px;
                overflow: hidden;
            }

            .mobile-toggle {
                display: flex;
            }

            @media (min-width: 768px) {
                .mobile-toggle {
                    display: none;
                }
            }

            .explorer-wrapper {
                display: flex;
                flex: 1;
            }

            .explorer-wrapper.hidden-mobile {
                display: none;
            }

            @media (min-width: 768px) {
                .explorer-wrapper {
                    display: flex;
                    flex: none;
                }

                .explorer-wrapper.hidden-mobile {
                    display: flex;
                }
            }

            .viewer-wrapper {
                display: flex;
                height: 100%;
                min-width: 0;
                flex: 1;
            }

            .viewer-wrapper.hidden-mobile {
                display: none;
            }

            @media (min-width: 768px) {
                .viewer-wrapper {
                    display: flex;
                }

                .viewer-wrapper.hidden-mobile {
                    display: flex;
                }
            }
        `,
    ]

    connectedCallback() {
        super.connectedCallback()
        clearExpiredCaches()
        this.loadFileTree()
    }

    private fileExists(tree: FileNode[], path: string): boolean {
        const checkNode = (nodes: FileNode[]): boolean => {
            for (const node of nodes) {
                if (node.path === path && node.type === "file") {
                    return true
                }
                if (node.children && checkNode(node.children)) {
                    return true
                }
            }
            return false
        }
        return checkNode(tree)
    }

    private isMarkdownFile(filePath: string): boolean {
        const extension = filePath.split(".").pop()?.toLowerCase()
        return extension === "md"
    }

    private async loadFileTree() {
        this.isLoadingTree = true
        this.treeError = null

        const cachedData = getCachedData(this.owner, this.repo)
        if (cachedData) {
            this.fileTree = cachedData.fileTree
            this.isLoadingTree = false
            if (
                this.defaultPath &&
                this.fileExists(cachedData.fileTree, this.defaultPath)
            ) {
                this.handleFileSelect(this.defaultPath)
            }
            return
        }

        const result = await fetchRepositoryTree(
            this.owner,
            this.repo,
            this.branch,
        )

        if ("error" in result) {
            this.treeError = result.error
        } else {
            this.fileTree = result.data
            setCachedData(this.owner, this.repo, {
                fileTree: result.data,
                fileContents: {},
            })
            if (
                this.defaultPath &&
                this.fileExists(result.data, this.defaultPath)
            ) {
                this.handleFileSelect(this.defaultPath)
            }
        }

        this.isLoadingTree = false
    }

    private async handleFileSelect(filePath: string) {
        this.currentPath = filePath
        this.fileContent = null
        this.fileError = null
        this.isLoadingFile = true

        if (window.innerWidth < 768) {
            this.showFileExplorer = false
        }

        const cachedData = getCachedData(this.owner, this.repo)
        if (cachedData && cachedData.fileContents[filePath]) {
            this.fileContent = cachedData.fileContents[filePath]
            this.isLoadingFile = false
            return
        }

        const result = await fetchFileContent(
            this.owner,
            this.repo,
            filePath,
            this.branch,
        )

        if ("error" in result) {
            this.fileError = result.error.message
        } else {
            this.fileContent = result.data
            updateCachedFileContent(
                this.owner,
                this.repo,
                filePath,
                result.data,
            )
        }

        this.isLoadingFile = false
    }

    private toggleFileExplorer() {
        this.showFileExplorer = !this.showFileExplorer
    }

    render() {
        if (this.treeError) {
            return this.renderError()
        }

        const fileName = this.currentPath?.split("/").pop() || ""

        return html`
            <div
                class="not-prose flex h-[600px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
                <div
                    class="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-3"
                >
                    <a
                        href="https://github.com/${this.owner}/${this.repo}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center gap-3 text-gray-700 no-underline transition-colors duration-200 hover:text-gray-900"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            class="h-5 w-5 fill-slate-900"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
                            ></path>
                        </svg>
                        <div
                            class="flex items-center gap-1 text-sm font-medium"
                        >
                            <span>${this.owner}</span>
                            <span class="text-gray-400">/</span>
                            <span>${this.repo}</span>
                        </div>
                    </a>
                </div>

                <div
                    class="mobile-toggle flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2"
                >
                    <button
                        @click=${this.toggleFileExplorer}
                        class="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm transition-colors hover:bg-gray-50"
                    >
                        ${this.showFileExplorer
                            ? html`
                                  <svg
                                      class="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                  >
                                      <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                                      />
                                  </svg>
                                  Show Code
                              `
                            : html`
                                  <svg
                                      class="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                  >
                                      <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                                      />
                                  </svg>
                                  Show Files
                              `}
                    </button>
                    ${this.currentPath
                        ? html`<span class="ml-2 truncate text-xs text-gray-600"
                              >${fileName}</span
                          >`
                        : ""}
                </div>

                <div class="flex min-h-0 flex-1">
                    <div
                        class="explorer-wrapper ${this.showFileExplorer
                            ? ""
                            : "hidden-mobile"}"
                    >
                        <github-file-explorer
                            .fileTree=${this.fileTree}
                            .currentPath=${this.currentPath}
                            .isLoading=${this.isLoadingTree}
                            @file-select=${(e: CustomEvent) =>
                                this.handleFileSelect(e.detail.path)}
                        ></github-file-explorer>
                    </div>

                    <div
                        class="viewer-wrapper ${this.showFileExplorer
                            ? "hidden-mobile"
                            : ""}"
                    >
                        ${this.currentPath &&
                        this.fileContent &&
                        this.isMarkdownFile(this.currentPath)
                            ? html`
                                  <github-markdown-viewer
                                      .filePath=${this.currentPath}
                                      .fileContent=${this.fileContent}
                                      .owner=${this.owner}
                                      .repo=${this.repo}
                                      .branch=${this.branch}
                                  ></github-markdown-viewer>
                              `
                            : html`
                                  <github-code-viewer
                                      .filePath=${this.currentPath}
                                      .fileContent=${this.fileContent}
                                      .isLoading=${this.isLoadingFile}
                                      .error=${this.fileError}
                                      .owner=${this.owner}
                                      .repo=${this.repo}
                                      .branch=${this.branch}
                                  ></github-code-viewer>
                              `}
                    </div>
                </div>
            </div>
        `
    }

    private renderError() {
        const repoUrl = `https://github.com/${this.owner}/${this.repo}`
        const isRateLimit = this.treeError?.type === "rate_limit"

        return html`
            <div
                class="not-prose flex h-[600px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
            >
                <div class="max-w-md text-center">
                    <div
                        class="${isRateLimit
                            ? "text-yellow-600"
                            : "text-red-600"} mb-2 text-lg font-semibold"
                    >
                        ${isRateLimit
                            ? "Rate limit exceeded"
                            : "Error loading repository"}
                    </div>
                    <div class="mb-4 text-sm text-gray-600">
                        ${this.treeError?.message}
                    </div>
                    <a
                        href=${repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
                    >
                        <svg
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                            />
                        </svg>
                        View on GitHub
                    </a>
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "github-code-explorer": GitHubCodeExplorer
    }
}

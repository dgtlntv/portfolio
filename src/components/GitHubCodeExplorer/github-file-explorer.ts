import { LitElement, html, css, TemplateResult } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { FileNode } from "./types"
import { getFileIcon, getFolderIcon } from "./file-icons"
import { globalStyleSheet } from "../../styles/styleSheet.js"

const IGNORED_FILES = new Set([
    ".gitignore",
    ".gitattributes",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "tsconfig.json",
    "tsconfig.build.json",
    ".DS_Store",
    "Thumbs.db",
])

const IGNORED_DIRECTORIES = new Set([
    "node_modules",
    ".git",
    ".next",
    ".nuxt",
    "coverage",
])

function shouldIgnoreItem(node: FileNode): boolean {
    const pathParts = node.path.split("/")

    if (node.type === "directory") {
        return pathParts.some((part) => IGNORED_DIRECTORIES.has(part))
    } else {
        return IGNORED_FILES.has(node.name)
    }
}

function filterFileTree(nodes: FileNode[]): FileNode[] {
    return nodes
        .filter((node) => !shouldIgnoreItem(node))
        .map((node) => ({
            ...node,
            ...(node.children && { children: filterFileTree(node.children) }),
        }))
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`
    return `${Math.round(bytes / (1024 * 1024))}MB`
}

@customElement("github-file-explorer")
export class GitHubFileExplorer extends LitElement {
    @property({ type: Array }) fileTree: FileNode[] = []
    @property({ type: String }) currentPath: string | null = null
    @property({ type: Boolean }) isLoading = false
    @state() private expandedFolders = new Set<string>()
    @state() private sidebarWidth = 300
    @state() private isResizing = false

    static styles = [
        globalStyleSheet,
        css`
            :host {
                display: flex;
                height: 100%;
            }

            @media (min-width: 768px) {
                .explorer-container {
                    width: var(--sidebar-width, 300px);
                }
            }

            .resize-handle {
                display: none;
            }

            @media (min-width: 768px) {
                .resize-handle {
                    display: block;
                }
            }

            .resize-handle.resizing {
                background-color: #d1d5db;
            }
        `,
    ]

    private getParentDirectories(filePath: string): string[] {
        const parts = filePath.split("/")
        const parents: string[] = []

        for (let i = 1; i < parts.length; i++) {
            parents.push(parts.slice(0, i).join("/"))
        }

        return parents
    }

    willUpdate(changedProperties: Map<string, any>): void {
        // Use willUpdate instead of updated to avoid triggering another update cycle
        if (changedProperties.has("currentPath") && this.currentPath) {
            const parentDirs = this.getParentDirectories(this.currentPath)
            const newExpanded = new Set(this.expandedFolders)
            let hasChanges = false

            parentDirs.forEach((dir) => {
                if (!newExpanded.has(dir)) {
                    newExpanded.add(dir)
                    hasChanges = true
                }
            })

            if (hasChanges) {
                this.expandedFolders = newExpanded
            }
        }
    }

    private handleToggleFolder(path: string): void {
        const newSet = new Set(this.expandedFolders)
        if (newSet.has(path)) {
            newSet.delete(path)
        } else {
            newSet.add(path)
        }
        this.expandedFolders = newSet
    }

    private handleFileSelect(path: string): void {
        this.dispatchEvent(
            new CustomEvent("file-select", {
                detail: { path },
                bubbles: true,
                composed: true,
            }),
        )
    }

    private handleResizeStart = (e: MouseEvent | TouchEvent): void => {
        this.isResizing = true
        const startX = "touches" in e ? e.touches[0].clientX : e.clientX
        const startWidth = this.sidebarWidth

        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!this.isResizing) return
            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
            const diff = clientX - startX
            const newWidth = startWidth + diff

            if (newWidth >= 200 && newWidth <= 600) {
                this.sidebarWidth = newWidth
            }
        }

        const handleEnd = () => {
            this.isResizing = false
            document.removeEventListener("mousemove", handleMove)
            document.removeEventListener("mouseup", handleEnd)
            document.removeEventListener("touchmove", handleMove)
            document.removeEventListener("touchend", handleEnd)
        }

        document.addEventListener("mousemove", handleMove)
        document.addEventListener("mouseup", handleEnd)
        document.addEventListener("touchmove", handleMove)
        document.addEventListener("touchend", handleEnd)
    }

    private renderTreeItem(node: FileNode, depth: number): TemplateResult {
        const isExpanded = this.expandedFolders.has(node.path)
        const isSelected = this.currentPath === node.path
        const indentPx = depth * 16

        const handleClick = () => {
            if (node.type === "directory") {
                this.handleToggleFolder(node.path)
            } else {
                this.handleFileSelect(node.path)
            }
        }

        return html`
            <div>
                <button
                    class="${isSelected && node.type === "file"
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-700"} flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors duration-200 hover:bg-gray-100"
                    style="padding-left: ${indentPx + 8}px"
                    @click=${handleClick}
                >
                    <span class="h-4 w-4 flex-shrink-0">
                        ${node.type === "directory"
                            ? getFolderIcon(isExpanded)
                            : getFileIcon(node.name)}
                    </span>
                    <span class="truncate">${node.name}</span>
                    ${node.type === "file" && node.size
                        ? html`<span
                              class="ml-auto flex-shrink-0 text-xs text-gray-400"
                              >${formatFileSize(node.size)}</span
                          >`
                        : ""}
                </button>

                ${node.type === "directory" && node.children && isExpanded
                    ? html`
                          <div>
                              ${node.children.map((child) =>
                                  this.renderTreeItem(child, depth + 1),
                              )}
                          </div>
                      `
                    : ""}
            </div>
        `
    }

    render(): TemplateResult {
        const filteredFileTree = filterFileTree(this.fileTree)

        if (this.isLoading) {
            return html`
                <div
                    class="h-full w-full flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50"
                    style="--sidebar-width: ${this.sidebarWidth}px"
                >
                    <div class="p-4 text-center">
                        <div
                            class="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-gray-600"
                        ></div>
                        <div class="text-sm text-gray-500">
                            Loading files...
                        </div>
                    </div>
                </div>
                <div
                    class="${this.isResizing
                        ? "resizing"
                        : ""} w-1 cursor-col-resize bg-gray-200 hover:bg-gray-300"
                    @mousedown=${this.handleResizeStart}
                    @touchstart=${this.handleResizeStart}
                ></div>
            `
        }

        return html`
            <div
                class="h-full w-full flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 md:w-[var(--sidebar-width)]"
                style="--sidebar-width: ${this.sidebarWidth}px"
            >
                <div class="p-2">
                    ${filteredFileTree.length === 0
                        ? html`<div class="py-8 text-center">
                              <div class="text-sm text-gray-500">
                                  No files found
                              </div>
                          </div>`
                        : html`
                              <div class="space-y-0.5">
                                  ${filteredFileTree.map((node) =>
                                      this.renderTreeItem(node, 0),
                                  )}
                              </div>
                          `}
                </div>
            </div>
            <div
                class="resize-handle ${this.isResizing
                    ? "resizing"
                    : ""} hidden w-1 cursor-col-resize bg-gray-200 hover:bg-gray-300 md:block"
                @mousedown=${this.handleResizeStart}
                @touchstart=${this.handleResizeStart}
            ></div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "github-file-explorer": GitHubFileExplorer
    }
}

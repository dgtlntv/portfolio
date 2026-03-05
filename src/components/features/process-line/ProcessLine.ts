import { LitElement, css, html, svg, type PropertyValues } from "lit"
import { property, state } from "lit/decorators.js"
import type { ProcessStage } from "./types"
import { generateProcessPath } from "./pathGenerator"

class ProcessLine extends LitElement {
    static styles = css`
        :host {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            pointer-events: none;
            z-index: 10;
        }

        .process-line-wrapper {
            position: fixed;
            pointer-events: auto;
        }

        svg {
            overflow: visible;
        }

        .main-path {
            fill: none;
            stroke: #e5e5e5;
            stroke-width: 1.5;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .main-path.dashed {
            stroke-dasharray: 4 4;
        }

        .main-path.drawn {
            stroke: #a3a3a3;
            transition: stroke 0.4s ease;
        }

        .branch-path {
            fill: none;
            stroke: #e5e5e5;
            stroke-width: 1.5;
            stroke-linecap: round;
            opacity: 0.5;
        }

        .branch-path.drawn {
            stroke: #a3a3a3;
            opacity: 0.8;
            transition:
                stroke 0.4s ease,
                opacity 0.4s ease;
        }

        .stage-dot {
            fill: white;
            stroke: #d4d4d4;
            stroke-width: 1.5;
            transition:
                fill 0.3s ease,
                stroke 0.3s ease;
        }

        .stage-dot.active {
            fill: #737373;
            stroke: #737373;
        }

        .stage-dot.passed {
            fill: #a3a3a3;
            stroke: #a3a3a3;
        }

        .stage-label {
            font-family: "Courier Prime", monospace;
            font-size: 9px;
            fill: #d4d4d4;
            transition:
                fill 0.3s ease,
                font-weight 0.3s ease;
            pointer-events: none;
            user-select: none;
        }

        .stage-label.active {
            fill: #525252;
            font-weight: bold;
        }

        .stage-label.passed {
            fill: #a3a3a3;
        }

        @media (max-width: 1280px) {
            :host {
                display: none !important;
            }
        }
    `

    @property({ type: Array })
    stages: ProcessStage[] = []

    @property({ type: String, attribute: "project-slug" })
    projectSlug: string = ""

    @state()
    private activeStageIndex: number = -1

    @state()
    private pathData: ReturnType<typeof generateProcessPath> | null = null

    @state()
    private wrapperLeft: number = 0

    @state()
    private wrapperTop: number = 0

    private headingElements: Map<string, Element> = new Map()
    private scrollHandler: (() => void) | null = null
    private resizeObserver: ResizeObserver | null = null
    private svgHeight: number = 0
    private contentElement: Element | null = null

    private scrollTracker: (() => void) | null = null
    private positionUpdater: (() => void) | null = null

    connectedCallback(): void {
        super.connectedCallback()
        requestAnimationFrame(() => {
            this.generatePath()
            setTimeout(() => {
                this.findContentElement()
                this.findHeadings()
                this.setupPositioning()
                this.setupScrollTracking()
                this.setupCombinedScrollHandler()
            }, 300)
        })
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()
        if (this.scrollHandler) {
            window.removeEventListener("scroll", this.scrollHandler)
        }
        this.resizeObserver?.disconnect()
    }

    updated(changedProperties: PropertyValues): void {
        if (
            changedProperties.has("stages") ||
            changedProperties.has("projectSlug")
        ) {
            this.generatePath()
            setTimeout(() => {
                this.findContentElement()
                this.findHeadings()
                this.setupPositioning()
                this.setupScrollTracking()
                this.setupCombinedScrollHandler()
            }, 300)
        }
    }

    private setupCombinedScrollHandler(): void {
        if (this.scrollHandler) {
            window.removeEventListener("scroll", this.scrollHandler)
        }
        this.scrollHandler = () => {
            this.scrollTracker?.()
            this.positionUpdater?.()
        }
        window.addEventListener("scroll", this.scrollHandler, { passive: true })
        // Run once immediately
        this.scrollHandler()
    }

    private generatePath(): void {
        if (!this.stages || this.stages.length === 0) return
        this.pathData = generateProcessPath(this.stages, this.projectSlug)
        this.svgHeight = this.pathData.totalHeight
    }

    private findContentElement(): void {
        // Find the prose container that is our sibling
        this.contentElement =
            this.parentElement?.querySelector('[class*="prose"]') || null
    }

    /**
     * Position the fixed wrapper to the left of the content area.
     */
    private setupPositioning(): void {
        this.resizeObserver?.disconnect()

        const updatePosition = () => {
            if (!this.contentElement) return
            const rect = this.contentElement.getBoundingClientRect()
            this.wrapperLeft = rect.left - 192
            this.wrapperTop =
                window.innerHeight / 2 - this.svgHeight / 2
        }

        this.positionUpdater = updatePosition
        updatePosition()

        this.resizeObserver = new ResizeObserver(() => {
            updatePosition()
        })
        if (this.contentElement) {
            this.resizeObserver.observe(this.contentElement)
        }
    }

    /**
     * Find content headings that match stage anchors or IDs.
     */
    private findHeadings(): void {
        this.headingElements.clear()

        const container = this.contentElement || this.parentElement
        if (!container) return

        const headings = container.querySelectorAll("h1, h2, h3")
        const headingMap = new Map<string, Element>()
        for (const heading of headings) {
            if (heading.id) {
                headingMap.set(heading.id, heading)
            }
        }

        for (const stage of this.stages) {
            if (stage.anchor && headingMap.has(stage.anchor)) {
                this.headingElements.set(
                    stage.id,
                    headingMap.get(stage.anchor)!,
                )
                continue
            }
            if (headingMap.has(stage.id)) {
                this.headingElements.set(stage.id, headingMap.get(stage.id)!)
                continue
            }
            for (const [headingId, el] of headingMap) {
                if (this.fuzzyMatch(headingId, stage.id)) {
                    this.headingElements.set(stage.id, el)
                    break
                }
            }
        }
    }

    private fuzzyMatch(a: string, b: string): boolean {
        const normalize = (s: string) =>
            s.toLowerCase().replace(/[-_\s]/g, "")
        return (
            normalize(a).includes(normalize(b)) ||
            normalize(b).includes(normalize(a))
        )
    }

    private setupScrollTracking(): void {
        const trackScroll = () => {
            if (this.headingElements.size === 0) {
                // Fallback: scroll-based progress
                const progress =
                    window.scrollY /
                    Math.max(
                        1,
                        document.documentElement.scrollHeight -
                            window.innerHeight,
                    )
                this.activeStageIndex = Math.min(
                    Math.floor(progress * this.stages.length),
                    this.stages.length - 1,
                )
                return
            }

            const viewportTrigger = window.innerHeight * 0.35
            let bestIndex = -1
            let bestDistance = Infinity

            for (const [stageId, el] of this.headingElements) {
                const rect = el.getBoundingClientRect()
                const distance = viewportTrigger - rect.top

                if (distance >= 0 && distance < bestDistance) {
                    bestDistance = distance
                    const idx = this.stages.findIndex((s) => s.id === stageId)
                    if (idx !== -1) {
                        bestIndex = idx
                    }
                }
            }

            if (bestIndex !== -1) {
                this.activeStageIndex = bestIndex
            } else if (window.scrollY < 200) {
                this.activeStageIndex = -1
            }
        }

        this.scrollTracker = trackScroll
        trackScroll()
    }

    private getActiveSegmentIndex(): number {
        if (this.activeStageIndex < 0) return -1
        let mainIdx = 0
        for (let i = 0; i <= this.activeStageIndex; i++) {
            if (this.stages[i].type !== "branch") {
                mainIdx = i
            }
        }
        return mainIdx
    }

    private isBranchDrawn(branchIndex: number): boolean {
        if (!this.pathData || this.activeStageIndex < 0) return false
        const branchStages = this.stages.filter(
            (s) => s.type === "branch" || s.type === "merge",
        )
        if (branchIndex < branchStages.length) {
            const branchStage = branchStages[branchIndex]
            const branchStageIdx = this.stages.indexOf(branchStage)
            return this.activeStageIndex >= branchStageIdx
        }
        return false
    }

    private renderPath() {
        if (!this.pathData) return svg``

        const { segments, branchSegments, stagePositions } = this.pathData

        return svg`
            ${segments.map(
                (seg, i) => svg`
                    <path
                        class="main-path ${seg.dashed ? "dashed" : ""} ${i <= this.getActiveSegmentIndex() ? "drawn" : ""}"
                        d=${seg.path}
                    />
                `,
            )}

            ${branchSegments.map(
                (seg, i) => svg`
                    <path
                        class="branch-path ${seg.dashed ? "dashed" : ""} ${this.isBranchDrawn(i) ? "drawn" : ""}"
                        d=${seg.path}
                    />
                `,
            )}

            ${stagePositions.map((pos, i) => {
                const isActive = i === this.activeStageIndex
                const isPassed =
                    this.activeStageIndex >= 0 && i < this.activeStageIndex

                return svg`
                    <circle
                        class="stage-dot ${isActive ? "active" : ""} ${isPassed ? "passed" : ""}"
                        cx=${pos.x}
                        cy=${pos.y}
                        r=${isActive ? 3.5 : 3}
                    />
                    <text
                        class="stage-label ${isActive ? "active" : ""} ${isPassed ? "passed" : ""}"
                        x=${pos.x + 10}
                        y=${pos.y + 3}
                        text-anchor="start"
                    >${pos.label}</text>
                `
            })}
        `
    }

    render() {
        if (!this.pathData) return html``

        return html`
            <div
                class="process-line-wrapper"
                style="left: ${this.wrapperLeft}px; top: ${this.wrapperTop}px;"
            >
                <svg
                    width="180"
                    height=${this.svgHeight}
                    viewBox="0 0 180 ${this.svgHeight}"
                >
                    ${this.renderPath()}
                </svg>
            </div>
        `
    }
}

customElements.define("process-line", ProcessLine)

export { ProcessLine }

import type { ProcessStage } from "./types"
import { generateWobbleOffsets } from "./noiseUtils"

interface PathSegment {
    path: string
    dashed: boolean
}

interface StagePosition {
    id: string
    x: number
    y: number
    label: string
    isBranch: boolean
}

interface GeneratedPath {
    segments: PathSegment[]
    stagePositions: StagePosition[]
    branchSegments: PathSegment[]
    totalHeight: number
}

const STAGE_SPACING = 80
const MAIN_X = 20
const BRANCH_X = 55
const LOOP_SIZE = 14
const PAUSE_GAP = 24

/**
 * Generate SVG path data and stage positions from a process stage array.
 */
export function generateProcessPath(
    stages: ProcessStage[],
    seed: string,
): GeneratedPath {
    const segments: PathSegment[] = []
    const branchSegments: PathSegment[] = []
    const stagePositions: StagePosition[] = []

    // Track which stages are branches
    const branchStageIds = new Set<string>()
    for (const stage of stages) {
        if (stage.type === "branch") {
            branchStageIds.add(stage.id)
        }
    }

    // Generate wobble offsets for the main line
    const wobbleOffsets = generateWobbleOffsets(
        stages.length * 10,
        seed,
        5,
        0.25,
    )

    let currentY = 20
    let mainPathPoints: { x: number; y: number }[] = []
    let currentSegmentDashed = false
    let activeBranch: {
        startX: number
        startY: number
        stageId: string
    } | null = null

    for (let i = 0; i < stages.length; i++) {
        const stage = stages[i]
        const isBranch = branchStageIds.has(stage.id)
        const wobbleIdx = i * 10
        const wobble = wobbleOffsets[wobbleIdx] || 0

        // Handle pause — flush current segment, add gap
        if (stage.style?.pause && mainPathPoints.length > 0) {
            segments.push({
                path: pointsToSmoothPath(mainPathPoints),
                dashed: currentSegmentDashed,
            })
            mainPathPoints = []
            currentY += PAUSE_GAP
        }

        const stageX = isBranch ? BRANCH_X : MAIN_X
        const stageY = currentY

        stagePositions.push({
            id: stage.id,
            x: stageX,
            y: stageY,
            label: stage.label,
            isBranch,
        })

        // Handle branch start
        if (stage.type === "branch" && stage.branchFrom) {
            const parentPos = stagePositions.find(
                (s) => s.id === stage.branchFrom,
            )
            if (parentPos) {
                // Flush main path before branching
                if (mainPathPoints.length > 0) {
                    segments.push({
                        path: pointsToSmoothPath(mainPathPoints),
                        dashed: currentSegmentDashed,
                    })
                    mainPathPoints = []
                }

                // Draw branch line from parent to this branch stage
                const branchPath = generateBranchPath(
                    parentPos.x,
                    parentPos.y,
                    stageX,
                    stageY,
                    seed + stage.id,
                )
                branchSegments.push({
                    path: branchPath,
                    dashed: stage.style?.dashed || false,
                })

                activeBranch = {
                    startX: stageX,
                    startY: stageY,
                    stageId: stage.id,
                }
            }
        } else if (stage.type === "merge" && activeBranch) {
            // Draw merge line from branch back to main
            const mergePath = generateBranchPath(
                activeBranch.startX,
                activeBranch.startY,
                stageX,
                stageY,
                seed + stage.id + "merge",
            )
            branchSegments.push({
                path: mergePath,
                dashed: false,
            })
            activeBranch = null
        }

        if (!isBranch) {
            // Handle loop
            if (stage.style?.loop) {
                // Add point before loop
                mainPathPoints.push({ x: MAIN_X + wobble, y: stageY })

                // Flush segment before loop
                if (mainPathPoints.length > 0) {
                    segments.push({
                        path: pointsToSmoothPath(mainPathPoints),
                        dashed: currentSegmentDashed,
                    })
                    mainPathPoints = []
                }

                // Draw the loop
                const loopPath = generateLoopPath(
                    MAIN_X + wobble,
                    stageY,
                    LOOP_SIZE,
                )
                segments.push({ path: loopPath, dashed: false })

                // Continue from after loop
                mainPathPoints.push({ x: MAIN_X + wobble, y: stageY })
            } else {
                mainPathPoints.push({
                    x: MAIN_X + wobble,
                    y: stageY,
                })
            }

            // Handle dashed transitions
            const isDashed = stage.style?.dashed || false
            if (isDashed !== currentSegmentDashed && mainPathPoints.length > 1) {
                segments.push({
                    path: pointsToSmoothPath(mainPathPoints),
                    dashed: currentSegmentDashed,
                })
                mainPathPoints = [mainPathPoints[mainPathPoints.length - 1]]
            }
            currentSegmentDashed = isDashed
        }

        currentY += STAGE_SPACING
    }

    // Flush remaining main path
    if (mainPathPoints.length > 1) {
        segments.push({
            path: pointsToSmoothPath(mainPathPoints),
            dashed: currentSegmentDashed,
        })
    }

    return {
        segments,
        branchSegments,
        stagePositions,
        totalHeight: currentY + 20,
    }
}

/**
 * Convert a series of points into a smooth SVG cubic bezier path
 */
function pointsToSmoothPath(points: { x: number; y: number }[]): string {
    if (points.length < 2) return ""

    let d = `M ${points[0].x} ${points[0].y}`

    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const midY = (prev.y + curr.y) / 2

        d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`
    }

    return d
}

/**
 * Generate a small loop path at a given point
 */
function generateLoopPath(x: number, y: number, size: number): string {
    return `M ${x} ${y} C ${x - size * 2} ${y - size}, ${x - size * 2} ${y + size}, ${x} ${y}`
}

/**
 * Generate a curved branch/merge path between two points
 */
function generateBranchPath(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    seed: string,
): string {
    const wobble = generateWobbleOffsets(4, seed, 3, 0.5)
    const midY = (y1 + y2) / 2

    return `M ${x1} ${y1} C ${x1 + (wobble[0] || 0)} ${midY}, ${x2 + (wobble[1] || 0)} ${midY}, ${x2} ${y2}`
}

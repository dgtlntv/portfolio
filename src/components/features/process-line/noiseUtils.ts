/**
 * Simple seeded pseudo-random number generator (mulberry32)
 */
function mulberry32(seed: number): () => number {
    return () => {
        seed |= 0
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/**
 * Hash a string to a number for use as a seed
 */
function hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash |= 0
    }
    return hash
}

/**
 * Generate smooth noise-based offsets for a path.
 * Uses interpolation between random control points for organic wobble.
 */
export function generateWobbleOffsets(
    numPoints: number,
    seed: string,
    amplitude: number = 6,
    frequency: number = 0.3,
): number[] {
    const rng = mulberry32(hashString(seed))
    const controlPoints: number[] = []

    // Generate sparse random control points
    const controlCount = Math.ceil(numPoints * frequency) + 2
    for (let i = 0; i < controlCount; i++) {
        controlPoints.push((rng() - 0.5) * 2 * amplitude)
    }

    // Interpolate between control points for smooth wobble
    const offsets: number[] = []
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * (controlCount - 1)
        const idx = Math.floor(t)
        const frac = t - idx
        const a = controlPoints[Math.min(idx, controlCount - 1)]
        const b = controlPoints[Math.min(idx + 1, controlCount - 1)]
        // Smoothstep interpolation
        const smooth = frac * frac * (3 - 2 * frac)
        offsets.push(a + (b - a) * smooth)
    }

    return offsets
}

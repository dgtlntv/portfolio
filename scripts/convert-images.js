#!/usr/bin/env node

import fs from "fs"
import path from "path"
import sharp from "sharp"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const publicDir = path.join(__dirname, "..", "public")
const imagesOutputDir = path.join(publicDir, "images")
const potentialSourceDir = path.join(publicDir, "images-src")
const sourceDir = fs.existsSync(potentialSourceDir)
    ? potentialSourceDir
    : imagesOutputDir

const { promises: fsp } = fs

const MAX_DIMENSION = 1920
const TARGET_WIDTHS = [320, 480, 640, 768, 960, 1024, 1280, 1440, 1600, 1920]
const SUPPORTED_EXTENSIONS = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif",
])
const OUTPUT_FORMATS = [
    {
        format: "webp",
        extension: ".webp",
        encode: (pipeline) =>
            pipeline.webp({ quality: 82, alphaQuality: 95, effort: 4 }),
    },
    {
        format: "avif",
        extension: ".avif",
        encode: (pipeline) => pipeline.avif({ quality: 45, effort: 4 }),
    },
]

const manifest = {}
let processedCount = 0

function isGeneratedVariant(fileName) {
    return /-w\d+\.(webp|avif)$/i.test(fileName)
}

function isHiddenFile(fileName) {
    return fileName.startsWith(".")
}

function normaliseRelativeDir(dir) {
    if (!dir) return ""
    return dir.split(path.sep).filter(Boolean).join("/")
}

function buildPublicPath(relativeDir, fileName) {
    const parts = ["images"]
    const normalised = normaliseRelativeDir(relativeDir)
    if (normalised) parts.push(normalised)
    parts.push(fileName)
    return `/${parts.join("/")}`
}

function buildManifestKey(relativeDir, baseName) {
    const parts = []
    const normalised = normaliseRelativeDir(relativeDir)
    if (normalised) parts.push(normalised)
    parts.push(baseName)
    return parts.join("/")
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

async function ensureDirectory(dirPath) {
    await fsp.mkdir(dirPath, { recursive: true })
}

async function cleanupVariants(targetDir, baseName, expectedFiles) {
    const variantPattern = new RegExp(
        `^${escapeRegExp(baseName)}(?:-w\\d+)?\\.(webp|avif)$`,
        "i",
    )
    const entries = await fsp.readdir(targetDir)
    await Promise.all(
        entries
            .filter(
                (entry) =>
                    variantPattern.test(entry) && !expectedFiles.has(entry),
            )
            .map((entry) => fsp.unlink(path.join(targetDir, entry))),
    )
}

async function processImage(filePath) {
    const ext = path.extname(filePath).toLowerCase()
    if (!SUPPORTED_EXTENSIONS.has(ext)) return

    const fileName = path.basename(filePath)
    if (isHiddenFile(fileName) || isGeneratedVariant(fileName)) return

    const relativeDir = path.relative(sourceDir, path.dirname(filePath))
    const targetDir = path.join(imagesOutputDir, relativeDir)

    await ensureDirectory(targetDir)

    const baseName = path.basename(fileName, ext)

    let inputBuffer
    try {
        inputBuffer = await fsp.readFile(filePath)
    } catch (error) {
        console.error(`Failed to read ${filePath}: ${error.message}`)
        return
    }

    const image = sharp(inputBuffer)
    let metadata
    try {
        metadata = await image.metadata()
    } catch (error) {
        console.error(`Failed to inspect ${filePath}: ${error.message}`)
        return
    }

    if (!metadata.width || metadata.width < 1) {
        console.warn(
            `Skipping ${filePath} because the width could not be determined.`,
        )
        return
    }

    const originalWidth = metadata.width
    const originalHeight = metadata.height ?? null
    const aspectRatio = originalHeight ? originalHeight / originalWidth : null

    const maxWidth = Math.min(MAX_DIMENSION, originalWidth)
    const widths = TARGET_WIDTHS.filter((width) => width < maxWidth)
    if (!widths.includes(maxWidth)) widths.push(maxWidth)
    widths.sort((a, b) => a - b)

    const expectedFiles = new Set()
    const formats = {
        webp: [],
        avif: [],
    }
    const createdFiles = []
    const reusedFiles = []

    for (const width of widths) {
        const height = aspectRatio ? Math.round(width * aspectRatio) : undefined
        const isBaseWebp = width === maxWidth

        for (const { format, extension, encode } of OUTPUT_FORMATS) {
            const suffix = format === "webp" && isBaseWebp ? "" : `-w${width}`
            const outputName = `${baseName}${suffix}${extension}`
            const outputPath = path.join(targetDir, outputName)

            expectedFiles.add(outputName)

            let alreadyExists = false
            try {
                await fsp.access(outputPath)
                alreadyExists = true
            } catch {
                alreadyExists = false
            }

            if (!alreadyExists) {
                const pipeline = sharp(inputBuffer).resize({
                    width,
                    fit: "inside",
                    withoutEnlargement: true,
                })

                try {
                    await encode(pipeline).toFile(outputPath)
                    createdFiles.push(outputName)
                    alreadyExists = true
                } catch (error) {
                    console.error(
                        `Failed to write ${outputPath}: ${error.message}`,
                    )
                    continue
                }
            } else {
                reusedFiles.push(outputName)
            }

            if (!alreadyExists) {
                continue
            }

            const publicPath = buildPublicPath(relativeDir, outputName)
            const entry = { width, height, path: publicPath }

            if (format === "webp") {
                formats.webp.push(entry)
            } else if (format === "avif") {
                formats.avif.push(entry)
            }
        }
    }

    await cleanupVariants(targetDir, baseName, expectedFiles)

    const manifestKey = buildManifestKey(relativeDir, baseName)
    const baseHeight = aspectRatio
        ? Math.round(maxWidth * aspectRatio)
        : undefined

    manifest[manifestKey] = {
        width: maxWidth,
        height: baseHeight,
        formats,
    }

    processedCount += 1

    const widthList = widths.join(", ")
    if (createdFiles.length > 0) {
        console.log(
            `Generated variants for ${manifestKey} [${widthList}px] (created ${createdFiles.length}, reused ${reusedFiles.length})`,
        )
    } else {
        console.log(
            `Reused existing variants for ${manifestKey} [${widthList}px]`,
        )
    }
}

async function walkDirectory(dir) {
    const entries = await fsp.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        if (isHiddenFile(entry.name)) continue

        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            await walkDirectory(fullPath)
        } else if (entry.isFile()) {
            await processImage(fullPath)
        }
    }
}

async function writeManifest() {
    const manifestDir = path.join(__dirname, "..", "src", "data")
    const manifestPath = path.join(manifestDir, "image-manifest.json")

    await ensureDirectory(manifestDir)

    const sortedKeys = Object.keys(manifest).sort()
    const sortedManifest = {}
    for (const key of sortedKeys) {
        sortedManifest[key] = manifest[key]
    }

    await fsp.writeFile(
        manifestPath,
        `${JSON.stringify(sortedManifest, null, 2)}\n`,
        "utf8",
    )
    console.log(
        `Wrote manifest with ${sortedKeys.length} entries to ${manifestPath}`,
    )
}

async function main() {
    if (!fs.existsSync(sourceDir)) {
        console.error(`Source directory "${sourceDir}" does not exist.`)
        process.exitCode = 1
        return
    }

    console.log("Generating responsive image variants...")
    await walkDirectory(sourceDir)
    await writeManifest()
    console.log(`Image processing complete for ${processedCount} source files.`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})

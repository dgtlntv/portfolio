#!/usr/bin/env node

import { spawn } from "node:child_process"
import { once } from "node:events"
import { mkdir, readdir } from "node:fs/promises"
import { dirname, join, relative } from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, "..")
const distDir = join(projectRoot, "dist")
const reportsDir = join(projectRoot, "reports")
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm"
const lighthouseBin = join(
    projectRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "lighthouse.cmd" : "lighthouse",
)
const defaultOrigin = process.env.PAGESPEED_ORIGIN ?? "http://127.0.0.1:4321"
const isLocalOrigin = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)/i.test(
    defaultOrigin,
)
const cliTargets = process.argv.slice(2)
let pagesToAudit = [...cliTargets]
let previewProcess

if (typeof fetch !== "function") {
    console.error(
        "Global fetch is not available. Please run this script on Node.js 18 or newer.",
    )
    process.exit(1)
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const runCommand = (command, args, options = {}) =>
    new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: "inherit",
            cwd: projectRoot,
            shell: false,
            ...options,
        })

        child.on("error", (error) => reject(error))
        child.on("exit", (code) => {
            if (code === 0) {
                resolve()
            } else {
                reject(
                    new Error(
                        `${command} ${args.join(" ")} exited with code ${code}`,
                    ),
                )
            }
        })
    })

const startPreview = async () => {
    previewProcess = spawn(
        npmCmd,
        ["run", "preview", "--", "--host", "127.0.0.1", "--port", "4321"],
        {
            stdio: "inherit",
            cwd: projectRoot,
        },
    )

    previewProcess.on("error", (error) => {
        console.error("Failed to start Astro preview server:", error)
    })

    // Give Astro a moment to start before polling.
    await delay(500)
    await waitForServer(new URL("/", defaultOrigin).toString())
}

const stopPreview = async () => {
    if (!previewProcess || previewProcess.killed) {
        return
    }

    previewProcess.kill("SIGINT")

    try {
        await once(previewProcess, "exit")
    } catch (error) {
        if (error) {
            console.warn("Preview server termination warning:", error)
        }
    }
}

const waitForServer = async (url, attempts = 40, intervalMs = 500) => {
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        let timeout
        try {
            const controller = new AbortController()
            timeout = setTimeout(() => controller.abort(), 2500)
            const response = await fetch(url, { signal: controller.signal })

            if (response.ok) {
                clearTimeout(timeout)
                return
            }
        } catch (error) {
            // Suppress errors while the server is still booting.
        } finally {
            if (timeout) {
                clearTimeout(timeout)
            }
        }

        await delay(intervalMs)
    }

    throw new Error(`Preview server did not respond at ${url}`)
}

const discoverBuiltPages = async () => {
    const routes = new Set()

    const walk = async (directory) => {
        const entries = await readdir(directory, { withFileTypes: true })

        for (const entry of entries) {
            const entryPath = join(directory, entry.name)

            if (entry.isDirectory()) {
                if (entry.name.startsWith("_")) {
                    continue
                }

                await walk(entryPath)
                continue
            }

            if (!entry.isFile() || !entry.name.endsWith(".html")) {
                continue
            }

            const relativePath = relative(distDir, entryPath).replace(
                /\\/g,
                "/",
            )

            if (
                relativePath.startsWith("_astro/") ||
                relativePath === "404.html" ||
                relativePath === "500.html"
            ) {
                continue
            }

            let route

            if (relativePath === "index.html") {
                route = "/"
            } else if (relativePath.endsWith("/index.html")) {
                route = `/${relativePath.slice(0, -"index.html".length)}`

                if (!route.endsWith("/")) {
                    route = `${route}/`
                }
            } else {
                route = `/${relativePath.replace(/\.html$/u, "")}`
            }

            route = route.replace(/\/{2,}/gu, "/")
            routes.add(route)
        }
    }

    try {
        await walk(distDir)
    } catch (error) {
        if (error && error.code === "ENOENT") {
            console.warn(
                "No dist directory found after build; defaulting to manual targets.",
            )
            return []
        }

        throw error
    }

    return [...routes].sort((a, b) => a.localeCompare(b))
}

const sanitizeLabel = (path, variant) => {
    try {
        const url = new URL(path)
        path = url.pathname
    } catch (error) {
        // Ignore, not an absolute URL.
    }

    let base = path.trim()
    if (!base || base === "/") {
        base = "home"
    }

    base = base
        .replace(/^\/+/, "")
        .replace(/\/+$/u, "")
        .replace(/[^a-z0-9-_]+/gi, "-")
        .replace(/-{2,}/g, "-")

    if (!base) {
        base = "page"
    }

    return `${base}-${variant}`
}

const runLighthouse = async (targetUrl, label, presetArgs = []) => {
    const outputBase = join(reportsDir, `pagespeed-${label}`)
    const args = [
        targetUrl,
        "--output",
        "html",
        "--output",
        "json",
        "--output-path",
        outputBase,
        "--chrome-flags=--headless",
        "--quiet",
        ...presetArgs,
    ]

    await runCommand(lighthouseBin, args)

    return {
        html: `${outputBase}.report.html`,
        json: `${outputBase}.report.json`,
    }
}

const handleSignal = (signal) => {
    console.log(`\nReceived ${signal}. Cleaning up preview server...`)
    stopPreview().finally(() => process.exit(1))
}

process.on("SIGINT", handleSignal)
process.on("SIGTERM", handleSignal)

const main = async () => {
    await mkdir(reportsDir, { recursive: true })

    if (isLocalOrigin) {
        console.log("➜ Building Astro project before running audits...")
        await runCommand(npmCmd, ["run", "build"])

        if (cliTargets.length === 0) {
            console.log("➜ Discovering built HTML pages to audit...")
            const discoveredPages = await discoverBuiltPages()

            if (discoveredPages.length === 0) {
                console.warn(
                    "   No HTML pages detected in dist; defaulting to '/' only.",
                )
            } else {
                console.log(
                    `   Found ${discoveredPages.length} page(s) to audit.`,
                )
                pagesToAudit = discoveredPages
            }
        }

        console.log(
            "➜ Starting Astro preview server on http://127.0.0.1:4321 ...",
        )
        await startPreview()
    }

    if (pagesToAudit.length === 0) {
        pagesToAudit = ["/"]
    }

    pagesToAudit = [
        ...new Set(
            pagesToAudit
                .map((target) => target.trim())
                .filter((target) => target.length > 0),
        ),
    ]

    if (pagesToAudit.length === 0) {
        pagesToAudit.push("/")
    }

    console.log(`➜ Auditing ${pagesToAudit.length} page(s)`)

    for (const target of pagesToAudit) {
        const trimmed = target
        const isAbsolute = /^https?:\/\//i.test(trimmed)
        const fullUrl = isAbsolute
            ? trimmed
            : new URL(trimmed, defaultOrigin).toString()

        console.log(`\n▶ Running Lighthouse (mobile) for ${fullUrl}`)
        const mobileLabel = sanitizeLabel(trimmed, "mobile")
        const mobileReport = await runLighthouse(fullUrl, mobileLabel)
        console.log(`   Mobile report saved: ${mobileReport.html}`)

        console.log(`▶ Running Lighthouse (desktop) for ${fullUrl}`)
        const desktopLabel = sanitizeLabel(trimmed, "desktop")
        const desktopReport = await runLighthouse(fullUrl, desktopLabel, [
            "--preset=desktop",
        ])
        console.log(`   Desktop report saved: ${desktopReport.html}`)
    }
}

main()
    .catch((error) => {
        console.error("\n✖ Pagespeed audit failed:", error.message)
        process.exitCode = 1
    })
    .finally(async () => {
        await stopPreview()
    })

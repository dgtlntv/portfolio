#!/usr/bin/env node
/**
 * Summarise Lighthouse JSON reports by extracting headline scores, key metrics,
 * and the highest-impact opportunities/diagnostics. Designed for quick CLI use:
 *
 *    node scripts/lighthouse-summary.js reports/example.report.json
 *
 * Optional flags:
 *   --limit=<n>        Number of items to show for opportunities and diagnostics (default 5)
 */

import fs from "node:fs"
import path from "node:path"

const [, , rawInputPath, ...restArgs] = process.argv

if (!rawInputPath) {
    console.error(
        "Usage: node scripts/lighthouse-summary.js <path-to-report.json> [--limit=<n>]",
    )
    process.exit(1)
}

const options = restArgs.reduce(
    (acc, arg) => {
        const match = arg.match(/^--([\w-]+)=?(.*)$/)
        if (!match) return acc
        const [, key, value] = match
        if (key === "limit") {
            const parsed = Number(value)
            if (!Number.isNaN(parsed) && parsed > 0) {
                acc.limit = parsed
            }
        } else if (key === "items-limit") {
            const parsed = Number(value)
            if (!Number.isNaN(parsed) && parsed > 0) {
                acc.itemLimit = parsed
            }
        }
        return acc
    },
    { limit: 5, itemLimit: 3 },
)

const resolvedPath = path.resolve(process.cwd(), rawInputPath)

if (!fs.existsSync(resolvedPath)) {
    console.error(`Report not found: ${resolvedPath}`)
    process.exit(1)
}

let report
try {
    const raw = fs.readFileSync(resolvedPath, "utf8")
    report = JSON.parse(raw)
} catch (error) {
    console.error(
        `Failed to read or parse Lighthouse report: ${error instanceof Error ? error.message : String(error)}`,
    )
    process.exit(1)
}

// Lighthouse CLI can write either the raw object or wrap it in lighthouseResult
const lhr = report.lighthouseResult ?? report
const categories = lhr.categories ?? {}
const audits = lhr.audits ?? {}

const perfScore = categories.performance?.score ?? null
const url =
    lhr.finalDisplayedUrl ?? lhr.finalUrl ?? lhr.requestedUrl ?? "Unknown URL"
const fetchTime = lhr.fetchTime ?? "Unknown time"
const formFactor = lhr.configSettings?.formFactor ?? "unknown"

const metricDefinitions = [
    { id: "first-contentful-paint", label: "FCP" },
    { id: "largest-contentful-paint", label: "LCP" },
    { id: "speed-index", label: "Speed Index" },
    { id: "interactive", label: "TTI" },
    { id: "total-blocking-time", label: "TBT" },
    { id: "cumulative-layout-shift", label: "CLS" },
    { id: "experimental-interaction-to-next-paint", label: "INP" },
]

const formatSeconds = (ms) => (ms / 1000).toFixed(ms < 1000 ? 2 : 1)
const formatNumber = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
})
const formatBytes = (value) => {
    if (!value || Number.isNaN(Number(value))) return null
    const units = ["B", "KiB", "MiB", "GiB"]
    let size = Number(value)
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024
        unitIndex += 1
    }
    return `${formatNumber.format(size)} ${units[unitIndex]}`
}

const toPlainText = (value) =>
    typeof value === "string"
        ? value
              .replace(/<\/?[a-zA-Z0-9\-]+[^>]*>/g, "")
              .replace(/\s+/g, " ")
              .trim()
        : null

const resolveItemSource = (item) => {
    if (!item || typeof item !== "object") return null
    if (typeof item.url === "string") return item.url
    if (item.source) {
        if (typeof item.source.url === "string") return item.source.url
        if (typeof item.source.selector === "string")
            return item.source.selector
        if (typeof item.source.snippet === "string")
            return toPlainText(item.source.snippet)
    }
    if (typeof item.selector === "string") return item.selector
    if (item.node) {
        if (typeof item.node.selector === "string") return item.node.selector
        if (typeof item.node.snippet === "string")
            return toPlainText(item.node.snippet)
    }
    if (item.request && typeof item.request.url === "string")
        return item.request.url
    return null
}

const formatItemSummary = (item) => {
    const parts = []
    const wastedMs = Number(item?.wastedMs ?? item?.duration ?? 0)
    const wastedBytes = Number(item?.wastedBytes ?? item?.totalBytes ?? 0)
    if (!Number.isNaN(wastedMs) && wastedMs > 0) {
        parts.push(`~${formatSeconds(wastedMs)} s`)
    }
    if (!Number.isNaN(wastedBytes) && wastedBytes > 0) {
        const bytes = formatBytes(wastedBytes)
        if (bytes) parts.push(bytes)
    }
    return parts.join(" | ")
}

const metrics = metricDefinitions.flatMap(({ id, label }) => {
    const audit = audits[id]
    if (!audit || typeof audit.numericValue !== "number") return []
    const { numericValue, numericUnit } = audit
    if (numericUnit === "millisecond") {
        return [{ label, value: `${formatSeconds(numericValue)} s` }]
    }
    return [
        {
            label,
            value:
                numericUnit === "unitless"
                    ? formatNumber.format(numericValue)
                    : `${numericValue} ${numericUnit ?? ""}`.trim(),
        },
    ]
})

const auditRefs = categories.performance?.auditRefs ?? []

const rawOpportunities = auditRefs
    .map((ref) => audits[ref.id])
    .filter(Boolean)
    .filter((audit) => audit.details?.type === "opportunity")

const opportunities = rawOpportunities
    .map((audit) => ({
        title: audit.title,
        savingsMs: Number(audit.details?.overallSavingsMs ?? 0),
        displayValue: audit.displayValue ?? null,
        savingsBytes: Number(audit.details?.overallSavingsBytes ?? 0),
        description: toPlainText(audit.description) ?? null,
        helpText: toPlainText(audit.details?.overallSavingsMessage),
        items: Array.isArray(audit.details?.items) ? audit.details.items : [],
    }))
    .filter((item) => item.savingsMs > 0)
    .sort((a, b) => b.savingsMs - a.savingsMs)
    .slice(0, options.limit)

const diagnosticRefs = auditRefs.filter((ref) => ref.group === "diagnostics")

const diagnostics = diagnosticRefs
    .map((ref) => audits[ref.id])
    .filter(Boolean)
    .map((audit) => ({
        title: audit.title,
        score: typeof audit.score === "number" ? audit.score : null,
        displayValue: audit.displayValue ?? null,
        description: toPlainText(audit.description) ?? null,
        items: Array.isArray(audit.details?.items) ? audit.details.items : [],
    }))
    .sort((a, b) => {
        const scoreA = a.score ?? 1
        const scoreB = b.score ?? 1
        return scoreA - scoreB
    })
    .slice(0, options.limit)

const printSection = (title) => {
    console.log(`\n${title}`)
    console.log("-".repeat(title.length))
}

console.log("Lighthouse Summary")
console.log("===================")
console.log(`Report: ${path.relative(process.cwd(), resolvedPath)}`)
console.log(`URL: ${url}`)
console.log(`Fetch Time: ${fetchTime}`)
console.log(`Form Factor: ${formFactor}`)
if (typeof perfScore === "number") {
    console.log(
        `Performance Score: ${(perfScore * 100).toFixed(0)} (${perfScore.toFixed(2)})`,
    )
}

if (metrics.length) {
    printSection("Core Metrics")
    metrics.forEach(({ label, value }) => {
        console.log(`- ${label}: ${value}`)
    })
}

if (opportunities.length) {
    printSection("Top Opportunities")
    opportunities.forEach((item, index) => {
        const savings = `${formatSeconds(item.savingsMs)} s potential savings`
        const bulletParts = [savings]
        const byteText = formatBytes(item.savingsBytes)
        if (byteText) bulletParts.push(`~${byteText}`)
        if (item.displayValue) bulletParts.push(`Current: ${item.displayValue}`)
        console.log(`${index + 1}. ${item.title} — ${bulletParts.join(" | ")}`)
        const detailLines = [item.description, item.helpText].filter(Boolean)
        detailLines.forEach((line) => {
            console.log(`   ↳ ${line}`)
        })
        const offenders = item.items.slice(0, options.itemLimit)
        offenders.forEach((entry) => {
            const source = resolveItemSource(entry)
            const summary = formatItemSummary(entry)
            if (source) {
                console.log(
                    `      • ${source}${summary ? ` — ${summary}` : ""}`,
                )
            }
        })
    })
} else {
    printSection("Top Opportunities")
    console.log("None detected with measurable savings.")
}

if (diagnostics.length) {
    printSection("Key Diagnostics")
    diagnostics.forEach((item, index) => {
        const scoreText =
            item.score === null ? "n/a" : (item.score * 100).toFixed(0)
        const trailing = item.displayValue ? ` | ${item.displayValue}` : ""
        console.log(
            `${index + 1}. ${item.title} — Score: ${scoreText}${trailing}`,
        )
        if (item.description) {
            console.log(`   ↳ ${item.description}`)
        }
        const offenders = item.items.slice(0, options.itemLimit)
        offenders.forEach((entry) => {
            const source = resolveItemSource(entry)
            if (!source) return
            const summary = formatItemSummary(entry)
            console.log(`      • ${source}${summary ? ` — ${summary}` : ""}`)
        })
    })
} else {
    printSection("Key Diagnostics")
    console.log("None flagged in this category.")
}

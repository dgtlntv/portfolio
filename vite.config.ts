import mdx from "@mdx-js/rollup"
import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
    // Set the base path to "/www/" or the value from VITE_BASE_PATH environment variable
    base: process.env.VITE_BASE_PATH || "/",
    plugins: [
        TanStackRouterVite({ autoCodeSplitting: true }),
        react(),
        mdx({
            // Add support for frontmatter
            remarkPlugins: [
                // Add support for frontmatter
                [
                    // @ts-ignore
                    (await import("remark-frontmatter")).default,
                    { type: "yaml", marker: "-" },
                ],
                // Extract frontmatter data into component's frontmatter property
                // @ts-ignore
                (await import("remark-mdx-frontmatter")).default,
            ],
            providerImportSource: "@mdx-js/react",
        }),
        tailwindcss(),
    ],
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".css", ".mdx"],
        alias: {
            "motion-sensors-polyfill":
                "/node_modules/motion-sensors-polyfill/src/motion-sensors.js",
        },
    },
})

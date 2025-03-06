import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import mdx from "@mdx-js/rollup"

export default defineConfig({
    plugins: [
        TanStackRouterVite({ autoCodeSplitting: true }),
        react(),
        mdx(),
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

import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import tailwindcss from "@tailwindcss/vite"
import remarkFrontmatter from "remark-frontmatter"
import remarkMath from "remark-math"
import rehypeUnwrapImages from "rehype-unwrap-images"
import rehypeKatex from "rehype-katex"
import { ViteImageOptimizer } from "vite-plugin-image-optimizer"

export default defineConfig({
    integrations: [
        react(),
        mdx({
            remarkPlugins: [
                [remarkFrontmatter, { type: "yaml", marker: "-" }],
                remarkMath,
            ],
            rehypePlugins: [rehypeUnwrapImages, rehypeKatex],
            shikiConfig: {
                theme: "github-dark",
                wrap: true,
            },
            optimize: {
                // Prevent the optimizer from handling custom MDX components
                ignoreElementNames: [
                    "p",
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "h5",
                    "h6",
                    "ul",
                    "ol",
                    "li",
                    "blockquote",
                    "a",
                    "pre",
                    "code",
                    "img",
                ],
            },
        }),
    ],
    vite: {
        resolve: {
            alias: {
                "motion-sensors-polyfill":
                    "/node_modules/motion-sensors-polyfill/src/motion-sensors.js",
            },
        },
        build: {
            chunkSizeWarningLimit: 800,
            rollupOptions: {
                output: {
                    manualChunks: {
                        "vendor-react": [
                            "react",
                            "react-dom",
                            "react/jsx-runtime",
                        ],
                        "vendor-three": ["three"],
                        "vendor-animation": ["@lottiefiles/dotlottie-wc"],
                    },
                },
            },
            cssCodeSplit: true,
            minify: "terser",
            terserOptions: {
                compress: {
                    drop_console: true,
                },
            },
        },
        plugins: [
            tailwindcss(),
            ViteImageOptimizer({
                webp: {
                    quality: 85,
                    lossless: false,
                },
            }),
        ],
    },
    // Set base path from environment variable
    base: process.env.VITE_BASE_PATH || "/",
    // Enable static site generation
    output: "static",
    // Build configuration
    build: {
        assets: "assets",
    },
})

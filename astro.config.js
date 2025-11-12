import mdx from "@astrojs/mdx"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import rehypeKatex from "rehype-katex"
import rehypeUnwrapImages from "rehype-unwrap-images"
import remarkFrontmatter from "remark-frontmatter"
import remarkMath from "remark-math"

import playformInline from "@playform/inline"

export default defineConfig({
    integrations: [
        mdx({
            remarkPlugins: [
                [remarkFrontmatter, { type: "yaml", marker: "-" }],
                remarkMath,
            ],
            rehypePlugins: [rehypeUnwrapImages, rehypeKatex],
            shikiConfig: {
                theme: "catppuccin-latte",
                wrap: false,
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
        playformInline(),
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
        plugins: [tailwindcss()],
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

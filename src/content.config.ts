import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const blog = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        date: z.string(),
        author: z.string().optional(),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        heroAltText: z.string().optional(),
        heroLocation: z.enum(["cover", "contain"]).optional(),
        stats: z
            .array(
                z.object({
                    label: z.string(),
                    value: z.string(),
                }),
            )
            .optional(),
    }).refine((data) => {
        if (data.coverImage && !data.heroAltText) {
            return false
        }
        return true
    }, {
        message: "heroAltText is required when coverImage is provided",
    }),
})

const projects = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
    schema: z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        heroAltText: z.string().optional(),
        heroLocation: z.enum(["cover", "contain"]).optional(),
        asciiDarken: z.number().optional(),
        stats: z
            .array(
                z.object({
                    label: z.string(),
                    value: z.string(),
                }),
            )
            .optional(),
        tldr: z.string().optional(),
    }).refine((data) => {
        if (data.coverImage && !data.heroAltText) {
            return false
        }
        return true
    }, {
        message: "heroAltText is required when coverImage is provided",
    }),
})

export const collections = {
    blog,
    projects,
}

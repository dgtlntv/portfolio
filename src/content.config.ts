import { defineCollection, z } from "astro:content"

const blog = defineCollection({
    type: "content",
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

const processStage = z.object({
    label: z.string(),
    id: z.string(),
    anchor: z.string().optional(),
    type: z.enum(["default", "branch", "merge"]).optional(),
    branchFrom: z.string().optional(),
    mergesInto: z.string().optional(),
    style: z.object({
        loop: z.boolean().optional(),
        pause: z.boolean().optional(),
        dashed: z.boolean().optional(),
        intensity: z.number().optional(),
    }).optional(),
})

const projects = defineCollection({
    type: "content",
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
        process: z.array(processStage).optional(),
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

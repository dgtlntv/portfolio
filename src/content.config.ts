import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.string(),
        author: z.string().optional(),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        heroLocation: z.string().optional(),
        stats: z.array(z.object({
            label: z.string(),
            value: z.string(),
        })).optional(),
    }),
});

const projects = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        heroLocation: z.string().optional(),
        asciiDarken: z.union([z.boolean(), z.number()]).optional(),
        stats: z.array(z.object({
            label: z.string(),
            value: z.string(),
        })).optional(),
    }),
});

export const collections = {
    blog,
    projects,
};
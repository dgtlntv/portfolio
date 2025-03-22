import { FrontMatter, MDXContent } from "../../types/mdx"

// Use Vite's import.meta.glob to load MDX files at build time
export async function getAllMdx(contentDir: string): Promise<MDXContent[]> {
    try {
        // Import all MDX files - CHANGED: removed 'import: "default"' to get all exports
        const mdxFiles = import.meta.glob("../../content/**/*.mdx", {
            eager: true,
        })

        // Create a pattern to match files in the specified directory
        const normalizedDir = contentDir.replace(/^\/+|\/+$/g, "") // Remove leading/trailing slashes
        const contentDirPattern = new RegExp(
            `^\\.\\.\/\\.\\.\\/content\\/${normalizedDir}\\/.*\\.mdx$`
        )

        // Filter files to only include those from the specified directory
        const filteredFiles = Object.keys(mdxFiles).filter((file) =>
            contentDirPattern.test(file)
        )

        // Process each MDX file - now accessing the full module correctly
        const mdxContents = filteredFiles.map((filePath) => {
            // Get the full module for this file path
            const mdxModule = mdxFiles[filePath]

            // Get frontmatter from the module
            const frontMatter = mdxModule.frontmatter || {}

            // Get the default export as the component
            const Component = mdxModule.default

            // Extract the filename without path and extension
            const filename =
                filePath.split("/").pop()?.replace(".mdx", "") || ""

            return {
                frontMatter: frontMatter as FrontMatter,
                slug: frontMatter.slug || filename,
                content: Component,
            }
        })

        // Sort by date (most recent first)
        return mdxContents
            .filter((item) => item.frontMatter && item.frontMatter.date)
            .sort((a, b) => {
                // Parse European date format (DD.MM.YYYY)
                const parseEuropeanDate = (dateStr: string) => {
                    const [day, month, year] = dateStr.split('.')
                    return new Date(`${year}-${month}-${day}`)
                }
                
                return (
                    parseEuropeanDate(b.frontMatter.date).getTime() -
                    parseEuropeanDate(a.frontMatter.date).getTime()
                )
            })
    } catch (error) {
        console.error("Error loading MDX files:", error)
        return []
    }
}

export async function getMdxBySlug(
    contentDir: string,
    slug: string
): Promise<MDXContent | null> {
    try {
        // CHANGED: removed 'import: "default"' to get all exports
        const mdxFiles = import.meta.glob("../../content/**/*.mdx", {
            eager: true,
        })

        // Create a pattern to match files in the specified directory
        const normalizedDir = contentDir.replace(/^\/+|\/+$/g, "") // Remove leading/trailing slashes
        const contentDirPattern = new RegExp(
            `^\\.\\.\/\\.\\.\\/content\\/${normalizedDir}\\/.*\\.mdx$`
        )

        // Filter files to only include those from the specified directory
        const filteredFiles = Object.keys(mdxFiles).filter((file) =>
            contentDirPattern.test(file)
        )

        // Find the file that matches the slug
        const mdxFile = filteredFiles.find((file) => {
            const filename = file.split("/").pop()?.replace(".mdx", "") || ""
            return filename === slug || file.includes(`${slug}.mdx`)
        })

        if (!mdxFile) {
            console.error(
                `No MDX file found for slug: ${slug} in ${contentDir}`
            )
            return null
        }

        // Get the full module
        const mdxModule = mdxFiles[mdxFile]

        // Get frontmatter from the module
        const frontMatter = mdxModule.frontmatter || {}

        // Get the default export as the component
        const Component = mdxModule.default

        return {
            frontMatter: frontMatter as FrontMatter,
            slug,
            content: Component,
        }
    } catch (error) {
        console.error(`Error loading MDX file for slug ${slug}:`, error)
        return null
    }
}

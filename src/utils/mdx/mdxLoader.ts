import { FrontMatter, MDXContent } from "../../types/mdx"

// Use Vite's import.meta.glob to load MDX files at build time
export async function getAllMdx(contentDir: string): Promise<MDXContent[]> {
    try {
        // Import all MDX files
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

        // Process each MDX file
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
        // Get all MDX content
        const allContent = await getAllMdx(contentDir);
        
        // Find the specific content by slug
        const mdxContent = allContent.find(content => content.slug === slug);
        
        if (!mdxContent) {
            console.error(`No MDX file found for slug: ${slug} in ${contentDir}`);
            return null;
        }
        
        return mdxContent;
    } catch (error) {
        console.error(`Error loading MDX file for slug ${slug}:`, error)
        return null
    }
}

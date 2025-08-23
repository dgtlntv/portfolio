import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import GridLayout from "../../components/Grid/GridLayout"
import WidthLayout from "../../components/Grid/WidthLayout"
import ProjectItem from "../../components/ProjectItem/ProjectItem"
import { MDXContent } from "../../types/mdx"
import { getAllMdx } from "../../utils/mdx/mdxLoader"

export const Route = createFileRoute("/projects/")({
    component: Projects,
})

function Projects() {
    const [mdxProjects, setMdxProjects] = useState<MDXContent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setLoading(true)
                const contentDir = "projects"
                const projectsData = await getAllMdx(contentDir)
                setMdxProjects(projectsData)
            } catch (err) {
                setError("Failed to load projects")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadProjects()
    }, [])

    return (
        <div className="overflow-hidden pt-0 pb-16">
            <WidthLayout>
                <GridLayout>
                    {mdxProjects.length > 0 && (
                        <>
                            {mdxProjects.map((project, index) => (
                                <ProjectItem
                                    key={project.slug}
                                    title={project.frontMatter.title}
                                    url={project.slug}
                                    imageUrl={
                                        project.frontMatter.coverImage
                                            ? project.frontMatter.coverImage
                                            : ""
                                    }
                                    heroLocation={
                                        project.frontMatter.heroLocation
                                    }
                                    asciiDarken={
                                        project.frontMatter.asciiDarken
                                    }
                                    isLeft={index % 2 === 0}
                                >
                                    {project.frontMatter.excerpt}
                                </ProjectItem>
                            ))}
                        </>
                    )}
                </GridLayout>
            </WidthLayout>
        </div>
    )
}

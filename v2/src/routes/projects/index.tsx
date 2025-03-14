import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
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
        <div className="overflow-hidden pb-16 pt-0 lg:py-12">
            <div className="relative mx-auto max-w-xl px-4 sm:px-6 lg:max-w-5xl lg:px-8">
                {mdxProjects.length > 0 && (
                    <>
                        {mdxProjects.map((project, index) => (
                            <div key={project.slug}>
                                <ProjectItem
                                    className="bg-gray-50"
                                    title={project.frontMatter.title}
                                    url={project.slug}
                                    imageUrl={
                                        project.frontMatter.coverImage
                                            ? project.frontMatter.coverImage
                                            : ""
                                    }
                                    isLeft={index % 2 === 0}
                                >
                                    {project.frontMatter.excerpt}
                                </ProjectItem>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import Article from "../../components/Article/Article"
import { MDXProvider } from "../../components/MDX/MDXProvider"
import { MDXContent } from "../../types/mdx"
import { getMdxBySlug } from "../../utils/mdx/mdxLoader"

export const Route = createFileRoute("/projects/$slug")({
    component: ProjectItem,
})

function ProjectItem() {
    const { slug } = Route.useParams()
    const [project, setProject] = useState<MDXContent | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true)
                const contentDir = "projects"
                const projectData = await getMdxBySlug(contentDir, slug)
                if (projectData) {
                    setProject(projectData)
                } else {
                    setError("Project not found")
                }
            } catch (err) {
                setError("Failed to load project")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadProject()
    }, [slug])

    if (loading) {
        return <></>
    }

    if (error || !project) {
        return (
            <div className="container mx-auto p-8">
                <div className="rounded-lg bg-red-50 p-6">
                    <h2 className="mb-2 text-2xl font-bold text-red-800">
                        Error
                    </h2>
                    <p className="text-red-700">
                        {error || "Project not found"}
                    </p>
                    <Link
                        to="/projects"
                        className="mt-4 inline-block text-blue-600 hover:underline"
                    >
                        Return to projects
                    </Link>
                </div>
            </div>
        )
    }

    // If we have a project, simply render its content
    const ProjectContent = project.content

    return (
        <div>
            <Article
                stats={project.frontMatter.stats || []}
                title={project.frontMatter.title}
                heroLocation={project.frontMatter.heroLocation || "center"}
                heroUrl={
                    project.frontMatter.coverImage
                        ? project.frontMatter.coverImage
                        : ""
                }
            >
                <MDXProvider>
                    <ProjectContent />
                </MDXProvider>
            </Article>
        </div>
    )
}

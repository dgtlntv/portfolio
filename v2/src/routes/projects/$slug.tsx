import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
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
        return (
            <div className="container mx-auto p-8">
                <div className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="h-80 bg-gray-200 rounded w-full mb-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5 mb-8"></div>
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="container mx-auto p-8">
                <div className="bg-red-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-red-800 mb-2">
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

    const ProjectContent = project.content
    const formattedDate = project.frontMatter.date
        ? new Date(project.frontMatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null

    return (
        <div className="container mx-auto p-8">
            <Link
                to="/projects"
                className="text-blue-600 hover:underline mb-4 inline-block"
            >
                ← Back to projects
            </Link>

            {/* Project Header */}
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">
                    {project.frontMatter.title}
                </h1>
                {formattedDate && (
                    <div className="text-sm text-gray-500">{formattedDate}</div>
                )}

                {/* Tags */}
                {project.frontMatter.tags &&
                    Array.isArray(project.frontMatter.tags) && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {(project.frontMatter.tags as string[]).map(
                                (tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                )
                            )}
                        </div>
                    )}
            </header>

            {/* Hero Image */}
            {project.frontMatter.coverImage && (
                <div className="mb-8">
                    <img
                        src={project.frontMatter.coverImage as string}
                        alt={project.frontMatter.title}
                        className="w-full h-auto rounded-lg"
                    />
                </div>
            )}

            {/* Project Content */}
            <article className="prose max-w-none">
                <MDXProvider>
                    <ProjectContent />
                </MDXProvider>
            </article>

            {/* Project Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
                {/* Project Links */}
                <div className="flex flex-wrap gap-4 mb-6">
                    {project.frontMatter.website && (
                        <a
                            href={project.frontMatter.website as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            Visit Website
                        </a>
                    )}
                    {project.frontMatter.github && (
                        <a
                            href={project.frontMatter.github as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            View on GitHub
                        </a>
                    )}
                </div>

                <Link to="/projects" className="text-blue-600 hover:underline">
                    ← Back to projects
                </Link>
            </footer>
        </div>
    )
}

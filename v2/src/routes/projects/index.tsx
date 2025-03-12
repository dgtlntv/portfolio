import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
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
            <div className="mx-auto grid grid-cols-1 items-center gap-8 px-6 lg:max-w-5xl lg:grid-cols-5 lg:px-16 lg:py-6">
                <img
                    className="mx-auto h-40 rounded-full lg:mx-0 lg:h-28"
                    src="https://res.cloudinary.com/drsfxkvt1/image/upload/v1659375088/portfolio/profile_pic_wzxape.jpg"
                    alt=""
                />
                <p className="mx-auto max-w-xl px-4 font-fancy text-2xl font-medium tracking-tight text-gray-900 sm:px-6 sm:text-3xl lg:col-span-4 lg:max-w-5xl lg:px-0">
                    I am Maximilian Blazek a UX Designer with a focus on
                    Enterprise applications and Design systems.
                </p>
            </div>

            <div className="relative mx-auto max-w-xl px-4 sm:px-6 lg:max-w-5xl lg:px-8">
                {/* MDX-based project items */}
                {mdxProjects.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-6">Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {mdxProjects.map((project) => (
                                <div
                                    key={project.slug}
                                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {project.frontMatter.coverImage && (
                                        <img
                                            src={
                                                project.frontMatter
                                                    .coverImage as string
                                            }
                                            alt={project.frontMatter.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold mb-2">
                                            {project.frontMatter.title}
                                        </h3>
                                        <p className="text-gray-700 mb-4">
                                            {project.frontMatter.excerpt}
                                        </p>
                                        <Link
                                            to="/projects/$slug"
                                            params={{
                                                slug: project.slug,
                                            }}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            View Project →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

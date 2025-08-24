import { createFileRoute } from "@tanstack/react-router"
import GridLayout from "../../components/Grid/GridLayout"
import WidthLayout from "../../components/Grid/WidthLayout"
import ProjectItem from "../../components/ProjectItem/ProjectItem"
import { getAllMdx } from "../../utils/mdx/mdxLoader"

export const Route = createFileRoute("/projects/")({
    loader: async () => {
        const contentDir = "projects"
        const projectsData = await getAllMdx(contentDir)
        return { projects: projectsData }
    },
    component: Projects,
})

function Projects() {
    const { projects: mdxProjects } = Route.useLoaderData()

    return (
        <div className="overflow-hidden pt-0 pb-16">
            <WidthLayout>
                <GridLayout>
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
                </GridLayout>
            </WidthLayout>
        </div>
    )
}

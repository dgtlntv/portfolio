import GridLayout from "./Grid/GridLayout";
import WidthLayout from "./Grid/WidthLayout";
import ProjectItem from "./ProjectItem/ProjectItem";
import { MDXContent } from "../types/mdx";

interface ProjectsListProps {
    projects: MDXContent[];
}

export default function ProjectsList({ projects }: ProjectsListProps) {
    return (
        <div className="overflow-hidden pt-0 pb-16">
            <WidthLayout>
                <GridLayout>
                    {projects.map((project, index) => (
                        <ProjectItem
                            key={project.slug}
                            title={project.frontMatter.title}
                            url={project.slug}
                            imageUrl={
                                project.frontMatter.coverImage
                                    ? project.frontMatter.coverImage
                                    : ""
                            }
                            heroLocation={project.frontMatter.heroLocation}
                            asciiDarken={project.frontMatter.asciiDarken}
                            isLeft={index % 2 === 0}
                        >
                            {project.frontMatter.excerpt}
                        </ProjectItem>
                    ))}
                </GridLayout>
            </WidthLayout>
        </div>
    );
}
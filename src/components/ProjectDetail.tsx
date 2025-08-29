import { useEffect, useState } from "react";
import Article from "./Article/Article";
import { MDXProvider } from "./MDX/MDXProvider";
import { MDXContent } from "../types/mdx";
import { getMdxBySlug } from "../utils/mdx/mdxLoader";

interface ProjectDetailProps {
    slug: string;
}

export default function ProjectDetail({ slug }: ProjectDetailProps) {
    const [project, setProject] = useState<MDXContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true);
                const contentDir = "projects";
                const projectData = await getMdxBySlug(contentDir, slug);
                if (projectData) {
                    setProject(projectData);
                } else {
                    setError("Project not found");
                }
            } catch (err) {
                setError("Failed to load project");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [slug]);

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
                    <a
                        href="/projects"
                        className="mt-4 inline-block text-blue-600 hover:underline"
                    >
                        Return to projects
                    </a>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-64 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    // If we have a project, simply render its content
    const ProjectContent = project.content;

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
    );
}
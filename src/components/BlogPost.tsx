import { useEffect, useState } from "react";
import Article from "./Article/Article";
import GridLayout from "./Grid/GridLayout";
import { MDXProvider } from "./MDX/MDXProvider";
import { MDXContent } from "../types/mdx";
import { getMdxBySlug } from "../utils/mdx/mdxLoader";

interface BlogPostProps {
    slug: string;
}

export default function BlogPost({ slug }: BlogPostProps) {
    const [post, setPost] = useState<MDXContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                const contentDir = "blog";
                const postData = await getMdxBySlug(contentDir, slug);
                if (postData) {
                    setPost(postData);
                } else {
                    setError("Post not found");
                }
            } catch (err) {
                setError("Failed to load post");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [slug]);

    if (error || !post) {
        return (
            <GridLayout>
                <div className="p-8 md:col-span-3 md:col-start-2">
                    <div className="rounded-lg bg-red-50 p-6">
                        <h2 className="mb-2 text-2xl font-bold text-red-800">
                            Error
                        </h2>
                        <p className="text-red-700">
                            {error || "Post not found"}
                        </p>
                        <a
                            href="/blog"
                            className="mt-4 inline-block text-blue-600 hover:underline"
                        >
                            Return to blog
                        </a>
                    </div>
                </div>
            </GridLayout>
        );
    }

    if (loading) {
        return (
            <GridLayout>
                <div className="p-8 md:col-span-3 md:col-start-2">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                    </div>
                </div>
            </GridLayout>
        );
    }

    // If we have a post, simply render its content
    const PostContent = post.content;

    return (
        <div>
            <Article
                stats={
                    post.frontMatter.stats || [
                        {
                            label: "Author",
                            value: post.frontMatter.author || "",
                        },
                        { label: "Date", value: post.frontMatter.date || "" },
                    ]
                }
                title={post.frontMatter.title}
                heroLocation={post.frontMatter.heroLocation || "center"}
                heroUrl={
                    post.frontMatter.coverImage
                        ? post.frontMatter.coverImage
                        : ""
                }
            >
                <MDXProvider>
                    <PostContent />
                </MDXProvider>
            </Article>
        </div>
    );
}
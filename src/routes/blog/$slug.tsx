import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import Article from "../../components/Article/Article"
import GridLayout from "../../components/Grid/GridLayout"
import { MDXProvider } from "../../components/MDX/MDXProvider"
import { MDXContent } from "../../types/mdx"
import { getMdxBySlug } from "../../utils/mdx/mdxLoader"

export const Route = createFileRoute("/blog/$slug")({
    component: BlogPost,
})

function BlogPost() {
    const { slug } = Route.useParams()
    const [post, setPost] = useState<MDXContent | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true)
                const contentDir = "blog"
                const postData = await getMdxBySlug(contentDir, slug)
                if (postData) {
                    setPost(postData)
                } else {
                    setError("Post not found")
                }
            } catch (err) {
                setError("Failed to load post")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadPost()
    }, [slug])

    if (loading) {
        return (
            <GridLayout>
                <div className="animate-pulse p-8 md:col-span-5">
                    <div className="mb-4 h-12 w-3/4 rounded bg-gray-200"></div>
                    <div className="mb-8 h-4 w-1/4 rounded bg-gray-200"></div>
                    <div className="mb-4 h-4 w-full rounded bg-gray-200"></div>
                    <div className="mb-4 h-4 w-full rounded bg-gray-200"></div>
                    <div className="mb-8 h-4 w-4/5 rounded bg-gray-200"></div>
                </div>
            </GridLayout>
        )
    }

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
                        <Link
                            to="/blog"
                            className="mt-4 inline-block text-blue-600 hover:underline"
                        >
                            Return to blog
                        </Link>
                    </div>
                </div>
            </GridLayout>
        )
    }
    
    // If we have a post, simply render its content
    const PostContent = post.content;

    return (
        <div>
            <Article
                stats={post.frontMatter.stats || [
                    { label: "Author", value: post.frontMatter.author || "" },
                    { label: "Date", value: post.frontMatter.date || "" }
                ]}
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
    )
}

import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import GridLayout from "../../components/Grid/GridLayout"
import WidthLayout from "../../components/Grid/WidthLayout"
import { MDXContent } from "../../types/mdx"
import { getAllMdx } from "../../utils/mdx/mdxLoader"

export const Route = createFileRoute("/blog/")({
    component: Blog,
})

interface PostsByYear {
    [year: string]: MDXContent[]
}

function Blog() {
    const [posts, setPosts] = useState<MDXContent[]>([])
    const [postsByYear, setPostsByYear] = useState<PostsByYear>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true)
                const contentDir = "blog"
                const postsData = await getAllMdx(contentDir)

                setPosts(postsData)

                // Group posts by year
                const groupedByYear: PostsByYear = {}
                
                // Parse European date format (DD.MM.YYYY)
                const parseEuropeanDate = (dateStr: string) => {
                    const [day, month, year] = dateStr.split('.')
                    return new Date(`${year}-${month}-${day}`)
                }
                
                postsData.forEach((post) => {
                    const year = parseEuropeanDate(post.frontMatter.date)
                        .getFullYear()
                        .toString()
                    if (!groupedByYear[year]) {
                        groupedByYear[year] = []
                    }
                    groupedByYear[year].push(post)
                })

                // Sort years in descending order
                setPostsByYear(groupedByYear)
            } catch (err) {
                setError("Failed to load blog posts")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadPosts()
    }, [])

    if (loading) {
        return (
            <GridLayout>
                <div className="animate-pulse py-8 md:col-span-5">
                    <div className="mb-6 h-8 w-24 rounded bg-gray-200"></div>
                    <div className="mb-8 pl-6">
                        <div className="mb-3 h-6 w-full rounded bg-gray-200"></div>
                        <div className="mb-3 h-6 w-full rounded bg-gray-200"></div>
                        <div className="mb-3 h-6 w-full rounded bg-gray-200"></div>
                    </div>
                    <div className="mb-6 h-8 w-24 rounded bg-gray-200"></div>
                    <div className="pl-6">
                        <div className="mb-3 h-6 w-full rounded bg-gray-200"></div>
                        <div className="mb-3 h-6 w-full rounded bg-gray-200"></div>
                    </div>
                </div>
            </GridLayout>
        )
    }

    if (error) {
        return (
            <GridLayout>
                <div className="py-8 md:col-span-5">
                    <div className="rounded-lg bg-red-50 p-6">
                        <h2 className="mb-2 text-2xl font-bold text-red-800">
                            Error
                        </h2>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            </GridLayout>
        )
    }

    const sortedYears = Object.keys(postsByYear).sort(
        (a, b) => parseInt(b) - parseInt(a),
    )

    return (
        <WidthLayout>
            <div className="mt-18">
                {posts.length > 0 ? (
                    <>
                        {sortedYears.map((year) => (
                            <div key={year} className="mb-12">
                                <GridLayout>
                                    <h2 className="font-fancy mb-6 text-right text-4xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:col-span-1 md:col-start-2">
                                        {year}
                                    </h2>
                                    <div className="md:col-span-9">
                                        {postsByYear[year].map((post) => {
                                            // Parse European date format (DD.MM.YYYY)
                                            const parseEuropeanDate = (dateStr: string) => {
                                                const [day, month, year] = dateStr.split('.')
                                                return new Date(`${year}-${month}-${day}`)
                                            }
                                            
                                            const postDate = parseEuropeanDate(
                                                post.frontMatter.date
                                            )
                                            const formattedDate =
                                                postDate.toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    },
                                                )

                                            return (
                                                <div
                                                    key={post.slug}
                                                    className="mb-3"
                                                >
                                                    <GridLayout className="items-baseline">
                                                        <span className="font-fancy text-right text-sm font-semibold text-gray-500 md:col-span-1 md:col-start-2">
                                                            {formattedDate}
                                                        </span>
                                                        <h3 className="pl-6 text-lg text-gray-500 transition-colors hover:text-red-500 md:col-span-6 md:col-start-3">
                                                            <Link
                                                                to="/blog/$slug"
                                                                params={{
                                                                    slug: post.slug,
                                                                }}
                                                                className="block"
                                                            >
                                                                {
                                                                    post
                                                                        .frontMatter
                                                                        .title
                                                                }
                                                            </Link>
                                                        </h3>
                                                    </GridLayout>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </GridLayout>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="rounded-lg bg-gray-50 py-12 text-center md:col-span-5">
                        <h3 className="mb-2 text-2xl font-semibold">
                            No blog posts yet
                        </h3>
                        <p className="text-gray-600">
                            Check back soon for new content!
                        </p>
                    </div>
                )}
            </div>
        </WidthLayout>
    )
}

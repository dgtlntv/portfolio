// Remove TanStack Router dependency
import GridLayout from "./Grid/GridLayout";
import WidthLayout from "./Grid/WidthLayout";
import { MDXContent } from "../types/mdx";

interface PostsByYear {
    [year: string]: MDXContent[];
}

interface BlogListProps {
    posts: MDXContent[];
    postsByYear: PostsByYear;
}

export default function BlogList({ posts, postsByYear }: BlogListProps) {
    const sortedYears = Object.keys(postsByYear).sort(
        (a, b) => parseInt(b) - parseInt(a),
    );

    return (
        <WidthLayout>
            <div className="mt-18">
                {posts.length > 0 ? (
                    <>
                        {sortedYears.map((year) => (
                            <div key={year} className="mb-12">
                                <GridLayout>
                                    <div className="md:col-span-9">
                                        <div className="grid grid-cols-9">
                                            <h2 className="font-fancy mb-6 text-left text-4xl font-extrabold tracking-tight text-gray-900 sm:col-span-2 sm:col-start-1 sm:text-right sm:text-3xl">
                                                {year}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="md:col-span-9">
                                        {postsByYear[year].map((post) => {
                                            // Parse European date format (DD.MM.YYYY)
                                            const parseEuropeanDate = (
                                                dateStr: string,
                                            ) => {
                                                const [day, month, year] =
                                                    dateStr.split(".");
                                                return new Date(
                                                    `${year}-${month}-${day}`,
                                                );
                                            };

                                            const postDate = parseEuropeanDate(
                                                post.frontMatter.date,
                                            );
                                            const formattedDate =
                                                postDate.toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    },
                                                );

                                            return (
                                                <div
                                                    key={post.slug}
                                                    className="mb-3"
                                                >
                                                    <div className="grid grid-cols-9 items-baseline gap-0">
                                                        <span className="font-fancy col-span-2 col-start-1 text-left text-sm font-semibold text-gray-500 sm:col-span-2 sm:col-start-1 sm:text-right">
                                                            {formattedDate}
                                                        </span>
                                                        <h3 className="col-span-7 col-start-3 text-lg text-gray-500 transition-colors hover:text-red-500 sm:col-span-6 sm:col-start-3 sm:pl-6 md:col-span-6 md:col-start-3">
                                                            <a
                                                                href={`/blog/${post.slug}`}
                                                                className="block"
                                                            >
                                                                {
                                                                    post
                                                                        .frontMatter
                                                                        .title
                                                                }
                                                            </a>
                                                        </h3>
                                                    </div>
                                                </div>
                                            );
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
    );
}
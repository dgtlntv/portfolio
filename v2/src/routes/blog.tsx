import { createFileRoute, Link } from '@tanstack/react-router'
import React, { useEffect, useState } from 'react'
import { MDXContent } from '../types/mdx'
import { getAllMdx } from '../utils/mdx/mdxLoader'

export const Route = createFileRoute('/blog')({
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
        const contentDir = '/home/portfolio/v2/src/content/blog'
        const postsData = await getAllMdx(contentDir)
        setPosts(postsData)
        
        // Group posts by year
        const groupedByYear: PostsByYear = {}
        postsData.forEach(post => {
          const year = new Date(post.frontMatter.date).getFullYear().toString()
          if (!groupedByYear[year]) {
            groupedByYear[year] = []
          }
          groupedByYear[year].push(post)
        })
        
        // Sort years in descending order
        setPostsByYear(groupedByYear)
      } catch (err) {
        setError('Failed to load blog posts')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-24 mb-6"></div>
          <div className="pl-6 mb-8">
            <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-24 mb-6"></div>
          <div className="pl-6">
            <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  const sortedYears = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a))

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-16">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600">
          Thoughts, stories, and ideas about design, development, and creativity.
        </p>
      </header>

      {posts.length > 0 ? (
        <div>
          {sortedYears.map(year => (
            <div key={year} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">{year}</h2>
              <div className="pl-8">
                {postsByYear[year].map(post => {
                  const postDate = new Date(post.frontMatter.date)
                  const formattedDate = postDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                  
                  return (
                    <div key={post.slug} className="mb-8 group">
                      <div className="flex items-baseline mb-2">
                        <span className="text-sm font-semibold text-gray-500 w-20">{formattedDate}</span>
                        <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                          <Link
                            to="/blog/$slug"
                            params={{ slug: post.slug }}
                            className="block"
                          >
                            {post.frontMatter.title}
                          </Link>
                        </h3>
                      </div>
                      
                      <div className="pl-20">
                        <p className="text-gray-700 mb-3">{post.frontMatter.excerpt}</p>
                        
                        {/* Tags */}
                        {post.frontMatter.tags && Array.isArray(post.frontMatter.tags) && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {(post.frontMatter.tags as string[]).map((tag, index) => (
                              <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-2xl font-semibold mb-2">No blog posts yet</h3>
          <p className="text-gray-600">Check back soon for new content!</p>
        </div>
      )}
    </div>
  )
}
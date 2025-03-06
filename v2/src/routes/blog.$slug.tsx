import { createFileRoute, Link } from '@tanstack/react-router'
import React, { useEffect, useState } from 'react'
import { MDXProvider } from '../components/MDX/MDXProvider'
import { MDXContent } from '../types/mdx'
import { getMdxBySlug } from '../utils/mdx/mdxLoader'

export const Route = createFileRoute('/blog/$slug')({
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
        const contentDir = '/home/portfolio/v2/src/content/blog'
        const postData = await getMdxBySlug(contentDir, slug)
        if (postData) {
          setPost(postData)
        } else {
          setError('Post not found')
        }
      } catch (err) {
        setError('Failed to load post')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5 mb-8"></div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error || 'Post not found'}</p>
          <Link to="/blog" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to blog
          </Link>
        </div>
      </div>
    )
  }

  const PostContent = post.content
  const formattedDate = new Date(post.frontMatter.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="container mx-auto p-8">
      <Link to="/blog" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to all posts
      </Link>
      
      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.frontMatter.title}</h1>
        <div className="text-sm text-gray-500">{formattedDate}</div>
        
        {/* Tags */}
        {post.frontMatter.tags && Array.isArray(post.frontMatter.tags) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {(post.frontMatter.tags as string[]).map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      
      {/* Cover Image */}
      {post.frontMatter.coverImage && (
        <div className="mb-8">
          <img 
            src={post.frontMatter.coverImage as string}
            alt={post.frontMatter.title}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      {/* Post Content */}
      <article className="prose max-w-none">
        <MDXProvider>
          <PostContent />
        </MDXProvider>
      </article>
      
      {/* Post Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <Link to="/blog" className="text-blue-600 hover:underline">
          ← Back to all posts
        </Link>
      </footer>
    </div>
  )
}
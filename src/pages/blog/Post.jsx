import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    axios.get(API + '/api/me/blog/' + slug)
      .then(res => setPost(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex gap-2">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
      </div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-center px-6">
      <div>
        <p className="text-6xl mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Post not found</h1>
        <p className="text-gray-400 mb-6">This post may have been removed or the link is incorrect.</p>
        <Link to="/blog" className="text-indigo-400 hover:text-indigo-300 transition">
          ← Back to blog
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24">
      <article className="max-w-3xl mx-auto px-6 py-12">

        {/* Back link */}
        <Link to="/blog" className="text-indigo-400 hover:text-indigo-300 text-sm transition mb-8 inline-block">
          ← Back to blog
        </Link>

        {/* Category and date */}
        <div className="flex items-center gap-3 mb-6">
          {post.category && (
            <span className="text-xs px-2 py-1 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
              {post.category}
            </span>
          )}
          <span className="text-xs text-gray-500">
            {new Date(post.date_created).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="text-xs text-gray-500">{post.views} views</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Featured image */}
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full rounded-xl mb-8 object-cover max-h-96"
          />
        )}

        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.split(',').map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="prose prose-invert max-w-none">
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
            {post.body}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex justify-between items-center">
          <Link to="/blog" className="text-indigo-400 hover:text-indigo-300 text-sm transition">
            ← Back to blog
          </Link>
          <Link to="/#contact" className="text-sm px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition">
            Hire Me
          </Link>
        </div>

      </article>
    </div>
  )
}
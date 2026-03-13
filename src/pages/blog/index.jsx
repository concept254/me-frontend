import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get(API + '/api/me/blog')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const categories = ['All', ...new Set(posts.map(p => p.category).filter(Boolean))]

  const filtered = posts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(search.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24">

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-16 border-b border-gray-800">
        <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-2">Thoughts and ideas</p>
        <h1 className="text-5xl font-black text-white mb-4">Blog</h1>
        <p className="text-gray-400 max-w-xl">
          Articles about software engineering, tech trends, tools and lessons learned building products.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 rounded-xl bg-gray-900 border border-gray-700 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex gap-2 justify-center py-20">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">✍️</p>
            <p className="text-gray-500 text-lg">No posts yet — check back soon!</p>
            <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm mt-4 inline-block">
              ← Back to home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <Link
                key={post.id}
                to={'/blog/' + post.slug}
                className="bg-gray-900 rounded-xl border border-gray-800 hover:border-indigo-500/50 transition overflow-hidden group"
              >
                {post.featured_image ? (
                  <img src={post.featured_image} alt={post.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 flex items-center justify-center">
                    <span className="text-4xl">✍️</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {post.category && (
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
                        {post.category}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(post.date_created).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-500">{post.views} views</span>
                    <span className="text-indigo-400 text-sm group-hover:translate-x-1 transition-transform">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Link to="/" className="text-gray-500 hover:text-white text-sm transition">
            ← Back to home
          </Link>
        </div>
      </div>

    </div>
  )
}
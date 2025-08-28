'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Navigation, Footer, FloatingElements } from '../lib/components'
import { Calendar, User, ArrowRight, Clock, Tag, Search, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  author: string
  category: string
  status: string
  read_time?: number
  tags?: string[]
  published_at?: string
  created_at: string
}

export default function BlogPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['All', 'Technical', 'Guides', 'Performance', 'Updates']

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts?limit=20')
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Technical': 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      'Guides': 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      'Performance': 'from-green-500/20 to-emerald-500/20 border-green-500/30',
      'Updates': 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
    }
    return colors[category] || 'from-white/10 to-white/5 border-white/20'
  }

  if (loading) {
    return (
      <div className="min-h-screen animated-bg relative overflow-hidden flex items-center justify-center">
        <FloatingElements />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white/70">Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center justify-center px-6 relative">
        <motion.div 
          className="text-center relative z-10 max-w-5xl mx-auto"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-3 bg-glass-100 backdrop-blur-md rounded-full px-6 py-3 border border-glass-200 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-5 h-5 text-white/90" />
              <span className="text-white/90 font-medium">Insights on Mac performance and optimization</span>
            </motion.div>

            <h1 className="text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tight mb-8">
              Performance
              <br />
              <span className="morphing-gradient text-breathe">Insights</span>
            </h1>
            
            <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto mb-12">
              Expert guides, technical deep-dives, and the latest insights 
              <br />
              <strong className="text-white">to unleash your Mac's full potential.</strong>
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-12 text-white/60"
          >
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">{posts.length}+</div>
              <div>Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">4</div>
              <div>Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">2.1M+</div>
              <div>Readers</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 px-6 bg-glass-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-4 rounded-2xl font-medium transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-white text-gray-900'
                      : 'bg-glass-100 backdrop-blur-md border border-glass-200 text-white/80 hover:text-white hover:border-glass-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  className={`glass-card rounded-3xl overflow-hidden border hover:border-glass-300 transition-all duration-300 bg-gradient-to-br ${getCategoryColor(post.category)}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="p-8">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm text-white/80 border border-white/20">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{post.read_time || 5} min</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-white/70 mb-6 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-white/60 text-sm mb-6">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.published_at || post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/60 border border-white/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Read More */}
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-white hover:text-white/80 font-medium group"
                    >
                      Read Article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <TrendingUp className="w-16 h-16 text-white/20 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchQuery || selectedCategory !== 'All' ? 'No articles found' : 'Coming Soon'}
              </h3>
              <p className="text-white/60 mb-8">
                {searchQuery || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'We\'re working on amazing content for you. Check back soon!'}
              </p>
              {(searchQuery || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                  }}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Clear filters →
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { 
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  Search,
  ChevronRight,
  Save,
  X
} from 'lucide-react'
import { Navigation, Footer } from '../../lib/components'

import type { BlogPost } from '../../lib/supabase'

export default function BlogAdminPage() {
  const { user, isLoaded } = useUser()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isCreating, setIsCreating] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Technical',
    status: 'draft' as const,
    tags: ''
  })

  const categories = ['Technical', 'Guides', 'Productivity', 'Updates', 'Design', 'Performance']

  useEffect(() => {
    if (isLoaded) {
      fetchPosts()
    }
  }, [isLoaded])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts?status=all&limit=50')
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.posts || [])
      } else {
        throw new Error(data.error || 'Failed to fetch posts')
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = () => {
    setIsCreating(true)
    setEditingPost(null)
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: user?.firstName + ' ' + user?.lastName || 'Admin',
      category: 'Technical',
      status: 'draft',
      tags: ''
    })
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setIsCreating(true)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      status: post.status,
      tags: post.tags?.join(', ') || ''
    })
  }

  const handleSavePost = async () => {
    try {
      const postData = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        date: new Date().toISOString(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }

      if (editingPost) {
        // Update existing post
        setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...postData } : p))
      } else {
        // Create new post
        const newPost: BlogPost = {
          ...postData,
          id: Date.now().toString(),
          readTime: `${Math.ceil(formData.content.split(' ').length / 200)} min read`
        }
        setPosts([newPost, ...posts])
      }

      setIsCreating(false)
      setEditingPost(null)
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== postId))
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen animated-bg relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white/70">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <Navigation />
      
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-2">
                  Blog <span className="morphing-gradient">Admin</span>
                </h1>
                <p className="text-white/70 text-lg">
                  Create and manage blog posts
                </p>
              </div>
              
              <motion.button
                onClick={handleCreatePost}
                className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                New Post
              </motion.button>
            </div>
          </motion.div>

          {/* Create/Edit Form */}
          {isCreating && (
            <motion.div
              className="glass-card rounded-3xl p-8 border border-glass-200 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h2>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                      placeholder="Post title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-3 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                      placeholder="url-slug (auto-generated if empty)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-2">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 resize-none"
                    placeholder="Brief description"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-2">Content (Markdown)</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    className="w-full px-4 py-3 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 resize-none font-mono text-sm"
                    placeholder="Write your content in Markdown..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-xl text-white focus:outline-none focus:border-white/30"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                      className="w-full px-4 py-3 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-xl text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="draft" className="bg-gray-900">Draft</option>
                      <option value="published" className="bg-gray-900">Published</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    onClick={handleSavePost}
                    className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-5 h-5" />
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setIsCreating(false)}
                    className="bg-glass-100 backdrop-blur-md border border-glass-200 text-white font-semibold py-3 px-6 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-white text-gray-900'
                    : 'bg-glass-100 backdrop-blur-md border border-glass-200 text-white/80 hover:text-white'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-gray-900'
                      : 'bg-glass-100 backdrop-blur-md border border-glass-200 text-white/80 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                className="glass-card rounded-3xl p-6 border border-glass-200 hover:border-glass-300 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            {post.category}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published' 
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {post.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-white/70 mb-4">{post.excerpt}</p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                          <span key={tag} className="bg-glass-100 backdrop-blur-md px-3 py-1 rounded-full text-sm text-white/70">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => handleEditPost(post)}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </motion.button>
                      
                      <motion.a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 text-white/60 hover:text-white font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </motion.a>
                      
                      <motion.button
                        onClick={() => handleDeletePost(post.id)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg">No blog posts found</p>
              <p className="text-white/40">Create your first post to get started</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
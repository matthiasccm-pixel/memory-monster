'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Navigation, Footer, FloatingElements } from '../../lib/components'
import { Calendar, User, Clock, ArrowLeft, Share, BookOpen, Tag, TrendingUp, Heart } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  status: string
  read_time?: number
  tags?: string[]
  published_at?: string
  created_at: string
  seo_title?: string
  seo_description?: string
}

export default function BlogArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/slug/${slug}`)
      const data = await response.json()
      
      if (data.success) {
        setPost(data.post)
      } else {
        setError(data.error || 'Post not found')
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
      setError('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

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
          <p className="text-white/70">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen animated-bg relative overflow-hidden flex items-center justify-center">
        <FloatingElements />
        <Navigation />
        <div className="text-center relative z-10">
          <TrendingUp className="w-16 h-16 text-white/20 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-white/60 mb-8">
            {error || "The article you're looking for doesn't exist or has been moved."}
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center px-6 relative">
        <motion.div 
          className="text-center relative z-10 max-w-5xl mx-auto"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Back to Blog */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </motion.div>

            {/* Category Badge */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className={`inline-block px-6 py-3 bg-gradient-to-r ${getCategoryColor(post.category)} backdrop-blur-md rounded-full text-white/90 font-medium border`}>
                {post.category}
              </span>
            </motion.div>

            <h1 className="text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight mb-8">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-white/80 leading-relaxed max-w-4xl mx-auto mb-8">
                {post.excerpt}
              </p>
            )}
          </motion.div>

          {/* Meta Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8 text-white/60 mb-8"
          >
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.read_time || 5} min read</span>
            </div>
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {post.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-glass-100 backdrop-blur-md rounded-full text-sm text-white/70 border border-glass-200">
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Article Content */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.article
            className="glass-card rounded-3xl p-12 border border-glass-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div 
              className="prose prose-lg prose-invert max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h1:text-4xl prose-h1:mb-8 prose-h1:leading-tight
                prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:leading-tight
                prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
                prose-p:text-white/80 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary/80
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:text-white/80 prose-ol:text-white/80
                prose-li:mb-2 prose-li:leading-relaxed
                prose-code:text-primary prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-white/70"
              dangerouslySetInnerHTML={{ 
                __html: post.content
                  .replace(/^# /gm, '## ') // Convert h1 to h2
                  .replace(/\n/g, '<br>') // Basic line breaks
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
                  .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
                  .replace(/^## (.*$)/gm, '<h2>$1</h2>') // H2
                  .replace(/^### (.*$)/gm, '<h3>$1</h3>') // H3
                  .replace(/^- (.*$)/gm, '<li>$1</li>') // List items
                  .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>') // Wrap list items
                  .replace(/<br><br>/g, '</p><p>') // Paragraphs
                  .replace(/^(?!<[h|u|l])(.+)(?<!>)$/gm, '<p>$1</p>') // Wrap remaining lines in paragraphs
              }}
            />

            {/* Social Share */}
            <div className="mt-16 pt-8 border-t border-glass-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Heart className="w-5 h-5 text-white/60" />
                  <span className="text-white/60">Enjoyed this article?</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      navigator.share?.({
                        title: post.title,
                        text: post.excerpt,
                        url: window.location.href
                      }).catch(() => {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(window.location.href)
                      })
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-glass-100 backdrop-blur-md rounded-xl text-white/80 hover:text-white border border-glass-200 hover:border-glass-300 transition-all"
                  >
                    <Share className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Related Articles or Call to Action */}
      <section className="py-20 px-6 bg-glass-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-8" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Optimize Your Mac?
            </h2>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Put these insights into action with Memory Monster's intelligent optimization.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-4 px-8 rounded-2xl shadow-2xl"
              >
                Get Memory Monster
              </Link>
              
              <Link
                href="/blog"
                className="text-white/80 hover:text-white font-medium text-lg group flex items-center gap-2"
              >
                Read more articles
                <BookOpen className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Navigation, Footer, FloatingElements } from '../lib/components'
import { Globe, Users, Code, Sparkles, MapPin, Coffee, Lightbulb, Rocket, TrendingUp, Award, Shield, Zap, Heart, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [orbitingElements, setOrbitingElements] = useState(0)
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    memoryFreed: 0,
    countries: 0,
    apps: 0
  })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  
  // Simple orbiting animation
  useEffect(() => {
    const interval = setInterval(() => {
      setOrbitingElements(prev => prev + 1)
    }, 50)
    
    return () => clearInterval(interval)
  }, [])

  // Animate stats on mount
  useEffect(() => {
    const targets = { users: 2100000, memoryFreed: 847, countries: 127, apps: 50000 }
    const duration = 2000
    const steps = 60
    const stepTime = duration / steps
    
    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      
      setAnimatedStats({
        users: Math.floor(targets.users * progress),
        memoryFreed: Math.floor(targets.memoryFreed * progress),
        countries: Math.floor(targets.countries * progress),
        apps: Math.floor(targets.apps * progress)
      })
      
      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedStats(targets)
      }
    }, stepTime)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center px-6 relative">
        <motion.div 
          className="text-center relative z-10 max-w-6xl mx-auto"
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
              <Heart className="w-5 h-5 text-white/90" />
              <span className="text-white/90 font-medium">Built with obsession, scaled with purpose</span>
            </motion.div>

            <h1 className="text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tight mb-8">
              We're
              <br />
              <span className="morphing-gradient text-breathe">Memory Monster</span>
            </h1>
            
            <p className="text-2xl text-white/80 leading-relaxed max-w-5xl mx-auto mb-12">
              Born from frustration. Built by obsession. 
              <br />
              <strong className="text-white">Powered by the belief that your Mac should be lightning fast.</strong>
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-12 text-white/60"
          >
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">50+</div>
              <div>Global Team</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">127</div>
              <div>Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">2.1M+</div>
              <div>Happy Users</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Memory by the Numbers */}
      <section className="py-20 px-6 bg-glass-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl font-black text-white mb-8 leading-tight">
              Memory by the <span className="morphing-gradient">Numbers</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Every day, millions of Mac users trust us to keep their systems running at peak performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { value: animatedStats.users.toLocaleString() + '+', label: 'Active Users', sublabel: 'Trust Memory Monster daily', icon: Users, color: 'from-blue-500 to-cyan-500' },
              { value: animatedStats.memoryFreed + 'TB+', label: 'Memory Freed', sublabel: 'Every single day', icon: Zap, color: 'from-green-500 to-emerald-500' },
              { value: animatedStats.countries.toString(), label: 'Countries', sublabel: 'Worldwide reach', icon: Globe, color: 'from-purple-500 to-pink-500' },
              { value: animatedStats.apps.toLocaleString() + '+', label: 'Apps Optimized', sublabel: 'Performance enhanced', icon: Award, color: 'from-orange-500 to-red-500' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="glass-card rounded-3xl p-8 border border-glass-200 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mx-auto mb-6 flex items-center justify-center`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white font-bold text-lg mb-2">{stat.label}</div>
                <div className="text-white/60 text-sm">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-16 items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-4xl font-bold text-white mb-8 leading-tight">
                It Started with <span className="text-primary">Pure Frustration</span>
              </h2>
              <div className="space-y-6 text-lg text-white/80 leading-relaxed">
                <p>
                  Picture this: You're a developer deep in flow state. Your designer colleague is crafting pixel-perfect 
                  interfaces. Your analyst teammate is crunching massive datasets. Then <strong className="text-white">BAM</strong> – 
                  the dreaded beach ball appears.
                </p>
                <p>
                  Chrome eating <span className="text-primary font-bold">8GB</span>. 
                  Slack hogging <span className="text-primary font-bold">3GB</span>. 
                  That Adobe suite? Another <span className="text-primary font-bold">6GB</span> gone.
                </p>
                <p>
                  We were brilliant minds building amazing things, but our tools were betraying us every single day. 
                  <strong className="text-white">Something had to change.</strong>
                </p>
              </div>
            </div>
            
            <div className="relative">
              <motion.div 
                className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {[
                  { icon: Code, label: 'Frustrated Developers', color: 'from-blue-500 to-cyan-500' },
                  { icon: Sparkles, label: 'Overwhelmed Designers', color: 'from-purple-500 to-pink-500' },
                  { icon: Coffee, label: 'Exhausted Analysts', color: 'from-orange-500 to-yellow-500' },
                  { icon: Lightbulb, label: 'One Simple Idea', color: 'from-green-500 to-emerald-500' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="glass-card rounded-3xl p-6 border border-glass-200 text-center"
                    whileHover={{ y: -8, scale: 1.05 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-semibold">{item.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Impact Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left: Stunning Animation */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="relative w-full h-[500px]">
                {/* Central Hub */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                  animate={{ 
                    rotate: orbitingElements * 0.5,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                    <Rocket className="w-16 h-16 text-white" />
                  </div>
                </motion.div>

                {/* Orbiting Elements */}
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const angle = (orbitingElements + index * 60) * (Math.PI / 180)
                  const radius = 140 + (index % 2) * 40
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius
                  
                  return (
                    <motion.div
                      key={index}
                      className="absolute top-1/2 left-1/2 z-10"
                      style={{
                        transform: `translate(${x - 24}px, ${y - 24}px)`
                      }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-accent/80 to-primary/80 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* Connecting Line */}
                      <svg className="absolute top-6 left-6 pointer-events-none" style={{ width: Math.abs(x), height: Math.abs(y) }}>
                        <line
                          x1="0"
                          y1="0"
                          x2={-x}
                          y2={-y}
                          stroke="url(#gradient)"
                          strokeWidth="1"
                          strokeDasharray="4,4"
                          className="animate-pulse"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
                            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.2)" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )
                })}

                {/* Pulsing Rings */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-96 h-96 border-2 border-primary/30 rounded-full"></div>
                </motion.div>
                
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="w-96 h-96 border border-secondary/20 rounded-full"></div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h2 className="text-6xl font-black text-white mb-8 leading-tight">
                One Idea,{' '}
                <span className="morphing-gradient">
                  Global Impact
                </span>
              </h2>
              
              <p className="text-2xl text-white/80 leading-relaxed mb-12">
                From a simple frustration grew one of the world's fastest-growing Mac optimization companies. 
                Today, our distributed team spans the globe, <strong className="text-white">united by one obsession.</strong>
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-8 mb-12">
                {[
                  { number: '50+', label: 'Global Team', sublabel: 'Across 6 continents' },
                  { number: '14+', label: 'Languages', sublabel: 'We speak your language' },
                  { number: '24/7', label: 'Always On', sublabel: 'Follow the sun support' },
                  { number: '∞', label: 'Ambition', sublabel: 'Limitless optimization' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center lg:text-left"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="text-5xl font-black morphing-gradient mb-2">
                      {stat.number}
                    </div>
                    <div className="text-white font-bold text-lg mb-1">{stat.label}</div>
                    <div className="text-white/60 text-sm">{stat.sublabel}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="glass-card rounded-3xl p-8 border border-glass-200"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-white/90 text-lg leading-relaxed italic">
                  "We don't just build software. We craft experiences that make your Mac feel brand new, 
                  every single day. That's not just our mission—it's our obsession."
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">The Memory Monster Team</div>
                    <div className="text-white/60 text-sm">Distributed Everywhere</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest Insights */}
      <section className="py-20 px-6 bg-glass-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl font-black text-white mb-8 leading-tight">
              Latest <span className="morphing-gradient">Insights</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Discover expert tips, performance deep-dives, and the latest in Mac optimization.
            </p>
          </motion.div>

          {/* Blog Posts Preview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              { 
                title: 'The Complete Mac Optimization Guide for 2025', 
                excerpt: 'Everything you need to know about keeping your Mac running at peak performance.',
                category: 'Guides',
                readTime: '8 min'
              },
              { 
                title: 'Memory Leaks Explained: Why Your Mac Slows Down', 
                excerpt: 'Understanding the hidden culprits that gradually steal your Mac\'s performance.',
                category: 'Technical',
                readTime: '5 min'
              },
              { 
                title: 'Advanced Performance Monitoring Techniques', 
                excerpt: 'Professional tips for monitoring and optimizing your system resources.',
                category: 'Performance',
                readTime: '7 min'
              }
            ].map((post, index) => (
              <motion.article
                key={index}
                className="glass-card rounded-3xl p-8 border border-glass-200"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-primary/20 rounded-full text-sm text-primary font-medium">
                    {post.category}
                  </span>
                  <span className="text-white/60 text-sm">{post.readTime}</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-4 leading-tight">
                  {post.title}
                </h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-primary font-medium">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 glass-card rounded-2xl px-8 py-4 border border-glass-200 text-white font-semibold hover:border-glass-300 transition-all"
            >
              <BookOpen className="w-5 h-5" />
              Explore All Articles
            </Link>
          </motion.div>
        </div>
      </section>

      {/* We're Hiring Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="glass-card rounded-3xl p-12 border border-glass-200 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Rocket className="w-16 h-16 text-white/20 mx-auto mb-8" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Join the <span className="morphing-gradient">Memory Revolution</span>
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
              We're always looking for brilliant minds who share our obsession with performance. 
              Ready to help millions of Mac users unleash their true potential?
            </p>

            {/* Current Openings Preview */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { role: 'Senior iOS Engineer', team: 'Mobile', location: 'Remote' },
                { role: 'UI/UX Designer', team: 'Design', location: 'SF/Remote' },
                { role: 'ML Performance Engineer', team: 'AI/ML', location: 'Remote' }
              ].map((job, index) => (
                <motion.div
                  key={index}
                  className="glass-card rounded-2xl p-6 border border-glass-200 text-left"
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-white font-bold text-lg mb-2">{job.role}</h3>
                  <p className="text-white/70 text-sm mb-1">{job.team} Team</p>
                  <p className="text-white/60 text-sm">{job.location}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              whileHover={{ y: -4 }}
            >
              <Link
                href="/careers"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-4 px-8 rounded-2xl hover:scale-105 transition-transform"
              >
                <Rocket className="w-5 h-5" />
                View All Openings
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
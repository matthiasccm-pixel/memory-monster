'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Navigation, Footer, FloatingElements } from '../lib/components'
import { MapPin, Clock, Users, Coffee, Rocket, Code, Palette, BarChart3, Mail, Heart, Sparkles, Globe, Zap, Briefcase, DollarSign, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface JobListing {
  id: string
  title: string
  slug: string
  department: string
  location: string
  employment_type: string
  experience_level: string
  description: string
  salary_min?: number
  salary_max?: number
  salary_currency: string
  remote_friendly: boolean
  featured: boolean
  tags: string[]
  published_at: string
}

export default function CareersPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs/listings?limit=20&status=active')
      const data = await response.json()
      
      if (data.success) {
        setJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDepartmentIcon = (department: string) => {
    switch (department.toLowerCase()) {
      case 'engineering': return Code
      case 'design': return Palette
      case 'ai/ml': 
      case 'data': return BarChart3
      case 'product': return Rocket
      case 'marketing': return Globe
      default: return Briefcase
    }
  }

  const benefits = [
    {
      icon: MapPin,
      title: 'Remote-First Culture',
      description: 'Work from anywhere with flexible hours'
    },
    {
      icon: Coffee,
      title: '$2,000 Home Office',
      description: 'Latest MacBook Pro and 5K displays'
    },
    {
      icon: Users,
      title: 'Equity for Everyone',
      description: 'Meaningful ownership in our growth'
    },
    {
      icon: Rocket,
      title: 'Learning Budget',
      description: '$3,000 annually for development'
    }
  ]

  return (
    <div ref={containerRef} className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
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
              <span className="text-white/90 font-medium">Join our mission to revolutionize Mac performance</span>
            </motion.div>

            <h1 className="text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tight mb-8">
              Build the Future
              <br />
              <span className="morphing-gradient text-breathe">With the Best</span>
            </h1>
            
            <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto mb-12">
              Join a team of obsessed builders creating tools that make 
              <br />
              <strong className="text-white">millions of Macs faster every single day.</strong>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap justify-center gap-8 text-white/60"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span>14+ Languages</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>50+ Team Members</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>100% Remote</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-sm font-medium">Explore opportunities</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Culture Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Why You'll
              <span className="morphing-gradient block mt-2">Love Working Here</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              We obsess over performance – not just in our product, but in how we work together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="glass-card rounded-3xl p-8 border border-glass-200 hover:border-glass-300 transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl mx-auto mb-6 flex items-center justify-center backdrop-blur-xl border border-white/10">
                  <benefit.icon className="w-7 h-7 text-white/90" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{benefit.title}</h3>
                <p className="text-white/60 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Ship Fast, Ship Smart',
                description: 'Move quickly without compromising quality. Every day counts.',
                icon: <Rocket className="w-8 h-8" />
              },
              {
                title: 'Intelligence First',
                description: 'Build adaptive systems that learn and improve continuously.',
                icon: <Sparkles className="w-8 h-8" />
              },
              {
                title: 'Global Impact',
                description: 'Solutions that work for every Mac user, everywhere.',
                icon: <Globe className="w-8 h-8" />
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="glass-card rounded-3xl p-10 border border-glass-200 hover:border-glass-300 transition-all duration-300 h-full">
                  <div className="text-white/20 mb-6 group-hover:text-white/40 transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-white/60 leading-relaxed text-lg">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-32 px-6 bg-glass-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Open <span className="morphing-gradient">Positions</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Find your perfect role in our mission to make every Mac faster.
            </p>
          </motion.div>

          {/* Job Openings */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-white/70">Loading opportunities...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid gap-6">
              {jobs.map((job, index) => {
                const IconComponent = getDepartmentIcon(job.department)
                
                return (
                  <motion.div
                    key={job.id}
                    className="group glass-card rounded-3xl p-10 border border-glass-200 hover:border-glass-300 transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                          <IconComponent className="w-8 h-8 text-white/90" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="mb-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-3xl font-bold text-white">{job.title}</h3>
                            {job.featured && (
                              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 text-white/60">
                            <span className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {job.employment_type}
                            </span>
                            {job.salary_min && job.salary_max && (
                              <span className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-white/70 text-lg leading-relaxed mb-8">
                          {job.description.split('\n')[0].substring(0, 200)}...
                        </p>
                        
                        <div className="flex flex-wrap gap-3 mb-8">
                          {job.tags.slice(0, 4).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-glass-100 backdrop-blur-md text-white/80 px-4 py-2 rounded-full text-sm border border-glass-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/careers/${job.slug}`}
                          className="inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl text-white font-semibold py-4 px-8 rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 group"
                        >
                          View Details
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-white/20 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">No Open Positions</h3>
              <p className="text-white/60 mb-8">We're not actively hiring right now, but we're always interested in exceptional talent.</p>
              <a 
                href="mailto:careers@memorymonster.co"
                className="inline-flex items-center gap-2 glass-card rounded-2xl px-6 py-3 border border-glass-200 text-white font-semibold hover:border-glass-300 transition-all"
              >
                <Mail className="w-4 h-4" />
                Get in Touch
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="w-16 h-16 text-white/20 mx-auto mb-8" />
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
              Don't See Your Role?
            </h2>
            <p className="text-xl text-white/70 mb-12 leading-relaxed max-w-3xl mx-auto">
              We're always looking for exceptional people who share our obsession with performance.
            </p>
            
            <motion.a
              href="mailto:careers@memorymonster.co?subject=General Interest"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-5 px-10 rounded-2xl text-lg shadow-2xl"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="w-6 h-6" />
              Contact Our Team
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
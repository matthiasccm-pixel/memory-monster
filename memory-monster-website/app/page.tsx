'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  Zap, 
  Users, 
  TrendingUp, 
  Cpu, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Activity,
  Star,
  Play,
  ChevronRight,
  Shield,
  Rocket,
  Heart,
  Brain,
  Globe,
  Clock
} from 'lucide-react'
import { Navigation, Footer, FloatingElements, DownloadButton } from './lib/components'
import { analytics } from './lib/analytics'
import Link from 'next/link'

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    speed: 0,
    memory: 0
  })

  useEffect(() => {
    analytics.trackPageView('/')
    
    // Animate stats
    const targets = { users: 2100000, speed: 85, memory: 847 }
    const duration = 2500
    const steps = 50
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOutProgress = 1 - Math.pow(1 - progress, 3)

      setAnimatedStats({
        users: Math.floor(targets.users * easeOutProgress),
        speed: Math.floor(targets.speed * easeOutProgress),
        memory: Math.floor(targets.memory * easeOutProgress)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedStats(targets)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection stats={animatedStats} heroY={heroY} heroOpacity={heroOpacity} />
      
      {/* Problem Section */}
      <ProblemSection />
      
      {/* Solution Demo */}
      <SolutionDemo />
      
      {/* About Us Section */}
      <AboutUsSection />
      
      {/* Features Grid */}
      <FeaturesGrid />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Final CTA */}
      <FinalCTASection />
      
      <Footer />
    </div>
  )
}

const HeroSection = ({ stats, heroY, heroOpacity }: any) => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative">
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
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-white/90 fill-current" />
              ))}
            </div>
            <span className="text-white/90 font-medium">Trusted by millions of Mac users worldwide</span>
          </motion.div>

          <h1 className="text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tight mb-8">
            Stop Apps From
            <br />
            <span className="morphing-gradient text-breathe">Killing Your Mac</span>
          </h1>
          
          <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto mb-12">
            Chrome, Slack, Adobe, Teams – they're memory thieves.
            <br />
            <strong className="text-white">Memory Monster fights back intelligently.</strong>
          </p>
        </motion.div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-8 mb-12"
        >
          <div className="text-center">
            <div className="text-5xl font-black text-white mb-2">{stats.speed}%</div>
            <div className="text-white/60">Faster Performance</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-white mb-2">{(stats.users / 1000000).toFixed(1)}M+</div>
            <div className="text-white/60">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-white mb-2">{stats.memory}TB</div>
            <div className="text-white/60">Memory Freed</div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <DownloadButton size="lg">
            Download Free
          </DownloadButton>
          
          <motion.button 
            className="group flex items-center gap-3 text-white/80 hover:text-white transition-all duration-300"
            whileHover={{ x: 5 }}
            onClick={() => {
              document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <div className="w-14 h-14 bg-glass-100 backdrop-blur-md rounded-2xl flex items-center justify-center border border-glass-200 group-hover:border-glass-300 transition-all">
              <Play className="w-6 h-6" />
            </div>
            <span className="font-medium text-lg">Watch it work</span>
          </motion.button>
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
          <span className="text-sm font-medium">Discover the problem</span>
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
  )
}

const ProblemSection = () => {
  const problems = [
    {
      app: "Chrome",
      memory: "8.4GB",
      impact: "20 tabs = Mac on fire",
      icon: "🔥"
    },
    {
      app: "Slack",
      memory: "3.2GB",
      impact: "Just for messaging",
      icon: "💬"
    },
    {
      app: "Adobe CC",
      memory: "6.1GB",
      impact: "One document open",
      icon: "🎨"
    },
    {
      app: "VS Code",
      memory: "4.7GB",
      impact: "Coding becomes crawling",
      icon: "💻"
    }
  ]

  return (
    <section className="py-32 px-6 bg-glass-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
            Your Favorite Apps
            <span className="block text-white/40 mt-2">Are Memory Thieves</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Every app fights for memory. None care about each other. 
            Your Mac becomes the victim.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.app}
              className="glass-card rounded-3xl p-8 border border-glass-200 hover:border-glass-300 transition-all duration-300 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="text-5xl mb-6">{problem.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{problem.app}</h3>
              <div className="text-4xl font-black text-white/40 mb-3">{problem.memory}</div>
              <p className="text-white/60">{problem.impact}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="glass-card rounded-3xl p-12 border border-glass-200 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            The Result? Your $3,000 Mac Feels Like a 10-Year-Old PC
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-white/40 text-6xl mb-4">🌡️</div>
              <h4 className="text-white font-bold text-lg mb-2">Overheating</h4>
              <p className="text-white/60">Fan sounds like a jet engine</p>
            </div>
            <div>
              <div className="text-white/40 text-6xl mb-4">🐌</div>
              <h4 className="text-white font-bold text-lg mb-2">Sluggish</h4>
              <p className="text-white/60">Everything takes forever</p>
            </div>
            <div>
              <div className="text-white/40 text-6xl mb-4">🏖️</div>
              <h4 className="text-white font-bold text-lg mb-2">Beach Balls</h4>
              <p className="text-white/60">The spinning wheel of death</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const SolutionDemo = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [memoryFreed, setMemoryFreed] = useState(0)

  const startDemo = () => {
    setIsScanning(true)
    setScanProgress(0)
    setMemoryFreed(0)

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setMemoryFreed(3847)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  return (
    <section id="demo" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Sparkles className="w-16 h-16 text-white/20 mx-auto mb-8" />
          <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
            Watch Memory Monster
            <span className="morphing-gradient block mt-2">In Action</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            One click. Instant results. See how we reclaim your Mac's speed.
          </p>
        </motion.div>

        <motion.div
          className="glass-card rounded-3xl p-12 border border-glass-200 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            {!isScanning && scanProgress === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-3xl font-bold text-white mb-8">
                  Ready to Free Up Memory?
                </h3>
                <motion.button
                  onClick={startDemo}
                  className="bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-6 px-12 rounded-2xl text-xl shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="inline-block w-6 h-6 mr-3" />
                  Start Scan
                </motion.button>
              </motion.div>
            )}

            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-bold text-white">Scanning Memory Usage...</h3>
                
                <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary"
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <div className="text-5xl font-black text-white">{scanProgress}%</div>
                
                <div className="grid grid-cols-3 gap-4 text-white/60">
                  <div className={scanProgress > 30 ? 'text-white' : ''}>
                    <Activity className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm">Analyzing Processes</span>
                  </div>
                  <div className={scanProgress > 60 ? 'text-white' : ''}>
                    <Brain className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm">AI Optimization</span>
                  </div>
                  <div className={scanProgress > 90 ? 'text-white' : ''}>
                    <Shield className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm">Safe Cleanup</span>
                  </div>
                </div>
              </motion.div>
            )}

            {!isScanning && scanProgress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <CheckCircle className="w-20 h-20 text-primary mx-auto" />
                <h3 className="text-3xl font-bold text-white">Optimization Complete!</h3>
                <div className="text-6xl font-black morphing-gradient">{memoryFreed} MB</div>
                <p className="text-xl text-white/70">Memory Successfully Freed</p>
                
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-glass-200">
                  <div>
                    <div className="text-2xl font-bold text-white">85%</div>
                    <div className="text-white/60">Speed Boost</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-white/60">Apps Optimized</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-white/60">Files Affected</div>
                  </div>
                </div>

                <motion.button
                  onClick={() => {
                    setScanProgress(0)
                    setMemoryFreed(0)
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Run Again →
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const AboutUsSection = () => {
  return (
    <section className="py-32 px-6 bg-glass-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Heart className="w-16 h-16 text-white/20 mx-auto mb-8" />
          <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
            Built From
            <span className="morphing-gradient block mt-2">Frustration</span>
          </h2>
          <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            We were coders, designers, and analysts watching our expensive Macs 
            slow to a crawl. We said enough is enough.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="glass-card rounded-3xl p-8 border border-glass-200">
              <h3 className="text-2xl font-bold text-white mb-4">The Simple Idea</h3>
              <p className="text-white/70 leading-relaxed">
                What if there was a tool that actually understood how apps steal memory 
                and could fight back intelligently? Not just another cleaner, but a 
                real-time guardian for your Mac.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 border border-glass-200">
              <h3 className="text-2xl font-bold text-white mb-4">The Journey</h3>
              <p className="text-white/70 leading-relaxed">
                From a simple script to an AI-powered system trained on billions of 
                optimization patterns. Today, Memory Monster is the most intelligent 
                Mac optimization tool ever created.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-card rounded-3xl p-12 border border-glass-200 text-center">
              <div className="space-y-8">
                <div>
                  <div className="text-5xl font-black text-white mb-2">50+</div>
                  <div className="text-white/60">Team Members</div>
                </div>
                <div>
                  <div className="text-5xl font-black text-white mb-2">14+</div>
                  <div className="text-white/60">Languages Spoken</div>
                </div>
                <div>
                  <div className="text-5xl font-black text-white mb-2">4</div>
                  <div className="text-white/60">Time Zones</div>
                </div>
                <div>
                  <div className="text-5xl font-black morphing-gradient mb-2">1</div>
                  <div className="text-white/60">Mission: Make Every Mac Faster</div>
                </div>
              </div>
            </div>

            {/* Floating connection dots */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-white/20 rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            href="/mission"
            className="inline-flex items-center gap-3 text-white/80 hover:text-white font-medium text-lg group"
          >
            Read our full story
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

const FeaturesGrid = () => {
  const features = [
    {
      icon: Zap,
      title: 'One-Click Fix',
      description: 'Instant optimization with zero technical knowledge required'
    },
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Learns from 1B+ scans to optimize intelligently'
    },
    {
      icon: Shield,
      title: '100% Safe',
      description: 'Never touches your files or system settings'
    },
    {
      icon: Clock,
      title: 'Real-Time Protection',
      description: 'Prevents memory leaks before they slow you down'
    },
    {
      icon: Globe,
      title: 'Works Everywhere',
      description: 'Optimized for every macOS version from Big Sur to Sonoma'
    },
    {
      icon: Users,
      title: 'Trusted by Millions',
      description: '2.1M+ users across 147 countries'
    }
  ]

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
            Features That
            <span className="morphing-gradient block mt-2">Actually Matter</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card rounded-3xl p-10 border border-glass-200 hover:border-glass-300 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl mb-6 flex items-center justify-center backdrop-blur-xl border border-white/10">
                <feature.icon className="w-7 h-7 text-white/90" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            href="/features"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl text-white font-semibold py-4 px-8 rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300"
          >
            Explore all features
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Memory Monster turned my sluggish MacBook Pro into a speed demon. It's like getting a brand new computer.",
      author: "Sarah Martinez",
      role: "Senior Designer at Airbnb",
      rating: 5
    },
    {
      quote: "Finally, I can run Excel models without crashes. This tool paid for itself on day one.",
      author: "David Chen",
      role: "Financial Analyst at Goldman Sachs",
      rating: 5
    },
    {
      quote: "As a developer, I need every bit of performance. Memory Monster gives me back hours every week.",
      author: "Alex Kumar",
      role: "Software Engineer at Google",
      rating: 5
    }
  ]

  return (
    <section className="py-32 px-6 bg-glass-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
            Loved by
            <span className="morphing-gradient block mt-2">Professionals</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="glass-card rounded-3xl p-8 border border-glass-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-white/90 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-white/80 text-lg leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>
              
              <div>
                <div className="text-white font-semibold">{testimonial.author}</div>
                <div className="text-white/60 text-sm">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FinalCTASection = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
            Ready to Unleash
            <span className="morphing-gradient block mt-2">Your Mac's Speed?</span>
          </h2>
          <p className="text-xl text-white/70 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join millions who've already discovered what their Mac can really do. 
            Download Memory Monster free and feel the difference instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <DownloadButton size="lg">
              Download Free Now
            </DownloadButton>
            
            <motion.a
              href="/pricing"
              className="text-white/80 hover:text-white font-medium text-lg group flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              Or see Pro features
              <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>

          <div className="flex justify-center items-center gap-8 text-white/60 text-sm mt-12">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-white/40" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-white/40" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-white/40" />
              <span>Works instantly</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Removed old component definitions that are no longer used
// app/features/page.tsx (COMPREHENSIVE REWRITE)

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  Zap, 
  Brain, 
  Shield, 
  Activity,
  Cpu,
  Eye,
  RefreshCw,
  BarChart3,
  Users,
  Star,
  Quote,
  CheckCircle,
  Sparkles,
  Target,
  Gauge,
  Lock,
  Heart,
  Download,
  ArrowRight,
  FileSpreadsheet,
  Code,
  Palette,
  Gamepad2,
  Video,
  Chrome,
  Slack,
  Monitor,
  ChevronRight
} from 'lucide-react'
import { Navigation, Footer, FloatingElements, DownloadButton } from '../lib/components'
import { analytics } from '../lib/analytics'

export default function FeaturesPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    analytics.trackPageView('/features')
  }, [])

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
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-white/90 font-medium">4.8/5 from 2.1M+ users worldwide</span>
            </motion.div>

            <h1 className="text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tight mb-8">
              Your Apps Are
              <br />
              <span className="morphing-gradient text-breathe">Memory Bullies</span>
            </h1>
            
            <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto mb-12">
              Chrome steals 8GB. Slack hoards 3GB. Adobe grabs 6GB. 
              <br />
              <strong className="text-white">Memory Monster puts them in their place.</strong>
            </p>
          </motion.div>

          {/* App Memory Bullies Visualization */}
          <motion.div 
            className="relative mx-auto max-w-4xl mb-12"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <MemoryBulliesVisualization />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <DownloadButton size="lg">Stop the Memory Bullies</DownloadButton>
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
            <span className="text-sm font-medium">Discover how it works</span>
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

      {/* The Problem Section */}
      <AppMemoryProblemSection />

      {/* How Memory Monster Works */}
      <HowItWorksSection />

      {/* Persona-Based Use Cases */}
      <PersonaShowcaseSection />

      {/* Core Features Deep Dive */}
      <CoreFeaturesSection />

      {/* AI Intelligence Section */}
      <AIIntelligenceSection />

      {/* OS Version Support Section */}
      <OSVersionSupportSection />

      {/* Social Proof & Results */}
      <ResultsSection />

      {/* Final CTA */}
      <FinalCTASection />

      <Footer />
    </div>
  )
}

const MemoryBulliesVisualization = () => {
  const [activeApp, setActiveApp] = useState(0)
  
  const memoryBullies = [
    { name: 'Chrome', memory: '8.4GB', icon: Chrome, color: 'from-red-500 to-orange-500' },
    { name: 'Slack', memory: '3.2GB', icon: Slack, color: 'from-purple-500 to-pink-500' },
    { name: 'Adobe CC', memory: '6.1GB', icon: Monitor, color: 'from-blue-500 to-cyan-500' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveApp((prev) => (prev + 1) % memoryBullies.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-64">
      <div className="grid grid-cols-3 gap-8 h-full items-end">
        {memoryBullies.map((app, index) => {
          const IconComponent = app.icon
          const isActive = index === activeApp
          
          return (
            <motion.div
              key={app.name}
              className="relative"
              animate={{
                scale: isActive ? 1.1 : 1,
                y: isActive ? -20 : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <div className={`w-full bg-gradient-to-t ${app.color} rounded-t-2xl flex flex-col items-center justify-end p-6 shadow-2xl`}
                   style={{ height: `${120 + index * 30}px` }}>
                <IconComponent className="w-12 h-12 text-white mb-3" />
                <div className="text-white font-bold text-lg">{app.name}</div>
                <div className="text-white/90 text-2xl font-black">{app.memory}</div>
              </div>
              
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold"
                >
                  Memory Hog!
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-glass-200 rounded-b-2xl border-t-4 border-red-400">
        <div className="text-center text-white/60 text-sm mt-1">Your Mac's Available Memory</div>
      </div>
    </div>
  )
}

const AppMemoryProblemSection = () => {
  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Why Your Mac Feels Like a 
            <span className="text-red-400"> Tired Old Computer</span>
          </h2>
          <p className="text-white/70 text-xl max-w-3xl mx-auto">
            Your apps are greedy. They grab memory and never give it back. 
            The more you use your Mac, the slower it gets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card rounded-3xl p-8 border border-glass-200">
              <h3 className="text-white font-bold text-2xl mb-6">The Memory Leak Reality</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Chrome with 20 tabs</span>
                  <span className="text-red-400 font-bold">8.4GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Slack running all day</span>
                  <span className="text-red-400 font-bold">3.2GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Photoshop with large files</span>
                  <span className="text-red-400 font-bold">6.1GB</span>
                </div>
                <div className="border-t border-glass-200 pt-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-white font-semibold">Total Memory Wasted</span>
                    <span className="text-red-400 font-black text-2xl">17.7GB</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-bold text-3xl">Sound Familiar?</h3>
            <div className="space-y-4">
              {[
                "Your MacBook fan sounds like a jet engine",
                "Apps take forever to switch between",
                "Beach ball of death appears constantly",
                "Everything feels sluggish after a few hours",
                "Simple tasks become frustratingly slow"
              ].map((symptom, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start gap-3 text-white/80"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span className="text-lg">{symptom}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-6 bg-glass-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            How Memory Monster Fights Back
          </h2>
          <p className="text-white/70 text-xl max-w-3xl mx-auto">
            Think of Memory Monster as your Mac's personal trainer. 
            It whips your apps into shape and keeps them there.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Scan & Identify",
              description: "Memory Monster analyzes which apps are hogging memory and identifies wasteful processes that are slowing you down.",
              icon: <Eye className="w-8 h-8 text-white" />,
              color: "from-blue-400 to-cyan-500"
            },
            {
              step: "02", 
              title: "Smart Cleanup",
              description: "Using AI trained on 1B+ scans, it safely frees up memory without breaking your apps or losing your work.",
              icon: <Brain className="w-8 h-8 text-white" />,
              color: "from-purple-400 to-pink-500"
            },
            {
              step: "03",
              title: "Keep Watch",
              description: "Continuous monitoring prevents memory leaks from building up again, keeping your Mac running like new.",
              icon: <Shield className="w-8 h-8 text-white" />,
              color: "from-green-400 to-emerald-500"
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="glass-card rounded-3xl p-8 border border-glass-200 text-center h-full">
                <div className="text-primary-light text-6xl font-black mb-4 opacity-20">
                  {step.step}
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl`}>
                  {step.icon}
                </div>
                <h3 className="text-white font-bold text-xl mb-4">{step.title}</h3>
                <p className="text-white/70 leading-relaxed">{step.description}</p>
              </div>
              
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-white/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const PersonaShowcaseSection = () => {
  const personas = [
    {
      title: "Business Analysts",
      subtitle: "Excel + PowerPoint Power Users",
      icon: <FileSpreadsheet className="w-8 h-8 text-white" />,
      color: "from-green-400 to-emerald-500",
      problem: "Excel models crash, PowerPoint freezes during client presentations",
      solution: "Handle massive datasets and complex presentations without crashes",
      memory: "14.7GB",
      href: "/for-analysts"
    },
    {
      title: "Designers",
      subtitle: "Creative Suite Warriors", 
      icon: <Palette className="w-8 h-8 text-white" />,
      color: "from-pink-400 to-purple-500",
      problem: "Photoshop + Figma + browser tabs = creative workflow nightmare",
      solution: "Keep your creative flow uninterrupted with layer-safe optimization",
      memory: "8.2GB",
      href: "/for-designers"
    },
    {
      title: "Developers",
      subtitle: "Code Environment Optimizers",
      icon: <Code className="w-8 h-8 text-white" />,
      color: "from-blue-400 to-cyan-500", 
      problem: "VS Code + Docker + 50 browser tabs = build time disasters",
      solution: "Keep IDEs responsive and builds fast with smart process management",
      memory: "12.4GB",
      href: "/for-developers"
    },
    {
      title: "Gamers",
      subtitle: "FPS Performance Seekers",
      icon: <Gamepad2 className="w-8 h-8 text-white" />,
      color: "from-red-400 to-orange-500",
      problem: "Background apps steal frames during competitive gaming",
      solution: "Gaming mode prioritizes performance for smooth 120fps gameplay",
      memory: "16.3GB", 
      href: "/for-gamers"
    },
    {
      title: "Content Creators",
      subtitle: "Stream & Podcast Pros",
      icon: <Video className="w-8 h-8 text-white" />,
      color: "from-purple-400 to-red-500",
      problem: "OBS + browser sources + social media = dropped frames",
      solution: "Stream without stress with zero dropped frames guarantee",
      memory: "18.6GB",
      href: "/for-streamers"
    }
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            Built for How You Actually Work
          </h2>
          <p className="text-white/70 text-xl max-w-3xl mx-auto">
            Memory Monster understands different workflows. Whether you're crunching numbers, 
            creating art, or streaming live, we've got your back.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona, index) => (
            <motion.a
              key={index}
              href={persona.href}
              className="group relative block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="glass-card rounded-3xl p-8 border border-glass-200 hover:border-glass-300 transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${persona.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    {persona.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{persona.memory}</div>
                    <div className="text-white/60 text-sm">Freed</div>
                  </div>
                </div>
                
                <h3 className="text-white font-bold text-xl mb-2">{persona.title}</h3>
                <p className="text-primary-light text-sm font-medium mb-4">{persona.subtitle}</p>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <div className="text-white/60 text-xs uppercase tracking-wide mb-1">Problem</div>
                    <p className="text-white/80 text-sm">{persona.problem}</p>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs uppercase tracking-wide mb-1">Solution</div>
                    <p className="text-white text-sm font-medium">{persona.solution}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-primary group-hover:text-primary-light transition-colors">
                  <span className="text-sm font-medium">Learn More</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

const CoreFeaturesSection = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: 'One-Click Optimization',
      description: 'Clean up memory hogs instantly. No technical knowledge required.',
      benefit: 'Get back to work in seconds, not minutes',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: 'AI-Powered Intelligence',
      description: 'Machine learning trained on 1B+ scans knows exactly what to clean.',
      benefit: 'Smarter than manual cleanup, safer than force-quit',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: <Eye className="w-8 h-8 text-white" />,
      title: 'Real-Time Monitoring',
      description: 'Watches your system 24/7 and prevents problems before they start.',
      benefit: 'No more surprise slowdowns during important work',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: '100% Safe Operation',
      description: 'Never touches your files or system settings. Everything is reversible.',
      benefit: 'All the speed gains, zero risk to your data',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <Target className="w-8 h-8 text-white" />,
      title: 'Smart App Recognition',
      description: 'Knows the difference between important work and memory waste.',
      benefit: 'Keeps your workflow intact while boosting performance',
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: <Gauge className="w-8 h-8 text-white" />,
      title: 'Performance Analytics',
      description: 'See exactly how much faster your Mac becomes over time.',
      benefit: 'Track your productivity gains with real data',
      color: 'from-indigo-400 to-purple-500'
    }
  ]

  return (
    <section className="py-20 px-6 bg-glass-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            Features That Actually Matter
          </h2>
          <p className="text-white/70 text-xl max-w-3xl mx-auto">
            No fluff, no confusing technical jargon. Just tools that make your Mac 
            feel new again, every single day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card rounded-3xl p-8 border border-glass-200 hover:border-glass-300 transition-all duration-300 text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-white font-bold text-xl mb-4">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed mb-4">{feature.description}</p>
              <div className="bg-glass-100 rounded-xl p-3 border border-glass-200">
                <p className="text-primary text-sm font-medium">{feature.benefit}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const AIIntelligenceSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                Learns From
                <br />
                <span className="morphing-gradient">1 Billion+ Scans</span>
              </h2>
              
              <p className="text-xl text-white/80 leading-relaxed">
                Memory Monster's AI doesn't guess - it knows. Our machine learning engine 
                has analyzed over 1 billion Mac optimization sessions to understand exactly 
                which memory cleanups are safe and which ones boost performance the most.
              </p>
            </div>

            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6 border border-glass-200">
                <h3 className="text-white font-bold text-lg mb-3">Smart Pattern Recognition</h3>
                <p className="text-white/70">
                  Recognizes when Chrome is genuinely working vs. when it's just hoarding memory 
                  from tabs you forgot about 3 hours ago.
                </p>
              </div>
              
              <div className="glass-card rounded-2xl p-6 border border-glass-200">
                <h3 className="text-white font-bold text-lg mb-3">Predictive Prevention</h3>
                <p className="text-white/70">
                  Spots memory leaks before they slow you down. Like having a performance 
                  expert watching over your shoulder 24/7.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99.7%</div>
                <div className="text-white/60">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">2.1M+</div>
                <div className="text-white/60">Daily Users</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="relative h-96"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <AIVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const AIVisualization = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central Brain */}
      <motion.div 
        className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Brain className="w-12 h-12 text-white" />
      </motion.div>

      {/* Data Points */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${80 + (i * 3.5)}px)`
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}

      {/* Floating Stats */}
      <motion.div
        className="absolute top-1/4 left-1/4 glass-card rounded-lg px-3 py-2 border border-purple-400/30 bg-purple-400/10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-purple-300 text-sm font-medium">1B+ Scans</span>
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4 glass-card rounded-lg px-3 py-2 border border-pink-400/30 bg-pink-400/10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-pink-300 text-sm font-medium">AI Learning</span>
      </motion.div>
    </div>
  )
}

const OSVersionSupportSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-black text-white mb-6 leading-tight">
            Built for Every Mac, 
            <span className="morphing-gradient block mt-2">Every macOS Version</span>
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            From cutting-edge <strong>Sonoma</strong> to battle-tested <strong>Big Sur</strong>, Memory Monster's 
            AI adapts instantly to your exact macOS version. Zero configuration required.
          </p>
        </motion.div>

        {/* macOS Version Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { 
              name: 'Sonoma', 
              version: '14.x', 
              savings: '1.8GB', 
              emoji: '🚀', 
              speed: 'Blazing',
              features: ['Neural Engine Optimization', 'Stage Manager Integration', 'Enhanced Safari Cleanup'],
              color: 'from-blue-400 to-purple-500'
            },
            { 
              name: 'Ventura', 
              version: '13.x', 
              savings: '1.2GB', 
              emoji: '⚡', 
              speed: 'Lightning',
              features: ['Continuity Camera Support', 'Mail App Enhancement', 'Focus Mode Optimization'],
              color: 'from-purple-400 to-pink-500'
            },
            { 
              name: 'Monterey', 
              version: '12.x', 
              savings: '1.0GB', 
              emoji: '💨', 
              speed: 'Instant',
              features: ['AirPlay to Mac Cleanup', 'Universal Control Ready', 'Shortcuts Integration'],
              color: 'from-green-400 to-cyan-500'
            },
            { 
              name: 'Big Sur', 
              version: '11.x', 
              savings: '800MB', 
              emoji: '🔥', 
              speed: 'Turbo',
              features: ['M1 Silicon Optimized', 'Control Center Cleanup', 'Safari 14+ Support'],
              color: 'from-red-400 to-orange-500'
            }
          ].map((os, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden glass-card rounded-3xl p-8 border border-glass-200 hover:border-accent/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              {/* Decorative gradient */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${os.color} opacity-20 rounded-full -mr-10 -mt-10`}></div>
              
              <div className="text-4xl mb-4">{os.emoji}</div>
              <h3 className="text-white font-bold text-2xl mb-2">macOS {os.name}</h3>
              <div className="text-white/60 text-sm mb-6">Version {os.version}</div>
              
              {/* Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Avg Memory Freed:</span>
                  <span className="text-accent font-bold text-lg">{os.savings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Speed Boost:</span>
                  <span className="text-white font-semibold">{os.speed}</span>
                </div>
              </div>
              
              {/* OS-Specific Features */}
              <div className="space-y-2">
                <h4 className="text-white/90 text-sm font-semibold mb-3">Optimized For:</h4>
                {os.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-white/70 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Adaptive Intelligence Features */}
        <motion.div
          className="glass-card rounded-3xl p-12 border border-glass-200 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-8">Intelligent Adaptation That Just Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-bold text-lg mb-3">Auto-Detection</h4>
              <p className="text-white/70 text-center">
                Instantly identifies your macOS version and architecture to apply the perfect optimization strategy
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-bold text-lg mb-3">Version-Specific AI</h4>
              <p className="text-white/70 text-center">
                Machine learning models trained specifically for each macOS version's unique memory patterns
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-bold text-lg mb-3">Future-Proof Updates</h4>
              <p className="text-white/70 text-center">
                Automatic updates ensure compatibility with new macOS releases the day they launch
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const ResultsSection = () => {
  return (
    <section className="py-20 px-6 bg-glass-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            Real Results from Real Users
          </h2>
        </motion.div>

        {/* Big Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {[
            { number: '85%', label: 'Average Speed Boost', subtext: 'After first scan' },
            { number: '847TB', label: 'Memory Freed', subtext: 'This month alone' },
            { number: '2.1M+', label: 'Happy Users', subtext: 'Across 150+ countries' },
            { number: '4.8★', label: 'App Store Rating', subtext: 'From 50K+ reviews' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black text-white mb-2">{stat.number}</div>
              <div className="text-white/80 font-semibold mb-1">{stat.label}</div>
              <div className="text-white/60 text-sm">{stat.subtext}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            {
              quote: "Memory Monster turned my sluggish MacBook Pro into a speed demon. It's like getting a brand new computer for free.",
              author: "Sarah Martinez",
              role: "Senior Designer",
              company: "Airbnb"
            },
            {
              quote: "I can finally run Excel with massive datasets without crashes. This tool paid for itself in saved time on day one.",
              author: "David Chen", 
              role: "Financial Analyst",
              company: "Goldman Sachs"
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="glass-card rounded-3xl p-8 border border-glass-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-white text-xl leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{testimonial.author.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">{testimonial.author}</div>
                  <div className="text-white/60">{testimonial.role}</div>
                  <div className="text-white/40 text-sm">{testimonial.company}</div>
                </div>
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
          <h2 className="text-6xl lg:text-7xl font-black text-white leading-tight mb-8">
            Ready to Feel the
            <br />
            <span className="morphing-gradient">Speed Difference?</span>
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed mb-12 max-w-3xl mx-auto">
            Join 2.1M+ users who've already discovered what their Mac can really do. 
            Download Memory Monster free and experience the transformation in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <DownloadButton size="lg">Download Free Now</DownloadButton>
            
            <motion.a
              href="/pricing"
              className="flex items-center gap-3 text-white/80 hover:text-white transition-all duration-300 group"
              whileHover={{ x: 5 }}
            >
              <span className="font-medium text-lg">Or go Pro instantly</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.a>
          </div>

          <div className="flex justify-center items-center gap-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>100% Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Works immediately</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Completely safe</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
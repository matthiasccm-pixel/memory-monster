'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Navigation, Footer, FloatingElements, DownloadButton } from '../lib/components'
import { Shield, Zap, TrendingUp, Users, Database, Brain, Target, Download, Rocket, Heart, Sparkles, Globe, Activity, CheckCircle } from 'lucide-react'

export default function MissionPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [animatedStats, setAnimatedStats] = useState({
    scans: 0,
    users: 0,
    memoryFreed: 0,
    apps: 0
  })

  useEffect(() => {
    const targets = {
      scans: 2847651234,
      users: 8456321,
      memoryFreed: 847392,
      apps: 2847
    }

    const duration = 3000
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOutProgress = 1 - Math.pow(1 - progress, 3)

      setAnimatedStats({
        scans: Math.floor(targets.scans * easeOutProgress),
        users: Math.floor(targets.users * easeOutProgress),
        memoryFreed: Math.floor(targets.memoryFreed * easeOutProgress),
        apps: Math.floor(targets.apps * easeOutProgress)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedStats(targets)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toLocaleString()
  }

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
              <Heart className="w-5 h-5 text-white/90" />
              <span className="text-white/90 font-medium">Our mission to make every Mac faster</span>
            </motion.div>

            <h1 className="text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tight mb-8">
              Your Mac's
              <br />
              <span className="morphing-gradient text-breathe">First Line of Defense</span>
            </h1>
            
            <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto mb-12">
              Every app fights for memory. None care about each other.
              <br />
              <strong className="text-white">We're here to restore order.</strong>
            </p>
          </motion.div>

          {/* Live Stats Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {[
              { value: formatNumber(animatedStats.users), label: "Macs Protected" },
              { value: `${formatNumber(animatedStats.memoryFreed)}TB`, label: "Memory Freed" },
              { value: formatNumber(animatedStats.scans), label: "Optimizations" },
              { value: formatNumber(animatedStats.apps), label: "Apps Mastered" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
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
            <span className="text-sm font-medium">Learn our story</span>
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

      {/* The Problem - Reimagined */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              The Apps You Love
              <span className="block text-white/40 mt-2">Are Memory Thieves</span>
            </h2>
            <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
              Chrome, Slack, Adobe, Teams - brilliant apps that don't play nice together.
              Before you know it, your $3,000 Mac feels like a 10-year-old PC.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                {[
                  { user: "Designer", issue: "12-second Figma switches", impact: "3 hours lost daily" },
                  { user: "Developer", issue: "VS Code freezes mid-debug", impact: "Broken flow states" },
                  { user: "Analyst", issue: "Excel crashes on large files", impact: "6-hour models gone" }
                ].map((story, index) => (
                  <motion.div
                    key={index}
                    className="glass-card rounded-2xl p-6 border border-glass-200"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="text-white font-bold text-lg mb-2">{story.user}</div>
                    <div className="text-white/80 mb-1">{story.issue}</div>
                    <div className="text-white/40 text-sm">{story.impact}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative h-96"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <MemoryVisualization />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-32 px-6 bg-glass-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              We Said
              <span className="morphing-gradient block mt-2">Enough</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Your Mac deserves intelligent defense that learns and adapts.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Real-Time Defense',
                description: 'Catch memory thieves before they slow you down',
                stat: '85% faster'
              },
              {
                icon: Brain,
                title: 'Continuous Learning',
                description: 'Gets smarter with every app update and new tool',
                stat: '1B+ data points'
              },
              {
                icon: Target,
                title: 'Personal Intelligence',
                description: 'Learns YOUR workflow and optimizes for YOU',
                stat: '99.7% accuracy'
              }
            ].map((solution, index) => (
              <motion.div
                key={index}
                className="glass-card rounded-3xl p-10 border border-glass-200 hover:border-glass-300 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl mb-6 flex items-center justify-center backdrop-blur-xl border border-white/10">
                  <solution.icon className="w-7 h-7 text-white/90" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{solution.title}</h3>
                <p className="text-white/60 leading-relaxed mb-6">{solution.description}</p>
                <div className="text-primary font-bold text-lg">{solution.stat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence Engine */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-16 h-16 text-white/20 mx-auto mb-8" />
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              The Intelligence
              <span className="morphing-gradient block mt-2">That Powers Everything</span>
            </h2>
            <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
              Every scan teaches us. Every optimization improves our AI. 
              This is how we build the most intelligent Mac tool ever created.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {[
              {
                number: formatNumber(animatedStats.scans),
                label: 'Total Scans',
                sublabel: 'Learning from each one',
                icon: Database
              },
              {
                number: formatNumber(animatedStats.users),
                label: 'Mac Users',
                sublabel: 'Across 147 countries',
                icon: Users
              },
              {
                number: `${formatNumber(animatedStats.memoryFreed)}TB`,
                label: 'Memory Freed',
                sublabel: 'And counting',
                icon: TrendingUp
              },
              {
                number: formatNumber(animatedStats.apps),
                label: 'Apps Mastered',
                sublabel: 'More weekly',
                icon: Zap
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="w-8 h-8 text-white/20 mx-auto mb-4" />
                <div className="text-4xl font-black text-white mb-2">{stat.number}</div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
                <div className="text-white/40 text-sm">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>

          {/* Personal Learning */}
          <motion.div
            className="glass-card rounded-3xl p-16 border border-glass-200 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Brain className="w-20 h-20 text-white/20 mx-auto mb-8" />
            <h3 className="text-4xl font-bold text-white mb-8">
              We Learn <span className="morphing-gradient">You</span>
            </h3>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-12">
              Morning coder? We optimize for your 9 AM flow state. 
              Evening designer? We prep for creative sprints. 
              Weekend analyst? Your models never crash.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                'Morning Patterns',
                'Creative Workflows',  
                'Peak Performance',
                'Behavioral Learning'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-glass-100 backdrop-blur-md rounded-2xl px-6 py-4 border border-glass-200"
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-white/80 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Ready to Join
              <span className="morphing-gradient block mt-2">The Revolution?</span>
            </h2>
            <p className="text-xl text-white/70 mb-12 leading-relaxed max-w-3xl mx-auto">
              Stop letting memory thieves steal your productivity. 
              Take back control of your Mac.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <DownloadButton size="lg">
                <Download className="w-6 h-6" />
                Download Memory Monster
              </DownloadButton>
              
              <motion.a
                href="/features"
                className="text-white/80 hover:text-white font-medium text-lg group flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                Learn more about features
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>

            <div className="flex justify-center items-center gap-8 text-white/60 text-sm mt-12">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white/40" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white/40" />
                <span>Works instantly</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white/40" />
                <span>100% safe</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

const MemoryVisualization = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Memory Bars */}
      <div className="space-y-4 w-full px-8">
        {[
          { app: 'Chrome', usage: 85, color: 'from-white/60 to-white/30' },
          { app: 'Slack', usage: 65, color: 'from-white/50 to-white/25' },
          { app: 'Adobe', usage: 78, color: 'from-white/55 to-white/28' },
          { app: 'VS Code', usage: 45, color: 'from-white/45 to-white/22' }
        ].map((item, index) => (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between text-white/60 text-sm mb-2">
              <span>{item.app}</span>
              <span>{item.usage}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                initial={{ width: 0 }}
                whileInView={{ width: `${item.usage}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating memory indicators */}
      {[...Array(6)].map((_, i) => {
        // Use deterministic positioning to avoid hydration mismatch
        const positions = [
          { top: 25, left: 15 },
          { top: 45, left: 75 },
          { top: 65, left: 20 },
          { top: 35, left: 85 },
          { top: 75, left: 45 },
          { top: 55, left: 65 }
        ];
        const durations = [3.2, 4.3, 3.7, 4.8, 3.5, 4.1];
        
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              top: `${positions[i].top}%`,
              left: `${positions[i].left}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: durations[i],
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        );
      })}
    </div>
  )
}
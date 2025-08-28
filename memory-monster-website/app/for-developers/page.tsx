// app/for-developers/page.tsx

'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Code, 
  Terminal, 
  Database,
  Cpu,
  Zap,
  TrendingUp,
  CheckCircle
} from 'lucide-react'
import { Navigation, Footer, FloatingElements, HeroSection, FeatureCard, DownloadButton } from '../lib/components'
import { analytics } from '../lib/analytics'

export default function ForDevelopersPage() {
  useEffect(() => {
    analytics.trackPageView('/for-developers')
  }, [])

  const devStats = [
    { value: '12.4GB', label: 'Memory Saved' },
    { value: '200K+', label: 'Developers' },
    { value: '60%', label: 'Faster Builds' }
  ]

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      <HeroSection
        title="Stop VS Code From Killing Your Builds"
        subtitle="Trusted by 200K+ developers worldwide"
        description="VS Code + Docker + 50 Chrome tabs = productivity nightmare. Memory Monster reclaims 12GB+ so your builds fly and terminal stays responsive."
        stats={devStats}
        visual={<DevVisualization />}
      />

      <ProblemSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />

      <Footer />
    </div>
  )
}

const DevVisualization = () => {
  return (
    <div className="relative w-80 h-80">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <motion.div 
        className="relative w-full h-full glass-card rounded-full border border-glass-200 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-center">
          <motion.div 
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💻
          </motion.div>
          <div className="text-white font-bold text-xl">Dev Environment</div>
          <div className="text-primary-light text-sm">Optimized</div>
        </div>

        {/* Floating Dev Tools */}
        {[
          { icon: '⚡', angle: 0 },
          { icon: '🐳', angle: 90 },
          { icon: '🔧', angle: 180 },
          { icon: '📱', angle: 270 }
        ].map((tool, index) => (
          <motion.div
            key={index}
            className="absolute w-12 h-12 glass-card rounded-full flex items-center justify-center text-xl"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${tool.angle}deg) translateY(-120px)`
            }}
            animate={{ 
              rotate: [tool.angle, tool.angle + 360] 
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {tool.icon}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

const ProblemSection = () => {
  const devProblems = [
    { 
      app: 'VS Code', 
      memory: '4.8GB', 
      issue: 'Extensions and language servers devour RAM',
      icon: '💻'
    },
    { 
      app: 'Docker', 
      memory: '6.2GB', 
      issue: 'Containers pile up and never release memory',
      icon: '🐳'
    },
    { 
      app: 'Chrome Tabs', 
      memory: '8.4GB', 
      issue: 'Documentation tabs multiply endlessly',
      icon: '🌐'
    },
    { 
      app: 'Node.js', 
      memory: '3.1GB', 
      issue: 'Memory leaks in development builds',
      icon: '⚡'
    }
  ]

  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            Your Dev Tools Are <span className="text-red-400">Memory Killers</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Every developer knows this pain. Your environment eats RAM faster than you can code.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {devProblems.map((problem, index) => (
            <motion.div
              key={problem.app}
              className="glass-card rounded-2xl p-6 border border-glass-200 hover:border-red-400/30 transition-all duration-300 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="text-4xl mb-4">{problem.icon}</div>
              <h3 className="text-white font-semibold mb-2">{problem.app}</h3>
              <div className="text-2xl font-bold text-red-400 mb-2">{problem.memory}</div>
              <p className="text-white/60 text-sm">{problem.issue}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="glass-card rounded-2xl p-8 border border-glass-200 inline-block">
            <p className="text-white text-lg">
              Total dev environment usage: <span className="text-red-400 font-bold text-2xl">22.5GB</span>
              <br />
              <span className="text-white/60 text-sm">No wonder your MacBook fans sound like jet engines</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const FeaturesSection = () => {
  const features = [
    {
      icon: <Code className="w-8 h-8 text-white" />,
      title: 'IDE Optimization',
      description: 'Tame VS Code, IntelliJ, and Xcode memory usage without losing functionality',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: <Database className="w-8 h-8 text-white" />,
      title: 'Container Intelligence',
      description: 'Smart Docker optimization that knows which containers you actually need',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: <Terminal className="w-8 h-8 text-white" />,
      title: 'Build Acceleration',
      description: 'Free up memory for faster compilation and responsive development',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <Cpu className="w-8 h-8 text-white" />,
      title: 'Process Monitoring',
      description: 'Real-time detection of runaway processes and memory leaks',
      color: 'from-yellow-400 to-orange-500'
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
            Built for Developer Workflows
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const TestimonialsSection = () => {
  const testimonials = [
    {
      text: "Chrome was using 12GB for docs. Now it's 2GB. My builds are 60% faster! 🚀",
      author: "Jake Rodriguez",
      role: "Senior Full-Stack Developer",
      company: "Stripe",
      avatar: "JR"
    },
    {
      text: "Finally! My M2 MacBook feels faster than my old Intel workstation.",
      author: "David Park",
      role: "Senior Engineer",
      company: "Notion",
      avatar: "DP"
    },
    {
      text: "Docker containers no longer make my laptop sound like an airplane taking off.",
      author: "Alex Chen",
      role: "DevOps Engineer", 
      company: "Vercel",
      avatar: "AC"
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
            Developers Love Memory Monster
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="glass-card rounded-2xl p-8 border border-glass-200 hover:border-glass-300 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <div className="mb-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-white text-lg leading-relaxed">"{testimonial.text}"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.author}</div>
                  <div className="text-white/60 text-sm">{testimonial.role}</div>
                  <div className="text-white/40 text-xs">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const CTASection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Supercharge Your Development?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join 200K+ developers building faster with Memory Monster.
            <br />Download free and feel your environment come alive.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <DownloadButton size="lg">Download Free for Developers</DownloadButton>
            
            <div className="text-white/60 text-sm">
              macOS 10.15+ • Works with all IDEs • 4.8★ rating
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              VS Code & IDEs
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Docker & Containers
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Build Tools
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
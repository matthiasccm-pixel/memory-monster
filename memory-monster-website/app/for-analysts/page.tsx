// app/for-analysts/page.tsx

'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  FileSpreadsheet, 
  PresentationChart,
  Calculator,
  Zap,
  TrendingUp,
  Users,
  CheckCircle
} from 'lucide-react'
import { Navigation, Footer, FloatingElements, HeroSection, FeatureCard, DownloadButton } from '../lib/components'
import { analytics } from '../lib/analytics'

export default function ForAnalystsPage() {
  useEffect(() => {
    analytics.trackPageView('/for-analysts')
  }, [])

  const analystStats = [
    { value: '14.7GB', label: 'Memory Saved' },
    { value: '450K+', label: 'Business Users' },
    { value: '70%', label: 'Faster Reports' }
  ]

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection
        title="Stop Excel From Crashing Your Deadlines"
        subtitle="Trusted by 450K+ business professionals"
        description="Excel + PowerPoint + Slack + 30 browser tabs = productivity nightmare. Memory Monster keeps your analysis flowing when deadlines loom."
        stats={analystStats}
        visual={<BusinessVisualization />}
      />

      {/* Problem Section */}
      <ProblemSection />

      {/* Solution Features */}
      <FeaturesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  )
}

const BusinessVisualization = () => {
  return (
    <div className="relative w-80 h-80">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <motion.div 
        className="relative w-full h-full glass-card rounded-full border border-glass-200 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-center">
          <motion.div 
            className="text-6xl mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            📊
          </motion.div>
          <div className="text-white font-bold text-xl">Analysis Mode</div>
          <div className="text-primary-light text-sm">Optimized</div>
        </div>

        {/* Floating Business Tools */}
        {[
          { icon: '📈', angle: 0 },
          { icon: '📋', angle: 90 },
          { icon: '💼', angle: 180 },
          { icon: '📊', angle: 270 }
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
              duration: 20, 
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
  const businessProblems = [
    { 
      app: 'Excel', 
      memory: '8.4GB', 
      issue: 'Large datasets crash before you finish analysis',
      icon: '📊'
    },
    { 
      app: 'PowerPoint', 
      memory: '4.2GB', 
      issue: 'Presentations freeze during client meetings',
      icon: '📈'
    },
    { 
      app: 'Browser Tabs', 
      memory: '6.8GB', 
      issue: 'Research tabs slow everything to a crawl',
      icon: '🌐'
    },
    { 
      app: 'Slack/Teams', 
      memory: '3.1GB', 
      issue: 'Communication apps hog memory while you work',
      icon: '💬'
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
            Your Business Apps Are <span className="text-red-400">Productivity Killers</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Every analyst knows the pain. Your essential tools are sabotaging your deadlines.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businessProblems.map((problem, index) => (
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
              Total business suite usage: <span className="text-red-400 font-bold text-2xl">22.5GB</span>
              <br />
              <span className="text-white/60 text-sm">No wonder quarterly reports take forever</span>
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
      icon: <FileSpreadsheet className="w-8 h-8 text-white" />,
      title: 'Excel Optimization',
      description: 'Handle massive datasets without crashes. Keep complex models running smoothly.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <PresentationChart className="w-8 h-8 text-white" />,
      title: 'Presentation Power',
      description: 'PowerPoint and Keynote stay responsive during critical client presentations.',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-white" />,
      title: 'Multi-Tab Intelligence',
      description: 'Research with 50+ tabs open without grinding your analysis to a halt.',
      color: 'from-blue-400 to-purple-500'
    },
    {
      icon: <Calculator className="w-8 h-8 text-white" />,
      title: 'Financial Modeling',
      description: 'Complex calculations and financial models run 70% faster with optimized memory.',
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
            Built for Business Professionals
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Memory Monster understands your workflow and optimizes for maximum productivity.
          </p>
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
      text: "My Excel models with 2M+ rows no longer crash during board presentations. Saved my career!",
      author: "Rachel Park",
      role: "Senior Financial Analyst",
      company: "Goldman Sachs",
      avatar: "RP"
    },
    {
      text: "PowerPoint with 200 slides runs smoothly now. No more frozen screens during client pitches.",
      author: "Michael Torres",
      role: "Strategy Consultant",
      company: "McKinsey & Co",
      avatar: "MT"
    },
    {
      text: "Finally can research with 50+ tabs open without my MacBook becoming a space heater.",
      author: "Jennifer Liu",
      role: "Market Research Director",
      company: "Nielsen",
      avatar: "JL"
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
            Business Professionals Love Memory Monster
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
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
            Ready to Hit Every Deadline?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join 450K+ business professionals who never miss deadlines again.
            <br />Download Memory Monster free and transform your productivity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <DownloadButton size="lg">Download Free for Business</DownloadButton>
            
            <div className="text-white/60 text-sm">
              macOS 10.15+ • Works with all business apps • 4.8⭐ rating
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Excel & Office Suite
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              PowerPoint & Keynote
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Business Tools
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
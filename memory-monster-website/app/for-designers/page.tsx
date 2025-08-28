// app/for-designers/page.tsx

'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Palette, 
  Figma, 
  Image, 
  Layers,
  Zap,
  TrendingUp,
  Users,
  CheckCircle
} from 'lucide-react'
import { Navigation, Footer, FloatingElements, HeroSection, FeatureCard, DownloadButton } from '../lib/components'

import { analytics } from '../lib/analytics'

export default function ForDesignersPage() {
  useEffect(() => {
    analytics.trackPageView('/for-designers')
  }, [])

  const designerStats = [
    { value: '8.2GB', label: 'Memory Saved' },
    { value: '500K+', label: 'Designers' },
    { value: '50%', label: 'Faster Workflows' }
  ]

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection
        title="Stop Adobe From Killing Your Creativity"
        subtitle="Trusted by 500K+ designers worldwide"
        description="Photoshop + Figma + Sketch = 16GB+ memory drain. Memory Monster reclaims 8GB+ instantly so your creative flow never stops."
        stats={designerStats}
        visual={<DesignVisualization />}
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

const DesignVisualization = () => {
  return (
    <div className="relative w-80 h-80">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
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
            🎨
          </motion.div>
          <div className="text-white font-bold text-xl">Creative Flow</div>
          <div className="text-primary-light text-sm">Uninterrupted</div>
        </div>

        {/* Floating Design Tools */}
        {[
          { icon: '🖌️', angle: 0 },
          { icon: '✏️', angle: 90 },
          { icon: '🎭', angle: 180 },
          { icon: '🌈', angle: 270 }
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
  const designProblems = [
    { 
      app: 'Photoshop', 
      memory: '6.4GB', 
      issue: 'Layer-heavy files crash your system',
      icon: '🖼️'
    },
    { 
      app: 'Figma', 
      memory: '3.2GB', 
      issue: 'Complex prototypes slow to a crawl',
      icon: '🎯'
    },
    { 
      app: 'Sketch', 
      memory: '2.8GB', 
      issue: 'Symbol libraries eat your RAM',
      icon: '💎'
    },
    { 
      app: 'Illustrator', 
      memory: '4.1GB', 
      issue: 'Vector work becomes impossible',
      icon: '🎨'
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
            Your Creative Apps Are <span className="text-red-400">Memory Hogs</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Every designer knows the pain. Your creative suite devours RAM and kills your flow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {designProblems.map((problem, index) => (
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
              Total creative suite usage: <span className="text-red-400 font-bold text-2xl">16.5GB</span>
              <br />
              <span className="text-white/60 text-sm">No wonder your MacBook crawls during presentations</span>
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
      icon: <Zap className="w-8 h-8 text-white" />,
      title: 'Instant Adobe Optimization',
      description: 'Reclaim 8GB+ from Photoshop, Illustrator, and InDesign in one click',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <Figma className="w-8 h-8 text-white" />,
      title: 'Design Tool Intelligence',
      description: 'Memory Monster knows every trick Figma, Sketch, and XD use to hog memory',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: <Layers className="w-8 h-8 text-white" />,
      title: 'Layer-Safe Optimization',
      description: 'Optimize without losing work, layers, or creative progress',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: 'Workflow Acceleration',
      description: 'Render faster, export quicker, present without embarrassing lag',
      color: 'from-blue-400 to-cyan-500'
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
            Built for Creative Professionals
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Memory Monster understands your creative workflow and optimizes accordingly.
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
      text: "Finally! My MacBook feels new again. Photoshop went from 8GB to 1.2GB instantly 🔥",
      author: "Sarah Chen",
      role: "Senior UI Designer",
      company: "Airbnb",
      avatar: "SC"
    },
    {
      text: "No more beach balls during client presentations. My creative flow is uninterrupted.",
      author: "Marcus Rodriguez",
      role: "Brand Designer",
      company: "Stripe",
      avatar: "MR"
    },
    {
      text: "Figma prototypes load instantly now. Memory Monster saved my MacBook Pro.",
      author: "Emily Zhang",
      role: "Product Designer",
      company: "Notion",
      avatar: "EZ"
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
            Designers Love Memory Monster
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
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
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
            Ready to Unleash Your Creative Power?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join 500K+ designers who've reclaimed their creative flow.
            <br />Download Memory Monster free and feel the difference instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <DownloadButton size="lg">Download Free for Designers</DownloadButton>
            
            <div className="text-white/60 text-sm">
              macOS 10.15+ • Optimizes 250+ apps • 4.8★ rating
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Adobe Creative Suite
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Figma & Sketch
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Design Tools
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
// app/for-streamers/page.tsx

'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Video, 
  Mic, 
  Radio,
  Camera,
  Zap,
  TrendingUp,
  Users,
  CheckCircle
} from 'lucide-react'
import { Navigation, Footer, FloatingElements, HeroSection, FeatureCard, DownloadButton } from '../lib/components'
import { analytics } from '../lib/analytics'

export default function ForStreamersPage() {
  useEffect(() => {
    analytics.trackPageView('/for-streamers')
  }, [])

  const streamerStats = [
    { value: '18.6GB', label: 'Memory Freed' },
    { value: '85K+', label: 'Creators' },
    { value: '90%', label: 'Smoother Streams' }
  ]

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection
        title="Stop Dropped Frames From Killing Your Stream"
        subtitle="Trusted by 85K+ content creators worldwide"
        description="OBS + browser sources + chat + recording = stream disaster. Memory Monster keeps your content flowing when viewers are watching."
        stats={streamerStats}
        visual={<StreamingVisualization />}
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

const StreamingVisualization = () => {
  return (
    <div className="relative w-80 h-80">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <motion.div 
        className="relative w-full h-full glass-card rounded-full border border-glass-200 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-center">
          <motion.div 
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎥
          </motion.div>
          <div className="text-white font-bold text-xl">Streaming Mode</div>
          <div className="text-primary-light text-sm">Live</div>
        </div>

        {/* Floating Streaming Elements */}
        {[
          { icon: '🎙️', angle: 0 },
          { icon: '📹', angle: 90 },
          { icon: '💬', angle: 180 },
          { icon: '🔴', angle: 270 }
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
  const streamingProblems = [
    { 
      app: 'OBS Studio', 
      memory: '7.2GB', 
      issue: 'Recording software eats memory during long streams',
      icon: '🎬'
    },
    { 
      app: 'Browser Sources', 
      memory: '5.8GB', 
      issue: 'Chat widgets and overlays cause memory leaks',
      icon: '🌐'
    },
    { 
      app: 'Social Media', 
      memory: '4.4GB', 
      issue: 'Twitter, Instagram, TikTok tabs slow everything down',
      icon: '📱'
    },
    { 
      app: 'Audio Tools', 
      memory: '2.9GB', 
      issue: 'Logic Pro, Audacity compete with streaming resources',
      icon: '🎵'
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
            Your Streaming Setup Is <span className="text-red-400">Memory Hungry</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Every content creator faces this. Your tools fight each other for resources when you're live.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {streamingProblems.map((problem, index) => (
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
              Total streaming setup usage: <span className="text-red-400 font-bold text-2xl">20.3GB</span>
              <br />
              <span className="text-white/60 text-sm">No wonder you're getting dropped frames during peak viewership</span>
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
      icon: <Video className="w-8 h-8 text-white" />,
      title: 'Stream Optimization',
      description: 'Prioritize OBS and streaming software for zero dropped frames during live content.',
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: <Mic className="w-8 h-8 text-white" />,
      title: 'Audio Clarity',
      description: 'Keep podcasting and audio tools running smoothly without memory conflicts.',
      color: 'from-blue-400 to-purple-500'
    },
    {
      icon: <Radio className="w-8 h-8 text-white" />,
      title: 'Multi-Platform Power',
      description: 'Stream to Twitch, YouTube, and TikTok simultaneously without performance hits.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <Camera className="w-8 h-8 text-white" />,
      title: 'Content Creation',
      description: 'Edit, render, and upload while maintaining system responsiveness for your audience.',
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
            Built for Content Creators
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Memory Monster understands streaming workflows and optimizes for live performance.
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
      text: "Zero dropped frames during my 12-hour charity stream. 15K viewers and not a single hiccup!",
      author: "Alex Rivera",
      role: "Twitch Partner",
      company: "250K Followers",
      avatar: "AR"
    },
    {
      text: "My podcast recordings are crystal clear now. No more memory issues during 3-hour interviews.",
      author: "Sophie Kim",
      role: "Podcast Host",
      company: "Top 50 Business Podcast",
      avatar: "SK"
    },
    {
      text: "Can edit 4K videos while streaming live on YouTube. My MacBook Studio handles it all seamlessly.",
      author: "Marcus Johnson",
      role: "YouTube Creator",
      company: "1.2M Subscribers",
      avatar: "MJ"
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
            Creators Love Memory Monster
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
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-500 rounded-full flex items-center justify-center">
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
            Ready to Stream Without Stress?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join 85K+ content creators who never lose viewers to technical issues.
            <br />Download Memory Monster free and keep your audience engaged.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <DownloadButton size="lg">Download Free for Creators</DownloadButton>
            
            <div className="text-white/60 text-sm">
              macOS 10.15+ • Works with all streaming tools • 4.8⭐ rating
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              OBS & Streaming Software
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Audio & Video Tools
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Social Media Platforms
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
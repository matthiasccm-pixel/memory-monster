// app/for-gamers/page.tsx

'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Gamepad2, 
  Zap, 
  Activity,
  Gauge,
  Monitor,
  TrendingUp,
  Users,
  CheckCircle
} from 'lucide-react'
import { Navigation, Footer, FloatingElements, HeroSection, FeatureCard, DownloadButton } from '../lib/components'
import { analytics } from '../lib/analytics'

export default function ForGamersPage() {
  useEffect(() => {
    analytics.trackPageView('/for-gamers')
  }, [])

  const gamerStats = [
    { value: '16.3GB', label: 'Memory Freed' },
    { value: '180K+', label: 'Gamers' },
    { value: '95%', label: 'Smoother FPS' }
  ]

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection
        title="Stop Background Apps From Ruining Your Gameplay"
        subtitle="Trusted by 180K+ Mac gamers worldwide"
        description="Chrome + Discord + streaming apps = lag spikes and stutters. Memory Monster clears the path for flawless 120fps gaming sessions."
        stats={gamerStats}
        visual={<GamingVisualization />}
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

const GamingVisualization = () => {
  return (
    <div className="relative w-80 h-80">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <motion.div 
        className="relative w-full h-full glass-card rounded-full border border-glass-200 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-center">
          <motion.div 
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎮
          </motion.div>
          <div className="text-white font-bold text-xl">Gaming Mode</div>
          <div className="text-primary-light text-sm">Activated</div>
        </div>

        {/* Floating Gaming Elements */}
        {[
          { icon: '🕹️', angle: 0 },
          { icon: '⚔️', angle: 90 },
          { icon: '🏆', angle: 180 },
          { icon: '🎯', angle: 270 }
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
              duration: 15, 
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
  const gamingProblems = [
    { 
      app: 'Chrome Tabs', 
      memory: '9.2GB', 
      issue: 'YouTube guides and Discord web causing frame drops',
      icon: '🌐'
    },
    { 
      app: 'Discord', 
      memory: '3.8GB', 
      issue: 'Voice chat memory leaks during long sessions',
      icon: '💬'
    },
    { 
      app: 'OBS/Streaming', 
      memory: '5.4GB', 
      issue: 'Recording software competes with your games',
      icon: '📹'
    },
    { 
      app: 'Background Apps', 
      memory: '4.1GB', 
      issue: 'Spotify, Slack, updates running while gaming',
      icon: '⚙️'
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
            Background Apps Are <span className="text-red-400">Frame Rate Killers</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Every gamer knows the frustration. Your Mac has the power, but other apps steal it away.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gamingProblems.map((problem, index) => (
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
              Total memory stolen from games: <span className="text-red-400 font-bold text-2xl">22.5GB</span>
              <br />
              <span className="text-white/60 text-sm">No wonder you're getting frame drops in competitive matches</span>
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
      title: 'Gaming Mode',
      description: 'One-click optimization that prioritizes your game over background noise.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <Activity className="w-8 h-8 text-white" />,
      title: 'Real-Time FPS Protection',
      description: 'Monitor and prevent memory leaks that cause mid-game stuttering.',
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: <Gauge className="w-8 h-8 text-white" />,
      title: 'Performance Boost',
      description: 'Free up to 16GB of RAM so your games get maximum system resources.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <Monitor className="w-8 h-8 text-white" />,
      title: 'Stream-Safe Optimization',
      description: 'Keep OBS and streaming tools running smoothly without killing game performance.',
      color: 'from-purple-400 to-blue-500'
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
            Built for Serious Gaming
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Memory Monster understands gaming workloads and optimizes for maximum FPS.
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
      text: "Went from 45fps to 120fps in Cyberpunk just by clearing background memory. Game changer! 🚀",
      author: "Tyler Chen",
      role: "Twitch Streamer",
      company: "12K Followers",
      avatar: "TC"
    },
    {
      text: "No more rage-inducing stutters during ranked matches. Finally hit Diamond thanks to consistent FPS.",
      author: "Jordan Smith",
      role: "Competitive Gamer",
      company: "Valorant Pro",
      avatar: "JS"
    },
    {
      text: "Can stream and game simultaneously on my M2 MacBook without thermal throttling. Incredible.",
      author: "Maya Patel",
      role: "Content Creator",
      company: "Gaming YouTube 50K+",
      avatar: "MP"
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
            Gamers Love Memory Monster
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
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-red-500 rounded-full flex items-center justify-center">
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
            Ready to Dominate at 120fps?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join 180K+ Mac gamers who never miss a shot due to lag.
            <br />Download Memory Monster free and unlock your Mac's gaming potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <DownloadButton size="lg">Download Free for Gaming</DownloadButton>
            
            <div className="text-white/60 text-sm">
              macOS 10.15+ • Works with all games • 4.8⭐ rating
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              All Games
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Streaming Tools
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Discord & Voice Chat
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Download, 
  ArrowRight,
  Play,
  Folder,
  Shield,
  Zap,
  Users,
  Star,
  ExternalLink,
  Copy,
  Mail,
  Heart,
  Globe,
  Clock
} from 'lucide-react'
import { Navigation, Footer, FloatingElements } from '../../lib/components'
import { analytics } from '../../lib/analytics'

export default function DownloadSuccessPage() {
  const [downloadStarted, setDownloadStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [platform, setPlatform] = useState<'silicon' | 'intel'>('silicon')
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  useEffect(() => {
    analytics.trackPageView('/download/success')
    
    // Auto-detect platform from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const detectedPlatform = urlParams.get('platform') as 'silicon' | 'intel' || 'silicon'
    setPlatform(detectedPlatform)

    // Start download automatically after a short delay
    const timer = setTimeout(() => {
      setDownloadStarted(true)
      startDownload(detectedPlatform)
    }, 1500)

    // Auto-advance installation steps
    const stepTimer1 = setTimeout(() => setCurrentStep(2), 3000)
    const stepTimer2 = setTimeout(() => setCurrentStep(3), 6000)
    const stepTimer3 = setTimeout(() => setCurrentStep(4), 9000)

    return () => {
      clearTimeout(timer)
      clearTimeout(stepTimer1)
      clearTimeout(stepTimer2)
      clearTimeout(stepTimer3)
    }
  }, [])

  const startDownload = (downloadPlatform: 'silicon' | 'intel') => {
    // Simulate download start
    const downloadUrl = downloadPlatform === 'silicon' 
      ? '/downloads/MemoryMonster-AppleSilicon.dmg'
      : '/downloads/MemoryMonster-Intel.dmg'
    
    // Create invisible download link
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `MemoryMonster-${downloadPlatform === 'silicon' ? 'AppleSilicon' : 'Intel'}.dmg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    analytics.trackDownloadCompleted(downloadPlatform, 'success_page')
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setEmailSubmitted(true)
    // TODO: Send email to backend for onboarding sequence
    await analytics.track('email_submitted', { email, context: 'download_success' })
  }

  const installationSteps = [
    {
      step: 1,
      title: 'Open the downloaded file',
      description: 'Find MemoryMonster.dmg in your Downloads folder and double-click it',
      icon: <Folder className="w-6 h-6 text-white" />
    },
    {
      step: 2,
      title: 'Drag to Applications',
      description: 'Drag Memory Monster to your Applications folder',
      icon: <ArrowRight className="w-6 h-6 text-white" />
    },
    {
      step: 3,
      title: 'Launch Memory Monster',
      description: 'Open Memory Monster from Applications and grant permissions when prompted',
      icon: <Play className="w-6 h-6 text-white" />
    },
    {
      step: 4,
      title: 'Run your first scan',
      description: 'Click "Scan Now" to see instant memory optimization results',
      icon: <Zap className="w-6 h-6 text-white" />
    }
  ]

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Success Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              <span className="morphing-gradient">Download Started!</span>
            </h1>
            
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Memory Monster for <span className="font-semibold text-accent">
                {platform === 'silicon' ? 'Apple Silicon' : 'Intel'}
              </span> is downloading now. Get ready to unlock your Mac's hidden speed!
            </p>

            {/* Download Status */}
            <AnimatePresence>
              {downloadStarted && (
                <motion.div
                  className="mt-8 inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <Download className="w-5 h-5 text-green-400 animate-bounce" />
                  <span className="text-green-400 font-medium">Download in progress...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content - Installation Guide */}
            <div className="lg:col-span-2">
              
              {/* Installation Steps */}
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Shield className="w-7 h-7 text-accent" />
                  Installation Guide
                </h2>
                
                <div className="space-y-4">
                  {installationSteps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-500 ${
                        currentStep >= step.step 
                          ? 'bg-accent/20 border border-accent/30' 
                          : 'bg-white/5 border border-white/10'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        currentStep >= step.step 
                          ? 'bg-accent text-white' 
                          : 'bg-white/10 text-white/60'
                      }`}>
                        {currentStep > step.step ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">
                          Step {step.step}: {step.title}
                        </h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-blue-400 font-medium mb-1">Security Notice</h4>
                      <p className="text-white/70 text-sm">
                        Memory Monster is digitally signed and notarized by Apple. If macOS asks for permissions, 
                        click "Allow" to enable memory optimization features.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* What to Expect */}
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Zap className="w-7 h-7 text-yellow-400" />
                  What to Expect in Your First Scan
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Deep System Analysis</h3>
                    <p className="text-white/70 text-sm">
                      Comprehensive scan of memory usage, background apps, and system processes
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Instant Optimization</h3>
                    <p className="text-white/70 text-sm">
                      Free up RAM, close memory leaks, and optimize system performance automatically
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Speed Report</h3>
                    <p className="text-white/70 text-sm">
                      See exactly how much faster your Mac becomes with detailed before/after metrics
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Email Capture */}
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                {!emailSubmitted ? (
                  <>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-accent" />
                      Get Installation Help
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      Get tips, troubleshooting, and optimization guides delivered to your inbox.
                    </p>
                    <form onSubmit={handleEmailSubmit} className="space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent/80 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                      >
                        Send Me Tips
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">You're all set!</h3>
                    <p className="text-white/70 text-sm">
                      Check your email for installation tips and optimization guides.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Community Stats */}
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Join the Community
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Active Users</span>
                    <span className="text-white font-semibold">2.1M+</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">App Store Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">4.8</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Memory Optimized</span>
                    <span className="text-white font-semibold">847TB</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Daily Scans</span>
                    <span className="text-white font-semibold">1.2M</span>
                  </div>
                </div>
              </motion.div>

              {/* Pro Upgrade Hint */}
              <motion.div 
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  🚀 Supercharge Your Mac
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Unlock advanced features like real-time monitoring, scheduled optimization, and detailed performance analytics.
                </p>
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-105">
                  Upgrade to Pro
                </button>
              </motion.div>

              {/* Help Links */}
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h3 className="text-white font-semibold mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <a 
                    href="/help" 
                    className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Installation Guide
                  </a>
                  <a 
                    href="/help#troubleshooting" 
                    className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Troubleshooting
                  </a>
                  <a 
                    href="mailto:support@memorymonster.app" 
                    className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Support
                  </a>
                </div>
              </motion.div>

              {/* Testimonial */}
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm mb-3 italic">
                      "Memory Monster brought my 2018 MacBook back to life. It's like having a new computer!"
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-white/60 text-xs">- Sarah K., Designer</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
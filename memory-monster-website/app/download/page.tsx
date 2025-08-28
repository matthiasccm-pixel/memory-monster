// app/download/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { 
  Download, 
  Apple, 
  CheckCircle,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Monitor
} from 'lucide-react'
import { Navigation, Footer, FloatingElements } from '../lib/components'
import { analytics } from '../lib/analytics'

export default function DownloadPage() {
  const { user, isLoaded } = useUser()
  const [platform, setPlatform] = useState<'intel' | 'silicon'>('silicon')
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    analytics.trackPageView('/download')
    
    // Auto-detect platform
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes('intel')) {
      setPlatform('intel')
    }
  }, [])

  const handleDownload = async (downloadPlatform: 'intel' | 'silicon') => {
    setIsDownloading(true)
    
    try {
      // If user is logged in, call API to track download
      if (isLoaded && user) {
        const response = await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform: downloadPlatform })
        })
        
        if (response.ok) {
          const { downloadUrl } = await response.json()
          
          if (downloadUrl) {
            // Create invisible download link
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = `MemoryMonster-${downloadPlatform === 'silicon' ? 'AppleSilicon' : 'Intel'}.dmg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        }
      } else {
        // For anonymous users, use direct download URLs from env vars
        const downloadUrl = downloadPlatform === 'silicon' 
          ? process.env.NEXT_PUBLIC_APP_DOWNLOAD_SILICON
          : process.env.NEXT_PUBLIC_APP_DOWNLOAD_INTEL
        
        if (downloadUrl) {
          // Create invisible download link
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = `MemoryMonster-${downloadPlatform === 'silicon' ? 'AppleSilicon' : 'Intel'}.dmg`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
      
      // Track the download
      await analytics.trackDownloadCompleted(downloadPlatform, 'download_page')
      
      // Redirect to success page after short delay
      setTimeout(() => {
        window.location.href = '/download/success'
      }, 1000)
      
    } catch (error) {
      console.error('Download error:', error)
      // On error, still redirect to success page (fallback)
      setTimeout(() => {
        window.location.href = '/download/success'
      }, 1000)
    } finally {
      setIsDownloading(false)
    }
  }

  // Rest of your component code stays the same...
  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* All your existing JSX stays exactly the same */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-glass-100 backdrop-blur-md rounded-full px-4 py-2 border border-glass-200 mb-8">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Ready to Download • 100% Free</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight mb-6">
              Download
              <br />
              <span className="morphing-gradient">Memory Monster</span>
            </h1>
            
            <p className="text-xl text-white/70 leading-relaxed mb-12 max-w-2xl mx-auto">
              Get instant speed improvements for your Mac. Trusted by 2.1M+ users worldwide.
            </p>
          </motion.div>

          {/* Download Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Apple Silicon */}
            <motion.div
              className={`glass-card rounded-3xl p-8 border-2 cursor-pointer transition-all duration-300 ${
                platform === 'silicon' 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'border-glass-200 hover:border-primary/30'
              }`}
              onClick={() => setPlatform('silicon')}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                    <Apple className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-bold text-lg">Apple Silicon</h3>
                    <p className="text-white/60 text-sm">M1, M2, M3, M4 Macs</p>
                  </div>
                </div>
                {platform === 'silicon' && (
                  <CheckCircle className="w-6 h-6 text-accent" />
                )}
              </div>
              
              <div className="text-left space-y-2 mb-6">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Optimized for Apple Silicon
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Native ARM64 performance
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  macOS 11.0+ required
                </div>
              </div>

              {platform === 'silicon' && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload('silicon')
                  }}
                  className="w-full magnetic-button liquid-button glass-card bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 relative overflow-hidden"
                  whileHover={{ y: -4 }}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Downloading...
                    </div>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download for Apple Silicon
                    </>
                  )}
                </motion.button>
              )}
            </motion.div>

            {/* Intel */}
            <motion.div
              className={`glass-card rounded-3xl p-8 border-2 cursor-pointer transition-all duration-300 ${
                platform === 'intel' 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'border-glass-200 hover:border-primary/30'
              }`}
              onClick={() => setPlatform('intel')}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Monitor className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-bold text-lg">Intel Mac</h3>
                    <p className="text-white/60 text-sm">2015-2020 MacBooks & iMacs</p>
                  </div>
                </div>
                {platform === 'intel' && (
                  <CheckCircle className="w-6 h-6 text-accent" />
                )}
              </div>
              
              <div className="text-left space-y-2 mb-6">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Intel x86_64 optimized
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Works on older Macs
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  macOS 10.15+ required
                </div>
              </div>

              {platform === 'intel' && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload('intel')
                  }}
                  className="w-full magnetic-button liquid-button glass-card bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 relative overflow-hidden"
                  whileHover={{ y: -4 }}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Downloading...
                    </div>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download for Intel Mac
                    </>
                  )}
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div 
            className="flex justify-center gap-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">2.1M+</div>
              <div className="text-white/60 text-sm">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">4.8★</div>
              <div className="text-white/60 text-sm">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">85%</div>
              <div className="text-white/60 text-sm">Speed Boost</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              What You Get With Memory Monster
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-white" />,
                title: 'Instant Optimization',
                description: 'One-click memory cleanup for immediate speed improvements',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: <Shield className="w-8 h-8 text-white" />,
                title: '100% Safe',
                description: 'Never damages files or system stability. Completely reversible.',
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: <Users className="w-8 h-8 text-white" />,
                title: 'AI Learning',
                description: 'Learns from 1B+ scans to optimize your specific usage patterns',
                color: 'from-blue-400 to-purple-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card rounded-2xl p-8 border border-glass-200 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-xl mb-4">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-6 bg-glass-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Safe & Secure Download
            </h2>
            <p className="text-white/70 text-lg mb-12">
              Memory Monster is digitally signed, notarized by Apple, and trusted by millions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '🛡️', title: 'Apple Notarized', desc: 'Verified by Apple security' },
                { icon: '🔒', title: 'Code Signed', desc: 'Authentic & tamper-proof' },
                { icon: '✅', title: 'Malware Free', desc: 'Clean & safe installation' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="glass-card rounded-xl p-6 border border-glass-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
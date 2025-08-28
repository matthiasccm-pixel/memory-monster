// app/help/installation-guide/page.tsx

'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  FolderOpen,
  Shield,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Apple,
  Cpu
} from 'lucide-react'
import { Navigation, Footer, FloatingElements } from '../../lib/components'
import { analytics } from '../../lib/analytics'

export default function InstallationGuidePage() {
  useEffect(() => {
    analytics.trackPageView('/help/installation-guide')
  }, [])

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/60 text-sm mb-8">
              <a href="/help" className="hover:text-white transition-colors">Help Center</a>
              <span>/</span>
              <a href="/help#getting-started" className="hover:text-white transition-colors">Getting Started</a>
              <span>/</span>
              <span className="text-white">Installation Guide</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tight mb-6">
              Installation Guide
            </h1>
            
            <p className="text-xl text-white/70 leading-relaxed mb-12">
              Get Memory Monster up and running on your Mac in just 3 minutes. Follow these simple steps for a smooth installation.
            </p>

            {/* System Requirements */}
            <div className="glass-card rounded-2xl p-6 border border-glass-200 mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-white font-bold text-lg">System Requirements</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white/90 font-semibold mb-2">Minimum Requirements</h3>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      macOS 10.15 (Catalina) or later
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      4GB RAM minimum
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      100MB free disk space
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white/90 font-semibold mb-2">Supported Processors</h3>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-center gap-2">
                      <Apple className="w-4 h-4 text-primary" />
                      Apple Silicon (M1, M2, M3, M4)
                    </li>
                    <li className="flex items-center gap-2">
                      <Apple className="w-4 h-4 text-primary" />
                      Intel processors (2015 or newer)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Installation Steps */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Step 1: Download */}
            <motion.div 
              className="glass-card rounded-2xl p-8 border border-glass-200"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl mb-4">Download Memory Monster</h3>
                  <p className="text-white/70 mb-6">
                    First, download the correct version for your Mac. Memory Monster automatically detects your processor type.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <a href="/pricing" className="glass-card rounded-xl p-4 border border-glass-200 hover:border-primary/50 transition-all block">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-primary" />
                        <div>
                          <div className="text-white font-semibold">Apple Silicon</div>
                          <div className="text-white/60 text-sm">For M1, M2, M3, M4 Macs</div>
                        </div>
                      </div>
                    </a>
                    <a href="/pricing" className="glass-card rounded-xl p-4 border border-glass-200 hover:border-primary/50 transition-all block">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-primary" />
                        <div>
                          <div className="text-white font-semibold">Intel</div>
                          <div className="text-white/60 text-sm">For Intel-based Macs</div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Install */}
            <motion.div 
              className="glass-card rounded-2xl p-8 border border-glass-200"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl mb-4">Install the Application</h3>
                  <p className="text-white/70 mb-6">
                    Once downloaded, follow these steps to install Memory Monster:
                  </p>
                  <ol className="space-y-4 text-white/80">
                    <li className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-white">Open the DMG file</strong>
                        <p className="text-white/60 text-sm mt-1">Double-click the downloaded .dmg file to mount it</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-white">Drag to Applications</strong>
                        <p className="text-white/60 text-sm mt-1">Drag the Memory Monster icon to your Applications folder</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-white">Eject the DMG</strong>
                        <p className="text-white/60 text-sm mt-1">Right-click the mounted drive and select "Eject"</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </motion.div>

            {/* Step 3: First Launch */}
            <motion.div 
              className="glass-card rounded-2xl p-8 border border-glass-200"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl mb-4">First Launch & Permissions</h3>
                  <p className="text-white/70 mb-6">
                    The first time you launch Memory Monster, you'll need to grant necessary permissions:
                  </p>
                  
                  {/* Security Warning */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white font-semibold mb-1">macOS Security Notice</div>
                        <p className="text-white/70 text-sm">
                          If you see "Memory Monster can't be opened because it is from an unidentified developer":
                        </p>
                        <ol className="mt-3 space-y-2 text-white/60 text-sm">
                          <li>1. Go to System Preferences → Security & Privacy</li>
                          <li>2. Click "Open Anyway" next to the Memory Monster message</li>
                          <li>3. Click "Open" in the dialog that appears</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="glass-card rounded-xl p-4 border border-glass-200">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="text-white font-semibold">Accessibility Permission</div>
                          <div className="text-white/60 text-sm">Required to analyze and optimize running applications</div>
                        </div>
                      </div>
                    </div>
                    <div className="glass-card rounded-xl p-4 border border-glass-200">
                      <div className="flex items-center gap-3">
                        <FolderOpen className="w-5 h-5 text-blue-400" />
                        <div>
                          <div className="text-white font-semibold">Full Disk Access (Optional)</div>
                          <div className="text-white/60 text-sm">Enables deeper optimization for Pro users</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div 
              className="glass-card rounded-2xl p-8 border border-green-500/30 bg-green-500/5 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">Installation Complete!</h3>
              <p className="text-white/70 mb-6">
                Memory Monster is now installed and ready to optimize your Mac.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/help/first-scan" className="bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all">
                  Learn About First Scan
                </a>
                <a href="/help" className="glass-card border border-glass-200 text-white font-semibold py-3 px-6 rounded-xl hover:border-glass-300 transition-all">
                  Back to Help Center
                </a>
              </div>
            </motion.div>
          </div>

          {/* Troubleshooting Section */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">Common Installation Issues</h2>
            
            <div className="space-y-6">
              <div className="glass-card rounded-xl p-6 border border-glass-200">
                <h3 className="text-white font-semibold mb-3">App is damaged and can't be opened</h3>
                <p className="text-white/70 text-sm mb-3">
                  This happens when macOS quarantines downloaded apps. To fix:
                </p>
                <code className="block bg-glass-200 rounded-lg p-3 text-primary text-sm">
                  xattr -cr /Applications/Memory\ Monster.app
                </code>
                <p className="text-white/60 text-xs mt-2">
                  Run this command in Terminal to remove the quarantine flag.
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 border border-glass-200">
                <h3 className="text-white font-semibold mb-3">Installation stuck or frozen</h3>
                <p className="text-white/70 text-sm">
                  Try these steps:
                </p>
                <ul className="mt-3 space-y-2 text-white/60 text-sm">
                  <li>• Force quit the installer (Command + Option + Esc)</li>
                  <li>• Restart your Mac</li>
                  <li>• Re-download the installer</li>
                  <li>• Temporarily disable antivirus software</li>
                </ul>
              </div>

              <div className="glass-card rounded-xl p-6 border border-glass-200">
                <h3 className="text-white font-semibold mb-3">Not enough disk space</h3>
                <p className="text-white/70 text-sm">
                  Memory Monster requires only 100MB, but the installer needs temporary space. Free up at least 500MB and try again.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Need More Help */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Still Having Issues?</h2>
            <p className="text-white/70 mb-6">
              Our support team is here to help you get Memory Monster running smoothly.
            </p>
            <a 
              href="mailto:support@memorymonster.co" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
// app/terms/page.tsx

'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navigation, Footer, FloatingElements } from '../lib/components'
import { analytics } from '../lib/analytics'

export default function TermsPage() {
  useEffect(() => {
    analytics.trackPageView('/terms')
  }, [])

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-8">
              <span className="morphing-gradient">Terms of Service</span>
            </h1>
            
            <div className="glass-card rounded-3xl p-8 border border-glass-200 space-y-8">
              <div>
                <p className="text-white/80 text-lg mb-6">
                  Last updated: January 15, 2025
                </p>
                <p className="text-white/70 leading-relaxed">
                  Welcome to Memory Monster. These Terms of Service govern your use of our Mac optimization software and related services.
                </p>
              </div>

              <div className="space-y-6">
                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">1. Acceptance of Terms</h2>
                  <p className="text-white/80 leading-relaxed">
                    By downloading, installing, or using Memory Monster, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, do not use our software.
                  </p>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">2. License Grant</h2>
                  <p className="text-white/80 leading-relaxed mb-4">
                    We grant you a limited, non-exclusive, non-transferable license to use Memory Monster on your Mac devices for personal or commercial use, subject to these terms.
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                    <li>You may install Memory Monster on up to 3 Mac devices you own or control</li>
                    <li>You may not reverse engineer, decompile, or disassemble the software</li>
                    <li>You may not redistribute or resell the software</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">3. Subscription Services</h2>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Memory Monster Pro is offered as a subscription service with the following terms:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                    <li>Monthly subscriptions: $4.99/month, billed monthly</li>
                    <li>Annual subscriptions: $39.99/year, billed annually</li>
                    <li>Free trial: 7 days for new Pro subscribers</li>
                    <li>Automatic renewal unless cancelled before the renewal date</li>
                    <li>Cancellation takes effect at the end of the current billing period</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">4. Refund Policy</h2>
                  <p className="text-white/80 leading-relaxed">
                    We offer a 30-day money-back guarantee for all subscriptions. If you're not satisfied with Memory Monster Pro, contact us within 30 days of your initial purchase for a full refund.
                  </p>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">5. Privacy and Data</h2>
                  <p className="text-white/80 leading-relaxed">
                    Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. Memory Monster only collects anonymous usage data to improve our service and does not access your personal files.
                  </p>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">6. Limitation of Liability</h2>
                  <p className="text-white/80 leading-relaxed">
                    Memory Monster is provided "as is" without warranties. We are not liable for any damages arising from the use of our software. Our total liability shall not exceed the amount you paid for the service.
                  </p>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">7. System Requirements</h2>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Memory Monster requires:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                    <li>macOS 10.15 or later (Intel Macs)</li>
                    <li>macOS 11.0 or later (Apple Silicon Macs)</li>
                    <li>At least 100MB of available disk space</li>
                    <li>Administrator privileges for installation</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">8. Updates and Changes</h2>
                  <p className="text-white/80 leading-relaxed">
                    We may update Memory Monster and these Terms of Service from time to time. Continued use of the software after updates constitutes acceptance of any changes. We will notify users of significant changes via email or in-app notifications.
                  </p>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">9. Termination</h2>
                  <p className="text-white/80 leading-relaxed">
                    You may terminate your use of Memory Monster at any time by uninstalling the software and cancelling your subscription. We may terminate your access if you violate these terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">10. Contact Information</h2>
                  <p className="text-white/80 leading-relaxed">
                    If you have questions about these Terms of Service, please contact us at:
                    <br />
                    <strong className="text-white">Email:</strong> legal@memorymonster.co
                    <br />
                    <strong className="text-white">Support:</strong> support@memorymonster.co
                  </p>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
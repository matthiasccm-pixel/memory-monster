// app/privacy/page.tsx

'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Database } from 'lucide-react'
import { Navigation, Footer, FloatingElements } from '../lib/components'
import { analytics } from '../lib/analytics'

export default function PrivacyPage() {
  useEffect(() => {
    analytics.trackPageView('/privacy')
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
              <span className="morphing-gradient">Privacy Policy</span>
            </h1>
            
            <div className="glass-card rounded-3xl p-8 border border-glass-200 space-y-8">
              <div>
                <p className="text-white/80 text-lg mb-6">
                  Last updated: January 15, 2025
                </p>
                <p className="text-white/70 leading-relaxed">
                  Your privacy is fundamental to us. This Privacy Policy explains how Memory Monster collects, uses, and protects your information when you use our Mac optimization software.
                </p>
              </div>

              {/* Privacy Principles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                {[
                  {
                    icon: <Shield className="w-6 h-6 text-green-400" />,
                    title: "No Personal Files",
                    description: "We never access your documents, photos, or personal data"
                  },
                  {
                    icon: <Lock className="w-6 h-6 text-blue-400" />,
                    title: "Anonymous Data",
                    description: "All usage data is aggregated and anonymized"
                  },
                  {
                    icon: <Eye className="w-6 h-6 text-purple-400" />,
                    title: "No Tracking",
                    description: "We don't track your browsing or personal activities"
                  },
                  {
                    icon: <Database className="w-6 h-6 text-orange-400" />,
                    title: "Minimal Collection",
                    description: "We only collect what's needed to optimize your Mac"
                  }
                ].map((principle, index) => (
                  <motion.div
                    key={index}
                    className="bg-glass-100 rounded-xl p-4 border border-glass-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {principle.icon}
                      <h3 className="text-white font-semibold">{principle.title}</h3>
                    </div>
                    <p className="text-white/70 text-sm">{principle.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-6">
                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">Information We Collect</h2>
                  
                  <h3 className="text-white font-semibold text-lg mb-3">System Information (Anonymous)</h3>
                  <ul className="list-disc list-inside text-white/70 space-y-2 ml-4 mb-4">
                    <li>Mac model and macOS version</li>
                    <li>Memory usage patterns and optimization results</li>
                    <li>App names that consume excessive memory (no app data or content)</li>
                    <li>System performance metrics before and after optimization</li>
                  </ul>

                  <h3 className="text-white font-semibold text-lg mb-3">Account Information (If You Create an Account)</h3>
                  <ul className="list-disc list-inside text-white/70 space-y-2 ml-4 mb-4">
                    <li>Email address and name (for account management)</li>
                    <li>Subscription status and billing information (processed by Stripe)</li>
                    <li>Support communications and preferences</li>
                  </ul>

                  <h3 className="text-white font-semibold text-lg mb-3">What We DO NOT Collect</h3>
                  <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                    <li>Personal files, documents, photos, or any file contents</li>
                    <li>Browsing history or website data</li>
                    <li>Passwords, keychain data, or security credentials</li>
                    <li>Location data or device identifiers</li>
                    <li>Any data from inside your applications</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">How We Use Your Information</h2>
                  <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                    <li><strong className="text-white">Optimization:</strong> To analyze memory patterns and improve Memory Monster's effectiveness</li>
                    <li><strong className="text-white">AI Training:</strong> Anonymous usage data helps train our optimization algorithms</li>
                    <li><strong className="text-white">Support:</strong> To provide customer support and resolve technical issues</li>
                    <li><strong className="text-white">Service Improvement:</strong> To enhance features and fix bugs</li>
                    <li><strong className="text-white">Communications:</strong> To send important updates about the software (you can opt out)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">Data Security</h2>
                  <p className="text-white/80 leading-relaxed mb-4">
                    We implement industry-standard security measures to protect your information:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                    <li>All data transmission is encrypted using TLS 1.3</li>
                    <li>Our servers use enterprise-grade security and monitoring</li>
                    <li>Access to user data is strictly limited and logged</li>
                    <li>We regularly audit our security practices</li>
                    <li>Data is stored in secure, SOC 2 compliant data centers</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">Data Retention</h2>
                  <p className="text-white/80 leading-relaxed mb-4">
                    We retain your information only as long as necessary:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                    <li>Anonymous usage data: Up to 2 years for AI training and analytics</li>
                    <li>Account information: Until you delete your account</li>
                    <li>Support communications: Up to 3 years for service improvement</li>
                    <li>Billing information: As required by financial regulations (processed by Stripe)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">Third-Party Services</h2>
                  <p className="text-white/80 leading-relaxed mb-4">
                    We use trusted third-party services with strong privacy practices:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                    <li><strong className="text-white">Stripe:</strong> For secure payment processing (they handle all billing data)</li>
                    <li><strong className="text-white">Supabase:</strong> For secure database hosting</li>
                    <li><strong className="text-white">Clerk:</strong> For authentication and user management</li>
                    <li><strong className="text-white">Vercel:</strong> For website hosting and analytics</li>
                  </ul>
                  <p className="text-white/70 text-sm mt-4">
                    These services have their own privacy policies and security standards that we carefully evaluate.
                  </p>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">Your Rights</h2>
                  <p className="text-white/80 leading-relaxed mb-4">
                    You have the following rights regarding your data:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                    <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
                    <li><strong className="text-white">Correction:</strong> Update or correct your account information</li>
                    <li><strong className="text-white">Deletion:</strong> Delete your account and associated data</li>
                    <li><strong className="text-white">Portability:</strong> Export your data in a standard format</li>
                    <li><strong className="text-white">Opt-out:</strong> Disable analytics or marketing communications</li>
                  </ul>
                  <p className="text-white/70 text-sm mt-4">
                    To exercise these rights, contact us at privacy@memorymonster.co
                  </p>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">Children's Privacy</h2>
                  <p className="text-white/80 leading-relaxed">
                    Memory Monster is not designed for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
                  </p>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">International Users</h2>
                  <p className="text-white/80 leading-relaxed">
                    Memory Monster is available worldwide. If you're in the EU, you have additional rights under GDPR. If you're in California, you have rights under CCPA. We comply with applicable privacy laws in all jurisdictions where we operate.
                  </p>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">Changes to This Policy</h2>
                  <p className="text-white/80 leading-relaxed">
                    We may update this Privacy Policy occasionally. We'll notify you of significant changes via email or through the app. Continued use of Memory Monster after changes indicates acceptance of the updated policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-white font-bold text-2xl mb-4">Contact Us</h2>
                  <p className="text-white/80 leading-relaxed">
                    If you have questions about this Privacy Policy or our data practices:
                    <br />
                    <strong className="text-white">Privacy Team:</strong> privacy@memorymonster.co
                    <br />
                    <strong className="text-white">General Support:</strong> support@memorymonster.co
                    <br />
                    <strong className="text-white">Data Protection Officer:</strong> dpo@memorymonster.co
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
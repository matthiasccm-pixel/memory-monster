// app/pricing/page.tsx

'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Download,
  Zap,
  Users,
  Shield,
  Sparkles,
  Cpu,
  Activity,
  Star
} from 'lucide-react'
import { Navigation, Footer, FloatingElements, DownloadButton } from '../lib/components'
import { analytics } from '../lib/analytics'

export default function PricingPage() {
  useEffect(() => {
    analytics.trackPageView('/pricing')
  }, [])

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-glass-100 backdrop-blur-md rounded-full px-4 py-2 border border-glass-200 mb-8">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Simple, transparent pricing</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight mb-6">
              Choose Your
              <br />
              <span className="morphing-gradient">Speed Level</span>
            </h1>
            
            <p className="text-xl text-white/70 leading-relaxed mb-12 max-w-2xl mx-auto">
              Start free, upgrade when you need unlimited optimization power
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Free Plan */}
            <div className="glass-card rounded-3xl p-8 border border-glass-200 hover:border-glass-300 transition-all duration-500 h-full">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Memory Monster</h3>
                <div className="text-5xl font-black text-white mb-2">FREE</div>
                <p className="text-white/70">Perfect for getting started</p>
              </div>

              <div className="space-y-4 mb-8">
                <PricingFeature icon="✓" text="10+ Major Apps Optimized" />
                <PricingFeature icon="✓" text="3 Comprehensive Scans Per Day" />
                <PricingFeature icon="✓" text="15% Average Speed Improvement" />
                <PricingFeature icon="✓" text="Basic Optimization Recommendations" />
                <PricingFeature icon="✓" text="Community Insights from 1B+ Scans" />
                <PricingFeature icon="✓" text="Basic AI Learning & Pattern Recognition" />
                <PricingFeature icon="✓" text="Share Data for Community Improvement" />
                <PricingFeature icon="✓" text="Safe & Reversible Operations" />
                <PricingFeature icon="✓" text="OS-Specific Intelligence (All macOS Versions)" />
                <PricingFeature icon="✗" text="250+ Apps & More Added Weekly" unavailable />
                <PricingFeature icon="✗" text="Unlimited Real-Time Scanning" unavailable />
                <PricingFeature icon="✗" text="Auto-Fixes Speed Issues" unavailable />
                <PricingFeature icon="✗" text="AI Strategy Updates from Community" unavailable />
                <PricingFeature icon="✗" text="Adaptive Learning from Your Usage" unavailable />
                <PricingFeature icon="✗" text="Personalized AI Optimizations" unavailable />
              </div>

              <div className="border-t border-glass-200 pt-6 mb-8">
                <div className="text-white/70 text-sm mb-2">Perfect for:</div>
                <div className="text-white/90 text-sm space-y-1">
                  <div>• Casual Mac users</div>
                  <div>• Light multitasking</div>
                  <div>• Testing Memory Monster</div>
                </div>
              </div>

              <button 
                className="w-full bg-glass-200 hover:bg-glass-300 text-white py-5 px-6 rounded-2xl font-bold text-lg border border-glass-200 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                onClick={async () => {
                  await analytics.trackDownloadIntent('pricing_free_card')
                  window.location.href = '/download/success'
                }}
              >
                Download Free
              </button>
              <div className="text-center text-white/60 text-sm mt-3">No credit card required</div>
            </div>

            {/* Pro Plan */}
            <div className="relative overflow-hidden">
              {/* Popular Badge */}
              <div className="absolute top-6 right-4 z-10">
                <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl">
                  Most Popular
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl"></div>

              <div className="relative glass-card rounded-3xl p-8 border border-primary/30 hover:border-primary/50 transition-all duration-500 h-full hover:-translate-y-1">
                <div className="text-center mb-8 mt-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Memory Monster Pro</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-5xl font-black text-white">$4.99</span>
                    <span className="text-white/70 text-lg ml-2">/month</span>
                  </div>
                  <p className="text-white/70">Unlimited optimization power</p>
                </div>

                <div className="space-y-4 mb-8">
                  <PricingFeature icon="⚡" text="250+ Apps & More Added Weekly" highlight />
                  <PricingFeature icon="⚡" text="Unlimited Real-Time Scanning" highlight />
                  <PricingFeature icon="⚡" text="Auto-Fixes Speed Issues" highlight />
                  <PricingFeature icon="⚡" text="45% Average Speed Improvement" highlight />
                  <PricingFeature icon="⚡" text="AI Strategy Updates from Community" highlight />
                  <PricingFeature icon="⚡" text="Adaptive Learning from Your Usage" highlight />
                  <PricingFeature icon="⚡" text="Personalized AI Optimizations" highlight />
                  <PricingFeature icon="⚡" text="24/7 Background Monitoring" highlight />
                  <PricingFeature icon="⚡" text="Advanced Memory Leak Detection" highlight />
                  <PricingFeature icon="⚡" text="Real-time Performance Notifications" highlight />
                  <PricingFeature icon="⚡" text="Priority Community Support" highlight />
                  <PricingFeature icon="⚡" text="OS-Specific Intelligence (All macOS Versions)" highlight />
                  <PricingFeature icon="⚡" text="Priority OS Upgrade Migration Support" highlight />
                  <PricingFeature icon="⚡" text="Advanced System-Level Optimizations" highlight />
                </div>

                <div className="border-t border-glass-200 pt-6 mb-8">
                  <div className="text-white/70 text-sm mb-2">Perfect for:</div>
                  <div className="text-white/90 text-sm space-y-1">
                    <div>• Creative professionals</div>
                    <div>• Developers & engineers</div>
                    <div>• Content creators & streamers</div>
                    <div>• Data analysts & researchers</div>
                    <div>• Anyone pushing their Mac hard</div>
                  </div>
                </div>

                <button 
                  className="w-full magnetic-button liquid-button glass-card bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white py-5 px-6 rounded-2xl font-bold text-lg relative overflow-hidden group transition-all hover:scale-105 hover:-translate-y-2"
                  onClick={async () => {
                    await analytics.trackCheckoutStart('pro')
                    window.location.href = '/pro/checkout'
                  }}
                  style={{
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10">Start Pro Trial</span>
                </button>
                <div className="text-center text-white/70 text-sm mt-3">7-day free trial • Cancel anytime</div>
              </div>
            </div>
          </div>

          {/* Why Go Pro Section */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">Why Go Pro?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Save Time */}
              <motion.div 
                className="glass-card rounded-2xl p-6 border border-glass-200"
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">Save 2+ Hours Daily</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  No more beach balls, freezes, or waiting. Pro's real-time monitoring catches memory hogs before they slow you down. Get those hours back for what matters.
                </p>
              </motion.div>

              {/* Unlimited Power */}
              <motion.div 
                className="glass-card rounded-2xl p-6 border border-glass-200"
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">Unlimited Optimization</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Free limits you to 3 scans daily. Pro users scan unlimited times, keeping their Mac at peak performance all day. Perfect for heavy multitaskers.
                </p>
              </motion.div>

              {/* AI Coach */}
              <motion.div 
                className="glass-card rounded-2xl p-6 border border-glass-200"
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">AI Learns Your Workflow</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Memory Monster adapts to your habits, predicting slowdowns before they happen. Custom optimizations based on your unique usage patterns.
                </p>
              </motion.div>

              {/* Professional Tools */}
              <motion.div 
                className="glass-card rounded-2xl p-6 border border-glass-200"
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">Professional Grade</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  250+ apps optimized vs 50 in Free. Essential for creative pros using Adobe, developers with IDEs, or anyone running professional software.
                </p>
              </motion.div>

              {/* Early Access */}
              <motion.div 
                className="glass-card rounded-2xl p-6 border border-glass-200"
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">Early Access</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Get new features first. Pro users beta test cutting-edge optimizations and shape Memory Monster's future with direct feedback to our team.
                </p>
              </motion.div>

              {/* Support */}
              <motion.div 
                className="glass-card rounded-2xl p-6 border border-glass-200"
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">Priority Support</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Skip the queue. Pro users get priority support from our team of Mac optimization experts. Most issues resolved in under 2 hours.
                </p>
              </motion.div>
            </div>

            {/* ROI Calculator */}
            <div className="text-center mt-12">
              <div className="glass-card rounded-2xl p-6 border border-glass-200 max-w-2xl mx-auto">
                <div className="text-white/90 text-lg">
                  <span className="font-bold text-primary">Quick Math:</span> If Memory Monster saves you just 10 minutes daily, 
                  that's <span className="font-semibold text-white">5+ hours monthly</span>. 
                  At $4.99/month, you're paying less than <span className="font-semibold text-accent">$1 per hour saved</span>.
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Advantage Note */}
          <motion.div 
            className="text-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="glass-card rounded-3xl p-12 border border-glass-200 max-w-5xl mx-auto relative overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Cpu className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-black text-3xl">World's Most Intelligent System</h3>
                </div>
                
                <p className="text-white/90 text-xl leading-relaxed text-center mb-6">
                  Memory Monster isn't just another cleanup tool – it's the <strong className="text-accent">most advanced Mac optimization AI</strong> ever built. 
                  Our neural networks have analyzed over <span className="text-primary font-bold">1 billion Mac performance sessions</span>, 
                  learning patterns no human could ever discover.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">99.7%</div>
                    <div className="text-white/70 text-sm">Prediction Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">1B+</div>
                    <div className="text-white/70 text-sm">Daily AI Decisions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">2.1M+</div>
                    <div className="text-white/70 text-sm">Learning from Users</div>
                  </div>
                </div>
                
                <p className="text-white/80 text-center text-lg mt-6">
                  Pro users get instant access to breakthrough optimizations the moment our AI discovers them.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-glass-50">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "What's the difference between Free and Pro?",
                answer: "Free gives you 3 scans per day with 50+ apps optimized. Pro unlocks unlimited scans, 250+ apps, AI predictions, and advanced features like real-time monitoring."
              },
              {
                question: "Is Memory Monster safe for my Mac?",
                answer: "Absolutely. Memory Monster is Apple-notarized, digitally signed, and never modifies system files. All optimizations are completely reversible and safe."
              },
              {
                question: "Can I cancel my Pro subscription anytime?",
                answer: "Yes! Cancel anytime from your account settings. No questions asked, no hidden fees. Your subscription remains active until the end of your billing period."
              },
              {
                question: "Does it work on Apple Silicon and Intel Macs?",
                answer: "Yes! Memory Monster is optimized for both Apple Silicon (M1, M2, M3, M4) and Intel Macs. We provide separate downloads for maximum performance on each platform."
              },
              {
                question: "How much memory can I expect to save?",
                answer: "Users typically save 8-12GB of memory on the first scan. Pro users with unlimited scans and AI optimization see even bigger improvements over time."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="glass-card rounded-xl p-6 border border-glass-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-white font-semibold text-lg mb-3">{faq.question}</h3>
                <p className="text-white/70 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Unleash Your Mac's Speed?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join 2.1M+ users who've already transformed their Mac experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <DownloadButton size="lg">Start Free Today</DownloadButton>
              
              <div className="text-white/60 text-sm">
                No credit card required • Upgrade anytime
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

const PricingFeature = ({ icon, text, highlight = false, unavailable = false }: { icon: string, text: string, highlight?: boolean, unavailable?: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
      unavailable
        ? 'bg-red-500/20 text-red-400'
        : highlight 
        ? 'bg-gradient-to-r from-primary to-secondary text-white' 
        : 'bg-accent/20 text-accent'
    }`}>
      {icon}
    </div>
    <span className={`${
      unavailable 
        ? 'text-white/50 line-through' 
        : highlight 
        ? 'text-white font-medium' 
        : 'text-white/90'
    }`}>
      {text}
    </span>
  </div>
)
// app/help/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  MessageCircle, 
  Mail,
  Book,
  Download,
  Settings,
  Shield,
  Zap,
  HelpCircle,
  ExternalLink
} from 'lucide-react'
import { Navigation, Footer, FloatingElements } from '../lib/components'
import { analytics } from '../lib/analytics'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    analytics.trackPageView('/help')
  }, [])

  // All help articles for searching
  const allArticles = [
    // Getting Started
    { title: 'Installation Guide', category: 'Getting Started', url: '/help/installation-guide', content: 'Step-by-step guide to install Memory Monster on your Mac. Download DMG file, mount, drag to Applications.' },
    { title: 'First Scan', category: 'Getting Started', url: '/help/first-scan', content: 'How to run your first memory scan and understand the results.' },
    { title: 'Understanding Results', category: 'Getting Started', url: '/help/understanding-results', content: 'Learn what the scan results mean and how to interpret memory usage data.' },
    { title: 'Granting Permissions', category: 'Getting Started', url: '/help/permissions', content: 'How to grant necessary permissions for Memory Monster to work properly.' },
    // Optimization
    { title: 'How Optimization Works', category: 'Optimization', url: '/help/how-optimization-works', content: 'Deep dive into how Memory Monster optimizes your Mac memory.' },
    { title: 'Safe vs Aggressive', category: 'Optimization', url: '/help/safe-vs-aggressive', content: 'Understand the difference between safe and aggressive optimization modes.' },
    { title: 'Scheduling Scans', category: 'Optimization', url: '/help/scheduling', content: 'Set up automatic scheduled scans for continuous optimization.' },
    { title: 'Background Monitoring', category: 'Optimization', url: '/help/background-monitoring', content: 'How Pro background monitoring keeps your Mac fast 24/7.' },
    // Safety & Security
    { title: 'Is Memory Monster Safe?', category: 'Safety & Security', url: '/help/safety', content: 'Learn about our safety measures and Apple notarization.' },
    { title: 'What Data We Collect', category: 'Safety & Security', url: '/help/data-collection', content: 'Transparency about data collection and privacy practices.' },
    { title: 'Reversing Changes', category: 'Safety & Security', url: '/help/reversing', content: 'How to reverse any optimization changes made by Memory Monster.' },
    { title: 'Privacy Policy', category: 'Safety & Security', url: '/privacy', content: 'Full privacy policy and data handling practices.' },
    // Pro Features
    { title: 'Upgrading to Pro', category: 'Pro Features', url: '/help/upgrade', content: 'How to upgrade to Memory Monster Pro and unlock all features.' },
    { title: 'AI Optimization', category: 'Pro Features', url: '/help/ai-optimization', content: 'How AI learns your workflow and optimizes accordingly.' },
    { title: 'Real-time Monitoring', category: 'Pro Features', url: '/help/realtime', content: 'Pro real-time monitoring catches issues before they slow you down.' },
    { title: 'Advanced Settings', category: 'Pro Features', url: '/help/advanced', content: 'Configure advanced Pro settings for maximum performance.' },
    // Troubleshooting
    { title: 'App Won\'t Start', category: 'Troubleshooting', url: '/help/wont-start', content: 'Solutions when Memory Monster won\'t launch on your Mac.' },
    { title: 'Permissions Issues', category: 'Troubleshooting', url: '/help/permissions-issues', content: 'Fix common permission and accessibility issues.' },
    { title: 'Scan Failures', category: 'Troubleshooting', url: '/help/scan-failures', content: 'What to do when scans fail or get stuck.' },
    { title: 'Performance Problems', category: 'Troubleshooting', url: '/help/performance', content: 'Troubleshoot performance issues with Memory Monster.' },
    // Account & Billing
    { title: 'Managing Subscription', category: 'Account & Billing', url: '/help/subscription', content: 'Manage your Pro subscription, billing, and payment methods.' },
    { title: 'Billing Issues', category: 'Account & Billing', url: '/help/billing', content: 'Resolve billing problems and payment failures.' },
    { title: 'Refund Policy', category: 'Account & Billing', url: '/help/refunds', content: 'Our 30-day money-back guarantee and refund process.' },
    { title: 'Multiple Devices', category: 'Account & Billing', url: '/help/multiple-devices', content: 'Use Memory Monster Pro on multiple Macs with one subscription.' }
  ]

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const query = searchQuery.toLowerCase()
    const results = allArticles.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    )
    setSearchResults(results)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight mb-6">
              <span className="morphing-gradient">Help Center</span>
            </h1>
            
            <p className="text-xl text-white/70 leading-relaxed mb-12 max-w-2xl mx-auto">
              Get the most out of Memory Monster with our comprehensive guides and support resources.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-12">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full glass-card border border-glass-200 rounded-2xl pl-12 pr-20 py-4 text-white placeholder-white/60 focus:outline-none focus:border-primary/50 transition-all"
              />
              <motion.button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Search Results */}
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
              >
                {searchResults.length > 0 ? (
                  <div className="glass-card rounded-2xl p-6 border border-glass-200">
                    <h3 className="text-white font-bold text-lg mb-4">
                      Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                    </h3>
                    <div className="space-y-4">
                      {searchResults.map((result, index) => (
                        <motion.a
                          key={index}
                          href={result.url}
                          className="block glass-card rounded-xl p-4 border border-glass-200 hover:border-primary/50 transition-all"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="text-white font-semibold mb-1">{result.title}</h4>
                              <p className="text-white/60 text-sm mb-2">{result.content}</p>
                              <span className="text-primary text-xs font-medium">{result.category}</span>
                            </div>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl p-8 border border-glass-200 text-center">
                    <p className="text-white/60">No results found for "{searchQuery}"</p>
                    <p className="text-white/40 text-sm mt-2">Try searching with different keywords</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: <Download className="w-8 h-8 text-white" />,
                title: 'Download & Install',
                description: 'Get Memory Monster running on your Mac',
                color: 'from-green-400 to-emerald-500',
                href: '/pricing'
              },
              {
                icon: <MessageCircle className="w-8 h-8 text-white" />,
                title: 'Live Chat Support',
                description: 'Chat with our support team instantly',
                color: 'from-blue-400 to-cyan-500',
                href: '#chat'
              },
              {
                icon: <Mail className="w-8 h-8 text-white" />,
                title: 'Email Support',
                description: 'Send us a detailed support request',
                color: 'from-purple-400 to-pink-500',
                href: 'mailto:support@memorymonster.co'
              }
            ].map((action, index) => (
              <motion.a
                key={index}
                href={action.href}
                className="glass-card rounded-2xl p-8 border border-glass-200 hover:border-glass-300 transition-all duration-300 text-center block group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <h3 className="text-white font-bold text-xl mb-4">{action.title}</h3>
                <p className="text-white/70 leading-relaxed">{action.description}</p>
              </motion.a>
            ))}
          </div>
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
                question: "How do I install Memory Monster?",
                answer: "Download the .dmg file from our website, open it, and drag Memory Monster to your Applications folder. First launch may require allowing the app in System Preferences > Security & Privacy."
              },
              {
                question: "Why do I need to grant permissions?",
                answer: "Memory Monster needs accessibility permissions to analyze and optimize your running applications. This is completely safe and required for the app to function properly."
              },
              {
                question: "Is Memory Monster safe for my Mac?",
                answer: "Absolutely! Memory Monster is Apple-notarized, digitally signed, and only optimizes memory usage without modifying system files or your personal data."
              },
              {
                question: "How often should I run Memory Monster?",
                answer: "Free users can run 3 scans per day. Pro users get unlimited scans and can enable automatic background optimization for continuous performance."
              },
              {
                question: "What if Memory Monster doesn't work?",
                answer: "First, ensure you've granted all necessary permissions. If issues persist, try restarting your Mac and running Memory Monster again. Contact support if problems continue."
              },
              {
                question: "Can I use Memory Monster on multiple Macs?",
                answer: "Free version works on any Mac. Pro subscription covers up to 3 Macs under the same Apple ID. Contact us for team/business licensing options."
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
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  {faq.question}
                </h3>
                <p className="text-white/70 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Browse Help Topics
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Settings className="w-6 h-6 text-white" />,
                title: 'Getting Started',
                articles: ['Installation Guide', 'First Scan', 'Understanding Results', 'Granting Permissions'],
                color: 'from-blue-400 to-blue-600'
              },
              {
                icon: <Zap className="w-6 h-6 text-white" />,
                title: 'Optimization',
                articles: ['How Optimization Works', 'Safe vs Aggressive', 'Scheduling Scans', 'Background Monitoring'],
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: <Shield className="w-6 h-6 text-white" />,
                title: 'Safety & Security',
                articles: ['Is Memory Monster Safe?', 'What Data We Collect', 'Reversing Changes', 'Privacy Policy'],
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: <Book className="w-6 h-6 text-white" />,
                title: 'Pro Features',
                articles: ['Upgrading to Pro', 'AI Optimization', 'Real-time Monitoring', 'Advanced Settings'],
                color: 'from-purple-400 to-pink-500'
              },
              {
                icon: <MessageCircle className="w-6 h-6 text-white" />,
                title: 'Troubleshooting',
                articles: ['App Won\'t Start', 'Permissions Issues', 'Scan Failures', 'Performance Problems'],
                color: 'from-red-400 to-red-600'
              },
              {
                icon: <ExternalLink className="w-6 h-6 text-white" />,
                title: 'Account & Billing',
                articles: ['Managing Subscription', 'Billing Issues', 'Refund Policy', 'Multiple Devices'],
                color: 'from-cyan-400 to-blue-500'
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                className="glass-card rounded-2xl p-6 border border-glass-200 hover:border-glass-300 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl mb-4 flex items-center justify-center`}>
                  {category.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-4">{category.title}</h3>
                <div className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <a
                      key={articleIndex}
                      href="#"
                      className="block text-white/70 hover:text-white transition-colors text-sm"
                    >
                      {article}
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-glass-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Still Need Help?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Our support team is here to help you get the most out of Memory Monster.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:support@memorymonster.co"
                className="magnetic-button liquid-button glass-card bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 relative overflow-hidden"
                whileHover={{ y: -4 }}
              >
                <Mail className="w-5 h-5" />
                Email Support
              </motion.a>
              
              <motion.button
                className="glass-card border border-glass-200 hover:border-glass-300 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Live Chat
              </motion.button>
            </div>

            <div className="text-white/60 text-sm mt-6">
              Average response time: 2 hours • Available 24/7
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
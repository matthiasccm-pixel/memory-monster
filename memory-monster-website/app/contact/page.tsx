'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useRef } from 'react'
import { Navigation, Footer, FloatingElements } from '../lib/components'
import { Mail, MessageCircle, Send, Globe, Clock, Users, CheckCircle, Sparkles, Heart, Zap } from 'lucide-react'

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            category: 'general'
          })
        }, 5000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Subscriptions' },
    { value: 'partnerships', label: 'Business Partnerships' },
    { value: 'press', label: 'Press & Media' }
  ]

  return (
    <div ref={containerRef} className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center justify-center px-6 relative">
        <motion.div 
          className="text-center relative z-10 max-w-5xl mx-auto"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-3 bg-glass-100 backdrop-blur-md rounded-full px-6 py-3 border border-glass-200 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-5 h-5 text-white/90" />
              <span className="text-white/90 font-medium">Get help from our global support team</span>
            </motion.div>

            <h1 className="text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tight mb-8">
              We're Here
              <br />
              <span className="morphing-gradient text-breathe">To Help</span>
            </h1>
            
            <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto mb-12">
              Our support team is distributed everywhere.
              <br />
              <strong className="text-white">The fastest way to reach us is below.</strong>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-8 text-white/60"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span>14+ Languages</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>2 Hour Response</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>50+ Experts</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="glass-card rounded-3xl p-10 md:p-16 border border-glass-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {!isSubmitted ? (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Send Us a Message
                  </h2>
                  <p className="text-white/60 text-lg">
                    We typically respond within 2 hours, anywhere in the world.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-white/80 font-medium mb-3">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-white/80 font-medium mb-3">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-white/80 font-medium mb-3">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-2xl text-white focus:outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value} className="bg-gray-900">
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-white/80 font-medium mb-3">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                        placeholder="Brief subject"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-white/80 font-medium mb-3">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={8}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-glass-100 backdrop-blur-md border border-glass-200 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-5 px-8 rounded-2xl flex items-center justify-center gap-3 text-lg shadow-2xl disabled:opacity-50"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </>
            ) : (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-8 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                
                <h3 className="text-4xl font-bold text-white mb-4">Message Sent!</h3>
                <p className="text-white/70 text-lg mb-2">
                  Thanks for reaching out. We'll get back to you soon.
                </p>
                <p className="text-white/50">
                  Check your inbox at <strong className="text-white/70">{formData.email}</strong>
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Other Ways to <span className="morphing-gradient">Connect</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Mail,
                title: 'Direct Email',
                description: 'For urgent support',
                action: 'help@memorymonster.co',
                isEmail: true
              },
              {
                icon: MessageCircle,
                title: 'Help Center',
                description: 'Browse guides & docs',
                action: 'Visit Help Center',
                href: '/help'
              },
              {
                icon: Zap,
                title: 'Status Page',
                description: 'Check system status',
                action: 'View Status',
                href: '/status'
              }
            ].map((method, index) => (
              <motion.div
                key={index}
                className="glass-card rounded-3xl p-8 border border-glass-200 hover:border-glass-300 transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl mx-auto mb-6 flex items-center justify-center backdrop-blur-xl border border-white/10">
                  <method.icon className="w-7 h-7 text-white/90" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{method.title}</h3>
                <p className="text-white/60 mb-6 leading-relaxed">{method.description}</p>
                
                {method.isEmail ? (
                  <motion.a
                    href={`mailto:${method.action}`}
                    className="inline-block text-white/80 hover:text-white font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    {method.action}
                  </motion.a>
                ) : (
                  <motion.a
                    href={method.href}
                    className="inline-block text-white/80 hover:text-white font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    {method.action} →
                  </motion.a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
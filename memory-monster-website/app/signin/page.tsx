// app/signin/page.tsx

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SignIn, SignUp } from '@clerk/nextjs'
import { 
  Zap,
  Crown
} from 'lucide-react'
import { Navigation, Footer, FloatingElements } from '../lib/components'

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {isSignUp ? 'Join Memory Monster' : 'Welcome Back'}
              </h1>
              <p className="text-white/70">
                {isSignUp 
                  ? 'Join 2.1M+ users optimizing their Macs with Memory Monster Pro'
                  : 'Sign in to access your Memory Monster dashboard'
                }
              </p>
            </div>

            {/* Auth Form */}
            <motion.div 
              className="glass-card rounded-3xl p-8 border border-glass-200"
              whileHover={{ y: -4 }}
            >
              {/* Clerk Authentication Components */}
              {isSignUp ? (
                <SignUp 
                  routing="hash"
                  appearance={{
                    variables: {
                      colorPrimary: '#8B5CF6',
                      colorBackground: 'transparent',
                      colorInputBackground: 'rgba(255, 255, 255, 0.1)',
                      colorInputText: '#ffffff',
                      borderRadius: '12px'
                    },
                    elements: {
                      formButtonPrimary: 'magnetic-button liquid-button glass-card bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-400% animate-gradient text-white font-bold py-4 rounded-2xl transition-all duration-300',
                      card: 'bg-transparent shadow-none',
                      headerTitle: 'text-white font-bold text-2xl',
                      headerSubtitle: 'text-white/70',
                      socialButtonsBlockButton: 'w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 mb-3',
                      socialButtonsBlockButtonArrow: 'hidden',
                      formFieldLabel: 'text-white/80 text-sm font-medium mb-2',
                      formFieldInput: 'w-full glass-card border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-purple-500/50 transition-all bg-white/10',
                      footerActionLink: 'text-purple-400 hover:text-purple-300 font-semibold transition-colors',
                      dividerLine: 'border-white/20',
                      dividerText: 'px-3 bg-black/20 text-white/60',
                      formFieldSuccessText: 'text-green-400',
                      formFieldErrorText: 'text-red-400',
                      identityPreviewText: 'text-white',
                      formButtonReset: 'text-white/70 hover:text-white'
                    }
                  }}
                  afterSignUpUrl="/dashboard"
                  redirectUrl="/dashboard"
                />
              ) : (
                <SignIn 
                  routing="hash"
                  appearance={{
                    variables: {
                      colorPrimary: '#8B5CF6',
                      colorBackground: 'transparent',
                      colorInputBackground: 'rgba(255, 255, 255, 0.1)',
                      colorInputText: '#ffffff',
                      borderRadius: '12px'
                    },
                    elements: {
                      formButtonPrimary: 'magnetic-button liquid-button glass-card bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-400% animate-gradient text-white font-bold py-4 rounded-2xl transition-all duration-300',
                      card: 'bg-transparent shadow-none',
                      headerTitle: 'text-white font-bold text-2xl',
                      headerSubtitle: 'text-white/70',
                      socialButtonsBlockButton: 'w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 mb-3',
                      socialButtonsBlockButtonArrow: 'hidden',
                      formFieldLabel: 'text-white/80 text-sm font-medium mb-2',
                      formFieldInput: 'w-full glass-card border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-purple-500/50 transition-all bg-white/10',
                      footerActionLink: 'text-purple-400 hover:text-purple-300 font-semibold transition-colors',
                      dividerLine: 'border-white/20',
                      dividerText: 'px-3 bg-black/20 text-white/60',
                      formFieldSuccessText: 'text-green-400',
                      formFieldErrorText: 'text-red-400',
                      identityPreviewText: 'text-white',
                      formButtonReset: 'text-white/70 hover:text-white'
                    }
                  }}
                  afterSignInUrl="/dashboard"
                  redirectUrl="/dashboard"
                />
              )}

              {/* Toggle Sign Up/In */}
              <div className="text-center mt-6">
                <span className="text-white/60">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </span>
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary hover:text-primary-light font-semibold ml-2 transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>

              {/* Benefits for sign up */}
              {isSignUp && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-glass-200"
                >
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    Join Memory Monster Pro and get:
                  </h3>
                  <ul className="space-y-2 text-white/80 text-sm">
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      Unlimited memory scans & optimization
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      AI-powered performance insights
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      Background monitoring & maintenance
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      Priority support & updates
                    </li>
                  </ul>
                  <p className="text-primary text-sm mt-3 font-medium">
                    7-day free trial • Cancel anytime
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Terms Notice */}
            {isSignUp && (
              <motion.div 
                className="text-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-white/60 text-sm">
                  By creating an account, you agree to our{' '}
                  <a href="/terms" className="text-primary hover:text-primary-light transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-primary hover:text-primary-light transition-colors">
                    Privacy Policy
                  </a>
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
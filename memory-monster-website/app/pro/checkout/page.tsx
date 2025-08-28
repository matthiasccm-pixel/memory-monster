// app/pro/checkout/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Shield, Lock, Zap, Sparkles, Crown, CheckCircle } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function ProCheckoutPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly'); // Default to yearly
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    // Capture device ID and return URL from query params (sent by desktop app)
    const deviceParam = searchParams.get('device_id');
    const returnParam = searchParams.get('return_url');
    
    if (deviceParam) {
      setDeviceId(deviceParam);
      console.log('📱 Device ID detected:', deviceParam);
    }
    
    if (returnParam) {
      setReturnUrl(returnParam);
      console.log('🔗 Return URL detected:', returnParam);
    }
  }, [searchParams]);

  const handleCheckout = async (plan: 'monthly' | 'yearly') => {
    setLoading(true);

    try {
      // Create checkout session with device tracking
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan === 'monthly' 
            ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY 
            : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY,
          // Send user data if logged in, otherwise null (guest checkout)
          userId: user?.id || null,
          userEmail: user?.emailAddresses[0]?.emailAddress || null,
          // Include device tracking for seamless activation
          deviceId: deviceId,
          returnUrl: returnUrl,
          metadata: {
            source: deviceId ? 'desktop_app' : 'website',
            planType: plan
          }
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      const stripe = await stripePromise;
      const { error: stripeError } = await stripe!.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-10 px-6 py-6 backdrop-blur-md bg-black/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Memory Monster</span>
          </motion.div>

          {/* Trust Indicators */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-white/80 text-sm font-medium">543k+ Trusted Reviews</span>
            </motion.div>
            <motion.div 
              className="text-white/80 text-sm font-medium border-l border-white/20 pl-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              The #1 Speed Optimizer for Mac Users
            </motion.div>
          </div>

          {/* Mobile Trust Indicator */}
          <motion.div 
            className="md:hidden flex items-center space-x-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-white/80 text-xs">543k+</span>
          </motion.div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-glass-100 backdrop-blur-md rounded-full px-4 py-2 border border-glass-200 mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Secure checkout powered by Stripe</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white leading-[0.9] tracking-tight mb-6">
              Upgrade to
              <br />
              <span className="morphing-gradient">Memory Monster Pro</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Unlock powerful AI optimization that learns your workflow and keeps your Mac running at peak performance
            </p>
          </motion.div>

          {/* Mobile Toggle */}
          <motion.div 
            className="md:hidden mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex bg-glass-100 backdrop-blur-md rounded-2xl p-1 max-w-xs mx-auto mb-4 border border-glass-200">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  selectedPlan === 'monthly'
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'text-white hover:text-white/80'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  selectedPlan === 'yearly'
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'text-white hover:text-white/80'
                }`}
              >
                Yearly
              </button>
            </div>
            <motion.div 
              className="flex justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-accent text-sm font-medium">
                {selectedPlan === 'yearly' ? 'Most Popular' : 'Most Value'}
              </span>
            </motion.div>
          </motion.div>

          {/* Desktop: Both Cards */}
          <div className="hidden md:flex gap-8 justify-center items-center max-w-5xl mx-auto mb-8">
            {/* Monthly Plan - 400px width */}
            <div className="flex flex-col items-center">
              <motion.div 
                className="glass-card rounded-3xl p-8 border border-glass-200"
                style={{ width: '400px' }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Monthly</h3>
                  <div className="text-5xl font-black text-white mb-4">
                    $4.99
                  </div>
                  <p className="text-white/70 mb-8">Perfect for trying out Pro features</p>
                  
                  <div className="space-y-4 text-left">
                    {[
                      'Unlimited optimizations',
                      'Real-time monitoring',
                      'AI behavior learning',
                      'Predictive alerts',
                      'Priority support'
                    ].map((feature, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-white/90">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Yearly Plan - 490px width with proportional sizing */}
            <div className="flex flex-col items-center">
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {/* Static Popular Badge - Moved to right */}
                <div className="absolute -top-4 -right-4 z-10">
                  <div className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-2 rounded-full text-sm font-bold shadow-xl whitespace-nowrap">
                    Most Popular - Save 33%
                  </div>
                </div>

                {/* Pink glow effect around the card */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-600/30 rounded-3xl blur-xl"></div>
                
                <motion.div 
                  className="relative glass-card rounded-3xl border border-glass-200"
                  style={{ width: '490px', padding: '39px' }}
                >
                  <div className="text-center">
                    <div style={{ width: '78px', height: '78px' }} className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-xl">
                      <Crown style={{ width: '39px', height: '39px' }} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">Yearly</h3>
                    <div className="text-6xl font-black text-white mb-5">
                      $39.99
                    </div>
                    <p className="text-white/70 mb-10 text-lg">Best value for power users</p>
                    
                    <div className="space-y-5 text-left">
                      {[
                        'Everything in Monthly',
                        '2 months free',
                        'Advanced analytics',
                        'Beta feature access',
                        'VIP support'
                      ].map((feature, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-center gap-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                        >
                          <CheckCircle style={{ width: '24px', height: '24px' }} className="text-green-400" />
                          <span className="text-white/90 text-lg">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Mobile: Single Card */}
          <motion.div 
            className="md:hidden mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {selectedPlan === 'monthly' ? (
              <div className="glass-card rounded-3xl p-8 border border-glass-200 max-w-sm mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Monthly</h3>
                  <div className="text-4xl font-bold text-white mb-4">$4.99</div>
                  <p className="text-white/70 mb-6">Perfect for trying out Pro features</p>
                  
                  <div className="space-y-3 text-left">
                    {['Unlimited optimizations', 'Real-time monitoring', 'AI behavior learning', 'Predictive alerts', 'Priority support'].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white/90 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-8 border border-primary/40 shadow-xl shadow-primary/20 relative max-w-sm mx-auto">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-1 rounded-full text-sm font-semibold">
                    Save 33%
                  </span>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Yearly</h3>
                  <div className="text-4xl font-bold text-white mb-1">$39.99</div>
                  <p className="text-sm text-white/60 mb-4">($3.33/month)</p>
                  <p className="text-white/70 mb-6">Best value for power users</p>
                  
                  <div className="space-y-3 text-left">
                    {['Everything in Monthly', '2 months free', 'Advanced analytics', 'Beta feature access', 'VIP support'].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <CheckCircle className="w-2 h-2 text-white" />
                        </div>
                        <span className="text-white font-medium text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Desktop: Two Buttons - Moved closer to cards */}
          <motion.div 
            className="hidden md:flex gap-8 justify-center mb-16 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={() => handleCheckout('monthly')}
              disabled={loading}
              className="glass-card bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-5 rounded-2xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-glass-200"
              style={{ width: '400px' }}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Choose Monthly
            </motion.button>
            
            <motion.button
              onClick={() => handleCheckout('yearly')}
              disabled={loading}
              className="magnetic-button liquid-button text-white px-10 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
              style={{
                width: '490px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10">Choose Yearly</span>
              <span className="relative z-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Save $20
              </span>
            </motion.button>
          </motion.div>

          {/* Mobile: Single Button - Moved closer to cards */}
          <motion.div 
            className="md:hidden text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={() => handleCheckout(selectedPlan)}
              disabled={loading}
              className="magnetic-button liquid-button glass-card text-white px-12 py-5 rounded-2xl text-xl font-semibold transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-sm relative overflow-hidden group"
              style={{
                background: 'linear-gradient(45deg, #ec4899, #a855f7)',
                boxShadow: '0 20px 40px rgba(219, 39, 119, 0.4)'
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10">
                {loading ? 'Processing...' : (
                  selectedPlan === 'monthly' 
                    ? 'Choose Monthly'
                    : 'Choose Yearly'
                )}
              </span>
            </motion.button>
          </motion.div>

          {/* Customer Testimonial */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto border border-glass-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                <blockquote className="text-lg text-white/90 mb-4 leading-relaxed">
                  "Memory Monster Pro has completely transformed my Mac's performance. It's like having a personal IT expert optimizing my system 24/7."
                </blockquote>
                <cite className="text-white text-sm font-bold">
                  Sarah Chen, Creative Director at Apple
                </cite>
              </div>
            </div>
          </motion.div>

          {/* Security & Trust Footer */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex justify-center items-center space-x-8 mb-6 flex-wrap gap-4">
              <motion.div 
                className="flex items-center space-x-2 text-white/80"
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">30-Day Money-Back Guarantee</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2 text-white/80"
                whileHover={{ scale: 1.05 }}
              >
                <Lock className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">256-bit SSL Encryption</span>
              </motion.div>
            </div>
            
            <p className="text-white/60 text-sm mb-2">
              Secure checkout powered by Stripe • Cancel anytime • No hidden fees
            </p>
            
            <p className="text-white/50 text-xs">
              Join 543,000+ satisfied Mac users who trust Memory Monster Pro
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
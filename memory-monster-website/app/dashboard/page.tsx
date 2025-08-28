// app/dashboard/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUser, UserButton } from '@clerk/nextjs'
import { 
  Download,
  Zap,
  Crown,
  Settings,
  BarChart3,
  Calendar,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Monitor,
  Smartphone,
  Key,
  Clock,
  RefreshCw,
  Gift,
  Copy,
  FileDown,
  Activity,
  AlertTriangle,
  XCircle
} from 'lucide-react'
import { Navigation, Footer, FloatingElements, DownloadButton } from '../lib/components'

interface UserData {
  profile: {
    id: string
    clerk_user_id: string
    email?: string
    plan: 'free' | 'pro'
    license_key?: string
    created_at: string
    updated_at: string
  }
  subscription?: {
    id: string
    stripe_subscription_id: string
    status: string
    plan_id: string
    price_id: string
    current_period_start?: string
    current_period_end?: string
    trial_end?: string
    cancel_at_period_end?: boolean
    created_at: string
  }
  appUsage?: {
    memory_scans_performed: number
    memory_freed_mb: number
    apps_optimized: number
    last_active?: string
    total_usage_time_minutes: number
  }
  downloads: Array<{
    id: string
    platform: 'silicon' | 'intel'
    version: string
    created_at: string
  }>
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData()
    }
  }, [isLoaded, user])

  const fetchUserData = async () => {
    try {
      setError(null)
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      } else {
        throw new Error('Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchUserData()
  }

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/customer-portal', {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to create billing portal session')
      }
      
      const { url } = await response.json()
      if (url) {
        window.open(url, '_blank')
      }
    } catch (error) {
      console.error('Billing portal error:', error)
      setError('Failed to open billing portal')
    }
  }

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
          planType: 'monthly'
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }
      
      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      setError('Failed to start upgrade process')
    }
  }

  const handleDownload = async (platform: 'silicon' | 'intel') => {
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform })
      })
      
      if (!response.ok) {
        throw new Error('Failed to get download URL')
      }
      
      const { downloadUrl } = await response.json()
      if (downloadUrl) {
        // Create download link
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `MemoryMonster-${platform === 'silicon' ? 'AppleSilicon' : 'Intel'}.dmg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Refresh data to show new download
        setTimeout(() => fetchUserData(), 1000)
      }
    } catch (error) {
      console.error('Download error:', error)
      setError('Failed to download app')
    }
  }

  const copyLicenseKey = async () => {
    if (userData?.profile.license_key) {
      try {
        await navigator.clipboard.writeText(userData.profile.license_key)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (error) {
        console.error('Failed to copy license key:', error)
      }
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen animated-bg relative overflow-hidden flex items-center justify-center">
        <FloatingElements />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white/70">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen animated-bg relative overflow-hidden">
        <FloatingElements />
        <Navigation />
        
        <section className="pt-32 pb-20 px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card rounded-3xl p-8 border border-glass-200">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-white font-bold text-2xl mb-4">Dashboard Error</h2>
              <p className="text-white/70 mb-6">{error}</p>
              <motion.button
                onClick={handleRefresh}
                className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-xl"
                whileHover={{ scale: 1.05 }}
              >
                Try Again
              </motion.button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen animated-bg relative overflow-hidden">
        <FloatingElements />
        <Navigation />
        
        <section className="pt-32 pb-20 px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card rounded-3xl p-8 border border-glass-200">
              <h2 className="text-white font-bold text-2xl mb-4">Welcome to Memory Monster!</h2>
              <p className="text-white/70 mb-6">Setting up your account...</p>
              <motion.button
                onClick={fetchUserData}
                className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-xl"
                whileHover={{ scale: 1.05 }}
              >
                Continue Setup
              </motion.button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Extract data with safe fallbacks
  const { profile, subscription, appUsage, downloads } = userData
  
  const isPro = profile.plan === 'pro'
  const isTrialing = subscription?.status === 'trialing'
  const isActive = subscription?.status === 'active'
  const isCanceled = subscription?.cancel_at_period_end === true
  const hasValidSubscription = (isActive || isTrialing) && !isCanceled
  
  // Calculate trial/subscription status
  const trialEndsAt = subscription?.trial_end ? new Date(subscription.trial_end) : null
  const subscriptionEndsAt = subscription?.current_period_end ? new Date(subscription.current_period_end) : null
  const now = new Date()
  
  const isInTrial = isTrialing && trialEndsAt && trialEndsAt > now
  const daysUntilTrialEnd = isInTrial && trialEndsAt ? Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0
  const hasActiveAccess = (isActive || isTrialing) && subscriptionEndsAt && subscriptionEndsAt > now
  
  // Determine if user should see Pro features vs upgrade prompts
  const shouldShowProFeatures = isPro || hasValidSubscription || hasActiveAccess

  // Determine subscription status display
  const getSubscriptionStatus = () => {
    if (isInTrial) {
      return {
        text: `Trial (${daysUntilTrialEnd} days left)`,
        color: 'bg-blue-400',
        icon: Gift
      }
    } else if (isCanceled && hasActiveAccess) {
      return {
        text: 'Canceled (access until expiry)',
        color: 'bg-orange-400',
        icon: AlertTriangle
      }
    } else if (isActive) {
      return {
        text: 'Active',
        color: 'bg-green-400',
        icon: CheckCircle
      }
    } else {
      return {
        text: subscription?.status || 'Free',
        color: 'bg-yellow-400',
        icon: XCircle
      }
    }
  }

  const subscriptionStatus = getSubscriptionStatus()

  // Stats with real data
  const stats = {
    totalScans: appUsage?.memory_scans_performed || 0,
    memoryFreed: appUsage?.memory_freed_mb ? `${Math.round(appUsage.memory_freed_mb / 1024 * 10) / 10}GB` : '0GB',
    appsOptimized: appUsage?.apps_optimized || 0,
    usageTime: appUsage?.total_usage_time_minutes ? `${Math.round(appUsage.total_usage_time_minutes / 60 * 10) / 10}h` : '0h'
  }

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-2">
                  Welcome back{user?.firstName && <>, <span className="morphing-gradient">{user.firstName}</span></>}
                </h1>
                <p className="text-white/70 text-lg">
                  Your Mac optimization command center
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="glass-card border border-glass-200 hover:border-glass-300 text-white p-3 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                </motion.button>
                
                {!shouldShowProFeatures && (
                  <motion.button
                    onClick={handleUpgrade}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-500 hover:to-yellow-400 text-black font-bold py-3 px-6 rounded-2xl transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <Crown className="w-5 h-5" />
                    Upgrade to Pro
                  </motion.button>
                )}
                
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: 'w-12 h-12'
                    }
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Plan Status Card */}
              <motion.div 
                className="glass-card rounded-3xl p-8 border border-glass-200"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                      shouldShowProFeatures
                        ? 'bg-gradient-to-br from-primary to-secondary' 
                        : 'bg-gradient-to-br from-accent to-emerald-500'
                    }`}>
                      {shouldShowProFeatures ? <Crown className="w-8 h-8 text-white" /> : <Zap className="w-8 h-8 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-2xl">
                        Memory Monster {shouldShowProFeatures ? 'Pro' : 'Free'}
                      </h2>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${subscriptionStatus.color}`}></div>
                        <span className="text-white/70">
                          {subscriptionStatus.text}
                        </span>
                        {isCanceled && (
                          <AlertTriangle className="w-4 h-4 text-orange-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {shouldShowProFeatures && (
                    <motion.button
                      onClick={handleManageBilling}
                      className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <span>Manage Billing</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>

                {shouldShowProFeatures ? (
                  <>
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div>
                        <div className="text-white/60 text-sm mb-1">
                          {isCanceled ? 'Access expires' : isInTrial ? 'Trial ends' : 'Next billing date'}
                        </div>
                        <div className="text-white font-semibold">
                          {isInTrial && trialEndsAt 
                            ? trialEndsAt.toLocaleDateString()
                            : subscriptionEndsAt?.toLocaleDateString() || 'N/A'
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-sm mb-1">Member since</div>
                        <div className="text-white font-semibold">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {isInTrial && (
                      <div className="flex items-center justify-between p-4 bg-glass-100 rounded-xl border border-glass-200">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-accent" />
                          <div>
                            <div className="text-white font-medium text-sm">Free Trial Active</div>
                            <div className="text-white/60 text-xs">
                              {daysUntilTrialEnd} days remaining
                            </div>
                          </div>
                        </div>
                        <motion.button
                          onClick={handleManageBilling}
                          className="text-white/70 hover:text-white text-sm font-medium transition-colors"
                          whileHover={{ x: 2 }}
                        >
                          Manage Trial
                        </motion.button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-glass-100 rounded-2xl p-6 border border-glass-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Gift className="w-6 h-6 text-accent" />
                      <h3 className="text-white font-semibold">Unlock Pro Features</h3>
                    </div>
                    <p className="text-white/70 text-sm mb-4">
                      Get unlimited scans, AI optimization, real-time monitoring, and priority support with a 7-day free trial!
                    </p>
                    <motion.button
                      onClick={handleUpgrade}
                      className="w-full bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-3 px-6 rounded-xl"
                      whileHover={{ y: -2 }}
                    >
                      Start Free Trial
                    </motion.button>
                  </div>
                )}

                {/* Cancelation Notice */}
                {isCanceled && hasActiveAccess && (
                  <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium text-sm">Subscription Canceled</div>
                        <div className="text-white/70 text-xs">
                          You'll keep Pro access until {subscriptionEndsAt?.toLocaleDateString()}. You won't be charged again.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* License Key Section */}
                {profile.license_key && (
                  <div className="mt-6 p-4 bg-glass-100 rounded-2xl border border-glass-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-primary" />
                        <div>
                          <div className="text-white font-medium text-sm">Your License Key</div>
                          <div className="text-white/60 text-xs">Use this in the Memory Monster app</div>
                        </div>
                      </div>
                      <motion.button
                        onClick={copyLicenseKey}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-mono text-sm bg-glass-200 px-3 py-2 rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        title="Copy license key"
                      >
                        <span>{profile.license_key}</span>
                        {copySuccess ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Usage Stats */}
              <motion.div 
                className="glass-card rounded-3xl p-8 border border-glass-200"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold text-xl flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    Your Optimization Stats
                  </h2>
                  {appUsage?.last_active && (
                    <div className="text-white/60 text-sm">
                      Last active: {new Date(appUsage.last_active).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Scans', value: stats.totalScans, icon: Zap, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Memory Freed', value: stats.memoryFreed, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
                    { label: 'Apps Optimized', value: stats.appsOptimized, icon: Monitor, color: 'from-purple-500 to-pink-500' },
                    { label: 'Usage Time', value: stats.usageTime, icon: Clock, color: 'from-orange-500 to-red-500' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-white/60 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {(!appUsage || stats.totalScans === 0) && (
                  <div className="mt-6 p-4 bg-glass-100 rounded-2xl border border-glass-200 text-center">
                    <Activity className="w-8 h-8 text-white/60 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">
                      No usage data yet. Download and run Memory Monster to see your optimization stats!
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Recent Downloads */}
              <motion.div 
                className="glass-card rounded-3xl p-8 border border-glass-200"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                  <FileDown className="w-6 h-6 text-primary" />
                  Download History
                </h2>
                
                {downloads.length > 0 ? (
                  <div className="space-y-4">
                    {downloads.slice(0, 5).map((download, index) => (
                      <div key={download.id || index} className="flex items-center justify-between p-4 bg-glass-100 rounded-xl border border-glass-200">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Monitor className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">Memory Monster v{download.version}</div>
                            <div className="text-white/60 text-sm">
                              {download.platform === 'silicon' ? 'Apple Silicon' : 'Intel Mac'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Downloaded
                          </div>
                          <div className="text-white/60 text-xs">
                            {new Date(download.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Monitor className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60 mb-4">No downloads yet</p>
                    <p className="text-white/40 text-sm">Download Memory Monster to get started!</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              
              {/* Quick Actions */}
              <motion.div 
                className="glass-card rounded-3xl p-6 border border-glass-200"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-white font-bold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <motion.button
                      onClick={() => handleDownload('silicon')}
                      className="w-full bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                      whileHover={{ y: -2 }}
                    >
                      <Download className="w-4 h-4" />
                      Download (Apple Silicon)
                    </motion.button>
                    <motion.button
                      onClick={() => handleDownload('intel')}
                      className="w-full glass-card border border-glass-200 hover:border-glass-300 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ y: -2 }}
                    >
                      <Download className="w-4 h-4" />
                      Download (Intel)
                    </motion.button>
                  </div>
                  <motion.a
                    href="/help"
                    className="w-full glass-card border border-glass-200 hover:border-glass-300 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 block text-center"
                    whileHover={{ y: -2 }}
                  >
                    Get Support
                  </motion.a>
                </div>
              </motion.div>

              {/* Usage Tips */}
              <motion.div 
                className="glass-card rounded-3xl p-6 border border-glass-200"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-white font-bold text-lg mb-4">Pro Tips</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-black">1</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Run scans regularly</div>
                      <div className="text-white/60 text-xs">Daily scans keep your Mac running smooth</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-black">2</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Close unused apps</div>
                      <div className="text-white/60 text-xs">Help Memory Monster work more effectively</div>
                    </div>
                  </div>
                  {profile.license_key && (
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Key className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">Enter your license key</div>
                        <div className="text-white/60 text-xs">Activate Pro features in the app</div>
                      </div>
                    </div>
                  )}
                  {!shouldShowProFeatures && (
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">Upgrade to Pro</div>
                        <div className="text-white/60 text-xs">Unlock unlimited scans and AI optimization</div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Account Info */}
              <motion.div 
                className="glass-card rounded-3xl p-6 border border-glass-200"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    {(user?.fullName || user?.firstName || user?.lastName) ? (
                      <div className="text-white font-semibold">
                        {user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ')}
                      </div>
                    ) : null}
                    <div className={`text-sm ${(user?.fullName || user?.firstName || user?.lastName) ? 'text-white/60' : 'text-white font-semibold'}`}>
                      {user?.emailAddresses[0]?.emailAddress}
                    </div>
                  </div>
                </div>
                <div className="text-white/60 text-xs">
                  Member since {new Date(profile.created_at).toLocaleDateString()}
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
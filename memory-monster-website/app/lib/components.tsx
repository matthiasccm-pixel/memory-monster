// app/lib/components.tsx (FIXED NAVIGATION)

'use client'

import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { 
  Download, 
  Zap, 
  ArrowRight,
  Star,
  Heart
} from 'lucide-react'
import { analytics } from './analytics'

// Shared Navigation Component - With Auth States
export const Navigation = () => {
  const { isSignedIn, user, isLoaded } = useUser()
  const pathname = usePathname()
  
  // Check if user is admin
  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === 'matthiasccm@gmail.com'

  return (
    <motion.nav 
      className="fixed top-0 w-full z-50 bg-glass-200/80 backdrop-blur-ultra border-b border-glass-100 shadow-2xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1), rgba(255, 255, 255, 0.05))'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <motion.a 
            href="/"
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-tight">Memory Monster</span>
              <div className="text-primary-light text-xs font-medium">Speed Unleashed</div>
            </div>
          </motion.a>
          
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/features" isActive={pathname === '/features' || pathname.startsWith('/for-')}>Features</NavLink>
            <NavLink href="/pricing" isActive={pathname === '/pricing' || pathname === '/pro/checkout'}>Pricing</NavLink>
            <NavLink href="/help" isActive={pathname === '/help' || pathname.startsWith('/help/')}>Support</NavLink>
          </div>
          
          <div className="flex items-center gap-4">
            {isLoaded && (
              <>
                {isSignedIn ? (
                  // Logged in state - hide dashboard link and avatar when on dashboard page
                  <div className="flex items-center gap-4">
                    {pathname !== '/dashboard' && (
                      <>
                        <motion.a 
                          href="/dashboard"
                          className="hidden md:flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
                          whileHover={{ y: -2 }}
                        >
                          Dashboard
                        </motion.a>
                        {isAdmin && (
                          <motion.a 
                            href="/admin"
                            className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                            whileHover={{ y: -2 }}
                          >
                            Admin
                          </motion.a>
                        )}
                        <div className="flex items-center">
                          <UserButton 
                            afterSignOutUrl="/"
                            appearance={{
                              elements: {
                                avatarBox: "w-10 h-10",
                                userButtonPopoverCard: "bg-gray-900 border-gray-700",
                                userButtonPopoverText: "text-white",
                                userButtonPopoverActionButton: "text-white hover:bg-gray-800"
                              }
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  // Logged out state (current default)
                  <div className="flex items-center gap-6">
                    <DownloadButton />
                    <NavLink href="/signin" isActive={pathname === '/signin'}>Sign In</NavLink>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

const NavLink = ({ href, children, isActive }: { href: string, children: React.ReactNode, isActive: boolean }) => (
  <motion.a 
    href={href} 
    className={`font-medium relative group transition-all duration-300 ${
      isActive 
        ? 'text-white' 
        : 'text-white/70 hover:text-white'
    }`}
    whileHover={{ y: -2 }}
  >
    {children}
    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${
      isActive 
        ? 'w-full shadow-lg shadow-primary/50' 
        : 'w-0 group-hover:w-full'
    }`}></span>
    {isActive && (
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg blur-sm -z-10"></div>
    )}
  </motion.a>
)

// Shared Download Button
export const DownloadButton = ({ 
  size = 'md', 
  children = 'Download Free'
}: { 
  size?: 'sm' | 'md' | 'lg' | 'full'
  children?: React.ReactNode
}) => {
  const handleClick = async () => {
    await analytics.trackDownloadIntent('download_button')
    window.location.href = '/pricing'
  }

  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-12 py-5 text-lg min-w-[220px]',
    full: 'w-full py-5 text-base'
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`magnetic-button liquid-button ripple glass-card bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold rounded-2xl flex items-center justify-center gap-3 group relative overflow-hidden ${sizeClasses[size]}`}
      whileHover={{ 
        scale: size === 'full' ? 1.02 : 1.05, 
        y: -8
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      <Download className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
      <span className="relative z-10">{children}</span>
      
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/40 rounded-full particle opacity-0 group-hover:opacity-100" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-white/40 rounded-full particle opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-white/40 rounded-full particle opacity-0 group-hover:opacity-100" style={{ animationDelay: '1s' }}></div>
    </motion.button>
  )
}

// Shared Footer - FIXED LINKS
export const Footer = () => {
  return (
    <footer className="bg-glass-100 backdrop-blur-md border-t border-glass-200 py-16 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-xl">Memory Monster</span>
                <div className="text-primary-light text-xs font-medium">Speed Unleashed</div>
              </div>
            </div>
            <p className="text-white/60 leading-relaxed max-w-md">
              The world's most advanced Mac optimization tool. Stop apps from destroying your speed.
            </p>
            <div className="flex gap-4 mt-6">
              <DownloadButton size="sm" />
              <motion.a 
                href="/pro/checkout"
                className="bg-glass-200 hover:bg-glass-300 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-glass-200"
                whileHover={{ y: -2 }}
              >
                Go Pro
              </motion.a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <div className="space-y-3">
              {[
                { name: 'Features', href: '/features' },
                { name: 'Download', href: '/pricing' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'For Designers', href: '/for-designers' },
                { name: 'For Developers', href: '/for-developers' },
                { name: 'For Analysts', href: '/for-analysts' },
                { name: 'For Gamers', href: '/for-gamers' },
                { name: 'For Streamers', href: '/for-streamers' },
                { name: 'Support', href: '/help' }
              ].map(link => (
                <a key={link.name} href={link.href} className="block text-white/60 hover:text-white transition-colors">
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <div className="space-y-3">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Our Mission', href: '/mission' },
                { name: 'Careers', href: '/careers' },
                { name: 'Blog', href: '/blog' },
                { name: 'Help', href: '/help' },
                { name: 'Contact', href: '/contact' }
              ].map(link => (
                <a key={link.name} href={link.href} className="block text-white/60 hover:text-white transition-colors">
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-glass-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/60 text-sm">
            © 2025 Memory Monster. All rights reserved.
          </div>
          <div className="text-white/60 text-sm mt-4 md:mt-0 flex items-center gap-4">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <div className="flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-400" /> for Mac users worldwide
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Floating Elements Component
export const FloatingElements = () => {
  const emojis = [
    { emoji: '⚡', className: 'top-20 left-10', animation: 'float-slow', size: 'text-4xl' },
    { emoji: '✨', className: 'top-32 right-16', animation: 'float-medium', size: 'text-3xl' },
    { emoji: '🚀', className: 'top-96 left-1/4', animation: 'float-fast', size: 'text-3xl' },
    { emoji: '💎', className: 'bottom-32 right-20', animation: 'float-slow', size: 'text-4xl' },
    { emoji: '🔮', className: 'bottom-96 left-16', animation: 'float-medium', size: 'text-3xl' },
    { emoji: '🌟', className: 'top-1/2 right-1/3', animation: 'float-fast', size: 'text-2xl' },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {emojis.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute opacity-30 ${element.className} ${element.animation} ${element.size}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: index * 0.5, duration: 1 }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  )
}

// Hero Section Component
export const HeroSection = ({ 
  title, 
  subtitle, 
  description, 
  stats,
  visual 
}: {
  title: string
  subtitle: string
  description: string
  stats?: Array<{ value: string, label: string }>
  visual?: React.ReactNode
}) => {
  return (
    <section className="pt-32 pb-20 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Mobile: Visual First */}
          {visual && (
            <div className="lg:hidden flex justify-center mb-8">
              <div className="scale-75">
                {visual}
              </div>
            </div>
          )}

          {/* Left Side - Text Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-6">
              <motion.div
                className="inline-flex items-center gap-2 bg-glass-100 backdrop-blur-md rounded-full px-4 py-2 border border-glass-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Star className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">{subtitle}</span>
              </motion.div>

              <h1 className="text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight text-breathe">
                <span className="morphing-gradient">
                  {title}
                </span>
              </h1>
              
              <p className="text-xl text-white/70 leading-relaxed max-w-lg">
                {description}
              </p>
            </div>

            {/* Stats */}
            {stats && (
              <div className="flex items-center gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <DownloadButton size="lg" />
              <motion.a 
                href="/pricing"
                className="group flex items-center gap-3 text-white/80 hover:text-white transition-all duration-300"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 bg-glass-100 backdrop-blur-md rounded-full flex items-center justify-center border border-glass-200 group-hover:border-glass-300 transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <span className="font-medium">View Pricing</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Right Side - Visual (Desktop Only) */}
          {visual && (
            <motion.div 
              className="relative justify-center hidden lg:flex"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {visual}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

// Feature Card Component
export const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  color = 'from-primary to-secondary' 
}: {
  icon: React.ReactNode
  title: string
  description: string
  color?: string
}) => {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
    >
      <div className="glass-card rounded-2xl p-8 hover:border-glass-300 transition-all duration-300 text-center h-full">
        <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-white font-bold text-xl mb-4">{title}</h3>
        <p className="text-white/70 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

// Pricing Feature Component
export const PricingFeature = ({ icon, text, highlight = false }: { icon: string, text: string, highlight?: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
      highlight 
        ? 'bg-gradient-to-r from-primary to-secondary text-white' 
        : 'bg-accent/20 text-accent'
    }`}>
      {icon}
    </div>
    <span className={`${highlight ? 'text-white font-medium' : 'text-white/90'}`}>
      {text}
    </span>
  </div>
)
// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { 
  Users,
  Crown,
  DollarSign,
  UserPlus,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Target,
  Activity,
  Download,
  XCircle,
  ChevronRight
} from 'lucide-react'
import { Navigation, Footer } from '../lib/components'
import AnalyticsDashboard from '../components/AnalyticsDashboard'

interface DateRange {
  from: Date
  to: Date
}

interface Activity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  color: string
}

interface AdminMetrics {
  totalUsers: number
  proSubscribers: number
  monthlyRevenue: number
  todaySignups: number
  activeTrials: number
  churnThisMonth: number
  userGrowthRate: number
  proGrowthRate: number
  conversionRate: string
  trialConversionRate: string
  previousPeriod?: {
    totalUsers: number
    proSubscribers: number
    monthlyRevenue: number
    todaySignups: number
    activeTrials: number
    churnThisMonth: number
  }
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded) {
      fetchMetrics()
    }
  }, [isLoaded])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/overview')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch metrics')
      }
      
      if (data.success) {
        setMetrics(data.metrics)
        setLastUpdated(data.lastUpdated)
      } else {
        throw new Error(data.error || 'Invalid response format')
      }
    } catch (error) {
      console.error('Failed to fetch admin metrics:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const calculatePercentageChange = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? '+100%' : '0%'
    const change = ((current - previous) / previous) * 100
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
  }

  const getComparisonPeriod = (): string => {
    return 'vs last period'
  }

  const dateRange = '30d' // Default to 30 days

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen animated-bg relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white/70">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen animated-bg relative overflow-hidden">
        <Navigation />
        <section className="pt-32 pb-20 px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card rounded-3xl p-8 border border-glass-200">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-white font-bold text-2xl mb-4">Access Denied</h2>
              <p className="text-white/70 mb-6">{error}</p>
              <motion.button
                onClick={fetchMetrics}
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

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
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
                  Admin <span className="morphing-gradient">Dashboard</span>
                </h1>
                <p className="text-white/70 text-lg">
                  Memory Monster business overview
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={fetchMetrics}
                  disabled={loading}
                  className="glass-card border border-glass-200 hover:border-glass-300 text-white p-3 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>
                
                {lastUpdated && (
                  <div className="text-white/60 text-sm">
                    Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Navigation */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <motion.button
                className="glass-card border border-glass-200 hover:border-glass-300 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-glass-100 rounded-lg flex items-center justify-center">
                    📊
                  </div>
                  <span className="text-sm">Revenue Analytics</span>
                </div>
              </motion.button>
              <motion.button
                onClick={() => window.location.href = '/admin/approvals'}
                className="glass-card border border-glass-200 hover:border-glass-300 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-glass-100 rounded-lg flex items-center justify-center">
                    🌌
                  </div>
                  <span className="text-sm">App Universe</span>
                </div>
              </motion.button>
              <motion.button
                onClick={() => window.location.href = '/admin/customers'}
                className="glass-card border border-glass-200 hover:border-glass-300 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-glass-100 rounded-lg flex items-center justify-center">
                    👥
                  </div>
                  <span className="text-sm">All Customers</span>
                </div>
              </motion.button>
              <motion.button
                onClick={() => window.location.href = '/admin/jobs'}
                className="glass-card border border-glass-200 hover:border-glass-300 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-glass-100 rounded-lg flex items-center justify-center">
                    💼
                  </div>
                  <span className="text-sm">Jobs Admin</span>
                </div>
              </motion.button>
              <motion.button
                onClick={() => window.location.href = '/admin/blog'}
                className="glass-card border border-primary/30 hover:border-primary/50 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 bg-gradient-to-r from-primary/10 to-secondary/10"
                whileHover={{ y: -2 }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                    📝
                  </div>
                  <span className="text-sm">Blog Admin</span>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Interactive Analytics Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <AnalyticsDashboard />
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
            
            {/* Total Users */}
            <MetricCard
              title="Total Users"
              value={metrics?.totalUsers?.toLocaleString() || '0'}
              change={metrics?.previousPeriod ? calculatePercentageChange(metrics.totalUsers, metrics.previousPeriod.totalUsers) : null}
              changeLabel={getComparisonPeriod()}
              icon={<Users className="w-6 h-6 text-white" />}
              color="from-blue-500 to-cyan-500"
            />

            {/* Pro Subscribers */}
            <MetricCard
              title="Pro Subscribers"
              value={metrics?.proSubscribers?.toLocaleString() || '0'}
              change={metrics?.previousPeriod ? calculatePercentageChange(metrics.proSubscribers, metrics.previousPeriod.proSubscribers) : null}
              changeLabel={getComparisonPeriod()}
              icon={<Crown className="w-6 h-6 text-white" />}
              color="from-purple-500 to-pink-500"
            />

            {/* Monthly Revenue */}
            <MetricCard
              title="Revenue"
              value={`${metrics?.monthlyRevenue?.toLocaleString() || '0'}`}
              change={metrics?.previousPeriod ? calculatePercentageChange(metrics.monthlyRevenue, metrics.previousPeriod.monthlyRevenue) : null}
              changeLabel={getComparisonPeriod()}
              icon={<DollarSign className="w-6 h-6 text-white" />}
              color="from-green-500 to-emerald-500"
            />

            {/* Signups */}
            <MetricCard
              title={dateRange === 'today' ? "Today's Signups" : 'New Signups'}
              value={metrics?.todaySignups?.toLocaleString() || '0'}
              change={metrics?.previousPeriod ? calculatePercentageChange(metrics.todaySignups, metrics.previousPeriod.todaySignups) : null}
              changeLabel={getComparisonPeriod()}
              icon={<UserPlus className="w-6 h-6 text-white" />}
              color="from-orange-500 to-red-500"
            />

            {/* Active Trials */}
            <MetricCard
              title="Active Trials"
              value={metrics?.activeTrials?.toLocaleString() || '0'}
              change={metrics?.previousPeriod ? calculatePercentageChange(metrics.activeTrials, metrics.previousPeriod.activeTrials) : null}
              changeLabel={getComparisonPeriod()}
              icon={<Calendar className="w-6 h-6 text-white" />}
              color="from-yellow-500 to-orange-500"
            />

            {/* Churn */}
            <MetricCard
              title="Churn"
              value={metrics?.churnThisMonth?.toLocaleString() || '0'}
              change={metrics?.previousPeriod ? calculatePercentageChange(metrics.churnThisMonth, metrics.previousPeriod.churnThisMonth) : null}
              changeLabel={getComparisonPeriod()}
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              color="from-red-500 to-pink-500"
              isNegative
            />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Conversion Rate */}
            <motion.div 
              className="glass-card rounded-3xl p-6 border border-glass-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Conversion Rate</h3>
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {metrics?.conversionRate}%
              </div>
              <p className="text-white/60 text-sm">Free to Pro conversion</p>
            </motion.div>

            {/* Trial Conversion */}
            <motion.div 
              className="glass-card rounded-3xl p-6 border border-glass-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Trial Conversion</h3>
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {metrics?.trialConversionRate}%
              </div>
              <p className="text-white/60 text-sm">Trial to paid conversion</p>
            </motion.div>

            {/* Revenue Per User */}
            <motion.div 
              className="glass-card rounded-3xl p-6 border border-glass-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Revenue Per User</h3>
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                ${((metrics?.monthlyRevenue || 0) / (metrics?.totalUsers || 1)).toFixed(2)}
              </div>
              <p className="text-white/60 text-sm">Monthly revenue / total users</p>
            </motion.div>

            {/* Pro Subscriber Rate */}
            <motion.div 
              className="glass-card rounded-3xl p-6 border border-glass-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Pro Rate</h3>
                <Crown className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {((metrics?.proSubscribers || 0) / (metrics?.totalUsers || 1) * 100).toFixed(1)}%
              </div>
              <p className="text-white/60 text-sm">Users with Pro subscription</p>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div 
            className="mt-12 glass-card rounded-3xl p-8 border border-glass-200"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-xl">Recent Activity</h2>
              <motion.button
                onClick={() => window.location.href = '/admin/customers'}
                className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                View All Customers
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
            <RecentActivityFeed />
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  )
}

// Metric Card Component
interface MetricCardProps {
  title: string
  value: string
  change?: string | null
  changeLabel?: string
  icon: React.ReactNode
  color: string
  isNegative?: boolean
}

const MetricCard = ({ title, value, change, changeLabel, icon, color, isNegative = false }: MetricCardProps) => {
  const getChangeColor = () => {
    if (!change) return 'text-gray-400'
    const numericChange = parseFloat(change)
    if (isNegative) {
      // For metrics like churn, lower is better
      return numericChange > 0 ? 'text-red-400' : 'text-green-400'
    } else {
      // For metrics like revenue, higher is better
      return numericChange > 0 ? 'text-green-400' : 'text-red-400'
    }
  }

  return (
    <motion.div 
      className="glass-card rounded-3xl p-6 border border-glass-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/80 font-medium text-sm">{title}</h3>
        <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      
      <div className="text-3xl font-bold text-white mb-2">
        {value}
      </div>
      
      {change && changeLabel && (
        <div className={`text-sm font-medium ${getChangeColor()}`}>
          {change}% {changeLabel}
        </div>
      )}
    </motion.div>
  )
}

// Analytics Chart Component
interface AnalyticsChartProps {
  data: Array<{
    date: string
    users: number
    revenue: number
    signups: number
    conversions: number
  }>
  dateRange: DateRange
  loading: boolean
}

const AnalyticsChart = ({ data, dateRange, loading }: AnalyticsChartProps) => {
  const [activeMetric, setActiveMetric] = useState<'users' | 'revenue' | 'signups' | 'conversions'>('revenue')

  const metricOptions = [
    { key: 'revenue', label: 'Revenue', color: '#10b981', icon: <DollarSign className="w-4 h-4" /> },
    { key: 'users', label: 'Users', color: '#3b82f6', icon: <Users className="w-4 h-4" /> },
    { key: 'signups', label: 'Signups', color: '#f59e0b', icon: <UserPlus className="w-4 h-4" /> },
    { key: 'conversions', label: 'Conversions', color: '#8b5cf6', icon: <Crown className="w-4 h-4" /> }
  ] as const

  const maxValue = Math.max(...data.map(d => d[activeMetric]))
  const formatValue = (value: number) => {
    if (activeMetric === 'revenue') return `${value.toLocaleString()}`
    return value.toLocaleString()
  }

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-8 border border-glass-200">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-6 w-48"></div>
          <div className="h-80 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="glass-card rounded-3xl p-8 border border-glass-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-white">Analytics Overview</h2>
        
        <div className="flex gap-2 bg-glass-100 rounded-xl p-1">
          {metricOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setActiveMetric(option.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeMetric === option.key
                  ? 'bg-white text-gray-900'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 relative">
        <svg className="w-full h-full" viewBox="0 0 800 320">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="60"
              y1={60 + (i * 50)}
              x2="780"
              y2={60 + (i * 50)}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={i}
              x="50"
              y={70 + (i * 50)}
              fill="rgba(255,255,255,0.6)"
              fontSize="12"
              textAnchor="end"
            >
              {formatValue(maxValue - (i * maxValue / 4))}
            </text>
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const barWidth = (720 / data.length) * 0.8
            const barHeight = (item[activeMetric] / maxValue) * 200
            const x = 60 + (index * (720 / data.length)) + ((720 / data.length) - barWidth) / 2
            const y = 260 - barHeight
            
            return (
              <motion.rect
                key={`${item.date}-${index}`}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={`url(#gradient-${activeMetric})`}
                rx="4"
                initial={{ height: 0, y: 260 }}
                animate={{ height: barHeight, y }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            )
          })}

          {/* X-axis labels */}
          {data.map((item, index) => (
            <text
              key={index}
              x={60 + (index * (720 / data.length)) + (720 / data.length) / 2}
              y="285"
              fill="rgba(255,255,255,0.6)"
              fontSize="11"
              textAnchor="middle"
            >
              {new Date(item.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </text>
          ))}

          {/* Gradients */}
          <defs>
            {metricOptions.map((option) => (
              <linearGradient key={option.key} id={`gradient-${option.key}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={option.color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={option.color} stopOpacity="0.3" />
              </linearGradient>
            ))}
          </defs>
        </svg>
      </div>
    </motion.div>
  )
}

// Recent Activity Feed Component
const RecentActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/admin/activity?limit=10&days=7')
      const data = await response.json()
      
      if (data.success) {
        setActivities(data.activities)
      }
    } catch (error) {
      console.error('Failed to fetch recent activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signup': return <UserPlus className="w-4 h-4" />
      case 'upgrade': return <Crown className="w-4 h-4" />
      case 'cancellation': return <XCircle className="w-4 h-4" />
      case 'download': return <Download className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      yellow: 'bg-yellow-500'
    }
    return colors[color] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg animate-pulse">
            <div className="w-8 h-8 bg-white/10 rounded-full"></div>
            <div className="flex-1">
              <div className="h-3 bg-white/10 rounded mb-2"></div>
              <div className="h-2 bg-white/5 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="w-12 h-12 text-white/40 mx-auto mb-2" />
        <p className="text-white/60">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {activities.map((activity) => (
        <motion.div
          key={activity.id}
          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className={`w-8 h-8 ${getActivityColor(activity.color)} rounded-full flex items-center justify-center text-white`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium text-sm">
              {activity.title}
            </div>
            <div className="text-white/60 text-xs truncate">
              {activity.description}
            </div>
          </div>
          <div className="text-white/50 text-xs">
            {new Date(activity.timestamp).toLocaleDateString()}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  Download,
  Crown,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Search
} from 'lucide-react'

// Types for our analytics data
interface AnalyticsData {
  date: string
  totalDownloads: number
  freeDownloads: number
  proInstalls: number
  revenue: number
  activeTrials: number
  churn: number
  totalScans: number
}

interface MetricSummary {
  current: number
  previous: number
  previousYear: number
  growth: number
  yearGrowth: number
}

// API response interface
interface AnalyticsResponse {
  timeSeries: AnalyticsData[]
  summary: MetricSummary
  metric: string
  period: string
  dateRange: {
    start: string
    end: string
  }
}

// Fetch analytics data from API
const fetchAnalyticsData = async (metric: string, period: string): Promise<AnalyticsResponse> => {
  const response = await fetch(`/api/admin/analytics?metric=${metric}&period=${period}`)
  if (!response.ok) {
    throw new Error('Failed to fetch analytics data')
  }
  return response.json()
}

const METRIC_OPTIONS = [
  { value: 'totalDownloads', label: 'Total Downloads', icon: Download, color: '#3B82F6' },
  { value: 'totalScans', label: 'Total Scans', icon: Search, color: '#EC4899' },
  { value: 'freeDownloads', label: 'Free Downloads', icon: Download, color: '#10B981' },
  { value: 'proInstalls', label: 'Pro Installs', icon: Crown, color: '#F59E0B' },
  { value: 'revenue', label: 'Revenue', icon: DollarSign, color: '#8B5CF6' },
  { value: 'activeTrials', label: 'Active Trials', icon: Users, color: '#06B6D4' },
  { value: 'churn', label: 'Churn', icon: TrendingDown, color: '#EF4444' }
] as const

const TIME_PERIOD_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 3 months' },
  { value: 'thisWeek', label: 'This week' },
  { value: 'thisMonth', label: 'This month' },
  { value: '365', label: 'Year to date' },
  { value: 'allTime', label: 'All time' }
] as const

export default function AnalyticsDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<typeof METRIC_OPTIONS[number]['value']>('totalDownloads')
  const [selectedPeriod, setSelectedPeriod] = useState<typeof TIME_PERIOD_OPTIONS[number]['value']>('30')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const [summary, setSummary] = useState<MetricSummary>({ current: 0, previous: 0, previousYear: 0, growth: 0, yearGrowth: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get current metric configuration
  const currentMetric = METRIC_OPTIONS.find(m => m.value === selectedMetric) || METRIC_OPTIONS[0]

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await fetchAnalyticsData(selectedMetric, selectedPeriod)
        setAnalyticsData(data.timeSeries)
        setSummary(data.summary)
      } catch (err) {
        console.error('Failed to load analytics:', err)
        setError('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    loadAnalyticsData()
  }, [selectedMetric, selectedPeriod])


  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (selectedMetric === 'revenue') {
      return `$${num.toLocaleString()}`
    }
    return num.toLocaleString()
  }

  const formatGrowth = (growth: number): string => {
    const sign = growth >= 0 ? '+' : ''
    return `${sign}${growth}%`
  }

  // Show error state
  if (error) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-glass-200 text-center">
        <div className="text-red-400 mb-2">Failed to load analytics</div>
        <div className="text-white/60 text-sm">{error}</div>
        <motion.button
          onClick={() => window.location.reload()}
          className="mt-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-2 px-4 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          Retry
        </motion.button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Single Consolidated Analytics Cell */}
      <motion.div 
        className="glass-card rounded-2xl p-6 border border-glass-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header with Title and Filters */}
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-white font-bold text-lg">
            {currentMetric.label} Over Time
          </h3>
          
          {/* Filter Controls on the right */}
          <div className="flex flex-wrap gap-4">
            {loading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-4"></div>
            )}
            
            {/* Metric Selector */}
            <div className="relative min-w-[180px]">
              <label className="block text-white/80 text-xs font-medium mb-1">
                Metric
              </label>
              <div className="relative">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as any)}
                  className="w-full glass-card border border-glass-200 rounded-xl px-3 py-2 text-white bg-glass-100 focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-sm"
                >
                  {METRIC_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
              </div>
            </div>

            {/* Time Period Selector */}
            <div className="relative min-w-[160px]">
              <label className="block text-white/80 text-xs font-medium mb-1">
                Time Period
              </label>
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="w-full glass-card border border-glass-200 rounded-xl px-3 py-2 text-white bg-glass-100 focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-sm"
                >
                  {TIME_PERIOD_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div style={{ width: '100%', height: 400, marginBottom: '24px' }}>
          <ResponsiveContainer>
            <AreaChart data={analyticsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickFormatter={(date) => {
                  const d = new Date(date)
                  return d.getMonth() + 1 + '/' + d.getDate()
                }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                domain={[0, 'dataMax']}
                tickCount={6}
                allowDecimals={false}
                interval="preserveStartEnd"
                tickFormatter={(value) => {
                  if (selectedMetric === 'revenue') {
                    if (value >= 1000) {
                      return `$${(value/1000).toFixed(0)}k`
                    }
                    return `$${Math.max(0, value)}`
                  }
                  return Math.floor(value).toLocaleString()
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white'
                }}
                formatter={(value: any) => [formatNumber(value), currentMetric.label]}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={currentMetric.color}
                strokeWidth={3}
                fill={`url(#gradient-${selectedMetric})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Stats Row */}
        <div className="flex flex-wrap items-center gap-8">
          {/* Current Metric Display */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ backgroundColor: currentMetric.color }}>
              <currentMetric.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-xl">{formatNumber(summary.current)}</span>
              <p className="text-white/60 text-sm">
                Total {currentMetric.label} • {TIME_PERIOD_OPTIONS.find(p => p.value === selectedPeriod)?.label}
              </p>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:flex flex-1"></div>

          {/* Period Comparison */}
          <div className="flex items-center justify-between p-3 bg-glass-100 rounded-lg min-w-[180px]">
            <div>
              <div className="text-white/60 text-xs mb-1">vs Previous Period</div>
              <div className="text-white font-medium text-sm">
                {formatNumber(summary.previous)}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {summary.growth >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
              <span className={`font-bold text-sm ${summary.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatGrowth(summary.growth)}
              </span>
            </div>
          </div>

          {/* Year Comparison */}
          <div className="flex items-center justify-between p-3 bg-glass-100 rounded-lg min-w-[160px]">
            <div>
              <div className="text-white/60 text-xs mb-1">vs Last Year</div>
              <div className="text-white font-medium text-sm">
                {formatNumber(summary.previousYear)}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {summary.yearGrowth >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
              <span className={`font-bold text-sm ${summary.yearGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatGrowth(summary.yearGrowth)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
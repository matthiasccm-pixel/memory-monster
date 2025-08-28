'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ChevronRight,
  Home,
  Brain,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  TrendingUp,
  Users,
  Calendar,
  Filter,
  Eye,
  GitBranch,
  Zap,
  Shield,
  Clock
} from 'lucide-react'

interface PendingApproval {
  id: string
  app_id: string
  app_name: string
  strategy_type: 'conservative' | 'balanced' | 'aggressive' | 'os_specific'
  update_type: string
  estimated_impact: {
    memory_savings_mb: number
    speed_improvement_percent: number
    user_impact: string
  }
  sample_size: number
  confidence_score: number
  risk_level: 'low' | 'medium' | 'high'
  supporting_data_points: number
  avg_effectiveness: number
  created_at: string
  plain_english_description: string
  os_compatibility?: string[]
  hardware_compatibility?: string[]
  os_specific_data?: Record<string, any>
  system_strategy?: boolean
}

interface UnsupportedApp {
  app_id: string
  app_name: string
  user_count: number
  optimization_attempts: number
  avg_memory_usage_mb: number
  last_seen: string
  priority_score: number
}

interface SupportedApp {
  id: string
  app_id: string
  app_name: string
  support_level: 'basic' | 'full'
  strategies_available: string[]
  last_updated: string
  created_by: string
  user_count?: number
  avg_effectiveness?: number
}

export default function ApprovalsManagement() {
  const [activeTab, setActiveTab] = useState<'pending' | 'unsupported' | 'supported'>('pending')
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([])
  const [unsupportedApps, setUnsupportedApps] = useState<UnsupportedApp[]>([])
  const [supportedApps, setSupportedApps] = useState<SupportedApp[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<string>('all')
  const [selectedRisk, setSelectedRisk] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('30d')

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPendingApprovals([
        {
          id: '1',
          app_id: 'com.google.Chrome',
          app_name: 'Google Chrome',
          strategy_type: 'balanced',
          update_type: 'threshold_adjustment',
          estimated_impact: {
            memory_savings_mb: 340,
            speed_improvement_percent: 15,
            user_impact: 'low'
          },
          sample_size: 847,
          confidence_score: 0.94,
          risk_level: 'low',
          supporting_data_points: 1240,
          avg_effectiveness: 0.87,
          created_at: '2024-01-15',
          plain_english_description: 'Users are seeing 15% better performance when we clear Chrome cache every 2 hours instead of 4 hours during heavy usage periods.'
        },
        {
          id: '2',
          app_id: 'com.tinyspeck.slackmacgap',
          app_name: 'Slack',
          strategy_type: 'aggressive',
          update_type: 'new_action',
          estimated_impact: {
            memory_savings_mb: 680,
            speed_improvement_percent: 25,
            user_impact: 'medium'
          },
          sample_size: 234,
          confidence_score: 0.91,
          risk_level: 'medium',
          supporting_data_points: 456,
          avg_effectiveness: 0.83,
          created_at: '2024-01-12',
          plain_english_description: 'Restarting Slack automatically when it uses >800MB memory saves significant RAM and improves responsiveness, but briefly interrupts conversations.'
        },
        {
          id: '3',
          app_id: 'com.apple.macOS',
          app_name: 'macOS System',
          strategy_type: 'os_specific',
          update_type: 'new_os_optimization',
          estimated_impact: {
            memory_savings_mb: 1800,
            speed_improvement_percent: 35,
            user_impact: 'high'
          },
          sample_size: 892,
          confidence_score: 0.96,
          risk_level: 'low',
          supporting_data_points: 1523,
          avg_effectiveness: 0.94,
          created_at: '2024-01-20',
          plain_english_description: 'New Sonoma-specific WindowServer memory leak detection and resolution strategy provides significant memory recovery with minimal system disruption.',
          os_compatibility: ['sonoma'],
          hardware_compatibility: ['apple_silicon', 'intel'],
          os_specific_data: {
            sonoma_apple_silicon: { effectiveness: 0.97, sample_size: 512, avg_savings_mb: 2100 },
            sonoma_intel: { effectiveness: 0.91, sample_size: 380, avg_savings_mb: 1650 }
          },
          system_strategy: true
        }
      ])

      setUnsupportedApps([
        {
          app_id: 'com.adobe.Illustrator',
          app_name: 'Adobe Illustrator',
          user_count: 234,
          optimization_attempts: 89,
          avg_memory_usage_mb: 2340,
          last_seen: '2024-01-14',
          priority_score: 0.92
        },
        {
          app_id: 'com.figma.Desktop',
          app_name: 'Figma Desktop',
          user_count: 567,
          optimization_attempts: 234,
          avg_memory_usage_mb: 1560,
          last_seen: '2024-01-15',
          priority_score: 0.89
        }
      ])

      setSupportedApps([
        {
          id: '1',
          app_id: 'com.google.Chrome',
          app_name: 'Google Chrome',
          support_level: 'full',
          strategies_available: ['conservative', 'balanced', 'aggressive'],
          last_updated: '2024-01-10',
          created_by: 'ai_research',
          user_count: 2847,
          avg_effectiveness: 0.87
        },
        {
          id: '2',
          app_id: 'com.tinyspeck.slackmacgap',
          app_name: 'Slack',
          support_level: 'full',
          strategies_available: ['conservative', 'balanced', 'aggressive'],
          last_updated: '2024-01-08',
          created_by: 'ai_research',
          user_count: 1923,
          avg_effectiveness: 0.83
        },
        {
          id: '3',
          app_id: 'com.apple.Safari',
          app_name: 'Safari',
          support_level: 'full',
          strategies_available: ['conservative', 'balanced', 'aggressive'],
          last_updated: '2024-01-12',
          created_by: 'ai_research',
          user_count: 3124,
          avg_effectiveness: 0.91
        },
        {
          id: '4',
          app_id: 'com.microsoft.VSCode',
          app_name: 'Visual Studio Code',
          support_level: 'basic',
          strategies_available: ['conservative', 'balanced'],
          last_updated: '2024-01-05',
          created_by: 'manual',
          user_count: 1456,
          avg_effectiveness: 0.79
        }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  const handleApprove = async (approval: PendingApproval) => {
    try {
      console.log('🟢 Approving strategy update:', approval)
      
      // Show loading state
      alert('Processing approval...')
      
      // Call the approval API
      const response = await fetch('/api/approval/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          strategyUpdateId: approval.id,
          decision: 'approved',
          reviewNotes: `Approved AI learning: ${approval.plain_english_description}`,
          deploymentPhase: 'beta' // Start with beta rollout
        })
      })

      if (!response.ok) {
        throw new Error('Failed to approve strategy update')
      }

      const result = await response.json()
      console.log('✅ Approval successful:', result)
      
      // Remove from pending list
      setPendingApprovals(prev => prev.filter(p => p.id !== approval.id))
      
      alert(`✅ Successfully approved and deployed to beta users!\n\n${approval.app_name}: ${approval.plain_english_description}\n\nEstimated Impact:\n• ${approval.estimated_impact.memory_savings_mb}MB memory savings\n• ${approval.estimated_impact.speed_improvement_percent}% speed improvement\n\nThis update will gradually roll out to users and can be monitored in the A/B Tests dashboard.`)
      
    } catch (error) {
      console.error('❌ Approval failed:', error)
      alert(`❌ Failed to approve strategy update: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleReject = async (approval: PendingApproval) => {
    try {
      console.log('🔴 Rejecting strategy update:', approval)
      
      const reason = prompt('Please provide a reason for rejection:', 'Safety concerns or insufficient data')
      if (!reason) return
      
      // Call the rejection API
      const response = await fetch('/api/approval/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          strategyUpdateId: approval.id,
          decision: 'rejected',
          reviewNotes: reason
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reject strategy update')
      }

      console.log('✅ Rejection processed')
      
      // Remove from pending list
      setPendingApprovals(prev => prev.filter(p => p.id !== approval.id))
      
      alert(`✅ Strategy update rejected.\n\nReason: ${reason}\n\nThe AI learning system will incorporate this feedback for future recommendations.`)
      
    } catch (error) {
      console.error('❌ Rejection failed:', error)
      alert(`❌ Failed to reject strategy update: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleBuildAppSupport = async (app: UnsupportedApp) => {
    try {
      console.log('🔬 Building AI support for:', app)
      
      if (!confirm(`Build AI support for ${app.app_name}?\n\nThis will:\n• Research optimization patterns\n• Create base strategies (conservative, balanced, aggressive)\n• Add cache location mappings\n• Generate monitoring thresholds\n\nEstimated time: 2-3 minutes`)) {
        return
      }
      
      alert('🚀 Starting AI research... This may take a few minutes.')
      
      // Call the build support API
      const response = await fetch('/api/apps/build-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appId: app.app_id,
          appName: app.app_name,
          userCount: app.user_count,
          avgMemoryUsage: app.avg_memory_usage_mb
        })
      })

      if (!response.ok) {
        throw new Error('Failed to build app support')
      }

      const result = await response.json()
      console.log('✅ App support built:', result)
      
      // Remove from unsupported list and add to supported list
      setUnsupportedApps(prev => prev.filter(a => a.app_id !== app.app_id))
      setSupportedApps(prev => [...prev, {
        id: `new_${Date.now()}`,
        app_id: app.app_id,
        app_name: app.app_name,
        support_level: 'full',
        strategies_available: ['conservative', 'balanced', 'aggressive'],
        last_updated: new Date().toISOString().split('T')[0],
        created_by: 'ai_research',
        user_count: app.user_count,
        avg_effectiveness: 0.0 // Will start collecting data
      }])
      
      alert(`✅ Successfully built AI support for ${app.app_name}!\n\nGenerated:\n• 3 optimization strategies (conservative, balanced, aggressive)\n• ${result.strategies?.conservative?.cachePatterns?.length || 3} cache location patterns\n• Memory thresholds and monitoring rules\n• Safety controls and rollback triggers\n\nThe app is now fully supported and will begin learning from user data.\n\n🔄 Check the "Currently Supported Apps" tab to verify it was added!`)
      
    } catch (error) {
      console.error('❌ Build support failed:', error)
      alert(`❌ Failed to build app support: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-400/10'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10'
      case 'high': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'conservative': return 'text-blue-400 bg-blue-400/10'
      case 'balanced': return 'text-purple-400 bg-purple-400/10'
      case 'aggressive': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-white/60 mb-8">
          <Link href="/admin" className="hover:text-white transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/admin" className="hover:text-white transition-colors">
            Admin Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">AI Learning Approvals</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🧠 AI Learning Management
          </h1>
          <p className="text-white/70">
            Review AI-discovered optimizations and manage app support library
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'pending'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Pending Learnings ({pendingApprovals.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('supported')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'supported'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Currently Supported Apps ({supportedApps.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('unsupported')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'unsupported'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Build App Support ({unsupportedApps.length})</span>
            </div>
          </button>
        </div>

        {activeTab === 'pending' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="glass-card p-4 rounded-xl border border-glass-200">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-white/60" />
                  <select
                    value={selectedApp}
                    onChange={(e) => setSelectedApp(e.target.value)}
                    className="bg-glass-100 border border-glass-200 rounded-lg px-3 py-1 text-white text-sm"
                  >
                    <option value="all">All Apps</option>
                    <option value="com.google.Chrome">Chrome</option>
                    <option value="com.tinyspeck.slackmacgap">Slack</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-white/60" />
                  <select
                    value={selectedRisk}
                    onChange={(e) => setSelectedRisk(e.target.value)}
                    className="bg-glass-100 border border-glass-200 rounded-lg px-3 py-1 text-white text-sm"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-white/60" />
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-glass-100 border border-glass-200 rounded-lg px-3 py-1 text-white text-sm"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 3 months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <motion.div
                  key={approval.id}
                  className="glass-card p-6 rounded-xl border border-glass-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* App Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <span className="text-xl">🌐</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {approval.app_name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStrategyColor(approval.strategy_type)}`}>
                            {approval.strategy_type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(approval.risk_level)}`}>
                            {approval.risk_level} risk
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm text-white/60">
                        <div>{approval.sample_size} users</div>
                        <div>{approval.confidence_score * 100}% confidence</div>
                      </div>
                    </div>
                  </div>

                  {/* Learning Description */}
                  <div className="bg-glass-100 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-white/80 mb-2">
                      💡 What we learned:
                    </h4>
                    <p className="text-white/90 leading-relaxed">
                      {approval.plain_english_description}
                    </p>
                  </div>

                  {/* Impact Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-400/10 rounded-lg p-3 text-center">
                      <div className="text-green-400 font-bold text-lg">
                        {approval.estimated_impact.memory_savings_mb}MB
                      </div>
                      <div className="text-xs text-white/60">Memory Savings</div>
                    </div>
                    <div className="bg-blue-400/10 rounded-lg p-3 text-center">
                      <div className="text-blue-400 font-bold text-lg">
                        +{approval.estimated_impact.speed_improvement_percent}%
                      </div>
                      <div className="text-xs text-white/60">Speed Improvement</div>
                    </div>
                    <div className="bg-purple-400/10 rounded-lg p-3 text-center">
                      <div className="text-purple-400 font-bold text-lg">
                        {Math.round(approval.avg_effectiveness * 100)}%
                      </div>
                      <div className="text-xs text-white/60">Success Rate</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{approval.supporting_data_points} data points</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(approval.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleReject(approval)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleApprove(approval)}
                        className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg transition-all font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve & Deploy</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'supported' && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 rounded-xl border border-glass-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{supportedApps.length}</div>
                    <div className="text-xs text-white/60">Supported Apps</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-glass-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">
                      {supportedApps.reduce((sum, app) => sum + (app.user_count || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-white/60">Total Users</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-glass-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-400/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">
                      {Math.round((supportedApps.reduce((sum, app) => sum + (app.avg_effectiveness || 0), 0) / supportedApps.length) * 100)}%
                    </div>
                    <div className="text-xs text-white/60">Avg Effectiveness</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-glass-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-400/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">
                      {supportedApps.filter(app => app.support_level === 'full').length}
                    </div>
                    <div className="text-xs text-white/60">Full Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Apps List */}
            <div className="space-y-4">
              {supportedApps.map((app) => (
                <motion.div
                  key={app.id}
                  className="glass-card p-6 rounded-xl border border-glass-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-xl">✅</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-white">
                            {app.app_name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            app.support_level === 'full' 
                              ? 'text-green-400 bg-green-400/10' 
                              : 'text-yellow-400 bg-yellow-400/10'
                          }`}>
                            {app.support_level} support
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <span>📱 {app.user_count?.toLocaleString() || '0'} users</span>
                          <span>🎯 {Math.round((app.avg_effectiveness || 0) * 100)}% effective</span>
                          <span>📅 Updated {app.last_updated}</span>
                          <span>👤 by {app.created_by}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-white/60 mb-1">Strategies Available</div>
                        <div className="flex space-x-1">
                          {app.strategies_available.map((strategy) => (
                            <span
                              key={strategy}
                              className={`px-2 py-1 rounded text-xs font-medium ${getStrategyColor(strategy)}`}
                            >
                              {strategy}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
                          <Eye className="w-4 h-4 text-white/70" />
                        </button>
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Active & monitoring"></div>
                      </div>
                    </div>
                  </div>

                  {/* App ID for debugging */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="text-xs text-white/40 font-mono">
                      {app.app_id}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'unsupported' && (
          <div className="space-y-6">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 rounded-xl border border-glass-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">143</div>
                    <div className="text-xs text-white/60">Unsupported Apps</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-glass-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">12.4K</div>
                    <div className="text-xs text-white/60">Affected Users</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-glass-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-400/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">2.1GB</div>
                    <div className="text-xs text-white/60">Avg Memory Per App</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-glass-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">34%</div>
                    <div className="text-xs text-white/60">Potential Speed Gain</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unsupported Apps List */}
            <div className="space-y-4">
              {unsupportedApps.map((app) => (
                <motion.div
                  key={app.app_id}
                  className="glass-card p-6 rounded-xl border border-glass-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🎨</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {app.app_name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <span>{app.user_count} users</span>
                          <span>{app.optimization_attempts} attempts</span>
                          <span>{app.avg_memory_usage_mb}MB avg memory</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-white/60">Priority Score</div>
                        <div className="text-lg font-bold text-orange-400">
                          {Math.round(app.priority_score * 100)}%
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleBuildAppSupport(app)}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white rounded-lg transition-all font-medium"
                      >
                        <GitBranch className="w-4 h-4" />
                        <span>Build AI Support</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
// app/admin/customers/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  Users,
  Crown,
  Calendar,
  DollarSign,
  ChevronRight,
  RefreshCw,
  Mail,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Eye,
  Edit,
  Download,
  ChevronLeft,
  ArrowUpDown,
  Target,
  Filter
} from 'lucide-react'
import { Navigation, Footer } from '../../lib/components'

interface Customer {
  id: string
  clerkUserId: string
  email: string
  name: string
  plan: string
  licenseKey?: string
  stripeCustomerId?: string
  createdAt: string
  updatedAt: string
  subscription?: {
    id: string
    status: string
    planId: string
    currentPeriodEnd?: string
    trialEnd?: string
    cancelAtPeriodEnd: boolean
  }
  usage?: {
    scansPerformed: number
    memoryFreed: number
    appsOptimized: number
    lastActive?: string
    totalUsageTime: number
  }
  isPro: boolean
  isTrialing: boolean
  daysSinceSignup: number
  totalRevenue: number
  subscriberSince?: string
}

export default function CustomerManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [allCustomers, setAllCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [showAllCustomers, setShowAllCustomers] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    if (showAllCustomers) {
      fetchAllCustomers()
    }
  }, [pagination.page, sortBy, sortOrder, showAllCustomers])

  const fetchAllCustomers = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/admin/customers?page=${pagination.page}&limit=${pagination.limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      )
      const data = await response.json()
      
      if (data.success) {
        setAllCustomers(data.customers)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch customers:', data.error)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchCustomers = async (query: string) => {
    if (!query || query.trim().length < 2) return

    setLoading(true)
    setShowAllCustomers(false)
    try {
      const response = await fetch(`/api/admin/customers/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.success) {
        setCustomers(data.customers)
        setSearchPerformed(true)
      } else {
        console.error('Search failed:', data.error)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchPerformed(false)
    setShowAllCustomers(true)
    setSelectedCustomer(null)
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const performCustomerAction = async (action: string, params: any = {}) => {
    if (!selectedCustomer) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/customers/${selectedCustomer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...params })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
        // Refresh customer data
        if (showAllCustomers) {
          await fetchAllCustomers()
        } else {
          await searchCustomers(searchQuery)
        }
      } else {
        alert(`Action failed: ${data.error}`)
      }
    } catch (error) {
      alert(`Action failed: ${error.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchCustomers(searchQuery)
    }
  }

  const exportCustomers = async () => {
    try {
      const customersToExport = showAllCustomers ? allCustomers : customers
      const csvHeaders = ['Email', 'Name', 'Plan', 'Status', 'Member Since', 'Subscriber Since', 'Total Revenue', 'Days Active']
      const csvData = customersToExport.map(customer => [
        customer.email,
        customer.name || 'Anonymous',
        customer.plan,
        customer.isPro ? 'Pro' : customer.isTrialing ? 'Trial' : 'Free',
        new Date(customer.createdAt).toLocaleDateString(),
        customer.subscriberSince || 'N/A',
        `$${customer.totalRevenue.toFixed(2)}`,
        customer.daysSinceSignup.toString()
      ])

      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <Navigation />
      
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-2">
              Customer <span className="morphing-gradient">Management</span>
            </h1>
            <p className="text-white/70 text-lg">
              Search and manage Memory Monster customers
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card rounded-2xl p-6 border border-glass-200">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by email, name, or user ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <motion.button
                  onClick={() => searchCustomers(searchQuery)}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    'Search'
                  )}
                </motion.button>
                {(searchPerformed || !showAllCustomers) && (
                  <motion.button
                    onClick={clearSearch}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-3 rounded-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    Clear
                  </motion.button>
                )}
                <motion.button
                  onClick={exportCustomers}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-xl transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Download className="w-4 h-4" />
                  Export
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Summary */}
          {showAllCustomers && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass-card rounded-2xl p-6 border border-glass-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">Total Customers</span>
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{pagination.total.toLocaleString()}</div>
              </div>
              
              <div className="glass-card rounded-2xl p-6 border border-glass-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">Pro Customers</span>
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {allCustomers.filter(c => c.isPro).length}
                </div>
              </div>
              
              <div className="glass-card rounded-2xl p-6 border border-glass-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">Total Revenue</span>
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  ${allCustomers.reduce((sum, c) => sum + c.totalRevenue, 0).toFixed(0)}
                </div>
              </div>
              
              <div className="glass-card rounded-2xl p-6 border border-glass-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">Avg Revenue/Customer</span>
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  ${allCustomers.length > 0 ? (allCustomers.reduce((sum, c) => sum + c.totalRevenue, 0) / allCustomers.length).toFixed(0) : '0'}
                </div>
              </div>
            </motion.div>
          )}

          <div className={`grid gap-8 transition-all duration-500 ${
            selectedCustomer ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
          }`}>
            
            {/* Customer List/Table */}
            <div className="order-1">
              <motion.div 
                className="glass-card rounded-3xl border border-glass-200 overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                layout
              >
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-primary" />
                    <h2 className="text-white font-bold text-xl">
                      {showAllCustomers ? 'All Customers' : 'Search Results'}
                    </h2>
                    {selectedCustomer && (
                      <motion.button
                        onClick={() => setSelectedCustomer(null)}
                        className="ml-4 text-white/60 hover:text-white text-sm flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                      >
                        <XCircle className="w-4 h-4" />
                        Close Details
                      </motion.button>
                    )}
                  </div>
                  <div className="text-white/60 text-sm">
                    {showAllCustomers 
                      ? `${allCustomers.length} of ${pagination.total} customers`
                      : `${customers.length} results`
                    }
                  </div>
                </div>

                {showAllCustomers ? (
                  <AllCustomersTable 
                    customers={allCustomers}
                    loading={loading}
                    pagination={pagination}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    onPageChange={handlePageChange}
                    onSelectCustomer={setSelectedCustomer}
                    selectedCustomer={selectedCustomer}
                    compact={!!selectedCustomer}
                  />
                ) : (
                  <SearchResultsList 
                    customers={customers}
                    loading={loading}
                    searchPerformed={searchPerformed}
                    onSelectCustomer={setSelectedCustomer}
                    selectedCustomer={selectedCustomer}
                  />
                )}
              </motion.div>
            </div>

            {/* Customer Details - Only show when selected */}
            {selectedCustomer && (
              <motion.div 
                className="order-2"
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div className="glass-card rounded-3xl p-8 border border-glass-200 sticky top-6">
                  <CustomerDetails 
                    customer={selectedCustomer}
                    onAction={performCustomerAction}
                    actionLoading={actionLoading}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Customer Card Component
interface CustomerCardProps {
  customer: Customer
  isSelected: boolean
  onClick: () => void
}

const CustomerCard = ({ customer, isSelected, onClick }: CustomerCardProps) => {
  const getStatusColor = () => {
    if (customer.isPro) return 'text-green-400'
    if (customer.isTrialing) return 'text-blue-400'
    return 'text-gray-400'
  }

  const getStatusIcon = () => {
    if (customer.isPro) return <CheckCircle className="w-4 h-4" />
    if (customer.isTrialing) return <Calendar className="w-4 h-4" />
    return <XCircle className="w-4 h-4" />
  }

  return (
    <motion.div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-primary/50 bg-primary/10' 
          : 'border-glass-200 hover:border-glass-300 hover:bg-white/5'
      }`}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {customer.name?.charAt(0) || customer.email?.charAt(0) || '?'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`text-xs font-medium ${getStatusColor()}`}>
              {customer.isPro ? 'Pro' : customer.isTrialing ? 'Trial' : 'Free'}
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-white/60" />
      </div>
      
      <div className="text-white font-medium text-sm mb-1">
        {customer.name || 'Anonymous'}
      </div>
      <div className="text-white/60 text-xs mb-2">
        {customer.email}
      </div>
      <div className="text-white/50 text-xs">
        {customer.daysSinceSignup} days ago
      </div>
    </motion.div>
  )
}

// Customer Details Component
interface CustomerDetailsProps {
  customer: Customer
  onAction: (action: string, params?: any) => void
  actionLoading: boolean
}

const CustomerDetails = ({ customer, onAction, actionLoading }: CustomerDetailsProps) => {
  return (
    <div>
      {/* Customer Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {customer.name?.charAt(0) || customer.email?.charAt(0) || '?'}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {customer.name || 'Anonymous User'}
            </h2>
            <p className="text-white/70">{customer.email}</p>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          customer.isPro 
            ? 'bg-green-500/20 text-green-400' 
            : customer.isTrialing
            ? 'bg-blue-500/20 text-blue-400'
            : 'bg-gray-500/20 text-gray-400'
        }`}>
          {customer.isPro ? 'Pro Customer' : customer.isTrialing ? 'Trial User' : 'Free User'}
        </div>
      </div>

      {/* Customer Info Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <InfoItem label="User ID" value={customer.clerkUserId} />
          <InfoItem label="Plan" value={customer.plan} />
          <InfoItem label="Member Since" value={new Date(customer.createdAt).toLocaleDateString()} />
          <InfoItem label="Total Revenue" value={`$${customer.totalRevenue.toFixed(2)}`} />
          {customer.licenseKey && (
            <InfoItem label="License Key" value={customer.licenseKey} />
          )}
        </div>
        
        <div className="space-y-4">
          {customer.subscription && (
            <>
              <InfoItem label="Subscription Status" value={customer.subscription.status} />
              <InfoItem label="Plan ID" value={customer.subscription.planId} />
              {customer.subscription.currentPeriodEnd && (
                <InfoItem 
                  label="Current Period End" 
                  value={new Date(customer.subscription.currentPeriodEnd).toLocaleDateString()} 
                />
              )}
              {customer.subscription.trialEnd && (
                <InfoItem 
                  label="Trial End" 
                  value={new Date(customer.subscription.trialEnd).toLocaleDateString()} 
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      {customer.usage && (
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Usage Statistics</h3>
          <div className="grid grid-cols-4 gap-4">
            <UsageCard 
              label="Scans Performed" 
              value={customer.usage.scansPerformed.toLocaleString()}
              icon={<Settings className="w-5 h-5" />}
            />
            <UsageCard 
              label="Memory Freed" 
              value={`${(customer.usage.memoryFreed / 1024).toFixed(1)}GB`}
              icon={<RefreshCw className="w-5 h-5" />}
            />
            <UsageCard 
              label="Apps Optimized" 
              value={customer.usage.appsOptimized.toLocaleString()}
              icon={<CheckCircle className="w-5 h-5" />}
            />
            <UsageCard 
              label="Usage Time" 
              value={`${Math.round(customer.usage.totalUsageTime / 60)}h`}
              icon={<Calendar className="w-5 h-5" />}
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="border-t border-white/10 pt-8">
        <h3 className="text-white font-semibold text-lg mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {!customer.isPro && (
            <ActionButton
              label="Upgrade to Pro"
              onClick={() => onAction('upgrade_to_pro')}
              disabled={actionLoading}
              variant="success"
            />
          )}
          
          {customer.isPro && (
            <ActionButton
              label="Downgrade to Free"
              onClick={() => onAction('downgrade_to_free')}
              disabled={actionLoading}
              variant="warning"
            />
          )}
          
          <ActionButton
            label="Extend Trial (7 days)"
            onClick={() => onAction('extend_trial', { days: 7 })}
            disabled={actionLoading}
            variant="primary"
          />
          
          <ActionButton
            label="Reset Usage Stats"
            onClick={() => onAction('reset_usage')}
            disabled={actionLoading}
            variant="secondary"
          />
          
          <ActionButton
            label="Generate New License"
            onClick={() => onAction('generate_new_license')}
            disabled={actionLoading}
            variant="secondary"
          />
          
          {customer.subscription && customer.subscription.status === 'active' && (
            <ActionButton
              label="Cancel Subscription"
              onClick={() => {
                if (confirm('Are you sure you want to cancel this subscription?')) {
                  onAction('cancel_subscription')
                }
              }}
              disabled={actionLoading}
              variant="danger"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Helper Components
const InfoItem = ({ label, value }: { label: string, value: string }) => (
  <div>
    <div className="text-white/60 text-sm">{label}</div>
    <div className="text-white font-medium">{value}</div>
  </div>
)

const UsageCard = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
    <div className="flex items-center gap-2 mb-2">
      <div className="text-primary">{icon}</div>
      <div className="text-white/60 text-sm">{label}</div>
    </div>
    <div className="text-white font-bold text-lg">{value}</div>
  </div>
)

const ActionButton = ({ 
  label, 
  onClick, 
  disabled, 
  variant = 'primary' 
}: { 
  label: string
  onClick: () => void
  disabled: boolean
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary/80',
    secondary: 'bg-gray-600 hover:bg-gray-700',
    success: 'bg-green-600 hover:bg-green-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    danger: 'bg-red-600 hover:bg-red-700'
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
    </motion.button>
  )
}

// All Customers Table Component
interface AllCustomersTableProps {
  customers: Customer[]
  loading: boolean
  pagination: any
  sortBy: string
  sortOrder: string
  onSort: (column: string) => void
  onPageChange: (page: number) => void
  onSelectCustomer: (customer: Customer) => void
  selectedCustomer: Customer | null
  compact?: boolean
}

const AllCustomersTable = ({ 
  customers, 
  loading, 
  pagination, 
  sortBy, 
  sortOrder, 
  onSort, 
  onPageChange, 
  onSelectCustomer,
  selectedCustomer,
  compact = false
}: AllCustomersTableProps) => {
  
  const SortableHeader = ({ label, sortKey }: { label: string, sortKey: string }) => {
    const isActive = sortBy === sortKey
    
    return (
      <button
        onClick={() => onSort(sortKey)}
        className="flex items-center gap-1 hover:text-white transition-colors text-left"
      >
        {label}
        <ArrowUpDown className={`w-3 h-3 ${isActive ? 'text-primary' : 'text-white/40'}`} />
      </button>
    )
  }

  const getStatusDisplay = (customer: Customer) => {
    if (customer.isPro) {
      return (
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Pro</span>
        </div>
      )
    } else if (customer.isTrialing) {
      return (
        <div className="flex items-center gap-2 text-blue-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Trial</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-2 text-gray-400">
          <XCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Free</span>
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`grid gap-4 p-4 bg-white/5 rounded-lg animate-pulse ${
              compact ? 'grid-cols-3' : 'grid-cols-6'
            }`}>
              <div className="h-4 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded"></div>
              {!compact && (
                <>
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-4 bg-white/10 rounded"></div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <div className="p-6 text-center py-12">
        <User className="w-12 h-12 text-white/40 mx-auto mb-4" />
        <p className="text-white/60">No customers found</p>
      </div>
    )
  }

  return (
    <>
      {/* Table Header */}
      <div className="bg-white/5 border-b border-white/10 p-4">
        <div className={`grid gap-4 text-white/80 text-sm font-medium ${
          compact ? 'grid-cols-3' : 'grid-cols-6'
        }`}>
          <SortableHeader label="Customer" sortKey="full_name" />
          {!compact && (
            <>
              <SortableHeader label="Plan" sortKey="plan" />
              <span>Status</span>
              <SortableHeader label="Member Since" sortKey="created_at" />
              <SortableHeader label="Revenue" sortKey="total_revenue" />
              <span>Actions</span>
            </>
          )}
          {compact && (
            <>
              <span>Status</span>
              <SortableHeader label="Revenue" sortKey="total_revenue" />
            </>
          )}
        </div>
      </div>

      {/* Table Body */}
      <div className="p-4">
        <div className="space-y-2">
          {customers.map((customer, index) => (
            <motion.div
              key={customer.id}
              className={`grid gap-4 p-4 rounded-lg transition-colors cursor-pointer ${
                selectedCustomer?.id === customer.id 
                  ? 'bg-primary/20 border border-primary/30' 
                  : 'bg-white/5 hover:bg-white/10'
              } ${compact ? 'grid-cols-3' : 'grid-cols-6'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => onSelectCustomer(customer)}
              layout
            >
              {/* Customer Info */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {customer.name?.charAt(0) || customer.email?.charAt(0) || '?'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-medium text-sm truncate">
                    {customer.name || 'Anonymous'}
                  </div>
                  <div className="text-white/60 text-xs truncate">
                    {customer.email}
                  </div>
                </div>
              </div>

              {!compact && (
                <>
                  {/* Plan */}
                  <div className="flex items-center">
                    <span className="text-white text-sm capitalize">{customer.plan}</span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    {getStatusDisplay(customer)}
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center">
                    <span className="text-white/80 text-sm">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Revenue */}
                  <div className="flex items-center">
                    <span className="text-green-400 font-semibold text-sm">
                      ${customer.totalRevenue.toFixed(2)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center">
                    <span className="text-primary hover:text-primary/80 text-sm font-medium">
                      View Details
                    </span>
                  </div>
                </>
              )}

              {compact && (
                <>
                  {/* Status */}
                  <div className="flex items-center justify-center">
                    {getStatusDisplay(customer)}
                  </div>

                  {/* Revenue */}
                  <div className="flex items-center justify-end">
                    <span className="text-green-400 font-semibold text-sm">
                      ${customer.totalRevenue.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="text-white/60 text-sm">
              {compact ? (
                `Page ${pagination.page}/${pagination.totalPages}`
              ) : (
                `Showing ${((pagination.page - 1) * pagination.limit) + 1} to ${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} customers`
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="p-2 rounded-lg border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                whileHover={{ scale: pagination.hasPrev ? 1.05 : 1 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              
              {!compact && (
                <span className="px-4 py-2 text-white font-medium">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
              )}
              
              <motion.button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="p-2 rounded-lg border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                whileHover={{ scale: pagination.hasNext ? 1.05 : 1 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Search Results List Component
interface SearchResultsListProps {
  customers: Customer[]
  loading: boolean
  searchPerformed: boolean
  onSelectCustomer: (customer: Customer) => void
  selectedCustomer: Customer | null
}

const SearchResultsList = ({ 
  customers, 
  loading, 
  searchPerformed, 
  onSelectCustomer, 
  selectedCustomer 
}: SearchResultsListProps) => {
  if (!searchPerformed) {
    return (
      <div className="p-6 text-center py-12">
        <Search className="w-12 h-12 text-white/40 mx-auto mb-4" />
        <p className="text-white/60">Search for specific customers above</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
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
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <div className="p-6 text-center py-12">
        <User className="w-12 h-12 text-white/40 mx-auto mb-4" />
        <p className="text-white/60">No customers found matching your search</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {customers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            isSelected={selectedCustomer?.id === customer.id}
            onClick={() => onSelectCustomer(customer)}
          />
        ))}
      </div>
    </div>
  )
}
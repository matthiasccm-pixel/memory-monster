// app/admin/jobs/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Clock,
  Users,
  Briefcase,
  Search,
  RefreshCw
} from 'lucide-react'
import { Navigation, Footer, FloatingElements } from '../../lib/components'

interface JobListing {
  id: string
  title: string
  slug: string
  department: string
  location: string
  employment_type: string
  experience_level: string
  description: string
  requirements?: string
  responsibilities?: string
  benefits?: string
  salary_min?: number
  salary_max?: number
  salary_currency: string
  remote_friendly: boolean
  featured: boolean
  status: string
  posted_by: string
  tags: string[]
  published_at: string
  created_at: string
  updated_at: string
}

export default function AdminJobsPage() {
  const { user, isLoaded } = useUser()
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('active')

  const departments = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Operations', 'Data', 'AI/ML', 'QA']
  const statuses = ['active', 'paused', 'closed']

  useEffect(() => {
    if (isLoaded) {
      fetchJobs()
    }
  }, [isLoaded, selectedDepartment, selectedStatus])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        limit: '50',
        status: selectedStatus
      })
      
      if (selectedDepartment !== 'All') {
        params.append('department', selectedDepartment)
      }
      
      const response = await fetch(`/api/jobs/listings?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch jobs')
      }
      
      if (data.success) {
        setJobs(data.jobs || [])
      } else {
        throw new Error(data.error || 'Invalid response format')
      }
    } catch (error: any) {
      console.error('Failed to fetch jobs:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job listing?')) return
    
    try {
      const response = await fetch(`/api/jobs/listings/${jobId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setJobs(jobs.filter(job => job.id !== jobId))
      } else {
        const data = await response.json()
        alert(`Failed to delete job: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Error deleting job: ${error.message}`)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen animated-bg relative overflow-hidden flex items-center justify-center">
        <FloatingElements />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white/70">Loading jobs admin...</p>
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
              <h2 className="text-white font-bold text-2xl mb-4">Access Denied</h2>
              <p className="text-white/70 mb-6">{error}</p>
              <motion.button
                onClick={fetchJobs}
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
                  Jobs <span className="morphing-gradient">Administration</span>
                </h1>
                <p className="text-white/70 text-lg">
                  Manage job listings and career opportunities
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={fetchJobs}
                  disabled={loading}
                  className="glass-card border border-glass-200 hover:border-glass-300 text-white p-3 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 glass-card border border-glass-200 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
              
              {/* Department Filter */}
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-3 glass-card border border-glass-200 rounded-xl text-white bg-transparent focus:outline-none focus:border-white/30"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept} className="bg-gray-900 text-white">
                    {dept}
                  </option>
                ))}
              </select>
              
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 glass-card border border-glass-200 rounded-xl text-white bg-transparent focus:outline-none focus:border-white/30"
              >
                {statuses.map(status => (
                  <option key={status} value={status} className="bg-gray-900 text-white">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Jobs Grid */}
          {filteredJobs.length > 0 ? (
            <div className="grid gap-6">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  className="glass-card rounded-3xl p-8 border border-glass-200"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white font-bold text-xl mb-2">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.employment_type}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {job.featured && (
                            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                              Featured
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${ 
                            job.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            job.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-white/80 leading-relaxed mb-4 line-clamp-2">
                        {job.description.substring(0, 200)}...
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {job.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/60 border border-white/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => window.open(`/careers/${job.slug}`, '_blank')}
                        className="glass-card border border-glass-200 hover:border-glass-300 text-white p-3 rounded-xl transition-all"
                        whileHover={{ scale: 1.05 }}
                        title="View Job"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteJob(job.id)}
                        className="glass-card border border-red-500/30 hover:border-red-500/50 text-red-400 p-3 rounded-xl transition-all"
                        whileHover={{ scale: 1.05 }}
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Users className="w-16 h-16 text-white/20 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">No Jobs Found</h3>
              <p className="text-white/60 mb-8">
                {searchQuery || selectedDepartment !== 'All' ? 'Try adjusting your search or filter criteria.' : 'No job listings available.'}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
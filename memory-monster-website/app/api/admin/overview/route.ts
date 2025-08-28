// app/api/admin/overview/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'
import { requireAdmin } from '@/app/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    // Check admin authentication
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const range = searchParams.get('range') || '30d'

    console.log(`🔍 ADMIN: Fetching overview metrics for range: ${range}`)

    // Calculate date ranges
    const now = new Date()
    const { startDate, endDate, previousStartDate, previousEndDate } = getDateRange(range, now)

    console.log(`Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`)
    console.log(`Previous range: ${previousStartDate.toISOString()} to ${previousEndDate.toISOString()}`)

    // Get current period metrics
    const currentMetrics = await getMetricsForPeriod(startDate, endDate)
    
    // Get previous period metrics for comparison
    const previousMetrics = await getMetricsForPeriod(previousStartDate, previousEndDate)

    // Get chart data
    const chartData = await getChartData(startDate, endDate, range)

    console.log('✅ ADMIN: Overview metrics fetched successfully')

    const response = {
      success: true,
      metrics: {
        ...currentMetrics,
        chartData,
        previousPeriod: previousMetrics
      },
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('🚨 ADMIN: Overview API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch admin overview'
    }, { status: error.message?.includes('Unauthorized') ? 403 : 500 })
  }
}

function getDateRange(range: string, now: Date) {
  let startDate: Date, endDate: Date, previousStartDate: Date, previousEndDate: Date

  switch (range) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      previousStartDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000)
      previousEndDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000)
      break

    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      endDate = now
      previousStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000)
      previousEndDate = startDate
      break

    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      endDate = now
      previousStartDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      previousEndDate = startDate
      break

    case 'week':
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      startOfWeek.setHours(0, 0, 0, 0)
      startDate = startOfWeek
      endDate = now
      previousStartDate = new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000)
      previousEndDate = startOfWeek
      break

    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = now
      previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      previousEndDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
      break

    case '12m':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      endDate = now
      previousStartDate = new Date(startDate.getTime() - 365 * 24 * 60 * 60 * 1000)
      previousEndDate = startDate
      break

    case 'ytd':
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = now
      previousStartDate = new Date(now.getFullYear() - 1, 0, 1)
      previousEndDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59)
      break

    case 'all':
    default:
      startDate = new Date('2020-01-01') // Assuming service started around 2020
      endDate = now
      previousStartDate = new Date('2020-01-01')
      previousEndDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
  }

  return { startDate, endDate, previousStartDate, previousEndDate }
}

async function getMetricsForPeriod(startDate: Date, endDate: Date) {
  // Get total users in period
  const { count: totalUsers } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  // Get pro subscribers (active subscriptions)
  const { count: proSubscribers } = await supabaseAdmin
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  // Get trial users
  const { count: activeTrials } = await supabaseAdmin
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'trialing')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  // Get signups in period
  const { count: todaySignups } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  // Calculate revenue for the period
  const { data: subscriptions } = await supabaseAdmin
    .from('subscriptions')
    .select('plan_id, created_at')
    .eq('status', 'active')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  let monthlyRevenue = 0
  if (subscriptions) {
    monthlyRevenue = subscriptions.reduce((total, sub) => {
      if (sub.plan_id === 'pro_monthly') return total + 4.99
      if (sub.plan_id === 'pro_yearly') return total + (39.99 / 12)
      return total
    }, 0)
  }

  // Get churn in period
  const { count: churnThisMonth } = await supabaseAdmin
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'canceled')
    .gte('updated_at', startDate.toISOString())
    .lte('updated_at', endDate.toISOString())

  return {
    totalUsers: totalUsers || 0,
    proSubscribers: proSubscribers || 0,
    monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
    todaySignups: todaySignups || 0,
    activeTrials: activeTrials || 0,
    churnThisMonth: churnThisMonth || 0,
    conversionRate: totalUsers > 0 ? ((proSubscribers || 0) / (totalUsers || 1) * 100).toFixed(1) : '0',
    trialConversionRate: (activeTrials || 0) > 0 ? ((proSubscribers || 0) / ((activeTrials || 0) + (proSubscribers || 0)) * 100).toFixed(1) : '0'
  }
}

async function getChartData(startDate: Date, endDate: Date, range: string) {
  // Determine the interval for data points
  const intervals = getIntervals(startDate, endDate, range)
  const chartData = []

  for (const interval of intervals) {
    const { start, end, label } = interval

    // Get metrics for this interval
    const { count: users } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', start.toISOString())
      .lt('created_at', end.toISOString())

    const { count: signups } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', start.toISOString())
      .lt('created_at', end.toISOString())

    const { count: conversions } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gte('created_at', start.toISOString())
      .lt('created_at', end.toISOString())

    // Calculate revenue for this interval
    const { data: intervalSubs } = await supabaseAdmin
      .from('subscriptions')
      .select('plan_id')
      .eq('status', 'active')
      .gte('created_at', start.toISOString())
      .lt('created_at', end.toISOString())

    let revenue = 0
    if (intervalSubs) {
      revenue = intervalSubs.reduce((total, sub) => {
        if (sub.plan_id === 'pro_monthly') return total + 4.99
        if (sub.plan_id === 'pro_yearly') return total + (39.99 / 12)
        return total
      }, 0)
    }

    chartData.push({
      date: label,
      users: users || 0,
      revenue: Math.round(revenue * 100) / 100,
      signups: signups || 0,
      conversions: conversions || 0
    })
  }

  return chartData
}

function getIntervals(startDate: Date, endDate: Date, range: string) {
  const intervals = []
  const diffTime = endDate.getTime() - startDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  let intervalSize: number
  let intervalUnit: 'hour' | 'day' | 'week' | 'month'

  // Determine interval based on range
  if (range === 'today') {
    intervalSize = 2 // 2-hour intervals
    intervalUnit = 'hour'
  } else if (diffDays <= 7) {
    intervalSize = 1 // Daily intervals
    intervalUnit = 'day'
  } else if (diffDays <= 30) {
    intervalSize = 1 // Daily intervals  
    intervalUnit = 'day'
  } else if (diffDays <= 90) {
    intervalSize = 1 // Weekly intervals
    intervalUnit = 'week'
  } else {
    intervalSize = 1 // Monthly intervals
    intervalUnit = 'month'
  }

  let current = new Date(startDate)

  while (current < endDate) {
    let next: Date

    switch (intervalUnit) {
      case 'hour':
        next = new Date(current.getTime() + intervalSize * 60 * 60 * 1000)
        break
      case 'day':
        next = new Date(current.getTime() + intervalSize * 24 * 60 * 60 * 1000)
        break
      case 'week':
        next = new Date(current.getTime() + intervalSize * 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        next = new Date(current.getFullYear(), current.getMonth() + intervalSize, current.getDate())
        break
    }

    if (next > endDate) next = endDate

    intervals.push({
      start: new Date(current),
      end: new Date(next),
      label: current.toISOString().split('T')[0] // YYYY-MM-DD format
    })

    current = next
  }

  return intervals
}
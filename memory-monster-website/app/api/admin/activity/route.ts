// app/api/admin/activity/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'
import { requireAdmin } from '@/app/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    // Check admin authentication
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const days = parseInt(searchParams.get('days') || '7')

    console.log(`🔍 ADMIN: Fetching recent activity (${days} days, limit ${limit})`)

    const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    // Get recent signups
    const { data: recentSignups, error: signupsError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, created_at, plan')
      .gte('created_at', dateThreshold.toISOString())
      .order('created_at', { ascending: false })
      .limit(20)

    // Get recent pro upgrades
    const { data: recentUpgrades, error: upgradesError } = await supabaseAdmin
      .from('subscriptions')
      .select(`
        id, 
        created_at, 
        plan_id, 
        status,
        user_id,
        profiles!inner(email, full_name)
      `)
      .gte('created_at', dateThreshold.toISOString())
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(20)

    // Get recent cancellations
    const { data: recentCancellations, error: cancellationsError } = await supabaseAdmin
      .from('subscriptions')
      .select(`
        id, 
        updated_at, 
        plan_id, 
        status,
        user_id,
        profiles!inner(email, full_name)
      `)
      .gte('updated_at', dateThreshold.toISOString())
      .eq('status', 'canceled')
      .order('updated_at', { ascending: false })
      .limit(20)

    // Get recent downloads
    const { data: recentDownloads, error: downloadsError } = await supabaseAdmin
      .from('downloads')
      .select(`
        id,
        platform,
        version,
        created_at,
        user_id,
        profiles!inner(email, full_name)
      `)
      .gte('created_at', dateThreshold.toISOString())
      .order('created_at', { ascending: false })
      .limit(20)

    // Format activity feed
    const activities = []

    // Add signups
    if (recentSignups) {
      recentSignups.forEach(signup => {
        activities.push({
          id: `signup-${signup.id}`,
          type: 'signup',
          title: 'New User Signup',
          description: `${signup.full_name || signup.email} joined`,
          user: {
            email: signup.email,
            name: signup.full_name
          },
          timestamp: signup.created_at,
          icon: 'user-plus',
          color: 'blue'
        })
      })
    }

    // Add upgrades
    if (recentUpgrades) {
      recentUpgrades.forEach(upgrade => {
        activities.push({
          id: `upgrade-${upgrade.id}`,
          type: 'upgrade',
          title: 'Pro Upgrade',
          description: `${upgrade.profiles.full_name || upgrade.profiles.email} upgraded to ${upgrade.plan_id}`,
          user: {
            email: upgrade.profiles.email,
            name: upgrade.profiles.full_name
          },
          timestamp: upgrade.created_at,
          icon: 'crown',
          color: 'green'
        })
      })
    }

    // Add cancellations
    if (recentCancellations) {
      recentCancellations.forEach(cancellation => {
        activities.push({
          id: `cancel-${cancellation.id}`,
          type: 'cancellation',
          title: 'Subscription Canceled',
          description: `${cancellation.profiles.full_name || cancellation.profiles.email} canceled ${cancellation.plan_id}`,
          user: {
            email: cancellation.profiles.email,
            name: cancellation.profiles.full_name
          },
          timestamp: cancellation.updated_at,
          icon: 'x-circle',
          color: 'red'
        })
      })
    }

    // Add downloads
    if (recentDownloads) {
      recentDownloads.forEach(download => {
        activities.push({
          id: `download-${download.id}`,
          type: 'download',
          title: 'App Download',
          description: `${download.profiles.full_name || download.profiles.email} downloaded ${download.platform} v${download.version}`,
          user: {
            email: download.profiles.email,
            name: download.profiles.full_name
          },
          timestamp: download.created_at,
          icon: 'download',
          color: 'purple'
        })
      })
    }

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Limit to requested amount
    const limitedActivities = activities.slice(0, limit)

    console.log(`✅ ADMIN: Found ${limitedActivities.length} recent activities`)

    return NextResponse.json({
      success: true,
      activities: limitedActivities,
      total: limitedActivities.length,
      period: `${days} days`,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('🚨 ADMIN: Recent activity API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch recent activity'
    }, { status: error.message?.includes('Unauthorized') ? 403 : 500 })
  }
}
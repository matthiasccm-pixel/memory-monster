// app/api/admin/customers/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'
import { requireAdmin } from '@/app/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    // Check admin authentication
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Search query must be at least 2 characters'
      }, { status: 400 })
    }

    console.log(`🔍 ADMIN: Searching customers with query: "${query}"`)

    // Search customers by email, name, or clerk_user_id
    const { data: customers, error: searchError } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        clerk_user_id,
        email,
        full_name,
        plan,
        license_key,
        stripe_customer_id,
        created_at,
        updated_at,
        subscriptions (
          id,
          stripe_subscription_id,
          status,
          plan_id,
          current_period_start,
          current_period_end,
          trial_end,
          cancel_at_period_end,
          created_at
        ),
        app_usage (
          memory_scans_performed,
          memory_freed_mb,
          apps_optimized,
          last_active,
          total_usage_time_minutes
        )
      `)
      .or(`email.ilike.%${query}%, full_name.ilike.%${query}%, clerk_user_id.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (searchError) {
      console.error('🚨 ADMIN: Customer search error:', searchError)
      return NextResponse.json({
        success: false,
        error: 'Failed to search customers'
      }, { status: 500 })
    }

    // Format the results
    const formattedCustomers = customers?.map(customer => {
      const subscription = Array.isArray(customer.subscriptions) 
        ? customer.subscriptions[0] 
        : customer.subscriptions

      const usage = Array.isArray(customer.app_usage)
        ? customer.app_usage[0]
        : customer.app_usage

      return {
        id: customer.id,
        clerkUserId: customer.clerk_user_id,
        email: customer.email,
        name: customer.full_name,
        plan: customer.plan,
        licenseKey: customer.license_key,
        stripeCustomerId: customer.stripe_customer_id,
        createdAt: customer.created_at,
        updatedAt: customer.updated_at,
        
        subscription: subscription ? {
          id: subscription.id,
          stripeSubscriptionId: subscription.stripe_subscription_id,
          status: subscription.status,
          planId: subscription.plan_id,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          trialEnd: subscription.trial_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          createdAt: subscription.created_at
        } : null,
        
        usage: usage ? {
          scansPerformed: usage.memory_scans_performed || 0,
          memoryFreed: usage.memory_freed_mb || 0,
          appsOptimized: usage.apps_optimized || 0,
          lastActive: usage.last_active,
          totalUsageTime: usage.total_usage_time_minutes || 0
        } : null,
        
        // Computed fields
        isPro: subscription?.status === 'active' || subscription?.status === 'trialing',
        isTrialing: subscription?.status === 'trialing',
        daysSinceSignup: Math.floor((Date.now() - new Date(customer.created_at).getTime()) / (1000 * 60 * 60 * 24))
      }
    }) || []

    console.log(`✅ ADMIN: Found ${formattedCustomers.length} customers`)

    return NextResponse.json({
      success: true,
      customers: formattedCustomers,
      total: formattedCustomers.length,
      query,
      limit,
      offset
    })

  } catch (error) {
    console.error('🚨 ADMIN: Customer search API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to search customers'
    }, { status: error.message?.includes('Unauthorized') ? 403 : 500 })
  }
}
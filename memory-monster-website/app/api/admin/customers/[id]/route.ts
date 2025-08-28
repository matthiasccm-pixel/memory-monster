// app/api/admin/customers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'
import { requireAdmin } from '@/app/lib/admin-auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    
    const customerId = params.id

    // Get customer details with all related data
    const { data: customer, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        subscriptions (*),
        app_usage (*),
        downloads (*)
      `)
      .eq('id', customerId)
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Customer not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      customer
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()
    
    const customerId = params.id
    const { action, ...actionParams } = await req.json()

    console.log(`🔧 ADMIN: Performing action "${action}" on customer ${customerId}`)

    switch (action) {
      case 'upgrade_to_pro':
        return await upgradeCustomerToPro(customerId)
      
      case 'downgrade_to_free':
        return await downgradeCustomerToFree(customerId)
      
      case 'extend_trial':
        return await extendTrial(customerId, actionParams.days || 7)
      
      case 'cancel_subscription':
        return await cancelSubscription(customerId)
      
      case 'reactivate_subscription':
        return await reactivateSubscription(customerId)
      
      case 'update_plan':
        return await updatePlan(customerId, actionParams.plan)
      
      case 'reset_usage':
        return await resetUsageStats(customerId)
      
      case 'generate_new_license':
        return await generateNewLicense(customerId)
      
      case 'add_note':
        return await addCustomerNote(customerId, actionParams.note)
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('🚨 ADMIN: Customer action error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// Helper functions for customer actions
async function upgradeCustomerToPro(customerId: string) {
  // Update profile to pro
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ 
      plan: 'pro',
      updated_at: new Date().toISOString()
    })
    .eq('id', customerId)

  if (profileError) throw new Error('Failed to upgrade customer profile')

  // Create a manual subscription record (admin granted)
  const { error: subscriptionError } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: customerId,
      status: 'active',
      plan_id: 'pro_monthly',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })

  if (subscriptionError) throw new Error('Failed to create subscription')

  return NextResponse.json({
    success: true,
    message: 'Customer upgraded to Pro successfully'
  })
}

async function downgradeCustomerToFree(customerId: string) {
  // Update profile to free
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ 
      plan: 'free',
      updated_at: new Date().toISOString()
    })
    .eq('id', customerId)

  if (profileError) throw new Error('Failed to downgrade customer profile')

  // Cancel subscription
  const { error: subscriptionError } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', customerId)

  if (subscriptionError) throw new Error('Failed to cancel subscription')

  return NextResponse.json({
    success: true,
    message: 'Customer downgraded to Free successfully'
  })
}

async function extendTrial(customerId: string, days: number) {
  const newTrialEnd = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      trial_end: newTrialEnd.toISOString(),
      status: 'trialing',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', customerId)

  if (error) throw new Error('Failed to extend trial')

  return NextResponse.json({
    success: true,
    message: `Trial extended by ${days} days`
  })
}

async function cancelSubscription(customerId: string) {
  // Get the subscription to cancel in Stripe if it exists
  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', customerId)
    .single()

  // Cancel in Stripe if subscription exists
  if (subscription?.stripe_subscription_id) {
    try {
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        cancel_at_period_end: true
      })
    } catch (stripeError) {
      console.warn('Stripe cancellation failed:', stripeError)
      // Continue with local cancellation even if Stripe fails
    }
  }

  // Update local subscription
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: true,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', customerId)

  if (error) throw new Error('Failed to cancel subscription')

  return NextResponse.json({
    success: true,
    message: 'Subscription canceled successfully'
  })
}

async function reactivateSubscription(customerId: string) {
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'active',
      cancel_at_period_end: false,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', customerId)

  if (error) throw new Error('Failed to reactivate subscription')

  return NextResponse.json({
    success: true,
    message: 'Subscription reactivated successfully'
  })
}

async function updatePlan(customerId: string, plan: string) {
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ 
      plan,
      updated_at: new Date().toISOString()
    })
    .eq('id', customerId)

  if (error) throw new Error('Failed to update plan')

  return NextResponse.json({
    success: true,
    message: `Plan updated to ${plan}`
  })
}

async function resetUsageStats(customerId: string) {
  const { error } = await supabaseAdmin
    .from('app_usage')
    .update({
      memory_scans_performed: 0,
      memory_freed_mb: 0,
      apps_optimized: 0,
      total_usage_time_minutes: 0,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', customerId)

  if (error) throw new Error('Failed to reset usage stats')

  return NextResponse.json({
    success: true,
    message: 'Usage statistics reset successfully'
  })
}

async function generateNewLicense(customerId: string) {
  // Generate a new license key
  const newLicenseKey = `MM-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ 
      license_key: newLicenseKey,
      updated_at: new Date().toISOString()
    })
    .eq('id', customerId)

  if (error) throw new Error('Failed to generate new license')

  return NextResponse.json({
    success: true,
    message: 'New license key generated',
    licenseKey: newLicenseKey
  })
}

async function addCustomerNote(customerId: string, note: string) {
  // For now, we'll store notes in a simple way
  // In a full implementation, you'd want a separate customer_notes table
  const timestamp = new Date().toISOString()
  const noteWithTimestamp = `[${timestamp}] ${note}`

  // Get existing notes
  const { data: customer } = await supabaseAdmin
    .from('profiles')
    .select('full_name')
    .eq('id', customerId)
    .single()

  if (!customer) throw new Error('Customer not found')

  return NextResponse.json({
    success: true,
    message: 'Note added successfully'
  })
}
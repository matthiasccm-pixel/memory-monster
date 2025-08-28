// app/api/sync-subscription/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userEmail, deviceId, subscriptionData } = await req.json()
    
    console.log('🔄 SUBSCRIPTION: Syncing subscription for:', userEmail)
    
    if (!userEmail || !deviceId || !subscriptionData) {
      return NextResponse.json({ 
        success: false,
        error: 'Email, device ID, and subscription data required'
      }, { status: 400 })
    }

    // Create a simple user_id from email hash
    const crypto = require('crypto')
    const user_id = crypto.createHash('md5').update(userEmail).digest('hex')
    
    console.log('👤 Processing subscription for user_id:', user_id, 'email:', userEmail)

    // Ensure profile exists (create if not)
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', user_id)
      .single()

    if (!existingProfile) {
      console.log('👤 Creating profile for user_id:', user_id)
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: user_id,
          clerk_user_id: `desktop_${user_id}`,
          email: userEmail,
          full_name: userEmail.startsWith('anonymous_') ? 'Anonymous User' : 'Desktop User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (profileError) {
        console.error('👤 Profile creation error:', profileError)
        // Continue anyway
      }
    }

    // Check if subscription already exists for this user
    const { data: existingSubscription } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', user_id)
      .eq('device_id', deviceId)
      .single()

    const subscriptionRecord = {
      user_id: user_id,
      device_id: deviceId,
      plan_id: subscriptionData.planId || 'free', // 'free', 'trial', 'pro_monthly', 'pro_yearly'
      status: subscriptionData.status || 'active', // 'active', 'trialing', 'cancelled'
      cancel_at_period_end: subscriptionData.cancelAtPeriodEnd || false,
      stripe_subscription_id: subscriptionData.stripeSubscriptionId || `desktop_${user_id}_${deviceId}`,
      stripe_customer_id: subscriptionData.stripeCustomerId || `desktop_customer_${user_id}`,
      current_period_start: subscriptionData.currentPeriodStart || new Date().toISOString(),
      current_period_end: subscriptionData.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default 30 days
      trial_end: subscriptionData.trialEnd || null,
      updated_at: new Date().toISOString()
    }

    if (existingSubscription) {
      // Update existing subscription
      console.log('🔄 UPDATING existing subscription record')
      const { error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update(subscriptionRecord)
        .eq('user_id', user_id)
        .eq('device_id', deviceId)

      if (updateError) {
        console.error('🔄 SUBSCRIPTION: Update error:', updateError)
        return NextResponse.json({
          success: false,
          error: 'Failed to update subscription'
        }, { status: 500 })
      }
    } else {
      // Create new subscription
      console.log('🔄 CREATING new subscription record')
      subscriptionRecord.created_at = new Date().toISOString()
      
      const { error: insertError } = await supabaseAdmin
        .from('subscriptions')
        .insert(subscriptionRecord)

      if (insertError) {
        console.error('🔄 SUBSCRIPTION: Insert error:', insertError)
        return NextResponse.json({
          success: false,
          error: 'Failed to create subscription'
        }, { status: 500 })
      }
    }

    console.log('✅ SUBSCRIPTION: Subscription synced successfully for:', userEmail)

    return NextResponse.json({
      success: true,
      message: 'Subscription synced successfully'
    })

  } catch (error) {
    console.error('🔄 SUBSCRIPTION: Sync error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Server error during subscription sync'
    }, { status: 500 })
  }
}
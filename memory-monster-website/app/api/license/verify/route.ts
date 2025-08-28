// app/api/license/verify/route.ts - UPDATED for your actual database schema

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userEmail, deviceId, appVersion, licenseKey } = await req.json()
    
    console.log('🔐 LICENSE: Verification request for:', userEmail, 'Device:', deviceId)
    
    if (!userEmail) {
      return NextResponse.json({ 
        valid: false,
        error: 'Email required',
        plan: 'free'
      }, { status: 400 })
    }

    // Find user by email in your profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', userEmail)
      .single()

    if (profileError || !profile) {
      console.log('👤 User not found:', userEmail)
      return NextResponse.json({ 
        valid: false,
        error: 'User not found',
        plan: 'free',
        message: 'Please sign up at memorymonster.co',
        user: { email: userEmail, plan: 'free' }
      }, { status: 404 })
    }

    // Get subscription using user_id from your subscriptions table
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1)

    const subscription = subscriptions?.[0]

    let plan = profile.plan || 'free'
    let isPro = false
    let isTrial = false
    let features = {
      unlimited_scans: false,
      all_app_support: false,
      real_time_monitoring: false,
      advanced_features: false,
      priority_support: false
    }

    if (subscription) {
      console.log('📋 Subscription found:', subscription.status, subscription.plan_id)
      
      // Check for active trial
      if (subscription.trial_end) {
        const trialEndDate = new Date(subscription.trial_end)
        const now = new Date()
        if (trialEndDate > now) {
          isTrial = true
          plan = 'trial'
          isPro = true // Trial gets pro features
          features = {
            unlimited_scans: true,
            all_app_support: true,
            real_time_monitoring: true,
            advanced_features: true,
            priority_support: true
          }
        }
      }
      
      // Check for active pro subscription with expiry validation
      if (!isTrial && subscription.status === 'active') {
        // Check if subscription is expired
        if (subscription.current_period_end) {
          const expiryDate = new Date(subscription.current_period_end)
          const now = new Date()
          
          if (expiryDate <= now) {
            console.warn(`⏰ LICENSE: Subscription expired for ${userEmail} on ${expiryDate}`)
            plan = 'expired'
            isPro = false
          } else {
            plan = 'pro'
            isPro = true
            features = {
              unlimited_scans: true,
              all_app_support: true,
              real_time_monitoring: true,
              advanced_features: true,
              priority_support: true
            }
          }
        } else {
          // No expiry date - assume active
          plan = 'pro'
          isPro = true
          features = {
            unlimited_scans: true,
            all_app_support: true,
            real_time_monitoring: true,
            advanced_features: true,
            priority_support: true
          }
        }
      }
    }

    // Validate license key if provided
    if (licenseKey && profile.license_key && licenseKey !== profile.license_key) {
      console.warn('❌ LICENSE: License key mismatch for:', userEmail)
      return NextResponse.json({ 
        valid: false,
        error: 'Invalid license key',
        plan: 'free'
      }, { status: 401 })
    }

    // Device tracking using your existing app_usage table (Pro users only)
    if ((isPro || isTrial) && deviceId) {
      const maxDevices = 3 // Allow Pro users to use up to 3 devices
      
      try {
        // Check existing devices for this user in app_usage table
        const { data: existingDevices, error: deviceError } = await supabaseAdmin
          .from('app_usage')
          .select('device_id, last_active, app_version')
          .eq('user_id', profile.id)
        
        if (!deviceError && existingDevices) {
          const currentDevice = existingDevices.find(d => d.device_id === deviceId)
          
          if (!currentDevice) {
            // New device - check if we're at limit
            const activeDeviceCount = existingDevices.length
            
            if (activeDeviceCount >= maxDevices) {
              console.warn(`❌ LICENSE: Device limit exceeded for ${userEmail} (${activeDeviceCount}/${maxDevices})`)
              return NextResponse.json({ 
                valid: false,
                error: `Device limit exceeded. Pro licenses support up to ${maxDevices} devices.`,
                plan: 'free',
                deviceLimit: true
              }, { status: 429 })
            }
            
            // Add new device to app_usage table
            await supabaseAdmin
              .from('app_usage')
              .insert([{
                user_id: profile.id,
                device_id: deviceId,
                app_version: appVersion || '1.0.0',
                last_active: new Date().toISOString()
              }])
              
            console.log(`📱 New device registered for ${userEmail}: ${deviceId}`)
          } else {
            // Update existing device last seen
            await supabaseAdmin
              .from('app_usage')
              .update({ 
                last_active: new Date().toISOString(),
                app_version: appVersion || '1.0.0'
              })
              .eq('user_id', profile.id)
              .eq('device_id', deviceId)
          }
        }
      } catch (deviceTrackingError) {
        // Don't fail license verification if device tracking fails
        console.warn('Device tracking error (non-fatal):', deviceTrackingError)
      }
    }

    console.log('✅ LICENSE: Verification successful for:', userEmail, 'Plan:', plan)

    return NextResponse.json({
      valid: true,
      plan: plan,
      user: {
        email: profile.email,
        name: profile.full_name,
        plan: plan,
        isPro: isPro,
        isTrial: isTrial
      },
      subscription: subscription ? {
        status: subscription.status,
        plan_id: subscription.plan_id,
        trial_end: subscription.trial_end,
        current_period_end: subscription.current_period_end
      } : null,
      features: features,
      message: isPro ? 'Welcome back, Pro user!' : 
               isTrial ? 'Welcome back, trial user!' : 
               'Welcome back! Upgrade to Pro for unlimited features.'
    })

  } catch (error) {
    console.error('🔐 LICENSE: Verification error:', error)

    return NextResponse.json({
      valid: false,
      error: 'Server error during verification',
      plan: 'free',
      message: 'Using offline mode'
    }, { status: 500 })
  }
}
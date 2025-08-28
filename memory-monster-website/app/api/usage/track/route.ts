// app/api/usage/track/route.ts - Updated for your exact app_usage table

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userEmail, deviceId, sessionData, performanceData } = await req.json()
    
    console.log('📊 USAGE: Tracking data for:', userEmail)
    
    if (!userEmail || !deviceId) {
      return NextResponse.json({ 
        success: false,
        error: 'Email and device ID required'
      }, { status: 400 })
    }

    // Create a simple user_id from email hash
    const crypto = require('crypto')
    const user_id = crypto.createHash('md5').update(userEmail).digest('hex')
    
    console.log('👤 Processing usage for user_id:', user_id, 'email:', userEmail)

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
          clerk_user_id: `desktop_${user_id}`, // Fake clerk ID for desktop users
          email: userEmail,
          full_name: 'Desktop User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (profileError) {
        console.error('👤 Profile creation error:', profileError)
        // Continue anyway - maybe the constraint is different than expected
      }
    }

    // Check if app_usage record already exists for this user/device
    const { data: existingUsage } = await supabaseAdmin
      .from('app_usage')
      .select('*')
      .eq('user_id', user_id)
      .eq('device_id', deviceId)
      .single()

    if (existingUsage) {
      // Update existing record by incrementing the values
      console.log('📊 UPDATING existing app_usage record')
      const { error: updateError } = await supabaseAdmin
        .from('app_usage')
        .update({
          app_version: sessionData?.appVersion || existingUsage.app_version,
          memory_scans_performed: (existingUsage.memory_scans_performed || 0) + (performanceData?.scansPerformed || performanceData?.scansThisSession || 0),
          memory_freed_mb: (existingUsage.memory_freed_mb || 0) + (performanceData?.memoryFreedMB || 0),
          junk_files_removed: (existingUsage.junk_files_removed || 0) + (performanceData?.junkFilesRemoved || 0),
          apps_optimized: (existingUsage.apps_optimized || 0) + (performanceData?.appsOptimized || 0),
          ai_optimization_used: (existingUsage.ai_optimization_used || 0) + (performanceData?.featuresUsed?.includes('ai_optimization') ? 1 : 0),
          background_monitoring_enabled: performanceData?.featuresUsed?.includes('background_monitoring') ?? existingUsage.background_monitoring_enabled,
          advanced_analytics_viewed: (existingUsage.advanced_analytics_viewed || 0) + (performanceData?.featuresUsed?.includes('advanced_analytics') ? 1 : 0),
          total_usage_time_minutes: (existingUsage.total_usage_time_minutes || 0) + (sessionData?.sessionDurationMinutes || 0),
          last_active: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id)
        .eq('device_id', deviceId)

      if (updateError) {
        console.error('📊 USAGE: Update error:', updateError)
        return NextResponse.json({
          success: false,
          error: 'Failed to update usage data'
        }, { status: 500 })
      }
    } else {
      // Create new record
      console.log('📊 CREATING new app_usage record')
      const { error: insertError } = await supabaseAdmin
        .from('app_usage')
        .insert({
          user_id: user_id,
          device_id: deviceId,
          app_version: sessionData?.appVersion || '1.0.0',
          memory_scans_performed: performanceData?.scansPerformed || performanceData?.scansThisSession || 0,
          memory_freed_mb: performanceData?.memoryFreedMB || 0,
          junk_files_removed: performanceData?.junkFilesRemoved || 0,
          apps_optimized: performanceData?.appsOptimized || 0,
          ai_optimization_used: performanceData?.featuresUsed?.includes('ai_optimization') ? 1 : 0,
          background_monitoring_enabled: performanceData?.featuresUsed?.includes('background_monitoring') || false,
          advanced_analytics_viewed: performanceData?.featuresUsed?.includes('advanced_analytics') ? 1 : 0,
          total_usage_time_minutes: sessionData?.sessionDurationMinutes || 0,
          last_active: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('📊 USAGE: Insert error:', insertError)
        return NextResponse.json({
          success: false,
          error: 'Failed to save usage data'
        }, { status: 500 })
      }
    }

    console.log('✅ USAGE: Data tracked successfully for:', userEmail)

    return NextResponse.json({
      success: true,
      message: 'Usage data tracked successfully'
    })

  } catch (error) {
    console.error('📊 USAGE: Tracking error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Server error during usage tracking'
    }, { status: 500 })
  }
}
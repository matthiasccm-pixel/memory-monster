// app/api/migrate-user/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { oldEmail, newEmail, deviceId } = await req.json()
    
    console.log('🔄 MIGRATION: Starting data migration')
    console.log('📧 From:', oldEmail, 'To:', newEmail)
    console.log('🔧 Device ID:', deviceId)
    
    if (!oldEmail || !newEmail || !deviceId) {
      return NextResponse.json({ 
        success: false,
        error: 'oldEmail, newEmail, and deviceId required'
      }, { status: 400 })
    }

    // Create user_ids for both emails
    const crypto = require('crypto')
    const oldUserId = crypto.createHash('md5').update(oldEmail).digest('hex')
    const newUserId = crypto.createHash('md5').update(newEmail).digest('hex')
    
    console.log('👤 Old user_id:', oldUserId)
    console.log('👤 New user_id:', newUserId)

    // Find the anonymous user's usage data
    const { data: oldUsage } = await supabaseAdmin
      .from('app_usage')
      .select('*')
      .eq('user_id', oldUserId)
      .eq('device_id', deviceId)
      .single()

    if (!oldUsage) {
      console.log('⚠️ No anonymous usage data found to migrate')
      return NextResponse.json({
        success: true,
        message: 'No data to migrate'
      })
    }

    console.log('📊 Found anonymous usage data:', oldUsage)

    // Create profile for new email if it doesn't exist
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', newUserId)
      .single()

    if (!existingProfile) {
      console.log('👤 Creating profile for new user')
      await supabaseAdmin
        .from('profiles')
        .insert({
          id: newUserId,
          clerk_user_id: `pro_${newUserId}`,
          email: newEmail,
          full_name: 'Pro User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
    }

    // Check if new user already has usage data
    const { data: newUsage } = await supabaseAdmin
      .from('app_usage')
      .select('*')
      .eq('user_id', newUserId)
      .eq('device_id', deviceId)
      .single()

    if (newUsage) {
      // Merge the data (add anonymous data to existing pro data)
      console.log('📊 Merging with existing pro usage data')
      await supabaseAdmin
        .from('app_usage')
        .update({
          memory_scans_performed: (newUsage.memory_scans_performed || 0) + (oldUsage.memory_scans_performed || 0),
          memory_freed_mb: (newUsage.memory_freed_mb || 0) + (oldUsage.memory_freed_mb || 0),
          junk_files_removed: (newUsage.junk_files_removed || 0) + (oldUsage.junk_files_removed || 0),
          apps_optimized: (newUsage.apps_optimized || 0) + (oldUsage.apps_optimized || 0),
          ai_optimization_used: (newUsage.ai_optimization_used || 0) + (oldUsage.ai_optimization_used || 0),
          advanced_analytics_viewed: (newUsage.advanced_analytics_viewed || 0) + (oldUsage.advanced_analytics_viewed || 0),
          total_usage_time_minutes: (newUsage.total_usage_time_minutes || 0) + (oldUsage.total_usage_time_minutes || 0),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', newUserId)
        .eq('device_id', deviceId)
    } else {
      // Transfer the anonymous data to the new user
      console.log('📊 Transferring anonymous data to pro user')
      await supabaseAdmin
        .from('app_usage')
        .insert({
          user_id: newUserId,
          device_id: deviceId,
          app_version: oldUsage.app_version,
          memory_scans_performed: oldUsage.memory_scans_performed,
          memory_freed_mb: oldUsage.memory_freed_mb,
          junk_files_removed: oldUsage.junk_files_removed,
          apps_optimized: oldUsage.apps_optimized,
          ai_optimization_used: oldUsage.ai_optimization_used,
          background_monitoring_enabled: oldUsage.background_monitoring_enabled,
          advanced_analytics_viewed: oldUsage.advanced_analytics_viewed,
          total_usage_time_minutes: oldUsage.total_usage_time_minutes,
          last_active: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
    }

    // Delete the old anonymous record
    console.log('🗑️ Cleaning up anonymous record')
    await supabaseAdmin
      .from('app_usage')
      .delete()
      .eq('user_id', oldUserId)
      .eq('device_id', deviceId)

    console.log('✅ MIGRATION: Data migration completed successfully')

    return NextResponse.json({
      success: true,
      message: 'User data migrated successfully'
    })

  } catch (error) {
    console.error('🚨 MIGRATION: Migration error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Server error during migration'
    }, { status: 500 })
  }
}
// app/api/track-download/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userEmail, deviceId, appVersion, platform = 'desktop' } = await req.json()
    
    console.log('📥 DOWNLOAD: Tracking download for:', userEmail)
    
    if (!userEmail || !deviceId) {
      return NextResponse.json({ 
        success: false,
        error: 'Email and device ID required'
      }, { status: 400 })
    }

    // Create a simple user_id from email hash
    const crypto = require('crypto')
    const user_id = crypto.createHash('md5').update(userEmail).digest('hex')
    
    console.log('👤 Processing download for user_id:', user_id, 'email:', userEmail)

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

    // Check if download already tracked for this device
    const { data: existingDownload } = await supabaseAdmin
      .from('downloads')
      .select('*')
      .eq('user_id', user_id)
      .eq('device_id', deviceId)
      .single()

    if (existingDownload) {
      console.log('📥 Download already tracked for this device')
      return NextResponse.json({
        success: true,
        message: 'Download already tracked',
        isFirstDownload: false
      })
    }

    // Track new download
    console.log('📥 TRACKING new download')
    const { error: insertError } = await supabaseAdmin
      .from('downloads')
      .insert({
        user_id: user_id,
        device_id: deviceId,
        app_version: appVersion || '1.0.0',
        platform: platform,
        user_email: userEmail,
        created_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('📥 DOWNLOAD: Insert error:', insertError)
      return NextResponse.json({
        success: false,
        error: 'Failed to track download'
      }, { status: 500 })
    }

    console.log('✅ DOWNLOAD: Download tracked successfully for:', userEmail)

    return NextResponse.json({
      success: true,
      message: 'Download tracked successfully',
      isFirstDownload: true
    })

  } catch (error) {
    console.error('📥 DOWNLOAD: Tracking error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Server error during download tracking'
    }, { status: 500 })
  }
}
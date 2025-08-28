import { NextRequest, NextResponse } from 'next/server'
import { DesktopAppSync } from '@/lib/services/desktopAppSync'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { appId, appName, userCount, avgMemoryUsage } = body

    if (!appId || !appName) {
      return NextResponse.json(
        { error: 'Missing required fields: appId and appName' },
        { status: 400 }
      )
    }

    console.log(`🔬 Building AI support for ${appName} (${appId})`)
    console.log(`   📊 User count: ${userCount}`)
    console.log(`   💾 Avg memory usage: ${avgMemoryUsage}MB`)

    // Use the DesktopAppSync service to build app support
    const result = await DesktopAppSync.buildAppSupport(appId, appName)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    console.log(`✅ Successfully built AI support for ${appName}`)

    return NextResponse.json({
      success: true,
      message: result.message,
      strategies: result.strategies,
      appId,
      appName,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error building app support:', error)
    return NextResponse.json(
      { error: 'Failed to build app support', details: error.message },
      { status: 500 }
    )
  }
}
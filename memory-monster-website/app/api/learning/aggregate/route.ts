import { NextRequest, NextResponse } from 'next/server';
import { LearningDatabase, type LearningDataPoint } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the learning data structure
    if (!body.learningData || typeof body.learningData !== 'object') {
      return NextResponse.json({ error: 'Invalid learning data structure' }, { status: 400 });
    }

    const rawLearningData = body.learningData;
    
    // Convert the incoming data to our database format
    const learningData: LearningDataPoint = {
      session_id: rawLearningData.sessionId || `session_${Date.now()}`,
      device_id: body.deviceId || 'unknown_device',
      user_id: body.userEmail && body.userEmail !== 'demo@memorymonster.com' 
        ? await getUserIdFromEmail(body.userEmail) 
        : null,
      device_profile: rawLearningData.deviceProfile,
      optimization_strategy: rawLearningData.optimization.strategy,
      memory_freed_mb: rawLearningData.optimization.memoryFreed,
      speed_gain_percent: rawLearningData.optimization.speedGain,
      effectiveness_score: rawLearningData.optimization.effectiveness,
      optimization_context: rawLearningData.optimization.context,
      app_optimizations: rawLearningData.appOptimizations,
      system_state_before: {},
      system_state_after: {},
      errors: []
    };

    console.log('📊 Received learning data:', {
      session_id: learningData.session_id,
      strategy: learningData.optimization_strategy,
      memory_freed: learningData.memory_freed_mb,
      effectiveness: learningData.effectiveness_score,
      app_optimizations: learningData.app_optimizations.length
    });

    // Store in Supabase database
    await LearningDatabase.storeLearningData(learningData);
    
    // Process and aggregate intelligence from recent data
    await LearningDatabase.processLearningData();
    
    // Get updated analytics
    const analytics = await LearningDatabase.getAnalytics();

    console.log('🧠 Intelligence processed and stored to database:', analytics);

    return NextResponse.json({ 
      success: true, 
      aggregatedDataPoints: analytics.totalDataPoints,
      recentDataPoints: analytics.recentDataPoints,
      strategyAnalytics: analytics.strategyAnalytics,
      message: 'Learning data processed and stored successfully' 
    });
    
  } catch (error) {
    console.error('Failed to process learning data:', error);
    return NextResponse.json({ 
      error: 'Failed to process learning data', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

async function getUserIdFromEmail(email: string): Promise<string | null> {
  try {
    // This would query your profiles table to get user_id from email
    // For now, return null for demo data
    if (email === 'demo@memorymonster.com') {
      return null;
    }
    // In real implementation, you'd query the profiles table
    return null;
  } catch (error) {
    console.error('Failed to get user ID from email:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const deviceProfile = url.searchParams.get('deviceProfile');
    
    // Get analytics and intelligence from database
    const analytics = await LearningDatabase.getAnalytics();
    const latestIntelligence = await LearningDatabase.getLatestIntelligence();
    const appProfiles = await LearningDatabase.getAppProfiles();
    
    const intelligenceSnapshot = {
      analytics,
      latestIntelligence,
      appProfiles,
      summary: {
        message: `Analyzed ${analytics.totalDataPoints} optimizations across ${appProfiles.length} app profiles`,
        totalDataPoints: analytics.totalDataPoints,
        recentDataPoints: analytics.recentDataPoints,
        strategyAnalytics: analytics.strategyAnalytics,
        lastUpdated: analytics.lastUpdated
      }
    };

    return NextResponse.json(intelligenceSnapshot);
    
  } catch (error) {
    console.error('Failed to retrieve intelligence data:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve intelligence data', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
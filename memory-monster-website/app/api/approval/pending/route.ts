import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get pending strategy updates awaiting human review
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const riskLevel = url.searchParams.get('risk_level'); // 'low', 'medium', 'high'
    const appId = url.searchParams.get('app_id');

    // Build query
    let query = supabase
      .from('pending_approvals')
      .select(`
        id,
        app_id,
        strategy_type,
        update_type,
        update_data,
        estimated_impact,
        sample_size,
        confidence_score,
        statistical_significance,
        consistency_period_days,
        risk_level,
        safety_score,
        potential_issues,
        status,
        version,
        created_at,
        supporting_data_points,
        avg_effectiveness,
        avg_memory_freed
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (riskLevel) {
      query = query.eq('risk_level', riskLevel);
    }
    if (appId) {
      query = query.eq('app_id', appId);
    }

    const { data: pendingUpdates, error } = await query;

    if (error) {
      throw error;
    }

    // Get summary statistics
    const { data: stats, error: statsError } = await supabase
      .from('strategy_updates')
      .select('status, risk_level, count(*)')
      .eq('status', 'pending')
      .eq('statistical_significance', true);

    if (statsError) {
      console.warn('Could not fetch statistics:', statsError);
    }

    console.log('📊 Retrieved pending approvals:', {
      count: pendingUpdates?.length || 0,
      riskLevel,
      appId
    });

    return NextResponse.json({
      success: true,
      data: pendingUpdates || [],
      pagination: {
        limit,
        offset,
        hasMore: (pendingUpdates?.length || 0) === limit
      },
      stats: stats || []
    });

  } catch (error) {
    console.error('Failed to get pending approvals:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve pending approvals',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Create a new strategy update for approval
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['app_id', 'strategy_type', 'update_type', 'update_data', 'sample_size', 'confidence_score'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Calculate risk level based on update type and impact
    const riskLevel = calculateRiskLevel(body);
    
    // Generate version number
    const version = generateVersionNumber(body.app_id, body.strategy_type);

    const strategyUpdate = {
      app_id: body.app_id,
      strategy_type: body.strategy_type,
      update_type: body.update_type,
      update_data: body.update_data,
      estimated_impact: body.estimated_impact || {},
      sample_size: body.sample_size,
      confidence_score: body.confidence_score,
      statistical_significance: body.confidence_score >= 0.95 && body.sample_size >= 100,
      consistency_period_days: body.consistency_period_days || 0,
      risk_level: riskLevel,
      safety_score: body.safety_score || 0.5,
      potential_issues: body.potential_issues || [],
      version: version,
      base_strategy_version: body.base_strategy_version || '1.0.0',
      status: 'pending'
    };

    const { data: created, error } = await supabase
      .from('strategy_updates')
      .insert([strategyUpdate])
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('✅ Created strategy update for approval:', {
      id: created.id,
      app_id: created.app_id,
      strategy_type: created.strategy_type,
      risk_level: created.risk_level
    });

    return NextResponse.json({
      success: true,
      data: created
    });

  } catch (error) {
    console.error('Failed to create strategy update:', error);
    return NextResponse.json(
      {
        error: 'Failed to create strategy update',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate risk level based on update characteristics
 */
function calculateRiskLevel(update: any): 'low' | 'medium' | 'high' {
  const { update_type, estimated_impact, strategy_type } = update;

  // High risk factors
  if (update_type === 'new_action' && strategy_type === 'aggressive') {
    return 'high';
  }
  
  if (estimated_impact.memory_savings_mb > 2000) {
    return 'high';
  }

  // Medium risk factors
  if (update_type === 'new_action' || strategy_type === 'aggressive') {
    return 'medium';
  }

  if (estimated_impact.memory_savings_mb > 500) {
    return 'medium';
  }

  // Default to low risk
  return 'low';
}

/**
 * Generate version number for strategy update
 */
function generateVersionNumber(appId: string, strategyType: string): string {
  const timestamp = Date.now();
  const short_id = timestamp.toString().slice(-6);
  return `${appId.split('.').pop()}_${strategyType}_v${short_id}`;
}
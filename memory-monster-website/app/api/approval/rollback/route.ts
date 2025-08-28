import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Emergency rollback for deployed strategies
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deploymentId, strategyUpdateId, reason, emergency = false } = body;

    if (!deploymentId && !strategyUpdateId) {
      return NextResponse.json(
        { error: 'Either deploymentId or strategyUpdateId is required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    let deployment, strategyUpdate, abTest;

    // Get deployment details
    if (deploymentId) {
      const { data, error } = await supabase
        .from('strategy_deployments')
        .select(`
          *,
          strategy_updates (
            id,
            app_id,
            strategy_type,
            ab_test_id
          )
        `)
        .eq('id', deploymentId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Deployment not found' },
          { status: 404 }
        );
      }

      deployment = data;
      strategyUpdate = data.strategy_updates;
    } else {
      // Find by strategy update ID
      const { data, error } = await supabase
        .from('strategy_updates')
        .select(`
          *,
          ab_tests (
            id,
            status,
            current_phase,
            user_percentage
          )
        `)
        .eq('id', strategyUpdateId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Strategy update not found' },
          { status: 404 }
        );
      }

      strategyUpdate = data;
      abTest = data.ab_tests;
    }

    // Validate rollback conditions
    if (!['deployed', 'deploying'].includes(strategyUpdate.status)) {
      return NextResponse.json(
        { error: 'Strategy is not in a deployable state for rollback' },
        { status: 400 }
      );
    }

    const rollbackData = {
      reason: reason || 'Manual rollback requested',
      emergency,
      timestamp: now,
      rollbackActions: []
    };

    // 1. Stop A/B test if running
    if (strategyUpdate.ab_test_id || abTest) {
      const abTestId = strategyUpdate.ab_test_id || abTest.id;
      
      const { error: abError } = await supabase
        .from('ab_tests')
        .update({
          status: 'rolled_back',
          user_percentage: 0,
          conclusion: `Rollback initiated: ${reason}`
        })
        .eq('id', abTestId);

      if (abError) {
        console.error('Failed to rollback A/B test:', abError);
      } else {
        rollbackData.rollbackActions.push('Stopped A/B test');
      }
    }

    // 2. Update strategy status
    const { error: strategyError } = await supabase
      .from('strategy_updates')
      .update({
        status: 'rolled_back',
        ab_test_status: 'rolled_back',
        approval_notes: `${strategyUpdate.approval_notes || ''}\n\nROLLBACK ${now}: ${reason}`
      })
      .eq('id', strategyUpdate.id);

    if (strategyError) {
      console.error('Failed to update strategy status:', strategyError);
    } else {
      rollbackData.rollbackActions.push('Updated strategy status');
    }

    // 3. Create rollback deployment record
    const rollbackDeploymentData = {
      strategy_update_id: strategyUpdate.id,
      deployment_type: emergency ? 'emergency_rollback' : 'planned_rollback',
      target_user_percentage: 0,
      deployment_phase: 'rollback',
      status: 'rolled_back',
      deployed_at: now,
      rollback_at: now,
      rollback_reason: reason,
      user_criteria: { rollback: true },
      success_metrics: {},
      failure_metrics: {
        rollback_reason: reason,
        emergency_rollback: emergency
      }
    };

    const { data: rollbackDeployment, error: deployError } = await supabase
      .from('strategy_deployments')
      .insert([rollbackDeploymentData])
      .select()
      .single();

    if (deployError) {
      console.error('Failed to create rollback deployment record:', deployError);
    } else {
      rollbackData.rollbackActions.push('Created rollback deployment record');
    }

    // 4. Log rollback event
    const logData = {
      deployment_id: rollbackDeployment?.id,
      log_level: emergency ? 'critical' : 'warning',
      log_message: `Strategy rollback initiated: ${reason}`,
      log_data: {
        strategy_update_id: strategyUpdate.id,
        app_id: strategyUpdate.app_id,
        strategy_type: strategyUpdate.strategy_type,
        rollback_reason: reason,
        emergency,
        previous_status: strategyUpdate.status
      },
      app_id: strategyUpdate.app_id
    };

    await supabase.from('deployment_logs').insert([logData]);

    console.log(`🔄 ${emergency ? 'EMERGENCY' : 'Planned'} rollback completed:`, {
      strategy_id: strategyUpdate.id,
      app_id: strategyUpdate.app_id,
      reason
    });

    return NextResponse.json({
      success: true,
      data: {
        strategyUpdate,
        rollbackDeployment,
        rollbackData
      },
      message: `${emergency ? 'Emergency' : 'Planned'} rollback completed successfully`
    });

  } catch (error) {
    console.error('Failed to execute rollback:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute rollback',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Get rollback history and statistics
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const appId = url.searchParams.get('app_id');
    const emergency = url.searchParams.get('emergency');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = supabase
      .from('strategy_deployments')
      .select(`
        *,
        strategy_updates (
          id,
          app_id,
          strategy_type,
          update_type,
          version
        )
      `)
      .eq('status', 'rolled_back')
      .order('rollback_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (appId) {
      query = query.eq('strategy_updates.app_id', appId);
    }

    if (emergency !== null) {
      query = query.eq('deployment_type', emergency === 'true' ? 'emergency_rollback' : 'planned_rollback');
    }

    const { data: rollbacks, error } = await query;

    if (error) {
      throw error;
    }

    // Get rollback statistics
    const { data: stats, error: statsError } = await supabase
      .from('strategy_deployments')
      .select('deployment_type, rollback_reason, strategy_updates(app_id)')
      .eq('status', 'rolled_back');

    const rollbackStats = {
      total: rollbacks?.length || 0,
      emergency: stats?.filter(s => s.deployment_type === 'emergency_rollback').length || 0,
      planned: stats?.filter(s => s.deployment_type === 'planned_rollback').length || 0,
      byApp: stats?.reduce((acc, s) => {
        const appId = s.strategy_updates?.app_id;
        if (appId) {
          acc[appId] = (acc[appId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {},
      commonReasons: getTopRollbackReasons(stats || [])
    };

    return NextResponse.json({
      success: true,
      data: rollbacks || [],
      stats: rollbackStats,
      pagination: {
        limit,
        offset,
        hasMore: (rollbacks?.length || 0) === limit
      }
    });

  } catch (error) {
    console.error('Failed to get rollback history:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve rollback history',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Get top rollback reasons for analytics
 */
function getTopRollbackReasons(stats: any[]): Array<{reason: string, count: number}> {
  const reasonCounts = stats.reduce((acc, s) => {
    const reason = s.rollback_reason || 'Unknown';
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(reasonCounts)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
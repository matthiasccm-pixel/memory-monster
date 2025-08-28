import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Deploy approved strategy updates through A/B testing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { abTestId, action } = body; // action: 'start', 'advance', 'rollback', 'complete'

    if (!abTestId || !action) {
      return NextResponse.json(
        { error: 'abTestId and action are required' },
        { status: 400 }
      );
    }

    // Get A/B test and strategy update details
    const { data: abTest, error: testError } = await supabase
      .from('ab_tests')
      .select(`
        *,
        strategy_updates (
          id,
          app_id,
          strategy_type,
          update_type,
          update_data,
          risk_level
        )
      `)
      .eq('id', abTestId)
      .single();

    if (testError || !abTest) {
      return NextResponse.json(
        { error: 'A/B test not found' },
        { status: 404 }
      );
    }

    let result;
    const now = new Date().toISOString();

    switch (action) {
      case 'start':
        result = await startAbTest(abTest, now);
        break;
      
      case 'advance':
        result = await advanceAbTestPhase(abTest, now);
        break;
      
      case 'rollback':
        result = await rollbackAbTest(abTest, now);
        break;
      
      case 'complete':
        result = await completeAbTest(abTest, now);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be: start, advance, rollback, or complete' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `A/B test ${action} completed successfully`
    });

  } catch (error) {
    console.error('Failed to deploy strategy:', error);
    return NextResponse.json(
      {
        error: 'Failed to process deployment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Start A/B test with initial rollout phase
 */
async function startAbTest(abTest: any, now: string) {
  if (abTest.status !== 'not_started') {
    throw new Error('A/B test already started or completed');
  }

  const updateData = {
    status: 'running',
    phase_start_time: now,
    current_phase: 0,
    user_percentage: abTest.rollout_phases[0] || 0.001
  };

  const { data: updated, error } = await supabase
    .from('ab_tests')
    .update(updateData)
    .eq('id', abTest.id)
    .select()
    .single();

  if (error) throw error;

  // Create deployment record
  await createDeploymentRecord(abTest, 'canary', abTest.rollout_phases[0]);

  // Update strategy_update status
  await supabase
    .from('strategy_updates')
    .update({ 
      status: 'deploying',
      ab_test_status: 'running'
    })
    .eq('id', abTest.strategy_update_id);

  console.log('🚀 Started A/B test:', {
    id: abTest.id,
    phase: 0,
    percentage: abTest.rollout_phases[0]
  });

  return updated;
}

/**
 * Advance to next phase of A/B test
 */
async function advanceAbTestPhase(abTest: any, now: string) {
  if (abTest.status !== 'running') {
    throw new Error('A/B test is not running');
  }

  const nextPhase = abTest.current_phase + 1;
  const rolloutPhases = abTest.rollout_phases || [0.001, 0.01, 0.1, 0.5, 1.0];

  if (nextPhase >= rolloutPhases.length) {
    // Complete the test
    return await completeAbTest(abTest, now);
  }

  const nextPercentage = rolloutPhases[nextPhase];
  const deploymentPhase = getDeploymentPhase(nextPercentage);

  const updateData = {
    current_phase: nextPhase,
    user_percentage: nextPercentage,
    phase_start_time: now
  };

  const { data: updated, error } = await supabase
    .from('ab_tests')
    .update(updateData)
    .eq('id', abTest.id)
    .select()
    .single();

  if (error) throw error;

  // Create new deployment record for this phase
  await createDeploymentRecord(abTest, deploymentPhase, nextPercentage);

  console.log('📈 Advanced A/B test phase:', {
    id: abTest.id,
    phase: nextPhase,
    percentage: nextPercentage
  });

  return updated;
}

/**
 * Rollback A/B test due to issues
 */
async function rollbackAbTest(abTest: any, now: string) {
  const updateData = {
    status: 'rolled_back',
    user_percentage: 0,
    conclusion: 'Rolled back due to safety concerns or performance issues'
  };

  const { data: updated, error } = await supabase
    .from('ab_tests')
    .update(updateData)
    .eq('id', abTest.id)
    .select()
    .single();

  if (error) throw error;

  // Update strategy_update status
  await supabase
    .from('strategy_updates')
    .update({ 
      status: 'rejected',
      ab_test_status: 'rolled_back',
      approval_notes: `Rollback at ${now}: Safety or performance concerns during deployment`
    })
    .eq('id', abTest.strategy_update_id);

  // Create rollback deployment record
  await createDeploymentRecord(abTest, 'rollback', 0, 'rolled_back');

  console.log('🔄 Rolled back A/B test:', abTest.id);
  return updated;
}

/**
 * Complete A/B test and deploy to all users
 */
async function completeAbTest(abTest: any, now: string) {
  const updateData = {
    status: 'completed',
    user_percentage: 1.0,
    conclusion: `Successfully completed A/B test. Deploying to all users.`,
    success_count: abTest.total_participants || 0
  };

  const { data: updated, error } = await supabase
    .from('ab_tests')
    .update(updateData)
    .eq('id', abTest.id)
    .select()
    .single();

  if (error) throw error;

  // Update strategy_update status to deployed
  await supabase
    .from('strategy_updates')
    .update({ 
      status: 'deployed',
      ab_test_status: 'completed'
    })
    .eq('id', abTest.strategy_update_id);

  // Create final deployment record
  await createDeploymentRecord(abTest, 'full', 1.0, 'deployed');

  console.log('✅ Completed A/B test deployment:', abTest.id);
  return updated;
}

/**
 * Create deployment record
 */
async function createDeploymentRecord(
  abTest: any, 
  deploymentPhase: string, 
  percentage: number,
  status: string = 'deploying'
) {
  const deploymentData = {
    strategy_update_id: abTest.strategy_update_id,
    deployment_type: 'gradual',
    target_user_percentage: percentage,
    deployment_phase: deploymentPhase,
    status: status,
    deployed_at: new Date().toISOString(),
    user_criteria: {
      include_beta_users: deploymentPhase === 'canary',
      risk_tolerance: abTest.strategy_updates?.risk_level,
      app_id: abTest.strategy_updates?.app_id
    },
    success_metrics: abTest.success_metrics || {},
    failure_metrics: {}
  };

  const { error } = await supabase
    .from('strategy_deployments')
    .insert([deploymentData]);

  if (error) {
    console.error('Failed to create deployment record:', error);
  }
}

/**
 * Determine deployment phase based on percentage
 */
function getDeploymentPhase(percentage: number): string {
  if (percentage <= 0.001) return 'canary';
  if (percentage <= 0.01) return 'limited';
  if (percentage <= 0.5) return 'gradual';
  return 'full';
}

/**
 * Get deployment status and statistics
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const appId = url.searchParams.get('app_id');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = supabase
      .from('ab_tests')
      .select(`
        *,
        strategy_updates (
          app_id,
          strategy_type,
          update_type,
          risk_level
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }
    if (appId) {
      query = query.eq('strategy_updates.app_id', appId);
    }

    const { data: deployments, error } = await query;

    if (error) {
      throw error;
    }

    // Get deployment statistics
    const { data: stats, error: statsError } = await supabase
      .from('ab_tests')
      .select('status, current_phase, user_percentage, success_count, failure_count');

    const deploymentStats = {
      total: deployments?.length || 0,
      byStatus: stats?.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {},
      totalUsers: stats?.reduce((acc, s) => acc + (s.success_count || 0), 0) || 0,
      averagePhase: stats?.reduce((acc, s) => acc + (s.current_phase || 0), 0) / (stats?.length || 1) || 0
    };

    return NextResponse.json({
      success: true,
      data: deployments || [],
      stats: deploymentStats,
      pagination: {
        limit,
        offset,
        hasMore: (deployments?.length || 0) === limit
      }
    });

  } catch (error) {
    console.error('Failed to get deployment status:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve deployment status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
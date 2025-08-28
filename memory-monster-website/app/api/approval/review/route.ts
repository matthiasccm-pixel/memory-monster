import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DesktopAppSync } from '@/lib/services/desktopAppSync';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Approve or reject strategy updates
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { strategyUpdateId, decision, reviewNotes, deploymentPhase = 'beta' } = body;

    // Validate required fields
    if (!strategyUpdateId || !decision || !['approved', 'rejected'].includes(decision)) {
      return NextResponse.json(
        { error: 'Invalid request. strategyUpdateId and decision (approved/rejected) are required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    
    // Update the strategy update status
    const updateData = {
      status: decision === 'approved' ? 'approved' : 'rejected',
      reviewed_by: null, // TODO: Get actual reviewer UUID from auth session
      reviewed_at: now,
      approval_notes: reviewNotes || ''
    };

    const { data: updated, error: updateError } = await supabase
      .from('strategy_updates')
      .update(updateData)
      .eq('id', strategyUpdateId)
      .eq('status', 'pending') // Only update if still pending
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    if (!updated) {
      return NextResponse.json(
        { error: 'Strategy update not found or already processed' },
        { status: 404 }
      );
    }

    // If approved, push to desktop apps and create A/B test for gradual deployment
    if (decision === 'approved') {
      console.log('🚀 Pushing approved strategy to desktop apps...');
      
      // Push strategy update to desktop apps
      const syncResult = await DesktopAppSync.pushStrategyUpdate({
        id: updated.id,
        app_id: updated.app_id,
        strategy_type: updated.strategy_type,
        update_type: updated.update_type,
        update_data: updated.update_data,
        version: updated.version
      });

      if (!syncResult.success) {
        console.error('❌ Failed to push strategy to desktop apps:', syncResult.error);
        // Don't fail the approval, but log the issue
      } else {
        console.log('✅ Strategy successfully pushed to desktop apps');
      }
      const abTestData = {
        strategy_update_id: strategyUpdateId,
        test_name: `${updated.app_id}_${updated.strategy_type}_${updated.version}`,
        test_description: `A/B test for ${updated.update_type} in ${updated.app_id}`,
        rollout_phases: [0.001, 0.01, 0.1, 0.5, 1.0], // 0.1% -> 1% -> 10% -> 50% -> 100%
        current_phase: 0,
        user_percentage: 0.001,
        success_metrics: ['effectiveness', 'user_satisfaction', 'stability'],
        success_thresholds: {
          effectiveness: 0.8,
          user_satisfaction: 0.75,
          stability: 0.95
        },
        rollback_triggers: [
          'crash_rate > 0.01',
          'user_satisfaction < 0.6',
          'effectiveness < 0.5'
        ],
        status: 'not_started',
        phase_duration_hours: 48
      };

      const { data: abTest, error: abError } = await supabase
        .from('ab_tests')
        .insert([abTestData])
        .select()
        .single();

      if (abError) {
        console.error('Failed to create A/B test:', abError);
        // Don't fail the approval, just log the error
      } else {
        // Update strategy_update with ab_test_id
        await supabase
          .from('strategy_updates')
          .update({ ab_test_id: abTest.id, ab_test_status: 'not_started' })
          .eq('id', strategyUpdateId);

        console.log('✅ Created A/B test for approved strategy:', abTest.id);
      }
    }

    console.log(`✅ Strategy update ${decision}:`, {
      id: strategyUpdateId,
      app_id: updated.app_id,
      strategy_type: updated.strategy_type,
      reviewer: 'admin_user'
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Strategy update ${decision} successfully`,
      desktopSync: decision === 'approved' ? 'Strategy pushed to desktop apps' : 'N/A'
    });

  } catch (error) {
    console.error('Failed to review strategy update:', error);
    return NextResponse.json(
      {
        error: 'Failed to process review',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Get review history and statistics
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const reviewerId = url.searchParams.get('reviewer_id');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = supabase
      .from('strategy_updates')
      .select(`
        id,
        app_id,
        strategy_type,
        update_type,
        status,
        reviewed_by,
        reviewed_at,
        approval_notes,
        risk_level,
        confidence_score,
        ab_test_id,
        ab_test_status
      `)
      .in('status', ['approved', 'rejected'])
      .order('reviewed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (reviewerId) {
      query = query.eq('reviewed_by', reviewerId);
    }

    const { data: reviews, error } = await query;

    if (error) {
      throw error;
    }

    // Get review statistics - Fixed PostgreSQL syntax
    const { data: stats, error: statsError } = await supabase
      .from('strategy_updates')
      .select('status, risk_level')
      .in('status', ['approved', 'rejected']);

    const reviewStats = {
      total: reviews?.length || 0,
      approved: stats?.filter(s => s.status === 'approved').length || 0,
      rejected: stats?.filter(s => s.status === 'rejected').length || 0,
      byRiskLevel: stats?.reduce((acc, s) => {
        acc[s.risk_level] = (acc[s.risk_level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {}
    };

    return NextResponse.json({
      success: true,
      data: reviews || [],
      stats: reviewStats,
      pagination: {
        limit,
        offset,
        hasMore: (reviews?.length || 0) === limit
      }
    });

  } catch (error) {
    console.error('Failed to get review history:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve review history',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
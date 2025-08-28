const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugApprovalEndpoint() {
  console.log('🔍 Debugging approval endpoint failure...\n');
  
  try {
    // First, let's check if we have any strategy_updates to work with
    console.log('📊 Checking existing strategy_updates...');
    const { data: existingUpdates, error: checkError } = await supabase
      .from('strategy_updates')
      .select('*')
      .limit(5);
    
    if (checkError) {
      console.error('❌ Error checking strategy_updates:', checkError);
      return;
    }
    
    console.log(`Found ${existingUpdates?.length || 0} existing strategy updates`);
    
    // Create a test strategy update if none exist
    let testStrategyId;
    if (!existingUpdates || existingUpdates.length === 0) {
      console.log('\n📝 Creating test strategy update...');
      const testUpdate = {
        app_id: 'com.google.Chrome',
        strategy_type: 'balanced',
        update_type: 'test_update',
        update_data: { test: true },
        estimated_impact: { memory_savings_mb: 500 },
        sample_size: 100,
        confidence_score: 0.8,
        statistical_significance: true,
        consistency_period_days: 7,
        risk_level: 'low',
        safety_score: 0.9,
        version: 'test_v1.0',
        status: 'pending'
      };
      
      const { data: created, error: createError } = await supabase
        .from('strategy_updates')
        .insert([testUpdate])
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Error creating test update:', createError);
        return;
      }
      
      testStrategyId = created.id;
      console.log('✅ Created test strategy update:', testStrategyId);
    } else {
      testStrategyId = existingUpdates[0].id;
      console.log('✅ Using existing strategy update:', testStrategyId);
    }
    
    // Now test the approval process manually
    console.log('\n🧪 Testing approval process...');
    
    const updateData = {
      status: 'approved',
      reviewed_by: 'admin_user',
      reviewed_at: new Date().toISOString(),
      approval_notes: 'Test approval'
    };

    const { data: updated, error: updateError } = await supabase
      .from('strategy_updates')
      .update(updateData)
      .eq('id', testStrategyId)
      .eq('status', 'pending')
      .select()
      .single();

    if (updateError) {
      console.error('❌ Approval update failed:', updateError);
      return;
    }

    console.log('✅ Strategy update approved successfully');
    console.log('Result:', updated);
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await supabase
      .from('strategy_updates')
      .delete()
      .eq('id', testStrategyId)
      .eq('update_type', 'test_update');
    
    console.log('✅ Test data cleaned up');
    console.log('\n🎉 Approval endpoint debugging completed successfully');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugApprovalEndpoint();
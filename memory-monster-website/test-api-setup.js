/**
 * Setup test data for API integration tests
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function setupTestData() {
  console.log('🔧 Setting up test data for API integration...');
  
  const testIds = {
    strategyUpdateId: generateUUID(),
    abTestId: generateUUID()
  };
  
  try {
    // 1. Create a test strategy update
    const { error: strategyError } = await supabase
      .from('strategy_updates')
      .insert([{
        id: testIds.strategyUpdateId,
        app_id: 'com.test.integration',
        strategy_type: 'balanced',
        update_type: 'integration_test',
        update_data: { test: 'integration data' },
        estimated_impact: {
          memory_savings_mb: 150,
          user_satisfaction_score: 0.85,
          speed_improvement_percent: 8
        },
        sample_size: 100,
        confidence_score: 0.9,
        statistical_significance: true,
        consistency_period_days: 7,
        risk_level: 'low',
        safety_score: 0.95,
        status: 'pending',
        version: 'integration_test_v1',
        base_strategy_version: '1.0.0'
      }]);
    
    if (strategyError) {
      console.log('⚠️  Strategy update creation failed:', strategyError);
    } else {
      console.log('✅ Created test strategy update');
    }
    
    // 2. Create a test A/B test
    const { error: abTestError } = await supabase
      .from('ab_tests')
      .insert([{
        id: testIds.abTestId,
        strategy_update_id: testIds.strategyUpdateId,
        test_name: 'Integration Test AB',
        status: 'ready'
      }]);
    
    if (abTestError) {
      console.log('⚠️  A/B test creation failed:', abTestError);
    } else {
      console.log('✅ Created test A/B test');
    }
    
    console.log('✅ Test data setup complete');
    return testIds;
    
  } catch (error) {
    console.error('❌ Test data setup failed:', error);
    return null;
  }
}

async function cleanupTestData(testIds) {
  console.log('🧹 Cleaning up test data...');
  
  try {
    // Delete in reverse order due to foreign keys
    await supabase.from('ab_tests').delete().eq('id', testIds.abTestId);
    await supabase.from('strategy_updates').delete().eq('id', testIds.strategyUpdateId);
    await supabase.from('supported_apps').delete().like('app_id', 'com.test.%');
    
    console.log('✅ Test data cleanup complete');
  } catch (error) {
    console.log('⚠️  Cleanup error (non-critical):', error.message);
  }
}

module.exports = { setupTestData, cleanupTestData };
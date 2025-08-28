/**
 * Comprehensive API Test with Real Data
 * Creates real test data, tests all endpoints, cleans up
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

async function testApiEndpoint(endpoint, method, body, description) {
  console.log(`\n🔍 Testing: ${description}`);
  console.log(`   ${method} ${endpoint}`);
  
  try {
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : null
    });
    
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    
    if (response.ok) {
      console.log('   ✅ PASSED');
      return { success: true, data };
    } else {
      console.log('   ❌ FAILED:', data.error || data.message);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ NETWORK ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function comprehensiveApiTest() {
  console.log('🚀 Starting Comprehensive API Test with Real Data...\n');
  
  let testStrategyId, testAbTestId, testDeploymentId;
  
  try {
    // Step 1: Create test data
    console.log('📝 Step 1: Creating test data...');
    
    // Create a test strategy update
    const testUpdate = {
      app_id: 'com.test.comprehensive',
      strategy_type: 'balanced',
      update_type: 'test_comprehensive',
      update_data: { test: true, comprehensive: true },
      estimated_impact: { memory_savings_mb: 750 },
      sample_size: 200,
      confidence_score: 0.85,
      statistical_significance: true,
      consistency_period_days: 10,
      risk_level: 'low',
      safety_score: 0.9,
      version: 'comprehensive_test_v1.0',
      status: 'pending'
    };
    
    const { data: createdUpdate, error: updateError } = await supabase
      .from('strategy_updates')
      .insert([testUpdate])
      .select()
      .single();
    
    if (updateError) throw new Error(`Failed to create test update: ${updateError.message}`);
    testStrategyId = createdUpdate.id;
    console.log(`✅ Created test strategy: ${testStrategyId}`);
    
    // Step 2: Test approval endpoint
    const approvalResult = await testApiEndpoint(
      '/api/approval/review',
      'POST',
      {
        strategyUpdateId: testStrategyId,
        decision: 'approved',
        reviewNotes: 'Comprehensive test approval'
      },
      'Strategy Update Approval'
    );
    
    // Step 3: Get the created A/B test ID
    if (approvalResult.success) {
      const { data: abTests } = await supabase
        .from('ab_tests')
        .select('id')
        .eq('strategy_update_id', testStrategyId)
        .single();
      
      testAbTestId = abTests?.id;
      console.log(`   Found A/B test ID: ${testAbTestId}`);
    }
    
    // Step 4: Test deployment if we have an A/B test
    let deploymentResult = { success: false };
    if (testAbTestId) {
      deploymentResult = await testApiEndpoint(
        '/api/approval/deploy',
        'POST',
        {
          abTestId: testAbTestId,
          action: 'start'
        },
        'Strategy Deployment'
      );
    } else {
      console.log('\n🔍 Testing: Strategy Deployment');
      console.log('   ⚠️  SKIPPED: No A/B test available');
    }
    
    // Step 5: Test app build support with unique app
    const uniqueAppId = `com.test.app.${Date.now()}`;
    const buildResult = await testApiEndpoint(
      '/api/apps/build-support',
      'POST',
      {
        appId: uniqueAppId,
        appName: `Test App ${Date.now()}`,
        userCount: 150,
        avgMemoryUsage: 600
      },
      'Build App Support'
    );
    
    // Step 6: Test rollback
    const rollbackResult = await testApiEndpoint(
      '/api/approval/rollback',
      'POST',
      {
        strategyUpdateId: testStrategyId,
        reason: 'Comprehensive test rollback'
      },
      'Strategy Rollback'
    );
    
    // Summary
    const results = [approvalResult, deploymentResult, buildResult, rollbackResult];
    const passed = results.filter(r => r.success).length;
    const total = results.length;
    
    console.log(`\n📊 Comprehensive API Test Summary:`);
    console.log(`   ✅ Passed: ${passed}/${total}`);
    console.log(`   📈 Success Rate: ${Math.round((passed / total) * 100)}%`);
    
    return passed === total;
    
  } catch (error) {
    console.error('❌ Comprehensive test failed:', error.message);
    return false;
    
  } finally {
    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    
    if (testStrategyId) {
      await supabase.from('strategy_updates').delete().eq('id', testStrategyId);
      console.log('   ✅ Cleaned strategy update');
    }
    
    // Clean up test apps
    await supabase.from('supported_apps').delete().like('app_id', 'com.test.app.%');
    console.log('   ✅ Cleaned test apps');
    
    console.log('🧹 Cleanup completed');
  }
}

comprehensiveApiTest();
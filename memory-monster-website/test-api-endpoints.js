/**
 * API Endpoints Comprehensive Test
 * Tests all approval and sync endpoints for scalability and correctness
 */

const { setupTestData, cleanupTestData } = require('./test-api-setup');
const baseUrl = 'http://localhost:3000';

async function testApiEndpoint(endpoint, method = 'GET', body = null, description) {
  console.log(`\n🔍 Testing: ${description}`);
  console.log(`   ${method} ${endpoint}`);
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('   ✅ PASSED');
      return { success: true, data };
    } else {
      console.log('   ❌ FAILED');
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ NETWORK ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runApiTests() {
  console.log('🚀 Starting API Endpoint Tests...\n');
  
  // Setup test data
  const testIds = await setupTestData();
  if (!testIds) {
    console.log('❌ Failed to setup test data');
    return false;
  }
  
  const results = [];
  
  try {
    // 1. Test approval review endpoint
    results.push(await testApiEndpoint(
      '/api/approval/review',
      'POST',
      {
        strategyUpdateId: testIds.strategyUpdateId,
        decision: 'approved',
        reviewNotes: 'Integration test approval',
        deploymentPhase: 'beta'
      },
      'Strategy Update Approval'
    ));
    
    // 2. Test app build support endpoint
    results.push(await testApiEndpoint(
      '/api/apps/build-support',
      'POST',
      {
        appId: `com.test.integration.${Date.now()}`,
        appName: 'Integration Test App',
        userCount: 100,
        avgMemoryUsage: 500
      },
      'Build App Support'
    ));
    
    // 3. Test deployment endpoint
    results.push(await testApiEndpoint(
      '/api/approval/deploy',
      'POST',
      {
        abTestId: testIds.abTestId,
        action: 'start'
      },
      'Strategy Deployment'
    ));
    
    // 4. Test rollback endpoint  
    results.push(await testApiEndpoint(
      '/api/approval/rollback',
      'POST',
      {
        strategyUpdateId: testIds.strategyUpdateId,
        reason: 'Integration test rollback',
        emergency: false
      },
      'Strategy Rollback'
    ));
    
  } finally {
    // Always cleanup test data
    await cleanupTestData(testIds);
  }
  
  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.length - passed;
  
  console.log(`\n📊 API Test Summary:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / results.length) * 100)}%`);
  
  if (failed > 0) {
    console.log('\n❗ Some API endpoints failed - check implementation');
    return false;
  } else {
    console.log('\n🎉 All API endpoints working correctly');
    return true;
  }
}

// Only run if called directly
if (require.main === module) {
  runApiTests();
}

module.exports = { runApiTests };
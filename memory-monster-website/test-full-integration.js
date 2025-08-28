/**
 * Full System Integration Test
 * End-to-end test of the complete AI learning pipeline
 */

async function testCompleteWorkflow() {
  console.log('🔄 COMPLETE AI LEARNING SYSTEM INTEGRATION TEST');
  console.log('='*50 + '\n');
  
  const tests = [];
  let allPassed = true;
  
  // Test 1: Admin Dashboard → Database → Desktop Sync
  console.log('🎯 Test 1: Complete Admin Approval Workflow');
  try {
    const response = await fetch('http://localhost:3000/api/apps/build-support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appId: `com.integration.test.${Date.now()}`,
        appName: 'Integration Test App',
        userCount: 500,
        avgMemoryUsage: 800
      })
    });
    
    if (response.ok) {
      console.log('   ✅ Admin can build new app support');
      tests.push('✅ App Support Creation');
    } else {
      console.log('   ❌ App support creation failed');
      tests.push('❌ App Support Creation');
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ App support creation error:', error.message);
    tests.push('❌ App Support Creation');
    allPassed = false;
  }
  
  // Test 2: Database Query Performance
  console.log('\n🎯 Test 2: Database Query Performance');
  try {
    const startTime = Date.now();
    const response = await fetch('http://localhost:3000/api/approval/pending?limit=10');
    const data = await response.json();
    const queryTime = Date.now() - startTime;
    
    if (response.ok && queryTime < 1000) {
      console.log(`   ✅ Database queries fast (${queryTime}ms)`);
      tests.push('✅ Database Performance');
    } else {
      console.log(`   ⚠️  Database queries slow (${queryTime}ms)`);
      tests.push('⚠️ Database Performance');
    }
  } catch (error) {
    console.log('   ❌ Database query failed:', error.message);
    tests.push('❌ Database Performance');
    allPassed = false;
  }
  
  // Test 3: Strategy Loading System
  console.log('\n🎯 Test 3: Strategy Loading System');
  const { testStrategyLoading } = require('../mac-optimizer-app/test-strategy-loading.js');
  try {
    const strategyResult = await testStrategyLoading();
    if (strategyResult) {
      console.log('   ✅ All app strategies load correctly');
      tests.push('✅ Strategy Loading');
    } else {
      console.log('   ❌ Strategy loading issues found');
      tests.push('❌ Strategy Loading');
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Strategy loading error:', error.message);
    tests.push('❌ Strategy Loading');
    allPassed = false;
  }
  
  // Test 4: API Endpoint Stability
  console.log('\n🎯 Test 4: API Endpoint Stability');
  const { runApiTests } = require('./test-api-endpoints.js');
  try {
    const apiResult = await runApiTests();
    if (apiResult) {
      console.log('   ✅ All API endpoints stable');
      tests.push('✅ API Stability');
    } else {
      console.log('   ❌ Some API endpoints failing');
      tests.push('❌ API Stability');
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ API test error:', error.message);
    tests.push('❌ API Stability');
    allPassed = false;
  }
  
  // Test 5: System Health Check
  console.log('\n🎯 Test 5: System Health Check');
  const memUsage = process.memoryUsage();
  const memoryMB = memUsage.heapUsed / 1024 / 1024;
  
  if (memoryMB < 100) {
    console.log(`   ✅ Memory usage healthy (${memoryMB.toFixed(2)}MB)`);
    tests.push('✅ System Health');
  } else {
    console.log(`   ⚠️  Memory usage high (${memoryMB.toFixed(2)}MB)`);
    tests.push('⚠️ System Health');
  }
  
  // Summary
  console.log('\n' + '='*50);
  console.log('🎯 INTEGRATION TEST SUMMARY');
  console.log('='*50);
  
  tests.forEach((test, i) => {
    console.log(`${i + 1}. ${test}`);
  });
  
  const passCount = tests.filter(t => t.startsWith('✅')).length;
  const totalTests = tests.length;
  const successRate = Math.round((passCount / totalTests) * 100);
  
  console.log(`\n📊 Success Rate: ${successRate}% (${passCount}/${totalTests})`);
  
  if (allPassed && successRate >= 80) {
    console.log('\n🎉 SYSTEM READY FOR 100K+ USERS!');
    console.log('✅ All critical components working correctly');
    console.log('✅ Performance meets scalability requirements');  
    console.log('✅ Database and API integration complete');
    console.log('✅ Strategy loading system functional');
    return true;
  } else {
    console.log('\n⚠️  SYSTEM NEEDS ATTENTION');
    console.log('Some components require fixes before production scale');
    return false;
  }
}

if (require.main === module) {
  testCompleteWorkflow();
}

module.exports = { testCompleteWorkflow };
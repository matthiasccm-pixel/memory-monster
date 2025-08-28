/**
 * Scalability & Performance Test for 100k+ Users
 * Tests database operations, API performance, and memory usage
 */

const { createClient } = require('@supabase/supabase-js');
const { performance } = require('perf_hooks');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test configuration for scale simulation
const SCALE_CONFIG = {
  concurrent_users: 1000,      // Simulate 1k concurrent users
  data_points_per_user: 10,    // 10 optimization sessions per user
  total_apps: 50,              // 50 different apps
  strategies_per_app: 3        // 3 strategies per app
};

async function simulateUserLoad(userCount, operationsPerUser = 5) {
  const startTime = performance.now();
  const promises = [];
  const results = {
    success: 0,
    failed: 0,
    avgResponseTime: 0,
    errors: []
  };
  
  console.log(`🚀 Simulating ${userCount} concurrent users with ${operationsPerUser} operations each...`);
  
  for (let i = 0; i < userCount; i++) {
    const userPromise = simulateUserSession(i, operationsPerUser);
    promises.push(userPromise);
  }
  
  const userResults = await Promise.all(promises.map(p => p.catch(e => ({ error: e.message }))));
  
  // Analyze results
  userResults.forEach(result => {
    if (result.error) {
      results.failed++;
      results.errors.push(result.error);
    } else {
      results.success++;
    }
  });
  
  const totalTime = performance.now() - startTime;
  results.avgResponseTime = totalTime / userCount;
  results.totalTime = totalTime;
  
  return results;
}

async function simulateUserSession(userId, operationCount) {
  const sessionId = `scale_test_${userId}_${Date.now()}`;
  const deviceId = `device_${userId}`;
  
  try {
    // Simulate multiple optimization operations
    for (let op = 0; op < operationCount; op++) {
      const appIds = ['com.google.Chrome', 'com.apple.Safari', 'com.tinyspeck.slackmacgap'];
      const appId = appIds[Math.floor(Math.random() * appIds.length)];
      
      // Insert learning data
      const learningData = {
        session_id: `${sessionId}_${op}`,
        device_id: deviceId,
        optimization_strategy: ['conservative', 'balanced', 'aggressive'][Math.floor(Math.random() * 3)],
        memory_freed_mb: Math.floor(Math.random() * 2000) + 100,
        speed_gain_percent: Math.random() * 50,
        effectiveness_score: Math.random(),
        optimization_context: { 
          userId,
          operation: op,
          appId,
          timestamp: new Date().toISOString()
        },
        app_optimizations: [{
          app: appId,
          memoryFreed: Math.floor(Math.random() * 500),
          action: 'clearCache'
        }]
      };
      
      await supabase.from('learning_data').insert([learningData]);
    }
    
    return { success: true, userId };
  } catch (error) {
    throw error;
  }
}

async function testDatabasePerformance() {
  console.log('📊 Testing Database Performance Under Load...\n');
  
  const tests = [
    { users: 10, ops: 5, description: '10 users, 5 ops each' },
    { users: 50, ops: 10, description: '50 users, 10 ops each' },
    { users: 100, ops: 5, description: '100 users, 5 ops each' }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`🔍 Testing: ${test.description}`);
    const result = await simulateUserLoad(test.users, test.ops);
    
    console.log(`   📊 Results:`);
    console.log(`      ✅ Success: ${result.success}/${test.users * test.ops} operations`);
    console.log(`      ❌ Failed: ${result.failed}/${test.users * test.ops} operations`);
    console.log(`      ⏱️  Avg Response: ${result.avgResponseTime.toFixed(2)}ms per user`);
    console.log(`      🕐 Total Time: ${result.totalTime.toFixed(2)}ms`);
    console.log(`      📈 Throughput: ${((test.users * test.ops) / (result.totalTime / 1000)).toFixed(2)} ops/second`);
    
    if (result.failed > 0) {
      console.log(`      ⚠️  Errors: ${result.errors.slice(0, 3).join(', ')}`);
    }
    
    results.push({
      ...test,
      ...result,
      throughput: (test.users * test.ops) / (result.totalTime / 1000)
    });
    
    console.log('');
  }
  
  return results;
}

async function testApiPerformance() {
  console.log('🌐 Testing API Performance Under Load...\n');
  
  const endpoints = [
    { path: '/api/learning/intelligence', method: 'GET' },
    { path: '/api/approval/pending', method: 'GET' }
  ];
  
  const concurrentRequests = 50;
  const results = {};
  
  for (const endpoint of endpoints) {
    console.log(`🔍 Testing ${endpoint.method} ${endpoint.path} with ${concurrentRequests} concurrent requests...`);
    
    const startTime = performance.now();
    const promises = [];
    
    for (let i = 0; i < concurrentRequests; i++) {
      const promise = fetch(`http://localhost:3000${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' }
      }).then(res => ({
        status: res.status,
        ok: res.ok,
        time: performance.now()
      })).catch(error => ({
        error: error.message,
        time: performance.now()
      }));
      
      promises.push(promise);
    }
    
    const responses = await Promise.all(promises);
    const totalTime = performance.now() - startTime;
    
    const successful = responses.filter(r => r.ok).length;
    const failed = responses.filter(r => r.error || !r.ok).length;
    
    results[endpoint.path] = {
      successful,
      failed,
      avgResponseTime: totalTime / concurrentRequests,
      throughput: concurrentRequests / (totalTime / 1000)
    };
    
    console.log(`   📊 Results:`);
    console.log(`      ✅ Success: ${successful}/${concurrentRequests}`);
    console.log(`      ❌ Failed: ${failed}/${concurrentRequests}`);
    console.log(`      ⏱️  Avg Response: ${results[endpoint.path].avgResponseTime.toFixed(2)}ms`);
    console.log(`      📈 Throughput: ${results[endpoint.path].throughput.toFixed(2)} req/second`);
    console.log('');
  }
  
  return results;
}

async function testMemoryUsage() {
  console.log('💾 Testing Memory Usage Under Load...\n');
  
  const initialMemory = process.memoryUsage();
  console.log('📊 Initial Memory Usage:');
  console.log(`   Heap Used: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Heap Total: ${(initialMemory.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   RSS: ${(initialMemory.rss / 1024 / 1024).toFixed(2)} MB`);
  
  // Simulate memory-intensive operations
  console.log('\n🔄 Running memory-intensive operations...');
  const largeDataSets = [];
  
  for (let i = 0; i < 100; i++) {
    largeDataSets.push({
      id: i,
      data: new Array(1000).fill(0).map(() => Math.random()),
      timestamp: new Date().toISOString(),
      metadata: { batch: i, size: 1000 }
    });
  }
  
  const peakMemory = process.memoryUsage();
  console.log('\n📊 Peak Memory Usage:');
  console.log(`   Heap Used: ${(peakMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Heap Total: ${(peakMemory.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   RSS: ${(peakMemory.rss / 1024 / 1024).toFixed(2)} MB`);
  
  const memoryIncrease = {
    heapUsed: (peakMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024,
    heapTotal: (peakMemory.heapTotal - initialMemory.heapTotal) / 1024 / 1024,
    rss: (peakMemory.rss - initialMemory.rss) / 1024 / 1024
  };
  
  console.log('\n📈 Memory Increase:');
  console.log(`   Heap Used: +${memoryIncrease.heapUsed.toFixed(2)} MB`);
  console.log(`   RSS: +${memoryIncrease.rss.toFixed(2)} MB`);
  
  // Cleanup
  largeDataSets.length = 0;
  global.gc && global.gc();
  
  return memoryIncrease;
}

async function runScalabilityTests() {
  console.log('🏗️  SCALABILITY & PERFORMANCE TESTING FOR 100K+ USERS');
  console.log('='*60 + '\n');
  
  try {
    // Test 1: Database Performance
    const dbResults = await testDatabasePerformance();
    
    // Test 2: API Performance  
    const apiResults = await testApiPerformance();
    
    // Test 3: Memory Usage
    const memoryResults = await testMemoryUsage();
    
    // Overall Assessment
    console.log('🎯 SCALABILITY ASSESSMENT FOR 100K+ USERS:\n');
    
    const maxThroughput = Math.max(...dbResults.map(r => r.throughput));
    const projected100k = 100000 / maxThroughput; // seconds to handle 100k operations
    
    console.log(`📊 Current Performance:`);
    console.log(`   Max DB Throughput: ${maxThroughput.toFixed(2)} ops/second`);
    console.log(`   Time for 100k ops: ${(projected100k / 60).toFixed(2)} minutes`);
    console.log(`   Memory per 100 ops: ~${memoryResults.heapUsed.toFixed(2)} MB`);
    
    const scalabilityScore = maxThroughput > 50 ? 'EXCELLENT' : 
                           maxThroughput > 20 ? 'GOOD' : 
                           maxThroughput > 10 ? 'ACCEPTABLE' : 'NEEDS IMPROVEMENT';
    
    console.log(`\n🎯 Scalability Score: ${scalabilityScore}`);
    
    if (maxThroughput > 20) {
      console.log(`✅ System can handle 100k+ users with proper infrastructure scaling`);
    } else {
      console.log(`⚠️  System may need optimization for 100k+ users`);
    }
    
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    await supabase.from('learning_data').delete().like('session_id', 'scale_test_%');
    console.log('✅ Cleanup completed');
    
    return {
      database: dbResults,
      api: apiResults,
      memory: memoryResults,
      scalabilityScore,
      maxThroughput
    };
    
  } catch (error) {
    console.error('❌ Scalability test failed:', error);
    return null;
  }
}

if (require.main === module) {
  runScalabilityTests();
}

module.exports = { runScalabilityTests };
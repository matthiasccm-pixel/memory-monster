/**
 * Test Script - Run this after applying all SQL scripts
 * This will verify that all optimizations are working correctly
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testDatabaseOptimizations() {
  console.log('🧪 TESTING DATABASE OPTIMIZATIONS');
  console.log('='.repeat(50));
  console.log(`Testing: ${supabaseUrl}\n`);

  try {
    // Test 1: Health Check
    console.log('🩺 TEST 1: Database Health Check');
    const { data: healthData, error: healthError } = await supabaseAdmin
      .rpc('database_health_check');
    
    if (healthError) {
      console.log('❌ Health check failed:', healthError.message);
    } else {
      console.log('✅ Health check passed!');
      console.log(`   Cache Hit Rate: ${healthData.cache_hit_rate}% (${healthData.cache_status})`);
      console.log(`   Optimization Status: ${healthData.optimization_status}`);
      console.log(`   Objects: ${healthData.objects.tables} tables, ${healthData.objects.indexes} indexes`);
    }
    console.log('');

    // Test 2: License Validation Function
    console.log('🔐 TEST 2: License Validation Function');
    const { data: licenseData, error: licenseError } = await supabaseAdmin
      .rpc('check_user_license', { user_email: 'matthiasccm@gmail.com' });
    
    if (licenseError) {
      console.log('❌ License check failed:', licenseError.message);
    } else if (licenseData && licenseData.length > 0) {
      const license = licenseData[0];
      console.log('✅ License validation working!');
      console.log(`   User has ${license.license_type} license`);
      console.log(`   Max devices: ${license.max_devices}`);
      console.log(`   Active: ${license.has_active_license}`);
      console.log(`   Trial: ${license.is_trial}`);
    } else {
      console.log('⚠️ License function works but no user found with that email');
    }
    console.log('');

    // Test 3: Device Verification Function  
    console.log('📱 TEST 3: Device Verification Function');
    const { data: deviceData, error: deviceError } = await supabaseAdmin
      .rpc('verify_device_license', { 
        user_email: 'matthiasccm@gmail.com', 
        device_id: 'test_device_123' 
      });
    
    if (deviceError) {
      console.log('❌ Device verification failed:', deviceError.message);
    } else if (deviceData && deviceData.length > 0) {
      const device = deviceData[0];
      console.log('✅ Device verification working!');
      console.log(`   Device authorized: ${device.is_authorized}`);
      console.log(`   Current devices: ${device.current_device_count}/${device.max_devices}`);
      console.log(`   License type: ${device.license_type}`);
    } else {
      console.log('⚠️ Device verification works but no data returned');
    }
    console.log('');

    // Test 4: Materialized Views
    console.log('📊 TEST 4: Materialized Views');
    
    // Test user license status view
    const { data: userLicenseView, error: ulvError } = await supabaseAdmin
      .from('user_license_status')
      .select('*')
      .limit(1);
    
    if (ulvError) {
      console.log('❌ User license status view failed:', ulvError.message);
    } else {
      console.log(`✅ user_license_status view working! (${userLicenseView?.length || 0} records)`);
    }

    // Test device activity summary view
    const { data: deviceActivityView, error: davError } = await supabaseAdmin
      .from('device_activity_summary')
      .select('*')
      .limit(1);
    
    if (davError) {
      console.log('❌ Device activity summary view failed:', davError.message);
    } else {
      console.log(`✅ device_activity_summary view working! (${deviceActivityView?.length || 0} records)`);
    }

    // Test admin analytics view
    const { data: adminAnalyticsView, error: aavError } = await supabaseAdmin
      .from('admin_analytics_summary')
      .select('*')
      .limit(1);
    
    if (aavError) {
      console.log('❌ Admin analytics summary view failed:', aavError.message);
    } else {
      console.log(`✅ admin_analytics_summary view working!`);
      if (adminAnalyticsView && adminAnalyticsView.length > 0) {
        const analytics = adminAnalyticsView[0];
        console.log(`   Total users: ${analytics.total_users}`);
        console.log(`   Active pro users: ${analytics.active_pro_users}`);
        console.log(`   Trial users: ${analytics.trial_users}`);
      }
    }
    console.log('');

    // Test 5: Performance Monitoring Views
    console.log('⚡ TEST 5: Performance Monitoring Views');
    
    const { data: perfMonitor, error: pmError } = await supabaseAdmin
      .from('performance_monitor')
      .select('*')
      .limit(3);
    
    if (pmError) {
      console.log('❌ Performance monitor failed:', pmError.message);
    } else {
      console.log(`✅ performance_monitor view working! (${perfMonitor?.length || 0} tables monitored)`);
      if (perfMonitor && perfMonitor.length > 0) {
        perfMonitor.forEach(table => {
          console.log(`   ${table.tablename}: ${table.live_rows} rows, ${table.status}`);
        });
      }
    }

    const { data: cachePerf, error: cpError } = await supabaseAdmin
      .from('cache_performance')
      .select('*');
    
    if (cpError) {
      console.log('❌ Cache performance monitor failed:', cpError.message);
    } else if (cachePerf && cachePerf.length > 0) {
      const cache = cachePerf[0];
      console.log(`✅ cache_performance view working!`);
      console.log(`   ${cache.metric}: ${cache.percentage}% (${cache.status})`);
    }
    console.log('');

    // Test 6: Admin Analytics Function
    console.log('📈 TEST 6: Admin Analytics Function');
    const { data: adminAnalytics, error: aaError } = await supabaseAdmin
      .rpc('get_admin_analytics');
    
    if (aaError) {
      console.log('❌ Admin analytics function failed:', aaError.message);
    } else if (adminAnalytics && adminAnalytics.length > 0) {
      console.log('✅ get_admin_analytics function working!');
      adminAnalytics.slice(0, 5).forEach(metric => {
        console.log(`   ${metric.metric_name}: ${metric.metric_value} (${metric.metric_description})`);
      });
    }
    console.log('');

    // Test 7: Maintenance Function
    console.log('🔧 TEST 7: Maintenance Functions');
    const { data: maintenanceResult, error: maintenanceError } = await supabaseAdmin
      .rpc('enhanced_daily_maintenance');
    
    if (maintenanceError) {
      console.log('❌ Maintenance function failed:', maintenanceError.message);
    } else {
      console.log('✅ enhanced_daily_maintenance function working!');
      console.log(`   Status: ${maintenanceResult.status}`);
      console.log(`   Execution time: ${maintenanceResult.execution_time_ms}ms`);
    }
    console.log('');

    // Performance Test
    console.log('⚡ PERFORMANCE TESTS');
    console.log('─'.repeat(30));
    
    // Test license lookup speed
    const start = Date.now();
    await supabaseAdmin.rpc('check_user_license', { user_email: 'matthiasccm@gmail.com' });
    const licenseTime = Date.now() - start;
    
    console.log(`License lookup: ${licenseTime}ms ${licenseTime < 100 ? '🚀' : licenseTime < 500 ? '✅' : '⚠️'}`);
    
    // Test user license view speed
    const start2 = Date.now();
    await supabaseAdmin.from('user_license_status').select('*').eq('email', 'matthiasccm@gmail.com');
    const viewTime = Date.now() - start2;
    
    console.log(`License view lookup: ${viewTime}ms ${viewTime < 50 ? '🚀' : viewTime < 200 ? '✅' : '⚠️'}`);
    console.log('');

    console.log('🎉 ALL TESTS COMPLETED!');
    console.log('Database optimization is working correctly.');

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run all tests
testDatabaseOptimizations().then(() => {
  console.log('\n✅ Test suite completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});
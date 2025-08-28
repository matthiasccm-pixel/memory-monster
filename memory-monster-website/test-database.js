const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase Connection...');
console.log('URL exists:', !!supabaseUrl);
console.log('Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  try {
    console.log('\n📊 Testing core AI learning tables...');
    
    // Test each table exists and has correct structure
    const tables = [
      'learning_data',
      'aggregated_intelligence', 
      'strategy_updates',
      'ab_tests',
      'strategy_deployments',
      'user_strategy_feedback',
      'deployment_logs'
    ];
    
    for (const table of tables) {
      console.log(`⏳ Testing table: ${table}`);
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.error(`❌ Table ${table} error:`, error.message);
      } else {
        console.log(`✅ Table ${table} accessible`);
      }
    }
    
    // Test desktop sync tables
    const syncTables = [
      'approved_strategies',
      'desktop_notifications', 
      'supported_apps',
      'desktop_sync_status'
    ];
    
    console.log('\n🖥️ Testing desktop sync tables...');
    for (const table of syncTables) {
      console.log(`⏳ Testing sync table: ${table}`);
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.error(`❌ Sync table ${table} error:`, error.message);
      } else {
        console.log(`✅ Sync table ${table} accessible`);
      }
    }
    
    // Test sample data insertion
    console.log('\n📝 Testing data insertion...');
    const testData = {
      session_id: 'test_' + Date.now(),
      device_id: 'test_device',
      optimization_strategy: 'balanced',
      memory_freed_mb: 500,
      speed_gain_percent: 15.5,
      effectiveness_score: 0.85,
      optimization_context: { test: true },
      app_optimizations: [{ app: 'Chrome', memoryFreed: 500 }]
    };
    
    const { data: inserted, error: insertError } = await supabase
      .from('learning_data')
      .insert([testData])
      .select();
      
    if (insertError) {
      console.error('❌ Data insertion failed:', insertError.message);
    } else {
      console.log('✅ Data insertion successful');
      
      // Clean up test data
      await supabase
        .from('learning_data')
        .delete()
        .eq('session_id', testData.session_id);
      console.log('✅ Test data cleaned up');
    }
    
    console.log('\n🎉 Database integration test completed');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testDatabase();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkLearningTables() {
  console.log('🔍 Checking learning system tables...\n');

  const expectedTables = [
    'learning_data',
    'aggregated_intelligence', 
    'app_intelligence_profiles',
    'system_performance_patterns',
    'user_learning_preferences'
  ];

  for (const tableName of expectedTables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(1);

      if (!error) {
        console.log(`✅ ${tableName}`);
        console.log(`   └─ Row count: ${count || 0}`);
        
        if (data && data.length > 0) {
          const columns = Object.keys(data[0]);
          console.log(`   └─ Columns: ${columns.join(', ')}`);
        } else {
          console.log(`   └─ Empty table (ready for data)`);
        }
      } else {
        console.log(`❌ ${tableName}: ${error.message}`);
      }
    } catch (e) {
      console.log(`❌ ${tableName}: Not accessible`);
    }
  }

  console.log('\n🧠 Testing a sample learning data insert...');
  
  try {
    const testData = {
      session_id: 'test_session_' + Date.now(),
      device_id: 'test_device_123',
      device_profile: {
        isAppleSilicon: true,
        memoryGB: 16,
        coreCount: 8
      },
      optimization_strategy: 'balanced',
      memory_freed_mb: 500,
      speed_gain_percent: 25.5,
      effectiveness_score: 0.85,
      optimization_context: {
        timeOfDay: 14,
        dayOfWeek: 1,
        systemLoad: {
          memoryPressure: 65.2,
          cpuUsage: 45.3
        }
      },
      app_optimizations: [
        {
          appCategory: 'browser',
          memoryFreed: 300,
          actionsCount: 3,
          success: true
        }
      ]
    };

    const { data, error } = await supabase
      .from('learning_data')
      .insert([testData])
      .select();

    if (!error) {
      console.log('✅ Test data insert successful');
      console.log(`   └─ Inserted record ID: ${data[0]?.id}`);
      
      // Clean up test data
      await supabase
        .from('learning_data')
        .delete()
        .eq('session_id', testData.session_id);
      console.log('   └─ Test data cleaned up');
    } else {
      console.log(`❌ Test insert failed: ${error.message}`);
    }
  } catch (insertError) {
    console.log(`❌ Insert test failed: ${insertError.message}`);
  }
}

checkLearningTables().catch(console.error);
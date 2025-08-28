const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
  console.log('🔍 Inspecting database schema...');
  
  try {
    // Get sample data to see actual columns
    const { data: strategyData } = await supabase
      .from('strategy_updates')
      .select('*')
      .limit(1);
      
    const { data: abTestData } = await supabase
      .from('ab_tests')
      .select('*')
      .limit(1);
    
    console.log('\n📊 strategy_updates table sample:');
    console.log(strategyData?.[0] || 'No data');
    
    console.log('\n📊 ab_tests table sample:');
    console.log(abTestData?.[0] || 'No data');
    
    // Try to insert minimal data to see required fields
    console.log('\n🧪 Testing minimal strategy_updates insert...');
    const { error: strategyError } = await supabase
      .from('strategy_updates')
      .insert([{
        strategy_name: 'Test Strategy',
        app_id: 'com.test.schema',
        old_version: '1.0.0',
        new_version: '1.1.0',
        status: 'pending',
        effectiveness_score: 0.85
      }]);
    
    if (strategyError) {
      console.log('Strategy insert error:', strategyError);
    } else {
      console.log('✅ Strategy insert successful');
      // Clean up
      await supabase.from('strategy_updates').delete().eq('app_id', 'com.test.schema');
    }
    
    console.log('\n🧪 Testing minimal ab_tests insert...');
    const { error: abTestError } = await supabase
      .from('ab_tests')
      .insert([{
        test_name: 'Schema Test',
        status: 'ready'
      }]);
    
    if (abTestError) {
      console.log('AB test insert error:', abTestError);
    } else {
      console.log('✅ AB test insert successful');
      // Clean up
      await supabase.from('ab_tests').delete().eq('test_name', 'Schema Test');
    }
    
  } catch (error) {
    console.error('Schema inspection failed:', error);
  }
}

inspectSchema();
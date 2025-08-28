const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDatabase() {
  console.log('🔍 Inspecting existing Supabase database...\n');

  // Common table names to check for in a typical app
  const commonTables = [
    'users', 'profiles', 'customers', 'subscriptions', 'usage_data', 'analytics',
    'app_data', 'sessions', 'orders', 'payments', 'logs', 'settings',
    'user_profiles', 'billing', 'transactions', 'metrics', 'events'
  ];

  const existingTables = [];

  console.log('🔍 Checking for common table patterns...\n');

  // Test each common table name
  for (const tableName of commonTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (!error) {
        existingTables.push(tableName);
        console.log(`✅ Found table: ${tableName}`);
        
        // Get more info about this table
        try {
          const { count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          console.log(`   └─ Row count: ${count || 0}`);
          
          // Show sample data structure
          if (data && data.length > 0) {
            console.log(`   └─ Sample columns: ${Object.keys(data[0]).join(', ')}`);
          }
        } catch (countError) {
          console.log(`   └─ Could not get row count`);
        }
      }
    } catch (e) {
      // Table doesn't exist, skip silently
    }
  }

  if (existingTables.length === 0) {
    console.log('📋 No common tables found. This appears to be a fresh database.');
    console.log('\n🆕 We can create new tables for the learning system safely.');
  } else {
    console.log(`\n✅ Found ${existingTables.length} existing tables:`);
    existingTables.forEach(table => console.log(`  - ${table}`));
    
    // Now inspect each existing table in detail
    console.log('\n🔎 Detailed inspection of existing tables:');
    
    for (const tableName of existingTables) {
      console.log(`\n📋 Table: ${tableName}`);
      console.log('─'.repeat(50));
      
      try {
        // Get a sample record to understand the structure
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (!error && data && data.length > 0) {
          const sampleRecord = data[0];
          console.log('Structure:');
          Object.entries(sampleRecord).forEach(([key, value]) => {
            const type = typeof value;
            const preview = type === 'string' ? `"${value.substring(0, 30)}${value.length > 30 ? '...' : ''}"` :
                           type === 'object' ? JSON.stringify(value).substring(0, 50) + '...' :
                           String(value);
            console.log(`  ${key}: ${type} = ${preview}`);
          });
        } else {
          console.log('  (Empty table or access denied)');
        }

      } catch (tableError) {
        console.log(`  ❌ Error inspecting ${tableName}: ${tableError.message}`);
      }
    }
  }

  // Check if we already have any learning-related tables
  const learningTables = ['learning_data', 'aggregated_intelligence', 'optimization_results', 'app_intelligence'];
  const existingLearningTables = [];
  
  console.log('\n🧠 Checking for existing learning system tables...');
  
  for (const tableName of learningTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (!error) {
        existingLearningTables.push(tableName);
        console.log(`✅ Found learning table: ${tableName}`);
      }
    } catch (e) {
      // Table doesn't exist
    }
  }
  
  if (existingLearningTables.length === 0) {
    console.log('📋 No existing learning tables found. We need to create them.');
  } else {
    console.log(`\n⚠️  Found ${existingLearningTables.length} existing learning tables:`);
    existingLearningTables.forEach(table => console.log(`  - ${table}`));
    console.log('We should inspect these before creating new ones.');
  }

  console.log('\n✅ Database inspection complete!');
  console.log('\n📝 Recommendations:');
  
  if (existingTables.length > 0) {
    console.log('1. Follow existing naming conventions');
    console.log('2. Use similar column structures where possible');
    console.log('3. Consider adding foreign key relationships to existing tables');
  } else {
    console.log('1. We can create a fresh schema optimized for learning data');
    console.log('2. Use descriptive table and column names');
    console.log('3. Consider future expansion needs');
  }
}

// Run the inspection
inspectDatabase().catch(console.error);
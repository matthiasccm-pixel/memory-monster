/**
 * Simple Database Analysis Runner
 * Run this to analyze your current Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure .env.local contains:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runComprehensiveAnalysis() {
  console.log('🔍 COMPREHENSIVE SUPABASE DATABASE ANALYSIS');
  console.log('='.repeat(60));
  console.log(`Project: ${supabaseUrl}`);
  console.log('='.repeat(60) + '\n');

  try {
    // Try to get tables by querying common ones
    console.log('📋 STEP 1: Discovering all tables...');
    const commonTables = ['profiles', 'subscriptions', 'downloads', 'app_usage', 'blog_posts', 'blog_categories', 'blog_tags', 'license_keys'];
    const existingTables = [];
    
    for (const tableName of commonTables) {
      try {
        const { error } = await supabaseAdmin
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!error) {
          existingTables.push({ table_name: tableName });
        }
      } catch (e) {
        // Table doesn't exist, skip
      }
    }
    
    if (existingTables.length > 0) {
      console.log(`Found ${existingTables.length} tables:`);
      existingTables.forEach(table => console.log(`  ✅ ${table.table_name}`));
      
      // Analyze each existing table
      await analyzeExistingTables(existingTables);
    } else {
      console.log('❌ No tables found or access denied');
    }

  } catch (error) {
    console.error('❌ Analysis failed:', error);
  }
}

async function analyzeExistingTables(tables) {
  console.log('\n📊 STEP 2: Analyzing each table...\n');
  
  for (const table of tables) {
    const tableName = table.table_name;
    console.log(`🔸 TABLE: ${tableName.toUpperCase()}`);
    console.log('─'.repeat(50));
    
    try {
      // Get basic info
      const { count, error: countError } = await supabaseAdmin
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (!countError) {
        console.log(`📊 Row count: ${count || 0}`);
      }

      // Get sample data
      const { data: sampleData, error: sampleError } = await supabaseAdmin
        .from(tableName)
        .select('*')
        .limit(1);

      if (!sampleError && sampleData && sampleData.length > 0) {
        console.log('\n📝 Sample structure (first row):');
        const firstRow = sampleData[0];
        Object.keys(firstRow).forEach(key => {
          const value = firstRow[key];
          const type = typeof value;
          let displayValue = value;
          
          if (type === 'string' && value && value.length > 50) {
            displayValue = value.substring(0, 50) + '...';
          } else if (value === null) {
            displayValue = 'NULL';
          } else if (type === 'object' && value !== null) {
            displayValue = Array.isArray(value) ? '[Array]' : '[Object]';
          }
          
          console.log(`  ${key}: ${displayValue} (${type})`);
        });
      } else if (sampleError) {
        console.log('⚠️ Could not fetch sample data:', sampleError.message);
      } else {
        console.log('📝 Table is empty');
      }

      // Try to identify the schema based on table name
      if (tableName === 'profiles') {
        console.log('\n🔍 PROFILES TABLE ANALYSIS:');
        await analyzeProfilesTable();
      } else if (tableName === 'subscriptions') {
        console.log('\n🔍 SUBSCRIPTIONS TABLE ANALYSIS:');
        await analyzeSubscriptionsTable();
      } else if (tableName === 'downloads') {
        console.log('\n🔍 DOWNLOADS TABLE ANALYSIS:');
        await analyzeDownloadsTable();
      } else if (tableName === 'app_usage') {
        console.log('\n🔍 APP_USAGE TABLE ANALYSIS:');
        await analyzeAppUsageTable();
      }

    } catch (error) {
      console.log(`❌ Error analyzing ${tableName}:`, error.message);
    }

    console.log('\n' + '='.repeat(60) + '\n');
  }

  // Final analysis summary
  console.log('📋 OPTIMIZATION REQUIREMENTS ANALYSIS:');
  console.log('─'.repeat(50));
  await analyzeOptimizationNeeds(tables);
}

async function analyzeProfilesTable() {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .limit(3);

    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }

    console.log(`  📊 Sample profiles: ${data.length}`);
    if (data.length > 0) {
      const profile = data[0];
      console.log('  🔑 Key fields found:');
      ['id', 'clerk_user_id', 'email', 'full_name', 'stripe_customer_id', 'plan'].forEach(field => {
        if (profile.hasOwnProperty(field)) {
          console.log(`    ✅ ${field}: ${profile[field] ? '(has data)' : '(empty)'}`);
        } else {
          console.log(`    ❌ ${field} (missing)`);
        }
      });
    }
  } catch (error) {
    console.log('❌ Analysis error:', error.message);
  }
}

async function analyzeSubscriptionsTable() {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .limit(3);

    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }

    console.log(`  📊 Sample subscriptions: ${data.length}`);
    if (data.length > 0) {
      const sub = data[0];
      console.log('  🔑 Key fields found:');
      ['id', 'user_id', 'stripe_subscription_id', 'status', 'plan_id', 'current_period_end'].forEach(field => {
        if (sub.hasOwnProperty(field)) {
          console.log(`    ✅ ${field}: ${sub[field] ? '(has data)' : '(empty)'}`);
        } else {
          console.log(`    ❌ ${field} (missing)`);
        }
      });
    }
  } catch (error) {
    console.log('❌ Analysis error:', error.message);
  }
}

async function analyzeDownloadsTable() {
  try {
    const { data, error } = await supabaseAdmin
      .from('downloads')
      .select('*')
      .limit(3);

    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }

    console.log(`  📊 Sample downloads: ${data.length}`);
    if (data.length > 0) {
      const download = data[0];
      console.log('  🔑 Key fields found:');
      ['id', 'user_id', 'device_id', 'platform', 'version', 'created_at'].forEach(field => {
        if (download.hasOwnProperty(field)) {
          console.log(`    ✅ ${field}: ${download[field] ? '(has data)' : '(empty)'}`);
        } else {
          console.log(`    ❌ ${field} (missing)`);
        }
      });
    }
  } catch (error) {
    console.log('❌ Analysis error:', error.message);
  }
}

async function analyzeAppUsageTable() {
  try {
    const { data, error } = await supabaseAdmin
      .from('app_usage')
      .select('*')
      .limit(3);

    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }

    console.log(`  📊 Sample app_usage: ${data.length}`);
    if (data.length > 0) {
      const usage = data[0];
      console.log('  🔑 Key fields found:');
      ['id', 'user_id', 'device_id', 'app_version', 'memory_scans_performed', 'last_active'].forEach(field => {
        if (usage.hasOwnProperty(field)) {
          console.log(`    ✅ ${field}: ${usage[field] ? '(has data)' : '(empty)'}`);
        } else {
          console.log(`    ❌ ${field} (missing)`);
        }
      });
    }
  } catch (error) {
    console.log('❌ Analysis error:', error.message);
  }
}

async function analyzeOptimizationNeeds(tables) {
  const tableNames = tables.map(t => t.table_name);
  
  console.log('🎯 OPTIMIZATION SCRIPT COMPATIBILITY:');
  
  // Check what our optimization script expects vs what exists
  const expectedTables = ['profiles', 'subscriptions', 'downloads'];
  const missingTables = expectedTables.filter(table => !tableNames.includes(table));
  const extraTables = tableNames.filter(table => !expectedTables.includes(table));
  
  if (missingTables.length > 0) {
    console.log(`❌ Missing expected tables: ${missingTables.join(', ')}`);
  }
  
  if (extraTables.length > 0) {
    console.log(`➕ Additional tables found: ${extraTables.join(', ')}`);
  }
  
  console.log(`✅ Compatible tables: ${expectedTables.filter(table => tableNames.includes(table)).join(', ')}`);
  
  console.log('\n🛠️ RECOMMENDED ACTIONS:');
  console.log('1. ✅ Core optimization script should work with existing tables');
  console.log('2. 📝 May need to add indexes for additional tables found');
  console.log('3. 🔍 Review materialized views for additional data sources');
}

// Run the analysis
runComprehensiveAnalysis().then(() => {
  console.log('\n✅ Database analysis complete!');
  console.log('📝 Next steps: Review the analysis above and run the optimization script');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Analysis failed:', error);
  process.exit(1);
});
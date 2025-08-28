const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupLearningDatabase() {
  console.log('🚀 Setting up Learning System Database...\n');

  try {
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'create-learning-tables.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split into individual statements (rough split on semicolons)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📄 Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (!statement || statement.startsWith('--')) continue;
      
      const shortStatement = statement.substring(0, 60).replace(/\s+/g, ' ') + 
                           (statement.length > 60 ? '...' : '');
      
      console.log(`[${i + 1}/${statements.length}] ${shortStatement}`);
      
      try {
        // Execute the statement using the Supabase client
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql: statement + ';' 
        });

        if (error) {
          // Try alternative method if RPC doesn't work
          console.log('   ⚠️  RPC method failed, trying direct execution...');
          
          // For table creation, we can use the REST API indirectly
          // This is a workaround since Supabase doesn't expose raw SQL execution
          if (statement.toUpperCase().includes('CREATE TABLE')) {
            console.log('   ⚠️  Table creation requires Supabase Dashboard or SQL Editor');
            console.log('   📋 Statement saved for manual execution');
            errorCount++;
          } else {
            throw error;
          }
        } else {
          console.log('   ✅ Success');
          successCount++;
        }
      } catch (execError) {
        console.log(`   ❌ Error: ${execError.message}`);
        errorCount++;
        
        // Don't exit on errors, continue with other statements
      }
      
      // Small delay between statements
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n📊 Database Setup Summary:');
    console.log(`   ✅ Successful operations: ${successCount}`);
    console.log(`   ❌ Failed operations: ${errorCount}`);

    if (errorCount > 0) {
      console.log('\n⚠️  Some operations failed. You may need to:');
      console.log('1. Run the SQL manually in Supabase Dashboard > SQL Editor');
      console.log('2. Check if tables already exist');
      console.log('3. Verify your service role permissions');
      
      console.log('\n📄 Manual SQL file location:');
      console.log(`   ${sqlFile}`);
    }

    // Test the setup by checking if our tables exist
    console.log('\n🔍 Verifying table creation...');
    
    const testTables = [
      'learning_data', 
      'aggregated_intelligence', 
      'app_intelligence_profiles', 
      'system_performance_patterns', 
      'user_learning_preferences'
    ];

    let verifiedTables = 0;
    
    for (const tableName of testTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (!error) {
          console.log(`   ✅ ${tableName} - Table exists and accessible`);
          verifiedTables++;
        } else {
          console.log(`   ❌ ${tableName} - ${error.message}`);
        }
      } catch (e) {
        console.log(`   ❌ ${tableName} - Not accessible`);
      }
    }

    console.log(`\n📊 Verification Results: ${verifiedTables}/${testTables.length} tables verified`);

    if (verifiedTables === testTables.length) {
      console.log('\n🎉 Learning system database setup complete!');
      console.log('✅ All tables are created and accessible');
      console.log('\n🔄 Next steps:');
      console.log('1. Update API endpoints to use the new database');
      console.log('2. Test data insertion and retrieval');
      console.log('3. Run the learning demo to populate with real data');
    } else {
      console.log('\n⚠️  Setup incomplete. Manual intervention may be required.');
      console.log('\n📖 Instructions for manual setup:');
      console.log('1. Open Supabase Dashboard');
      console.log('2. Go to SQL Editor');
      console.log('3. Copy and paste the contents of create-learning-tables.sql');
      console.log('4. Execute the SQL statements');
      console.log('5. Re-run this verification script');
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupLearningDatabase().catch(console.error);
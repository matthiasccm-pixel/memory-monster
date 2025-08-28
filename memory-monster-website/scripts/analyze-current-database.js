/**
 * Comprehensive Supabase Database Analysis Script
 * This script will analyze your current database structure and data
 */

import { supabaseAdmin } from '../app/lib/supabase.js';

async function analyzeDatabaseStructure() {
  console.log('🔍 Starting comprehensive database analysis...\n');
  
  try {
    // 1. Get all tables in the public schema
    console.log('📋 STEP 1: Analyzing all tables...');
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');

    if (tablesError) {
      console.error('❌ Error fetching tables:', tablesError);
      return;
    }

    console.log(`Found ${tables.length} tables:`);
    tables.forEach(table => console.log(`  - ${table.table_name}`));
    console.log('');

    // 2. For each table, get detailed schema information
    console.log('📊 STEP 2: Analyzing table structures...\n');
    
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`🔸 TABLE: ${tableName.toUpperCase()}`);
      console.log('─'.repeat(50));
      
      // Get columns
      const { data: columns, error: columnsError } = await supabaseAdmin
        .rpc('get_table_schema', { table_name: tableName })
        .catch(async () => {
          // Fallback: query information_schema directly
          const { data, error } = await supabaseAdmin
            .from('information_schema.columns')
            .select('column_name, data_type, is_nullable, column_default')
            .eq('table_schema', 'public')
            .eq('table_name', tableName)
            .order('ordinal_position');
          return { data, error };
        });

      if (columnsError) {
        console.error(`❌ Error fetching columns for ${tableName}:`, columnsError);
        continue;
      }

      // Display columns
      console.log('Columns:');
      columns?.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}`);
      });

      // Get current indexes
      const { data: indexes, error: indexError } = await supabaseAdmin
        .rpc('get_table_indexes', { table_name: tableName })
        .catch(() => ({ data: [], error: null })); // Ignore if function doesn't exist

      if (indexes && indexes.length > 0) {
        console.log('\nIndexes:');
        indexes.forEach(idx => {
          console.log(`  - ${idx.indexname}: ${idx.indexdef}`);
        });
      }

      // Get row count (sample)
      const { count, error: countError } = await supabaseAdmin
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (!countError) {
        console.log(`\nRow count: ${count || 0}`);
      }

      // Get sample data (first 3 rows)
      const { data: sampleData, error: sampleError } = await supabaseAdmin
        .from(tableName)
        .select('*')
        .limit(3);

      if (!sampleError && sampleData && sampleData.length > 0) {
        console.log('\nSample data (first row):');
        const firstRow = sampleData[0];
        Object.keys(firstRow).forEach(key => {
          const value = firstRow[key];
          const displayValue = typeof value === 'string' && value.length > 50 
            ? value.substring(0, 50) + '...'
            : value;
          console.log(`  ${key}: ${displayValue}`);
        });
      }

      console.log('\n' + '='.repeat(60) + '\n');
    }

    // 3. Check for foreign key relationships
    console.log('🔗 STEP 3: Analyzing foreign key relationships...');
    const { data: foreignKeys, error: fkError } = await supabaseAdmin
      .from('information_schema.key_column_usage')
      .select('table_name, column_name, referenced_table_name, referenced_column_name')
      .eq('table_schema', 'public')
      .not('referenced_table_name', 'is', null);

    if (!fkError && foreignKeys && foreignKeys.length > 0) {
      console.log('Foreign Key Relationships:');
      foreignKeys.forEach(fk => {
        console.log(`  ${fk.table_name}.${fk.column_name} -> ${fk.referenced_table_name}.${fk.referenced_column_name}`);
      });
    } else {
      console.log('No foreign key relationships found or error:', fkError);
    }

    // 4. Check for existing indexes
    console.log('\n🔍 STEP 4: Current database performance state...');
    
    // Check if our optimization functions already exist
    const optimizationChecks = [
      'user_license_status', // materialized view
      'device_activity_summary', // materialized view
      'check_user_license', // function
      'verify_device_license', // function
      'daily_maintenance' // function
    ];

    for (const item of optimizationChecks) {
      // Check if materialized view exists
      const { data: mvExists } = await supabaseAdmin
        .from('pg_matviews')
        .select('matviewname')
        .eq('matviewname', item)
        .single();

      // Check if function exists
      const { data: funcExists } = await supabaseAdmin
        .from('information_schema.routines')
        .select('routine_name')
        .eq('routine_schema', 'public')
        .eq('routine_name', item)
        .single();

      if (mvExists || funcExists) {
        console.log(`✅ ${item} already exists`);
      } else {
        console.log(`❌ ${item} missing - needs to be created`);
      }
    }

  } catch (error) {
    console.error('❌ Analysis failed:', error);
  }
}

// Helper function to get table schema (you'll need to create this in Supabase)
async function createAnalysisHelpers() {
  console.log('🛠️ Creating helper functions for analysis...');
  
  const createSchemaFunction = `
CREATE OR REPLACE FUNCTION get_table_schema(table_name text)
RETURNS TABLE(
  column_name text,
  data_type text,
  is_nullable text,
  column_default text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = $1
  ORDER BY c.ordinal_position;
END;
$$ LANGUAGE plpgsql;
`;

  const createIndexFunction = `
CREATE OR REPLACE FUNCTION get_table_indexes(table_name text)
RETURNS TABLE(
  indexname text,
  indexdef text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.indexname::text,
    i.indexdef::text
  FROM pg_indexes i
  WHERE i.schemaname = 'public'
    AND i.tablename = $1;
END;
$$ LANGUAGE plpgsql;
`;

  try {
    await supabaseAdmin.rpc('exec_sql', { sql: createSchemaFunction });
    await supabaseAdmin.rpc('exec_sql', { sql: createIndexFunction });
    console.log('✅ Helper functions created');
  } catch (error) {
    console.log('⚠️ Helper functions may already exist or need manual creation');
  }
}

// Run the analysis
async function runAnalysis() {
  await createAnalysisHelpers();
  await analyzeDatabaseStructure();
}

export { runAnalysis };

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAnalysis();
}
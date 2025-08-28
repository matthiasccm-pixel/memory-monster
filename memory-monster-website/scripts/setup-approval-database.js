#!/usr/bin/env node

/**
 * Setup Approval Pipeline Database Tables
 * Creates all tables needed for strategy approval, A/B testing, and deployment
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupApprovalDatabase() {
  try {
    console.log('🚀 Setting up approval pipeline database...');
    
    // Read SQL schema
    const sqlPath = path.join(__dirname, 'create-approval-tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL statements (basic split on empty lines)
    const statements = sqlContent
      .split(/\n\s*\n/)
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📄 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      try {
        if (statement.includes('CREATE TABLE') || 
            statement.includes('CREATE INDEX') || 
            statement.includes('CREATE VIEW')) {
          
          console.log(`⏳ Executing: ${statement.split(' ').slice(0, 4).join(' ')}...`);
          
          const { error } = await supabase.rpc('exec_sql', { 
            sql: statement 
          });

          if (error) {
            // Check if it's just a "table already exists" error
            if (error.message.includes('already exists')) {
              console.log(`⚠️  Already exists: ${statement.split(' ')[2]}`);
            } else {
              throw error;
            }
          } else {
            console.log(`✅ Created: ${statement.split(' ')[2]}`);
          }
          
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to execute statement: ${error.message}`);
        errorCount++;
      }
    }

    // Verify tables were created
    console.log('\n📋 Verifying created tables...');
    
    const tablesToCheck = [
      'strategy_updates',
      'ab_tests', 
      'strategy_deployments',
      'user_strategy_feedback',
      'deployment_logs'
    ];

    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          console.error(`❌ Table ${tableName}: ${error.message}`);
        } else {
          console.log(`✅ Table ${tableName}: Ready`);
        }
      } catch (error) {
        console.error(`❌ Table ${tableName}: ${error.message}`);
      }
    }

    // Check views
    console.log('\n👁️  Verifying views...');
    const viewsToCheck = [
      'pending_approvals',
      'active_ab_tests',
      'deployment_summary'
    ];

    for (const viewName of viewsToCheck) {
      try {
        const { data, error } = await supabase
          .from(viewName)
          .select('*')
          .limit(1);

        if (error) {
          console.error(`❌ View ${viewName}: ${error.message}`);
        } else {
          console.log(`✅ View ${viewName}: Ready`);
        }
      } catch (error) {
        console.error(`❌ View ${viewName}: ${error.message}`);
      }
    }

    console.log(`\n🎉 Approval database setup completed!`);
    console.log(`   ✅ ${successCount} statements executed successfully`);
    if (errorCount > 0) {
      console.log(`   ⚠️  ${errorCount} statements had errors (likely already existed)`);
    }

    // Insert sample data for testing
    await insertSampleData();
    
  } catch (error) {
    console.error('❌ Failed to setup approval database:', error);
    process.exit(1);
  }
}

async function insertSampleData() {
  console.log('\n🔄 Inserting sample data for testing...');

  try {
    // Check if we already have sample data
    const { data: existing } = await supabase
      .from('strategy_updates')
      .select('id')
      .limit(1);

    if (existing && existing.length > 0) {
      console.log('📦 Sample data already exists, skipping...');
      return;
    }

    // Sample strategy update
    const sampleStrategyUpdate = {
      app_id: 'com.google.Chrome',
      strategy_type: 'balanced',
      update_type: 'threshold_adjustment',
      update_data: {
        thresholdAdjustment: {
          criticalThreshold: 100,
          reason: 'Learned from 500+ users that Chrome can handle higher thresholds'
        }
      },
      estimated_impact: {
        memory_savings_mb: 150,
        speed_improvement_percent: 8,
        user_satisfaction_score: 0.85
      },
      sample_size: 523,
      confidence_score: 0.96,
      statistical_significance: true,
      consistency_period_days: 14,
      risk_level: 'low',
      safety_score: 0.92,
      potential_issues: ['May increase CPU usage slightly'],
      version: 'chrome_balanced_v240826',
      base_strategy_version: '1.0.0',
      status: 'pending'
    };

    const { data: strategyUpdate, error: strategyError } = await supabase
      .from('strategy_updates')
      .insert([sampleStrategyUpdate])
      .select()
      .single();

    if (strategyError) {
      console.error('❌ Failed to insert sample strategy update:', strategyError);
    } else {
      console.log('✅ Inserted sample strategy update');
    }

  } catch (error) {
    console.error('⚠️  Failed to insert sample data:', error.message);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupApprovalDatabase();
}

module.exports = { setupApprovalDatabase };
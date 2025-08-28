/**
 * Desktop App Strategy Loading Test
 * Tests all app strategy files can be loaded correctly
 */

const fs = require('fs');
const path = require('path');

const STRATEGIES_BASE_PATH = '/Users/matthiasmetternich/mac-optimizer-app/src/core/optimization/strategies/base';

async function testStrategyLoading() {
  console.log('🔍 Testing Desktop App Strategy Loading System...\n');
  
  const results = {
    loaded: 0,
    failed: 0,
    issues: []
  };
  
  try {
    // Test each app category
    const categories = ['browsers', 'communication', 'media', 'productivity'];
    
    for (const category of categories) {
      const categoryPath = path.join(STRATEGIES_BASE_PATH, category);
      console.log(`📂 Testing ${category} strategies...`);
      
      if (!fs.existsSync(categoryPath)) {
        console.log(`   ⚠️  Category ${category} directory not found`);
        continue;
      }
      
      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
      
      for (const file of files) {
        const filePath = path.join(categoryPath, file);
        const appName = file.replace('.js', '');
        
        console.log(`   🔍 Testing ${appName}...`);
        
        try {
          // Try to require the strategy file
          const absolutePath = path.resolve(filePath);
          delete require.cache[absolutePath];
          const strategy = require(absolutePath);
          
          // Validate strategy structure
          const validation = validateStrategy(strategy.default || strategy);
          
          if (validation.valid) {
            console.log(`   ✅ ${appName} strategy loaded successfully`);
            results.loaded++;
          } else {
            console.log(`   ❌ ${appName} strategy validation failed:`, validation.errors.join(', '));
            results.failed++;
            results.issues.push(`${appName}: ${validation.errors.join(', ')}`);
          }
          
        } catch (error) {
          console.log(`   ❌ ${appName} failed to load:`, error.message);
          results.failed++;
          results.issues.push(`${appName}: ${error.message}`);
        }
      }
    }
    
    // Test system strategy
    console.log(`\n🖥️  Testing system strategy...`);
    try {
      const systemPath = '/Users/matthiasmetternich/mac-optimizer-app/src/core/optimization/strategies/system/macos-system.js';
      if (fs.existsSync(systemPath)) {
        const systemStrategy = require(path.resolve(systemPath));
        const validation = validateSystemStrategy(systemStrategy.default || systemStrategy);
        
        if (validation.valid) {
          console.log(`   ✅ macOS system strategy loaded successfully`);
          results.loaded++;
        } else {
          console.log(`   ❌ macOS system strategy validation failed:`, validation.errors.join(', '));
          results.failed++;
          results.issues.push(`macOS System: ${validation.errors.join(', ')}`);
        }
      } else {
        console.log(`   ❌ macOS system strategy file not found`);
        results.failed++;
        results.issues.push('macOS System: File not found');
      }
    } catch (error) {
      console.log(`   ❌ macOS system strategy failed to load:`, error.message);
      results.failed++;
      results.issues.push(`macOS System: ${error.message}`);
    }
    
    // Summary
    const total = results.loaded + results.failed;
    console.log(`\n📊 Strategy Loading Test Summary:`);
    console.log(`   ✅ Loaded: ${results.loaded}/${total}`);
    console.log(`   ❌ Failed: ${results.failed}/${total}`);
    console.log(`   📈 Success Rate: ${Math.round((results.loaded / total) * 100)}%`);
    
    if (results.issues.length > 0) {
      console.log(`\n🚨 Issues Found:`);
      results.issues.forEach(issue => console.log(`   • ${issue}`));
    }
    
    return results.failed === 0;
    
  } catch (error) {
    console.error('❌ Strategy loading test failed:', error);
    return false;
  }
}

function validateStrategy(strategy) {
  const errors = [];
  const required = ['appId', 'displayName', 'category', 'version', 'optimizationStrategies'];
  
  for (const field of required) {
    if (!strategy[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate optimization strategies structure
  if (strategy.optimizationStrategies) {
    const requiredStrategies = ['conservative', 'balanced', 'aggressive'];
    for (const strategyType of requiredStrategies) {
      if (!strategy.optimizationStrategies[strategyType]) {
        errors.push(`Missing ${strategyType} strategy`);
      } else {
        const strat = strategy.optimizationStrategies[strategyType];
        if (!strat.actions || !Array.isArray(strat.actions)) {
          errors.push(`${strategyType} strategy missing actions array`);
        }
        if (!strat.estimatedSavings) {
          errors.push(`${strategyType} strategy missing estimatedSavings`);
        }
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function validateSystemStrategy(strategy) {
  const errors = [];
  const required = ['systemId', 'displayName', 'category', 'version', 'optimizationStrategies'];
  
  for (const field of required) {
    if (!strategy[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate system-specific fields
  if (!strategy.supportedVersions) {
    errors.push('Missing supportedVersions');
  }
  
  if (!strategy.systemProfiles) {
    errors.push('Missing systemProfiles');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

if (require.main === module) {
  testStrategyLoading();
}

module.exports = { testStrategyLoading };
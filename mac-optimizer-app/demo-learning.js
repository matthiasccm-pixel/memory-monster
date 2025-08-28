/**
 * Demo Learning Data Generator
 * Simulates real optimization sessions to populate the learning system
 */

const fetch = require('node-fetch');

const WEBSITE_API_BASE = 'http://localhost:3000/api';

// Simulate different system profiles
const systemProfiles = [
  {
    isAppleSilicon: true,
    memoryGB: 16,
    coreCount: 8,
    name: 'MacBook Pro M3'
  },
  {
    isAppleSilicon: true,
    memoryGB: 32,
    coreCount: 12,
    name: 'MacBook Pro M3 Max'
  },
  {
    isAppleSilicon: false,
    memoryGB: 16,
    coreCount: 8,
    name: 'iMac Intel'
  },
  {
    isAppleSilicon: false,
    memoryGB: 32,
    coreCount: 6,
    name: 'Mac Pro Intel'
  }
];

// Simulate app optimization results
const appCategories = ['browser', 'communication', 'media', 'development', 'other'];
const strategies = ['conservative', 'balanced', 'aggressive'];

function generateRandomLearningData() {
  const profile = systemProfiles[Math.floor(Math.random() * systemProfiles.length)];
  const strategy = strategies[Math.floor(Math.random() * strategies.length)];
  const timeOfDay = Math.floor(Math.random() * 24);
  const dayOfWeek = Math.floor(Math.random() * 7);
  
  // Base effectiveness on strategy and system
  let baseEffectiveness = 0.5;
  if (strategy === 'aggressive') baseEffectiveness = 0.75;
  if (strategy === 'balanced') baseEffectiveness = 0.65;
  if (profile.isAppleSilicon) baseEffectiveness += 0.1;
  
  // Add some randomness and context
  const timeBonus = [9, 10, 11, 14, 15, 16].includes(timeOfDay) ? 0.1 : 0;
  const effectiveness = Math.min(1, Math.max(0, baseEffectiveness + timeBonus + (Math.random() - 0.5) * 0.3));
  
  const memoryFreed = Math.round((200 + Math.random() * 2000) * effectiveness);
  const speedGain = Math.round((5 + Math.random() * 45) * effectiveness);
  
  // Generate app optimizations
  const numApps = Math.floor(Math.random() * 5) + 1;
  const appOptimizations = [];
  
  for (let i = 0; i < numApps; i++) {
    const category = appCategories[Math.floor(Math.random() * appCategories.length)];
    appOptimizations.push({
      appCategory: category,
      memoryFreed: Math.round(Math.random() * 500),
      actionsCount: Math.floor(Math.random() * 5) + 1,
      success: Math.random() > 0.1 // 90% success rate
    });
  }
  
  return {
    sessionId: `demo_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
    deviceProfile: {
      isAppleSilicon: profile.isAppleSilicon,
      memoryGB: profile.memoryGB,
      coreCount: profile.coreCount
    },
    optimization: {
      strategy: strategy,
      memoryFreed: memoryFreed,
      speedGain: speedGain,
      effectiveness: effectiveness,
      context: {
        timeOfDay: timeOfDay,
        dayOfWeek: dayOfWeek,
        systemLoad: {
          memoryPressure: Math.random() * 100,
          cpuUsage: Math.random() * 100
        }
      }
    },
    appOptimizations: appOptimizations,
    timestamp: Date.now()
  };
}

async function sendLearningData(learningData) {
  try {
    console.log(`🧠 Sending demo learning data - ${learningData.optimization.strategy} strategy, ${learningData.optimization.memoryFreed}MB freed`);
    
    const response = await fetch(`${WEBSITE_API_BASE}/learning/aggregate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'learning_data',
        userEmail: 'demo@memorymonster.com',
        deviceId: `demo_device_${learningData.deviceProfile.isAppleSilicon ? 'apple' : 'intel'}`,
        learningData: learningData
      })
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log(`✅ Learning data sent successfully (${result.aggregatedDataPoints} total points)`);
    } else {
      console.warn('❌ Failed to send learning data:', result.error);
    }
  } catch (error) {
    console.error('❌ Error sending learning data:', error.message);
  }
}

async function runDemoSession() {
  console.log('🚀 Starting demo learning session...');
  
  // Generate and send multiple learning data points
  const sessionCount = Math.floor(Math.random() * 5) + 3; // 3-7 optimizations per session
  
  for (let i = 0; i < sessionCount; i++) {
    const learningData = generateRandomLearningData();
    await sendLearningData(learningData);
    
    // Wait between optimizations
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  }
  
  console.log(`✅ Demo session completed - sent ${sessionCount} learning data points`);
}

async function startContinuousDemo() {
  console.log('🎯 Starting continuous demo learning data generation...');
  console.log('📊 This will generate realistic optimization data for the learning system');
  console.log('🔄 Press Ctrl+C to stop');
  
  // Run initial session
  await runDemoSession();
  
  // Schedule regular sessions
  const sessionInterval = setInterval(async () => {
    try {
      await runDemoSession();
    } catch (error) {
      console.error('❌ Demo session failed:', error);
    }
  }, 5 * 60 * 1000); // Every 5 minutes
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping demo learning data generation...');
    clearInterval(sessionInterval);
    process.exit(0);
  });
  
  // Also run a test intelligence fetch
  setTimeout(async () => {
    try {
      console.log('🔍 Testing intelligence endpoint...');
      const response = await fetch(`${WEBSITE_API_BASE}/learning/intelligence?deviceType=apple_silicon`);
      const intelligence = await response.json();
      
      if (response.ok) {
        console.log('✅ Intelligence endpoint working:', {
          hasUpdate: intelligence.hasUpdate,
          version: intelligence.intelligence?.version,
          appProfiles: Object.keys(intelligence.intelligence?.updates?.appProfiles || {}).length
        });
      } else {
        console.warn('❌ Intelligence endpoint failed:', intelligence.error);
      }
    } catch (error) {
      console.error('❌ Intelligence test failed:', error.message);
    }
  }, 10000); // After 10 seconds
}

if (require.main === module) {
  console.log('🎭 Memory Monster Learning Demo');
  console.log('================================');
  
  startContinuousDemo().catch(error => {
    console.error('❌ Demo failed to start:', error);
    process.exit(1);
  });
}

module.exports = {
  generateRandomLearningData,
  sendLearningData,
  runDemoSession
};
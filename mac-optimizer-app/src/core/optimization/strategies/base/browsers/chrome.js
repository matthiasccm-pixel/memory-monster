/**
 * Google Chrome Optimization Strategy
 * Based on comprehensive research of Chrome memory patterns and cache behavior
 * Version: 1.0.0 (Base Strategy)
 */

export const chromeStrategy = {
  appId: 'com.google.Chrome',
  displayName: 'Google Chrome',
  category: 'browser',
  tier: 'free',
  userBase: 0.87, // 87% of Mac users
  version: '1.0.0',
  
  // Memory behavior patterns
  memoryProfile: {
    baseline: { min: 200, max: 400, unit: 'MB' },
    heavyUsage: { min: 2000, max: 4000, unit: 'MB' },
    memoryLeakRate: 50, // MB per hour when idle
    criticalThreshold: 1500, // MB - when to take action
    optimalTabCount: 8,
    processMultiplier: 1.3 // Each tab creates ~1.3 processes on average
  },

  // Cache locations and safety levels
  cacheLocations: {
    safe: [
      '~/Library/Caches/Google/Chrome',
      '~/Library/Application Support/Google/Chrome/Default/Cache',
      '~/Library/Application Support/Google/Chrome/Default/Code Cache',
      '~/Library/Application Support/Google/Chrome/Default/GPUCache'
    ],
    moderate: [
      '~/Library/Application Support/Google/Chrome/Default/Service Worker/CacheStorage'
    ],
    risky: [
      '~/Library/Application Support/Google/Chrome/Default/Local Storage',
      '~/Library/Application Support/Google/Chrome/Default/Session Storage'
    ]
  },

  // Known issues and detection methods
  knownIssues: {
    tabMemoryLeak: {
      description: 'Tabs grow from 6MB to 500MB+ overnight even when inactive',
      severity: 'critical',
      detection: {
        method: 'processMemoryCheck',
        threshold: 200, // MB per Chrome Helper process
        confidence: 0.9
      },
      solution: 'killIndividualHelpers'
    },
    processExplosion: {
      description: 'Site isolation creates process per domain',
      severity: 'high', 
      detection: {
        method: 'processCount',
        threshold: 15, // processes
        confidence: 0.8
      },
      solution: 'limitedHelperKill'
    },
    gpuMemoryLeak: {
      description: 'GPU cache accumulates over days of usage',
      severity: 'medium',
      detection: {
        method: 'cacheSize',
        path: '~/Library/Application Support/Google/Chrome/Default/GPUCache',
        threshold: 500, // MB
        confidence: 0.7
      },
      solution: 'clearGPUCache'
    }
  },

  // Optimization strategies by risk level
  optimizationStrategies: {
    conservative: {
      name: 'Safe Chrome Optimization',
      description: 'Clear caches without disrupting browsing session',
      estimatedSavings: { min: 300, max: 800, unit: 'MB' },
      userImpact: 'minimal',
      actions: [
        {
          type: 'clearCache',
          target: 'safe',
          implementation: 'clearAppCache',
          requiresRestart: false,
          estimatedTime: 5000 // ms
        },
        {
          type: 'killProcesses',
          target: 'chromeHelpers',
          implementation: 'killChromeHelpers',
          maxProcesses: 3,
          criteria: 'memoryUsage > 200MB',
          requiresRestart: false,
          estimatedTime: 2000 // ms
        }
      ]
    },
    
    balanced: {
      name: 'Balanced Chrome Optimization', 
      description: 'Clear all caches and kill heavy helper processes',
      estimatedSavings: { min: 800, max: 2000, unit: 'MB' },
      userImpact: 'moderate',
      actions: [
        {
          type: 'clearCache',
          target: 'all',
          implementation: 'clearAllCaches',
          requiresRestart: false,
          estimatedTime: 8000 // ms
        },
        {
          type: 'killProcesses',
          target: 'chromeHelpers',
          implementation: 'killChromeHelpers',
          maxProcesses: 8,
          criteria: 'memoryUsage > 150MB',
          requiresRestart: false,
          estimatedTime: 3000 // ms
        },
        {
          type: 'clearCache',
          target: 'moderate',
          implementation: 'clearModerateRiskCaches',
          requiresRestart: false,
          estimatedTime: 3000 // ms
        }
      ]
    },

    aggressive: {
      name: 'Maximum Chrome Optimization',
      description: 'Full restart with all caches cleared',
      estimatedSavings: { min: 2000, max: 4000, unit: 'MB' },
      userImpact: 'high',
      warning: 'Will close all Chrome tabs and windows',
      actions: [
        {
          type: 'saveSession',
          implementation: 'saveChromeSession',
          estimatedTime: 2000 // ms
        },
        {
          type: 'closeApp',
          implementation: 'closeChrome',
          estimatedTime: 3000 // ms
        },
        {
          type: 'clearCache',
          target: 'all',
          implementation: 'clearAllCaches',
          estimatedTime: 10000 // ms
        },
        {
          type: 'restartApp',
          implementation: 'restartChrome',
          restoreSession: true,
          estimatedTime: 5000 // ms
        }
      ]
    }
  },

  // Context-aware optimization rules
  contextualRules: {
    timeOfDay: {
      morning: { preferredStrategy: 'conservative', reason: 'User starting work session' },
      afternoon: { preferredStrategy: 'balanced', reason: 'Mid-day optimization safe' },
      evening: { preferredStrategy: 'aggressive', reason: 'End of workday, full cleanup' }
    },
    systemLoad: {
      low: { allowAggressive: true },
      medium: { preferBalanced: true },
      high: { onlyConservative: true }
    },
    userActivity: {
      active: { onlyConservative: true },
      idle: { allowBalanced: true },
      away: { allowAggressive: true }
    }
  },

  // Success metrics and learning parameters
  successMetrics: {
    memoryFreed: { weight: 0.4, threshold: 200 }, // MB
    speedImprovement: { weight: 0.3, threshold: 10 }, // %
    userSatisfaction: { weight: 0.2, threshold: 0.7 }, // 0-1
    stability: { weight: 0.1, threshold: 0.95 } // crash rate < 5%
  },

  // Learning parameters for continuous improvement
  learningConfig: {
    minSampleSize: 10,
    confidenceThreshold: 0.8,
    adaptationRate: 0.1, // How quickly to adapt to user patterns
    contextWeights: {
      timeOfDay: 0.3,
      systemLoad: 0.4,
      userActivity: 0.2,
      appVersion: 0.1
    }
  }
};

export default chromeStrategy;
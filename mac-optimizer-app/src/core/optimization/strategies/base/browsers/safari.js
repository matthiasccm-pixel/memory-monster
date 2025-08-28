/**
 * Safari Optimization Strategy
 * Apple's native browser with different memory management
 * Version: 1.0.0 (Base Strategy)
 */

export const safariStrategy = {
  appId: 'com.apple.Safari',
  displayName: 'Safari',
  category: 'browser',
  tier: 'free',
  userBase: 0.76,
  version: '1.0.0',
  
  memoryProfile: {
    baseline: { min: 150, max: 300, unit: 'MB' },
    heavyUsage: { min: 1000, max: 2000, unit: 'MB' },
    memoryLeakRate: 10, // Much lower than Chrome
    criticalThreshold: 1000,
    optimalTabCount: 12, // Safari handles tabs better
    processMultiplier: 1.1
  },

  cacheLocations: {
    safe: [
      '~/Library/Caches/com.apple.Safari',
      '~/Library/Safari/CloudTabs.db-wal',
      '~/Library/Safari/CloudTabs.db-shm'
    ],
    moderate: [
      '~/Library/Safari/WebpageIcons.db',
      '~/Library/Safari/TouchIconCacheSettings.plist'
    ],
    risky: [
      '~/Library/Safari/History.db',
      '~/Library/Safari/Bookmarks.plist'
    ]
  },

  knownIssues: {
    webKitMemoryLeak: {
      description: 'WebKit processes accumulate memory over time',
      severity: 'medium',
      detection: {
        method: 'processMemoryCheck',
        processName: 'com.apple.WebKit.WebContent',
        threshold: 150,
        confidence: 0.8
      },
      solution: 'refreshTabs'
    },
    extensionMemoryLeak: {
      description: 'Safari extensions can cause memory buildup',
      severity: 'low',
      detection: {
        method: 'extensionCheck',
        threshold: 50,
        confidence: 0.6
      },
      solution: 'restartSafari'
    }
  },

  optimizationStrategies: {
    conservative: {
      name: 'Safari Cache Clean',
      description: 'Clear Safari caches without affecting browsing',
      estimatedSavings: { min: 100, max: 400, unit: 'MB' },
      userImpact: 'minimal',
      actions: [
        {
          type: 'clearCache',
          target: 'safe',
          implementation: 'clearSafariCache',
          requiresRestart: false,
          estimatedTime: 3000
        }
      ]
    },
    
    balanced: {
      name: 'Safari Memory Refresh',
      description: 'Refresh heavy tabs and clear all caches',
      estimatedSavings: { min: 300, max: 800, unit: 'MB' },
      userImpact: 'low',
      actions: [
        {
          type: 'refreshTabs',
          criteria: 'memoryUsage > 100MB',
          implementation: 'refreshHeavyTabs',
          estimatedTime: 2000
        },
        {
          type: 'clearCache',
          target: 'moderate',
          implementation: 'clearAllSafariCaches',
          estimatedTime: 4000
        }
      ]
    },

    aggressive: {
      name: 'Safari Full Restart',
      description: 'Complete Safari restart with cache cleanup',
      estimatedSavings: { min: 600, max: 1500, unit: 'MB' },
      userImpact: 'medium',
      warning: 'Will close all Safari windows',
      actions: [
        {
          type: 'saveSession',
          implementation: 'saveSafariSession',
          estimatedTime: 1000
        },
        {
          type: 'closeApp',
          implementation: 'closeSafari',
          estimatedTime: 2000
        },
        {
          type: 'clearCache',
          target: 'all',
          implementation: 'clearAllSafariCaches',
          estimatedTime: 5000
        },
        {
          type: 'restartApp',
          implementation: 'restartSafari',
          restoreSession: true,
          estimatedTime: 3000
        }
      ]
    }
  },

  contextualRules: {
    timeOfDay: {
      morning: { preferredStrategy: 'conservative' },
      afternoon: { preferredStrategy: 'balanced' },
      evening: { preferredStrategy: 'balanced' }
    },
    systemLoad: {
      low: { allowAggressive: true },
      medium: { preferBalanced: true },
      high: { onlyConservative: true }
    }
  },

  successMetrics: {
    memoryFreed: { weight: 0.4, threshold: 100 },
    speedImprovement: { weight: 0.3, threshold: 8 },
    userSatisfaction: { weight: 0.2, threshold: 0.8 },
    stability: { weight: 0.1, threshold: 0.98 }
  }
};

export default safariStrategy;
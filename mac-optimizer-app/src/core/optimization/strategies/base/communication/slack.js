/**
 * Slack Optimization Strategy
 * Electron-based communication app with known memory issues
 * Version: 1.0.0 (Base Strategy)
 */

export const slackStrategy = {
  appId: 'com.tinyspeck.slackmacgap',
  displayName: 'Slack',
  category: 'communication',
  tier: 'free',
  userBase: 0.65,
  version: '1.0.0',
  
  memoryProfile: {
    baseline: { min: 150, max: 300, unit: 'MB' },
    heavyUsage: { min: 800, max: 1500, unit: 'MB' },
    memoryLeakRate: 30, // MB per hour, typical for Electron apps
    criticalThreshold: 1000,
    optimalWorkspaceCount: 3,
    processMultiplier: 1.2
  },

  cacheLocations: {
    safe: [
      '~/Library/Caches/com.tinyspeck.slackmacgap',
      '~/Library/Application Support/Slack/logs',
      '~/Library/Application Support/Slack/Cache',
      '~/Library/Application Support/Slack/Code Cache'
    ],
    moderate: [
      '~/Library/Application Support/Slack/GPUCache',
      '~/Library/Application Support/Slack/Service Worker/CacheStorage'
    ],
    risky: [
      '~/Library/Application Support/Slack/Local Storage',
      '~/Library/Application Support/Slack/Session Storage'
    ]
  },

  knownIssues: {
    electronMemoryLeak: {
      description: 'Electron renderer processes accumulate memory over time',
      severity: 'high',
      detection: {
        method: 'processMemoryCheck',
        processName: 'Slack',
        threshold: 800,
        confidence: 0.9
      },
      solution: 'restartSlack'
    },
    imageCacheBuildup: {
      description: 'Shared images and files cache grows large',
      severity: 'medium',
      detection: {
        method: 'cacheSize',
        path: '~/Library/Caches/com.tinyspeck.slackmacgap',
        threshold: 200,
        confidence: 0.8
      },
      solution: 'clearImageCache'
    },
    multipleWorkspaces: {
      description: 'Multiple workspaces multiply memory usage',
      severity: 'medium',
      detection: {
        method: 'workspaceCount',
        threshold: 5,
        confidence: 0.7
      },
      solution: 'optimizeWorkspaces'
    }
  },

  optimizationStrategies: {
    conservative: {
      name: 'Slack Cache Clean',
      description: 'Clear caches without disrupting conversations',
      estimatedSavings: { min: 200, max: 500, unit: 'MB' },
      userImpact: 'minimal',
      actions: [
        {
          type: 'clearCache',
          target: 'safe',
          implementation: 'clearSlackCache',
          requiresRestart: false,
          estimatedTime: 4000
        },
        {
          type: 'clearLogs',
          implementation: 'clearSlackLogs',
          requiresRestart: false,
          estimatedTime: 2000
        }
      ]
    },
    
    balanced: {
      name: 'Slack Memory Reset',
      description: 'Clear all caches and refresh app state',
      estimatedSavings: { min: 400, max: 900, unit: 'MB' },
      userImpact: 'low',
      actions: [
        {
          type: 'clearCache',
          target: 'moderate',
          implementation: 'clearAllSlackCaches',
          requiresRestart: false,
          estimatedTime: 6000
        },
        {
          type: 'refreshApp',
          implementation: 'refreshSlackWorkspaces',
          estimatedTime: 3000
        }
      ]
    },

    aggressive: {
      name: 'Slack Full Restart',
      description: 'Complete Slack restart with all caches cleared',
      estimatedSavings: { min: 700, max: 1400, unit: 'MB' },
      userImpact: 'medium',
      warning: 'Will require re-authentication for some workspaces',
      actions: [
        {
          type: 'saveState',
          implementation: 'saveSlackState',
          estimatedTime: 1000
        },
        {
          type: 'closeApp',
          implementation: 'closeSlack',
          estimatedTime: 2000
        },
        {
          type: 'clearCache',
          target: 'all',
          implementation: 'clearAllSlackData',
          estimatedTime: 8000
        },
        {
          type: 'restartApp',
          implementation: 'restartSlack',
          restoreState: true,
          estimatedTime: 4000
        }
      ]
    }
  },

  contextualRules: {
    timeOfDay: {
      morning: { preferredStrategy: 'conservative', reason: 'Start of workday' },
      afternoon: { preferredStrategy: 'balanced', reason: 'Mid-day break acceptable' },
      evening: { preferredStrategy: 'aggressive', reason: 'End of workday' }
    },
    workspaceActivity: {
      high: { onlyConservative: true },
      medium: { preferBalanced: true },
      low: { allowAggressive: true }
    }
  },

  successMetrics: {
    memoryFreed: { weight: 0.4, threshold: 300 },
    speedImprovement: { weight: 0.2, threshold: 15 },
    userSatisfaction: { weight: 0.3, threshold: 0.75 },
    stability: { weight: 0.1, threshold: 0.95 }
  }
};

export default slackStrategy;
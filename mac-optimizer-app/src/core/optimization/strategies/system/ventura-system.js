/**
 * macOS Ventura (13.x) Specific System Optimization Strategy  
 * Based on research of Ventura-specific memory patterns and continuity features
 * Version: 1.0.0
 */

export const venturaSystemStrategy = {
  systemId: 'com.apple.macOS.ventura',
  displayName: 'macOS Ventura System',
  category: 'system', 
  tier: 'core',
  osVersion: '13.x',
  version: '1.0.0',
  
  // Ventura-specific memory profile
  memoryProfile: {
    baseSystem: { min: 2200, max: 3500, unit: 'MB' },
    withContinuityCamera: { min: 2800, max: 4200, unit: 'MB' },
    withStageManager: { min: 3200, max: 4800, unit: 'MB' },
    criticalThreshold: 5000, // MB - when aggressive optimization needed
    modernMemoryManagement: true,
    memoryCompression: 'improved'
  },

  // Ventura-specific cache locations
  cacheLocations: {
    safe: [
      '~/Library/Caches/com.apple.universalaccess',
      '~/Library/Caches/com.apple.continuity',
      '/System/Library/Caches/com.apple.Metal',
      '~/Library/Caches/com.apple.Mail.Envelope',
      '~/Library/Caches/com.apple.Safari.WebKit2'
    ],
    moderate: [
      '/System/Library/Caches/com.apple.StageManager',
      '~/Library/Caches/com.apple.bird', // iCloud sync
      '/var/folders/*/C/com.apple.InputMethodKit*',
      '~/Library/Caches/com.apple.Spotlight'
    ],
    aggressive: [
      '/System/Library/Caches/com.apple.WebKit',
      '/Library/Caches/com.apple.Safari.HistoryServiceAgent',
      '/System/Library/PrivateFrameworks/*/Caches'
    ]
  },

  // Ventura-specific known issues
  knownIssues: {
    continuityCameraMemoryLeak: {
      description: 'Continuity Camera maintains memory buffers even when iPhone disconnected, 200-600MB leak',
      severity: 'high',
      commonOccurrence: 0.75,
      detection: {
        method: 'processMemoryCheck',
        processName: 'VTDecoderXPCService',
        threshold: 200, // MB
        confidence: 0.85
      },
      solution: 'restartContinuityCamera',
      estimatedSavings: { min: 200, max: 600, unit: 'MB' }
    },

    mailSearchIndexBloat: {
      description: 'Enhanced Mail search creates massive index caches that grow unchecked',
      severity: 'high',
      commonOccurrence: 0.8,
      detection: {
        method: 'cacheSize',
        path: '~/Library/Caches/com.apple.Mail.Envelope',
        threshold: 500, // MB
        confidence: 0.9
      },
      solution: 'rebuildMailSearchIndex',
      estimatedSavings: { min: 300, max: 700, unit: 'MB' }
    },

    safariTabGroupsMemoryIssue: {
      description: 'Safari Tab Groups keep all tabs partially loaded across groups, massive WebKit memory usage',
      severity: 'critical',
      commonOccurrence: 0.85,
      detection: {
        method: 'processMemoryCheck',
        processName: 'com.apple.WebKit.WebContent',
        threshold: 800, // MB for multiple WebKit processes
        confidence: 0.9
      },
      solution: 'optimizeSafariTabGroups',
      estimatedSavings: { min: 500, max: 1500, unit: 'MB' }
    },

    stageManagerWindowCache: {
      description: 'Stage Manager maintains window thumbnails and states in memory indefinitely',
      severity: 'medium',
      commonOccurrence: 0.6,
      detection: {
        method: 'cacheSize',
        path: '/System/Library/Caches/com.apple.StageManager',
        threshold: 400, // MB
        confidence: 0.8
      },
      solution: 'clearStageManagerCache',
      estimatedSavings: { min: 200, max: 500, unit: 'MB' }
    },

    notificationCenterBloat: {
      description: 'Notification Center accumulates widget data and preview caches over time',
      severity: 'medium',
      commonOccurrence: 0.7,
      detection: {
        method: 'processMemoryCheck',
        processName: 'NotificationCenter',
        threshold: 250, // MB
        confidence: 0.8
      },
      solution: 'restartNotificationCenter',
      estimatedSavings: { min: 150, max: 400, unit: 'MB' }
    }
  },

  // Ventura-optimized strategies
  optimizationStrategies: {
    conservative: {
      name: 'Ventura Safe System Clean',
      description: 'Safe cleanup of Ventura-specific caches and services',
      estimatedSavings: { min: 600, max: 1500, unit: 'MB' },
      userImpact: 'minimal',
      requiresRestart: false,
      actions: [
        {
          type: 'clearCache',
          target: 'continuityCamera',
          implementation: 'clearContinuityCameraCache',
          estimatedSavings: { min: 100, max: 300, unit: 'MB' },
          estimatedTime: 3000
        },
        {
          type: 'optimizeService',
          target: 'mail',
          implementation: 'optimizeMailCaches',
          estimatedSavings: { min: 200, max: 500, unit: 'MB' },
          background: true,
          estimatedTime: 8000
        },
        {
          type: 'clearCache',
          target: 'safari',
          implementation: 'clearSafariVenturaCache',
          estimatedSavings: { min: 150, max: 400, unit: 'MB' },
          estimatedTime: 5000
        },
        {
          type: 'optimizeService',
          target: 'notifications',
          implementation: 'optimizeNotificationCenter',
          estimatedSavings: { min: 100, max: 250, unit: 'MB' },
          estimatedTime: 4000
        }
      ]
    },

    balanced: {
      name: 'Ventura Smart Optimization',
      description: 'Comprehensive Ventura optimization targeting known memory issues',
      estimatedSavings: { min: 1200, max: 2800, unit: 'MB' },
      userImpact: 'moderate',
      requiresRestart: false,
      sideEffects: 'Safari tabs may reload, Continuity features may restart',
      actions: [
        {
          type: 'restartService',
          target: 'continuityCameraService',
          implementation: 'restartContinuityCameraService',
          estimatedSavings: { min: 200, max: 600, unit: 'MB' },
          estimatedTime: 6000
        },
        {
          type: 'optimizeApp',
          target: 'safari',
          implementation: 'optimizeSafariTabGroups',
          estimatedSavings: { min: 500, max: 1200, unit: 'MB' },
          sideEffect: 'Tab groups may need to reload',
          estimatedTime: 8000
        },
        {
          type: 'rebuildIndex',
          target: 'mail',
          implementation: 'rebuildMailSearchIndex',
          estimatedSavings: { min: 300, max: 700, unit: 'MB' },
          background: true,
          estimatedTime: 15000
        },
        {
          type: 'clearCache',
          target: 'stageManager',
          implementation: 'clearStageManagerCache',
          estimatedSavings: { min: 200, max: 500, unit: 'MB' },
          condition: 'stageManagerActive',
          estimatedTime: 4000
        },
        {
          type: 'restartService',
          target: 'notificationCenter',
          implementation: 'restartNotificationCenter',
          estimatedSavings: { min: 150, max: 400, unit: 'MB' },
          estimatedTime: 5000
        }
      ]
    },

    aggressive: {
      name: 'Ventura Maximum Performance Reset',
      description: 'Complete Ventura system reset for maximum memory recovery',
      estimatedSavings: { min: 2000, max: 4500, unit: 'MB' },
      userImpact: 'high',
      requiresRestart: false,
      warning: 'Will restart Continuity services, Safari will reload all tabs, Stage Manager will reset',
      actions: [
        {
          type: 'prepareOptimization',
          implementation: 'prepareVenturaOptimization',
          estimatedTime: 3000
        },
        {
          type: 'restartServices',
          target: 'venturaServices',
          services: ['ContinuityCamera', 'StageManager', 'NotificationCenter', 'Spotlight'],
          implementation: 'restartVenturaSystemServices',
          estimatedSavings: { min: 600, max: 1500, unit: 'MB' },
          estimatedTime: 12000
        },
        {
          type: 'forceQuit',
          target: 'safari',
          implementation: 'forceSafariRestart',
          estimatedSavings: { min: 800, max: 2000, unit: 'MB' },
          warning: 'All Safari tabs will close',
          estimatedTime: 5000
        },
        {
          type: 'clearCache',
          target: 'system_wide',
          implementation: 'purgeAllVenturaCaches',
          estimatedSavings: { min: 800, max: 1800, unit: 'MB' },
          estimatedTime: 18000
        },
        {
          type: 'rebuildDatabases',
          target: 'system',
          implementation: 'rebuildVenturaSystemDatabases',
          background: true,
          estimatedTime: 20000
        }
      ]
    }
  },

  // Ventura-specific contextual rules
  contextualRules: {
    continuityCameraUsage: {
      active: {
        frequentCameraCleanup: true,
        reason: 'Active Continuity Camera needs memory management'
      },
      inactive: {
        deepCameraCleanup: true,
        reason: 'Clear accumulated camera service memory'
      }
    },

    safariTabGroupsUsage: {
      heavy: {
        preferredStrategy: 'balanced',
        reason: 'Safari Tab Groups memory management critical'
      },
      moderate: {
        regularSafariOptimization: true
      }
    },

    stageManagerActive: {
      enabled: {
        includeStageManagerOptimization: true,
        reason: 'Stage Manager window cache management needed'
      },
      disabled: {
        skipStageManagerOptimizations: true
      }
    },

    mailUsage: {
      heavy: {
        frequentMailIndexOptimization: true,
        reason: 'Heavy Mail usage creates large search indices'
      }
    }
  },

  // Ventura learning configuration
  learningConfig: {
    adaptToVenturaPatterns: true,
    trackContinuityUsage: true,
    monitorStageManagerBehavior: true,
    safariTabGroupAnalytics: true,
    successMetrics: {
      memoryFreed: { weight: 0.4, threshold: 600 },
      safariPerformance: { weight: 0.25, threshold: 20 }, // % improvement
      mailResponsiveness: { weight: 0.2, threshold: 15 }, // % improvement  
      continuityCameraStability: { weight: 0.15, threshold: 0.85 } // success rate
    }
  },

  // Ventura-specific monitoring
  monitoring: {
    continuityCameraMemory: {
      processNames: ['VTDecoderXPCService', 'ContinuityCaptureShieldUI'],
      combinedThreshold: 300, // MB
      alertThreshold: 500 // MB
    },
    safariWebKitProcesses: {
      processName: 'com.apple.WebKit.WebContent',
      countThreshold: 10, // Too many WebKit processes
      memoryThreshold: 1000 // MB combined
    },
    mailIndexSize: {
      cacheLocation: '~/Library/Caches/com.apple.Mail.Envelope',
      sizeThreshold: 600, // MB
      growthRate: 100 // MB per day
    },
    stageManagerCache: {
      cacheLocation: '/System/Library/Caches/com.apple.StageManager',
      sizeThreshold: 500, // MB
    },
    notificationCenterMemory: {
      processName: 'NotificationCenter', 
      memoryThreshold: 300 // MB
    }
  }
};

export default venturaSystemStrategy;
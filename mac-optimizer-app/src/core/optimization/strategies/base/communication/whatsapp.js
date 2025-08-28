/**
 * WhatsApp Optimization Strategy
 * Popular messaging app with massive media cache accumulation (10GB+ common)
 * Version: 1.0.0 (Base Strategy)
 */

export const whatsappStrategy = {
  appId: 'com.whatsapp.WhatsApp',
  displayName: 'WhatsApp',
  category: 'communication',
  tier: 'free',
  userBase: 0.54,
  version: '1.0.0',
  
  memoryProfile: {
    baseline: { min: 100, max: 200, unit: 'MB' },
    heavyUsage: { min: 300, max: 500, unit: 'MB' },
    memoryLeakRate: 20, // MB per hour during active use
    criticalThreshold: 400,
    processMultiplier: 1.1 // Main app + helper
  },

  cacheLocations: {
    safe: [
      '~/Library/Application Support/WhatsApp/Cache',
      '~/Library/Application Support/WhatsApp/Code Cache',
      '~/Library/Application Support/WhatsApp/GPUCache',
      '~/Library/Caches/com.whatsapp.WhatsApp'
    ],
    moderate: [
      '~/Library/Application Support/WhatsApp/Service Worker/CacheStorage',
      '~/Library/Application Support/WhatsApp/Local Storage' // Some settings data
    ],
    risky: [
      '~/Library/Application Support/WhatsApp/Media', // User photos/videos/documents
      '~/Library/Application Support/WhatsApp/Databases' // Chat history
    ]
  },

  knownIssues: {
    mediaCacheExplosion: {
      description: 'Media files (photos, videos, documents) accumulate to 10GB+',
      severity: 'critical',
      detection: {
        method: 'directorySize',
        path: '~/Library/Application Support/WhatsApp/Media',
        threshold: 1000, // MB
        confidence: 0.95
      },
      solution: 'clearOldMediaCache'
    },
    cacheDuplication: {
      description: 'Same media files cached multiple times in different folders',
      severity: 'high',
      detection: {
        method: 'duplicateAnalysis',
        path: '~/Library/Application Support/WhatsApp',
        threshold: 500, // MB in duplicates
        confidence: 0.8
      },
      solution: 'deduplicateMediaCache'
    },
    electroncacheBuildup: {
      description: 'Electron framework cache grows over time',
      severity: 'medium',
      detection: {
        method: 'directorySize',
        path: '~/Library/Application Support/WhatsApp/Cache',
        threshold: 200, // MB
        confidence: 0.75
      },
      solution: 'clearElectronCache'
    }
  },

  optimizationStrategies: {
    conservative: {
      name: 'WhatsApp Cache Clean',
      description: 'Clear system caches, preserve all user media and chats',
      estimatedSavings: { min: 200, max: 800, unit: 'MB' },
      userImpact: 'minimal',
      preserves: 'All chats, media, and user data',
      actions: [
        {
          type: 'clearCache',
          target: 'safe',
          implementation: 'clearWhatsAppCache',
          requiresRestart: false,
          estimatedTime: 5000,
          preserveUserData: true
        },
        {
          type: 'clearLogs',
          implementation: 'clearWhatsAppLogs',
          requiresRestart: false,
          estimatedTime: 2000
        }
      ]
    },
    
    balanced: {
      name: 'WhatsApp Media Clean',
      description: 'Clear old cached media (30+ days), keep recent and app cache',
      estimatedSavings: { min: 1000, max: 4000, unit: 'MB' },
      userImpact: 'low',
      sideEffects: 'Old media may need to re-download when accessed',
      actions: [
        {
          type: 'clearCache',
          target: 'moderate',
          implementation: 'clearWhatsAppAllCache',
          requiresRestart: false,
          estimatedTime: 7000
        },
        {
          type: 'clearOldMedia',
          implementation: 'clearOldWhatsAppMedia',
          ageThreshold: 30, // days
          requiresRestart: false,
          estimatedTime: 10000,
          warningMessage: 'Old cached media will be removed'
        },
        {
          type: 'deduplicateCache',
          implementation: 'deduplicateWhatsAppCache',
          estimatedTime: 8000
        }
      ]
    },

    aggressive: {
      name: 'WhatsApp Complete Reset',
      description: 'Remove all cached media and data - maximum space recovery',
      estimatedSavings: { min: 3000, max: 12000, unit: 'MB' },
      userImpact: 'high',
      warning: 'Will remove all cached media - photos/videos will need re-download',
      actions: [
        {
          type: 'backupChats',
          implementation: 'backupWhatsAppChats',
          estimatedTime: 3000,
          optional: true
        },
        {
          type: 'closeApp',
          implementation: 'closeWhatsApp',
          estimatedTime: 2000
        },
        {
          type: 'clearCache',
          target: 'all',
          implementation: 'clearAllWhatsAppData',
          estimatedTime: 15000,
          excludeChats: true, // Don't delete chat history
          warningMessage: 'This will remove all cached media files'
        },
        {
          type: 'restartApp',
          implementation: 'restartWhatsApp',
          estimatedTime: 4000
        }
      ]
    }
  },

  contextualRules: {
    timeOfDay: {
      morning: { preferredStrategy: 'conservative', reason: 'Peak messaging time' },
      afternoon: { preferredStrategy: 'balanced', reason: 'Safe for media cleanup' },
      evening: { preferredStrategy: 'conservative', reason: 'Active communication time' },
      lateNight: { preferredStrategy: 'aggressive', reason: 'Low usage time' }
    },
    userActivity: {
      activelyMessaging: { onlyConservative: true },
      whatsappIdle: { allowBalanced: true },
      whatsappNotRunning: { allowAggressive: true }
    },
    networkConnection: {
      wifi: { allowAggressive: true, reason: 'Can re-download media' },
      cellular: { preferConservative: true, reason: 'Avoid data usage' },
      offline: { onlyConservative: true, reason: 'Cannot re-download' }
    },
    mediaCacheSize: {
      huge: { preferAggressive: true, reason: 'Major space savings available' },
      large: { preferBalanced: true },
      moderate: { preferConservative: true }
    }
  },

  successMetrics: {
    diskSpaceFreed: { weight: 0.5, threshold: 1000 }, // MB - primary benefit
    memoryFreed: { weight: 0.2, threshold: 100 }, // MB
    speedImprovement: { weight: 0.2, threshold: 10 }, // %
    userSatisfaction: { weight: 0.1, threshold: 0.8 } // 0-1, messaging apps are critical
  },

  learningConfig: {
    minSampleSize: 12,
    confidenceThreshold: 0.8,
    adaptationRate: 0.1,
    contextWeights: {
      userActivity: 0.4,
      mediaCacheSize: 0.3,
      networkConnection: 0.2,
      timeOfDay: 0.1
    }
  }
};

export default whatsappStrategy;
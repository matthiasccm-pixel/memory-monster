/**
 * Mozilla Firefox Optimization Strategy
 * Privacy-focused browser with unique cache architecture
 * Version: 1.0.0 (Base Strategy)
 */

export const firefoxStrategy = {
  appId: 'org.mozilla.firefox',
  displayName: 'Firefox',
  category: 'browser',
  tier: 'free',
  userBase: 0.38,
  version: '1.0.0',
  
  memoryProfile: {
    baseline: { min: 180, max: 350, unit: 'MB' },
    heavyUsage: { min: 1500, max: 3000, unit: 'MB' },
    memoryLeakRate: 40, // MB per hour when idle
    criticalThreshold: 1200,
    optimalTabCount: 10, // Firefox handles tabs better than Chrome
    processMultiplier: 1.2 // Main + content processes
  },

  cacheLocations: {
    safe: [
      '~/Library/Caches/Firefox/Profiles/*/cache2',
      '~/Library/Application Support/Firefox/Profiles/*/startupCache',
      '~/Library/Application Support/Firefox/Profiles/*/shader-cache'
    ],
    moderate: [
      '~/Library/Application Support/Firefox/Profiles/*/storage/default',
      '~/Library/Application Support/Firefox/Profiles/*/storage/permanent',
      '~/Library/Application Support/Firefox/Profiles/*/sessionstore-backups'
    ],
    risky: [
      '~/Library/Application Support/Firefox/Profiles/*/places.sqlite', // History & bookmarks
      '~/Library/Application Support/Firefox/Profiles/*/logins.json', // Saved passwords
      '~/Library/Application Support/Firefox/Profiles/*/prefs.js' // User preferences
    ]
  },

  knownIssues: {
    cache2Growth: {
      description: 'Firefox cache2 directory can grow to 2GB+ over time',
      severity: 'high',
      detection: {
        method: 'directorySize',
        path: '~/Library/Caches/Firefox/Profiles/*/cache2',
        threshold: 800, // MB
        confidence: 0.9
      },
      solution: 'clearFirefoxCache'
    },
    storageQuotaExceeded: {
      description: 'Web storage can accumulate large amounts of site data',
      severity: 'medium',
      detection: {
        method: 'directorySize',
        path: '~/Library/Application Support/Firefox/Profiles/*/storage',
        threshold: 500, // MB
        confidence: 0.8
      },
      solution: 'clearWebStorage'
    },
    sessionStoreBuildup: {
      description: 'Session backup files accumulate over time',
      severity: 'low',
      detection: {
        method: 'fileCount',
        path: '~/Library/Application Support/Firefox/Profiles/*/sessionstore-backups',
        threshold: 50, // files
        confidence: 0.7
      },
      solution: 'cleanSessionBackups'
    },
    profileMultiplication: {
      description: 'Multiple Firefox profiles can exist and accumulate cache',
      severity: 'medium',
      detection: {
        method: 'profileCount',
        path: '~/Library/Application Support/Firefox/Profiles',
        threshold: 3, // profiles
        confidence: 0.6
      },
      solution: 'cleanUnusedProfiles'
    }
  },

  optimizationStrategies: {
    conservative: {
      name: 'Firefox Cache Clean',
      description: 'Clear browser cache and temporary files safely',
      estimatedSavings: { min: 300, max: 1000, unit: 'MB' },
      userImpact: 'minimal',
      preserves: 'Browsing history, bookmarks, saved passwords, extensions',
      actions: [
        {
          type: 'clearCache',
          target: 'safe',
          implementation: 'clearFirefoxCache',
          requiresRestart: false,
          estimatedTime: 6000
        },
        {
          type: 'cleanSessionBackups',
          implementation: 'cleanFirefoxSessionBackups',
          keepRecent: 5, // Keep 5 most recent backups
          requiresRestart: false,
          estimatedTime: 2000
        }
      ]
    },
    
    balanced: {
      name: 'Firefox Deep Clean',
      description: 'Clear cache and web storage, keep user data',
      estimatedSavings: { min: 700, max: 2000, unit: 'MB' },
      userImpact: 'low',
      sideEffects: 'Websites may need to re-download data, slower initial loading',
      actions: [
        {
          type: 'clearCache',
          target: 'moderate',
          implementation: 'clearFirefoxAllCache',
          requiresRestart: false,
          estimatedTime: 8000
        },
        {
          type: 'clearWebStorage',
          implementation: 'clearFirefoxWebStorage',
          preserveLogins: true,
          requiresRestart: false,
          estimatedTime: 5000
        },
        {
          type: 'compactDatabase',
          implementation: 'compactFirefoxDatabases',
          requiresRestart: false,
          estimatedTime: 4000
        }
      ]
    },

    aggressive: {
      name: 'Firefox Complete Reset',
      description: 'Full Firefox reset while preserving essential user data',
      estimatedSavings: { min: 1500, max: 4000, unit: 'MB' },
      userImpact: 'high',
      warning: 'Will reset most Firefox settings and clear all website data',
      actions: [
        {
          type: 'backupUserData',
          implementation: 'backupFirefoxEssentials',
          includes: ['bookmarks', 'passwords', 'preferences'],
          estimatedTime: 3000
        },
        {
          type: 'closeApp',
          implementation: 'closeFirefox',
          estimatedTime: 3000
        },
        {
          type: 'clearCache',
          target: 'all',
          implementation: 'clearAllFirefoxData',
          preserveBackup: true,
          estimatedTime: 15000
        },
        {
          type: 'restoreUserData',
          implementation: 'restoreFirefoxEssentials',
          estimatedTime: 4000
        },
        {
          type: 'restartApp',
          implementation: 'restartFirefox',
          estimatedTime: 5000
        }
      ]
    }
  },

  contextualRules: {
    timeOfDay: {
      morning: { preferredStrategy: 'conservative', reason: 'Start of browsing day' },
      afternoon: { preferredStrategy: 'balanced', reason: 'Safe time for cleanup' },
      evening: { preferredStrategy: 'balanced', reason: 'Light browsing' },
      lateNight: { allowAggressive: true, reason: 'End of browsing session' }
    },
    browsingActivity: {
      activeBrowsing: { onlyConservative: true },
      firefoxIdle: { allowBalanced: true },
      firefoxNotRunning: { allowAggressive: true }
    },
    profileUsage: {
      multipleProfiles: { preferBalanced: true, reason: 'Profile-specific cleanup' },
      singleProfile: { allowAggressive: true }
    },
    systemLoad: {
      low: { allowAggressive: true },
      medium: { preferBalanced: true },
      high: { onlyConservative: true }
    }
  },

  successMetrics: {
    memoryFreed: { weight: 0.4, threshold: 400 }, // MB
    diskSpaceFreed: { weight: 0.3, threshold: 600 }, // MB
    speedImprovement: { weight: 0.2, threshold: 12 }, // %
    userSatisfaction: { weight: 0.1, threshold: 0.75 } // 0-1
  },

  learningConfig: {
    minSampleSize: 12,
    confidenceThreshold: 0.8,
    adaptationRate: 0.1,
    contextWeights: {
      browsingActivity: 0.35,
      systemLoad: 0.25,
      timeOfDay: 0.25,
      profileUsage: 0.15
    }
  }
};

export default firefoxStrategy;
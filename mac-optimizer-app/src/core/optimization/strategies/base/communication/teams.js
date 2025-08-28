/**
 * Microsoft Teams Optimization Strategy
 * Electron-based collaboration app with severe memory leak issues
 * Version: 1.0.0 (Base Strategy)
 */

export const teamsStrategy = {
  appId: 'com.microsoft.teams',
  displayName: 'Microsoft Teams',
  category: 'communication',
  tier: 'free',
  userBase: 0.45,
  version: '1.0.0',
  electronBased: true,
  
  memoryProfile: {
    baseline: { min: 300, max: 500, unit: 'MB' },
    activeMeeting: { min: 800, max: 1500, unit: 'MB' },
    heavyUsage: { min: 1500, max: 3000, unit: 'MB' },
    memoryLeakRate: 80, // MB per hour - severe Electron memory leak
    criticalThreshold: 1200,
    processMultiplier: 1.4 // Main + multiple renderer processes
  },

  cacheLocations: {
    safe: [
      '~/Library/Application Support/Microsoft/Teams/Cache',
      '~/Library/Application Support/Microsoft/Teams/Code Cache',
      '~/Library/Application Support/Microsoft/Teams/GPUCache',
      '~/Library/Caches/com.microsoft.teams'
    ],
    moderate: [
      '~/Library/Application Support/Microsoft/Teams/Service Worker/CacheStorage',
      '~/Library/Application Support/Microsoft/Teams/logs',
      '~/Library/Application Support/Microsoft/Teams/tmp'
    ],
    risky: [
      '~/Library/Application Support/Microsoft/Teams/Local Storage',
      '~/Library/Application Support/Microsoft/Teams/databases', // User data
      '~/Library/Application Support/Microsoft/Teams/IndexedDB' // Chat history
    ]
  },

  knownIssues: {
    electronMemoryLeak: {
      description: 'Severe Electron memory leak - can reach 3GB+ over time',
      severity: 'critical',
      detection: {
        method: 'processMemoryCheck',
        processName: 'Microsoft Teams',
        threshold: 1200, // MB
        confidence: 0.95
      },
      solution: 'restartTeams'
    },
    rendererProcessExplosion: {
      description: 'Multiple renderer processes accumulate memory',
      severity: 'high',
      detection: {
        method: 'processCount',
        processName: 'Microsoft Teams Helper',
        threshold: 8, // processes
        confidence: 0.9
      },
      solution: 'killTeamsHelpers'
    },
    cacheExplosion: {
      description: 'Teams cache grows to 2GB+ with meeting recordings and files',
      severity: 'high',
      detection: {
        method: 'directorySize',
        path: '~/Library/Application Support/Microsoft/Teams/Cache',
        threshold: 1000, // MB
        confidence: 0.85
      },
      solution: 'clearTeamsCache'
    },
    gpuCacheBuildup: {
      description: 'GPU cache accumulates from video calls and screen sharing',
      severity: 'medium',
      detection: {
        method: 'directorySize',
        path: '~/Library/Application Support/Microsoft/Teams/GPUCache',
        threshold: 300, // MB
        confidence: 0.8
      },
      solution: 'clearGPUCache'
    }
  },

  optimizationStrategies: {
    conservative: {
      name: 'Teams Cache Clean',
      description: 'Clear system caches without affecting user data',
      estimatedSavings: { min: 400, max: 1200, unit: 'MB' },
      userImpact: 'minimal',
      preserves: 'Chat history, files, and all user data',
      actions: [
        {
          type: 'clearCache',
          target: 'safe',
          implementation: 'clearTeamsCache',
          requiresRestart: false,
          estimatedTime: 7000
        },
        {
          type: 'killProcesses',
          target: 'teamsHelpers',
          implementation: 'killTeamsHelpers',
          maxProcesses: 3,
          criteria: 'memoryUsage > 300MB',
          requiresRestart: false,
          estimatedTime: 3000
        }
      ]
    },
    
    balanced: {
      name: 'Teams Memory Reset',
      description: 'Clear all caches and restart to fix memory leaks',
      estimatedSavings: { min: 800, max: 2000, unit: 'MB' },
      userImpact: 'low',
      sideEffects: 'May need to re-login, cached files will re-download',
      actions: [
        {
          type: 'saveSession',
          implementation: 'saveTeamsSession',
          estimatedTime: 2000
        },
        {
          type: 'closeApp',
          implementation: 'closeTeams',
          estimatedTime: 4000 // Teams is slow to close
        },
        {
          type: 'clearCache',
          target: 'moderate',
          implementation: 'clearAllTeamsCache',
          estimatedTime: 10000
        },
        {
          type: 'clearLogs',
          implementation: 'clearTeamsLogs',
          estimatedTime: 3000
        },
        {
          type: 'restartApp',
          implementation: 'restartTeams',
          restoreSession: true,
          estimatedTime: 8000 // Teams is slow to start
        }
      ]
    },

    aggressive: {
      name: 'Teams Complete Reset',
      description: 'Full Teams reset to eliminate all memory leaks',
      estimatedSavings: { min: 1500, max: 4000, unit: 'MB' },
      userImpact: 'high',
      warning: 'Will require full re-login and app reconfiguration',
      actions: [
        {
          type: 'closeApp',
          implementation: 'forceCloseTeams',
          estimatedTime: 5000
        },
        {
          type: 'clearCache',
          target: 'all',
          implementation: 'clearAllTeamsData',
          estimatedTime: 15000,
          warningMessage: 'This will reset all Teams settings'
        },
        {
          type: 'resetTeamsConfig',
          implementation: 'resetTeamsConfiguration',
          estimatedTime: 3000
        },
        {
          type: 'restartApp',
          implementation: 'restartTeams',
          estimatedTime: 10000
        }
      ]
    }
  },

  contextualRules: {
    timeOfDay: {
      earlyMorning: { preferredStrategy: 'balanced', reason: 'Before work starts' },
      businessHours: { onlyConservative: true, reason: 'Active work time' },
      lunchBreak: { allowBalanced: true, reason: 'Meeting break' },
      endOfDay: { allowAggressive: true, reason: 'Work day ending' },
      evening: { allowAggressive: true, reason: 'After hours' }
    },
    meetingStatus: {
      inMeeting: { noOptimization: true, reason: 'Active meeting' },
      meetingScheduled: { onlyConservative: true, reason: 'Meeting soon' },
      noMeetingsToday: { allowAggressive: true }
    },
    memoryUsage: {
      extreme: { preferAggressive: true, reason: 'Critical memory situation' },
      high: { preferBalanced: true },
      normal: { preferConservative: true }
    },
    userActivity: {
      activelyCollaborating: { onlyConservative: true },
      teamsIdle: { allowBalanced: true },
      teamsNotRunning: { allowAggressive: true }
    }
  },

  successMetrics: {
    memoryFreed: { weight: 0.5, threshold: 800 }, // MB - primary benefit
    speedImprovement: { weight: 0.2, threshold: 20 }, // %
    stabilityImprovement: { weight: 0.2, threshold: 0.9 }, // Crash reduction
    userSatisfaction: { weight: 0.1, threshold: 0.7 } // 0-1, accounting for disruption
  },

  learningConfig: {
    minSampleSize: 6,
    confidenceThreshold: 0.85,
    adaptationRate: 0.2,
    contextWeights: {
      memoryUsage: 0.4,
      meetingStatus: 0.3,
      timeOfDay: 0.2,
      userActivity: 0.1
    }
  }
};

export default teamsStrategy;
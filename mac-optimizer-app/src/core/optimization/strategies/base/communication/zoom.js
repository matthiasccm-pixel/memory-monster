/**
 * Zoom Optimization Strategy
 * Video conferencing app with recording cache and auto-download accumulation
 * Version: 1.0.0 (Base Strategy)
 */

export const zoomStrategy = {
  appId: 'com.zoom.xos',
  displayName: 'Zoom',
  category: 'communication',
  tier: 'free',
  userBase: 0.51,
  version: '1.0.0',
  
  memoryProfile: {
    baseline: { min: 200, max: 300, unit: 'MB' },
    inMeeting: { min: 500, max: 1200, unit: 'MB' },
    screenShare: { min: 800, max: 2000, unit: 'MB' },
    memoryLeakRate: 25, // MB per hour during meetings
    criticalThreshold: 1000,
    processMultiplier: 1.3 // Main app + audio/video helpers
  },

  cacheLocations: {
    safe: [
      '~/Library/Caches/us.zoom.xos',
      '~/Library/Application Support/zoom.us/AutoDownload',
      '~/Library/Application Support/zoom.us/Temp',
      '~/Library/Application Support/zoom.us/logs'
    ],
    moderate: [
      '~/Library/Application Support/zoom.us/data/VirtualBkgnd_Custom', // Custom backgrounds
      '~/Library/Application Support/zoom.us/data/avatars'
    ],
    risky: [
      '~/Documents/Zoom', // Meeting recordings
      '~/Desktop/Zoom_*', // Screenshot captures
      '~/Library/Application Support/zoom.us/data/settings.json' // User preferences
    ]
  },

  knownIssues: {
    autoDownloadAccumulation: {
      description: 'Auto-downloaded client updates accumulate in cache',
      severity: 'medium',
      detection: {
        method: 'directorySize',
        path: '~/Library/Application Support/zoom.us/AutoDownload',
        threshold: 500, // MB
        confidence: 0.85
      },
      solution: 'clearAutoDownloads'
    },
    recordingStorage: {
      description: 'Local recordings can consume 5GB+ per hour of video',
      severity: 'high',
      detection: {
        method: 'directorySize',
        path: '~/Documents/Zoom',
        threshold: 1000, // MB
        confidence: 0.9
      },
      solution: 'manageRecordings'
    },
    meetingMemoryLeak: {
      description: 'Memory usage continues to grow during long meetings',
      severity: 'medium',
      detection: {
        method: 'processMemoryGrowth',
        processName: 'zoom.us',
        threshold: 800, // MB
        confidence: 0.7
      },
      solution: 'restartZoomAudio'
    },
    virtualBackgroundCache: {
      description: 'Custom virtual backgrounds cache grows over time',
      severity: 'low',
      detection: {
        method: 'directorySize',
        path: '~/Library/Application Support/zoom.us/data/VirtualBkgnd_Custom',
        threshold: 100, // MB
        confidence: 0.6
      },
      solution: 'clearVirtualBackgrounds'
    }
  },

  optimizationStrategies: {
    conservative: {
      name: 'Zoom Cache Clean',
      description: 'Clear logs and auto-download cache, preserve settings',
      estimatedSavings: { min: 300, max: 1000, unit: 'MB' },
      userImpact: 'minimal',
      preserves: 'Meeting recordings, settings, custom backgrounds',
      actions: [
        {
          type: 'clearCache',
          target: 'safe',
          implementation: 'clearZoomCache',
          requiresRestart: false,
          estimatedTime: 4000
        },
        {
          type: 'clearLogs',
          implementation: 'clearZoomLogs',
          requiresRestart: false,
          estimatedTime: 2000
        },
        {
          type: 'clearAutoDownloads',
          implementation: 'clearZoomAutoDownloads',
          requiresRestart: false,
          estimatedTime: 3000
        }
      ]
    },
    
    balanced: {
      name: 'Zoom Deep Clean',
      description: 'Clear caches and old custom backgrounds, keep recordings',
      estimatedSavings: { min: 500, max: 1500, unit: 'MB' },
      userImpact: 'low',
      sideEffects: 'Custom virtual backgrounds may need re-upload',
      actions: [
        {
          type: 'clearCache',
          target: 'moderate',
          implementation: 'clearZoomAllCache',
          requiresRestart: false,
          estimatedTime: 6000
        },
        {
          type: 'clearVirtualBackgrounds',
          implementation: 'clearOldVirtualBackgrounds',
          ageThreshold: 90, // days
          estimatedTime: 3000
        },
        {
          type: 'cleanupScreenshots',
          implementation: 'cleanupZoomScreenshots',
          ageThreshold: 30, // days
          estimatedTime: 2000
        }
      ]
    },

    aggressive: {
      name: 'Zoom Complete Reset',
      description: 'Full cleanup including old recordings - maximum space recovery',
      estimatedSavings: { min: 2000, max: 10000, unit: 'MB' },
      userImpact: 'high',
      warning: 'Will remove old meeting recordings and all cached data',
      actions: [
        {
          type: 'closeApp',
          implementation: 'closeZoom',
          estimatedTime: 3000
        },
        {
          type: 'manageRecordings',
          implementation: 'archiveOldRecordings',
          ageThreshold: 60, // days
          estimatedTime: 8000,
          warningMessage: 'Old recordings will be removed'
        },
        {
          type: 'clearCache',
          target: 'all',
          implementation: 'clearAllZoomData',
          estimatedTime: 10000,
          preserveFiles: ['settings.json'] // Keep user preferences
        },
        {
          type: 'restartApp',
          implementation: 'restartZoom',
          estimatedTime: 4000
        }
      ]
    }
  },

  contextualRules: {
    timeOfDay: {
      earlyMorning: { preferredStrategy: 'aggressive', reason: 'Before meetings start' },
      businessHours: { onlyConservative: true, reason: 'Meeting time' },
      lunchTime: { allowBalanced: true, reason: 'Meeting break' },
      evening: { allowBalanced: true, reason: 'End of meeting day' },
      lateNight: { allowAggressive: true, reason: 'No meetings scheduled' }
    },
    meetingStatus: {
      inMeeting: { noOptimization: true, reason: 'Active meeting' },
      meetingScheduled: { onlyConservative: true, reason: 'Meeting starting soon' },
      noMeetings: { allowAggressive: true }
    },
    userActivity: {
      zoomActive: { onlyConservative: true },
      zoomIdle: { allowBalanced: true },
      zoomNotRunning: { allowAggressive: true }
    },
    recordingSize: {
      large: { preferAggressive: true, reason: 'Major space savings available' },
      moderate: { preferBalanced: true },
      small: { preferConservative: true }
    }
  },

  successMetrics: {
    diskSpaceFreed: { weight: 0.4, threshold: 500 }, // MB
    memoryFreed: { weight: 0.3, threshold: 200 }, // MB
    speedImprovement: { weight: 0.2, threshold: 12 }, // %
    userSatisfaction: { weight: 0.1, threshold: 0.85 } // 0-1, critical business app
  },

  learningConfig: {
    minSampleSize: 8,
    confidenceThreshold: 0.8,
    adaptationRate: 0.15,
    contextWeights: {
      meetingStatus: 0.4,
      timeOfDay: 0.3,
      recordingSize: 0.2,
      userActivity: 0.1
    }
  }
};

export default zoomStrategy;
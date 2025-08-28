/**
 * Spotify Optimization Strategy
 * Music streaming app with massive offline cache potential (5-15GB common)
 * Version: 1.0.0 (Base Strategy)
 */

export const spotifyStrategy = {
  appId: 'com.spotify.client',
  displayName: 'Spotify',
  category: 'media',
  tier: 'free',
  userBase: 0.62,
  version: '1.0.0',
  
  memoryProfile: {
    baseline: { min: 150, max: 200, unit: 'MB' },
    playing: { min: 250, max: 350, unit: 'MB' },
    backgroundIdle: { min: 150, max: 220, unit: 'MB' },
    memoryLeakRate: 50, // MB per hour when minimized
    criticalThreshold: 400,
    processMultiplier: 1.0 // Usually single process
  },

  cacheLocations: {
    safe: [
      '~/Library/Caches/com.spotify.client',
      '~/Library/Application Support/Spotify/PersistentCache',
      '~/Library/Application Support/Spotify/Cache',
      '~/Library/Application Support/Spotify/Browser/Local Storage'
    ],
    moderate: [
      '~/Library/Application Support/Spotify/Data', // App data, safer to clear
      '~/Library/Application Support/Spotify/logs'
    ],
    risky: [
      '~/Library/Application Support/Spotify/Users/*/offline.bnk', // Downloaded songs
      '~/Library/Application Support/Spotify/Users/*/local-files.bnk' // Local music files
    ]
  },

  knownIssues: {
    offlineCacheExplosion: {
      description: 'Downloaded songs can exceed 15GB, cache metadata grows to 5GB+',
      severity: 'critical',
      detection: {
        method: 'directorySize',
        path: '~/Library/Application Support/Spotify',
        threshold: 2000, // MB
        confidence: 0.9
      },
      solution: 'clearNonEssentialCache'
    },
    persistentCacheBuildup: {
      description: 'Album artwork and metadata cache grows continuously',
      severity: 'medium',
      detection: {
        method: 'directorySize',
        path: '~/Library/Application Support/Spotify/PersistentCache',
        threshold: 500, // MB
        confidence: 0.8
      },
      solution: 'clearPersistentCache'
    },
    memoryLeakMinimized: {
      description: 'Spotify grows 50MB+ per hour when minimized',
      severity: 'medium',
      detection: {
        method: 'processMemoryGrowth',
        processName: 'Spotify',
        threshold: 300, // MB
        confidence: 0.7
      },
      solution: 'restartSpotify'
    }
  },

  optimizationStrategies: {
    conservative: {
      name: 'Spotify Cache Clean',
      description: 'Clear artwork and metadata cache, preserve downloaded music',
      estimatedSavings: { min: 500, max: 3000, unit: 'MB' },
      userImpact: 'minimal',
      preserves: 'Downloaded music, playlists, preferences',
      actions: [
        {
          type: 'clearCache',
          target: 'safe',
          implementation: 'clearSpotifyCache',
          requiresRestart: false,
          estimatedTime: 6000, // ms
          preserveFiles: ['offline.bnk', 'local-files.bnk']
        },
        {
          type: 'clearLogs',
          implementation: 'clearSpotifyLogs',
          requiresRestart: false,
          estimatedTime: 2000
        }
      ]
    },
    
    balanced: {
      name: 'Spotify Deep Clean',
      description: 'Clear all caches including metadata, keep downloaded music',
      estimatedSavings: { min: 1000, max: 5000, unit: 'MB' },
      userImpact: 'low',
      sideEffects: 'Album artwork will re-download, playlists may re-sync',
      actions: [
        {
          type: 'clearCache',
          target: 'moderate',
          implementation: 'clearSpotifyDeepCache',
          requiresRestart: false,
          estimatedTime: 8000,
          preserveFiles: ['offline.bnk', 'prefs'] // Keep downloaded music and preferences
        },
        {
          type: 'clearMetadata',
          implementation: 'clearSpotifyMetadata',
          requiresRestart: false,
          estimatedTime: 4000
        },
        {
          type: 'compactDatabase',
          implementation: 'compactSpotifyDB',
          estimatedTime: 5000
        }
      ]
    },

    aggressive: {
      name: 'Spotify Complete Reset',
      description: 'Full cleanup including downloaded music - maximum space recovery',
      estimatedSavings: { min: 3000, max: 15000, unit: 'MB' },
      userImpact: 'high',
      warning: 'Will remove downloaded music and require re-download',
      actions: [
        {
          type: 'saveSettings',
          implementation: 'saveSpotifySettings',
          estimatedTime: 1000
        },
        {
          type: 'closeApp',
          implementation: 'closeSpotify',
          estimatedTime: 2000
        },
        {
          type: 'clearCache',
          target: 'all',
          implementation: 'clearAllSpotifyData',
          estimatedTime: 15000,
          warningMessage: 'This will remove downloaded music'
        },
        {
          type: 'restartApp',
          implementation: 'restartSpotify',
          restoreSettings: true,
          estimatedTime: 4000
        }
      ]
    }
  },

  contextualRules: {
    timeOfDay: {
      morning: { preferredStrategy: 'conservative', reason: 'User likely to listen to music' },
      afternoon: { preferredStrategy: 'balanced', reason: 'Safe time for cache clearing' },
      evening: { preferredStrategy: 'balanced', reason: 'Evening listening session prep' },
      lateNight: { preferredStrategy: 'aggressive', reason: 'Less likely to be using Spotify' }
    },
    networkConnection: {
      wifi: { allowAggressive: true, reason: 'Can re-download content' },
      cellular: { onlyConservative: true, reason: 'Avoid forced re-downloads' },
      offline: { onlyConservative: true, reason: 'Cannot re-download content' }
    },
    userActivity: {
      listeningToMusic: { onlyConservative: true },
      spotifyIdle: { allowBalanced: true },
      spotifyNotRunning: { allowAggressive: true }
    },
    downloadedContent: {
      highAmount: { preferConservative: true, reason: 'User values downloaded music' },
      lowAmount: { allowAggressive: true, reason: 'Less content to lose' }
    }
  },

  successMetrics: {
    memoryFreed: { weight: 0.3, threshold: 500 }, // MB
    diskSpaceFreed: { weight: 0.4, threshold: 1000 }, // MB - primary benefit
    speedImprovement: { weight: 0.2, threshold: 8 }, // %
    userSatisfaction: { weight: 0.1, threshold: 0.75 } // 0-1, considering music interruption
  },

  learningConfig: {
    minSampleSize: 15,
    confidenceThreshold: 0.75,
    adaptationRate: 0.12,
    contextWeights: {
      timeOfDay: 0.25,
      networkConnection: 0.35,
      userActivity: 0.3,
      downloadedContent: 0.1
    }
  }
};

export default spotifyStrategy;
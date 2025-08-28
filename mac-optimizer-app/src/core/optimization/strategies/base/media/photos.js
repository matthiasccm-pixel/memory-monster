/**
 * Apple Photos Optimization Strategy
 * System photo app with massive thumbnail and derivative cache (20GB+ common)
 * Version: 1.0.0 (Base Strategy)
 */

export const photosStrategy = {
  appId: 'com.apple.Photos',
  displayName: 'Photos',
  category: 'media',
  tier: 'free',
  userBase: 0.41,
  version: '1.0.0',
  
  memoryProfile: {
    baseline: { min: 200, max: 400, unit: 'MB' },
    heavyUsage: { min: 800, max: 1500, unit: 'MB' },
    importing: { min: 1200, max: 2500, unit: 'MB' },
    memoryLeakRate: 30, // MB per hour during active use
    criticalThreshold: 1000,
    processMultiplier: 1.2 // Main app + background processes
  },

  cacheLocations: {
    safe: [
      '~/Library/Caches/com.apple.Photos',
      '~/Pictures/Photos Library.photoslibrary/resources/cpl/cloudd.noindex',
      '~/Pictures/Photos Library.photoslibrary/resources/proxies/derivatives/tmp'
    ],
    moderate: [
      '~/Pictures/Photos Library.photoslibrary/resources/derivatives', // Thumbnails - can regenerate
      '~/Pictures/Photos Library.photoslibrary/resources/proxies', // Preview files
      '~/Pictures/Photos Library.photoslibrary/resources/cpl' // iCloud Photos cache
    ],
    risky: [
      '~/Pictures/Photos Library.photoslibrary/database', // Core database
      '~/Pictures/Photos Library.photoslibrary/originals', // Original photos
      '~/Pictures/Photos Library.photoslibrary/Masters' // Master images
    ]
  },

  knownIssues: {
    derivativeExplosion: {
      description: 'Photo derivatives (thumbnails, previews) can exceed 20GB',
      severity: 'critical',
      detection: {
        method: 'directorySize',
        path: '~/Pictures/Photos Library.photoslibrary/resources/derivatives',
        threshold: 5000, // MB
        confidence: 0.95
      },
      solution: 'regenerateDerivatives'
    },
    cloudCacheBuildup: {
      description: 'iCloud Photos cache accumulates indefinitely',
      severity: 'high',
      detection: {
        method: 'directorySize',
        path: '~/Pictures/Photos Library.photoslibrary/resources/cpl',
        threshold: 2000, // MB
        confidence: 0.9
      },
      solution: 'clearCloudCache'
    },
    proximityProxies: {
      description: 'Proxy files for photo editing accumulate over time',
      severity: 'medium',
      detection: {
        method: 'directorySize',
        path: '~/Pictures/Photos Library.photoslibrary/resources/proxies',
        threshold: 1000, // MB
        confidence: 0.8
      },
      solution: 'clearProxyFiles'
    },
    importCacheStuck: {
      description: 'Failed imports leave large cache files behind',
      severity: 'medium',
      detection: {
        method: 'staleFileAnalysis',
        path: '~/Pictures/Photos Library.photoslibrary/resources/derivatives/tmp',
        ageThreshold: 7, // days
        confidence: 0.7
      },
      solution: 'clearStaleImports'
    }
  },

  optimizationStrategies: {
    conservative: {
      name: 'Photos Cache Clean',
      description: 'Clear system cache and temporary files, preserve all derivatives',
      estimatedSavings: { min: 200, max: 1000, unit: 'MB' },
      userImpact: 'minimal',
      preserves: 'All photos, thumbnails, and viewing experience',
      actions: [
        {
          type: 'clearCache',
          target: 'safe',
          implementation: 'clearPhotosCache',
          requiresRestart: false,
          estimatedTime: 5000
        },
        {
          type: 'clearStaleFiles',
          implementation: 'clearStaleImportCache',
          ageThreshold: 7, // days
          requiresRestart: false,
          estimatedTime: 4000
        }
      ]
    },
    
    balanced: {
      name: 'Photos Derivative Refresh',
      description: 'Clear and regenerate photo derivatives for space savings',
      estimatedSavings: { min: 2000, max: 8000, unit: 'MB' },
      userImpact: 'moderate',
      sideEffects: 'Thumbnails will regenerate, temporary slower photo browsing',
      actions: [
        {
          type: 'closeApp',
          implementation: 'closePhotos',
          estimatedTime: 3000
        },
        {
          type: 'clearCache',
          target: 'moderate',
          implementation: 'clearPhotosAllCache',
          estimatedTime: 12000
        },
        {
          type: 'clearCloudCache',
          implementation: 'clearPhotosCloudCache',
          estimatedTime: 8000,
          preserveRecent: true // Keep recent iCloud downloads
        },
        {
          type: 'regenerateDerivatives',
          implementation: 'regeneratePhotoThumbnails',
          priority: 'background',
          estimatedTime: 10000
        }
      ]
    },

    aggressive: {
      name: 'Photos Complete Reset',
      description: 'Full Photos cache reset - maximum space recovery',
      estimatedSavings: { min: 5000, max: 25000, unit: 'MB' },
      userImpact: 'high',
      warning: 'Will regenerate all thumbnails and previews - Photos will be slower initially',
      actions: [
        {
          type: 'closeApp',
          implementation: 'closePhotos',
          estimatedTime: 3000
        },
        {
          type: 'clearCache',
          target: 'all',
          implementation: 'clearAllPhotosCache',
          estimatedTime: 20000,
          preserveOriginals: true, // Never delete actual photos
          warningMessage: 'This will remove all generated thumbnails and previews'
        },
        {
          type: 'resetPhotosDatabase',
          implementation: 'resetPhotosCacheDatabase',
          estimatedTime: 8000
        },
        {
          type: 'restartApp',
          implementation: 'restartPhotos',
          estimatedTime: 5000
        },
        {
          type: 'regenerateDerivatives',
          implementation: 'fullDerivativeRegeneration',
          priority: 'background',
          estimatedTime: 30000 // Can take a long time
        }
      ]
    }
  },

  contextualRules: {
    timeOfDay: {
      morning: { preferredStrategy: 'conservative', reason: 'May be viewing photos' },
      afternoon: { allowBalanced: true, reason: 'Good time for background tasks' },
      evening: { allowBalanced: true, reason: 'Light photo usage' },
      lateNight: { allowAggressive: true, reason: 'Background processing time' }
    },
    photoLibrarySize: {
      huge: { preferAggressive: true, reason: 'Maximum space savings needed' },
      large: { preferBalanced: true },
      moderate: { preferConservative: true }
    },
    systemStorage: {
      criticalLow: { preferAggressive: true, reason: 'Urgent space needed' },
      low: { preferBalanced: true },
      adequate: { preferConservative: true }
    },
    userActivity: {
      editingPhotos: { noOptimization: true, reason: 'Active photo work' },
      browsingPhotos: { onlyConservative: true },
      photosIdle: { allowBalanced: true },
      photosNotRunning: { allowAggressive: true }
    }
  },

  successMetrics: {
    diskSpaceFreed: { weight: 0.6, threshold: 2000 }, // MB - primary benefit
    memoryFreed: { weight: 0.2, threshold: 300 }, // MB
    appStartupSpeed: { weight: 0.1, threshold: 15 }, // %
    userSatisfaction: { weight: 0.1, threshold: 0.7 } // 0-1, considering regeneration time
  },

  learningConfig: {
    minSampleSize: 8,
    confidenceThreshold: 0.75,
    adaptationRate: 0.15,
    contextWeights: {
      photoLibrarySize: 0.4,
      systemStorage: 0.3,
      userActivity: 0.2,
      timeOfDay: 0.1
    }
  }
};

export default photosStrategy;
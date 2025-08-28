/**
 * macOS System-Level Optimization Strategy
 * Adaptive system optimization that learns from Apple's OS updates and patterns
 * Handles different macOS versions with version-specific strategies
 * Version: 1.0.0 (Base System Strategy)
 */

export const macosSystemStrategy = {
  systemId: 'com.apple.macOS',
  displayName: 'macOS System',
  category: 'system',
  tier: 'core', // Available to all users
  version: '1.0.0',
  
  // macOS Version Support Matrix
  supportedVersions: {
    'Sonoma': { version: '14.0', minVersion: '14.0', maxVersion: '14.9' },
    'Ventura': { version: '13.0', minVersion: '13.0', maxVersion: '13.9' },
    'Monterey': { version: '12.0', minVersion: '12.0', maxVersion: '12.9' },
    'BigSur': { version: '11.0', minVersion: '11.0', maxVersion: '11.9' },
    'Catalina': { version: '10.15', minVersion: '10.15', maxVersion: '10.15.9' }
  },

  // System Memory Profile by macOS Version
  systemProfiles: {
    'Sonoma': {
      baseSystemMemory: { min: 2500, max: 4000, unit: 'MB' },
      modernMemoryManagement: true,
      memoryCompression: 'advanced',
      cacheBehavior: 'aggressive',
      knownIssues: ['windowserver_leak', 'spotlight_indexing', 'control_center_memory']
    },
    'Ventura': {
      baseSystemMemory: { min: 2200, max: 3500, unit: 'MB' },
      modernMemoryManagement: true,
      memoryCompression: 'improved',
      cacheBehavior: 'balanced',
      knownIssues: ['windowserver_leak', 'notification_center_bloat']
    },
    'Monterey': {
      baseSystemMemory: { min: 2000, max: 3200, unit: 'MB' },
      modernMemoryManagement: true,
      memoryCompression: 'standard',
      cacheBehavior: 'conservative',
      knownIssues: ['safari_webkit_leak', 'airdrop_memory_leak']
    }
  },

  // System Cache Locations by macOS Version
  systemCacheLocations: {
    common: {
      safe: [
        '/System/Library/Caches',
        '~/Library/Caches/com.apple.helpd',
        '~/Library/Caches/com.apple.spotlight',
        '/Library/Caches/com.apple.iconservices',
        '/var/folders/*/C/com.apple.LaunchServices*'
      ],
      moderate: [
        '~/Library/Caches/CloudKit',
        '~/Library/Caches/com.apple.bird',
        '/private/var/db/CoreDuet/caches',
        '/System/Library/Caches/com.apple.coreml.caches'
      ],
      risky: [
        '/var/db/dyld/dyld_*', // Dynamic linker cache
        '/System/Library/Caches/com.apple.kext.caches', // Kernel extension cache
        '~/Library/Preferences' // User preferences
      ]
    },
    versionSpecific: {
      'Sonoma': {
        additional: [
          '~/Library/Caches/com.apple.controlcenter',
          '/System/Library/Caches/com.apple.WeatherKitService'
        ]
      },
      'Ventura': {
        additional: [
          '~/Library/Caches/com.apple.universalaccess',
          '/System/Library/Caches/com.apple.Metal'
        ]
      }
    }
  },

  // System-Level Issues Detection
  knownSystemIssues: {
    windowServerMemoryLeak: {
      description: 'WindowServer process grows over time, common in all recent macOS',
      severity: 'high',
      affectedVersions: ['Sonoma', 'Ventura', 'Monterey'],
      detection: {
        method: 'processMemoryCheck',
        processName: 'WindowServer',
        threshold: 1000, // MB
        confidence: 0.9
      },
      solution: 'restartWindowServer' // Requires logout/login
    },
    kernelTaskSwelling: {
      description: 'kernel_task can consume excessive memory under thermal pressure',
      severity: 'critical',
      affectedVersions: ['all'],
      detection: {
        method: 'processMemoryCheck',
        processName: 'kernel_task',
        threshold: 2000, // MB
        confidence: 0.95
      },
      solution: 'thermalManagement'
    },
    spotlightIndexingStuck: {
      description: 'Spotlight indexing can get stuck and consume resources',
      severity: 'medium',
      affectedVersions: ['Sonoma', 'Ventura'],
      detection: {
        method: 'processActivityCheck',
        processName: 'mds_stores',
        cpuThreshold: 80, // %
        duration: 1800, // seconds
        confidence: 0.8
      },
      solution: 'resetSpotlightIndex'
    },
    cacheCorruption: {
      description: 'System caches can become corrupted causing slowdowns',
      severity: 'medium',
      affectedVersions: ['all'],
      detection: {
        method: 'systemPerformanceAnalysis',
        metrics: ['bootTime', 'appLaunchTime', 'fileSystemResponse'],
        threshold: 0.7, // Performance degradation
        confidence: 0.75
      },
      solution: 'rebuildSystemCaches'
    }
  },

  // Optimization Strategies by Risk Level
  optimizationStrategies: {
    safe: {
      name: 'System Cache Maintenance',
      description: 'Safe system cache cleanup and maintenance',
      estimatedSavings: { min: 500, max: 2000, unit: 'MB' },
      systemImpact: 'minimal',
      requiresRestart: false,
      actions: [
        {
          type: 'clearSystemCaches',
          target: 'safe',
          implementation: 'clearSafeSystemCaches',
          estimatedTime: 10000
        },
        {
          type: 'repairPermissions',
          implementation: 'repairDiskPermissions',
          estimatedTime: 8000
        },
        {
          type: 'cleanupLaunchServices',
          implementation: 'rebuildLaunchServices',
          estimatedTime: 5000
        }
      ]
    },
    
    moderate: {
      name: 'System Deep Clean',
      description: 'Comprehensive system optimization with selective cache clearing',
      estimatedSavings: { min: 1000, max: 4000, unit: 'MB' },
      systemImpact: 'moderate',
      requiresRestart: false,
      sideEffects: 'Some apps may launch slower initially',
      actions: [
        {
          type: 'clearSystemCaches',
          target: 'moderate',
          implementation: 'clearAllSystemCaches',
          estimatedTime: 15000
        },
        {
          type: 'optimizeMemoryPressure',
          implementation: 'purgeMemoryPressure',
          estimatedTime: 5000
        },
        {
          type: 'rebuildSpotlightIndex',
          implementation: 'resetSpotlightIndexing',
          background: true,
          estimatedTime: 20000
        },
        {
          type: 'cleanupLogFiles',
          implementation: 'cleanSystemLogs',
          keepDays: 7,
          estimatedTime: 8000
        }
      ]
    },

    aggressive: {
      name: 'System Reset & Optimization',
      description: 'Maximum system optimization - requires restart',
      estimatedSavings: { min: 2000, max: 8000, unit: 'MB' },
      systemImpact: 'high',
      requiresRestart: true,
      warning: 'Requires system restart and will reset some system preferences',
      actions: [
        {
          type: 'prepareSystemReset',
          implementation: 'prepareForSystemOptimization',
          estimatedTime: 5000
        },
        {
          type: 'clearSystemCaches',
          target: 'all',
          implementation: 'purgeAllSystemCaches',
          estimatedTime: 25000
        },
        {
          type: 'resetSystemServices',
          implementation: 'resetCoreSystemServices',
          services: ['WindowServer', 'Dock', 'Finder'],
          estimatedTime: 15000
        },
        {
          type: 'rebuildSystemDatabases',
          implementation: 'rebuildSystemDatabases',
          estimatedTime: 20000
        },
        {
          type: 'scheduleRestart',
          implementation: 'scheduleSystemRestart',
          delay: 60000 // 1 minute delay
        }
      ]
    }
  },

  // Version-Specific Optimization Rules
  versionSpecificRules: {
    'Sonoma': {
      memoryManagement: 'modern',
      recommendedStrategy: 'moderate',
      specificOptimizations: [
        'optimizeControlCenter',
        'manageLiveActivities',
        'optimizeWidgetSystem'
      ]
    },
    'Ventura': {
      memoryManagement: 'improved',
      recommendedStrategy: 'balanced',
      specificOptimizations: [
        'optimizeStageManager',
        'manageContinuityFeatures'
      ]
    },
    'Monterey': {
      memoryManagement: 'standard',
      recommendedStrategy: 'conservative',
      specificOptimizations: [
        'optimizeAirPlay',
        'manageShortcuts'
      ]
    }
  },

  // Contextual System Rules
  contextualSystemRules: {
    systemAge: {
      fresh: { preferConservative: true, reason: 'New system, minimal cleanup needed' },
      established: { allowModerate: true, reason: 'Some cleanup beneficial' },
      mature: { preferAggressive: true, reason: 'Significant cleanup needed' }
    },
    availableRAM: {
      abundant: { allowAggressive: true },
      adequate: { preferModerate: true },
      limited: { preferAggressive: true, reason: 'Need maximum memory' }
    },
    systemPerformance: {
      excellent: { preferConservative: true },
      good: { allowModerate: true },
      poor: { preferAggressive: true }
    },
    uptime: {
      recent: { allowConservative: true },
      extended: { preferModerate: true, reason: 'System been running long' },
      excessive: { preferAggressive: true, reason: 'System needs refresh' }
    }
  },

  // System Learning Parameters
  systemLearningConfig: {
    adaptToOSUpdates: true,
    trackApplePatterns: true,
    versionSpecificAdaptation: true,
    learningMetrics: {
      bootTime: { weight: 0.3, threshold: 60 }, // seconds
      memoryPressure: { weight: 0.25, threshold: 0.7 }, // 0-1
      thermalState: { weight: 0.2, threshold: 'nominal' },
      batteryLife: { weight: 0.15, threshold: 0.8 }, // hours improvement
      userSatisfaction: { weight: 0.1, threshold: 0.85 }
    },
    adaptationRules: {
      newOSVersion: { increaseConservatism: 0.3, reason: 'Unknown new patterns' },
      stableVersion: { normalAdaptation: true },
      deprecatedVersion: { increaseAggression: 0.2, reason: 'Less Apple support' }
    }
  },

  // System Monitoring & Detection
  systemMonitoring: {
    continuousMetrics: [
      'memoryPressure',
      'thermalState', 
      'energyImpact',
      'diskPressure',
      'networkLoad'
    ],
    periodicChecks: [
      'systemCacheSize',
      'logFileGrowth',
      'kernelExtensionLoading',
      'launchServiceCorruption'
    ],
    alertThresholds: {
      criticalMemoryPressure: 0.9,
      excessiveSystemCache: 5000, // MB
      highThermalPressure: 'critical',
      slowBootTime: 120 // seconds
    }
  }
};

export default macosSystemStrategy;
/**
 * macOS Monterey (12.x) Specific System Optimization Strategy
 * Based on research of Monterey-specific memory patterns and AirPlay/Universal Control features
 * Version: 1.0.0
 */

export const montereySystemStrategy = {
  systemId: 'com.apple.macOS.monterey',
  displayName: 'macOS Monterey System',
  category: 'system',
  tier: 'core', 
  osVersion: '12.x',
  version: '1.0.0',
  
  // Monterey-specific memory profile
  memoryProfile: {
    baseSystem: { min: 2000, max: 3200, unit: 'MB' },
    withAirPlay: { min: 2400, max: 3800, unit: 'MB' },
    withUniversalControl: { min: 2600, max: 4000, unit: 'MB' },
    criticalThreshold: 4500, // MB - when aggressive optimization needed
    modernMemoryManagement: true,
    memoryCompression: 'standard'
  },

  // Monterey-specific cache locations
  cacheLocations: {
    safe: [
      '~/Library/Caches/com.apple.airplay',
      '~/Library/Caches/com.apple.shortcuts',
      '~/Library/Caches/com.apple.remotedesktop',
      '/System/Library/Caches/com.apple.WebKit',
      '~/Library/Caches/com.apple.ShareKit'
    ],
    moderate: [
      '~/Library/Caches/com.apple.bird', // iCloud sync  
      '/var/folders/*/C/com.apple.UniversalControl*',
      '~/Library/Caches/com.apple.Spotlight.IndexAgent',
      '/System/Library/Caches/com.apple.CoreML'
    ],
    aggressive: [
      '/System/Library/Caches/com.apple.Safari.WebKit2',
      '/Library/Caches/com.apple.Safari.HistoryServiceAgent', 
      '/System/Library/PrivateFrameworks/*/Caches'
    ]
  },

  // Monterey-specific known issues
  knownIssues: {
    airPlayReceiverMemoryLeak: {
      description: 'AirPlay receiver service maintains audio/video buffers even when no devices connected',
      severity: 'high',
      commonOccurrence: 0.7,
      detection: {
        method: 'processMemoryCheck',
        processName: 'AirPlayXPCHelper',
        threshold: 300, // MB
        confidence: 0.85
      },
      solution: 'restartAirPlayReceiver',
      estimatedSavings: { min: 200, max: 600, unit: 'MB' }
    },

    universalControlMemoryBuild: {
      description: 'Universal Control maintains device discovery and input sync caches indefinitely',
      severity: 'medium',
      commonOccurrence: 0.6,
      detection: {
        method: 'cacheSize',
        path: '/var/folders/*/C/com.apple.UniversalControl*',
        threshold: 250, // MB
        confidence: 0.8
      },
      solution: 'clearUniversalControlCache',
      estimatedSavings: { min: 150, max: 400, unit: 'MB' }
    },

    safariWebKitMemoryLeak: {
      description: 'Safari WebKit processes in Monterey have known memory leaks with certain web content',
      severity: 'critical',
      commonOccurrence: 0.9,
      detection: {
        method: 'processMemoryCheck',
        processName: 'com.apple.WebKit.WebContent',
        threshold: 600, // MB per process
        confidence: 0.9
      },
      solution: 'restartSafariWebKit',
      estimatedSavings: { min: 400, max: 1200, unit: 'MB' }
    },

    shortcutsAppMemoryAccumulation: {
      description: 'Shortcuts app maintains automation contexts and result caches in memory',
      severity: 'medium',
      commonOccurrence: 0.65,
      detection: {
        method: 'processMemoryCheck',
        processName: 'Shortcuts Events',
        threshold: 200, // MB
        confidence: 0.8
      },
      solution: 'clearShortcutsCache',
      estimatedSavings: { min: 100, max: 350, unit: 'MB' }
    },

    airdropDiscoveryLeak: {
      description: 'AirDrop discovery maintains peer caches and connection history indefinitely',
      severity: 'medium',
      commonOccurrence: 0.8,
      detection: {
        method: 'processMemoryCheck',
        processName: 'sharingd',
        threshold: 150, // MB
        confidence: 0.85
      },
      solution: 'restartAirDropService',
      estimatedSavings: { min: 100, max: 300, unit: 'MB' }
    }
  },

  // Monterey-optimized strategies
  optimizationStrategies: {
    conservative: {
      name: 'Monterey Safe System Clean',
      description: 'Conservative cleanup of Monterey-specific services and caches',
      estimatedSavings: { min: 500, max: 1200, unit: 'MB' },
      userImpact: 'minimal',
      requiresRestart: false,
      actions: [
        {
          type: 'clearCache',
          target: 'airplay',
          implementation: 'clearAirPlayCache',
          estimatedSavings: { min: 100, max: 300, unit: 'MB' },
          estimatedTime: 3000
        },
        {
          type: 'clearCache',
          target: 'shortcuts',
          implementation: 'clearShortcutsCache',
          estimatedSavings: { min: 50, max: 200, unit: 'MB' },
          estimatedTime: 2000
        },
        {
          type: 'optimizeService',
          target: 'safari',
          implementation: 'optimizeSafariMontereyCache',
          estimatedSavings: { min: 200, max: 500, unit: 'MB' },
          estimatedTime: 6000
        },
        {
          type: 'clearCache',
          target: 'universalControl',
          implementation: 'clearUniversalControlCache',
          estimatedSavings: { min: 100, max: 250, unit: 'MB' },
          condition: 'universalControlEnabled',
          estimatedTime: 4000
        }
      ]
    },

    balanced: {
      name: 'Monterey Smart Optimization', 
      description: 'Balanced Monterey optimization targeting key memory issues',
      estimatedSavings: { min: 1000, max: 2400, unit: 'MB' },
      userImpact: 'moderate',
      requiresRestart: false,
      sideEffects: 'AirPlay connections may restart, Safari tabs may reload',
      actions: [
        {
          type: 'restartService',
          target: 'airPlayReceiver',
          implementation: 'restartAirPlayReceiver',
          estimatedSavings: { min: 200, max: 600, unit: 'MB' },
          estimatedTime: 5000
        },
        {
          type: 'optimizeApp',
          target: 'safari',
          implementation: 'restartSafariWebKitProcesses',
          estimatedSavings: { min: 400, max: 1000, unit: 'MB' },
          sideEffect: 'Safari tabs will reload',
          estimatedTime: 8000
        },
        {
          type: 'restartService',
          target: 'airDrop',
          implementation: 'restartAirDropService',
          estimatedSavings: { min: 100, max: 300, unit: 'MB' },
          estimatedTime: 4000
        },
        {
          type: 'clearCache',
          target: 'shortcuts',
          implementation: 'clearShortcutsCache',
          estimatedSavings: { min: 100, max: 350, unit: 'MB' },
          estimatedTime: 3000
        },
        {
          type: 'clearCache',
          target: 'universalControl',
          implementation: 'clearUniversalControlCache',
          estimatedSavings: { min: 150, max: 400, unit: 'MB' },
          condition: 'universalControlEnabled',
          estimatedTime: 5000
        }
      ]
    },

    aggressive: {
      name: 'Monterey Maximum Performance Reset',
      description: 'Complete Monterey system reset for maximum memory recovery',
      estimatedSavings: { min: 1800, max: 3800, unit: 'MB' },
      userImpact: 'high',
      requiresRestart: false,
      warning: 'Will restart connectivity services, Safari will close all tabs, AirPlay/Universal Control will restart',
      actions: [
        {
          type: 'prepareOptimization', 
          implementation: 'prepareMontereyOptimization',
          estimatedTime: 3000
        },
        {
          type: 'forceQuit',
          target: 'safari',
          implementation: 'forceSafariRestart',
          estimatedSavings: { min: 600, max: 1500, unit: 'MB' },
          warning: 'All Safari tabs will close',
          estimatedTime: 5000
        },
        {
          type: 'restartServices',
          target: 'montereyServices',
          services: ['AirPlay', 'AirDrop', 'UniversalControl', 'Shortcuts', 'Spotlight'],
          implementation: 'restartMontereySystemServices',
          estimatedSavings: { min: 500, max: 1200, unit: 'MB' },
          estimatedTime: 12000
        },
        {
          type: 'clearCache',
          target: 'system_wide',
          implementation: 'purgeAllMontereyCaches',
          estimatedSavings: { min: 600, max: 1400, unit: 'MB' },
          estimatedTime: 15000
        },
        {
          type: 'rebuildDatabases',
          target: 'system',
          implementation: 'rebuildMontereySystemDatabases',
          background: true,
          estimatedTime: 18000
        }
      ]
    }
  },

  // Monterey-specific contextual rules
  contextualRules: {
    airPlayUsage: {
      active: {
        frequentAirPlayCleanup: true,
        reason: 'Active AirPlay streaming needs buffer management'
      },
      inactive: {
        deepAirPlayCleanup: true,
        reason: 'Clear accumulated AirPlay receiver memory'
      }
    },

    universalControlActive: {
      enabled: {
        includeUniversalControlOptimization: true,
        reason: 'Universal Control device sync needs memory management'
      },
      disabled: {
        skipUniversalControlOptimizations: true
      }
    },

    safariUsage: {
      heavy: {
        preferredStrategy: 'balanced',
        reason: 'Safari WebKit memory leaks critical in Monterey'
      },
      moderate: {
        regularSafariOptimization: true
      }
    },

    shortcutsUsage: {
      heavy: {
        frequentShortcutsCleanup: true,
        reason: 'Heavy Shortcuts usage creates automation caches'
      }
    }
  },

  // Monterey learning configuration
  learningConfig: {
    adaptToMontereyPatterns: true,
    trackAirPlayBehavior: true,
    monitorUniversalControlUsage: true,
    safariStabilityTracking: true,
    successMetrics: {
      memoryFreed: { weight: 0.4, threshold: 500 },
      safariStability: { weight: 0.3, threshold: 0.9 }, // crash rate improvement
      airPlayPerformance: { weight: 0.2, threshold: 15 }, // % latency improvement
      connectivityReliability: { weight: 0.1, threshold: 0.85 } // connection success rate
    }
  },

  // Monterey-specific monitoring
  monitoring: {
    airPlayMemory: {
      processNames: ['AirPlayXPCHelper', 'AirPlayUIAgent'],
      combinedThreshold: 400, // MB
      alertThreshold: 600 // MB
    },
    safariWebKitProcesses: {
      processName: 'com.apple.WebKit.WebContent',
      countThreshold: 8, // Too many WebKit processes
      memoryPerProcessThreshold: 400, // MB per process
      combinedThreshold: 1200 // MB total
    },
    universalControlCache: {
      cacheLocation: '/var/folders/*/C/com.apple.UniversalControl*',
      sizeThreshold: 300, // MB
    },
    shortcutsMemory: {
      processName: 'Shortcuts Events',
      memoryThreshold: 250 // MB
    },
    airDropService: {
      processName: 'sharingd',
      memoryThreshold: 200 // MB
    }
  }
};

export default montereySystemStrategy;
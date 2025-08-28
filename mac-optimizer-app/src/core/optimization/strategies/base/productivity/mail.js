/**
 * Apple Mail Optimization Strategy
 * Built-in email client with attachment and index cache accumulation
 * Version: 1.0.0 (Base Strategy)
 */

export const mailStrategy = {
  appId: 'com.apple.mail',
  displayName: 'Mail',
  category: 'productivity',
  tier: 'free',
  userBase: 0.43,
  version: '1.0.0',
  
  memoryProfile: {
    baseline: { min: 100, max: 200, unit: 'MB' },
    heavyUsage: { min: 300, max: 600, unit: 'MB' },
    indexingMode: { min: 500, max: 1000, unit: 'MB' },
    memoryLeakRate: 15, // MB per hour during active use
    criticalThreshold: 500,
    processMultiplier: 1.0 // Usually single process
  },

  cacheLocations: {
    safe: [
      '~/Library/Caches/com.apple.mail',
      '~/Library/Mail/V*/MailData/Synced Conversations',
      '~/Library/Mail/V*/MailData/BackingStoreUpdateJournal*'
    ],
    moderate: [
      '~/Library/Mail/V*/MailData/Envelope Index*', // Rebuilt by Mail
      '~/Library/Mail/V*/MailData/*.mboxCache' // Message cache files
    ],
    risky: [
      '~/Library/Mail/V*/Mailboxes', // Actual email storage
      '~/Library/Mail/V*/MailData/Accounts.plist', // Account settings
      '~/Library/Mail/V*/MailData/MessageSorting.plist' // User preferences
    ]
  },

  knownIssues: {
    envelopeIndexBloat: {
      description: 'Mail envelope index can grow to 2GB+ over years of use',
      severity: 'high',
      detection: {
        method: 'fileSize',
        path: '~/Library/Mail/V*/MailData/Envelope Index*',
        threshold: 500, // MB
        confidence: 0.9
      },
      solution: 'rebuildMailIndex'
    },
    attachmentCacheGrowth: {
      description: 'Attachment previews and inline images accumulate',
      severity: 'medium',
      detection: {
        method: 'directorySize',
        path: '~/Library/Caches/com.apple.mail',
        threshold: 200, // MB
        confidence: 0.8
      },
      solution: 'clearAttachmentCache'
    },
    conversationCacheBuildup: {
      description: 'Synced conversation data grows over time',
      severity: 'low',
      detection: {
        method: 'directorySize',
        path: '~/Library/Mail/V*/MailData/Synced Conversations',
        threshold: 100, // MB
        confidence: 0.7
      },
      solution: 'clearConversationCache'
    },
    orphanedMessageCache: {
      description: 'Deleted messages leave cache files behind',
      severity: 'medium',
      detection: {
        method: 'orphanedFileAnalysis',
        path: '~/Library/Mail/V*/MailData',
        pattern: '*.mboxCache',
        confidence: 0.75
      },
      solution: 'cleanOrphanedCache'
    }
  },

  optimizationStrategies: {
    conservative: {
      name: 'Mail Cache Clean',
      description: 'Clear attachment and conversation cache, preserve all mail data',
      estimatedSavings: { min: 100, max: 500, unit: 'MB' },
      userImpact: 'minimal',
      preserves: 'All emails, settings, and mailbox organization',
      actions: [
        {
          type: 'clearCache',
          target: 'safe',
          implementation: 'clearMailCache',
          requiresRestart: false,
          estimatedTime: 4000
        },
        {
          type: 'cleanOrphanedFiles',
          implementation: 'cleanOrphanedMailCache',
          requiresRestart: false,
          estimatedTime: 6000
        }
      ]
    },
    
    balanced: {
      name: 'Mail Index Refresh',
      description: 'Rebuild mail index and clear all caches for better performance',
      estimatedSavings: { min: 300, max: 1200, unit: 'MB' },
      userImpact: 'low',
      sideEffects: 'Mail will re-index messages, search may be temporarily slower',
      actions: [
        {
          type: 'closeApp',
          implementation: 'closeMail',
          estimatedTime: 2000
        },
        {
          type: 'clearCache',
          target: 'moderate',
          implementation: 'clearAllMailCache',
          estimatedTime: 8000
        },
        {
          type: 'rebuildIndex',
          implementation: 'rebuildMailIndex',
          estimatedTime: 5000,
          warningMessage: 'Mail will re-index messages after restart'
        },
        {
          type: 'restartApp',
          implementation: 'restartMail',
          estimatedTime: 3000
        }
      ]
    },

    aggressive: {
      name: 'Mail Complete Reset',
      description: 'Full mail cache reset and re-download for maximum efficiency',
      estimatedSavings: { min: 800, max: 3000, unit: 'MB' },
      userImpact: 'high',
      warning: 'Will force re-download of recent messages and rebuild all indexes',
      actions: [
        {
          type: 'closeApp',
          implementation: 'closeMail',
          estimatedTime: 2000
        },
        {
          type: 'backupMailSettings',
          implementation: 'backupMailPreferences',
          estimatedTime: 2000
        },
        {
          type: 'clearCache',
          target: 'all',
          implementation: 'clearAllMailData',
          estimatedTime: 15000,
          preserveMailboxes: true, // Don't delete actual emails
          warningMessage: 'This will reset Mail caches and indexes'
        },
        {
          type: 'resetMailDatabase',
          implementation: 'resetMailDatabase',
          estimatedTime: 8000
        },
        {
          type: 'restartApp',
          implementation: 'restartMail',
          estimatedTime: 5000
        }
      ]
    }
  },

  contextualRules: {
    timeOfDay: {
      earlyMorning: { preferredStrategy: 'conservative', reason: 'Email checking time' },
      businessHours: { preferredStrategy: 'conservative', reason: 'Active email use' },
      lunchBreak: { allowBalanced: true, reason: 'Light email activity' },
      endOfDay: { allowBalanced: true, reason: 'Day ending' },
      lateNight: { allowAggressive: true, reason: 'Minimal email activity' }
    },
    emailActivity: {
      heavyEmailUse: { onlyConservative: true },
      moderateEmailUse: { allowBalanced: true },
      lightEmailUse: { allowAggressive: true }
    },
    indexSize: {
      huge: { preferAggressive: true, reason: 'Major space savings available' },
      large: { preferBalanced: true },
      normal: { preferConservative: true }
    },
    systemPerformance: {
      mailSlow: { preferBalanced: true, reason: 'Index rebuild may help' },
      searchSlow: { preferBalanced: true, reason: 'Index issues likely' },
      normal: { preferConservative: true }
    }
  },

  successMetrics: {
    diskSpaceFreed: { weight: 0.4, threshold: 300 }, // MB
    memoryFreed: { weight: 0.2, threshold: 100 }, // MB
    searchSpeedImprovement: { weight: 0.3, threshold: 25 }, // %
    userSatisfaction: { weight: 0.1, threshold: 0.8 } // 0-1, email is critical
  },

  learningConfig: {
    minSampleSize: 10,
    confidenceThreshold: 0.8,
    adaptationRate: 0.1,
    contextWeights: {
      indexSize: 0.3,
      emailActivity: 0.3,
      systemPerformance: 0.25,
      timeOfDay: 0.15
    }
  }
};

export default mailStrategy;
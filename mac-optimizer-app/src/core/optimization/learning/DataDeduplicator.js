/**
 * Data Deduplication System
 * Smart filtering to prevent database overwhelm and ensure only meaningful data is stored
 */

class DataDeduplicator {
  constructor() {
    this.recentOptimizations = new Map(); // In-memory cache of recent optimizations
    this.userPatterns = new Map(); // User-specific patterns to avoid redundancy
    this.systemState = new Map(); // System state tracking
    
    // Configuration from architecture document
    this.config = {
      // Temporal deduplication rules
      temporal: {
        sameAppOptimization: 30 * 60 * 1000,    // 30 minutes
        identicalResults: 24 * 60 * 60 * 1000,  // 24 hours
        systemStateChange: 60 * 60 * 1000       // 1 hour
      },
      
      // Significance thresholds - only log meaningful improvements
      significance: {
        memoryFreed: 50,          // Only log if >50MB freed
        speedImprovement: 5,      // Only log if >5% speed gain
        effectivenessScore: 0.7   // Only log if >70% effective
      },
      
      // Context-based filtering
      contextual: {
        systemLoadThreshold: 0.8,     // Only log if system load <80%
        requireUserActive: true,      // Only log when user is active
        includeTimeContext: true,     // Include time of day context
        includeAppVersion: true       // Include app version context
      },
      
      // Cache management
      cache: {
        maxEntries: 1000,            // Max entries in memory cache
        cleanupInterval: 60 * 60 * 1000, // Cleanup every hour
        maxAge: 7 * 24 * 60 * 60 * 1000  // Keep entries for 7 days
      }
    };
    
    // Start cleanup timer
    this.startCleanupTimer();
  }

  /**
   * Main deduplication method
   * Returns null if data should be filtered out, returns processed data if should be stored
   */
  shouldStoreOptimizationData(optimizationData) {
    try {
      // 1. Temporal deduplication checks
      if (!this.passesTemporalFilter(optimizationData)) {
        console.log('🚫 Filtered: Temporal deduplication');
        return null;
      }
      
      // 2. Significance threshold checks
      if (!this.passesSignificanceFilter(optimizationData)) {
        console.log('🚫 Filtered: Below significance threshold');
        return null;
      }
      
      // 3. Contextual filtering
      if (!this.passesContextualFilter(optimizationData)) {
        console.log('🚫 Filtered: Contextual filter');
        return null;
      }
      
      // 4. Identical results filtering
      if (!this.passesIdenticalResultsFilter(optimizationData)) {
        console.log('🚫 Filtered: Identical results');
        return null;
      }
      
      // Data passes all filters - enrich and store
      const enrichedData = this.enrichOptimizationData(optimizationData);
      this.updateCache(enrichedData);
      
      console.log('✅ Data approved for storage:', {
        appId: enrichedData.appId,
        memoryFreed: enrichedData.memoryFreedMB,
        speedGain: enrichedData.speedGainPercent,
        effectiveness: enrichedData.effectivenessScore
      });
      
      return enrichedData;
      
    } catch (error) {
      console.error('Error in deduplication process:', error);
      return null; // Filter out on error to be safe
    }
  }

  /**
   * Temporal filtering - prevent too frequent logging of same operations
   */
  passesTemporalFilter(data) {
    const now = Date.now();
    const key = `${data.appId}_${data.strategy}`;
    
    // Check if we've optimized this app with this strategy recently
    if (this.recentOptimizations.has(key)) {
      const lastOptimization = this.recentOptimizations.get(key);
      const timeDiff = now - lastOptimization.timestamp;
      
      if (timeDiff < this.config.temporal.sameAppOptimization) {
        return false; // Too recent
      }
    }
    
    return true;
  }

  /**
   * Significance filtering - only log meaningful improvements
   */
  passesSignificanceFilter(data) {
    const { memoryFreedMB, speedGainPercent, effectivenessScore } = data;
    
    // Must meet at least one significance threshold
    const meetsMemoryThreshold = memoryFreedMB >= this.config.significance.memoryFreed;
    const meetsSpeedThreshold = speedGainPercent >= this.config.significance.speedImprovement;
    const meetsEffectivenessThreshold = effectivenessScore >= this.config.significance.effectivenessScore;
    
    return meetsMemoryThreshold || meetsSpeedThreshold || meetsEffectivenessThreshold;
  }

  /**
   * Contextual filtering - ensure good conditions for data collection
   */
  passesContextualFilter(data) {
    const context = data.optimizationContext || {};
    
    // Filter out high system load scenarios
    if (context.systemLoad && context.systemLoad > this.config.contextual.systemLoadThreshold) {
      return false;
    }
    
    // Filter out if user isn't active (optional)
    if (this.config.contextual.requireUserActive && !context.userActive) {
      return false;
    }
    
    return true;
  }

  /**
   * Identical results filtering - prevent storing duplicate outcomes
   */
  passesIdenticalResultsFilter(data) {
    const resultSignature = this.createResultSignature(data);
    
    // Check if we've seen identical results recently
    const identicalKey = `identical_${resultSignature}`;
    if (this.recentOptimizations.has(identicalKey)) {
      const lastIdentical = this.recentOptimizations.get(identicalKey);
      const timeDiff = Date.now() - lastIdentical.timestamp;
      
      if (timeDiff < this.config.temporal.identicalResults) {
        return false; // Identical result too recent
      }
    }
    
    return true;
  }

  /**
   * Create a signature for result comparison
   */
  createResultSignature(data) {
    const signature = {
      appId: data.appId,
      strategy: data.strategy,
      memoryFreed: Math.floor(data.memoryFreedMB / 50) * 50, // Group by 50MB chunks
      speedGain: Math.floor(data.speedGainPercent / 5) * 5,  // Group by 5% chunks
      systemProfile: {
        totalMemory: data.deviceProfile?.totalMemory,
        cpuCores: data.deviceProfile?.cpuCores,
        architecture: data.deviceProfile?.architecture
      }
    };
    
    return JSON.stringify(signature);
  }

  /**
   * Enrich optimization data with additional context
   */
  enrichOptimizationData(data) {
    const now = new Date();
    
    return {
      ...data,
      
      // Add temporal context
      temporalContext: {
        timestamp: now.toISOString(),
        timeOfDay: now.getHours(),
        dayOfWeek: now.getDay(),
        isWeekend: now.getDay() === 0 || now.getDay() === 6
      },
      
      // Add system context
      systemContext: {
        memoryPressure: this.getCurrentMemoryPressure(),
        cpuUsage: this.getCurrentCPUUsage(),
        activeApps: this.getActiveAppCount()
      },
      
      // Add user behavior context
      userContext: {
        sessionDuration: this.getSessionDuration(),
        optimizationFrequency: this.getUserOptimizationFrequency(),
        preferredStrategies: this.getUserPreferredStrategies()
      }
    };
  }

  /**
   * Update in-memory cache with new optimization data
   */
  updateCache(data) {
    const now = Date.now();
    const appKey = `${data.appId}_${data.strategy}`;
    const resultKey = `identical_${this.createResultSignature(data)}`;
    
    // Store recent optimization
    this.recentOptimizations.set(appKey, {
      timestamp: now,
      data: data
    });
    
    // Store identical result signature
    this.recentOptimizations.set(resultKey, {
      timestamp: now,
      signature: resultKey
    });
    
    // Update user patterns
    this.updateUserPatterns(data);
    
    // Cleanup if cache is too large
    if (this.recentOptimizations.size > this.config.cache.maxEntries) {
      this.cleanupCache();
    }
  }

  /**
   * Update user-specific patterns for better filtering
   */
  updateUserPatterns(data) {
    const userId = data.userId || 'anonymous';
    
    if (!this.userPatterns.has(userId)) {
      this.userPatterns.set(userId, {
        optimizationCount: 0,
        preferredStrategies: new Map(),
        appUsagePatterns: new Map(),
        successRates: new Map()
      });
    }
    
    const patterns = this.userPatterns.get(userId);
    patterns.optimizationCount++;
    
    // Track preferred strategies
    const strategyKey = `${data.appId}_${data.strategy}`;
    const currentCount = patterns.preferredStrategies.get(strategyKey) || 0;
    patterns.preferredStrategies.set(strategyKey, currentCount + 1);
    
    // Track success rates
    if (data.effectivenessScore > 0.8) {
      const successKey = `${data.appId}_success`;
      const successCount = patterns.successRates.get(successKey) || 0;
      patterns.successRates.set(successKey, successCount + 1);
    }
  }

  /**
   * Cleanup old entries from cache
   */
  cleanupCache() {
    const now = Date.now();
    const maxAge = this.config.cache.maxAge;
    
    for (const [key, value] of this.recentOptimizations.entries()) {
      if (now - value.timestamp > maxAge) {
        this.recentOptimizations.delete(key);
      }
    }
    
    console.log(`🧹 Cache cleanup completed. Entries: ${this.recentOptimizations.size}`);
  }

  /**
   * Start automatic cache cleanup timer
   */
  startCleanupTimer() {
    setInterval(() => {
      this.cleanupCache();
    }, this.config.cache.cleanupInterval);
  }

  /**
   * Helper methods for system context (to be implemented with actual system calls)
   */
  getCurrentMemoryPressure() {
    // TODO: Implement actual memory pressure detection
    return Math.random() * 100; // Placeholder
  }

  getCurrentCPUUsage() {
    // TODO: Implement actual CPU usage detection  
    return Math.random() * 100; // Placeholder
  }

  getActiveAppCount() {
    // TODO: Implement actual active app counting
    return Math.floor(Math.random() * 20) + 5; // Placeholder
  }

  getSessionDuration() {
    // TODO: Track actual session duration
    return Date.now() - (this.sessionStart || Date.now()); // Placeholder
  }

  getUserOptimizationFrequency() {
    // TODO: Calculate user's optimization frequency
    return 'medium'; // Placeholder
  }

  getUserPreferredStrategies() {
    // TODO: Analyze user's preferred strategies
    return ['balanced', 'conservative']; // Placeholder
  }

  /**
   * Get deduplication statistics
   */
  getStats() {
    return {
      cacheSize: this.recentOptimizations.size,
      userPatternsTracked: this.userPatterns.size,
      config: this.config
    };
  }
}

export default DataDeduplicator;
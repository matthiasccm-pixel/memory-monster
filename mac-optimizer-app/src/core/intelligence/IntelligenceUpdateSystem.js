/**
 * Intelligence Update System
 * Downloads and applies collective intelligence updates from the server
 */

import FeatureGate from '../licensing/FeatureGate.js';

class IntelligenceUpdateSystem {
  constructor() {
    this.featureGate = new FeatureGate();
    this.updateInterval = null;
    
    // Update configuration
    this.config = {
      updateCheckInterval: 6 * 60 * 60 * 1000, // 6 hours - check for scheduling
      updateScheduleHour: 19, // 7 PM - when updates are applied
      notificationAdvanceHours: 3, // Notify user 3 hours before update
      serverUrl: 'http://localhost:3000/api', // Your website API
      maxRetries: 3,
      retryDelay: 30000, // 30 seconds
      cacheTimeout: 24 * 60 * 60 * 1000, // 24 hours
      lastUpdateDate: null // Track when last update occurred
    };
    
    // Local intelligence cache
    this.currentIntelligence = {
      version: null,
      lastUpdated: 0,
      appProfiles: new Map(),
      systemStrategies: new Map(),
      globalPatterns: null
    };
    
    // Update statistics
    this.updateStats = {
      totalUpdates: 0,
      lastUpdateTime: 0,
      failedUpdates: 0,
      successfulUpdates: 0
    };
  }

  /**
   * Initialize the intelligence update system
   */
  async initialize() {
    console.log('🔄 Initializing Intelligence Update System...');
    
    try {
      // Load cached intelligence
      await this.loadCachedIntelligence();
      
      // Check for immediate updates
      await this.checkForUpdates();
      
      // Start periodic update checking
      this.startPeriodicUpdates();
      
      console.log('✅ Intelligence Update System initialized', {
        version: this.currentIntelligence.version,
        appProfiles: this.currentIntelligence.appProfiles.size,
        lastUpdated: new Date(this.currentIntelligence.lastUpdated).toISOString()
      });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Intelligence Update System:', error);
      return false;
    }
  }

  /**
   * Start periodic intelligence updates with daily scheduling
   */
  startPeriodicUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(async () => {
      try {
        await this.checkScheduledUpdate();
      } catch (error) {
        console.error('Periodic update check failed:', error);
        this.updateStats.failedUpdates++;
      }
    }, this.config.updateCheckInterval);

    console.log('⏰ Periodic intelligence updates started - daily at 7 PM with 3-hour advance notice');
  }

  /**
   * Check if it's time for a scheduled update or notification
   */
  async checkScheduledUpdate() {
    const now = new Date();
    const currentHour = now.getHours();
    const today = now.toDateString();
    
    // Check if we already updated today
    if (this.config.lastUpdateDate === today) {
      return;
    }
    
    // Check if it's time for advance notification (3 hours before update)
    const notificationHour = this.config.updateScheduleHour - this.config.notificationAdvanceHours;
    if (currentHour === notificationHour && !this.hasShownTodayNotification) {
      await this.showUpdateNotification();
      this.hasShownTodayNotification = true;
    }
    
    // Check if it's time for the actual update
    if (currentHour === this.config.updateScheduleHour) {
      console.log('🕖 Scheduled update time - checking for intelligence updates...');
      const hasUpdate = await this.checkForUpdates();
      
      if (hasUpdate) {
        this.config.lastUpdateDate = today;
        await this.showUpdateCompletedNotification();
      }
      
      // Reset daily notification flag
      this.hasShownTodayNotification = false;
    }
  }

  /**
   * Show advance notification about upcoming update
   */
  async showUpdateNotification() {
    console.log('🔔 Intelligence update scheduled for 7 PM - will improve optimization strategies');
    
    // In a real app, this would show a system notification
    try {
      if (window.electronAPI && window.electronAPI.showNotification) {
        await window.electronAPI.showNotification({
          title: 'Memory Monster Intelligence Update',
          body: 'System will update optimization strategies at 7 PM to improve performance',
          silent: true
        });
      }
    } catch (error) {
      console.log('Notification system not available, logged to console instead');
    }
  }

  /**
   * Show notification when update is completed
   */
  async showUpdateCompletedNotification() {
    console.log('✅ Intelligence update completed - optimization strategies enhanced');
    
    try {
      if (window.electronAPI && window.electronAPI.showNotification) {
        await window.electronAPI.showNotification({
          title: 'Memory Monster Updated',
          body: 'Optimization strategies have been enhanced with the latest intelligence',
          silent: false
        });
      }
    } catch (error) {
      console.log('Update completed notification logged to console');
    }
  }

  /**
   * Check for and apply intelligence updates
   */
  async checkForUpdates() {
    console.log('🔍 Checking for intelligence updates...');
    
    try {
      const deviceProfile = await this.getDeviceProfile();
      const updateResponse = await this.fetchIntelligenceUpdate(deviceProfile);
      
      if (updateResponse.upToDate) {
        console.log('✅ Intelligence is up to date:', updateResponse.version);
        return false;
      }
      
      if (updateResponse.hasUpdate && updateResponse.intelligence) {
        console.log('📥 New intelligence update available:', updateResponse.intelligence.version);
        await this.applyIntelligenceUpdate(updateResponse.intelligence);
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('Failed to check for updates:', error);
      this.updateStats.failedUpdates++;
      return false;
    }
  }

  /**
   * Fetch intelligence update from server
   */
  async fetchIntelligenceUpdate(deviceProfile, retryCount = 0) {
    const params = new URLSearchParams({
      deviceType: deviceProfile.isAppleSilicon ? 'apple_silicon' : 'intel',
      currentVersion: this.currentIntelligence.version || '',
      appVersion: this.featureGate.getAppVersion() || '1.0.0'
    });

    try {
      const response = await fetch(`${this.config.serverUrl}/learning/intelligence?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `MemoryMonster/${this.featureGate.getAppVersion()}`
        },
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
      
    } catch (error) {
      console.error('Failed to fetch intelligence update:', error);
      
      if (retryCount < this.config.maxRetries) {
        console.log(`Retrying intelligence update... (${retryCount + 1}/${this.config.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.fetchIntelligenceUpdate(deviceProfile, retryCount + 1);
      }
      
      throw error;
    }
  }

  /**
   * Apply intelligence update to local system
   */
  async applyIntelligenceUpdate(intelligence) {
    console.log('📝 Applying intelligence update:', intelligence.version);
    
    try {
      // Update app profiles
      if (intelligence.updates.appProfiles) {
        Object.entries(intelligence.updates.appProfiles).forEach(([appId, profile]) => {
          this.currentIntelligence.appProfiles.set(appId, {
            ...profile,
            lastUpdated: intelligence.timestamp,
            source: 'collective_intelligence'
          });
        });
        
        console.log(`Updated ${Object.keys(intelligence.updates.appProfiles).length} app profiles`);
      }

      // Update system strategies
      if (intelligence.updates.systemStrategies) {
        Object.entries(intelligence.updates.systemStrategies).forEach(([systemType, strategy]) => {
          this.currentIntelligence.systemStrategies.set(systemType, {
            ...strategy,
            lastUpdated: intelligence.timestamp,
            source: 'collective_intelligence'
          });
        });
        
        console.log(`Updated system strategies for ${Object.keys(intelligence.updates.systemStrategies).length} system types`);
      }

      // Update global patterns
      if (intelligence.updates.globalPatterns) {
        this.currentIntelligence.globalPatterns = {
          ...intelligence.updates.globalPatterns,
          lastUpdated: intelligence.timestamp,
          source: 'collective_intelligence'
        };
        
        console.log('Updated global optimization patterns');
      }

      // Update metadata
      this.currentIntelligence.version = intelligence.version;
      this.currentIntelligence.lastUpdated = intelligence.timestamp;
      
      // Cache the update
      await this.cacheIntelligence();
      
      // Update statistics
      this.updateStats.totalUpdates++;
      this.updateStats.successfulUpdates++;
      this.updateStats.lastUpdateTime = Date.now();
      
      // Notify about successful update
      console.log('✅ Intelligence update applied successfully', {
        version: intelligence.version,
        appProfiles: this.currentIntelligence.appProfiles.size,
        systemStrategies: this.currentIntelligence.systemStrategies.size
      });
      
      // Send feedback about the update
      await this.sendUpdateFeedback('applied', intelligence.version);
      
    } catch (error) {
      console.error('Failed to apply intelligence update:', error);
      this.updateStats.failedUpdates++;
      throw error;
    }
  }

  /**
   * Get updated app profile with collective intelligence
   */
  getEnhancedAppProfile(appId, baseProfile) {
    const intelligenceUpdate = this.currentIntelligence.appProfiles.get(appId);
    
    if (!intelligenceUpdate) {
      return baseProfile;
    }

    // Merge base profile with intelligence update
    const enhancedProfile = {
      ...baseProfile,
      
      // Update thresholds based on collective intelligence
      memoryProfile: {
        ...baseProfile.memoryProfile,
        heavyUsage: intelligenceUpdate.newThresholds?.memoryCritical || baseProfile.memoryProfile?.heavyUsage,
        warningThreshold: intelligenceUpdate.newThresholds?.memoryWarning || baseProfile.memoryProfile?.warningThreshold
      },
      
      // Update optimization strategies
      optimizationStrategies: intelligenceUpdate.optimizationStrategies || baseProfile.optimizationStrategies,
      
      // Add success patterns
      successPatterns: intelligenceUpdate.successPatterns,
      
      // Add risk assessment
      riskAssessment: intelligenceUpdate.riskAssessment,
      
      // Add intelligence metadata
      intelligence: {
        source: 'collective_intelligence',
        version: this.currentIntelligence.version,
        lastUpdated: intelligenceUpdate.lastUpdated,
        confidence: intelligenceUpdate.riskAssessment?.confidence || 0.5
      }
    };

    return enhancedProfile;
  }

  /**
   * Get system-specific optimization strategy
   */
  getOptimalSystemStrategy(deviceProfile) {
    const systemType = deviceProfile.isAppleSilicon ? 'appleSilicon' : 'intel';
    const strategy = this.currentIntelligence.systemStrategies.get(systemType);
    
    if (!strategy) {
      return {
        recommendedStrategy: 'balanced',
        confidence: 0.5,
        source: 'default'
      };
    }
    
    return {
      recommendedStrategy: strategy.recommendedStrategy,
      memoryOptimizations: strategy.memoryOptimizations,
      performanceGains: strategy.performanceGains,
      confidence: 0.85,
      source: 'collective_intelligence',
      lastUpdated: strategy.lastUpdated
    };
  }

  /**
   * Get time-based optimization recommendations
   */
  getTimeBasedRecommendations() {
    const globalPatterns = this.currentIntelligence.globalPatterns;
    
    if (!globalPatterns) {
      return {
        isOptimalTime: true,
        confidence: 0.5,
        recommendation: 'Optimization can be performed at any time'
      };
    }
    
    const currentHour = new Date().getHours();
    const isOptimalTime = globalPatterns.optimalTimes.includes(currentHour);
    const isAvoidTime = globalPatterns.avoidTimes.includes(currentHour);
    
    let recommendation = 'Good time for optimization';
    let confidence = 0.7;
    
    if (isOptimalTime) {
      recommendation = 'Optimal time for optimization - higher success rates expected';
      confidence = 0.9;
    } else if (isAvoidTime) {
      recommendation = 'Consider waiting - system maintenance may be occurring';
      confidence = 0.8;
    }
    
    return {
      isOptimalTime,
      isAvoidTime,
      confidence,
      recommendation,
      currentHour,
      optimalHours: globalPatterns.optimalTimes,
      insights: globalPatterns.userBehaviorInsights
    };
  }

  /**
   * Send feedback about intelligence effectiveness
   */
  async sendUpdateFeedback(type, version, details = {}) {
    try {
      await fetch(`${this.config.serverUrl}/learning/intelligence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'feedback',
          version: version,
          feedbackType: type,
          details: details,
          deviceId: this.featureGate.getDeviceId(),
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to send update feedback:', error);
    }
  }

  /**
   * Cache intelligence data locally
   */
  async cacheIntelligence() {
    try {
      const cacheData = {
        version: this.currentIntelligence.version,
        lastUpdated: this.currentIntelligence.lastUpdated,
        appProfiles: Array.from(this.currentIntelligence.appProfiles.entries()),
        systemStrategies: Array.from(this.currentIntelligence.systemStrategies.entries()),
        globalPatterns: this.currentIntelligence.globalPatterns,
        updateStats: this.updateStats
      };

      localStorage.setItem('intelligenceCache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache intelligence:', error);
    }
  }

  /**
   * Load cached intelligence data
   */
  async loadCachedIntelligence() {
    try {
      const cached = localStorage.getItem('intelligenceCache');
      if (!cached) return;

      const data = JSON.parse(cached);
      
      // Check if cache is still valid
      const cacheAge = Date.now() - data.lastUpdated;
      if (cacheAge > this.config.cacheTimeout) {
        console.log('Intelligence cache expired, will fetch new data');
        return;
      }

      // Restore cached data
      this.currentIntelligence.version = data.version;
      this.currentIntelligence.lastUpdated = data.lastUpdated;
      this.currentIntelligence.appProfiles = new Map(data.appProfiles || []);
      this.currentIntelligence.systemStrategies = new Map(data.systemStrategies || []);
      this.currentIntelligence.globalPatterns = data.globalPatterns;
      this.updateStats = { ...this.updateStats, ...data.updateStats };

      console.log('📚 Loaded cached intelligence:', {
        version: data.version,
        age: Math.round(cacheAge / (60 * 60 * 1000)) + ' hours',
        appProfiles: this.currentIntelligence.appProfiles.size
      });
    } catch (error) {
      console.error('Failed to load cached intelligence:', error);
    }
  }

  /**
   * Get device profile for intelligence updates
   */
  async getDeviceProfile() {
    try {
      const [memory, cpu] = await Promise.all([
        window.electronAPI.getSystemMemory(),
        window.electronAPI.getSystemCPU()
      ]);

      return {
        isAppleSilicon: cpu.model?.includes('Apple') || memory.architecture?.includes('arm64'),
        memoryGB: Math.round(memory.total / (1024 * 1024 * 1024)),
        coreCount: cpu.cores || 1
      };
    } catch (error) {
      console.error('Failed to get device profile:', error);
      return {
        isAppleSilicon: false,
        memoryGB: 8,
        coreCount: 4
      };
    }
  }

  /**
   * Get intelligence statistics
   */
  getStatistics() {
    return {
      ...this.updateStats,
      currentVersion: this.currentIntelligence.version,
      lastUpdated: this.currentIntelligence.lastUpdated,
      appProfilesCount: this.currentIntelligence.appProfiles.size,
      systemStrategiesCount: this.currentIntelligence.systemStrategies.size,
      hasGlobalPatterns: !!this.currentIntelligence.globalPatterns
    };
  }

  /**
   * Force an intelligence update
   */
  async forceUpdate() {
    console.log('🔄 Forcing intelligence update...');
    this.currentIntelligence.version = null; // Reset version to force update
    return await this.checkForUpdates();
  }

  /**
   * Cleanup and shutdown
   */
  shutdown() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    this.cacheIntelligence();
    console.log('🔄 Intelligence Update System shutdown');
  }
}

export default IntelligenceUpdateSystem;
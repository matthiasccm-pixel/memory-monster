/**
 * OS-Specific Strategy Selector
 * Intelligently selects optimization strategies based on detected macOS version and hardware
 * Integrates with existing learning engine and feature gates
 * Version: 1.0.0
 */

import sonomaSystemStrategy from './strategies/system/sonoma-system.js';
import venturaSystemStrategy from './strategies/system/ventura-system.js';
import montereySystemStrategy from './strategies/system/monterey-system.js';
import macosSystemStrategy from './strategies/system/macos-system.js';
import FeatureGate from '../licensing/FeatureGate.js';

class OSStrategySelector {
  constructor() {
    this.featureGate = new FeatureGate();
    this.systemProfile = null;
    this.loadedStrategies = new Map();
    
    // Strategy registry by OS version
    this.strategyRegistry = {
      'Sonoma': sonomaSystemStrategy,
      'Ventura': venturaSystemStrategy,
      'Monterey': montereySystemStrategy,
      'BigSur': macosSystemStrategy, // Fallback to universal
      'Catalina': macosSystemStrategy, // Fallback to universal
      'Universal': macosSystemStrategy // Default fallback
    };
  }

  /**
   * Initialize with system profile from AdaptiveLearningEngine
   */
  async initialize(systemProfile) {
    this.systemProfile = systemProfile;
    
    console.log('🔍 OS Strategy Selector initialized:', {
      osName: systemProfile.os.name,
      osVersion: systemProfile.os.version,
      hardwareType: systemProfile.cpu.hardwareType,
      systemAge: systemProfile.os.systemAge,
      upgradeDetected: systemProfile.os.upgradeDetected
    });

    // Pre-load relevant strategies
    await this.loadOSSpecificStrategies();
    
    return true;
  }

  /**
   * Load OS-specific strategies into memory
   */
  async loadOSSpecificStrategies() {
    try {
      const osName = this.systemProfile.os.name;
      const strategy = this.strategyRegistry[osName] || this.strategyRegistry['Universal'];
      
      this.loadedStrategies.set(osName, strategy);
      
      // Also load fallback strategies
      if (osName !== 'Universal') {
        this.loadedStrategies.set('Universal', this.strategyRegistry['Universal']);
      }
      
      console.log('✅ Loaded OS strategies:', Array.from(this.loadedStrategies.keys()));
      
    } catch (error) {
      console.error('❌ Failed to load OS strategies:', error);
      // Load universal fallback
      this.loadedStrategies.set('Universal', this.strategyRegistry['Universal']);
    }
  }

  /**
   * Get optimal system optimization strategy based on context
   */
  async getOptimalSystemStrategy(context = {}) {
    const osName = this.systemProfile.os.name;
    const strategy = this.loadedStrategies.get(osName) || this.loadedStrategies.get('Universal');
    
    if (!strategy) {
      throw new Error('No system strategy available');
    }

    // Apply contextual filtering
    const contextualStrategy = this.applyContextualRules(strategy, context);
    
    // Apply feature gate restrictions
    const gatedStrategy = await this.applyFeatureGates(contextualStrategy);
    
    console.log('🎯 Selected optimal strategy:', {
      osName,
      selectedStrategy: gatedStrategy.name || 'balanced',
      context: context,
      hasProFeatures: this.featureGate.isPro()
    });

    return gatedStrategy;
  }

  /**
   * Apply contextual rules to select appropriate optimization level
   */
  applyContextualRules(strategy, context) {
    const rules = strategy.contextualRules || {};
    const systemInfo = this.systemProfile;
    let selectedStrategyLevel = 'balanced'; // Default
    
    // System age considerations
    if (rules.systemAge && systemInfo.os.systemAge) {
      const ageRule = rules.systemAge[systemInfo.os.systemAge];
      if (ageRule) {
        if (ageRule.preferConservative) selectedStrategyLevel = 'conservative';
        if (ageRule.allowModerate) selectedStrategyLevel = 'balanced';
        if (ageRule.preferAggressive) selectedStrategyLevel = 'aggressive';
      }
    }

    // Available RAM considerations
    if (rules.availableRAM && systemInfo.memory.memoryGB) {
      const memoryGB = systemInfo.memory.memoryGB;
      let ramCategory = 'adequate';
      if (memoryGB >= 16) ramCategory = 'abundant';
      if (memoryGB <= 8) ramCategory = 'limited';
      
      const ramRule = rules.availableRAM[ramCategory];
      if (ramRule) {
        if (ramRule.preferConservative) selectedStrategyLevel = 'conservative';
        if (ramRule.allowModerate && selectedStrategyLevel === 'conservative') selectedStrategyLevel = 'balanced';
        if (ramRule.allowAggressive) selectedStrategyLevel = 'aggressive';
      }
    }

    // System uptime considerations
    if (rules.uptime && systemInfo.system.uptime) {
      const uptimeDays = systemInfo.system.uptime / (1000 * 60 * 60 * 24);
      let uptimeCategory = 'recent';
      if (uptimeDays > 7) uptimeCategory = 'extended';
      if (uptimeDays > 14) uptimeCategory = 'excessive';
      
      const uptimeRule = rules.uptime[uptimeCategory];
      if (uptimeRule) {
        if (uptimeRule.preferModerate) selectedStrategyLevel = 'balanced';
        if (uptimeRule.preferAggressive) selectedStrategyLevel = 'aggressive';
      }
    }

    // Conservative period after OS upgrade
    if (this.isInConservativePeriod()) {
      selectedStrategyLevel = 'conservative';
      console.log('🛡️ Conservative period active - using safe optimization');
    }

    // Context overrides (user preference, memory pressure, etc.)
    if (context.forceStrategy) {
      selectedStrategyLevel = context.forceStrategy;
    }
    if (context.memoryPressure === 'critical') {
      selectedStrategyLevel = 'aggressive';
    }

    const selectedStrategy = strategy.optimizationStrategies[selectedStrategyLevel];
    return {
      ...selectedStrategy,
      level: selectedStrategyLevel,
      osName: strategy.displayName,
      contextApplied: true
    };
  }

  /**
   * Apply feature gate restrictions based on user's license
   */
  async applyFeatureGates(strategy) {
    const isPro = this.featureGate.isPro();
    const canUseOSOptimizations = this.featureGate.canAccessFeature('os_specific_optimizations');
    const canUseAdvancedStrategies = this.featureGate.canAccessFeature('advanced_system_strategies');
    const canUseSystemDeepOptimization = this.featureGate.canAccessFeature('system_deep_optimization');

    // Free users get limited access
    if (!isPro) {
      // Limit to conservative system optimization only
      if (strategy.level === 'balanced' || strategy.level === 'aggressive') {
        console.log('⚠️ Downgrading to conservative strategy for free user');
        return {
          ...strategy,
          level: 'conservative',
          name: strategy.name + ' (Free Version)',
          actions: strategy.actions?.slice(0, 2) || [], // First 2 actions only
          estimatedSavings: {
            min: Math.floor(strategy.estimatedSavings?.min * 0.4) || 200,
            max: Math.floor(strategy.estimatedSavings?.max * 0.4) || 600,
            unit: 'MB'
          },
          upgradePrompt: this.featureGate.getUpgradePrompt('os_specific_optimizations')
        };
      }
    }

    // Pro users with OS optimization feature
    if (canUseOSOptimizations) {
      // Full access to balanced strategies
      if (strategy.level === 'aggressive' && !canUseAdvancedStrategies) {
        console.log('⚠️ Advanced system strategies require higher tier');
        return {
          ...strategy,
          level: 'balanced',
          upgradePrompt: this.featureGate.getUpgradePrompt('advanced_system_strategies')
        };
      }
    }

    // System deep optimization for highest tier
    if (strategy.level === 'aggressive' && !canUseSystemDeepOptimization) {
      console.log('⚠️ System deep optimization requires premium tier');
      strategy.actions = strategy.actions?.filter(action => 
        !action.type?.includes('reset') && 
        !action.type?.includes('rebuild')
      );
    }

    return strategy;
  }

  /**
   * Check if system is in conservative period after OS upgrade
   */
  isInConservativePeriod() {
    try {
      const conservativePeriod = JSON.parse(localStorage.getItem('conservativePeriod') || '{}');
      if (conservativePeriod.status === 'active') {
        const endDate = new Date(conservativePeriod.endDate);
        return new Date() < endDate;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get system compatibility information
   */
  getSystemCompatibility() {
    const osName = this.systemProfile.os.name;
    const strategy = this.loadedStrategies.get(osName) || this.loadedStrategies.get('Universal');
    
    return {
      osName: osName,
      osVersion: this.systemProfile.os.version,
      strategyAvailable: !!strategy,
      supportedVersions: strategy?.supportedVersions || {},
      hardwareCompatible: this.isHardwareCompatible(strategy),
      featureAccess: {
        osSpecificOptimizations: this.featureGate.canAccessFeature('os_specific_optimizations'),
        advancedSystemStrategies: this.featureGate.canAccessFeature('advanced_system_strategies'),
        systemDeepOptimization: this.featureGate.canAccessFeature('system_deep_optimization')
      }
    };
  }

  /**
   * Check hardware compatibility
   */
  isHardwareCompatible(strategy) {
    if (!strategy || !strategy.memoryProfile) return true;
    
    const memoryGB = this.systemProfile.memory.memoryGB;
    const minMemoryGB = Math.floor(strategy.memoryProfile.baseSystem.min / 1024);
    
    return memoryGB >= minMemoryGB;
  }

  /**
   * Get available optimization levels for current system
   */
  getAvailableOptimizationLevels() {
    const osName = this.systemProfile.os.name;
    const strategy = this.loadedStrategies.get(osName) || this.loadedStrategies.get('Universal');
    
    if (!strategy || !strategy.optimizationStrategies) {
      return ['conservative'];
    }

    const levels = Object.keys(strategy.optimizationStrategies);
    const availableLevels = [];

    levels.forEach(level => {
      const levelStrategy = strategy.optimizationStrategies[level];
      
      // Check feature gate access
      if (level === 'conservative') {
        availableLevels.push({
          level,
          name: levelStrategy.name,
          description: levelStrategy.description,
          available: true
        });
      } else if (level === 'balanced') {
        availableLevels.push({
          level,
          name: levelStrategy.name, 
          description: levelStrategy.description,
          available: this.featureGate.canAccessFeature('os_specific_optimizations'),
          requiresUpgrade: !this.featureGate.canAccessFeature('os_specific_optimizations')
        });
      } else if (level === 'aggressive') {
        availableLevels.push({
          level,
          name: levelStrategy.name,
          description: levelStrategy.description,
          available: this.featureGate.canAccessFeature('advanced_system_strategies'),
          requiresUpgrade: !this.featureGate.canAccessFeature('advanced_system_strategies')
        });
      }
    });

    return availableLevels;
  }

  /**
   * Get system monitoring configuration
   */
  getSystemMonitoringConfig() {
    const osName = this.systemProfile.os.name;
    const strategy = this.loadedStrategies.get(osName) || this.loadedStrategies.get('Universal');
    
    return strategy?.monitoring || {
      continuousMetrics: ['memoryPressure', 'thermalState'],
      periodicChecks: ['systemCacheSize'],
      alertThresholds: {
        criticalMemoryPressure: 0.9,
        excessiveSystemCache: 3000
      }
    };
  }
}

export default OSStrategySelector;
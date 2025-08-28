/**
 * Strategy Loader
 * Combines base strategies + learned improvements + personal preferences
 * Implements the hybrid architecture from the optimization strategy document
 */

import chromeStrategy from '../strategies/base/browsers/chrome.js';
import safariStrategy from '../strategies/base/browsers/safari.js';
import slackStrategy from '../strategies/base/communication/slack.js';

class StrategyLoader {
  constructor() {
    this.baseStrategies = new Map();
    this.learnedStrategies = new Map();
    this.personalPreferences = new Map();
    this.combinedStrategies = new Map();
    
    this.config = {
      // Strategy combination weights
      weights: {
        base: 0.4,        // 40% base strategy
        learned: 0.4,     // 40% learned improvements  
        personal: 0.2     // 20% personal preferences
      },
      
      // Safety constraints
      safety: {
        maxMemoryThreshold: 8000,    // Never exceed 8GB threshold
        maxProcessKillCount: 10,     // Never kill more than 10 processes
        maxCacheCleanSize: 5000,     // Never clean more than 5GB cache
        requireUserConfirmation: ['aggressive'], // Strategies requiring confirmation
      },
      
      // Update intervals
      updateIntervals: {
        learned: 24 * 60 * 60 * 1000,    // Check for learned updates daily
        personal: 60 * 60 * 1000,        // Update personal preferences hourly
      }
    };
    
    this.isInitialized = false;
    this.lastUpdate = {
      learned: 0,
      personal: 0
    };
  }

  /**
   * Initialize the strategy loader with all strategy layers
   */
  async initialize() {
    try {
      console.log('🔄 Initializing StrategyLoader...');
      
      // 1. Load base strategies (hardcoded, always available)
      await this.loadBaseStrategies();
      
      // 2. Load learned strategies from cloud (if available)
      await this.loadLearnedStrategies();
      
      // 3. Load personal preferences from local storage
      await this.loadPersonalPreferences();
      
      // 4. Combine all strategies into final optimized versions
      await this.combineStrategies();
      
      this.isInitialized = true;
      console.log('✅ StrategyLoader initialized with', this.combinedStrategies.size, 'app strategies');
      
      // Start update timers
      this.startUpdateTimers();
      
    } catch (error) {
      console.error('❌ Failed to initialize StrategyLoader:', error);
      // Fall back to base strategies only
      this.combineStrategies(); 
      this.isInitialized = true;
    }
  }

  /**
   * Load base strategies (hardcoded, version-controlled)
   */
  async loadBaseStrategies() {
    console.log('📁 Loading base strategies...');
    
    // Load core strategies - these are always available
    this.baseStrategies.set('com.google.Chrome', chromeStrategy);
    this.baseStrategies.set('com.apple.Safari', safariStrategy);
    this.baseStrategies.set('com.tinyspeck.slackmacgap', slackStrategy);
    
    // TODO: Load additional base strategies dynamically
    // const baseStrategyFiles = await this.findBaseStrategyFiles();
    // for (const file of baseStrategyFiles) {
    //   const strategy = await import(file);
    //   this.baseStrategies.set(strategy.appId, strategy);
    // }
    
    console.log(`✅ Loaded ${this.baseStrategies.size} base strategies`);
  }

  /**
   * Load learned strategies from cloud database
   */
  async loadLearnedStrategies() {
    try {
      console.log('☁️ Loading learned strategies from cloud...');
      
      // Check if we need to update learned strategies
      const now = Date.now();
      if (now - this.lastUpdate.learned < this.config.updateIntervals.learned) {
        console.log('⏭️ Learned strategies are up to date');
        return;
      }
      
      // Fetch learned strategies from cloud
      const learnedData = await this.fetchLearnedStrategiesFromCloud();
      
      if (learnedData && learnedData.strategies) {
        for (const [appId, learnedStrategy] of Object.entries(learnedData.strategies)) {
          // Validate learned strategy before applying
          if (this.validateLearnedStrategy(learnedStrategy)) {
            this.learnedStrategies.set(appId, learnedStrategy);
          }
        }
        
        this.lastUpdate.learned = now;
        console.log(`✅ Loaded ${this.learnedStrategies.size} learned strategies`);
      }
      
    } catch (error) {
      console.warn('⚠️ Could not load learned strategies, using base only:', error.message);
    }
  }

  /**
   * Load personal preferences from local storage
   */
  async loadPersonalPreferences() {
    try {
      console.log('👤 Loading personal preferences...');
      
      const personalData = localStorage.getItem('memory_monster_personal_strategies');
      if (personalData) {
        const preferences = JSON.parse(personalData);
        
        for (const [appId, preference] of Object.entries(preferences)) {
          this.personalPreferences.set(appId, preference);
        }
        
        console.log(`✅ Loaded ${this.personalPreferences.size} personal preferences`);
      }
      
    } catch (error) {
      console.warn('⚠️ Could not load personal preferences:', error.message);
    }
  }

  /**
   * Combine base + learned + personal strategies into optimized final strategies
   */
  async combineStrategies() {
    console.log('🔧 Combining strategy layers...');
    
    // Start with all apps that have base strategies
    for (const [appId, baseStrategy] of this.baseStrategies.entries()) {
      const learnedStrategy = this.learnedStrategies.get(appId);
      const personalPrefs = this.personalPreferences.get(appId);
      
      const combinedStrategy = this.mergeStrategyLayers(baseStrategy, learnedStrategy, personalPrefs);
      this.combinedStrategies.set(appId, combinedStrategy);
    }
    
    console.log(`✅ Combined ${this.combinedStrategies.size} strategies`);
  }

  /**
   * Merge three strategy layers using weighted combination
   */
  mergeStrategyLayers(baseStrategy, learnedStrategy, personalPrefs) {
    // Start with base strategy as foundation
    let combinedStrategy = JSON.parse(JSON.stringify(baseStrategy)); // Deep clone
    
    // Apply learned improvements
    if (learnedStrategy) {
      combinedStrategy = this.applyLearnedImprovements(combinedStrategy, learnedStrategy);
    }
    
    // Apply personal preferences
    if (personalPrefs) {
      combinedStrategy = this.applyPersonalPreferences(combinedStrategy, personalPrefs);
    }
    
    // Apply safety constraints
    combinedStrategy = this.applySafetyConstraints(combinedStrategy);
    
    // Add metadata
    combinedStrategy.metadata = {
      hasLearned: !!learnedStrategy,
      hasPersonal: !!personalPrefs,
      combinedAt: new Date().toISOString(),
      version: this.generateVersionString(baseStrategy, learnedStrategy, personalPrefs)
    };
    
    return combinedStrategy;
  }

  /**
   * Apply learned improvements to base strategy
   */
  applyLearnedImprovements(baseStrategy, learnedStrategy) {
    const improved = { ...baseStrategy };
    
    // Apply learned threshold adjustments
    if (learnedStrategy.thresholdAdjustments) {
      for (const [threshold, adjustment] of Object.entries(learnedStrategy.thresholdAdjustments)) {
        if (improved.memoryProfile[threshold]) {
          improved.memoryProfile[threshold] += adjustment;
        }
      }
    }
    
    // Apply learned strategy effectiveness improvements
    if (learnedStrategy.strategyImprovements) {
      for (const strategyType of ['conservative', 'balanced', 'aggressive']) {
        if (learnedStrategy.strategyImprovements[strategyType]) {
          const improvement = learnedStrategy.strategyImprovements[strategyType];
          
          // Update estimated savings based on learned data
          if (improvement.estimatedSavings) {
            improved.optimizationStrategies[strategyType].estimatedSavings = {
              ...improved.optimizationStrategies[strategyType].estimatedSavings,
              ...improvement.estimatedSavings
            };
          }
          
          // Add new actions discovered through learning
          if (improvement.newActions) {
            improved.optimizationStrategies[strategyType].actions.push(...improvement.newActions);
          }
        }
      }
    }
    
    // Apply learned contextual rules
    if (learnedStrategy.contextualImprovements) {
      improved.contextualRules = {
        ...improved.contextualRules,
        ...learnedStrategy.contextualImprovements
      };
    }
    
    return improved;
  }

  /**
   * Apply personal user preferences
   */
  applyPersonalPreferences(strategy, personalPrefs) {
    const personalized = { ...strategy };
    
    // Apply user's preferred strategies
    if (personalPrefs.preferredStrategies) {
      personalPrefs.preferredStrategies.forEach(strategyType => {
        // Boost preferred strategy effectiveness
        personalized.contextualRules.userPreference = {
          preferred: strategyType,
          boost: 1.1 // 10% boost to preferred strategy
        };
      });
    }
    
    // Apply user's time preferences
    if (personalPrefs.timePreferences) {
      personalized.contextualRules.timeOfDay = {
        ...personalized.contextualRules.timeOfDay,
        ...personalPrefs.timePreferences
      };
    }
    
    // Apply user's risk tolerance
    if (personalPrefs.riskTolerance) {
      const tolerance = personalPrefs.riskTolerance;
      if (tolerance === 'low') {
        // Make aggressive strategy harder to trigger
        personalized.contextualRules.systemLoad.high = { onlyConservative: true };
      } else if (tolerance === 'high') {
        // Allow aggressive strategies more often
        personalized.contextualRules.systemLoad.medium = { allowAggressive: true };
      }
    }
    
    return personalized;
  }

  /**
   * Apply safety constraints to prevent dangerous operations
   */
  applySafetyConstraints(strategy) {
    const safeStrategy = { ...strategy };
    
    // Ensure no strategy exceeds safety limits
    Object.values(safeStrategy.optimizationStrategies).forEach(strategyType => {
      strategyType.actions.forEach(action => {
        // Limit process kill counts
        if (action.type === 'killProcesses' && action.maxProcesses) {
          action.maxProcesses = Math.min(action.maxProcesses, this.config.safety.maxProcessKillCount);
        }
        
        // Limit cache cleaning size
        if (action.type === 'clearCache' && action.maxSize) {
          action.maxSize = Math.min(action.maxSize, this.config.safety.maxCacheCleanSize);
        }
      });
    });
    
    // Add safety metadata
    safeStrategy.safetyConstraints = {
      maxMemoryThreshold: this.config.safety.maxMemoryThreshold,
      maxProcessKillCount: this.config.safety.maxProcessKillCount,
      maxCacheCleanSize: this.config.safety.maxCacheCleanSize
    };
    
    return safeStrategy;
  }

  /**
   * Get strategy for a specific app
   */
  getStrategyForApp(appId) {
    if (!this.isInitialized) {
      console.warn('⚠️ StrategyLoader not initialized, using base strategy');
      return this.baseStrategies.get(appId);
    }
    
    return this.combinedStrategies.get(appId) || this.baseStrategies.get(appId);
  }

  /**
   * Get all available app strategies
   */
  getAllStrategies() {
    return this.isInitialized ? this.combinedStrategies : this.baseStrategies;
  }

  /**
   * Update personal preference for an app
   */
  updatePersonalPreference(appId, preference) {
    this.personalPreferences.set(appId, preference);
    
    // Save to local storage
    const allPrefs = {};
    for (const [id, pref] of this.personalPreferences.entries()) {
      allPrefs[id] = pref;
    }
    localStorage.setItem('memory_monster_personal_strategies', JSON.stringify(allPrefs));
    
    // Re-combine strategies for this app
    const baseStrategy = this.baseStrategies.get(appId);
    const learnedStrategy = this.learnedStrategies.get(appId);
    const combinedStrategy = this.mergeStrategyLayers(baseStrategy, learnedStrategy, preference);
    this.combinedStrategies.set(appId, combinedStrategy);
    
    console.log('✅ Updated personal preference for', appId);
  }

  /**
   * Fetch learned strategies from cloud database
   */
  async fetchLearnedStrategiesFromCloud() {
    try {
      // This would connect to the approval pipeline API
      const response = await fetch('/api/learning/approved-strategies', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Could not fetch learned strategies:', error);
      return null;
    }
  }

  /**
   * Validate learned strategy before applying
   */
  validateLearnedStrategy(learnedStrategy) {
    // Basic validation to ensure learned strategy is safe
    if (!learnedStrategy || typeof learnedStrategy !== 'object') {
      return false;
    }
    
    // Check for required safety fields
    if (learnedStrategy.version && learnedStrategy.validatedAt) {
      return true;
    }
    
    return false;
  }

  /**
   * Generate version string for combined strategy
   */
  generateVersionString(baseStrategy, learnedStrategy, personalPrefs) {
    const base = baseStrategy.version || '1.0.0';
    const learned = learnedStrategy?.version || '0.0.0';
    const personal = personalPrefs ? '1.0.0' : '0.0.0';
    
    return `${base}+${learned}+${personal}`;
  }

  /**
   * Start timers for updating strategies
   */
  startUpdateTimers() {
    // Check for learned strategy updates daily
    setInterval(async () => {
      await this.loadLearnedStrategies();
      await this.combineStrategies();
    }, this.config.updateIntervals.learned);
    
    // Update personal preferences hourly (in case user changes settings)
    setInterval(async () => {
      await this.loadPersonalPreferences();
      await this.combineStrategies();
    }, this.config.updateIntervals.personal);
  }

  /**
   * Get loader statistics
   */
  getStats() {
    return {
      isInitialized: this.isInitialized,
      strategyCounts: {
        base: this.baseStrategies.size,
        learned: this.learnedStrategies.size,
        personal: this.personalPreferences.size,
        combined: this.combinedStrategies.size
      },
      lastUpdate: this.lastUpdate
    };
  }
}

export default StrategyLoader;
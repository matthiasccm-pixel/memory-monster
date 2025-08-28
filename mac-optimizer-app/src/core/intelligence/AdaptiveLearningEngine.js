/**
 * Adaptive Learning Engine for Mac Optimization
 * Captures real optimization data, learns patterns, and improves strategies over time
 */

import ComprehensiveAppDatabase from './ComprehensiveAppDatabase.js';
import FeatureGate from '../licensing/FeatureGate.js';
import settingsManager from '../../utils/settingsManager.js';

class AdaptiveLearningEngine {
  constructor() {
    this.appDatabase = new ComprehensiveAppDatabase();
    this.featureGate = new FeatureGate();
    
    // Local learning data storage
    this.sessionId = this.generateSessionId();
    this.systemProfile = null;
    this.learningData = {
      optimizationPatterns: new Map(),
      appBehaviorProfiles: new Map(),
      systemResponsePatterns: new Map(),
      userPreferences: new Map(),
      effectivenessMetrics: new Map()
    };
    
    // Background monitoring
    this.monitoringInterval = null;
    this.lastSystemSnapshot = null;
    this.continuousDataPoints = [];
    
    // Learning thresholds and parameters
    this.config = {
      minSamplesForPattern: 5,
      confidenceThreshold: 0.7,
      learningRate: 0.1,
      adaptationPeriod: 24 * 60 * 60 * 1000, // 24 hours
      maxDataPoints: 1000,
      backgroundMonitoringInterval: 5 * 60 * 1000 // 5 minutes
    };
  }

  /**
   * Initialize the learning engine
   */
  async initialize() {
    console.log('🧠 Initializing Adaptive Learning Engine...');
    
    try {
      // Get system baseline
      this.systemProfile = await this.createSystemProfile();
      
      // Load existing learning data
      await this.loadLearningData();
      
      // Start background monitoring
      this.startBackgroundMonitoring();
      
      console.log('✅ Learning engine initialized', {
        sessionId: this.sessionId,
        systemProfile: this.systemProfile,
        learningDataSize: this.continuousDataPoints.length
      });
      
      // Fetch latest intelligence updates from the cloud if user enabled it
      const receiveUpdates = settingsManager.get('receiveIntelligenceUpdates') !== false;
      if (receiveUpdates) {
        console.log('🔄 Checking for intelligence updates...');
        try {
          const intelligenceUpdate = await this.fetchIntelligenceUpdates();
          if (intelligenceUpdate) {
            console.log('🧠 Applied latest intelligence updates');
          }
        } catch (error) {
          console.warn('⚠️ Failed to fetch intelligence updates, continuing with local data:', error);
        }
      } else {
        console.log('📡 Intelligence updates disabled by user settings');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize learning engine:', error);
      return false;
    }
  }

  /**
   * Create comprehensive system profile for personalization with enhanced OS detection
   */
  async createSystemProfile() {
    try {
      const [memory, cpu, hardware, osInfo] = await Promise.all([
        window.electronAPI.getSystemMemory(),
        window.electronAPI.getSystemCPU(),
        window.electronAPI.getSystemHardware(),
        this.getDetailedOSInfo()
      ]);

      const systemProfile = {
        memory: {
          total: memory.total,
          available: memory.free + memory.inactive,
          architecture: memory.architecture || 'unknown',
          isAppleSilicon: memory.architecture?.includes('arm64') || false,
          memoryGB: Math.round(memory.total / (1024 * 1024 * 1024))
        },
        cpu: {
          model: cpu.model || 'unknown',
          cores: cpu.cores || 1,
          isAppleSilicon: cpu.model?.includes('Apple') || cpu.model?.includes('M1') || cpu.model?.includes('M2') || cpu.model?.includes('M3') || false,
          hardwareType: this.determineHardwareType(cpu.model, memory.architecture)
        },
        os: {
          platform: process.platform,
          release: process.release,
          name: osInfo.name,
          version: osInfo.version,
          major: osInfo.major,
          minor: osInfo.minor,
          patch: osInfo.patch,
          buildNumber: osInfo.buildNumber,
          systemAge: osInfo.systemAge,
          upgradeDetected: osInfo.upgradeDetected
        },
        system: {
          uptime: osInfo.uptime,
          bootTime: osInfo.bootTime,
          thermalState: 'nominal', // Will be populated by system monitoring
          lastOptimization: null,
          optimizationHistory: []
        },
        timestamp: new Date().toISOString(),
        deviceId: this.featureGate.getDeviceId()
      };

      // Check for OS upgrade since last run
      await this.checkForOSUpgrade(systemProfile);

      return systemProfile;
    } catch (error) {
      console.error('Failed to create system profile:', error);
      return this.getDefaultSystemProfile();
    }
  }

  /**
   * Get detailed macOS version information
   */
  async getDetailedOSInfo() {
    try {
      // Get system version information
      const osVersion = process.getSystemVersion ? process.getSystemVersion() : '14.0.0';
      const versionParts = osVersion.split('.');
      const major = parseInt(versionParts[0]) || 14;
      const minor = parseInt(versionParts[1]) || 0;
      const patch = parseInt(versionParts[2]) || 0;

      // Map version to macOS name
      const osName = this.getMacOSName(major, minor);

      // Get system uptime and boot time
      const uptime = process.uptime ? process.uptime() * 1000 : 0;
      const bootTime = Date.now() - uptime;

      // Calculate system age (simplified - would use install date in real implementation)
      const systemAge = this.calculateSystemAge(bootTime);

      // Check for recent OS upgrade
      const upgradeDetected = await this.detectRecentOSUpgrade(major, minor);

      return {
        name: osName,
        version: osVersion,
        major,
        minor, 
        patch,
        buildNumber: this.getBuildNumber(),
        systemAge,
        upgradeDetected,
        uptime,
        bootTime
      };
    } catch (error) {
      console.error('Failed to get detailed OS info:', error);
      return {
        name: 'Sonoma',
        version: '14.0.0',
        major: 14,
        minor: 0,
        patch: 0,
        buildNumber: 'Unknown',
        systemAge: 'unknown',
        upgradeDetected: false,
        uptime: 0,
        bootTime: Date.now()
      };
    }
  }

  /**
   * Map macOS version to name
   */
  getMacOSName(major, minor) {
    const versionMap = {
      15: 'Sequoia',
      14: 'Sonoma', 
      13: 'Ventura',
      12: 'Monterey',
      11: 'Big Sur',
      10: minor >= 15 ? 'Catalina' : minor >= 14 ? 'Mojave' : minor >= 13 ? 'High Sierra' : 'Sierra'
    };
    return versionMap[major] || 'Unknown';
  }

  /**
   * Determine hardware type for optimization strategies
   */
  determineHardwareType(cpuModel, architecture) {
    if (cpuModel?.includes('Apple') || cpuModel?.includes('M1') || cpuModel?.includes('M2') || cpuModel?.includes('M3') || architecture?.includes('arm64')) {
      return 'AppleSilicon';
    }
    if (cpuModel?.includes('Intel')) {
      return 'Intel';
    }
    return 'Unknown';
  }

  /**
   * Calculate system age category
   */
  calculateSystemAge(bootTime) {
    const daysSinceInstall = Math.floor((Date.now() - bootTime) / (1000 * 60 * 60 * 24));
    
    if (daysSinceInstall < 30) return 'fresh';
    if (daysSinceInstall < 180) return 'established'; 
    return 'mature';
  }

  /**
   * Get system build number
   */
  getBuildNumber() {
    try {
      // Would get actual build number in real implementation
      return process.env.SYSTEM_BUILD || 'Unknown';
    } catch (error) {
      return 'Unknown';
    }
  }

  /**
   * Detect recent OS upgrade
   */
  async detectRecentOSUpgrade(currentMajor, currentMinor) {
    try {
      const lastKnownVersion = localStorage.getItem('lastKnownOSVersion');
      const currentVersion = `${currentMajor}.${currentMinor}`;
      
      if (lastKnownVersion && lastKnownVersion !== currentVersion) {
        console.log('🔄 OS upgrade detected:', lastKnownVersion, '->', currentVersion);
        
        // Store the upgrade information
        const upgradeInfo = {
          fromVersion: lastKnownVersion,
          toVersion: currentVersion,
          upgradeDate: new Date().toISOString(),
          migrationStatus: 'pending'
        };
        
        localStorage.setItem('osUpgradeInfo', JSON.stringify(upgradeInfo));
        localStorage.setItem('lastKnownOSVersion', currentVersion);
        
        return true;
      } else if (!lastKnownVersion) {
        // First run, store current version
        localStorage.setItem('lastKnownOSVersion', currentVersion);
      }
      
      return false;
    } catch (error) {
      console.error('Failed to detect OS upgrade:', error);
      return false;
    }
  }

  /**
   * Check for and handle OS upgrade
   */
  async checkForOSUpgrade(systemProfile) {
    if (systemProfile.os.upgradeDetected) {
      console.log('🔄 Processing OS upgrade...');
      
      // Trigger OS migration process
      await this.handleOSUpgrade(systemProfile);
    }
  }

  /**
   * Handle OS upgrade migration
   */
  async handleOSUpgrade(systemProfile) {
    try {
      const upgradeInfo = JSON.parse(localStorage.getItem('osUpgradeInfo') || '{}');
      
      // Archive old technical learning data  
      await this.archiveTechnicalLearning(upgradeInfo.fromVersion);
      
      // Preserve behavioral learning patterns
      await this.preserveBehavioralLearning();
      
      // Enter conservative period for new OS
      await this.enterConservativePeriod(systemProfile.os.name);
      
      // Update migration status
      upgradeInfo.migrationStatus = 'completed';
      upgradeInfo.completedAt = new Date().toISOString();
      localStorage.setItem('osUpgradeInfo', JSON.stringify(upgradeInfo));
      
      console.log('✅ OS upgrade migration completed');
      
    } catch (error) {
      console.error('❌ OS upgrade migration failed:', error);
    }
  }

  /**
   * Archive technical learning data when OS changes
   */
  async archiveTechnicalLearning(oldVersion) {
    try {
      const technicalData = localStorage.getItem('technicalLearningData');
      if (technicalData) {
        const archiveKey = `technicalLearning_archived_${oldVersion}_${Date.now()}`;
        localStorage.setItem(archiveKey, technicalData);
        localStorage.removeItem('technicalLearningData');
        console.log('📦 Technical learning data archived for', oldVersion);
      }
    } catch (error) {
      console.error('Failed to archive technical learning:', error);
    }
  }

  /**
   * Preserve behavioral learning patterns across OS upgrades
   */
  async preserveBehavioralLearning() {
    try {
      // Behavioral patterns should survive OS upgrades
      const behavioralData = this.learningData.appBehaviorProfiles;
      const preservedPatterns = new Map();
      
      behavioralData.forEach((profile, appId) => {
        // Keep usage patterns but reset OS-specific technical data
        preservedPatterns.set(appId, {
          usagePatterns: profile.usagePatterns || {},
          userPreferences: profile.userPreferences || {},
          effectiveStrategies: profile.effectiveStrategies || new Map(),
          // Reset technical data
          optimizationHistory: [],
          lastOptimized: null
        });
      });
      
      this.learningData.appBehaviorProfiles = preservedPatterns;
      console.log('💾 Behavioral learning patterns preserved');
      
    } catch (error) {
      console.error('Failed to preserve behavioral learning:', error);
    }
  }

  /**
   * Enter conservative period after OS upgrade
   */
  async enterConservativePeriod(osName) {
    try {
      const conservativePeriod = {
        startDate: new Date().toISOString(),
        osName: osName,
        endDate: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString(), // 7 days
        preferredStrategy: 'conservative',
        learningRate: 0.3, // Reduced learning rate
        status: 'active'
      };
      
      localStorage.setItem('conservativePeriod', JSON.stringify(conservativePeriod));
      console.log('🛡️ Entered conservative period for', osName);
      
    } catch (error) {
      console.error('Failed to enter conservative period:', error);
    }
  }

  /**
   * Default system profile fallback
   */
  getDefaultSystemProfile() {
    return {
      memory: { total: 0, available: 0, architecture: 'unknown', isAppleSilicon: false, memoryGB: 8 },
      cpu: { model: 'unknown', cores: 1, isAppleSilicon: false, hardwareType: 'Unknown' },
      os: { 
        platform: process.platform, 
        release: process.release,
        name: 'Sonoma',
        version: '14.0.0',
        major: 14,
        minor: 0, 
        patch: 0,
        buildNumber: 'Unknown',
        systemAge: 'unknown',
        upgradeDetected: false
      },
      system: {
        uptime: 0,
        bootTime: Date.now(),
        thermalState: 'nominal',
        lastOptimization: null,
        optimizationHistory: []
      },
      timestamp: new Date().toISOString(),
      deviceId: this.featureGate.getDeviceId()
    };
  }

  /**
   * Start background system monitoring
   */
  startBackgroundMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(async () => {
      try {
        const dataPoint = await this.captureSystemDataPoint();
        this.processContinuousData(dataPoint);
      } catch (error) {
        console.error('Background monitoring error:', error);
      }
    }, this.config.backgroundMonitoringInterval);

    console.log('📊 Background monitoring started');
  }

  /**
   * Capture detailed system data point
   */
  async captureSystemDataPoint() {
    try {
      const [memory, processes, systemLoad] = await Promise.all([
        window.electronAPI.getSystemMemory(),
        window.electronAPI.getDetailedProcesses(),
        window.electronAPI.getSystemCPU()
      ]);

      const timestamp = Date.now();
      
      // Analyze running apps
      const activeApps = this.analyzeActiveApplications(processes);
      const memoryPressure = this.calculateMemoryPressure(memory);
      
      const dataPoint = {
        timestamp,
        sessionId: this.sessionId,
        system: {
          memory: {
            used: memory.used,
            free: memory.free,
            pressure: memoryPressure.level,
            pressureScore: memoryPressure.score
          },
          cpu: {
            usage: 100 - (systemLoad.idle || 0),
            loadAverage: systemLoad.loadAverage || [0, 0, 0]
          }
        },
        applications: activeApps.map(app => ({
          id: app.id,
          name: app.name,
          memory: app.memory,
          cpu: app.cpu,
          processCount: app.processCount,
          category: this.categorizeApplication(app.id)
        })),
        patterns: {
          topMemoryConsumers: activeApps.slice(0, 5).map(app => ({
            id: app.id,
            memory: app.memory
          })),
          systemStress: memoryPressure.score > 70 ? 'high' : memoryPressure.score > 40 ? 'medium' : 'low'
        }
      };

      return dataPoint;
    } catch (error) {
      console.error('Failed to capture system data point:', error);
      return null;
    }
  }

  /**
   * Process continuous monitoring data for pattern recognition
   */
  processContinuousData(dataPoint) {
    if (!dataPoint) return;

    // Add to continuous data
    this.continuousDataPoints.push(dataPoint);

    // Limit data size
    if (this.continuousDataPoints.length > this.config.maxDataPoints) {
      this.continuousDataPoints.shift();
    }

    // Analyze patterns if we have enough data
    if (this.continuousDataPoints.length >= this.config.minSamplesForPattern) {
      this.analyzeApplicationPatterns();
      this.detectSystemPatterns();
    }

    // Save learning data periodically
    if (this.continuousDataPoints.length % 50 === 0) {
      this.saveLearningData();
    }
  }

  /**
   * Learn from optimization results
   */
  async learnFromOptimization(optimizationResult) {
    console.log('🎓 Learning from optimization result...');
    
    try {
      const learningPoint = {
        timestamp: Date.now(),
        sessionId: this.sessionId,
        systemBefore: optimizationResult.systemBefore,
        systemAfter: optimizationResult.systemAfter,
        strategy: optimizationResult.strategy,
        optimizations: optimizationResult.optimizations,
        memoryFreed: optimizationResult.totalMemoryFreedMB,
        speedGain: optimizationResult.totalSpeedGain,
        effectiveness: this.calculateOptimizationEffectiveness(optimizationResult),
        context: {
          timeOfDay: new Date().getHours(),
          dayOfWeek: new Date().getDay(),
          systemLoad: await this.getCurrentSystemLoad()
        }
      };

      // Store in local learning data
      await this.storeOptimizationLearning(learningPoint);
      
      // Update app-specific patterns
      this.updateAppLearningPatterns(optimizationResult);
      
      // Send to cloud for collective intelligence
      await this.sendLearningDataToCloud(learningPoint);
      
      console.log('✅ Learning completed', {
        effectiveness: learningPoint.effectiveness,
        memoryFreed: learningPoint.memoryFreed,
        patterns: optimizationResult.optimizations.length
      });

    } catch (error) {
      console.error('❌ Learning failed:', error);
    }
  }

  /**
   * Calculate optimization effectiveness score
   */
  calculateOptimizationEffectiveness(result) {
    const memoryScore = Math.min(result.totalMemoryFreedMB / 1000, 1); // Normalize to 1000MB
    const speedScore = Math.min(result.totalSpeedGain / 50, 1); // Normalize to 50%
    const errorPenalty = result.errors.length * 0.1;
    
    const effectiveness = (memoryScore * 0.6 + speedScore * 0.4) * (1 - errorPenalty);
    return Math.max(0, Math.min(1, effectiveness));
  }

  /**
   * Store optimization learning for future use
   */
  async storeOptimizationLearning(learningPoint) {
    const strategy = learningPoint.strategy;
    
    if (!this.learningData.optimizationPatterns.has(strategy)) {
      this.learningData.optimizationPatterns.set(strategy, []);
    }
    
    this.learningData.optimizationPatterns.get(strategy).push(learningPoint);
    
    // Update effectiveness metrics
    this.updateEffectivenessMetrics(strategy, learningPoint.effectiveness);
  }

  /**
   * Update app-specific learning patterns
   */
  updateAppLearningPatterns(optimizationResult) {
    optimizationResult.optimizations.forEach(optimization => {
      if (optimization.appId) {
        const appId = optimization.appId;
        
        if (!this.learningData.appBehaviorProfiles.has(appId)) {
          this.learningData.appBehaviorProfiles.set(appId, {
            optimizationHistory: [],
            effectiveStrategies: new Map(),
            memoryPatterns: [],
            lastOptimized: null
          });
        }
        
        const profile = this.learningData.appBehaviorProfiles.get(appId);
        profile.optimizationHistory.push({
          timestamp: Date.now(),
          memoryFreed: optimization.memoryFreedMB,
          actions: optimization.actions,
          effectiveness: optimization.memoryFreedMB > 100 ? 'high' : 'medium'
        });
        
        profile.lastOptimized = Date.now();
      }
    });
  }

  /**
   * Analyze patterns in application behavior
   */
  analyzeApplicationPatterns() {
    const recentData = this.continuousDataPoints.slice(-100); // Last 100 data points
    
    // Group by application
    const appPatterns = new Map();
    
    recentData.forEach(dataPoint => {
      dataPoint.applications.forEach(app => {
        if (!appPatterns.has(app.id)) {
          appPatterns.set(app.id, {
            memoryUsages: [],
            cpuUsages: [],
            appearances: 0
          });
        }
        
        const pattern = appPatterns.get(app.id);
        pattern.memoryUsages.push(app.memory);
        pattern.cpuUsages.push(app.cpu || 0);
        pattern.appearances++;
      });
    });

    // Detect problematic patterns
    appPatterns.forEach((pattern, appId) => {
      if (pattern.appearances >= 5) {
        const avgMemory = pattern.memoryUsages.reduce((a, b) => a + b, 0) / pattern.memoryUsages.length;
        const memoryTrend = this.calculateTrend(pattern.memoryUsages);
        
        if (memoryTrend > 0.1 && avgMemory > 500) { // Growing memory usage
          this.flagApplicationConcern(appId, 'memory_leak', {
            averageMemory: avgMemory,
            trend: memoryTrend,
            confidence: Math.min(pattern.appearances / 20, 1)
          });
        }
      }
    });
  }

  /**
   * Detect system-wide patterns
   */
  detectSystemPatterns() {
    const recentData = this.continuousDataPoints.slice(-50);
    
    if (recentData.length < 10) return;
    
    // Memory pressure patterns
    const pressureScores = recentData.map(d => d.system.memory.pressureScore);
    const avgPressure = pressureScores.reduce((a, b) => a + b, 0) / pressureScores.length;
    const pressureTrend = this.calculateTrend(pressureScores);
    
    // System load patterns
    const cpuUsages = recentData.map(d => d.system.cpu.usage);
    const avgCpu = cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length;
    
    // Update system patterns
    this.learningData.systemResponsePatterns.set('memory_pressure', {
      average: avgPressure,
      trend: pressureTrend,
      lastUpdated: Date.now()
    });
    
    this.learningData.systemResponsePatterns.set('cpu_usage', {
      average: avgCpu,
      trend: this.calculateTrend(cpuUsages),
      lastUpdated: Date.now()
    });
  }

  /**
   * Get adaptive recommendations based on learning
   */
  async getAdaptiveRecommendations() {
    const recommendations = [];
    
    try {
      // System-based recommendations
      const systemPatterns = this.learningData.systemResponsePatterns;
      const memoryPattern = systemPatterns.get('memory_pressure');
      
      if (memoryPattern && memoryPattern.average > 70) {
        const strategy = await this.selectOptimalStrategy(memoryPattern);
        recommendations.push({
          type: 'system_optimization',
          priority: 'high',
          title: 'Memory Pressure Detected',
          description: `System memory pressure at ${memoryPattern.average.toFixed(1)}%`,
          action: `Run ${strategy} optimization`,
          confidence: this.calculateConfidence(memoryPattern),
          learnedFrom: 'continuous_monitoring'
        });
      }

      // App-specific recommendations
      const appConcerns = this.getApplicationConcerns();
      appConcerns.forEach(concern => {
        if (concern.confidence > this.config.confidenceThreshold) {
          const profile = this.appDatabase.getProfile(concern.appId);
          recommendations.push({
            type: 'app_optimization',
            priority: 'medium',
            title: `${profile?.displayName || concern.appId} Performance Issue`,
            description: concern.description,
            action: `Optimize ${profile?.displayName || concern.appId}`,
            confidence: concern.confidence,
            learnedFrom: 'pattern_analysis'
          });
        }
      });

      // Preventive recommendations based on history
      const preventive = await this.getPreventiveRecommendations();
      recommendations.push(...preventive);

    } catch (error) {
      console.error('Failed to get adaptive recommendations:', error);
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    });
  }

  /**
   * Select optimal optimization strategy based on learning
   */
  async selectOptimalStrategy(context) {
    const strategies = ['conservative', 'balanced', 'aggressive'];
    const effectiveness = new Map();
    
    // Calculate effectiveness for each strategy based on past results
    strategies.forEach(strategy => {
      const patterns = this.learningData.optimizationPatterns.get(strategy) || [];
      const metrics = this.learningData.effectivenessMetrics.get(strategy);
      
      if (patterns.length >= this.config.minSamplesForPattern && metrics) {
        effectiveness.set(strategy, metrics.averageEffectiveness);
      } else {
        // Default effectiveness if no data
        effectiveness.set(strategy, {
          conservative: 0.6,
          balanced: 0.7,
          aggressive: 0.8
        }[strategy]);
      }
    });
    
    // Select strategy with highest effectiveness
    let bestStrategy = 'balanced';
    let bestScore = 0;
    
    effectiveness.forEach((score, strategy) => {
      if (score > bestScore) {
        bestScore = score;
        bestStrategy = strategy;
      }
    });
    
    return bestStrategy;
  }

  /**
   * Send learning data to cloud for collective intelligence
   */
  async sendLearningDataToCloud(learningPoint) {
    try {
      // Anonymize sensitive data
      const anonymizedData = {
        sessionId: this.sessionId,
        deviceProfile: {
          isAppleSilicon: this.systemProfile.cpu.isAppleSilicon,
          memoryGB: Math.round(this.systemProfile.memory.total / (1024 * 1024 * 1024)),
          coreCount: this.systemProfile.cpu.cores
        },
        optimization: {
          strategy: learningPoint.strategy,
          memoryFreed: learningPoint.memoryFreed,
          speedGain: learningPoint.speedGain,
          effectiveness: learningPoint.effectiveness,
          context: learningPoint.context
        },
        appOptimizations: learningPoint.optimizations.map(opt => ({
          appCategory: this.categorizeApplication(opt.appId),
          memoryFreed: opt.memoryFreedMB,
          actionsCount: opt.actions.length,
          success: opt.errors.length === 0
        })),
        timestamp: learningPoint.timestamp
      };

      // Only submit learning data if user has enabled learning and data sharing
      const learningEnabled = settingsManager.get('aiLearningEnabled') !== false;
      const shareData = settingsManager.get('shareOptimizationData') !== false;
      
      if (learningEnabled && shareData) {
        await this.submitLearningDataToAPI({
          userEmail: this.featureGate.getUserEmail(),
          deviceId: this.featureGate.getDeviceId(),
          learningData: anonymizedData
        });
      } else {
        console.log('📊 Learning data sharing disabled by user settings');
      }

    } catch (error) {
      console.error('Failed to send learning data to cloud:', error);
    }
  }

  /**
   * Submit learning data directly to the learning API
   */
  async submitLearningDataToAPI(data) {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://memorymonster.app';
      const response = await fetch(`${apiUrl}/api/learning/aggregate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Learning API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('🧠 Learning data submitted successfully:', {
        aggregatedDataPoints: result.aggregatedDataPoints,
        recentDataPoints: result.recentDataPoints
      });

      return result;
    } catch (error) {
      console.error('Failed to submit learning data to API:', error);
      
      // Fallback to the existing tracking method if direct API fails
      try {
        await window.electronAPI.trackUsage({
          type: 'learning_data',
          ...data
        });
        console.log('📊 Fallback learning data submission via trackUsage successful');
      } catch (fallbackError) {
        console.error('Both learning submission methods failed:', fallbackError);
      }
    }
  }

  /**
   * Fetch latest intelligence updates from the learning system
   */
  async fetchIntelligenceUpdates() {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://memorymonster.app';
      const deviceType = this.systemProfile?.cpu?.isAppleSilicon ? 'apple_silicon' : 'intel';
      const currentVersion = localStorage.getItem('intelligence_version') || '';
      
      const response = await fetch(`${apiUrl}/api/learning/intelligence?deviceType=${deviceType}&currentVersion=${currentVersion}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Intelligence API error: ${response.status}`);
      }

      const intelligenceUpdate = await response.json();
      
      if (intelligenceUpdate.hasUpdate) {
        console.log('🧠 New intelligence update available:', {
          version: intelligenceUpdate.intelligence.version,
          appProfiles: Object.keys(intelligenceUpdate.intelligence.updates.appProfiles).length,
          systemStrategies: Object.keys(intelligenceUpdate.intelligence.updates.systemStrategies).length
        });

        // Apply intelligence updates to local learning data
        await this.applyIntelligenceUpdates(intelligenceUpdate.intelligence);
        
        return intelligenceUpdate.intelligence;
      } else {
        console.log('📊 Intelligence is up to date:', intelligenceUpdate.version || 'current');
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch intelligence updates:', error);
      return null;
    }
  }

  /**
   * Apply intelligence updates to local learning patterns
   */
  async applyIntelligenceUpdates(intelligence) {
    try {
      // Update app-specific learning patterns with intelligence
      for (const [appId, profile] of Object.entries(intelligence.updates.appProfiles || {})) {
        if (!this.learningData.appBehaviorProfiles.has(appId)) {
          this.learningData.appBehaviorProfiles.set(appId, {
            optimizationHistory: [],
            effectiveStrategies: new Map(),
            memoryPatterns: [],
            lastOptimized: null
          });
        }

        const localProfile = this.learningData.appBehaviorProfiles.get(appId);
        
        // Apply learned thresholds
        if (profile.newThresholds) {
          localProfile.thresholds = profile.newThresholds;
        }

        // Apply success patterns
        if (profile.successPatterns) {
          localProfile.successPatterns = profile.successPatterns;
        }

        // Apply optimization strategies effectiveness
        if (profile.optimizationStrategies) {
          for (const [strategy, actions] of Object.entries(profile.optimizationStrategies)) {
            if (Array.isArray(actions)) {
              localProfile.effectiveStrategies.set(strategy, actions);
            }
          }
        }
      }

      // Store intelligence version to avoid duplicate updates
      localStorage.setItem('intelligence_version', intelligence.version);
      
      console.log('✅ Intelligence updates applied successfully');
      
      // Save updated learning data
      await this.saveLearningData();
      
    } catch (error) {
      console.error('Failed to apply intelligence updates:', error);
    }
  }

  /**
   * Load existing learning data from storage
   */
  async loadLearningData() {
    try {
      const savedData = localStorage.getItem('adaptiveLearningData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Convert Maps back from JSON
        if (parsed.optimizationPatterns) {
          this.learningData.optimizationPatterns = new Map(parsed.optimizationPatterns);
        }
        if (parsed.appBehaviorProfiles) {
          this.learningData.appBehaviorProfiles = new Map(parsed.appBehaviorProfiles);
        }
        if (parsed.systemResponsePatterns) {
          this.learningData.systemResponsePatterns = new Map(parsed.systemResponsePatterns);
        }
        if (parsed.effectivenessMetrics) {
          this.learningData.effectivenessMetrics = new Map(parsed.effectivenessMetrics);
        }
        
        this.continuousDataPoints = parsed.continuousDataPoints || [];
        
        console.log('📚 Loaded existing learning data', {
          patterns: this.learningData.optimizationPatterns.size,
          apps: this.learningData.appBehaviorProfiles.size,
          dataPoints: this.continuousDataPoints.length
        });
      }
    } catch (error) {
      console.error('Failed to load learning data:', error);
    }
  }

  /**
   * Save learning data to local storage
   */
  async saveLearningData() {
    try {
      const dataToSave = {
        optimizationPatterns: Array.from(this.learningData.optimizationPatterns.entries()),
        appBehaviorProfiles: Array.from(this.learningData.appBehaviorProfiles.entries()),
        systemResponsePatterns: Array.from(this.learningData.systemResponsePatterns.entries()),
        effectivenessMetrics: Array.from(this.learningData.effectivenessMetrics.entries()),
        continuousDataPoints: this.continuousDataPoints.slice(-500), // Keep last 500 points
        lastSaved: Date.now()
      };

      localStorage.setItem('adaptiveLearningData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save learning data:', error);
    }
  }

  /**
   * Helper methods
   */
  
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  analyzeActiveApplications(processes) {
    const appMap = new Map();
    
    processes.forEach(proc => {
      const appId = this.identifyAppFromProcess(proc.name);
      if (appId) {
        if (!appMap.has(appId)) {
          appMap.set(appId, {
            id: appId,
            name: proc.name,
            memory: 0,
            cpu: 0,
            processCount: 0
          });
        }
        const app = appMap.get(appId);
        app.memory += proc.memoryMB || 0;
        app.cpu += proc.cpu || 0;
        app.processCount++;
      }
    });
    
    return Array.from(appMap.values()).sort((a, b) => b.memory - a.memory);
  }

  calculateMemoryPressure(memory) {
    const totalGB = memory.total / (1024 * 1024 * 1024);
    const usedGB = memory.used / (1024 * 1024 * 1024);
    const percentage = (usedGB / totalGB) * 100;
    
    let level = 'low';
    if (percentage > 80) level = 'critical';
    else if (percentage > 60) level = 'high';
    else if (percentage > 40) level = 'medium';
    
    return {
      level,
      score: percentage,
      usedGB,
      totalGB
    };
  }

  calculateTrend(values) {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope || 0;
  }

  identifyAppFromProcess(processName) {
    const mappings = {
      'Chrome': 'com.google.Chrome',
      'Safari': 'com.apple.Safari',
      'Spotify': 'com.spotify.client',
      'Slack': 'com.tinyspeck.slackmacgap',
      'Discord': 'com.discordapp.Discord',
      'Code': 'com.microsoft.VSCode',
      'Notion': 'com.notion.id'
    };
    
    for (const [key, appId] of Object.entries(mappings)) {
      if (processName.includes(key)) {
        return appId;
      }
    }
    return null;
  }

  categorizeApplication(appId) {
    if (!appId) return 'unknown';
    
    const categories = {
      'com.google.Chrome': 'browser',
      'com.apple.Safari': 'browser',
      'com.spotify.client': 'media',
      'com.tinyspeck.slackmacgap': 'communication',
      'com.discordapp.Discord': 'communication',
      'com.microsoft.VSCode': 'development'
    };
    
    return categories[appId] || 'other';
  }

  flagApplicationConcern(appId, concernType, data) {
    console.log(`🚩 Application concern flagged: ${appId} - ${concernType}`, data);
    // This would be expanded to store and track concerns
  }

  getApplicationConcerns() {
    // Return mock concerns for now - would be expanded with real concern tracking
    return [];
  }

  async getPreventiveRecommendations() {
    // Return preventive recommendations based on historical patterns
    return [];
  }

  calculateConfidence(pattern) {
    // Calculate confidence based on data quality and quantity
    return Math.min(1, pattern.trend * 0.5 + 0.5);
  }

  updateEffectivenessMetrics(strategy, effectiveness) {
    if (!this.learningData.effectivenessMetrics.has(strategy)) {
      this.learningData.effectivenessMetrics.set(strategy, {
        totalEffectiveness: 0,
        count: 0,
        averageEffectiveness: 0
      });
    }
    
    const metrics = this.learningData.effectivenessMetrics.get(strategy);
    metrics.totalEffectiveness += effectiveness;
    metrics.count++;
    metrics.averageEffectiveness = metrics.totalEffectiveness / metrics.count;
  }

  async getCurrentSystemLoad() {
    try {
      const memory = await window.electronAPI.getSystemMemory();
      const cpu = await window.electronAPI.getSystemCPU();
      return {
        memoryPressure: this.calculateMemoryPressure(memory).score,
        cpuUsage: 100 - (cpu.idle || 0)
      };
    } catch (error) {
      return { memoryPressure: 0, cpuUsage: 0 };
    }
  }

  /**
   * Cleanup and shutdown
   */
  shutdown() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    this.saveLearningData();
    console.log('🔄 Adaptive Learning Engine shutdown');
  }
}

export default AdaptiveLearningEngine;
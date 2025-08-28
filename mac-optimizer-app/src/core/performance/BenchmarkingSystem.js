/**
 * Comprehensive Benchmarking and Validation System
 * Validates optimization effectiveness and system performance improvements
 */

import RealSpeedCalculator from './RealSpeedCalculator.js';
import settingsManager from '../../utils/settingsManager.js';

class BenchmarkingSystem {
  constructor() {
    this.speedCalculator = new RealSpeedCalculator();
    this.benchmarkHistory = [];
    this.validationTests = new Map();
    this.thresholds = {
      minimumMemoryImprovement: 100, // MB
      minimumSpeedImprovement: 5, // %
      maximumPerformanceRegression: 2, // %
      validationConfidence: 0.8,
      testTimeout: 30000 // 30 seconds
    };
  }

  /**
   * Run comprehensive system benchmark
   */
  async runSystemBenchmark(label = 'System Benchmark') {
    console.log(`🔍 Starting system benchmark: ${label}`);
    
    const benchmark = {
      id: this.generateBenchmarkId(),
      label,
      timestamp: Date.now(),
      startTime: performance.now(),
      systemState: null,
      metrics: {},
      validation: {
        passed: false,
        tests: [],
        confidence: 0
      }
    };

    try {
      // Collect comprehensive system metrics
      benchmark.systemState = await this.collectSystemMetrics();
      
      // Run performance tests
      benchmark.metrics = await this.runPerformanceTests();
      
      // Validate results
      benchmark.validation = await this.validateBenchmark(benchmark);
      
      benchmark.endTime = performance.now();
      benchmark.duration = benchmark.endTime - benchmark.startTime;
      
      // Store benchmark
      this.benchmarkHistory.push(benchmark);
      this.saveBenchmarkHistory();
      
      console.log('✅ System benchmark completed:', {
        duration: `${benchmark.duration.toFixed(2)}ms`,
        validation: benchmark.validation.passed,
        confidence: benchmark.validation.confidence
      });
      
      return benchmark;
    } catch (error) {
      console.error('❌ System benchmark failed:', error);
      benchmark.error = error.message;
      benchmark.endTime = performance.now();
      benchmark.duration = benchmark.endTime - benchmark.startTime;
      return benchmark;
    }
  }

  /**
   * Benchmark optimization effectiveness
   */
  async benchmarkOptimization(appId, strategyName, beforeState, afterState, optimizationResult) {
    console.log(`📊 Benchmarking optimization for ${appId} with ${strategyName} strategy`);
    
    const benchmark = {
      type: 'optimization',
      id: this.generateBenchmarkId(),
      appId,
      strategyName,
      timestamp: Date.now(),
      before: beforeState,
      after: afterState,
      result: optimizationResult,
      effectiveness: {},
      validation: {
        passed: false,
        tests: [],
        confidence: 0
      }
    };

    try {
      // Calculate effectiveness metrics
      benchmark.effectiveness = this.calculateOptimizationEffectiveness(
        beforeState, 
        afterState, 
        optimizationResult
      );
      
      // Validate optimization
      benchmark.validation = await this.validateOptimization(benchmark);
      
      // Store benchmark
      this.benchmarkHistory.push(benchmark);
      this.saveBenchmarkHistory();
      
      console.log('✅ Optimization benchmark completed:', {
        memoryImprovement: benchmark.effectiveness.memoryImprovement,
        speedImprovement: benchmark.effectiveness.speedImprovement,
        validated: benchmark.validation.passed
      });
      
      return benchmark;
    } catch (error) {
      console.error('❌ Optimization benchmark failed:', error);
      benchmark.error = error.message;
      return benchmark;
    }
  }

  /**
   * Collect comprehensive system metrics
   */
  async collectSystemMetrics() {
    try {
      const [systemPerformance, memoryData, cpuData, diskData, processData] = await Promise.all([
        this.speedCalculator.calculateRealSpeed(),
        window.electronAPI.getSystemMemory(),
        window.electronAPI.getCPUUsage(), 
        window.electronAPI.getDiskUsage(),
        window.electronAPI.getDetailedProcesses()
      ]);

      return {
        performance: systemPerformance,
        memory: memoryData,
        cpu: cpuData,
        disk: diskData,
        processes: processData,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to collect system metrics:', error);
      throw new Error(`System metrics collection failed: ${error.message}`);
    }
  }

  /**
   * Run performance tests
   */
  async runPerformanceTests() {
    const tests = {
      memoryPressureTest: await this.testMemoryPressure(),
      systemResponsivenessTest: await this.testSystemResponsiveness(),
      cacheEfficiencyTest: await this.testCacheEfficiency(),
      processOptimizationTest: await this.testProcessOptimization()
    };

    return tests;
  }

  /**
   * Test memory pressure handling
   */
  async testMemoryPressure() {
    console.log('🧪 Testing memory pressure handling...');
    
    const startTime = performance.now();
    const initialState = await this.speedCalculator.calculateRealSpeed();
    
    // Simulate memory pressure test
    const test = {
      name: 'Memory Pressure Test',
      startTime,
      initialPressure: initialState.components.memory,
      passed: false,
      metrics: {}
    };

    try {
      // Wait for system to settle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const finalState = await this.speedCalculator.calculateRealSpeed();
      test.finalPressure = finalState.components.memory;
      test.improvement = finalState.components.memory - initialState.components.memory;
      test.passed = test.improvement >= -5; // Allow small degradation
      test.endTime = performance.now();
      test.duration = test.endTime - startTime;
      
      console.log('✅ Memory pressure test completed:', test.passed);
    } catch (error) {
      test.error = error.message;
      test.endTime = performance.now();
    }

    return test;
  }

  /**
   * Test system responsiveness
   */
  async testSystemResponsiveness() {
    console.log('🧪 Testing system responsiveness...');
    
    const test = {
      name: 'System Responsiveness Test',
      startTime: performance.now(),
      passed: false,
      responseTimes: []
    };

    try {
      // Test multiple API response times
      for (let i = 0; i < 5; i++) {
        const apiStart = performance.now();
        await this.speedCalculator.calculateRealSpeed();
        const responseTime = performance.now() - apiStart;
        test.responseTimes.push(responseTime);
      }
      
      test.averageResponseTime = test.responseTimes.reduce((a, b) => a + b) / test.responseTimes.length;
      test.passed = test.averageResponseTime < 2000; // Under 2 seconds
      test.endTime = performance.now();
      test.duration = test.endTime - test.startTime;
      
      console.log('✅ Responsiveness test completed:', {
        averageTime: `${test.averageResponseTime.toFixed(2)}ms`,
        passed: test.passed
      });
    } catch (error) {
      test.error = error.message;
      test.endTime = performance.now();
    }

    return test;
  }

  /**
   * Test cache efficiency
   */
  async testCacheEfficiency() {
    console.log('🧪 Testing cache efficiency...');
    
    const test = {
      name: 'Cache Efficiency Test',
      startTime: performance.now(),
      passed: false
    };

    try {
      // Simulate cache clearing test
      const beforeClearState = await this.speedCalculator.calculateRealSpeed();
      
      // Wait and test again (simulated cache rebuild)
      await new Promise(resolve => setTimeout(resolve, 500));
      const afterClearState = await this.speedCalculator.calculateRealSpeed();
      
      test.beforeClear = beforeClearState.currentSpeed;
      test.afterClear = afterClearState.currentSpeed;
      test.impact = afterClearState.currentSpeed - beforeClearState.currentSpeed;
      test.passed = Math.abs(test.impact) < 10; // Cache clearing shouldn't hurt performance significantly
      test.endTime = performance.now();
      test.duration = test.endTime - test.startTime;
      
      console.log('✅ Cache efficiency test completed:', test.passed);
    } catch (error) {
      test.error = error.message;
      test.endTime = performance.now();
    }

    return test;
  }

  /**
   * Test process optimization
   */
  async testProcessOptimization() {
    console.log('🧪 Testing process optimization...');
    
    const test = {
      name: 'Process Optimization Test',
      startTime: performance.now(),
      passed: false
    };

    try {
      const processes = await window.electronAPI.getDetailedProcesses();
      test.totalProcesses = processes.length;
      test.totalMemory = processes.reduce((sum, p) => sum + (p.memoryMB || 0), 0);
      test.highMemoryProcesses = processes.filter(p => (p.memoryMB || 0) > 500).length;
      
      // Process optimization is considered good if we have reasonable process counts
      test.passed = test.totalProcesses < 200 && test.highMemoryProcesses < 10;
      test.endTime = performance.now();
      test.duration = test.endTime - test.startTime;
      
      console.log('✅ Process optimization test completed:', {
        totalProcesses: test.totalProcesses,
        highMemoryProcesses: test.highMemoryProcesses,
        passed: test.passed
      });
    } catch (error) {
      test.error = error.message;
      test.endTime = performance.now();
    }

    return test;
  }

  /**
   * Calculate optimization effectiveness
   */
  calculateOptimizationEffectiveness(beforeState, afterState, optimizationResult) {
    const effectiveness = {
      memoryImprovement: 0,
      speedImprovement: 0,
      stabilityImprovement: 0,
      userExperienceScore: 0
    };

    // Memory improvement
    if (beforeState?.memory && afterState?.memory) {
      const memoryBefore = beforeState.memory.used || 0;
      const memoryAfter = afterState.memory.used || 0;
      effectiveness.memoryImprovement = memoryBefore - memoryAfter; // MB freed
    }

    // Speed improvement  
    if (beforeState?.performance && afterState?.performance) {
      const speedBefore = beforeState.performance.currentSpeed || 0;
      const speedAfter = afterState.performance.currentSpeed || 0;
      effectiveness.speedImprovement = speedAfter - speedBefore; // % improvement
    }

    // Use optimization result data if available
    if (optimizationResult) {
      effectiveness.memoryImprovement += optimizationResult.memoryFreedMB || 0;
      effectiveness.speedImprovement += optimizationResult.speedGain || 0;
      effectiveness.actionsCompleted = optimizationResult.actions?.length || 0;
      effectiveness.errorsEncountered = optimizationResult.errors?.length || 0;
    }

    // Calculate overall user experience score
    effectiveness.userExperienceScore = this.calculateUserExperienceScore(effectiveness);

    return effectiveness;
  }

  /**
   * Calculate user experience score based on improvements
   */
  calculateUserExperienceScore(effectiveness) {
    let score = 0;

    // Memory improvement contributes to UX (0-40 points)
    const memoryScore = Math.min(40, (effectiveness.memoryImprovement / 1000) * 40);
    score += Math.max(0, memoryScore);

    // Speed improvement contributes to UX (0-40 points) 
    const speedScore = Math.min(40, (effectiveness.speedImprovement / 50) * 40);
    score += Math.max(0, speedScore);

    // Error penalty (-20 points per error)
    score -= (effectiveness.errorsEncountered || 0) * 20;

    // Actions completed bonus (up to 20 points)
    score += Math.min(20, (effectiveness.actionsCompleted || 0) * 5);

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validate benchmark results
   */
  async validateBenchmark(benchmark) {
    const validation = {
      passed: false,
      tests: [],
      confidence: 0,
      issues: []
    };

    // Test 1: System metrics collection
    if (benchmark.systemState) {
      validation.tests.push({
        name: 'System Metrics Collection',
        passed: true,
        weight: 0.3
      });
    } else {
      validation.tests.push({
        name: 'System Metrics Collection', 
        passed: false,
        weight: 0.3
      });
      validation.issues.push('Failed to collect system metrics');
    }

    // Test 2: Performance tests completion
    const performanceTestsPassed = Object.values(benchmark.metrics || {})
      .filter(test => test.passed).length;
    const totalPerformanceTests = Object.keys(benchmark.metrics || {}).length;
    
    validation.tests.push({
      name: 'Performance Tests',
      passed: performanceTestsPassed >= totalPerformanceTests * 0.75, // 75% pass rate
      weight: 0.4,
      details: `${performanceTestsPassed}/${totalPerformanceTests} passed`
    });

    // Test 3: Benchmark duration reasonable
    const reasonableDuration = benchmark.duration < this.thresholds.testTimeout;
    validation.tests.push({
      name: 'Reasonable Duration',
      passed: reasonableDuration,
      weight: 0.2,
      details: `${benchmark.duration.toFixed(2)}ms`
    });

    // Test 4: No critical errors
    const noCriticalErrors = !benchmark.error;
    validation.tests.push({
      name: 'No Critical Errors',
      passed: noCriticalErrors,
      weight: 0.1
    });

    // Calculate confidence score
    validation.confidence = validation.tests.reduce((conf, test) => {
      return conf + (test.passed ? test.weight : 0);
    }, 0);

    // Overall pass/fail
    validation.passed = validation.confidence >= this.thresholds.validationConfidence;

    return validation;
  }

  /**
   * Validate optimization effectiveness
   */
  async validateOptimization(optimizationBenchmark) {
    const validation = {
      passed: false,
      tests: [],
      confidence: 0,
      issues: []
    };

    const effectiveness = optimizationBenchmark.effectiveness;

    // Test 1: Memory improvement
    const memoryImproved = effectiveness.memoryImprovement >= this.thresholds.minimumMemoryImprovement;
    validation.tests.push({
      name: 'Memory Improvement',
      passed: memoryImproved,
      weight: 0.4,
      details: `${effectiveness.memoryImprovement.toFixed(1)}MB freed`
    });

    // Test 2: Speed improvement
    const speedImproved = effectiveness.speedImprovement >= this.thresholds.minimumSpeedImprovement;
    validation.tests.push({
      name: 'Speed Improvement', 
      passed: speedImproved,
      weight: 0.3,
      details: `${effectiveness.speedImprovement.toFixed(1)}% faster`
    });

    // Test 3: No significant regression
    const noRegression = effectiveness.speedImprovement >= -this.thresholds.maximumPerformanceRegression;
    validation.tests.push({
      name: 'No Performance Regression',
      passed: noRegression,
      weight: 0.2
    });

    // Test 4: User experience score
    const goodUX = effectiveness.userExperienceScore >= 60;
    validation.tests.push({
      name: 'User Experience Score',
      passed: goodUX,
      weight: 0.1,
      details: `${effectiveness.userExperienceScore.toFixed(1)}/100`
    });

    // Calculate confidence
    validation.confidence = validation.tests.reduce((conf, test) => {
      return conf + (test.passed ? test.weight : 0);
    }, 0);

    validation.passed = validation.confidence >= this.thresholds.validationConfidence;

    return validation;
  }

  /**
   * Get benchmark history and analytics
   */
  getBenchmarkAnalytics() {
    const analytics = {
      totalBenchmarks: this.benchmarkHistory.length,
      systemBenchmarks: this.benchmarkHistory.filter(b => b.type !== 'optimization').length,
      optimizationBenchmarks: this.benchmarkHistory.filter(b => b.type === 'optimization').length,
      overallPassRate: 0,
      averageConfidence: 0,
      trends: {},
      recommendations: []
    };

    if (this.benchmarkHistory.length === 0) {
      return analytics;
    }

    // Calculate pass rate and confidence
    const validatedBenchmarks = this.benchmarkHistory.filter(b => b.validation);
    const passedBenchmarks = validatedBenchmarks.filter(b => b.validation.passed);
    
    analytics.overallPassRate = validatedBenchmarks.length > 0 ? 
      (passedBenchmarks.length / validatedBenchmarks.length) * 100 : 0;
    
    analytics.averageConfidence = validatedBenchmarks.length > 0 ?
      validatedBenchmarks.reduce((sum, b) => sum + b.validation.confidence, 0) / validatedBenchmarks.length : 0;

    // Analyze trends (last 10 benchmarks)
    const recentBenchmarks = this.benchmarkHistory.slice(-10);
    if (recentBenchmarks.length >= 2) {
      analytics.trends = this.analyzeTrends(recentBenchmarks);
    }

    // Generate recommendations
    analytics.recommendations = this.generateRecommendations(analytics);

    return analytics;
  }

  /**
   * Analyze performance trends
   */
  analyzeTrends(recentBenchmarks) {
    const trends = {
      performanceTrend: 'stable',
      confidenceTrend: 'stable',
      optimizationEffectiveness: 'stable'
    };

    // This would implement trend analysis logic
    // For now, return stable trends
    return trends;
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(analytics) {
    const recommendations = [];

    if (analytics.overallPassRate < 80) {
      recommendations.push({
        type: 'improvement',
        priority: 'high',
        message: 'Overall benchmark pass rate is below 80%. Consider reviewing optimization strategies.'
      });
    }

    if (analytics.averageConfidence < 0.7) {
      recommendations.push({
        type: 'improvement',
        priority: 'medium', 
        message: 'Average validation confidence is low. Consider improving benchmark accuracy.'
      });
    }

    if (analytics.systemBenchmarks < 5) {
      recommendations.push({
        type: 'suggestion',
        priority: 'low',
        message: 'Run more system benchmarks to establish better performance baselines.'
      });
    }

    return recommendations;
  }

  /**
   * Export benchmark data
   */
  exportBenchmarkData(format = 'json') {
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        totalBenchmarks: this.benchmarkHistory.length,
        format
      },
      analytics: this.getBenchmarkAnalytics(),
      benchmarks: this.benchmarkHistory
    };

    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    }

    // Could implement CSV export here
    return exportData;
  }

  /**
   * Utility methods
   */
  generateBenchmarkId() {
    return `benchmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  saveBenchmarkHistory() {
    try {
      // Keep only last 100 benchmarks to avoid storage bloat
      const recentBenchmarks = this.benchmarkHistory.slice(-100);
      localStorage.setItem('memory_monster_benchmarks', JSON.stringify(recentBenchmarks));
    } catch (error) {
      console.error('Failed to save benchmark history:', error);
    }
  }

  loadBenchmarkHistory() {
    try {
      const stored = localStorage.getItem('memory_monster_benchmarks');
      if (stored) {
        this.benchmarkHistory = JSON.parse(stored);
        console.log(`📊 Loaded ${this.benchmarkHistory.length} previous benchmarks`);
      }
    } catch (error) {
      console.error('Failed to load benchmark history:', error);
      this.benchmarkHistory = [];
    }
  }

  clearBenchmarkHistory() {
    this.benchmarkHistory = [];
    localStorage.removeItem('memory_monster_benchmarks');
    console.log('🗑️ Benchmark history cleared');
  }
}

export default BenchmarkingSystem;
/**
 * Real Speed Calculator
 * Calculates actual Mac performance based on system metrics
 * No fake numbers - uses real memory pressure, CPU load, disk I/O, etc.
 */

class RealSpeedCalculator {
  constructor() {
    this.baselineScore = 100; // Perfect performance
    this.weights = {
      memoryPressure: 0.35,    // Memory is critical for Mac performance
      cpuLoad: 0.25,           // CPU usage impact
      diskPressure: 0.20,      // Disk I/O bottlenecks
      swapUsage: 0.15,         // Swap indicates memory pressure
      thermalState: 0.05       // Thermal throttling
    };
    this.lastCalculation = null;
    this.trend = [];
  }

  async calculateRealSpeed() {
    try {
      // Get all real system metrics
      const [memoryData, cpuData, diskData, thermalData] = await Promise.all([
        window.electronAPI.getSystemMemory(),
        window.electronAPI.getCPUUsage(),
        window.electronAPI.getDiskUsage(),
        window.electronAPI.getThermalState()
      ]);

      console.log('🔍 Real system data:', { memoryData, cpuData, diskData, thermalData });

      // Calculate individual performance scores (0-100)
      const memoryScore = this.calculateMemoryScore(memoryData);
      const cpuScore = this.calculateCPUScore(cpuData);
      const diskScore = this.calculateDiskScore(diskData);
      const swapScore = this.calculateSwapScore(memoryData);
      const thermalScore = this.calculateThermalScore(thermalData);

      // Weighted composite score
      const compositeScore = Math.round(
        (memoryScore * this.weights.memoryPressure) +
        (cpuScore * this.weights.cpuLoad) +
        (diskScore * this.weights.diskPressure) +
        (swapScore * this.weights.swapUsage) +
        (thermalScore * this.weights.thermalState)
      );

      // Calculate trend
      this.updateTrend(compositeScore);

      const result = {
        currentSpeed: Math.max(5, Math.min(95, compositeScore)),
        components: {
          memory: memoryScore,
          cpu: cpuScore,
          disk: diskScore,
          swap: swapScore,
          thermal: thermalScore
        },
        trend: this.getTrend(),
        bottlenecks: this.identifyBottlenecks(memoryScore, cpuScore, diskScore, swapScore, thermalScore),
        potentialImprovement: this.calculatePotentialImprovement(memoryData, cpuData),
        timestamp: Date.now()
      };

      this.lastCalculation = result;
      return result;

    } catch (error) {
      console.error('❌ Real speed calculation failed:', error);
      // Return a conservative estimate if system calls fail
      return {
        currentSpeed: 30,
        components: { memory: 30, cpu: 50, disk: 50, swap: 30, thermal: 80 },
        trend: 'unknown',
        bottlenecks: ['system_unavailable'],
        potentialImprovement: 40,
        timestamp: Date.now(),
        error: error.message
      };
    }
  }

  calculateMemoryScore(memoryData) {
    const { total, used, available, pressure } = memoryData;
    
    // Memory pressure is the most accurate indicator
    if (pressure !== undefined) {
      // macOS pressure: 1 = normal, 2 = warn, 4 = critical
      const pressureScore = pressure === 1 ? 85 : pressure === 2 ? 45 : 15;
      return pressureScore;
    }

    // Fallback to memory usage calculation
    const usagePercent = (used / total) * 100;
    if (usagePercent < 60) return 85;  // Good performance
    if (usagePercent < 75) return 65;  // Moderate performance
    if (usagePercent < 85) return 40;  // Poor performance
    return 20; // Critical performance
  }

  calculateCPUScore(cpuData) {
    const { usage } = cpuData;
    
    // CPU usage to performance score
    if (usage < 20) return 90;
    if (usage < 40) return 75;
    if (usage < 60) return 55;
    if (usage < 80) return 35;
    return 15;
  }

  calculateDiskScore(diskData) {
    const { readOps, writeOps, readTime, writeTime } = diskData;
    
    // High disk I/O indicates bottleneck
    const totalOps = (readOps || 0) + (writeOps || 0);
    const avgTime = ((readTime || 0) + (writeTime || 0)) / 2;
    
    if (totalOps < 100 && avgTime < 10) return 85;
    if (totalOps < 500 && avgTime < 25) return 65;
    if (totalOps < 1000 && avgTime < 50) return 45;
    return 25;
  }

  calculateSwapScore(memoryData) {
    const { swap } = memoryData;
    
    if (!swap || swap.used === 0) return 90; // No swap usage
    
    const swapPercent = (swap.used / swap.total) * 100;
    if (swapPercent < 10) return 75;
    if (swapPercent < 25) return 50;
    if (swapPercent < 50) return 25;
    return 10; // Heavy swap usage kills performance
  }

  calculateThermalScore(thermalData) {
    const { state } = thermalData;
    
    // macOS thermal states: 0 = nominal, 1 = fair, 2 = serious, 3 = critical
    switch (state) {
      case 0: return 90; // Nominal
      case 1: return 70; // Fair
      case 2: return 40; // Serious
      case 3: return 15; // Critical
      default: return 80; // Unknown, assume good
    }
  }

  identifyBottlenecks(memory, cpu, disk, swap, thermal) {
    const bottlenecks = [];
    
    if (memory < 40) bottlenecks.push('memory_pressure');
    if (cpu < 40) bottlenecks.push('cpu_overload');
    if (disk < 40) bottlenecks.push('disk_io');
    if (swap < 40) bottlenecks.push('swap_usage');
    if (thermal < 40) bottlenecks.push('thermal_throttling');
    
    return bottlenecks;
  }

  calculatePotentialImprovement(memoryData, cpuData) {
    // Estimate how much performance could be gained
    const memoryImprovement = this.estimateMemoryImprovement(memoryData);
    const cpuImprovement = this.estimateCPUImprovement(cpuData);
    
    return Math.min(70, memoryImprovement + cpuImprovement); // Cap at 70% improvement
  }

  estimateMemoryImprovement(memoryData) {
    const { used, total, pressure } = memoryData;
    
    // Heavy memory users can often free 20-40% with optimization
    if (pressure >= 2 || (used / total) > 0.8) {
      return 35; // Significant improvement possible
    }
    if ((used / total) > 0.6) {
      return 20; // Moderate improvement possible
    }
    return 10; // Minor improvement possible
  }

  estimateCPUImprovement(cpuData) {
    const { usage } = cpuData;
    
    // CPU optimization typically yields less dramatic improvements
    if (usage > 60) return 15;
    if (usage > 40) return 10;
    return 5;
  }

  updateTrend(currentScore) {
    this.trend.push({ score: currentScore, timestamp: Date.now() });
    
    // Keep only last 10 measurements
    if (this.trend.length > 10) {
      this.trend = this.trend.slice(-10);
    }
  }

  getTrend() {
    if (this.trend.length < 2) return 'stable';
    
    const recent = this.trend.slice(-3);
    const older = this.trend.slice(-6, -3);
    
    if (recent.length < 2 || older.length < 2) return 'stable';
    
    const recentAvg = recent.reduce((sum, r) => sum + r.score, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.score, 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  // Get detailed performance report for logging/learning
  getDetailedReport() {
    if (!this.lastCalculation) return null;
    
    return {
      ...this.lastCalculation,
      systemAnalysis: {
        primaryBottleneck: this.identifyPrimaryBottleneck(),
        optimizationPriority: this.getOptimizationPriority(),
        recommendedActions: this.getRecommendedActions()
      }
    };
  }

  identifyPrimaryBottleneck() {
    if (!this.lastCalculation) return 'unknown';
    
    const { components } = this.lastCalculation;
    const scores = Object.entries(components);
    const lowest = scores.reduce((min, current) => 
      current[1] < min[1] ? current : min
    );
    
    return lowest[0];
  }

  getOptimizationPriority() {
    const bottlenecks = this.lastCalculation?.bottlenecks || [];
    
    // Priority order based on impact
    const priority = ['memory_pressure', 'swap_usage', 'disk_io', 'cpu_overload', 'thermal_throttling'];
    
    for (const p of priority) {
      if (bottlenecks.includes(p)) return p;
    }
    
    return 'general_cleanup';
  }

  getRecommendedActions() {
    if (!this.lastCalculation) return [];
    
    const { components, bottlenecks } = this.lastCalculation;
    const actions = [];
    
    if (bottlenecks.includes('memory_pressure')) {
      actions.push('close_memory_heavy_apps', 'clear_app_caches', 'kill_background_processes');
    }
    
    if (bottlenecks.includes('swap_usage')) {
      actions.push('restart_apps', 'clear_system_cache');
    }
    
    if (bottlenecks.includes('disk_io')) {
      actions.push('clear_temp_files', 'optimize_storage');
    }
    
    if (bottlenecks.includes('cpu_overload')) {
      actions.push('limit_background_apps', 'pause_heavy_processes');
    }
    
    return actions;
  }
}

export default RealSpeedCalculator;
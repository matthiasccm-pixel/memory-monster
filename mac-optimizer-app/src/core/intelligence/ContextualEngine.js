/**
 * Contextual Decision Engine
 * Determines when it's safe to optimize apps
 */

class ContextualDecisionEngine {
  constructor() {
    this.systemContext = new Map();
  }

  async shouldOptimizeNow(app, optimization) {
    // Gather all contextual information
    const contexts = await this.gatherAllContexts(app);
    
    // Evaluate safety based on contextual rules
    const decision = this.evaluateOptimizationSafety(contexts, app, optimization);
    
    return {
      shouldProceed: decision.safe,
      confidence: decision.confidence,
      reasoning: decision.reasoning,
      alternatives: decision.alternatives,
      userPromptRequired: decision.requiresUserInput,
      contextSummary: contexts
    };
  }

  async gatherAllContexts(app) {
    return {
      appContext: await this.analyzeAppContext(app),
      systemContext: await this.analyzeSystemContext(),
      userContext: await this.analyzeUserContext(),
      timeContext: await this.analyzeTimeContext()
    };
  }

  async analyzeAppContext(app) {
    try {
      // Get real app state using our existing system APIs
      const processes = await window.electronAPI.getDetailedProcesses();
      const appProcesses = processes.filter(p => p.name.includes(app.name));
      
      return {
        isRunning: appProcesses.length > 0,
        memoryUsage: appProcesses.reduce((sum, p) => sum + p.memoryMB, 0),
        processCount: appProcesses.length,
        hasHighMemoryUsage: appProcesses.some(p => p.memoryMB > 1000),
        // These would be enhanced with more sophisticated detection
        isInForeground: false, // TODO: Implement foreground detection
        hasUnsavedWork: false, // TODO: Implement unsaved work detection
        lastActivityTime: Date.now() // TODO: Implement activity tracking
      };
    } catch (error) {
      console.error('Error analyzing app context:', error);
      return { isRunning: false, error: error.message };
    }
  }

  async analyzeSystemContext() {
    try {
      const systemMemory = await window.electronAPI.getSystemMemory();
      return {
        memoryPressure: systemMemory.pressure || 0,
        availableMemory: systemMemory.free || 0,
        memoryPressureLevel: this.calculateMemoryPressureLevel(systemMemory),
        systemLoad: 'normal' // TODO: Implement CPU load detection
      };
    } catch (error) {
      return { memoryPressure: 0, error: error.message };
    }
  }

  async analyzeUserContext() {
    const now = new Date();
    const hour = now.getHours();
    
    return {
      isWorkingHours: hour >= 9 && hour <= 17,
      isWeekend: now.getDay() === 0 || now.getDay() === 6,
      timeOfDay: this.getTimeOfDay(hour),
      userIdleTime: 0 // TODO: Implement idle detection
    };
  }

  async analyzeTimeContext() {
    const now = new Date();
    return {
      currentHour: now.getHours(),
      dayOfWeek: now.getDay(),
      isBusinessHours: this.isBusinessHours(now),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  evaluateOptimizationSafety(contexts, app, optimization) {
    let safetyScore = 100;
    let reasoning = [];
    const profile = app.profile || {};
    const rules = profile.contextualRules || {};

    // Check never-optimize conditions
    if (rules.neverOptimizeWhen) {
      for (const condition of rules.neverOptimizeWhen) {
        if (this.checkCondition(condition, contexts)) {
          safetyScore = 0;
          reasoning.push(`Blocked: ${condition.replace('_', ' ')}`);
        }
      }
    }

    // Check app-specific contexts
    if (contexts.appContext.isInForeground) {
      safetyScore -= 60;
      reasoning.push('App is currently in use');
    }

    if (contexts.appContext.hasUnsavedWork) {
      safetyScore -= 80;
      reasoning.push('App has unsaved work');
    }

    // Check system load
    if (contexts.systemContext.memoryPressureLevel === 'critical') {
      safetyScore += 30; // More urgent to optimize
      reasoning.push('System memory pressure is critical');
    }

    // Check time-based factors
    if (contexts.userContext.isWorkingHours && safetyScore < 50) {
      reasoning.push('Deferring optimization during work hours');
      return {
        safe: false,
        confidence: 0.9,
        reasoning: reasoning,
        alternatives: ['Schedule for break time', 'Wait for after hours'],
        requiresUserInput: true
      };
    }

    // Final decision
    const isSafe = safetyScore > 60;
    const requiresUserInput = safetyScore < 80 || optimization.userPrompt === 'required';

    return {
      safe: isSafe,
      confidence: Math.min(safetyScore / 100, 1),
      reasoning: reasoning,
      alternatives: isSafe ? [] : this.generateAlternatives(contexts, optimization),
      requiresUserInput: requiresUserInput
    };
  }

  checkCondition(condition, contexts) {
    // Map contextual conditions to actual context checks
    const conditionMap = {
      'app_in_foreground': () => contexts.appContext.isInForeground,
      'unsaved_work_detected': () => contexts.appContext.hasUnsavedWork,
      'downloading_files': () => false, // TODO: Implement download detection
      'video_call_active': () => false, // TODO: Implement video call detection
      'user_idle_10min': () => contexts.userContext.userIdleTime > 600000
    };

    const checker = conditionMap[condition];
    return checker ? checker() : false;
  }

  calculateMemoryPressureLevel(systemMemory) {
    const pressure = systemMemory.pressure || 0;
    if (pressure > 80) return 'critical';
    if (pressure > 60) return 'high';
    if (pressure > 40) return 'moderate';
    return 'normal';
  }

  getTimeOfDay(hour) {
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  isBusinessHours(date) {
    const hour = date.getHours();
    const day = date.getDay();
    return day >= 1 && day <= 5 && hour >= 9 && hour <= 17;
  }

  generateAlternatives(contexts, optimization) {
    const alternatives = [];
    
    if (contexts.userContext.isWorkingHours) {
      alternatives.push('Schedule for lunch break');
      alternatives.push('Schedule for end of day');
    }
    
    if (contexts.appContext.isInForeground) {
      alternatives.push('Wait until app is minimized');
      alternatives.push('Ask user to save work first');
    }
    
    return alternatives;
  }
}

export default ContextualDecisionEngine;
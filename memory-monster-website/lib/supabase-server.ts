import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database interfaces
export interface LearningDataPoint {
  id?: string;
  user_id?: string;
  session_id: string;
  device_id: string;
  device_profile: {
    isAppleSilicon: boolean;
    memoryGB: number;
    coreCount: number;
  };
  optimization_strategy: string;
  memory_freed_mb: number;
  speed_gain_percent: number;
  effectiveness_score: number;
  optimization_context: {
    timeOfDay: number;
    dayOfWeek: number;
    systemLoad: {
      memoryPressure: number;
      cpuUsage: number;
    };
  };
  app_optimizations: Array<{
    appCategory: string;
    memoryFreed: number;
    actionsCount: number;
    success: boolean;
  }>;
  system_state_before?: any;
  system_state_after?: any;
  errors?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface AggregatedIntelligence {
  id?: string;
  intelligence_type: 'global' | 'app_specific' | 'system_profile';
  intelligence_key: string;
  intelligence_data: any;
  version: string;
  confidence_score?: number;
  sample_size?: number;
  last_calculated_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AppIntelligenceProfile {
  id?: string;
  app_id: string;
  app_display_name: string;
  memory_warning_threshold_mb?: number;
  memory_critical_threshold_mb?: number;
  strategy_effectiveness?: any;
  optimal_times?: any;
  system_load_preferences?: any;
  risk_level?: 'low' | 'medium' | 'high';
  risk_confidence?: number;
  known_issues?: any[];
  average_memory_recovery_mb?: number;
  success_rate?: number;
  user_satisfaction_score?: number;
  last_learning_update?: string;
  total_optimizations?: number;
  created_at?: string;
  updated_at?: string;
}

// Helper functions for database operations
export class LearningDatabase {
  
  /**
   * Store learning data point
   */
  static async storeLearningData(learningData: LearningDataPoint) {
    console.log('💾 Storing learning data to Supabase:', {
      session_id: learningData.session_id,
      strategy: learningData.optimization_strategy,
      memory_freed: learningData.memory_freed_mb
    });

    const { data, error } = await supabase
      .from('learning_data')
      .insert([{
        user_id: learningData.user_id,
        session_id: learningData.session_id,
        device_id: learningData.device_id,
        device_profile: learningData.device_profile,
        optimization_strategy: learningData.optimization_strategy,
        memory_freed_mb: learningData.memory_freed_mb,
        speed_gain_percent: learningData.speed_gain_percent,
        effectiveness_score: learningData.effectiveness_score,
        optimization_context: learningData.optimization_context,
        app_optimizations: learningData.app_optimizations,
        system_state_before: learningData.system_state_before || {},
        system_state_after: learningData.system_state_after || {},
        errors: learningData.errors || []
      }])
      .select();

    if (error) {
      console.error('Failed to store learning data:', error);
      throw error;
    }

    console.log('✅ Learning data stored successfully:', data?.[0]?.id);
    return data;
  }

  /**
   * Get learning data for analysis
   */
  static async getLearningData(filters: {
    deviceType?: 'apple_silicon' | 'intel';
    strategy?: string;
    limit?: number;
    since?: string;
  } = {}) {
    let query = supabase
      .from('learning_data')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.since) {
      query = query.gte('created_at', filters.since);
    }

    if (filters.deviceType) {
      const isAppleSilicon = filters.deviceType === 'apple_silicon';
      query = query.eq('device_profile->isAppleSilicon', isAppleSilicon);
    }

    if (filters.strategy) {
      query = query.eq('optimization_strategy', filters.strategy);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to get learning data:', error);
      throw error;
    }

    return data;
  }

  /**
   * Store or update aggregated intelligence
   */
  static async storeIntelligence(intelligence: AggregatedIntelligence) {
    console.log('🧠 Storing aggregated intelligence:', {
      type: intelligence.intelligence_type,
      key: intelligence.intelligence_key,
      version: intelligence.version
    });

    const { data, error } = await supabase
      .from('aggregated_intelligence')
      .upsert([{
        intelligence_type: intelligence.intelligence_type,
        intelligence_key: intelligence.intelligence_key,
        intelligence_data: intelligence.intelligence_data,
        version: intelligence.version,
        confidence_score: intelligence.confidence_score || 0.5,
        sample_size: intelligence.sample_size || 0,
        last_calculated_at: new Date().toISOString()
      }], {
        onConflict: 'intelligence_type,intelligence_key,version'
      })
      .select();

    if (error) {
      console.error('Failed to store intelligence:', error);
      throw error;
    }

    console.log('✅ Intelligence stored successfully');
    return data;
  }

  /**
   * Get latest intelligence
   */
  static async getLatestIntelligence(type?: string, key?: string) {
    let query = supabase
      .from('aggregated_intelligence')
      .select('*')
      .order('updated_at', { ascending: false });

    if (type) {
      query = query.eq('intelligence_type', type);
    }

    if (key) {
      query = query.eq('intelligence_key', key);
    }

    const { data, error } = await query.limit(10);

    if (error) {
      console.error('Failed to get intelligence:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get app intelligence profiles
   */
  static async getAppProfiles() {
    const { data, error } = await supabase
      .from('app_intelligence_profiles')
      .select('*')
      .order('app_display_name', { ascending: true });

    if (error) {
      console.error('Failed to get app profiles:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get analytics data from real database
   */
  static async getAnalytics() {
    // Get total learning data points
    const { count: totalDataPoints, error: countError } = await supabase
      .from('learning_data')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Failed to get total count:', countError);
    }

    // Get data from last 24 hours
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    const { count: recentDataPoints, error: recentError } = await supabase
      .from('learning_data')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twentyFourHoursAgo.toISOString());

    if (recentError) {
      console.error('Failed to get recent count:', recentError);
    }

    // Get strategy effectiveness from recent data
    const { data: strategyData, error: strategyError } = await supabase
      .from('learning_data')
      .select('optimization_strategy, effectiveness_score')
      .gte('created_at', twentyFourHoursAgo.toISOString());

    let strategyAnalytics = {};
    if (!strategyError && strategyData) {
      strategyAnalytics = this.calculateStrategyEffectiveness(strategyData);
    }

    return {
      totalDataPoints: totalDataPoints || 0,
      recentDataPoints: recentDataPoints || 0,
      strategyAnalytics,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Calculate strategy effectiveness from raw data
   */
  private static calculateStrategyEffectiveness(data: any[]) {
    const strategies = new Map();
    
    data.forEach(item => {
      const strategy = item.optimization_strategy;
      const effectiveness = item.effectiveness_score;
      
      if (!strategies.has(strategy)) {
        strategies.set(strategy, { total: 0, count: 0 });
      }
      
      const current = strategies.get(strategy);
      current.total += effectiveness;
      current.count += 1;
    });

    const result: Record<string, number> = {};
    strategies.forEach((value, key) => {
      result[key] = Math.round((value.total / value.count) * 100) / 100;
    });

    return result;
  }

  /**
   * Process and aggregate learning data into intelligence
   */
  static async processLearningData() {
    console.log('🔄 Processing learning data into intelligence...');
    
    // Get recent learning data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentData = await this.getLearningData({
      since: sevenDaysAgo.toISOString(),
      limit: 1000
    });

    if (!recentData || recentData.length === 0) {
      console.log('⚠️ No recent learning data to process');
      return;
    }

    // Process global patterns
    await this.processGlobalPatterns(recentData);
    
    // Process app-specific patterns  
    await this.processAppPatterns(recentData);
    
    // Process system profile patterns
    await this.processSystemPatterns(recentData);
    
    console.log('✅ Learning data processing complete');
  }

  private static async processGlobalPatterns(data: any[]) {
    // Calculate overall strategy effectiveness
    const strategies = new Map();
    data.forEach(item => {
      const strategy = item.optimization_strategy;
      if (!strategies.has(strategy)) {
        strategies.set(strategy, { total: 0, count: 0, memory: 0 });
      }
      const current = strategies.get(strategy);
      current.total += item.effectiveness_score;
      current.count += 1;
      current.memory += item.memory_freed_mb;
    });

    const globalIntelligence = {};
    strategies.forEach((value, key) => {
      globalIntelligence[key] = {
        effectiveness: value.total / value.count,
        avgMemoryRecovery: value.memory / value.count,
        sampleSize: value.count
      };
    });

    await this.storeIntelligence({
      intelligence_type: 'global',
      intelligence_key: 'strategy_effectiveness',
      intelligence_data: globalIntelligence,
      version: this.generateVersion(),
      confidence_score: Math.min(data.length / 100, 1),
      sample_size: data.length
    });
  }

  private static async processAppPatterns(data: any[]) {
    // Group by app categories
    const appCategories = new Map();
    
    data.forEach(item => {
      item.app_optimizations.forEach(appOpt => {
        const category = appOpt.appCategory;
        if (!appCategories.has(category)) {
          appCategories.set(category, { 
            totalRecovery: 0, 
            successCount: 0, 
            totalCount: 0 
          });
        }
        const current = appCategories.get(category);
        current.totalRecovery += appOpt.memoryFreed;
        current.totalCount += 1;
        if (appOpt.success) current.successCount += 1;
      });
    });

    // Store app intelligence
    for (const [category, stats] of appCategories.entries()) {
      await this.storeIntelligence({
        intelligence_type: 'app_specific',
        intelligence_key: category,
        intelligence_data: {
          avgMemoryRecovery: stats.totalRecovery / stats.totalCount,
          successRate: stats.successCount / stats.totalCount,
          sampleSize: stats.totalCount
        },
        version: this.generateVersion(),
        sample_size: stats.totalCount
      });
    }
  }

  private static async processSystemPatterns(data: any[]) {
    // Group by system profiles
    const systemProfiles = new Map();
    
    data.forEach(item => {
      const profileKey = `${item.device_profile.isAppleSilicon ? 'apple_silicon' : 'intel'}_${Math.floor(item.device_profile.memoryGB / 8) * 8}gb`;
      
      if (!systemProfiles.has(profileKey)) {
        systemProfiles.set(profileKey, {
          effectiveness: [],
          memoryRecovery: [],
          strategies: new Map()
        });
      }
      
      const profile = systemProfiles.get(profileKey);
      profile.effectiveness.push(item.effectiveness_score);
      profile.memoryRecovery.push(item.memory_freed_mb);
      
      if (!profile.strategies.has(item.optimization_strategy)) {
        profile.strategies.set(item.optimization_strategy, { count: 0, effectiveness: 0 });
      }
      const strategy = profile.strategies.get(item.optimization_strategy);
      strategy.count += 1;
      strategy.effectiveness += item.effectiveness_score;
    });

    // Store system intelligence
    for (const [profileKey, stats] of systemProfiles.entries()) {
      const avgEffectiveness = stats.effectiveness.reduce((a, b) => a + b, 0) / stats.effectiveness.length;
      const avgMemoryRecovery = stats.memoryRecovery.reduce((a, b) => a + b, 0) / stats.memoryRecovery.length;
      
      // Find best strategy for this system profile
      let bestStrategy = 'balanced';
      let bestEffectiveness = 0;
      
      stats.strategies.forEach((strategy, name) => {
        const effectiveness = strategy.effectiveness / strategy.count;
        if (effectiveness > bestEffectiveness) {
          bestEffectiveness = effectiveness;
          bestStrategy = name;
        }
      });

      await this.storeIntelligence({
        intelligence_type: 'system_profile',
        intelligence_key: profileKey,
        intelligence_data: {
          recommendedStrategy: bestStrategy,
          avgEffectiveness: avgEffectiveness,
          avgMemoryRecovery: avgMemoryRecovery,
          bestStrategyEffectiveness: bestEffectiveness
        },
        version: this.generateVersion(),
        sample_size: stats.effectiveness.length
      });
    }
  }

  private static generateVersion(): string {
    return `v${Math.floor(Date.now() / (24 * 60 * 60 * 1000))}`; // Daily versioning
  }
}
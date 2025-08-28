-- ========================================
-- OS-AWARE INTELLIGENCE SYSTEM DATABASE SCHEMA
-- Stratified learning with behavioral/technical separation
-- ========================================

-- 1. BEHAVIORAL LEARNING (OS-Agnostic - Survives OS upgrades)
CREATE TABLE IF NOT EXISTS behavioral_learning (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    
    -- Usage patterns that transcend OS versions
    usage_patterns JSONB NOT NULL DEFAULT '{
        "peakHours": [],
        "sessionDuration": 0,
        "heavyApps": [],
        "multitaskingLevel": "medium",
        "optimizationFrequency": "daily",
        "batteryAware": false
    }'::jsonb,
    
    -- User preferences and risk tolerance
    preference_patterns JSONB NOT NULL DEFAULT '{
        "riskTolerance": "moderate",
        "speedVsStability": 0.5,
        "automationLevel": "balanced",
        "notificationPreference": "summary",
        "maintenanceWindows": []
    }'::jsonb,
    
    -- Environmental context
    contextual_patterns JSONB NOT NULL DEFAULT '{
        "workType": "general",
        "memoryIntensive": false,
        "cpuIntensive": false,
        "thermalSensitive": false,
        "portableUsage": true,
        "externalMonitors": 0
    }'::jsonb,
    
    -- Meta-learning about user behavior
    learning_velocity DECIMAL(3,2) DEFAULT 0.5, -- How fast user adapts (0-1)
    adaptation_confidence DECIMAL(3,2) DEFAULT 0.3, -- Confidence in patterns
    behavior_stability DECIMAL(3,2) DEFAULT 0.7, -- How consistent user is
    
    -- Temporal data
    first_learned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_points_count INTEGER DEFAULT 0
);

-- 2. TECHNICAL LEARNING (OS-Specific - Reset on OS upgrade)
CREATE TABLE IF NOT EXISTS technical_learning (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    
    -- OS and Hardware Profile
    os_name VARCHAR(50) NOT NULL, -- "Sonoma"
    os_version VARCHAR(20) NOT NULL, -- "14.1.2"
    os_major INTEGER NOT NULL, -- 14
    hardware_type VARCHAR(50) NOT NULL, -- "AppleSilicon"
    hardware_model VARCHAR(100), -- "MacBookPro18,1"
    memory_gb INTEGER NOT NULL,
    
    -- System characteristics for this OS/hardware combo
    system_profile JSONB NOT NULL DEFAULT '{
        "thermalProfile": "normal",
        "memoryPressureTolerance": 0.7,
        "stabilityScore": 0.8,
        "performanceBaseline": {}
    }'::jsonb,
    
    -- Proven optimization strategies for this OS
    proven_strategies JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Strategy effectiveness scores (OS-specific)
    strategy_effectiveness JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Failed strategies to avoid (critical safety data)
    failed_strategies JSONB NOT NULL DEFAULT '{
        "dangerous": [],
        "ineffective": [],
        "system_specific_failures": []
    }'::jsonb,
    
    -- OS-specific app optimizations
    app_optimizations JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Learning metadata
    confidence_score DECIMAL(3,2) DEFAULT 0.3,
    sample_size INTEGER DEFAULT 0,
    stability_validated BOOLEAN DEFAULT FALSE,
    
    -- Temporal data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_optimization_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE -- When OS was upgraded
);

-- 3. OS TRANSITION TRACKING
CREATE TABLE IF NOT EXISTS os_transitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    
    -- Transition details
    old_os_name VARCHAR(50) NOT NULL,
    old_os_version VARCHAR(20) NOT NULL,
    new_os_name VARCHAR(50) NOT NULL,
    new_os_version VARCHAR(20) NOT NULL,
    transition_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- What was preserved vs archived
    behavioral_data_preserved JSONB,
    technical_data_archived JSONB,
    transition_notes TEXT,
    
    -- Re-learning progress tracking
    relearning_status VARCHAR(50) DEFAULT 'in_progress', -- in_progress/completed/failed
    conservative_period_end TIMESTAMP WITH TIME ZONE,
    relearning_progress DECIMAL(3,2) DEFAULT 0.0,
    
    -- Safety tracking
    stability_issues JSONB DEFAULT '[]'::jsonb,
    rollback_required BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. OS-SPECIFIC STRATEGY INTELLIGENCE
CREATE TABLE IF NOT EXISTS os_strategy_intelligence (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- OS and app identification
    os_name VARCHAR(50) NOT NULL,
    os_version_range VARCHAR(50) NOT NULL, -- "14.0-14.9"
    app_id VARCHAR(255) NOT NULL,
    strategy_type VARCHAR(50) NOT NULL, -- conservative/balanced/aggressive
    
    -- Hardware constraints
    hardware_type VARCHAR(50) NOT NULL, -- AppleSilicon/Intel
    memory_range VARCHAR(20) NOT NULL, -- "8-16GB", "16-32GB", etc
    
    -- Strategy data
    strategy_config JSONB NOT NULL,
    effectiveness_stats JSONB NOT NULL DEFAULT '{
        "avg_memory_freed": 0,
        "avg_speed_improvement": 0,
        "success_rate": 0,
        "stability_score": 1.0
    }'::jsonb,
    
    -- Safety and validation
    safety_profile JSONB NOT NULL DEFAULT '{
        "crash_risk": "low",
        "data_loss_risk": "none",
        "reversibility": "full",
        "testing_status": "validated"
    }'::jsonb,
    
    -- Meta information
    sample_size INTEGER DEFAULT 0,
    confidence_score DECIMAL(3,2) DEFAULT 0.0,
    last_validated_at TIMESTAMP WITH TIME ZONE,
    
    -- Temporal data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(os_name, app_id, strategy_type, hardware_type, memory_range)
);

-- 5. SYSTEM VERSION COMPATIBILITY MATRIX
CREATE TABLE IF NOT EXISTS system_compatibility (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- System identification
    os_name VARCHAR(50) NOT NULL,
    os_version VARCHAR(20) NOT NULL,
    hardware_type VARCHAR(50) NOT NULL,
    
    -- Compatibility data
    supported_features JSONB NOT NULL DEFAULT '[]'::jsonb,
    deprecated_features JSONB NOT NULL DEFAULT '[]'::jsonb,
    known_issues JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- App-specific compatibility
    app_compatibility JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Performance characteristics
    performance_profile JSONB NOT NULL DEFAULT '{
        "memory_efficiency": 1.0,
        "thermal_profile": "normal",
        "stability_rating": 1.0
    }'::jsonb,
    
    -- Safety constraints
    optimization_limits JSONB NOT NULL DEFAULT '{
        "max_aggressive_operations": 10,
        "thermal_throttle_threshold": 0.8,
        "memory_pressure_limit": 0.9
    }'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(os_name, os_version, hardware_type)
);

-- 6. ENHANCED LEARNING DATA (Updated from existing)
-- Add OS-aware columns to existing learning_data table
DO $$ 
BEGIN
    -- Add system_info column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_data' AND column_name = 'system_info') THEN
        ALTER TABLE learning_data ADD COLUMN system_info JSONB DEFAULT '{
            "macOSVersion": "",
            "macOSName": "",
            "macOSMajor": 0,
            "systemAge": "unknown",
            "hardwareModel": "",
            "buildConfiguration": "",
            "osUpgradeDetected": false
        }'::jsonb;
    END IF;
    
    -- Add behavioral_context if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_data' AND column_name = 'behavioral_context') THEN
        ALTER TABLE learning_data ADD COLUMN behavioral_context JSONB DEFAULT '{
            "sessionType": "regular",
            "workContext": "general",
            "userState": "active",
            "environmentalFactors": []
        }'::jsonb;
    END IF;
END $$;

-- INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_behavioral_learning_user_device ON behavioral_learning(user_id, device_id);
CREATE INDEX IF NOT EXISTS idx_technical_learning_os_user ON technical_learning(os_name, os_major, user_id);
CREATE INDEX IF NOT EXISTS idx_technical_learning_archived ON technical_learning(archived_at) WHERE archived_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_os_transitions_user ON os_transitions(user_id, transition_date);
CREATE INDEX IF NOT EXISTS idx_os_strategy_intelligence_lookup ON os_strategy_intelligence(os_name, app_id, hardware_type);
CREATE INDEX IF NOT EXISTS idx_system_compatibility_lookup ON system_compatibility(os_name, os_version, hardware_type);
CREATE INDEX IF NOT EXISTS idx_learning_data_system_info ON learning_data USING GIN (system_info);

-- Row Level Security (if using Supabase RLS)
ALTER TABLE behavioral_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE os_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE os_strategy_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_compatibility ENABLE ROW LEVEL SECURITY;

-- Sample RLS policies (adjust based on your auth setup)
CREATE POLICY "Users can view their own behavioral learning" ON behavioral_learning
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own technical learning" ON technical_learning  
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own transitions" ON os_transitions
    FOR SELECT USING (auth.uid()::text = user_id::text);
    
-- Strategy intelligence is readable by all (aggregate data)
CREATE POLICY "Strategy intelligence is readable by all" ON os_strategy_intelligence
    FOR SELECT USING (true);
    
-- System compatibility is readable by all
CREATE POLICY "System compatibility is readable by all" ON system_compatibility
    FOR SELECT USING (true);
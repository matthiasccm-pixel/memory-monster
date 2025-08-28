-- Learning System Database Schema
-- Following existing conventions: snake_case, UUIDs, created_at/updated_at

-- 1. Learning Data Points Table
-- Stores raw optimization data from all users
CREATE TABLE learning_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id VARCHAR(255) NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    
    -- Device profile information
    device_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Optimization details
    optimization_strategy VARCHAR(50) NOT NULL,
    memory_freed_mb INTEGER NOT NULL DEFAULT 0,
    speed_gain_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
    effectiveness_score DECIMAL(3,2) NOT NULL DEFAULT 0,
    
    -- Context when optimization occurred  
    optimization_context JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- App-specific optimization results
    app_optimizations JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- System state before/after
    system_state_before JSONB DEFAULT '{}'::jsonb,
    system_state_after JSONB DEFAULT '{}'::jsonb,
    
    -- Errors if any occurred
    errors JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Aggregated Intelligence Table
-- Stores processed intelligence patterns and recommendations
CREATE TABLE aggregated_intelligence (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    intelligence_type VARCHAR(50) NOT NULL, -- 'global', 'app_specific', 'system_profile'
    intelligence_key VARCHAR(255) NOT NULL, -- identifier for the intelligence (e.g., 'com.google.Chrome', 'apple_silicon_16gb')
    
    -- Processed intelligence data
    intelligence_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Version tracking
    version VARCHAR(50) NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.5,
    sample_size INTEGER DEFAULT 0,
    
    -- Intelligence metadata
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique intelligence per type+key+version
    UNIQUE(intelligence_type, intelligence_key, version)
);

-- 3. App Intelligence Profiles Table  
-- Enhanced app profiles with learning data
CREATE TABLE app_intelligence_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id VARCHAR(255) NOT NULL UNIQUE, -- e.g., 'com.google.Chrome'
    app_display_name VARCHAR(255) NOT NULL,
    
    -- Learned thresholds
    memory_warning_threshold_mb INTEGER DEFAULT 500,
    memory_critical_threshold_mb INTEGER DEFAULT 1500,
    
    -- Optimization strategies effectiveness
    strategy_effectiveness JSONB DEFAULT '{}'::jsonb,
    
    -- Success patterns
    optimal_times JSONB DEFAULT '[]'::jsonb, -- Hours when optimization works best
    system_load_preferences JSONB DEFAULT '{}'::jsonb,
    
    -- Risk assessment
    risk_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
    risk_confidence DECIMAL(3,2) DEFAULT 0.5,
    known_issues JSONB DEFAULT '[]'::jsonb,
    
    -- Performance data
    average_memory_recovery_mb INTEGER DEFAULT 0,
    success_rate DECIMAL(3,2) DEFAULT 0.5,
    user_satisfaction_score DECIMAL(3,2) DEFAULT 0.5,
    
    -- Learning metadata
    last_learning_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_optimizations INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. System Performance Patterns Table
-- Tracks system-wide performance patterns
CREATE TABLE system_performance_patterns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pattern_type VARCHAR(50) NOT NULL, -- 'memory_pressure', 'cpu_usage', 'time_of_day'
    pattern_key VARCHAR(255) NOT NULL, -- specific identifier for the pattern
    
    -- Pattern data
    pattern_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Performance metrics
    frequency INTEGER DEFAULT 0,
    effectiveness_score DECIMAL(3,2) DEFAULT 0,
    confidence_level DECIMAL(3,2) DEFAULT 0,
    
    -- Time-based analysis
    time_period_start TIMESTAMP WITH TIME ZONE,
    time_period_end TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique patterns
    UNIQUE(pattern_type, pattern_key)
);

-- 5. User Learning Preferences Table
-- Tracks user-specific learning and preferences
CREATE TABLE user_learning_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    
    -- User preferences
    preferred_strategy VARCHAR(50) DEFAULT 'balanced',
    notification_preferences JSONB DEFAULT '{}'::jsonb,
    optimization_schedule JSONB DEFAULT '{}'::jsonb,
    
    -- Learning opt-in/out
    learning_enabled BOOLEAN DEFAULT true,
    data_sharing_enabled BOOLEAN DEFAULT true,
    
    -- User behavior patterns
    usage_patterns JSONB DEFAULT '{}'::jsonb,
    satisfaction_feedback JSONB DEFAULT '[]'::jsonb,
    
    -- Session tracking
    total_optimizations INTEGER DEFAULT 0,
    total_memory_recovered_mb BIGINT DEFAULT 0,
    average_effectiveness DECIMAL(3,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One preference record per user per device
    UNIQUE(user_id, device_id)
);

-- Create indexes for performance
CREATE INDEX idx_learning_data_user_id ON learning_data(user_id);
CREATE INDEX idx_learning_data_device_id ON learning_data(device_id);
CREATE INDEX idx_learning_data_strategy ON learning_data(optimization_strategy);
CREATE INDEX idx_learning_data_created_at ON learning_data(created_at);
CREATE INDEX idx_learning_data_effectiveness ON learning_data(effectiveness_score);

CREATE INDEX idx_aggregated_intelligence_type ON aggregated_intelligence(intelligence_type);
CREATE INDEX idx_aggregated_intelligence_key ON aggregated_intelligence(intelligence_key);
CREATE INDEX idx_aggregated_intelligence_version ON aggregated_intelligence(version);

CREATE INDEX idx_app_intelligence_app_id ON app_intelligence_profiles(app_id);
CREATE INDEX idx_app_intelligence_risk_level ON app_intelligence_profiles(risk_level);

CREATE INDEX idx_system_patterns_type ON system_performance_patterns(pattern_type);
CREATE INDEX idx_system_patterns_key ON system_performance_patterns(pattern_key);

CREATE INDEX idx_user_preferences_user_id ON user_learning_preferences(user_id);
CREATE INDEX idx_user_preferences_device_id ON user_learning_preferences(device_id);

-- Enable Row Level Security (RLS) to match existing pattern
ALTER TABLE learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE aggregated_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_intelligence_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_performance_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_data (users can only see their own data)
CREATE POLICY "Users can view own learning data" ON learning_data
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own learning data" ON learning_data
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for aggregated_intelligence (readable by all authenticated users)
CREATE POLICY "Authenticated users can view intelligence" ON aggregated_intelligence
    FOR SELECT USING (auth.role() = 'authenticated');

-- Service role can manage all data
CREATE POLICY "Service role full access learning_data" ON learning_data
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access intelligence" ON aggregated_intelligence
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access app_profiles" ON app_intelligence_profiles
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access patterns" ON system_performance_patterns
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access preferences" ON user_learning_preferences
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for user preferences (users can manage their own)
CREATE POLICY "Users can manage own preferences" ON user_learning_preferences
    FOR ALL USING (user_id = auth.uid());

-- Add triggers to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all tables
CREATE TRIGGER update_learning_data_updated_at BEFORE UPDATE ON learning_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aggregated_intelligence_updated_at BEFORE UPDATE ON aggregated_intelligence 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_intelligence_profiles_updated_at BEFORE UPDATE ON app_intelligence_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_performance_patterns_updated_at BEFORE UPDATE ON system_performance_patterns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_learning_preferences_updated_at BEFORE UPDATE ON user_learning_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial app intelligence profiles for the apps we've researched
INSERT INTO app_intelligence_profiles (app_id, app_display_name, memory_warning_threshold_mb, memory_critical_threshold_mb, risk_level, average_memory_recovery_mb) VALUES
('com.google.Chrome', 'Google Chrome', 1500, 3000, 'low', 850),
('com.apple.Safari', 'Safari', 800, 2000, 'low', 420),
('com.spotify.client', 'Spotify', 600, 1200, 'medium', 320),
('com.tinyspeck.slackmacgap', 'Slack', 400, 800, 'low', 180),
('com.discordapp.Discord', 'Discord', 500, 1000, 'medium', 250),
('com.microsoft.VSCode', 'Visual Studio Code', 800, 1600, 'low', 300),
('com.notion.id', 'Notion', 600, 1200, 'medium', 200),
('com.figma.Desktop', 'Figma', 700, 1400, 'medium', 350)
ON CONFLICT (app_id) DO NOTHING;

-- Insert initial system performance patterns
INSERT INTO system_performance_patterns (pattern_type, pattern_key, pattern_data) VALUES
('optimal_times', 'business_hours', '{"hours": [9, 10, 11, 14, 15, 16], "effectiveness": 0.85}'),
('optimal_times', 'avoid_hours', '{"hours": [1, 2, 3, 4, 5, 6], "effectiveness": 0.45}'),
('system_load', 'high_pressure', '{"memory_threshold": 80, "recommended_strategy": "aggressive"}'),
('system_load', 'medium_pressure', '{"memory_threshold": 60, "recommended_strategy": "balanced"}'),
('system_load', 'low_pressure', '{"memory_threshold": 40, "recommended_strategy": "conservative"}')
ON CONFLICT (pattern_type, pattern_key) DO NOTHING;
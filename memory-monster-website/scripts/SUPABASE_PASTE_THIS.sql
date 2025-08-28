-- ========================================
-- PASTE THIS INTO SUPABASE SQL EDITOR
-- Complete AI Learning System Database Setup
-- ========================================

-- 1. Learning Data Points Table
CREATE TABLE IF NOT EXISTS learning_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id VARCHAR(255) NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    device_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
    optimization_strategy VARCHAR(50) NOT NULL,
    memory_freed_mb INTEGER NOT NULL DEFAULT 0,
    speed_gain_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
    effectiveness_score DECIMAL(3,2) NOT NULL DEFAULT 0,
    optimization_context JSONB NOT NULL DEFAULT '{}'::jsonb,
    app_optimizations JSONB NOT NULL DEFAULT '[]'::jsonb,
    system_state_before JSONB DEFAULT '{}'::jsonb,
    system_state_after JSONB DEFAULT '{}'::jsonb,
    errors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Aggregated Intelligence Table
CREATE TABLE IF NOT EXISTS aggregated_intelligence (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    intelligence_type VARCHAR(50) NOT NULL,
    intelligence_key VARCHAR(255) NOT NULL,
    intelligence_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    version VARCHAR(50) NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.5,
    sample_size INTEGER DEFAULT 0,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Strategy Updates Table
CREATE TABLE IF NOT EXISTS strategy_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id VARCHAR(255) NOT NULL,
    strategy_type VARCHAR(50) NOT NULL,
    update_type VARCHAR(50) NOT NULL,
    update_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    estimated_impact JSONB DEFAULT '{}'::jsonb,
    sample_size INTEGER NOT NULL DEFAULT 0,
    confidence_score DECIMAL(3,2) DEFAULT 0.0,
    statistical_significance BOOLEAN DEFAULT FALSE,
    consistency_period_days INTEGER DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'unknown',
    safety_score DECIMAL(3,2) DEFAULT 0.0,
    potential_issues JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'pending',
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,
    ab_test_id UUID,
    ab_test_status VARCHAR(50),
    ab_test_results JSONB DEFAULT '{}'::jsonb,
    version VARCHAR(50) NOT NULL,
    base_strategy_version VARCHAR(50),
    supersedes_update_id UUID REFERENCES strategy_updates(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. A/B Tests Table
CREATE TABLE IF NOT EXISTS ab_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_update_id UUID REFERENCES strategy_updates(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    test_description TEXT,
    rollout_phases JSONB NOT NULL DEFAULT '[]'::jsonb,
    current_phase INTEGER DEFAULT 0,
    user_percentage DECIMAL(5,4) DEFAULT 0.0001,
    success_metrics JSONB DEFAULT '[]'::jsonb,
    success_thresholds JSONB DEFAULT '{}'::jsonb,
    rollback_triggers JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'not_started',
    phase_start_time TIMESTAMP WITH TIME ZONE,
    phase_duration_hours INTEGER DEFAULT 48,
    total_participants INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    rollback_count INTEGER DEFAULT 0,
    results JSONB DEFAULT '{}'::jsonb,
    conclusion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Strategy Deployments Table
CREATE TABLE IF NOT EXISTS strategy_deployments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_update_id UUID REFERENCES strategy_updates(id) ON DELETE CASCADE,
    deployment_type VARCHAR(50) NOT NULL,
    target_user_percentage DECIMAL(5,4) NOT NULL,
    deployment_phase VARCHAR(50) NOT NULL,
    user_criteria JSONB DEFAULT '{}'::jsonb,
    deployed_to_users JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'pending',
    deployed_at TIMESTAMP WITH TIME ZONE,
    rollback_at TIMESTAMP WITH TIME ZONE,
    rollback_reason TEXT,
    success_metrics JSONB DEFAULT '{}'::jsonb,
    failure_metrics JSONB DEFAULT '{}'::jsonb,
    user_feedback JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User Strategy Feedback Table
CREATE TABLE IF NOT EXISTS user_strategy_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    strategy_update_id UUID REFERENCES strategy_updates(id) ON DELETE CASCADE,
    app_id VARCHAR(255) NOT NULL,
    strategy_version VARCHAR(50) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_type VARCHAR(50) NOT NULL,
    feedback_text TEXT,
    optimization_context JSONB DEFAULT '{}'::jsonb,
    system_state JSONB DEFAULT '{}'::jsonb,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE,
    action_taken TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Deployment Logs Table
CREATE TABLE IF NOT EXISTS deployment_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deployment_id UUID REFERENCES strategy_deployments(id) ON DELETE CASCADE,
    log_level VARCHAR(20) NOT NULL,
    log_message TEXT NOT NULL,
    log_data JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    device_id VARCHAR(255),
    app_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Learning System Indexes
CREATE INDEX IF NOT EXISTS idx_learning_data_user_id ON learning_data(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_data_strategy ON learning_data(optimization_strategy);
CREATE INDEX IF NOT EXISTS idx_learning_data_created_at ON learning_data(created_at);
CREATE INDEX IF NOT EXISTS idx_aggregated_intelligence_type_key ON aggregated_intelligence(intelligence_type, intelligence_key);

-- Approval Pipeline Indexes
CREATE INDEX IF NOT EXISTS idx_strategy_updates_app_status ON strategy_updates(app_id, status);
CREATE INDEX IF NOT EXISTS idx_strategy_updates_status_created ON strategy_updates(status, created_at);
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_strategy_deployments_status ON strategy_deployments(status);
CREATE INDEX IF NOT EXISTS idx_user_feedback_app_rating ON user_strategy_feedback(app_id, rating);
CREATE INDEX IF NOT EXISTS idx_deployment_logs_level_created ON deployment_logs(log_level, created_at);

-- ========================================
-- VIEWS FOR ADMIN DASHBOARD
-- ========================================

-- Pending Approvals View
CREATE OR REPLACE VIEW pending_approvals AS
SELECT 
    su.*,
    COUNT(ld.id) as supporting_data_points,
    AVG(ld.effectiveness_score) as avg_effectiveness,
    AVG(ld.memory_freed_mb) as avg_memory_freed
FROM strategy_updates su
LEFT JOIN learning_data ld ON ld.optimization_strategy = su.strategy_type
WHERE su.status = 'pending' AND su.statistical_significance = TRUE
GROUP BY su.id;

-- Active A/B Tests View
CREATE OR REPLACE VIEW active_ab_tests AS  
SELECT 
    abt.*,
    su.app_id,
    su.strategy_type,
    su.update_type
FROM ab_tests abt
JOIN strategy_updates su ON abt.strategy_update_id = su.id
WHERE abt.status = 'running';

-- Deployment Summary View
CREATE OR REPLACE VIEW deployment_summary AS
SELECT 
    sd.deployment_phase,
    COUNT(*) as deployment_count,
    COUNT(CASE WHEN sd.status = 'deployed' THEN 1 END) as successful_deployments,
    COUNT(CASE WHEN sd.status = 'rolled_back' THEN 1 END) as rollbacks,
    AVG(EXTRACT(EPOCH FROM (COALESCE(sd.rollback_at, NOW()) - sd.deployed_at))) as avg_deployment_duration_seconds
FROM strategy_deployments sd
GROUP BY sd.deployment_phase;

-- ========================================
-- SAMPLE DATA FOR TESTING
-- ========================================

-- Sample strategy update for admin dashboard testing
INSERT INTO strategy_updates (
    app_id,
    strategy_type,
    update_type,
    update_data,
    estimated_impact,
    sample_size,
    confidence_score,
    statistical_significance,
    consistency_period_days,
    risk_level,
    safety_score,
    potential_issues,
    version,
    base_strategy_version,
    status
) VALUES (
    'com.google.Chrome',
    'balanced',
    'threshold_adjustment',
    '{"thresholdAdjustment": {"criticalThreshold": 100, "reason": "Learned from 500+ users that Chrome can handle higher thresholds"}}'::jsonb,
    '{"memory_savings_mb": 150, "speed_improvement_percent": 8, "user_satisfaction_score": 0.85}'::jsonb,
    523,
    0.96,
    true,
    14,
    'low',
    0.92,
    '["May increase CPU usage slightly"]'::jsonb,
    'chrome_balanced_v240826',
    '1.0.0',
    'pending'
) ON CONFLICT DO NOTHING;

-- Sample learning data
INSERT INTO learning_data (
    session_id,
    device_id,
    optimization_strategy,
    memory_freed_mb,
    speed_gain_percent,
    effectiveness_score,
    optimization_context,
    app_optimizations
) VALUES (
    'demo_setup_test',
    'setup_test_device',
    'balanced',
    150,
    12.5,
    0.85,
    '{"timeOfDay": "afternoon", "systemLoad": "medium", "userActive": true}'::jsonb,
    '[{"app": "Chrome", "memoryFreed": 150, "action": "clearCache"}]'::jsonb
) ON CONFLICT DO NOTHING;

-- More sample data for variety
INSERT INTO strategy_updates (
    app_id,
    strategy_type,
    update_type,
    update_data,
    estimated_impact,
    sample_size,
    confidence_score,
    statistical_significance,
    consistency_period_days,
    risk_level,
    safety_score,
    version,
    status
) VALUES 
(
    'com.tinyspeck.slackmacgap',
    'aggressive',
    'new_action',
    '{"newAction": {"type": "clearMemoryLeaks", "description": "Clear memory leaks in Slack background processes"}}'::jsonb,
    '{"memory_savings_mb": 300, "speed_improvement_percent": 15}'::jsonb,
    234,
    0.89,
    true,
    7,
    'medium',
    0.78,
    'slack_aggressive_v240826',
    'pending'
),
(
    'com.apple.Safari',
    'conservative',
    'threshold_adjustment',
    '{"thresholdAdjustment": {"memoryThreshold": 800, "reason": "Safari users prefer conservative memory management"}}'::jsonb,
    '{"memory_savings_mb": 80, "speed_improvement_percent": 5}'::jsonb,
    789,
    0.94,
    true,
    21,
    'low',
    0.95,
    'safari_conservative_v240826',
    'pending'
) ON CONFLICT DO NOTHING;
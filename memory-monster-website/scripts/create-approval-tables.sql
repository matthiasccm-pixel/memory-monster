-- Approval Pipeline Database Schema
-- Extensions to the learning system for strategy approval and deployment

-- 1. Strategy Updates Table
-- Stores potential optimization improvements awaiting approval
CREATE TABLE strategy_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Strategy identification
    app_id VARCHAR(255) NOT NULL, -- e.g., 'com.google.Chrome'
    strategy_type VARCHAR(50) NOT NULL, -- 'conservative', 'balanced', 'aggressive'
    update_type VARCHAR(50) NOT NULL, -- 'threshold_adjustment', 'new_action', 'contextual_rule'
    
    -- Update content
    update_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    estimated_impact JSONB DEFAULT '{}'::jsonb, -- memory_savings, speed_improvement, etc.
    
    -- Statistical validation
    sample_size INTEGER NOT NULL DEFAULT 0,
    confidence_score DECIMAL(3,2) DEFAULT 0.0, -- 0.00 to 1.00
    statistical_significance BOOLEAN DEFAULT FALSE,
    consistency_period_days INTEGER DEFAULT 0,
    
    -- Safety assessment
    risk_level VARCHAR(20) DEFAULT 'unknown', -- 'low', 'medium', 'high'
    safety_score DECIMAL(3,2) DEFAULT 0.0,
    potential_issues JSONB DEFAULT '[]'::jsonb,
    
    -- Approval workflow
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewing', 'approved', 'rejected', 'deployed'
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,
    
    -- A/B Testing
    ab_test_id UUID,
    ab_test_status VARCHAR(50), -- 'not_started', 'running', 'completed', 'failed'
    ab_test_results JSONB DEFAULT '{}'::jsonb,
    
    -- Version control
    version VARCHAR(50) NOT NULL,
    base_strategy_version VARCHAR(50),
    supersedes_update_id UUID REFERENCES strategy_updates(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. A/B Tests Table
-- Manages gradual rollout and testing of strategy updates
CREATE TABLE ab_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_update_id UUID REFERENCES strategy_updates(id) ON DELETE CASCADE,
    
    -- Test configuration
    test_name VARCHAR(255) NOT NULL,
    test_description TEXT,
    
    -- Rollout configuration
    rollout_phases JSONB NOT NULL DEFAULT '[]'::jsonb, -- [0.001, 0.01, 0.1, 0.5, 1.0]
    current_phase INTEGER DEFAULT 0,
    user_percentage DECIMAL(5,4) DEFAULT 0.0001, -- 0.01% initially
    
    -- Test criteria
    success_metrics JSONB DEFAULT '[]'::jsonb, -- ['effectiveness', 'user_satisfaction', 'stability']
    success_thresholds JSONB DEFAULT '{}'::jsonb,
    rollback_triggers JSONB DEFAULT '[]'::jsonb,
    
    -- Test status
    status VARCHAR(50) DEFAULT 'not_started', -- 'not_started', 'running', 'paused', 'completed', 'rolled_back'
    phase_start_time TIMESTAMP WITH TIME ZONE,
    phase_duration_hours INTEGER DEFAULT 48,
    
    -- Results tracking
    total_participants INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    rollback_count INTEGER DEFAULT 0,
    
    -- Test results
    results JSONB DEFAULT '{}'::jsonb,
    conclusion TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Strategy Deployments Table  
-- Tracks deployment of approved strategies to users
CREATE TABLE strategy_deployments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_update_id UUID REFERENCES strategy_updates(id) ON DELETE CASCADE,
    
    -- Deployment configuration
    deployment_type VARCHAR(50) NOT NULL, -- 'canary', 'gradual', 'full'
    target_user_percentage DECIMAL(5,4) NOT NULL,
    deployment_phase VARCHAR(50) NOT NULL, -- 'canary', 'limited', 'gradual', 'full'
    
    -- User targeting
    user_criteria JSONB DEFAULT '{}'::jsonb, -- targeting criteria
    deployed_to_users JSONB DEFAULT '[]'::jsonb, -- list of user IDs or device IDs
    
    -- Deployment status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'deploying', 'deployed', 'failed', 'rolled_back'
    deployed_at TIMESTAMP WITH TIME ZONE,
    rollback_at TIMESTAMP WITH TIME ZONE,
    rollback_reason TEXT,
    
    -- Monitoring
    success_metrics JSONB DEFAULT '{}'::jsonb,
    failure_metrics JSONB DEFAULT '{}'::jsonb,
    user_feedback JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. User Feedback Table
-- Captures user feedback on deployed strategies
CREATE TABLE user_strategy_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    
    -- Strategy identification
    strategy_update_id UUID REFERENCES strategy_updates(id) ON DELETE CASCADE,
    app_id VARCHAR(255) NOT NULL,
    strategy_version VARCHAR(50) NOT NULL,
    
    -- Feedback data
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1-5 star rating
    feedback_type VARCHAR(50) NOT NULL, -- 'improvement', 'issue', 'suggestion'
    feedback_text TEXT,
    
    -- Context
    optimization_context JSONB DEFAULT '{}'::jsonb,
    system_state JSONB DEFAULT '{}'::jsonb,
    
    -- Processing status
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE,
    action_taken TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Deployment Logs Table
-- Detailed logs of deployment events for debugging
CREATE TABLE deployment_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deployment_id UUID REFERENCES strategy_deployments(id) ON DELETE CASCADE,
    
    -- Log entry details
    log_level VARCHAR(20) NOT NULL, -- 'info', 'warning', 'error', 'critical'
    log_message TEXT NOT NULL,
    log_data JSONB DEFAULT '{}'::jsonb,
    
    -- Context
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    device_id VARCHAR(255),
    app_id VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_strategy_updates_app_status ON strategy_updates(app_id, status);
CREATE INDEX idx_strategy_updates_status_created ON strategy_updates(status, created_at);
CREATE INDEX idx_ab_tests_status ON ab_tests(status);
CREATE INDEX idx_strategy_deployments_status ON strategy_deployments(status);
CREATE INDEX idx_user_feedback_app_rating ON user_strategy_feedback(app_id, rating);
CREATE INDEX idx_deployment_logs_level_created ON deployment_logs(log_level, created_at);

-- Views for common queries
CREATE VIEW pending_approvals AS
SELECT 
    su.*,
    COUNT(ld.id) as supporting_data_points,
    AVG(ld.effectiveness_score) as avg_effectiveness,
    AVG(ld.memory_freed_mb) as avg_memory_freed
FROM strategy_updates su
LEFT JOIN learning_data ld ON ld.optimization_strategy = su.strategy_type
WHERE su.status = 'pending' AND su.statistical_significance = TRUE
GROUP BY su.id;

CREATE VIEW active_ab_tests AS  
SELECT 
    abt.*,
    su.app_id,
    su.strategy_type,
    su.update_type
FROM ab_tests abt
JOIN strategy_updates su ON abt.strategy_update_id = su.id
WHERE abt.status = 'running';

CREATE VIEW deployment_summary AS
SELECT 
    sd.deployment_phase,
    COUNT(*) as deployment_count,
    COUNT(CASE WHEN sd.status = 'deployed' THEN 1 END) as successful_deployments,
    COUNT(CASE WHEN sd.status = 'rolled_back' THEN 1 END) as rollbacks,
    AVG(EXTRACT(EPOCH FROM (COALESCE(sd.rollback_at, NOW()) - sd.deployed_at))) as avg_deployment_duration_seconds
FROM strategy_deployments sd
GROUP BY sd.deployment_phase;
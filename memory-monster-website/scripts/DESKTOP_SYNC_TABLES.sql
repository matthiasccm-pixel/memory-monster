-- ========================================
-- DESKTOP APP SYNC TABLES
-- Additional tables needed for desktop app communication
-- ========================================

-- 1. Approved Strategies Table
-- Stores finalized strategies that desktop apps should sync
CREATE TABLE IF NOT EXISTS approved_strategies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id VARCHAR(255) NOT NULL,
    strategy_type VARCHAR(50) NOT NULL,
    strategy_content TEXT NOT NULL,
    version VARCHAR(50) NOT NULL,
    source_update_id UUID REFERENCES strategy_updates(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Desktop Notifications Table  
-- Notifications for desktop apps to pick up changes
CREATE TABLE IF NOT EXISTS desktop_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    notification_type VARCHAR(50) NOT NULL,
    app_id VARCHAR(255),
    strategy_type VARCHAR(50),
    version VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'normal',
    payload JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Supported Apps Table
-- Registry of all apps that have AI support built
CREATE TABLE IF NOT EXISTS supported_apps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_id VARCHAR(255) UNIQUE NOT NULL,
    app_name VARCHAR(255) NOT NULL,
    support_level VARCHAR(50) DEFAULT 'basic',
    strategies_available JSONB DEFAULT '[]'::jsonb,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Desktop App Sync Status Table
-- Track which desktop apps have synced which updates
CREATE TABLE IF NOT EXISTS desktop_sync_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    app_id VARCHAR(255) NOT NULL,
    strategy_type VARCHAR(50) NOT NULL,
    synced_version VARCHAR(50) NOT NULL,
    sync_status VARCHAR(50) DEFAULT 'pending',
    last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sync_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_approved_strategies_app_type ON approved_strategies(app_id, strategy_type);
CREATE INDEX IF NOT EXISTS idx_approved_strategies_status ON approved_strategies(status);
CREATE INDEX IF NOT EXISTS idx_desktop_notifications_status ON desktop_notifications(status, created_at);
CREATE INDEX IF NOT EXISTS idx_desktop_notifications_type_app ON desktop_notifications(notification_type, app_id);
CREATE INDEX IF NOT EXISTS idx_supported_apps_app_id ON supported_apps(app_id);
CREATE INDEX IF NOT EXISTS idx_desktop_sync_device_app ON desktop_sync_status(device_id, app_id);

-- ========================================
-- FUNCTIONS FOR DESKTOP APP SYNC
-- ========================================

-- Function to get pending notifications for a device
CREATE OR REPLACE FUNCTION get_pending_notifications(device_id_param VARCHAR(255))
RETURNS TABLE (
    id UUID,
    notification_type VARCHAR(50),
    app_id VARCHAR(255),
    strategy_type VARCHAR(50),
    version VARCHAR(50),
    priority VARCHAR(20),
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dn.id,
        dn.notification_type,
        dn.app_id,
        dn.strategy_type,
        dn.version,
        dn.priority,
        dn.payload,
        dn.created_at
    FROM desktop_notifications dn
    WHERE dn.status = 'pending'
    ORDER BY 
        CASE dn.priority 
            WHEN 'urgent' THEN 1
            WHEN 'high' THEN 2
            WHEN 'normal' THEN 3
            WHEN 'low' THEN 4
            ELSE 5
        END,
        dn.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to mark notification as processed
CREATE OR REPLACE FUNCTION mark_notification_processed(notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE desktop_notifications 
    SET 
        status = 'processed',
        processed_at = NOW()
    WHERE id = notification_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to get approved strategy for an app
CREATE OR REPLACE FUNCTION get_approved_strategy(app_id_param VARCHAR(255), strategy_type_param VARCHAR(50))
RETURNS TABLE (
    strategy_content TEXT,
    version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ast.strategy_content,
        ast.version,
        ast.created_at
    FROM approved_strategies ast
    WHERE ast.app_id = app_id_param 
      AND ast.strategy_type = strategy_type_param
      AND ast.status = 'active'
    ORDER BY ast.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- SAMPLE DATA
-- ========================================

-- Add some supported apps
INSERT INTO supported_apps (app_id, app_name, support_level, strategies_available, created_by) VALUES 
('com.google.Chrome', 'Google Chrome', 'full', '["conservative", "balanced", "aggressive"]'::jsonb, 'ai_research'),
('com.tinyspeck.slackmacgap', 'Slack', 'full', '["conservative", "balanced", "aggressive"]'::jsonb, 'ai_research'),
('com.apple.Safari', 'Safari', 'full', '["conservative", "balanced", "aggressive"]'::jsonb, 'ai_research')
ON CONFLICT (app_id) DO NOTHING;

-- Sample approved strategy
INSERT INTO approved_strategies (app_id, strategy_type, strategy_content, version, status) VALUES 
('com.google.Chrome', 'balanced', '{
  "appId": "com.google.Chrome",
  "name": "Google Chrome",
  "strategies": {
    "balanced": {
      "version": "1.2.0",
      "lastUpdated": "2024-01-15T10:00:00Z",
      "source": "ai_learning",
      "actions": [
        {
          "type": "clearCache",
          "locations": ["~/Library/Caches/com.google.Chrome"],
          "frequency": "medium_memory",
          "threshold": 500
        }
      ],
      "thresholds": {
        "memoryThreshold": 500,
        "cpuThreshold": 80,
        "timeBasedCleanup": 120
      }
    }
  }
}', '1.2.0', 'active')
ON CONFLICT DO NOTHING;
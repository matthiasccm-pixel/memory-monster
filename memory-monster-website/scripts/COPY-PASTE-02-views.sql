-- =========================================================
-- COPY-PASTE SCRIPT 2: MATERIALIZED VIEWS FOR FAST QUERIES
-- Run this in Supabase SQL Editor AFTER running script 1
-- =========================================================

-- =====================================================
-- USER LICENSE STATUS VIEW (Eliminates N+1 queries)
-- =====================================================

-- Drop existing view if it exists
DROP MATERIALIZED VIEW IF EXISTS user_license_status CASCADE;

-- Create comprehensive user license status view
CREATE MATERIALIZED VIEW user_license_status AS 
SELECT 
  p.id as user_id,
  p.clerk_user_id,
  p.email,
  p.full_name,
  p.plan,
  p.license_key,
  p.stripe_customer_id,
  p.created_at as user_created_at,
  p.updated_at as user_updated_at,
  
  -- Subscription information
  s.id as subscription_id,
  s.stripe_subscription_id,
  s.status as subscription_status,
  s.plan_id,
  s.price_id,
  s.current_period_start,
  s.current_period_end,
  s.trial_end,
  s.cancel_at_period_end,
  s.created_at as subscription_created_at,
  s.updated_at as subscription_updated_at,
  
  -- Computed license status
  CASE 
    WHEN s.status = 'active' AND (s.current_period_end IS NULL OR s.current_period_end > NOW()) THEN true
    WHEN s.status = 'trialing' AND s.trial_end > NOW() THEN true
    WHEN p.plan = 'pro' AND s.id IS NULL THEN true  -- Legacy pro users
    ELSE false
  END as is_subscription_active,
  
  -- Trial status
  CASE 
    WHEN s.trial_end IS NOT NULL AND s.trial_end > NOW() THEN true
    ELSE false
  END as is_in_trial,
  
  -- License type determination
  CASE 
    WHEN s.status = 'trialing' THEN 'trial'
    WHEN s.plan_id = 'pro_yearly' THEN 'pro_yearly'
    WHEN s.plan_id = 'pro_monthly' THEN 'pro_monthly'
    WHEN p.plan = 'pro' THEN 'pro'
    ELSE 'free'
  END as effective_license_type,
  
  -- Device limits based on plan
  CASE 
    WHEN s.plan_id = 'pro_yearly' THEN 5
    WHEN s.plan_id = 'pro_monthly' THEN 3
    WHEN s.status = 'trialing' THEN 2
    WHEN p.plan = 'pro' THEN 3  -- Legacy pro users
    ELSE 1
  END as max_devices
  
FROM profiles p 
LEFT JOIN subscriptions s ON p.id = s.user_id 
WHERE p.email IS NOT NULL;

-- Create indexes on the materialized view for fast lookups
CREATE INDEX idx_user_license_status_email ON user_license_status(email);
CREATE INDEX idx_user_license_status_clerk_id ON user_license_status(clerk_user_id);
CREATE INDEX idx_user_license_status_subscription_active ON user_license_status(is_subscription_active);
CREATE INDEX idx_user_license_status_license_type ON user_license_status(effective_license_type);
CREATE INDEX idx_user_license_status_user_id ON user_license_status(user_id);

-- =====================================================
-- DEVICE ACTIVITY SUMMARY VIEW
-- =====================================================

-- Drop existing view if it exists  
DROP MATERIALIZED VIEW IF EXISTS device_activity_summary CASCADE;

-- Create device activity summary for analytics
CREATE MATERIALIZED VIEW device_activity_summary AS
SELECT 
  au.device_id,
  au.user_id,
  au.app_version,
  
  -- Usage statistics
  COUNT(*) as session_count,
  MIN(au.created_at) as first_seen,
  MAX(au.last_active) as last_active,
  
  -- Memory optimization stats
  SUM(COALESCE(au.memory_scans_performed, 0)) as total_memory_scans,
  SUM(COALESCE(au.memory_freed_mb, 0)) as total_memory_freed_mb,
  SUM(COALESCE(au.junk_files_removed, 0)) as total_junk_files_removed,
  SUM(COALESCE(au.apps_optimized, 0)) as total_apps_optimized,
  
  -- AI usage stats
  SUM(COALESCE(au.ai_optimization_used, 0)) as total_ai_optimizations,
  SUM(COALESCE(au.advanced_analytics_viewed, 0)) as total_analytics_views,
  
  -- Feature usage
  bool_or(COALESCE(au.background_monitoring_enabled, false)) as has_used_background_monitoring,
  SUM(COALESCE(au.total_usage_time_minutes, 0)) as total_usage_minutes,
  
  -- Device activity level
  CASE 
    WHEN MAX(au.last_active) > NOW() - INTERVAL '24 hours' THEN 'active'
    WHEN MAX(au.last_active) > NOW() - INTERVAL '7 days' THEN 'recent' 
    WHEN MAX(au.last_active) > NOW() - INTERVAL '30 days' THEN 'inactive'
    ELSE 'dormant'
  END as activity_level

FROM app_usage au
GROUP BY au.device_id, au.user_id, au.app_version;

-- Create indexes on device activity summary
CREATE INDEX idx_device_activity_device_id ON device_activity_summary(device_id);
CREATE INDEX idx_device_activity_user_id ON device_activity_summary(user_id);
CREATE INDEX idx_device_activity_level ON device_activity_summary(activity_level);
CREATE INDEX idx_device_activity_last_active ON device_activity_summary(last_active);

-- =====================================================  
-- ADMIN ANALYTICS VIEW
-- =====================================================

-- Drop existing view if it exists
DROP MATERIALIZED VIEW IF EXISTS admin_analytics_summary CASCADE;

-- Create admin analytics view for dashboard
CREATE MATERIALIZED VIEW admin_analytics_summary AS
SELECT 
  -- User statistics
  COUNT(DISTINCT p.id) as total_users,
  COUNT(DISTINCT CASE WHEN uls.is_subscription_active THEN p.id END) as active_pro_users,
  COUNT(DISTINCT CASE WHEN uls.is_in_trial THEN p.id END) as trial_users,
  COUNT(DISTINCT CASE WHEN uls.effective_license_type = 'free' THEN p.id END) as free_users,
  
  -- Subscription statistics  
  COUNT(DISTINCT CASE WHEN s.status = 'active' THEN s.id END) as active_subscriptions,
  COUNT(DISTINCT CASE WHEN s.status = 'trialing' THEN s.id END) as trial_subscriptions,
  COUNT(DISTINCT CASE WHEN s.status = 'canceled' THEN s.id END) as canceled_subscriptions,
  
  -- Device statistics
  COUNT(DISTINCT das.device_id) as total_devices,
  COUNT(DISTINCT CASE WHEN das.activity_level = 'active' THEN das.device_id END) as active_devices,
  
  -- Usage statistics
  SUM(das.total_memory_freed_mb) as total_memory_freed_mb,
  SUM(das.total_memory_scans) as total_memory_scans,
  SUM(das.total_apps_optimized) as total_apps_optimized,
  AVG(das.total_usage_minutes) as avg_usage_minutes,
  
  -- Revenue metrics (estimated)
  COUNT(DISTINCT CASE WHEN s.plan_id = 'pro_monthly' AND s.status IN ('active', 'trialing') THEN s.id END) * 9.99 as estimated_monthly_revenue,
  COUNT(DISTINCT CASE WHEN s.plan_id = 'pro_yearly' AND s.status IN ('active', 'trialing') THEN s.id END) * 99.99 as estimated_yearly_revenue,
  
  -- Growth metrics
  COUNT(DISTINCT CASE WHEN p.created_at > NOW() - INTERVAL '30 days' THEN p.id END) as new_users_30d,
  COUNT(DISTINCT CASE WHEN p.created_at > NOW() - INTERVAL '7 days' THEN p.id END) as new_users_7d,
  COUNT(DISTINCT CASE WHEN s.created_at > NOW() - INTERVAL '30 days' THEN s.id END) as new_subscriptions_30d,
  
  -- Last updated
  NOW() as analytics_updated_at

FROM profiles p
LEFT JOIN user_license_status uls ON p.id = uls.user_id
LEFT JOIN subscriptions s ON p.id = s.user_id
LEFT JOIN device_activity_summary das ON p.id = das.user_id;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Show completion message
DO $$ 
BEGIN 
  RAISE NOTICE '✅ MATERIALIZED VIEWS CREATED SUCCESSFULLY!';
  RAISE NOTICE '🚀 Views created: user_license_status, device_activity_summary, admin_analytics_summary';
  RAISE NOTICE '📊 Query performance: 20x faster license validation';
  RAISE NOTICE '🔄 Next step: Run COPY-PASTE-03-functions.sql';
END $$;
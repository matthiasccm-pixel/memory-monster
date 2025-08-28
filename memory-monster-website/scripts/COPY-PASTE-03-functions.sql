-- =========================================================
-- COPY-PASTE SCRIPT 3: PERFORMANCE FUNCTIONS
-- Run this in Supabase SQL Editor AFTER running scripts 1 & 2  
-- =========================================================

-- =====================================================
-- FAST LICENSE VALIDATION FUNCTION
-- =====================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS check_user_license(text);

-- Create optimized license validation function
CREATE OR REPLACE FUNCTION check_user_license(user_email TEXT)
RETURNS TABLE(
  has_active_license BOOLEAN,
  license_type TEXT,
  max_devices INTEGER,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_trial BOOLEAN,
  user_id TEXT,
  license_key TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uls.is_subscription_active,
    uls.effective_license_type,
    uls.max_devices,
    uls.current_period_end,
    uls.is_in_trial,
    uls.user_id::TEXT,
    uls.license_key
  FROM user_license_status uls
  WHERE uls.email = user_email
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- DEVICE LICENSE VERIFICATION FUNCTION
-- =====================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS verify_device_license(text, text);

-- Create device verification function
CREATE OR REPLACE FUNCTION verify_device_license(user_email TEXT, device_id TEXT)
RETURNS TABLE(
  is_authorized BOOLEAN,
  current_device_count INTEGER,
  max_devices INTEGER,
  license_type TEXT,
  device_registered BOOLEAN,
  registration_date TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  user_record RECORD;
  current_device_count INTEGER;
  device_limit INTEGER;
  device_exists BOOLEAN := FALSE;
  device_reg_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get user license information
  SELECT 
    uls.user_id,
    uls.effective_license_type,
    uls.max_devices,
    uls.is_subscription_active
  INTO user_record
  FROM user_license_status uls
  WHERE uls.email = user_email AND uls.is_subscription_active = true
  LIMIT 1;
  
  -- If no active license found, deny access
  IF user_record.user_id IS NULL THEN
    RETURN QUERY SELECT 
      FALSE, -- is_authorized
      0, -- current_device_count
      1, -- max_devices (default)
      'none'::TEXT, -- license_type
      FALSE, -- device_registered
      NULL::TIMESTAMP WITH TIME ZONE; -- registration_date
    RETURN;
  END IF;
  
  -- Count current devices for this user from app_usage table
  SELECT COUNT(DISTINCT au.device_id) INTO current_device_count
  FROM app_usage au
  WHERE au.user_id = user_record.user_id::uuid;
  
  -- Check if this specific device is registered
  SELECT 
    EXISTS(
      SELECT 1 FROM app_usage au 
      WHERE au.user_id = user_record.user_id::uuid 
        AND au.device_id = verify_device_license.device_id
    ),
    MIN(au.created_at)
  INTO device_exists, device_reg_date
  FROM app_usage au
  WHERE au.user_id = user_record.user_id::uuid 
    AND au.device_id = verify_device_license.device_id;
  
  -- Device limits based on plan
  device_limit := user_record.max_devices;
  
  -- Return authorization result
  RETURN QUERY SELECT 
    (device_exists OR current_device_count < device_limit)::BOOLEAN, -- is_authorized
    current_device_count, -- current_device_count
    device_limit, -- max_devices
    user_record.effective_license_type, -- license_type
    COALESCE(device_exists, FALSE), -- device_registered
    device_reg_date; -- registration_date
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- REGISTER NEW DEVICE FUNCTION
-- =====================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS register_device_usage(text, text, text);

-- Create device registration function
CREATE OR REPLACE FUNCTION register_device_usage(
  user_email TEXT, 
  device_id TEXT, 
  app_version TEXT DEFAULT '1.0.0'
)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  device_count INTEGER
) AS $$
DECLARE
  user_record RECORD;
  current_device_count INTEGER;
  device_exists BOOLEAN := FALSE;
BEGIN
  -- Get user information
  SELECT 
    uls.user_id,
    uls.max_devices,
    uls.is_subscription_active
  INTO user_record
  FROM user_license_status uls
  WHERE uls.email = user_email
  LIMIT 1;
  
  -- Check if user exists and has active license
  IF user_record.user_id IS NULL THEN
    RETURN QUERY SELECT 
      FALSE, 
      'User not found or no active license'::TEXT,
      0;
    RETURN;
  END IF;
  
  -- Check if device already exists
  SELECT COUNT(DISTINCT au.device_id), 
         EXISTS(SELECT 1 FROM app_usage au2 WHERE au2.user_id = user_record.user_id::uuid AND au2.device_id = register_device_usage.device_id)
  INTO current_device_count, device_exists
  FROM app_usage au
  WHERE au.user_id = user_record.user_id::uuid;
  
  -- If device already exists, just update last_active
  IF device_exists THEN
    UPDATE app_usage 
    SET 
      last_active = NOW(),
      app_version = register_device_usage.app_version,
      updated_at = NOW()
    WHERE user_id = user_record.user_id::uuid 
      AND device_id = register_device_usage.device_id;
      
    RETURN QUERY SELECT 
      TRUE, 
      'Device updated successfully'::TEXT,
      current_device_count;
    RETURN;
  END IF;
  
  -- Check device limit
  IF current_device_count >= user_record.max_devices THEN
    RETURN QUERY SELECT 
      FALSE, 
      format('Device limit exceeded. Maximum %s devices allowed for your plan.', user_record.max_devices)::TEXT,
      current_device_count;
    RETURN;
  END IF;
  
  -- Register new device
  INSERT INTO app_usage (
    user_id,
    device_id,
    app_version,
    last_active,
    created_at,
    updated_at
  ) VALUES (
    user_record.user_id::uuid,
    device_id,
    app_version,
    NOW(),
    NOW(),
    NOW()
  );
  
  -- Return success
  RETURN QUERY SELECT 
    TRUE, 
    'Device registered successfully'::TEXT,
    current_device_count + 1;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ADMIN ANALYTICS FUNCTION  
-- =====================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_admin_analytics();

-- Create admin analytics function
CREATE OR REPLACE FUNCTION get_admin_analytics()
RETURNS TABLE(
  metric_name TEXT,
  metric_value BIGINT,
  metric_description TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH analytics AS (
    SELECT * FROM admin_analytics_summary LIMIT 1
  )
  SELECT 'total_users'::TEXT, a.total_users, 'Total registered users'::TEXT FROM analytics a
  UNION ALL
  SELECT 'active_pro_users'::TEXT, a.active_pro_users, 'Users with active pro subscriptions'::TEXT FROM analytics a
  UNION ALL  
  SELECT 'trial_users'::TEXT, a.trial_users, 'Users currently in trial'::TEXT FROM analytics a
  UNION ALL
  SELECT 'free_users'::TEXT, a.free_users, 'Users on free plan'::TEXT FROM analytics a
  UNION ALL
  SELECT 'total_devices'::TEXT, a.total_devices, 'Total registered devices'::TEXT FROM analytics a
  UNION ALL
  SELECT 'active_devices'::TEXT, a.active_devices, 'Devices active in last 24h'::TEXT FROM analytics a
  UNION ALL
  SELECT 'total_memory_freed_gb'::TEXT, (a.total_memory_freed_mb / 1024), 'Total memory freed (GB)'::TEXT FROM analytics a
  UNION ALL
  SELECT 'new_users_30d'::TEXT, a.new_users_30d, 'New users in last 30 days'::TEXT FROM analytics a;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- MAINTENANCE FUNCTIONS
-- =====================================================

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS TEXT AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_license_status;
  REFRESH MATERIALIZED VIEW CONCURRENTLY device_activity_summary; 
  REFRESH MATERIALIZED VIEW CONCURRENTLY admin_analytics_summary;
  
  RETURN 'Analytics views refreshed successfully at ' || NOW()::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old app_usage records (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_usage_data()
RETURNS TEXT AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM app_usage 
  WHERE created_at < NOW() - INTERVAL '90 days'
    AND last_active < NOW() - INTERVAL '30 days'; -- Keep if recently active
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN format('Cleaned up %s old usage records', deleted_count);
END;
$$ LANGUAGE plpgsql;

-- Daily maintenance function
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  -- Refresh views
  PERFORM refresh_analytics_views();
  
  -- Clean up old data
  SELECT cleanup_old_usage_data() INTO result;
  
  -- Update table statistics
  ANALYZE;
  
  RETURN 'Daily maintenance completed: ' || result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Show completion message and test functions
DO $$ 
DECLARE
  test_result RECORD;
BEGIN 
  RAISE NOTICE '✅ PERFORMANCE FUNCTIONS CREATED SUCCESSFULLY!';
  RAISE NOTICE '🚀 Functions created:';
  RAISE NOTICE '  - check_user_license(email)';
  RAISE NOTICE '  - verify_device_license(email, device_id)';  
  RAISE NOTICE '  - register_device_usage(email, device_id, version)';
  RAISE NOTICE '  - get_admin_analytics()';
  RAISE NOTICE '  - daily_maintenance()';
  RAISE NOTICE '';
  
  -- Test the license check function with a real email if exists
  SELECT * INTO test_result
  FROM check_user_license('matthiasccm@gmail.com')
  LIMIT 1;
  
  IF FOUND THEN
    RAISE NOTICE '🧪 TEST: License check working! User has % license with % max devices', 
      test_result.license_type, test_result.max_devices;
  ELSE
    RAISE NOTICE '🧪 TEST: License check function ready (no test user found)';
  END IF;
  
  RAISE NOTICE '🔄 Next step: Run COPY-PASTE-04-maintenance.sql';
END $$;
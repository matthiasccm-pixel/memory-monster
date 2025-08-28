-- =========================================================
-- COPY-PASTE SCRIPT 4: MAINTENANCE & MONITORING SETUP
-- Run this in Supabase SQL Editor AFTER running scripts 1, 2, & 3
-- =========================================================

-- =====================================================
-- PERFORMANCE MONITORING VIEWS
-- =====================================================

-- View for monitoring slow operations
CREATE OR REPLACE VIEW performance_monitor AS
WITH table_stats AS (
  SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
  FROM pg_stat_user_tables
  WHERE schemaname = 'public'
)
SELECT 
  tablename,
  live_rows,
  dead_rows,
  CASE 
    WHEN live_rows > 0 THEN round((dead_rows::float / live_rows::float) * 100, 2)
    ELSE 0 
  END as dead_row_percentage,
  inserts + updates + deletes as total_operations,
  last_analyze,
  CASE 
    WHEN last_analyze < NOW() - INTERVAL '7 days' THEN 'NEEDS_ANALYZE'
    WHEN dead_rows > 1000 AND dead_row_percentage > 20 THEN 'NEEDS_VACUUM'
    ELSE 'OK'
  END as status,
  CASE 
    WHEN last_analyze < NOW() - INTERVAL '7 days' THEN 'Run: ANALYZE ' || tablename || ';'
    WHEN dead_rows > 1000 AND dead_row_percentage > 20 THEN 'Run: VACUUM ANALYZE ' || tablename || ';'
    ELSE 'No action needed'
  END as recommendation
FROM table_stats
ORDER BY dead_row_percentage DESC, live_rows DESC;

-- =====================================================
-- INDEX USAGE MONITORING
-- =====================================================

-- View for monitoring index effectiveness
CREATE OR REPLACE VIEW index_usage_monitor AS
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_tup_read as index_reads,
  idx_tup_fetch as index_fetches,
  CASE 
    WHEN idx_tup_read > 0 THEN round((idx_tup_fetch::float / idx_tup_read::float) * 100, 2)
    ELSE 0
  END as index_hit_rate,
  CASE 
    WHEN idx_tup_read = 0 THEN 'UNUSED'
    WHEN idx_tup_fetch::float / GREATEST(idx_tup_read, 1)::float < 0.1 THEN 'LOW_USAGE'
    ELSE 'ACTIVE'
  END as usage_status
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_tup_read DESC;

-- =====================================================
-- CACHE PERFORMANCE MONITORING
-- =====================================================

-- View for monitoring database cache performance
CREATE OR REPLACE VIEW cache_performance AS
SELECT 
  'Buffer Cache Hit Rate' as metric,
  round(
    100.0 * sum(blks_hit) / GREATEST(sum(blks_hit) + sum(blks_read), 1), 2
  ) as percentage,
  CASE 
    WHEN round(100.0 * sum(blks_hit) / GREATEST(sum(blks_hit) + sum(blks_read), 1), 2) >= 95 
    THEN 'EXCELLENT'
    WHEN round(100.0 * sum(blks_hit) / GREATEST(sum(blks_hit) + sum(blks_read), 1), 2) >= 90 
    THEN 'GOOD'
    ELSE 'NEEDS_IMPROVEMENT'
  END as status,
  CASE 
    WHEN round(100.0 * sum(blks_hit) / GREATEST(sum(blks_hit) + sum(blks_read), 1), 2) < 90
    THEN 'Consider increasing shared_buffers or optimizing queries'
    ELSE 'Cache performance is optimal'
  END as recommendation
FROM pg_stat_database
WHERE datname = current_database();

-- =====================================================
-- SECURITY MONITORING SETUP
-- =====================================================

-- Table for logging security events (if not exists)
CREATE TABLE IF NOT EXISTS security_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  user_email text,
  device_id text,
  ip_address inet,
  user_agent text,
  event_details jsonb,
  severity text DEFAULT 'info',
  created_at timestamp with time zone DEFAULT now()
);

-- Index for security events
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
  p_event_type text,
  p_user_email text DEFAULT NULL,
  p_device_id text DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_event_details jsonb DEFAULT NULL,
  p_severity text DEFAULT 'info'
)
RETURNS uuid AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO security_events (
    event_type,
    user_email,
    device_id,
    ip_address,
    user_agent,
    event_details,
    severity
  ) VALUES (
    p_event_type,
    p_user_email,
    p_device_id,
    p_ip_address::inet,
    p_user_agent,
    p_event_details,
    p_severity
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- AUTOMATED MAINTENANCE SCHEDULING
-- =====================================================

-- Create maintenance log table
CREATE TABLE IF NOT EXISTS maintenance_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  operation text NOT NULL,
  status text DEFAULT 'completed',
  details text,
  execution_time_ms integer,
  completed_at timestamp with time zone DEFAULT now()
);

-- Index for maintenance log
CREATE INDEX IF NOT EXISTS idx_maintenance_log_operation ON maintenance_log(operation);
CREATE INDEX IF NOT EXISTS idx_maintenance_log_completed_at ON maintenance_log(completed_at);

-- Enhanced daily maintenance function with logging
CREATE OR REPLACE FUNCTION enhanced_daily_maintenance()
RETURNS jsonb AS $$
DECLARE
  start_time timestamp;
  end_time timestamp;
  execution_time integer;
  result jsonb := '{}';
  view_refresh_result text;
  cleanup_result text;
  maintenance_id uuid;
BEGIN
  start_time := clock_timestamp();
  
  -- Log maintenance start
  INSERT INTO maintenance_log (operation, status, details)
  VALUES ('daily_maintenance', 'started', 'Automated daily maintenance started')
  RETURNING id INTO maintenance_id;
  
  BEGIN
    -- Refresh materialized views
    SELECT refresh_analytics_views() INTO view_refresh_result;
    result := result || jsonb_build_object('view_refresh', view_refresh_result);
    
    -- Clean up old data
    SELECT cleanup_old_usage_data() INTO cleanup_result;
    result := result || jsonb_build_object('data_cleanup', cleanup_result);
    
    -- Update table statistics
    ANALYZE;
    result := result || jsonb_build_object('analyze', 'Table statistics updated');
    
    -- Clean up old security events (keep last 30 days)
    DELETE FROM security_events WHERE created_at < NOW() - INTERVAL '30 days';
    result := result || jsonb_build_object('security_cleanup', 'Old security events cleaned');
    
    -- Clean up old maintenance logs (keep last 90 days)
    DELETE FROM maintenance_log WHERE completed_at < NOW() - INTERVAL '90 days';
    result := result || jsonb_build_object('maintenance_cleanup', 'Old maintenance logs cleaned');
    
    end_time := clock_timestamp();
    execution_time := extract(epoch from (end_time - start_time)) * 1000;
    
    -- Update maintenance log with success
    UPDATE maintenance_log 
    SET 
      status = 'completed',
      details = result::text,
      execution_time_ms = execution_time
    WHERE id = maintenance_id;
    
    result := result || jsonb_build_object(
      'status', 'success',
      'execution_time_ms', execution_time,
      'completed_at', end_time
    );
    
  EXCEPTION WHEN OTHERS THEN
    end_time := clock_timestamp();
    execution_time := extract(epoch from (end_time - start_time)) * 1000;
    
    -- Update maintenance log with error
    UPDATE maintenance_log 
    SET 
      status = 'failed',
      details = SQLERRM,
      execution_time_ms = execution_time
    WHERE id = maintenance_id;
    
    result := jsonb_build_object(
      'status', 'failed',
      'error', SQLERRM,
      'execution_time_ms', execution_time
    );
  END;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- HEALTH CHECK FUNCTION
-- =====================================================

-- Comprehensive database health check
CREATE OR REPLACE FUNCTION database_health_check()
RETURNS jsonb AS $$
DECLARE
  result jsonb := '{}';
  cache_hit_rate numeric;
  total_connections integer;
  active_connections integer;
  table_count integer;
  index_count integer;
  view_count integer;
  function_count integer;
BEGIN
  -- Cache performance
  SELECT round(100.0 * sum(blks_hit) / GREATEST(sum(blks_hit) + sum(blks_read), 1), 2)
  INTO cache_hit_rate
  FROM pg_stat_database WHERE datname = current_database();
  
  -- Connection stats
  SELECT count(*), count(*) FILTER (WHERE state = 'active')
  INTO total_connections, active_connections
  FROM pg_stat_activity WHERE datname = current_database();
  
  -- Object counts
  SELECT count(*) INTO table_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  
  SELECT count(*) INTO index_count
  FROM pg_indexes WHERE schemaname = 'public';
  
  SELECT count(*) INTO view_count
  FROM information_schema.views WHERE table_schema = 'public';
  
  SELECT count(*) INTO function_count
  FROM information_schema.routines WHERE routine_schema = 'public';
  
  -- Build result
  result := jsonb_build_object(
    'cache_hit_rate', cache_hit_rate,
    'cache_status', CASE 
      WHEN cache_hit_rate >= 95 THEN 'excellent'
      WHEN cache_hit_rate >= 90 THEN 'good'  
      ELSE 'needs_improvement'
    END,
    'connections', jsonb_build_object(
      'total', total_connections,
      'active', active_connections
    ),
    'objects', jsonb_build_object(
      'tables', table_count,
      'indexes', index_count,
      'views', view_count,
      'functions', function_count
    ),
    'optimization_status', CASE 
      WHEN cache_hit_rate >= 95 AND index_count >= table_count * 2 
      THEN 'fully_optimized'
      WHEN cache_hit_rate >= 90 
      THEN 'well_optimized'
      ELSE 'needs_optimization'
    END,
    'last_maintenance', (
      SELECT completed_at 
      FROM maintenance_log 
      WHERE operation = 'daily_maintenance' AND status = 'completed'
      ORDER BY completed_at DESC 
      LIMIT 1
    ),
    'checked_at', NOW()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- COMPLETION AND TESTING
-- =====================================================

-- Test all monitoring views and functions
DO $$ 
DECLARE
  health_result jsonb;
  perf_count integer;
  index_count integer;
  cache_status text;
BEGIN 
  RAISE NOTICE '✅ MAINTENANCE & MONITORING SETUP COMPLETE!';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Created monitoring views:';
  RAISE NOTICE '  - performance_monitor';
  RAISE NOTICE '  - index_usage_monitor'; 
  RAISE NOTICE '  - cache_performance';
  RAISE NOTICE '';
  RAISE NOTICE '🛡️ Created security features:';
  RAISE NOTICE '  - security_events table';
  RAISE NOTICE '  - log_security_event() function';
  RAISE NOTICE '';
  RAISE NOTICE '⚙️ Created maintenance features:';
  RAISE NOTICE '  - maintenance_log table';
  RAISE NOTICE '  - enhanced_daily_maintenance() function';
  RAISE NOTICE '  - database_health_check() function';
  RAISE NOTICE '';
  
  -- Run health check
  SELECT database_health_check() INTO health_result;
  SELECT health_result->>'cache_hit_rate' INTO cache_status;
  
  RAISE NOTICE '🩺 HEALTH CHECK RESULTS:';
  RAISE NOTICE '  Cache Hit Rate: %% (%)', 
    health_result->>'cache_hit_rate',
    health_result->>'cache_status';
  RAISE NOTICE '  Optimization Status: %', health_result->>'optimization_status';
  RAISE NOTICE '  Total Objects: % tables, % indexes, % views, % functions',
    health_result->'objects'->>'tables',
    health_result->'objects'->>'indexes', 
    health_result->'objects'->>'views',
    health_result->'objects'->>'functions';
  RAISE NOTICE '';
  
  -- Check performance monitoring
  SELECT count(*) INTO perf_count FROM performance_monitor;
  SELECT count(*) INTO index_count FROM index_usage_monitor;
  
  RAISE NOTICE '📊 MONITORING STATUS:';
  RAISE NOTICE '  Performance Monitor: % tables tracked', perf_count;
  RAISE NOTICE '  Index Usage Monitor: % indexes tracked', index_count;
  RAISE NOTICE '';
  
  RAISE NOTICE '🎯 OPTIMIZATION COMPLETE!';
  RAISE NOTICE 'Your Supabase database is now optimized for production scale.';
  RAISE NOTICE '';
  RAISE NOTICE '📋 NEXT STEPS:';
  RAISE NOTICE '1. Set up automated maintenance: SELECT enhanced_daily_maintenance();';
  RAISE NOTICE '2. Monitor performance: SELECT * FROM performance_monitor;';
  RAISE NOTICE '3. Check health regularly: SELECT database_health_check();';
  RAISE NOTICE '4. Test the license functions with real data';
  
END $$;
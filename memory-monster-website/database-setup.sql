-- Database setup for Memory Monster device tracking
-- Run this in your Supabase SQL Editor

-- 1. Create user_devices table for device limiting
CREATE TABLE IF NOT EXISTS user_devices (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_id VARCHAR(255) NOT NULL,
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  app_version VARCHAR(50) DEFAULT '1.0.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure device_id is unique per profile (one device can't be used by multiple users)
  UNIQUE(device_id),
  
  -- Index for fast lookups
  INDEX idx_user_devices_profile_id (profile_id),
  INDEX idx_user_devices_device_id (device_id)
);

-- 2. Add RLS (Row Level Security) policies
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own devices
CREATE POLICY "Users can view own devices" ON user_devices
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM profiles WHERE clerk_user_id = auth.user_id()
    )
  );

-- Policy: Service role can manage all devices (for API operations)
CREATE POLICY "Service role can manage devices" ON user_devices
  FOR ALL USING (auth.role() = 'service_role');

-- 3. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_user_devices_updated_at ON user_devices;
CREATE TRIGGER update_user_devices_updated_at
  BEFORE UPDATE ON user_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Optional: Add device limit check function (alternative to API logic)
CREATE OR REPLACE FUNCTION check_device_limit(p_profile_id INTEGER, p_device_id VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  device_count INTEGER;
  max_devices INTEGER := 3; -- Pro users get 3 devices
BEGIN
  -- Count existing devices for this profile (excluding the current one)
  SELECT COUNT(*) INTO device_count
  FROM user_devices 
  WHERE profile_id = p_profile_id 
    AND device_id != p_device_id;
  
  -- Return true if under limit
  RETURN device_count < max_devices;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Optional: Create view for device summary (useful for dashboard)
CREATE OR REPLACE VIEW user_device_summary AS
SELECT 
  p.id as profile_id,
  p.email,
  p.plan,
  COUNT(ud.id) as device_count,
  MAX(ud.last_seen) as last_device_activity,
  ARRAY_AGG(
    JSON_BUILD_OBJECT(
      'device_id', ud.device_id,
      'first_seen', ud.first_seen,
      'last_seen', ud.last_seen,
      'app_version', ud.app_version
    ) ORDER BY ud.last_seen DESC
  ) as devices
FROM profiles p
LEFT JOIN user_devices ud ON p.id = ud.profile_id
GROUP BY p.id, p.email, p.plan;

-- 7. Grant permissions to authenticated users for the view
GRANT SELECT ON user_device_summary TO authenticated;

-- 8. Optional: Clean up old devices (devices not seen in 90 days)
-- Run this periodically or set up as a cron job
CREATE OR REPLACE FUNCTION cleanup_old_devices()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_devices 
  WHERE last_seen < NOW() - INTERVAL '90 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample data for testing (optional)
-- INSERT INTO user_devices (profile_id, device_id, app_version) 
-- VALUES 
--   (1, 'mm_test_device_1', '1.0.0'),
--   (1, 'mm_test_device_2', '1.0.0');

-- Verification queries (run these to test):
-- SELECT * FROM user_devices;
-- SELECT * FROM user_device_summary;
-- SELECT check_device_limit(1, 'new_device_id'); -- Should return true/false
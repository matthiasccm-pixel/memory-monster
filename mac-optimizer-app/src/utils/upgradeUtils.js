/**
 * upgradeUtils.js - Centralized upgrade flow utilities
 */

// Generate or get device ID
export const getDeviceId = () => {
  let deviceId = localStorage.getItem('memory_monster_device_id');
  if (!deviceId) {
    deviceId = 'mm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('memory_monster_device_id', deviceId);
  }
  return deviceId;
};

// Determine base URL based on environment
const getBaseUrl = () => {
  // For Electron apps, we need to check differently since window.location might be file://
  // Check multiple indicators of development mode
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       process.env.NODE_ENV !== 'production' ||
                       window.location.protocol === 'file:' ||
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       !process.env.NODE_ENV; // Default to development if not set
  
  const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://memorymonster.co';
  console.log(`🔧 Environment detection - isDevelopment: ${isDevelopment}, baseUrl: ${baseUrl}`);
  
  return baseUrl;
};

// Open upgrade page with device tracking
export const openUpgradePage = () => {
  const deviceId = getDeviceId();
  const baseUrl = getBaseUrl();
  const upgradeUrl = `${baseUrl}/pro/checkout?device_id=${deviceId}&return_url=memorymonster://activate`;
  
  console.log(`🔗 Opening upgrade URL: ${upgradeUrl}`);
  
  if (window.electronAPI && window.electronAPI.openExternalURL) {
    window.electronAPI.openExternalURL(upgradeUrl);
  } else {
    window.open(upgradeUrl, '_blank');
  }
};

// Legacy function for backward compatibility
export const openJoinPage = () => {
  openUpgradePage();
};

export default {
  getDeviceId,
  openUpgradePage,
  openJoinPage
};
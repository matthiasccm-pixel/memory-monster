const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // EXISTING APIs (keeping for compatibility)
  getChromeProcesses: () => ipcRenderer.invoke('get-chrome-processes'),
  getDirectorySize: (path) => ipcRenderer.invoke('get-directory-size', path),
  getSystemMemory: () => ipcRenderer.invoke('get-system-memory'),
  getDiskUsage: () => ipcRenderer.invoke('get-disk-usage'),
  scanAppDirectories: () => ipcRenderer.invoke('scan-app-directories'),
  
  // NEW REAL SYSTEM APIs
  getDetailedProcesses: () => ipcRenderer.invoke('get-detailed-processes'),
  getSystemCPU: () => ipcRenderer.invoke('get-system-cpu'),
  scanAppCaches: () => ipcRenderer.invoke('scan-app-caches'),
  
  // SYSTEM PERMISSIONS & SECURITY
  checkSystemPermissions: () => ipcRenderer.invoke('check-system-permissions'),
  requestSystemPermissions: () => ipcRenderer.invoke('request-system-permissions'),
  
  // OPTIMIZATION ACTIONS
  optimizeMemory: (options) => ipcRenderer.invoke('optimize-memory', options),
  killProcess: (pid) => ipcRenderer.invoke('kill-process', pid),
  
  // SYSTEM MONITORING
  startRealTimeMonitoring: () => ipcRenderer.invoke('start-real-time-monitoring'),
  stopRealTimeMonitoring: () => ipcRenderer.invoke('stop-real-time-monitoring'),
  
  // APP MANAGEMENT
  getInstalledApps: () => ipcRenderer.invoke('get-installed-apps'),
  getAppInfo: (bundleId) => ipcRenderer.invoke('get-app-info', bundleId),
  
  // CACHE & CLEANUP
  clearAppCache: (bundleId, options) => ipcRenderer.invoke('clear-app-cache', bundleId, options),
  cleanSystemCaches: () => ipcRenderer.invoke('clean-system-caches'),
  
  // PERFORMANCE METRICS
  getPerformanceMetrics: () => ipcRenderer.invoke('get-performance-metrics'),
  getSystemHealth: () => ipcRenderer.invoke('get-system-health'),
  
  // BROWSER OPTIMIZATION
  optimizeBrowser: (browserType) => ipcRenderer.invoke('optimize-browser', browserType),
  getBrowserTabs: (browserType) => ipcRenderer.invoke('get-browser-tabs', browserType),
  closeBrowserTabs: (browserType, tabIds) => ipcRenderer.invoke('close-browser-tabs', browserType, tabIds),
  
  // ANALYTICS & REPORTING
  generateReport: (reportType) => ipcRenderer.invoke('generate-report', reportType),
  
  // SETTINGS & PREFERENCES
  getUserPreferences: () => ipcRenderer.invoke('get-user-preferences'),
  saveUserPreferences: (preferences) => ipcRenderer.invoke('save-user-preferences', preferences),

  // REAL SETTINGS APIs
  setLoginItem: (enabled) => ipcRenderer.invoke('set-login-item', enabled),
  getLoginItem: () => ipcRenderer.invoke('get-login-item'),
  setMenuBar: (enabled) => ipcRenderer.invoke('set-menu-bar', enabled),
  setKeepRunning: (enabled) => ipcRenderer.invoke('set-keep-running', enabled),
  showSuccessNotification: (options) => ipcRenderer.invoke('show-success-notification', options),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  setAutoUpdate: (enabled) => ipcRenderer.invoke('set-auto-update', enabled),
  onUpdateStatus: (callback) => {
    ipcRenderer.on('update-status', (event, data) => callback(data));
  },
  
  // NOTIFICATIONS
  showNotification: (title, message, type) => ipcRenderer.invoke('show-notification', title, message, type),
  
  // EXTERNAL ACTIONS
  openURL: (url) => ipcRenderer.invoke('open-url', url),
  showInFinder: (path) => ipcRenderer.invoke('show-in-finder', path),
  
  // REAL-TIME EVENT LISTENERS
  onSystemUpdate: (callback) => {
    ipcRenderer.on('system-update', (event, data) => callback(data));
  },
  onMemoryAlert: (callback) => {
    ipcRenderer.on('memory-alert', (event, data) => callback(data));
  },
  onProcessChange: (callback) => {
    ipcRenderer.on('process-change', (event, data) => callback(data));
  },
  
  // Remove event listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },

  // ===== NEW: LICENSE & USAGE TRACKING APIS =====
  
  // Verify license with your marketing website
  verifyLicense: (licenseData) => ipcRenderer.invoke('verify-license', licenseData),
  
  // Track usage data to your website dashboard
  trackUsage: (usageData) => ipcRenderer.invoke('track-usage', usageData),
  
  // Migrate user data from anonymous to licensed account
  migrateUserData: (migrationData) => ipcRenderer.invoke('migrate-user-data', migrationData),
  
  // Track download on first launch
  trackDownload: (downloadData) => ipcRenderer.invoke('track-download', downloadData),
  
  // Sync subscription for desktop app trials/licenses
  syncSubscription: (subscriptionData) => ipcRenderer.invoke('sync-subscription', subscriptionData),
  
  // Open external URLs (for upgrade links)
  openExternalURL: (url) => ipcRenderer.invoke('open-external-url', url),
  
  // Listen for IPC messages (for license activation)
  on: (channel, callback) => {
    const validChannels = ['license-activated', 'check-license-on-startup'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    }
  },
  
  // Remove listener
  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  }
});
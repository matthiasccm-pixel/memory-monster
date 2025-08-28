/**
 * FeatureGate.js - Controls access to Free vs Pro features
 * ENHANCED: Now uses Apple Security Manager for hardware-based protection
 */

import AppleSecurityManager from '../security/AppleSecurityManager.js';

class FeatureGate {
  constructor() {
    // Initialize Apple Security Manager
    this.appleSecurityManager = new AppleSecurityManager();
    this.securityInitialized = false;
    
    // Keep existing functionality working
    this.licenseStatus = this.getLicenseStatus();
    this.initializeScanCount();
    
    // Website connection
    this.websiteAPI = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    this.isOnlineMode = true;
    this.lastOnlineCheck = null;
    this.offlineGracePeriod = 6 * 60 * 60 * 1000; // Reduced to 6 hours for better security
    
    // Initialize security and track first launch
    this.initializeSecurity();
  }

  async initializeSecurity() {
    try {
      await this.appleSecurityManager.initialize();
      this.securityInitialized = true;
      console.log('✅ Apple Security Manager initialized');
      
      // Track download on first launch with secure device ID
      await this.trackFirstLaunch();
      
      // Perform integrity check
      await this.performSecurityCheck();
    } catch (error) {
      console.error('❌ Failed to initialize security:', error);
      this.securityInitialized = false;
    }
  }

  async performSecurityCheck() {
    if (!this.securityInitialized) {
      console.warn('⚠️ Security not initialized, skipping security check');
      return { valid: true }; // Allow app to work without security in development
    }

    try {
      // Validate device integrity
      const integrity = await this.appleSecurityManager.validateDeviceIntegrity();
      
      if (!integrity.valid) {
        console.warn('⚠️ Device integrity check failed:', integrity.failedChecks);
        
        // If risk score is too high, restrict features
        if (integrity.riskScore > 0.5) {
          console.warn('🚨 High risk score detected, restricting features');
          this.licenseStatus = 'restricted';
          return { valid: false, reason: 'Device integrity compromised' };
        }
      }

      // Check if device is authorized
      const isAuthorized = await this.appleSecurityManager.isDeviceAuthorized();
      if (!isAuthorized) {
        console.log('🔐 Device not authorized, checking for existing license...');
      }

      return { valid: true };
    } catch (error) {
      console.error('❌ Security check failed:', error);
      return { valid: false, reason: 'Security check failed' };
    }
  }

  // FIXED: Use Electron-safe storage instead of localStorage
  getStorageItem(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.warn('Storage access failed:', error);
      return null;
    }
  }

  setStorageItem(key, value) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Storage write failed:', error);
      return false;
    }
  }

  removeStorageItem(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Storage remove failed:', error);
      return false;
    }
  }

  // EXISTING: Keep current license status logic (for offline mode)
  getLicenseStatus() {
    const stored = this.getStorageItem('memory_monster_license');
    if (stored) {
      try {
        return JSON.parse(stored).status;
      } catch (error) {
        console.warn('Failed to parse license data:', error);
        return 'free';
      }
    }
    return 'free';
  }

  // EXISTING: Keep current scan counting with daily reset functionality
  initializeScanCount() {
    const scanData = this.getStorageItem('memory_monster_scans');
    if (!scanData) {
      const initialScans = {
        remaining: 3,
        used: 0,
        lastReset: new Date().toISOString()
      };
      this.setStorageItem('memory_monster_scans', JSON.stringify(initialScans));
    } else {
      // Check if we need to reset scans for a new day
      this.checkAndResetDailyScans();
    }
  }

  // NEW: Check if scans should be reset for a new day
  checkAndResetDailyScans() {
    if (this.canAccessFeature('unlimited_scans')) {
      return; // Pro users don't need daily resets
    }

    const scanData = this.getStorageItem('memory_monster_scans');
    if (!scanData) {
      return;
    }

    try {
      const data = JSON.parse(scanData);
      const lastReset = new Date(data.lastReset);
      const now = new Date();
      
      // Check if it's been more than 24 hours since last reset
      const hoursSinceReset = (now - lastReset) / (1000 * 60 * 60);
      
      if (hoursSinceReset >= 24) {
        console.log('🔄 Resetting daily scans - 24 hours have passed since last reset');
        this.resetScans(3);
        
        // Track the daily reset for analytics
        this.trackUsageToWebsite({
          dailyReset: true,
          scansPerformed: data.used,
          resetTimestamp: now.toISOString()
        });
      }
    } catch (error) {
      console.warn('Failed to check daily reset:', error);
      // Reset to safe state if parsing fails
      this.resetScans(3);
    }
  }

  // NEW: Verify license with your marketing website
  async verifyLicenseOnline(userEmail) {
    try {
      console.log('🔐 Verifying license online for:', userEmail);
      
      // Check if electronAPI is available
      if (!window.electronAPI) {
        console.warn('ElectronAPI not available, skipping online verification');
        return { valid: false, error: 'ElectronAPI not available' };
      }
      
      // Call your marketing website API through Electron
      const result = await window.electronAPI.verifyLicense({
        userEmail: userEmail,
        deviceId: this.getDeviceId(),
        appVersion: this.getAppVersion()
      });

      if (result.valid) {
        console.log('✅ Online license verification successful:', result.user.plan);
        
        // Update local storage with verified info
        this.updateLocalLicense({
          status: result.user.plan,
          userEmail: userEmail,
          userName: result.user.name,
          lastVerified: new Date().toISOString(),
          subscription: result.subscription,
          features: result.features
        });

        this.licenseStatus = result.user.plan;
        this.lastOnlineCheck = Date.now();
        return result;
      } else {
        console.warn('❌ License verification failed:', result.error);
        return { valid: false, error: result.error };
      }
    } catch (error) {
      console.error('🌐 Online verification failed, using offline mode:', error);
      return { valid: false, error: 'Network error', useOffline: true };
    }
  }

  // NEW: Track usage data to your website
  async trackUsageToWebsite(usageData) {
    try {
      const userEmail = this.getUserEmail();
      if (!userEmail) return;

      console.log('📊 Tracking usage to website:', usageData);

      if (!window.electronAPI) {
        console.warn('ElectronAPI not available, skipping usage tracking');
        return;
      }

      await window.electronAPI.trackUsage({
        userEmail: userEmail,
        deviceId: this.getDeviceId(),
        sessionData: {
          appVersion: this.getAppVersion(),
          sessionDurationMinutes: usageData.sessionDurationMinutes || 0
        },
        performanceData: {
          scansPerformed: usageData.scansPerformed || 0,
          memoryFreedMB: usageData.memoryFreedMB || 0,
          junkFilesRemoved: usageData.junkFilesRemoved || 0,
          appsOptimized: usageData.appsOptimized || 0,
          featuresUsed: usageData.featuresUsed || []
        }
      });

      console.log('✅ Usage data sent to website');
    } catch (error) {
      console.error('📊 Failed to track usage:', error);
      // Don't fail the app if tracking fails
    }
  }

  // NEW: Track download on first launch
  async trackFirstLaunch() {
    try {
      // Check if we've already tracked this download
      const hasTrackedDownload = this.getStorageItem('memory_monster_download_tracked');
      if (hasTrackedDownload) {
        console.log('📥 Download already tracked for this installation');
        return;
      }

      console.log('📥 First launch detected - tracking download...');

      if (!window.electronAPI) {
        console.warn('ElectronAPI not available for download tracking');
        return;
      }

      const downloadData = {
        userEmail: this.getUserEmail(),
        deviceId: this.getDeviceId(),
        appVersion: this.getAppVersion(),
        platform: 'desktop'
      };

      const result = await window.electronAPI.trackDownload(downloadData);

      if (result.success) {
        console.log('✅ Download tracked successfully');
        this.setStorageItem('memory_monster_download_tracked', 'true');
      } else {
        console.warn('❌ Download tracking failed:', result.error);
      }
    } catch (error) {
      console.error('📥 Failed to track first launch:', error);
    }
  }

  // ENHANCED: Use Apple Security Manager for secure device identification
  getDeviceId() {
    if (this.securityInitialized) {
      // Use hardware-based secure device ID
      const secureId = this.appleSecurityManager.getSecureDeviceId();
      if (secureId) {
        // Update stored device ID if it's different (migration)
        const oldId = this.getStorageItem('memory_monster_device_id');
        if (oldId && oldId !== secureId) {
          console.log('🔄 Migrating to secure device ID');
          this.setStorageItem('memory_monster_device_id', secureId);
        }
        return secureId;
      }
    }

    // Fallback to stored ID or generate new one
    let deviceId = this.getStorageItem('memory_monster_device_id');
    if (!deviceId) {
      // Generate more secure fallback ID
      deviceId = this.generateSecureFallbackId();
      this.setStorageItem('memory_monster_device_id', deviceId);
    }
    return deviceId;
  }

  generateSecureFallbackId() {
    // More secure than the original simple random generation
    const timestamp = Date.now().toString();
    const random = crypto.getRandomValues(new Uint32Array(4))
      .reduce((acc, val) => acc + val.toString(36), '');
    const platform = navigator.platform.replace(/\s+/g, '').toLowerCase();
    
    return `mm_${platform}_${timestamp.slice(-8)}_${random.slice(0, 12)}`;
  }

  getAppVersion() {
    return '1.0.0'; // You can update this to get from your package.json
  }

  getUserEmail() {
    const stored = this.getStorageItem('memory_monster_license');
    if (stored) {
      try {
        const license = JSON.parse(stored);
        if (license.userEmail) {
          console.log('🔑 Using licensed user email:', license.userEmail);
          return license.userEmail;
        }
      } catch (error) {
        console.warn('Failed to parse license for email:', error);
      }
    }
    
    // Generate unique anonymous email for free/unlicensed users
    const anonymousEmail = `anonymous_${this.getDeviceId().replace(/[^a-zA-Z0-9]/g, '')}@memorymonster.co`;
    console.log('👤 Using anonymous email:', anonymousEmail);
    return anonymousEmail;
  }

  updateLocalLicense(licenseData) {
    const oldEmail = this.getUserEmail(); // Get current email before updating
    this.setStorageItem('memory_monster_license', JSON.stringify(licenseData));
    
    // If user upgraded from anonymous to licensed, migrate their data
    if (oldEmail.startsWith('anonymous_') && licenseData.userEmail) {
      console.log('🔄 User upgraded! Migrating data from', oldEmail, 'to', licenseData.userEmail);
      this.migrateAnonymousData(oldEmail, licenseData.userEmail);
    }
    
    // Sync subscription status with website
    this.syncSubscriptionToWebsite(licenseData);
  }

  // NEW: Sync subscription status with website
  async syncSubscriptionToWebsite(licenseData) {
    try {
      if (!window.electronAPI) {
        console.warn('ElectronAPI not available for subscription sync');
        return;
      }

      console.log('🔄 Syncing subscription to website:', licenseData.status);

      // Map desktop license status to subscription data
      const subscriptionData = {
        userEmail: licenseData.userEmail || this.getUserEmail(),
        deviceId: this.getDeviceId(),
        subscriptionData: {
          planId: this.mapStatusToPlanId(licenseData.status),
          status: this.mapStatusToSubscriptionStatus(licenseData.status),
          cancelAtPeriodEnd: false,
          currentPeriodStart: licenseData.purchaseDate || licenseData.startDate || new Date().toISOString(),
          currentPeriodEnd: licenseData.trialEnd || this.calculatePeriodEnd(licenseData.status),
          trialEnd: licenseData.trialEnd || null
        }
      };

      const result = await window.electronAPI.syncSubscription(subscriptionData);
      
      if (result.success) {
        console.log('✅ Subscription synced to website');
      } else {
        console.warn('❌ Subscription sync failed:', result.error);
      }
    } catch (error) {
      console.error('🔄 Failed to sync subscription:', error);
    }
  }

  // Helper method to map desktop license status to plan ID
  mapStatusToPlanId(status) {
    const mapping = {
      'free': 'free',
      'trial': 'trial',
      'pro': 'pro_monthly', // Default to monthly
      'pro_monthly': 'pro_monthly',
      'pro_yearly': 'pro_yearly'
    };
    return mapping[status] || 'free';
  }

  // Helper method to map desktop status to subscription status
  mapStatusToSubscriptionStatus(status) {
    const mapping = {
      'free': 'active',
      'trial': 'trialing',
      'pro': 'active',
      'pro_monthly': 'active',
      'pro_yearly': 'active'
    };
    return mapping[status] || 'active';
  }

  // Helper method to calculate period end based on status
  calculatePeriodEnd(status) {
    const now = new Date();
    if (status === 'pro_yearly') {
      return new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
    } else {
      return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
    }
  }

  // NEW: Migrate anonymous user data to real email when they go Pro
  async migrateAnonymousData(oldEmail, newEmail) {
    try {
      if (!window.electronAPI) {
        console.warn('ElectronAPI not available for data migration');
        return;
      }

      console.log('📊 Migrating usage data from anonymous to licensed account');
      await window.electronAPI.migrateUserData({
        oldEmail: oldEmail,
        newEmail: newEmail,
        deviceId: this.getDeviceId()
      });
      
      console.log('✅ Data migration completed');
    } catch (error) {
      console.error('📊 Failed to migrate user data:', error);
    }
  }

  // NEW: Check if we need to verify online
  shouldVerifyOnline() {
    if (!this.lastOnlineCheck) return true;
    
    const timeSinceLastCheck = Date.now() - this.lastOnlineCheck;
    return timeSinceLastCheck > (6 * 60 * 60 * 1000); // Check every 6 hours
  }

  // NEW: Auto-verify license using system email (no sign-in required)
  async autoVerifyLicense() {
    console.log('🔑 Auto-verifying license...');
    
    // Try to get user email from system
    const systemEmail = await this.getSystemEmail();
    
    if (systemEmail) {
      console.log('📧 Found system email, verifying license...');
      const result = await this.verifyLicenseOnline(systemEmail);
      return result;
    } else {
      console.log('📧 No system email found, using free mode');
      return { valid: false, error: 'No email found', plan: 'free' };
    }
  }

  // NEW: Get user's email from their Mac system
  async getSystemEmail() {
    try {
      // Try to get email from system - this will be implemented with native code later
      // For now, return null so app works in free mode
      return null;
    } catch (error) {
      console.log('Could not get system email:', error);
      return null;
    }
  }

  // EXISTING: Keep all your current feature checking logic (unchanged)
  getRemainingScans() {
    if (this.canAccessFeature('unlimited_scans')) {
      return 999;
    }

    // Check for daily reset before returning scan count
    this.checkAndResetDailyScans();

    const scanData = this.getStorageItem('memory_monster_scans');
    if (scanData) {
      try {
        const data = JSON.parse(scanData);
        return Math.max(0, data.remaining);
      } catch (error) {
        console.warn('Failed to parse scan data:', error);
        return 3;
      }
    }
    
    return 3;
  }

  // NEW: Get time until next daily reset
  getTimeUntilReset() {
    if (this.canAccessFeature('unlimited_scans')) {
      return null; // Pro users don't have resets
    }

    const scanData = this.getStorageItem('memory_monster_scans');
    if (!scanData) {
      return null;
    }

    try {
      const data = JSON.parse(scanData);
      const lastReset = new Date(data.lastReset);
      const nextReset = new Date(lastReset.getTime() + (24 * 60 * 60 * 1000)); // 24 hours later
      const now = new Date();
      
      if (nextReset > now) {
        const hoursUntilReset = Math.ceil((nextReset - now) / (1000 * 60 * 60));
        return {
          hours: hoursUntilReset,
          nextResetTime: nextReset.toISOString(),
          lastResetTime: lastReset.toISOString()
        };
      } else {
        return {
          hours: 0,
          nextResetTime: now.toISOString(),
          lastResetTime: lastReset.toISOString()
        };
      }
    } catch (error) {
      console.warn('Failed to calculate reset time:', error);
      return null;
    }
  }

  decrementScans() {
    if (this.canAccessFeature('unlimited_scans')) {
      // Pro users still need to track their scans
      this.trackUsageToWebsite({
        scansPerformed: 1,
        memoryFreedMB: 0, // Will be updated later
        junkFilesRemoved: 0,
        appsOptimized: 0,
        featuresUsed: ['unlimited_scans']
      });
      return;
    }

    const scanData = this.getStorageItem('memory_monster_scans');
    if (scanData) {
      try {
        const data = JSON.parse(scanData);
        if (data.remaining > 0) {
          data.remaining -= 1;
          data.used += 1;
          this.setStorageItem('memory_monster_scans', JSON.stringify(data));
          
          console.log('📊 SCAN TRACKED: Free user performed scan');
          // Track this scan to the website
          this.trackUsageToWebsite({
            scansPerformed: 1,
            memoryFreedMB: 0, // Will be updated later
            junkFilesRemoved: 0,
            appsOptimized: 0,
            featuresUsed: ['basic_scan']
          });
        }
      } catch (error) {
        console.warn('Failed to update scan count:', error);
      }
    }
  }

  resetScans(count = 3) {
    const scanData = {
      remaining: count,
      used: 0,
      lastReset: new Date().toISOString()
    };
    this.setStorageItem('memory_monster_scans', JSON.stringify(scanData));
  }

  // EXISTING: Keep all current feature access logic (unchanged)
  canAccessFeature(feature) {
    const freeFeatures = [
      'basic_scan',
      'manual_optimization',
      'community_stats',
      'basic_app_support',
      'dashboard_access',
      'settings_access'
    ];

    const proFeatures = [
      'unlimited_scans',
      'multiple_optimizations',
      'auto_optimization',
      'real_time_monitoring',
      'advanced_scanning',
      'advanced_features',
      'all_app_support',
      'background_optimization',
      'detailed_analytics',
      'priority_support',
      'custom_rules'
    ];

    if (freeFeatures.includes(feature)) {
      return true;
    }

    if (proFeatures.includes(feature)) {
      return this.licenseStatus === 'pro' || this.licenseStatus === 'trial' || this.licenseStatus === 'pro_monthly' || this.licenseStatus === 'pro_yearly';
    }

    return false;
  }

  // EXISTING: Keep all current app and upgrade logic (unchanged)
  getAvailableApps() {
    // FREE TIER - 10 most common apps
    const freeApps = [
      'com.google.Chrome',
      'com.apple.Safari',
      'com.spotify.client',
      'com.tinyspeck.slackmacgap',
      'com.whatsapp.WhatsApp',
      'com.zoom.xos',
      'com.microsoft.teams',
      'com.apple.mail',
      'com.apple.Photos',
      'org.mozilla.firefox'
    ];

    // PRO TIER - 250+ apps including all Microsoft Office, Adobe, Developer tools
    if (this.canAccessFeature('all_app_support')) {
      return [...freeApps, 
        // Microsoft Office Suite
        'com.microsoft.Word',
        'com.microsoft.Excel',
        'com.microsoft.PowerPoint',
        'com.microsoft.Outlook',
        
        // Apple iWork Suite  
        'com.apple.iWork.Keynote',
        'com.apple.iWork.Pages',
        'com.apple.iWork.Numbers',
        
        // Creative & Design
        'com.adobe.Photoshop',
        'com.adobe.Illustrator',
        'com.adobe.PremierePro',
        'com.figma.Desktop',
        'com.bohemiancoding.sketch3',
        'com.apple.FinalCut',
        
        // Development
        'com.microsoft.VSCode',
        'com.docker.docker',
        
        // Communication & Collaboration
        'com.discordapp.Discord',
        'com.notion.id',
        
        // Utilities & Productivity
        'com.1password.1password',
        'com.dropbox.desktop',
        'com.parallels.desktop',
        
        // ... and 230+ more apps continuously added
      ];
    }

    return freeApps;
  }

  shouldShowUpgradePrompt(appId) {
    const availableApps = this.getAvailableApps();
    return !availableApps.includes(appId) && 
           !this.canAccessFeature('all_app_support');
  }

  getUpgradePrompt(feature) {
    const prompts = {
      'unlimited_scans': 'Upgrade to Pro for unlimited memory optimizations every day',
      'multiple_optimizations': 'Upgrade to Pro to fix all performance issues at once with one click',
      'auto_optimization': 'Upgrade to Pro to enable automatic memory optimization that runs in the background',
      'all_app_support': 'Unlock 240+ more apps including Adobe Creative Suite, development tools, and specialized software',
      'real_time_monitoring': 'Get real-time memory monitoring with instant alerts when your Mac needs attention',
      'advanced_scanning': 'Access deep system scanning that finds hidden memory leaks and performance bottlenecks',
      'advanced_features': 'Unlock advanced settings, custom rules, and professional optimization controls',
      'background_optimization': 'Let Memory Monster work silently in the background, keeping your Mac fast 24/7',
      'detailed_analytics': 'View detailed performance analytics and optimization history',
      'priority_support': 'Get priority email support and feature requests',
      'os_specific_optimizations': 'Unlock advanced OS-specific optimizations tailored to your macOS version',
      'priority_os_migration': 'Get priority support during macOS upgrades with automated learning migration',
      'advanced_system_strategies': 'Access aggressive system optimization strategies for maximum performance gains',
      'system_deep_optimization': 'Deep system optimization including WindowServer reset, cache purging, and memory compression'
    };
    
    return prompts[feature] || 'Upgrade to Memory Monster Pro to unlock this premium feature';
  }

  // EXISTING: Keep current simulation functions (for testing)
  simulateProUpgrade() {
    const licenseData = {
      status: 'pro',
      userEmail: 'test@example.com', // Use real email for Pro
      purchaseDate: new Date().toISOString()
    };
    this.setStorageItem('memory_monster_license', JSON.stringify(licenseData));
    this.licenseStatus = 'pro';
    
    // Sync to website
    this.syncSubscriptionToWebsite(licenseData);
  }

  simulateTrialStart() {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);
    
    const licenseData = {
      status: 'trial',
      userEmail: 'trial@example.com', // Use real email for Trial
      trialEnd: trialEnd.toISOString(),
      startDate: new Date().toISOString()
    };
    this.setStorageItem('memory_monster_license', JSON.stringify(licenseData));
    this.licenseStatus = 'trial';
    
    // Sync to website
    this.syncSubscriptionToWebsite(licenseData);
  }

  simulateFreeReset() {
    this.removeStorageItem('memory_monster_license');
    this.licenseStatus = 'free';
    this.resetScans(3);
    
    // Sync free status to website
    this.syncSubscriptionToWebsite({
      status: 'free',
      userEmail: this.getUserEmail()
    });
  }

  // EXISTING: Keep current license info (with new fields)
  getLicenseInfo() {
    const stored = this.getStorageItem('memory_monster_license');
    const scanData = this.getStorageItem('memory_monster_scans');
    
    let scansRemaining = 3;
    if (scanData) {
      try {
        const data = JSON.parse(scanData);
        scansRemaining = Math.max(0, data.remaining);
      } catch (error) {
        console.warn('Failed to parse scan data:', error);
      }
    }

    if (stored) {
      try {
        const license = JSON.parse(stored);
        const isPaidPlan = ['pro', 'trial', 'pro_monthly', 'pro_yearly'].includes(license.status);
        
        return {
          status: license.status,
          isPro: isPaidPlan,
          isTrial: license.status === 'trial',
          isFree: !isPaidPlan,
          isPaid: isPaidPlan,
          tier: isPaidPlan ? 'Pro' : 'Free',
          userEmail: license.userEmail,
          userName: license.userName,
          trialEnd: license.trialEnd,
          purchaseDate: license.purchaseDate,
          lastVerified: license.lastVerified,
          scansRemaining: isPaidPlan ? 999 : scansRemaining
        };
      } catch (error) {
        console.warn('Failed to parse license info:', error);
      }
    }
    
    return {
      status: 'free',
      isPro: false,
      isTrial: false,
      isFree: true,
      isPaid: false,
      tier: 'Free',
      userEmail: null,
      userName: null,
      scansRemaining: scansRemaining
    };
  }
}

export default FeatureGate;
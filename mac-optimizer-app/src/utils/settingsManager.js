/**
 * Settings Manager - Handles real settings functionality
 * Connects localStorage with Electron APIs for working settings
 */

class SettingsManager {
  constructor() {
    this.settings = this.loadSettings();
    this.initializeElectronSettings();
  }

  // Default settings
  getDefaultSettings() {
    return {
      // System Integration
      startAtLogin: false,
      keepRunning: false,
      showInMenuBar: false,
      autoUpdate: true,

      // Theme & UI
      theme: 'dark', // 'dark' | 'light' | 'auto'
      autoMinimize: true,

      // Notifications
      successNotifications: true,
      memoryAlerts: true,
      weeklyReports: false,
      monsterAlerts: true,
      tips: true,

      // Analytics & Privacy
      analytics: true,

      // Performance Features (UI only for now)
      autoScanWeekly: false,
      realTimeMonitoring: false,
      backgroundLiberation: false,
      scanIntensity: 'medium',
      deepScanning: false,
      monitorExternal: false,

      // Optimization Personalization
      preferredStrategy: 'auto', // 'auto' | 'conservative' | 'balanced' | 'aggressive'
      riskTolerance: 'medium', // 'low' | 'medium' | 'high'
      optimizationSchedule: 'on_demand', // 'on_demand' | 'daily' | 'weekly'
      preferredOptimizationTime: 'afternoon', // 'morning' | 'afternoon' | 'evening'
      autoApplyRecommendations: false,
      memoryPressureThreshold: 70, // % - when to suggest optimization
      learningEnabled: true, // Allow sharing optimization results for improvement
      personalizedRecommendations: true // Use AI-learned patterns for personalization
    };
  }

  // Load settings from localStorage
  loadSettings() {
    try {
      const stored = localStorage.getItem('memory_monster_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...this.getDefaultSettings(), ...parsed };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return this.getDefaultSettings();
  }

  // Save settings to localStorage
  saveSettings() {
    try {
      localStorage.setItem('memory_monster_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  // Initialize Electron-based settings on app start
  async initializeElectronSettings() {
    if (window.electronAPI) {
      try {
        // Initialize Start at Login
        const loginItem = await window.electronAPI.getLoginItem();
        if (loginItem.enabled !== this.settings.startAtLogin) {
          this.settings.startAtLogin = loginItem.enabled;
        }

        // Initialize Menu Bar if enabled
        if (this.settings.showInMenuBar) {
          await window.electronAPI.setMenuBar(true);
        }

        // Initialize Keep Running
        if (this.settings.keepRunning) {
          await window.electronAPI.setKeepRunning(true);
        }

        this.saveSettings();
      } catch (error) {
        console.error('Failed to initialize Electron settings:', error);
      }
    }
  }

  // Get a setting value
  get(key) {
    return this.settings[key];
  }

  // Set a setting value (with Electron integration)
  async set(key, value) {
    const oldValue = this.settings[key];
    this.settings[key] = value;
    this.saveSettings();

    // Handle Electron-specific settings
    if (window.electronAPI) {
      try {
        switch (key) {
          case 'startAtLogin':
            await window.electronAPI.setLoginItem(value);
            if (this.settings.successNotifications && value !== oldValue) {
              this.showNotification('Settings Updated', 
                value ? 'Memory Monster will start when you log in' : 'Auto-start disabled');
            }
            break;

          case 'showInMenuBar':
            await window.electronAPI.setMenuBar(value);
            if (this.settings.successNotifications && value !== oldValue) {
              this.showNotification('Menu Bar Updated', 
                value ? 'Memory Monster added to menu bar' : 'Removed from menu bar');
            }
            break;

          case 'keepRunning':
            await window.electronAPI.setKeepRunning(value);
            if (this.settings.successNotifications && value !== oldValue) {
              this.showNotification('Background Running Updated', 
                value ? 'App will keep running when closed' : 'App will quit when closed');
            }
            break;

          case 'theme':
            this.applyTheme(value);
            if (this.settings.successNotifications && value !== oldValue) {
              this.showNotification('Theme Changed', `Switched to ${value} theme`);
            }
            break;

          case 'successNotifications':
            if (value && value !== oldValue) {
              this.showNotification('Notifications Enabled', 'You will now receive success notifications');
            }
            break;

          case 'autoMinimize':
            if (this.settings.successNotifications && value !== oldValue) {
              this.showNotification('Auto-minimize Updated', 
                value ? 'Fixed issues will be minimized automatically' : 'Issues will stay expanded when fixed');
            }
            break;

          case 'autoUpdate':
            await window.electronAPI.setAutoUpdate(value);
            if (this.settings.successNotifications && value !== oldValue) {
              this.showNotification('Auto-update Updated', 
                value ? 'Memory Monster will update automatically' : 'Manual updates only');
            }
            break;
        }
      } catch (error) {
        console.error(`Failed to apply setting ${key}:`, error);
        // Revert setting on error
        this.settings[key] = oldValue;
        this.saveSettings();
        throw error;
      }
    }

    return true;
  }

  // Show notification (if enabled)
  async showNotification(title, body) {
    if (this.settings.successNotifications && window.electronAPI) {
      try {
        await window.electronAPI.showSuccessNotification({ title, body });
      } catch (error) {
        console.error('Failed to show notification:', error);
      }
    }
  }

  // Apply theme changes
  applyTheme(theme) {
    const root = document.documentElement;
    
    switch (theme) {
      case 'light':
        root.style.setProperty('--bg-primary', 'rgba(255, 255, 255, 0.95)');
        root.style.setProperty('--text-primary', 'rgba(0, 0, 0, 0.9)');
        root.style.setProperty('--text-secondary', 'rgba(0, 0, 0, 0.7)');
        break;
      case 'dark':
        root.style.setProperty('--bg-primary', 'rgba(15, 23, 42, 0.95)');
        root.style.setProperty('--text-primary', 'rgba(255, 255, 255, 0.9)');
        root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.7)');
        break;
      case 'auto':
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.applyTheme(prefersDark ? 'dark' : 'light');
        break;
    }
  }

  // Get all settings
  getAll() {
    return { ...this.settings };
  }

  // Reset to defaults
  async reset() {
    const defaults = this.getDefaultSettings();
    
    // Apply defaults to Electron settings
    if (window.electronAPI) {
      try {
        await window.electronAPI.setLoginItem(defaults.startAtLogin);
        await window.electronAPI.setMenuBar(defaults.showInMenuBar);
        await window.electronAPI.setKeepRunning(defaults.keepRunning);
      } catch (error) {
        console.error('Failed to reset Electron settings:', error);
      }
    }

    this.settings = defaults;
    this.saveSettings();
    this.applyTheme(defaults.theme);
    
    if (defaults.successNotifications) {
      this.showNotification('Settings Reset', 'All settings have been reset to defaults');
    }
  }

  // Check for updates manually
  async checkForUpdates() {
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.checkForUpdates();
        console.log('Manual update check:', result);
        return result;
      } catch (error) {
        console.error('Failed to check for updates:', error);
        throw error;
      }
    }
  }

  // Check if a setting is a Pro feature
  isProFeature(key) {
    const proFeatures = [
      'realTimeMonitoring',
      'backgroundLiberation', 
      'deepScanning',
      'monitorExternal',
      'weeklyReports'
    ];
    return proFeatures.includes(key);
  }
}

// Create global settings manager instance
const settingsManager = new SettingsManager();

export default settingsManager;
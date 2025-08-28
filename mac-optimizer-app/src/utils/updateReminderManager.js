/**
 * Update Reminder Manager
 * Handles intelligent nudging for updates and auto-update enablement
 */

import settingsManager from './settingsManager.js';

class UpdateReminderManager {
  constructor() {
    this.reminders = this.loadReminders();
    this.initializeReminders();
  }

  // Load reminder state from localStorage
  loadReminders() {
    try {
      const stored = localStorage.getItem('memory_monster_update_reminders');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load update reminders:', error);
    }
    
    return {
      lastUpdateCheck: null,
      lastReminderShown: null,
      autoUpdatePromptShown: false,
      onboardingUpdatePromptShown: false,
      upgradeUpdatePromptShown: false,
      reminderCount: 0,
      updateAvailable: false,
      latestVersion: null,
      userDismissedUpdate: false,
      dismissedUntil: null,
      isFirstRun: true
    };
  }

  // Save reminder state
  saveReminders() {
    try {
      localStorage.setItem('memory_monster_update_reminders', JSON.stringify(this.reminders));
    } catch (error) {
      console.error('Failed to save update reminders:', error);
    }
  }

  // Initialize reminder system
  async initializeReminders() {
    // Check if this is first run
    if (this.reminders.isFirstRun) {
      this.reminders.isFirstRun = false;
      this.saveReminders();
      
      // Don't show onboarding prompt anymore - auto-updates are on by default
    }

    // Start periodic update checking for users with auto-update disabled
    this.startPeriodicChecking();
    
    // Start weekly re-engagement for users who disabled auto-updates
    this.startWeeklyReengagement();
  }

  // Show onboarding prompt to enable auto-updates
  showOnboardingUpdatePrompt() {
    const autoUpdateEnabled = settingsManager.get('autoUpdate');
    
    if (!autoUpdateEnabled && !this.reminders.onboardingUpdatePromptShown) {
      this.reminders.onboardingUpdatePromptShown = true;
      this.saveReminders();
      
      // Trigger onboarding update modal
      window.dispatchEvent(new CustomEvent('show-onboarding-update-prompt'));
    }
  }

  // Show update prompt during upgrade flow
  showUpgradeUpdatePrompt() {
    const autoUpdateEnabled = settingsManager.get('autoUpdate');
    
    if (!autoUpdateEnabled && !this.reminders.upgradeUpdatePromptShown) {
      this.reminders.upgradeUpdatePromptShown = true;
      this.saveReminders();
      
      // Trigger upgrade update modal
      window.dispatchEvent(new CustomEvent('show-upgrade-update-prompt'));
    }
  }

  // Start periodic checking for updates (for users with auto-update disabled)
  startPeriodicChecking() {
    // Check every 6 hours
    setInterval(() => {
      this.checkForUpdatesIfNeeded();
    }, 6 * 60 * 60 * 1000);

    // Initial check after 1 minute
    setTimeout(() => {
      this.checkForUpdatesIfNeeded();
    }, 60000);
  }

  // Start weekly re-engagement for users who disabled auto-updates
  startWeeklyReengagement() {
    // Check every day
    setInterval(() => {
      const autoUpdateEnabled = settingsManager.get('autoUpdate');
      
      if (!autoUpdateEnabled) {
        const lastReminder = this.reminders.lastReminderShown || 0;
        const daysSinceLastReminder = (Date.now() - lastReminder) / (1000 * 60 * 60 * 24);
        
        // Show re-engagement prompt after 7 days
        if (daysSinceLastReminder >= 7) {
          this.showReengagementPrompt();
        }
      }
    }, 24 * 60 * 60 * 1000); // Check daily
  }

  // Show re-engagement prompt after a week
  showReengagementPrompt() {
    this.reminders.lastReminderShown = Date.now();
    this.reminders.reminderCount = 0; // Reset count for re-engagement
    this.saveReminders();
    
    // Trigger special re-engagement modal
    window.dispatchEvent(new CustomEvent('show-update-reminder', {
      detail: {
        version: 'latest',
        reminderCount: 0,
        isReengagement: true
      }
    }));
  }

  // Check for updates if auto-update is disabled
  async checkForUpdatesIfNeeded() {
    const autoUpdateEnabled = settingsManager.get('autoUpdate');
    
    if (!autoUpdateEnabled) {
      await this.silentUpdateCheck();
    }
  }

  // Perform silent update check (doesn't show UI)
  async silentUpdateCheck() {
    if (!window.electronAPI) return;

    try {
      const result = await window.electronAPI.checkForUpdates();
      this.reminders.lastUpdateCheck = Date.now();
      
      if (result.success && result.updateInfo && result.updateInfo.version) {
        // Update is available
        const newVersion = result.updateInfo.version;
        const currentVersion = result.currentVersion;
        
        if (newVersion !== currentVersion && newVersion !== this.reminders.latestVersion) {
          // New version detected
          this.reminders.updateAvailable = true;
          this.reminders.latestVersion = newVersion;
          this.reminders.userDismissedUpdate = false;
          this.reminders.dismissedUntil = null;
          
          // Show update reminder
          this.scheduleUpdateReminder();
        }
      } else {
        this.reminders.updateAvailable = false;
      }
      
      this.saveReminders();
    } catch (error) {
      console.error('Silent update check failed:', error);
    }
  }

  // Schedule when to show the next update reminder
  scheduleUpdateReminder() {
    // Don't show if user dismissed until a certain time
    if (this.reminders.dismissedUntil && Date.now() < this.reminders.dismissedUntil) {
      return;
    }

    // Don't show if user recently dismissed
    if (this.reminders.userDismissedUpdate) {
      return;
    }

    const now = Date.now();
    const lastReminder = this.reminders.lastReminderShown || 0;
    const timeSinceLastReminder = now - lastReminder;
    
    // Progressive reminder intervals: 1 hour → 6 hours → 24 hours → 3 days
    const intervals = [
      1 * 60 * 60 * 1000,      // 1 hour
      6 * 60 * 60 * 1000,      // 6 hours  
      24 * 60 * 60 * 1000,     // 24 hours
      3 * 24 * 60 * 60 * 1000  // 3 days
    ];
    
    const reminderIndex = Math.min(this.reminders.reminderCount, intervals.length - 1);
    const requiredInterval = intervals[reminderIndex];
    
    if (timeSinceLastReminder >= requiredInterval) {
      this.showUpdateReminder();
    } else {
      // Schedule for later
      const delay = requiredInterval - timeSinceLastReminder;
      setTimeout(() => {
        this.showUpdateReminder();
      }, delay);
    }
  }

  // Show update reminder with upgrade messaging
  showUpdateReminder() {
    if (!this.reminders.updateAvailable) return;
    
    this.reminders.lastReminderShown = Date.now();
    this.reminders.reminderCount++;
    this.saveReminders();
    
    // Trigger update reminder modal
    window.dispatchEvent(new CustomEvent('show-update-reminder', {
      detail: {
        version: this.reminders.latestVersion,
        reminderCount: this.reminders.reminderCount
      }
    }));
  }

  // User dismissed update reminder
  dismissUpdateReminder(dismissFor = 'later') {
    this.reminders.userDismissedUpdate = true;
    
    switch (dismissFor) {
      case 'hour':
        this.reminders.dismissedUntil = Date.now() + (60 * 60 * 1000);
        break;
      case 'day':
        this.reminders.dismissedUntil = Date.now() + (24 * 60 * 60 * 1000);
        break;
      case 'week':
        this.reminders.dismissedUntil = Date.now() + (7 * 24 * 60 * 60 * 1000);
        break;
      default:
        // Just for this session
        this.reminders.dismissedUntil = Date.now() + (60 * 60 * 1000);
    }
    
    this.saveReminders();
  }

  // User enabled auto-updates
  onAutoUpdateEnabled() {
    // Reset all reminder state
    this.reminders.userDismissedUpdate = false;
    this.reminders.dismissedUntil = null;
    this.reminders.reminderCount = 0;
    this.reminders.autoUpdatePromptShown = true;
    this.saveReminders();
  }

  // User installed update manually
  onUpdateInstalled() {
    this.reminders.updateAvailable = false;
    this.reminders.userDismissedUpdate = false;
    this.reminders.dismissedUntil = null;
    this.reminders.reminderCount = 0;
    this.reminders.latestVersion = null;
    this.saveReminders();
  }

  // Get current reminder state (for debugging)
  getState() {
    return { ...this.reminders };
  }

  // Force show onboarding prompt (for testing)
  forceShowOnboardingPrompt() {
    this.reminders.onboardingUpdatePromptShown = false;
    this.saveReminders();
    this.showOnboardingUpdatePrompt();
  }

  // Force check for updates (manual trigger)
  async forceUpdateCheck() {
    await this.silentUpdateCheck();
    if (this.reminders.updateAvailable) {
      this.showUpdateReminder();
    }
  }
}

// Create global instance
const updateReminderManager = new UpdateReminderManager();

export default updateReminderManager;
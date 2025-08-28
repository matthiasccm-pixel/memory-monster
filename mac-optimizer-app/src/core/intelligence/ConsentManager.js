/**
 * Intelligent Consent Manager
 * Handles user consent for optimizations
 */

class IntelligentConsentManager {
  constructor() {
    this.userPreferences = new Map();
    this.loadUserPreferences();
  }

  loadUserPreferences() {
    // Load saved user preferences
    try {
      const saved = localStorage.getItem('optimization_preferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        Object.entries(prefs).forEach(([key, value]) => {
          this.userPreferences.set(key, value);
        });
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  }

  async requestConsent(app, optimization) {
    // Check if user has saved preference for this optimization
    const prefKey = `${app.profile.name}_${optimization.id}`;
    const savedPreference = this.userPreferences.get(prefKey);
    
    if (savedPreference) {
      return {
        approved: savedPreference === 'always_allow',
        source: 'saved_preference',
        preference: savedPreference
      };
    }

    // If no saved preference, show intelligent consent dialog
    return new Promise((resolve) => {
      const consentData = this.prepareConsentData(app, optimization);
      
      // This would trigger the consent modal in the UI
      window.dispatchEvent(new CustomEvent('show-consent-modal', {
        detail: {
          consentData,
          onResponse: (response) => {
            if (response.remember) {
              this.saveUserPreference(prefKey, response.action);
            }
            resolve({
              approved: response.action === 'proceed' || response.action === 'always_allow',
              source: 'user_input',
              response: response
            });
          }
        }
      }));
    });
  }

  prepareConsentData(app, optimization) {
    return {
      app: {
        name: app.profile.name,
        category: app.profile.category
      },
      optimization: {
        name: optimization.name,
        description: optimization.description,
        estimatedSavings: optimization.estimatedSavings,
        riskLevel: optimization.riskLevel,
        benefits: {
          storage: `${optimization.estimatedSavings.min}-${optimization.estimatedSavings.max}MB`,
          speedIncrease: this.calculateSpeedIncrease(optimization.estimatedSavings)
        },
        risks: this.calculateRisks(optimization),
        recommended: optimization.riskLevel === 'low'
      },
      context: this.getContextualMessage(app, optimization)
    };
  }

  calculateSpeedIncrease(estimatedSavings) {
    const avgSavings = (estimatedSavings.min + estimatedSavings.max) / 2;
    if (avgSavings > 1000) return '15-25%';
    if (avgSavings > 500) return '10-15%';
    return '5-10%';
  }

  calculateRisks(optimization) {
    const riskMessages = {
      'low': [],
      'medium': ['App will need to restart', 'Recent work should be saved first'],
      'high': ['App settings may be reset', 'Custom configurations may be lost']
    };
    
    return riskMessages[optimization.riskLevel] || [];
  }

  getContextualMessage(app, optimization) {
    if (app.totalMemoryMB > 2000) {
      return `${app.profile.name} is using ${Math.round(app.totalMemoryMB)}MB - that's quite heavy!`;
    }
    
    return `This optimization typically frees up significant memory in ${app.profile.name}.`;
  }

  saveUserPreference(prefKey, action) {
    this.userPreferences.set(prefKey, action);
    
    try {
      const prefs = Object.fromEntries(this.userPreferences);
      localStorage.setItem('optimization_preferences', JSON.stringify(prefs));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }
}

export default IntelligentConsentManager;
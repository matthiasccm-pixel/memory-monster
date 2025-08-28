/**
 * useFeatureGate.js - React Hook for easy feature access
 * FIXED: React error #321 - safer initialization
 */

import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import FeatureGate from './FeatureGate.js';
import { openUpgradePage } from '../../utils/upgradeUtils.js';

// Create a context for the FeatureGate
const FeatureGateContext = createContext();

// Provider component - wrap your app with this
export const FeatureGateProvider = ({ children }) => {
  // FIXED: Use useMemo instead of useState with function
  const featureGate = useMemo(() => {
    try {
      return new FeatureGate();
    } catch (error) {
      console.error('Failed to create FeatureGate:', error);
      // Return a mock object that won't crash the app
      return {
        getLicenseInfo: () => ({
          status: 'free',
          isPro: false,
          isTrial: false,
          isFree: true,
          isPaid: false,
          tier: 'Free',
          scansRemaining: 3
        }),
        canAccessFeature: () => false,
        getRemainingScans: () => 3,
        decrementScans: () => {},
        simulateProUpgrade: () => {},
        simulateTrialStart: () => {},
        simulateFreeReset: () => {},
        resetScans: () => {}
      };
    }
  }, []);

  const [licenseInfo, setLicenseInfo] = useState(() => {
    try {
      return featureGate.getLicenseInfo();
    } catch (error) {
      console.error('Failed to get license info:', error);
      return {
        status: 'free',
        isPro: false,
        isTrial: false,
        isFree: true,
        isPaid: false,
        tier: 'Free',
        scansRemaining: 3
      };
    }
  });

  // Listen for license changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        setLicenseInfo(featureGate.getLicenseInfo());
      } catch (error) {
        console.error('Failed to update license info:', error);
      }
    };

    // Listen for changes to localStorage (when license updates)
    const handleStorageEvent = () => {
      handleStorageChange();
    };

    // Add event listeners safely
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageEvent);
    }
    
    // Also check periodically in case license was updated programmatically
    const interval = setInterval(handleStorageChange, 1000); // Check every second for responsiveness

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageEvent);
      }
      clearInterval(interval);
    };
  }, [featureGate]);

  return (
    <FeatureGateContext.Provider value={{ featureGate, licenseInfo, setLicenseInfo }}>
      {children}
    </FeatureGateContext.Provider>
  );
};

// Main hook - use this in your components
export const useFeatureGate = () => {
  const context = useContext(FeatureGateContext);
  
  if (!context) {
    throw new Error('useFeatureGate must be used within a FeatureGateProvider');
  }

  const { featureGate, licenseInfo, setLicenseInfo } = context;

  // Wrap all methods with try-catch to prevent crashes
  const safeMethodCall = (methodName, fallback) => {
    return (...args) => {
      try {
        return featureGate[methodName](...args);
      } catch (error) {
        console.error(`FeatureGate.${methodName} failed:`, error);
        return fallback;
      }
    };
  };


  return {
    // NEW: Alias for canAccessFeature (matches scanning view expectations)
    hasFeature: safeMethodCall('canAccessFeature', false),
    
    // NEW: Get remaining scans for free users
    getRemainingScans: safeMethodCall('getRemainingScans', 3),
    
    // NEW: Decrement scan count
    decrementScans: () => {
      try {
        featureGate.decrementScans();
        setLicenseInfo(featureGate.getLicenseInfo()); // Update state immediately
      } catch (error) {
        console.error('Failed to decrement scans:', error);
      }
    },
    
    // NEW: Open upgrade modal (placeholder for now)
    openUpgradeModal: () => {
      try {
        // For now, open external link - you can replace this with your modal logic
        if (typeof window !== 'undefined') {
          openUpgradePage();
        }
      } catch (error) {
        console.error('Failed to open upgrade modal:', error);
      }
    },
    
    // Check if user can access a feature (original method)
    canAccess: safeMethodCall('canAccessFeature', false),
    
    // Get list of available apps
    getAvailableApps: safeMethodCall('getAvailableApps', []),
    
    // Check if should show upgrade prompt for app
    shouldShowUpgrade: safeMethodCall('shouldShowUpgradePrompt', false),
    
    // Get upgrade message for feature
    getUpgradeMessage: safeMethodCall('getUpgradePrompt', 'Upgrade to Pro'),
    
    // License status info (both old and new format)
    license: licenseInfo,
    licenseInfo: licenseInfo, // NEW: matches scanning view expectations
    
    // Helper functions for common checks
    isPro: licenseInfo.isPro || false,
    isTrial: licenseInfo.isTrial || false,
    isFree: licenseInfo.isFree !== false, // Default to true if undefined
    
    // Functions to simulate license changes (for testing)
    simulateProUpgrade: () => {
      try {
        featureGate.simulateProUpgrade();
        setLicenseInfo(featureGate.getLicenseInfo());
      } catch (error) {
        console.error('Failed to simulate pro upgrade:', error);
        throw error; // Re-throw so the test button can show the error
      }
    },
    
    simulateTrialStart: () => {
      try {
        featureGate.simulateTrialStart();
        setLicenseInfo(featureGate.getLicenseInfo());
      } catch (error) {
        console.error('Failed to simulate trial start:', error);
        throw error;
      }
    },
    
    simulateFreeReset: () => {
      try {
        featureGate.simulateFreeReset();
        setLicenseInfo(featureGate.getLicenseInfo());
      } catch (error) {
        console.error('Failed to simulate free reset:', error);
        throw error;
      }
    },
    
    // NEW: Reset scans (for testing)
    resetScans: (count = 3) => {
      try {
        featureGate.resetScans(count);
        setLicenseInfo(featureGate.getLicenseInfo());
      } catch (error) {
        console.error('Failed to reset scans:', error);
      }
    }
  };
};

export default useFeatureGate;
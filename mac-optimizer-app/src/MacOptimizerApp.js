import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, AlertTriangle, Zap, Sparkles, Shield, Send, Users, TrendingUp, Heart, Star, Activity, Clock, Cpu, Swords, Settings, User, X, Lock, Bell, HardDrive, Crown, RotateCcw, FileText, ExternalLink, HelpCircle, Package } from 'lucide-react';
import { FeatureGateProvider } from './core/licensing/useFeatureGate.js';
import LoadingScreen from './components/shared/LoadingScreen.jsx';
import { GatedButton, GatedSection, GatedSettingRow, LicenseStatusBar, AppLockOverlay } from './components/shared/GatedComponents.jsx';
import Firefoxlogo from './components/shared/Firefoxlogo.jsx';
import AppLogo from './components/shared/AppLogo.jsx';
import Confetti from './components/shared/Confetti.jsx';
import { OneTimeTickerNumber, OneTimeAbbreviatedTicker } from './components/shared/TickerComponents.jsx';
import SettingRow from './components/shared/SettingRow.jsx';
import ActivatePlanModal from './components/modals/ActivatePlanModal.jsx';
import LicenseKeyModal from './components/modals/LicenseKeyModal.jsx';
import ProActivationSuccessModal from './components/modals/ProActivationSuccessModal.jsx';
import UserTypeScreen from './components/onboarding/UserTypeScreen.jsx';
import AppShowcaseScreen from './components/onboarding/AppShowcaseScreen.jsx';
import DiskAccessScreen from './components/onboarding/DiskAccessScreen.jsx';
import AccessGrantedScreen from './components/onboarding/AccessGrantedScreen.jsx';
import EnhancedSettingsView from './components/settings/EnhancedSettingsView.jsx';
import SpeedTracker from './components/dashboard/SpeedTracker.jsx';
import AppsView from './components/apps/AppsView.jsx';
import UpdateNotification from './components/shared/UpdateNotification.jsx';
import OnboardingUpdateModal from './components/modals/OnboardingUpdateModal.jsx';
import UpdateReminderModal from './components/modals/UpdateReminderModal.jsx';
import UpgradeUpdateModal from './components/modals/UpgradeUpdateModal.jsx';
import { 
  handleBeginFromAccess,
  handleSendMessage,
  handleKeyPress 
} from './utils/navigationUtils.js';

// Import styles
import { containerStyle } from './styles/commonStyles.js';

// Import utilities
import { 
  handleGrantDiskAccess, 
  openExternalLink, 
  animateMemoryCounter, 
  getSeverityStyle,
  getFixingContent 
} from './utils/systemUtils.js';
import { openUpgradePage } from './utils/upgradeUtils.js';
import updateReminderManager from './utils/updateReminderManager.js';

// Import constants
import { communityUsers, systemHealth } from './constants/appData.js';
import { loadingMessages, initialAtlasMessages } from './constants/messages.js';

const MacOptimizerApp = () => {
// ===== ALL STATE VARIABLES =====
const [isLoading, setIsLoading] = useState(true);
const [loadingMessage, setLoadingMessage] = useState('');
// NEW SIMPLIFIED VIEW STRUCTURE: userType → appShowcase → diskAccess → accessGranted → speedTracker
const [currentView, setCurrentView] = useState('userType');
const [diskAccessGranted, setDiskAccessGranted] = useState(false);
const [currentSpeed, setCurrentSpeed] = useState(24);

// NEW: License activation state
const [licenseActivated, setLicenseActivated] = useState(false);
const [userEmail, setUserEmail] = useState(null);

// Two completely separate modal systems
const [showWelcomeModal, setShowWelcomeModal] = useState(false);
const [showActivationModal, setShowActivationModal] = useState(false);
const [showLicenseKeyModal, setShowLicenseKeyModal] = useState(false);
const [showProSuccessModal, setShowProSuccessModal] = useState(false);
const [proActivationData, setProActivationData] = useState(null);

// Update modal states
const [showOnboardingUpdateModal, setShowOnboardingUpdateModal] = useState(false);
const [showUpdateReminderModal, setShowUpdateReminderModal] = useState(false);
const [showUpgradeUpdateModal, setShowUpgradeUpdateModal] = useState(false);
const [updateReminderInfo, setUpdateReminderInfo] = useState(null);

// NEW: Track if user has completed first memory fix for stats visibility
const [hasCompletedFirstFix, setHasCompletedFirstFix] = useState(false);

// Scanning and fixing states
const [isScanning, setIsScanning] = useState(false);
const [scanComplete, setScanComplete] = useState(false);
const [fixingStates, setFixingStates] = useState({});
const [minimizedIssues, setMinimizedIssues] = useState({}); // Track which issues are minimized
const [userInput, setUserInput] = useState('');
const [totalMemoryFreed, setTotalMemoryFreed] = useState(0);
const [remainingMemory, setRemainingMemory] = useState(0);
const [animatingMemory, setAnimatingMemory] = useState(0);
const [showConfetti, setShowConfetti] = useState(false);
const [currentCommunityIndex, setCurrentCommunityIndex] = useState(0);

// Settings state variables
const [autoScanWeekly, setAutoScanWeekly] = useState(true);
const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);
const [memoryAlerts, setMemoryAlerts] = useState(true);
const [autoMinimize, setAutoMinimize] = useState(true);
const [backgroundLiberation, setBackgroundLiberation] = useState(false);
const [scanIntensity, setScanIntensity] = useState('Normal');
const [startAtLogin, setStartAtLogin] = useState(true);
const [keepRunning, setKeepRunning] = useState(true);
const [showInMenuBar, setShowInMenuBar] = useState(true);
const [autoUpdate, setAutoUpdate] = useState(true);
const [theme, setTheme] = useState('Auto');
const [successNotifications, setSuccessNotifications] = useState(true);
const [weeklyReports, setWeeklyReports] = useState(true);
const [monsterAlerts, setMonsterAlerts] = useState(true);
const [tips, setTips] = useState(true);
const [deepScanning, setDeepScanning] = useState(false);
const [monitorExternal, setMonitorExternal] = useState(true);
const [analytics, setAnalytics] = useState(true);
const [atlasMessages, setAtlasMessages] = useState(initialAtlasMessages);
const messagesEndRef = useRef(null);

// Memory issues - Will be populated by real system scan
const [issues, setIssues] = useState([]);

// ===== SCAN HANDLER FUNCTION =====
const handleScan = (setCurrentView, setShowWelcomeModal, setShowActivationModal, setIsScanning, setScanComplete, setAtlasMessages) => {
  // We don't change views anymore - everything happens in SpeedTracker
  setShowWelcomeModal(false);
  setShowActivationModal(false);
  
  // The real scanning logic is now handled entirely in SpeedTracker component
  // This function is kept for compatibility but doesn't do the actual scanning
  console.log('Scan initiated - SpeedTracker will handle the real system scan');
};

// ===== NAVIGATION HANDLER FUNCTIONS =====
const handleActivateNow = () => {
  setShowWelcomeModal(false);
  setShowActivationModal(false);
  
  setTimeout(() => {
    openUpgradePage();
    setTimeout(() => {
      handleScan(setCurrentView, setShowWelcomeModal, setShowActivationModal, setIsScanning, setScanComplete, setAtlasMessages);
    }, 500);
  }, 100);
};

const handleBuyPlan = () => {
  setShowWelcomeModal(false);
  setShowActivationModal(false);
  
  setTimeout(() => {
    openUpgradePage();
    setTimeout(() => {
      handleScan(setCurrentView, setShowWelcomeModal, setShowActivationModal, setIsScanning, setScanComplete, setAtlasMessages);
    }, 500);
  }, 100);
};

const handleSkipActivation = () => {
  setShowWelcomeModal(false);
  setShowActivationModal(false);
  
  setTimeout(() => {
    handleScan(setCurrentView, setShowWelcomeModal, setShowActivationModal, setIsScanning, setScanComplete, setAtlasMessages);
  }, 200);
};

const handleUseCode = () => {
  setShowWelcomeModal(false);
  setShowActivationModal(false);
  setShowLicenseKeyModal(true);
};

const handleLicenseActivateSuccess = (activationData) => {
  setLicenseActivated(true);
  setUserEmail(activationData.email);
  
  // Store activation data for success modal
  setProActivationData(activationData);
  
  if (activationData.showSuccessModal) {
    // Show the Pro success modal instead of just confetti
    setShowProSuccessModal(true);
    
    // Trigger upgrade update prompt after Pro success modal is closed
    setTimeout(() => {
      updateReminderManager.showUpgradeUpdatePrompt();
    }, 3000); // Show after 3 seconds
  } else {
    // Fallback to confetti for other activation types
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
    
    // Also trigger upgrade prompt for other activation types
    setTimeout(() => {
      updateReminderManager.showUpgradeUpdatePrompt();
    }, 5000);
  }
};

const handleFixLocal = async (issueId) => {
  const issue = issues.find(i => i.id === issueId);
  setFixingStates(prev => ({ ...prev, [issueId]: 'analyzing' }));
  
  setTimeout(() => {
    setFixingStates(prev => ({ ...prev, [issueId]: 'liberating' }));
  }, 1200);
  
  setTimeout(() => {
    setFixingStates(prev => ({ ...prev, [issueId]: 'complete' }));
    setIssues(prev => prev.map(i =>
      i.id === issueId ? { ...i, fixed: true } : i
    ));

    const memoryAmount = issue.storage;
    const newTotalFreed = totalMemoryFreed + memoryAmount;
    const totalIssuesMemory = issues.reduce((sum, issue) => sum + issue.storage, 0);
    const newRemainingMemory = totalIssuesMemory - newTotalFreed;
    setTotalMemoryFreed(newTotalFreed);
    setRemainingMemory(newRemainingMemory);
    animateMemoryCounter(animatingMemory, Math.max(0, newRemainingMemory), setAnimatingMemory);
    
    // Mark that user has completed their first fix
    if (!hasCompletedFirstFix) {
      setHasCompletedFirstFix(true);
    }
    
    // Minimize immediately after completion
    setMinimizedIssues(prev => ({ ...prev, [issueId]: true }));
    
    const allFixed = issues.filter(i => i.id !== issueId).every(i => i.fixed);
    if (allFixed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      setAtlasMessages(prev => [...prev, "🎉 INCREDIBLE! You've liberated ALL trapped memory! Your Mac is now running at peak performance. The Memory Monster community salutes your victory! 🏆✨"]);
    }
    
    const celebrationMessage = `🏆 Victory! The ${issue.app} monster has been defeated! You just freed ${issue.storage}${issue.storageUnit} of memory and your Mac's performance is restored. ${issue.userCount} users freed ${issue.totalFreed} from ${issue.app} today! ✨`;
    setAtlasMessages(prev => [...prev, celebrationMessage]);
  }, 3800);
};

// Handle unlocking all issues at once
const handleUnlockAllLocal = async () => {
  const unlockedIssues = issues.filter(issue => !issue.fixed);
  for (let i = 0; i < unlockedIssues.length; i++) {
    const issue = unlockedIssues[i];
    setTimeout(() => {
      handleFixLocal(issue.id);
    }, i * 500);
  }
};

// Calculate initial remaining memory from issues
useEffect(() => {
  const totalIssuesMemory = issues.reduce((sum, issue) => sum + issue.storage, 0);
  const newRemainingMemory = totalIssuesMemory - totalMemoryFreed;
  setRemainingMemory(newRemainingMemory);
  setAnimatingMemory(newRemainingMemory);
}, [issues, totalMemoryFreed]);

// ===== ALL FUNCTIONS =====
const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
  scrollToBottom();
}, [atlasMessages]);

// Initial loading sequence
useEffect(() => {
  let messageIndex = 0;
  const messageInterval = setInterval(() => {
    setLoadingMessage(loadingMessages[messageIndex]);
    messageIndex = (messageIndex + 1) % loadingMessages.length;
  }, 600);

  const loadingTimer = setTimeout(() => {
    clearInterval(messageInterval);
    setIsLoading(false);
    // Don't override currentView here - let the initial state handle it
  }, 4500);

  return () => {
    clearInterval(messageInterval);
    clearTimeout(loadingTimer);
  };
}, []);

// Listen for confetti trigger from SpeedTracker (SEPARATE useEffect)
useEffect(() => {
  const handleConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };
  
  window.addEventListener('trigger-confetti', handleConfetti);
  return () => window.removeEventListener('trigger-confetti', handleConfetti);
}, []);

// NEW: Listen for license activation from deep link
useEffect(() => {
  // Define callback functions
  const handleLicenseActivated = (activationData) => {
    console.log('🎉 License activated via deep link:', activationData);
    setLicenseActivated(true);
    setUserEmail(activationData.email);
    
    // Update local storage for FeatureGate
    const licenseData = {
      status: activationData.plan || 'pro',
      userEmail: activationData.email,
      licenseKey: activationData.licenseKey,
      lastVerified: new Date().toISOString()
    };
    localStorage.setItem('memory_monster_license', JSON.stringify(licenseData));
    
    // Show success message
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };
  
  const handleCheckLicenseStartup = async () => {
    console.log('🔍 Checking license on startup...');
    
    // Try to get email from storage or prompt user
    const storedLicense = localStorage.getItem('memory_monster_license');
    let email = null;
    
    if (storedLicense) {
      try {
        const license = JSON.parse(storedLicense);
        email = license.userEmail;
      } catch (e) {
        console.error('Failed to parse stored license:', e);
      }
    }
    
    if (email && window.electronAPI.verifyLicense) {
      const deviceId = localStorage.getItem('memory_monster_device_id') || 
                      'mm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
      
      const result = await window.electronAPI.verifyLicense({
        userEmail: email,
        deviceId: deviceId,
        appVersion: '1.0.0'
      });
      
      if (result.valid && (result.plan === 'pro' || result.plan === 'trial')) {
        console.log('✅ Pro license verified on startup');
        setLicenseActivated(true);
        setUserEmail(email);
        
        // Update local storage
        const licenseData = {
          status: result.plan,
          userEmail: email,
          lastVerified: new Date().toISOString(),
          features: result.features
        };
        localStorage.setItem('memory_monster_license', JSON.stringify(licenseData));
      }
    }
  };
  
  // Listen for IPC messages from main process
  if (window.electronAPI && window.electronAPI.on) {
    window.electronAPI.on('license-activated', (_, data) => {
      handleLicenseActivated(data);
    });
    
    window.electronAPI.on('check-license-on-startup', () => {
      handleCheckLicenseStartup();
    });
  }
  
  // Cleanup function
  return () => {
    if (window.electronAPI && window.electronAPI.removeAllListeners) {
      window.electronAPI.removeAllListeners('license-activated');
      window.electronAPI.removeAllListeners('check-license-on-startup');
    }
  };
}, []);

// ===== UPDATE MODAL EVENT LISTENERS =====
useEffect(() => {
  // Initialize update reminder manager
  console.log('🔄 Initializing update reminder manager...');

  // Event listeners for update modals
  const handleShowOnboardingUpdatePrompt = () => {
    console.log('📱 Showing onboarding update prompt');
    setShowOnboardingUpdateModal(true);
  };

  const handleShowUpdateReminder = (event) => {
    console.log('🔔 Showing update reminder:', event.detail);
    setUpdateReminderInfo(event.detail);
    setShowUpdateReminderModal(true);
  };

  const handleShowUpgradeUpdatePrompt = () => {
    console.log('👑 Showing upgrade update prompt');
    setShowUpgradeUpdateModal(true);
  };

  // Add event listeners
  window.addEventListener('show-onboarding-update-prompt', handleShowOnboardingUpdatePrompt);
  window.addEventListener('show-update-reminder', handleShowUpdateReminder);
  window.addEventListener('show-upgrade-update-prompt', handleShowUpgradeUpdatePrompt);

  // Cleanup on unmount
  return () => {
    window.removeEventListener('show-onboarding-update-prompt', handleShowOnboardingUpdatePrompt);
    window.removeEventListener('show-update-reminder', handleShowUpdateReminder);
    window.removeEventListener('show-upgrade-update-prompt', handleShowUpgradeUpdatePrompt);
  };
}, []);

// ===== LOADING SCREEN =====
if (isLoading) {
  return <LoadingScreen loadingMessage={loadingMessage} />;
}

// ===== MAIN APP RENDER =====
 return (
   <>
   <div style={containerStyle}>
     {/* Update Notification - Always rendered */}
     <UpdateNotification />
     
     {/* Confetti Animation */}
     {showConfetti && <Confetti />}
     
     {/* Activate Plan Modal */}
    {currentView === 'speedTracker' && (showWelcomeModal || showActivationModal) && 
  <ActivatePlanModal 
    onSkip={handleSkipActivation}
    onActivateNow={handleActivateNow}
    onBuyPlan={handleBuyPlan}
    onUseCode={handleUseCode}
  />
}

    {/* License Key Modal */}
    {showLicenseKeyModal && (
      <LicenseKeyModal
        onClose={() => setShowLicenseKeyModal(false)}
        onActivateSuccess={handleLicenseActivateSuccess}
      />
    )}

    {/* Pro Activation Success Modal */}
    {showProSuccessModal && proActivationData && (
      <ProActivationSuccessModal
        onClose={() => {
          setShowProSuccessModal(false);
          setProActivationData(null);
          // Trigger confetti after closing success modal
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
          // Reload the app to show Pro features
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }}
        userEmail={proActivationData.email}
        plan={proActivationData.plan}
      />
    )}

    {/* Update Modals */}
    <OnboardingUpdateModal
      isVisible={showOnboardingUpdateModal}
      onClose={() => setShowOnboardingUpdateModal(false)}
    />

    <UpdateReminderModal
      isVisible={showUpdateReminderModal}
      updateInfo={updateReminderInfo}
      onClose={() => {
        setShowUpdateReminderModal(false);
        setUpdateReminderInfo(null);
      }}
    />

    <UpgradeUpdateModal
      isVisible={showUpgradeUpdateModal}
      onClose={() => setShowUpgradeUpdateModal(false)}
    />

     {/* Floating Unlock Button - Only show on specific views (NOT speedTracker or settings) */}
{['apps'].includes(currentView) && (
<div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 999 }}>
  <div style={{ 
    position: 'absolute', 
    top: '-4px', 
    left: '-4px', 
    right: '-4px', 
    bottom: '-4px', 
    borderRadius: '20px', 
    background: `conic-gradient(from 0deg, rgba(114, 9, 183, 0.8), rgba(83, 52, 131, 0.8), rgba(15, 52, 96, 0.8), rgba(114, 9, 183, 0.8))`, 
    animation: 'smoothRotate 5s linear infinite', 
    filter: 'blur(8px)' 
  }}></div>
  
  <button
    onClick={() => openUpgradePage()}
    style={{ 
      position: 'relative',
      padding: '12px 24px', 
      background: `linear-gradient(135deg, #7209b7 0%, #533483 50%, #16213e 100%)`, 
      color: 'white', 
      border: 'none', 
      borderRadius: '16px', 
      fontSize: '14px', 
      fontWeight: '600', 
      cursor: 'pointer',
      boxShadow: '0 8px 32px rgba(114, 9, 183, 0.4)',
      transition: 'all 0.3s ease',
      zIndex: 2
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px) scale(1.05)';
      e.target.style.boxShadow = '0 12px 40px rgba(114, 9, 183, 0.5)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0) scale(1)';
      e.target.style.boxShadow = '0 8px 32px rgba(114, 9, 183, 0.4)';
    }}
  >
    🔓 Unlock Full Version
  </button>
</div>
)}
     
     {/* ONBOARDING SCREENS */}
     {currentView === 'userType' && <UserTypeScreen 
       onContinue={setCurrentView} 
       onSkip={() => setCurrentView('diskAccess')} 
     />}
     {currentView === 'appShowcase' && <AppShowcaseScreen 
       onContinue={setCurrentView} 
       openExternalLink={openExternalLink} 
     />}
     {currentView === 'diskAccess' && <DiskAccessScreen 
       onContinue={setCurrentView} 
       onGrantAccess={() => {
         // Call the system utility function with the correct parameters
         handleGrantDiskAccess(setDiskAccessGranted, setCurrentView);
       }}
       onSkip={() => setCurrentView('speedTracker')}
     />}
     {currentView === 'accessGranted' && <AccessGrantedScreen 
       onContinue={() => setCurrentView('speedTracker')} 
     />}
    
     {/* MAIN SPEED TRACKER VIEW - This is now the main experience */}
{currentView === 'speedTracker' && (
  <SpeedTracker 
    currentView={currentView}
    setCurrentView={setCurrentView}
    issues={issues}           // Keep as is
    setIssues={setIssues}     // Keep as is  
    fixingStates={fixingStates}
    setFixingStates={setFixingStates}
    minimizedIssues={minimizedIssues}
    setMinimizedIssues={setMinimizedIssues}
    handleFix={handleFixLocal}
    animatingMemory={animatingMemory}
    getSeverityStyle={getSeverityStyle}
    // License key modal props
    setShowLicenseKeyModal={setShowLicenseKeyModal}
    handleLicenseActivateSuccess={handleLicenseActivateSuccess}
    // Remove these props that don't exist in new SpeedTracker:
    // handleUnlockAll={handleUnlockAllLocal}
    // totalMemoryFreed={totalMemoryFreed}
    // setTotalMemoryFreed={setTotalMemoryFreed}
    // remainingMemory={remainingMemory}
    // setRemainingMemory={setRemainingMemory}
    // setAnimatingMemory={setAnimatingMemory}
    // animateMemoryCounter={animateMemoryCounter}
    // hasCompletedFirstFix={hasCompletedFirstFix}
    // onScan={handleScan}
    // atlasMessages={atlasMessages}
    // setAtlasMessages={setAtlasMessages}
    // userInput={userInput}
    // setUserInput={setUserInput}
    // handleSendMessage={handleSendMessage}
    // handleKeyPress={handleKeyPress}
  />
)}

     {/* SETTINGS VIEW */}
{currentView === 'settings' && (
  <EnhancedSettingsView 
    currentView={currentView}
    setCurrentView={setCurrentView}
  />
)}

     {/* APPS VIEW */}
{currentView === 'apps' && (
  <AppsView 
    currentView={currentView}
    setCurrentView={setCurrentView}
  />
)}
     
     {/* CSS Animations */}
     <style>{`
       @keyframes spin {
         0% { transform: rotate(0deg); }
         100% { transform: rotate(360deg); }
       }
       
       @keyframes pulse {
         0%, 100% { opacity: 1; transform: scale(1); }
         50% { opacity: 0.8; transform: scale(1.05); }
       }
       
       @keyframes heartbeat {
         0%, 100% { transform: scale(1); }
         14% { transform: scale(1.1); }
         28% { transform: scale(1); }
         42% { transform: scale(1.1); }
         70% { transform: scale(1); }
       }
       
       @keyframes rotate {
         0% { transform: rotate(0deg); }
         100% { transform: rotate(360deg); }
       }
       
       @keyframes loadingBar {
         0% { width: 0%; }
         50% { width: 100%; }
         100% { width: 0%; }
       }
       
       @keyframes fadeInOut {
         0% { opacity: 1; }
         100% { opacity: 0.6; }
       }
       
       @keyframes float {
         0%, 100% { transform: translateY(0px); }
         50% { transform: translateY(-20px); }
       }
       
       @keyframes confetti {
         0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
         100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
       }
       
       @keyframes gentlePulse {
         0%, 100% { transform: scale(1); box-shadow: 0 20px 60px rgba(16, 185, 129, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.8), 0 0 0 8px rgba(16, 185, 129, 0.2); }
         50% { transform: scale(1.02); box-shadow: 0 24px 72px rgba(16, 185, 129, 0.5), 0 0 0 6px rgba(255, 255, 255, 0.9), 0 0 0 12px rgba(16, 185, 129, 0.3); }
       }
       
       @keyframes logoSpin {
         0% { transform: rotate(0deg); }
         100% { transform: rotate(360deg); }
       }
       
       @keyframes success {
         0% { transform: scale(0.8); opacity: 0; }
         50% { transform: scale(1.1); }
         100% { transform: scale(1); opacity: 1; }
       }
       
       @keyframes shimmer {
         0% { transform: translateX(-100%); }
         100% { transform: translateX(100%); }
       }
       
       @keyframes slideIn {
         0% { transform: translateY(20px); opacity: 0; }
         100% { transform: translateY(0); opacity: 1; }
       }
       
       @keyframes fadeIn {
         0% { opacity: 0; }
         100% { opacity: 1; }
       }
       
       @keyframes slideUp {
         0% { transform: translateY(30px); opacity: 0; }
         100% { transform: translateY(0); opacity: 1; }
       }
       
       @keyframes sparkle {
         0%, 100% { opacity: 0.5; transform: scale(1); }
         50% { opacity: 1; transform: scale(1.2); }
       }
         @keyframes smoothFloat {
         0%, 100% { transform: translateY(0px); }
         50% { transform: translateY(-15px); }
       }
       
       @keyframes smoothPulse {
         0%, 100% { transform: scale(1); opacity: 1; }
         50% { transform: scale(1.05); opacity: 0.9; }
       }
       
       @keyframes smoothRotate {
         0% { transform: rotate(0deg); }
         100% { transform: rotate(360deg); }
       }
       
       @keyframes smoothSparkle {
         0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
         50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
       }

       @keyframes gradientShift {
         0% { background-position: 0% 50%; }
         25% { background-position: 100% 50%; }
         50% { background-position: 100% 100%; }
         75% { background-position: 0% 100%; }
         100% { background-position: 0% 50%; }
       }

       @keyframes slowPulse {
         0%, 100% { transform: translateX(-50%) scale(1); opacity: 1; }
         50% { transform: translateX(-50%) scale(1.02); opacity: 0.95; }
       }

       @keyframes fastPulse {
         0%, 100% { transform: scale(1); opacity: 1; }
         50% { transform: scale(1.05); opacity: 0.9; }
       }

       @keyframes redBarFill {
  0% { 
    stroke-dasharray: 0 999;
  }
  100% { 
    stroke-dasharray: 900 999;
  }
}
       
       /* Scrollbar Styling */
       ::-webkit-scrollbar {
         width: 8px;
       }
       
       ::-webkit-scrollbar-track {
         background: rgba(16, 185, 129, 0.1);
         border-radius: 12px;
       }
       
       ::-webkit-scrollbar-thumb {
         background: rgba(16, 185, 129, 0.3);
         borderRadius: 12px;
         transition: background 0.3s ease;
       }
       
       ::-webkit-scrollbar-thumb:hover {
         background: rgba(16, 185, 129, 0.5);
       }
       
       /* Firefox scrollbar */
       * {
         scrollbar-width: thin;
         scrollbar-color: rgba(16, 185, 129, 0.3) rgba(16, 185, 129, 0.1);
       }
       
       /* Focus states for accessibility */
       button:focus-visible {
         outline: 2px solid #10b981;
         outline-offset: 2px;
       }
       
       input:focus-visible {
         outline: 2px solid #10b981;
         outline-offset: 2px;
       }
     `}</style>
   </div>
   </>
 );
};

// Wrap the app with FeatureGate provider
const App = () => {
  return (
    <FeatureGateProvider>
      <MacOptimizerApp />
    </FeatureGateProvider>
  );
};

export default App;
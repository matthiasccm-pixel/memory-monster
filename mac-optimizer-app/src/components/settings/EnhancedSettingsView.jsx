import React, { useState, useEffect } from 'react';
import settingsManager from '../../utils/settingsManager.js';
import SettingsView from './SettingsView.jsx';
import DisableAutoUpdateModal from '../modals/DisableAutoUpdateModal.jsx';

const EnhancedSettingsView = ({ currentView, setCurrentView }) => {
  // Initialize all settings states with current values from settingsManager
  const [autoScanWeekly, setAutoScanWeekly] = useState(false);
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(false);
  const [memoryAlerts, setMemoryAlerts] = useState(true);
  const [autoMinimize, setAutoMinimize] = useState(true);
  const [backgroundLiberation, setBackgroundLiberation] = useState(false);
  const [scanIntensity, setScanIntensity] = useState('medium');
  const [startAtLogin, setStartAtLogin] = useState(false);
  const [keepRunning, setKeepRunning] = useState(false);
  const [showInMenuBar, setShowInMenuBar] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [successNotifications, setSuccessNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [monsterAlerts, setMonsterAlerts] = useState(true);
  const [tips, setTips] = useState(true);
  const [deepScanning, setDeepScanning] = useState(false);
  const [monitorExternal, setMonitorExternal] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  
  // AI Learning Settings
  const [aiLearningEnabled, setAiLearningEnabled] = useState(true);
  const [shareOptimizationData, setShareOptimizationData] = useState(true);
  const [receiveIntelligenceUpdates, setReceiveIntelligenceUpdates] = useState(true);
  const [adaptiveStrategies, setAdaptiveStrategies] = useState(true);
  const [personalizedOptimizations, setPersonalizedOptimizations] = useState(true);
  
  // Modal state
  const [showDisableAutoUpdateModal, setShowDisableAutoUpdateModal] = useState(false);

  // Load initial settings on component mount
  useEffect(() => {
    const currentSettings = settingsManager.getAll();
    setAutoScanWeekly(currentSettings.autoScanWeekly || false);
    setRealTimeMonitoring(currentSettings.realTimeMonitoring || false);
    setMemoryAlerts(currentSettings.memoryAlerts || true);
    setAutoMinimize(currentSettings.autoMinimize || true);
    setBackgroundLiberation(currentSettings.backgroundLiberation || false);
    setScanIntensity(currentSettings.scanIntensity || 'medium');
    setStartAtLogin(currentSettings.startAtLogin || false);
    setKeepRunning(currentSettings.keepRunning || false);
    setShowInMenuBar(currentSettings.showInMenuBar || false);
    setAutoUpdate(currentSettings.autoUpdate || true);
    setTheme(currentSettings.theme || 'dark');
    setSuccessNotifications(currentSettings.successNotifications || true);
    setWeeklyReports(currentSettings.weeklyReports || false);
    setMonsterAlerts(currentSettings.monsterAlerts || true);
    setTips(currentSettings.tips || true);
    setDeepScanning(currentSettings.deepScanning || false);
    setMonitorExternal(currentSettings.monitorExternal || false);
    setAnalytics(currentSettings.analytics || true);
    
    // Load AI Learning settings
    setAiLearningEnabled(currentSettings.aiLearningEnabled !== false); // Default true
    setShareOptimizationData(currentSettings.shareOptimizationData !== false); // Default true
    setReceiveIntelligenceUpdates(currentSettings.receiveIntelligenceUpdates !== false); // Default true
    setAdaptiveStrategies(currentSettings.adaptiveStrategies !== false); // Default true
    setPersonalizedOptimizations(currentSettings.personalizedOptimizations !== false); // Default true
  }, []);

  // Create enhanced setter functions that integrate with settingsManager
  const createEnhancedSetter = (key, localSetter) => {
    return async (value) => {
      try {
        await settingsManager.set(key, value);
        localSetter(value);
      } catch (error) {
        console.error(`Failed to update setting ${key}:`, error);
        // Revert to current value on error
        const currentValue = settingsManager.get(key);
        localSetter(currentValue);
      }
    };
  };

  // Special handler for auto-update that shows confirmation modal when disabling
  const enhancedSetAutoUpdate = async (value) => {
    // If trying to disable auto-updates, show confirmation modal
    if (!value && autoUpdate) {
      setShowDisableAutoUpdateModal(true);
      return;
    }
    
    // If enabling, just do it normally
    try {
      await settingsManager.set('autoUpdate', value);
      setAutoUpdate(value);
    } catch (error) {
      console.error('Failed to update auto-update setting:', error);
      const currentValue = settingsManager.get('autoUpdate');
      setAutoUpdate(currentValue);
    }
  };

  // Handle confirmation from disable modal
  const handleConfirmDisableAutoUpdate = async () => {
    try {
      await settingsManager.set('autoUpdate', false);
      setAutoUpdate(false);
      setShowDisableAutoUpdateModal(false);
      
      // Show notification that auto-updates are disabled
      await settingsManager.showNotification(
        'Auto-Updates Disabled',
        'You can re-enable them anytime in settings'
      );
    } catch (error) {
      console.error('Failed to disable auto-updates:', error);
    }
  };

  // Enhanced setters that integrate with Electron APIs
  const enhancedSetStartAtLogin = createEnhancedSetter('startAtLogin', setStartAtLogin);
  const enhancedSetKeepRunning = createEnhancedSetter('keepRunning', setKeepRunning);
  const enhancedSetShowInMenuBar = createEnhancedSetter('showInMenuBar', setShowInMenuBar);
  // enhancedSetAutoUpdate is defined above with special logic
  const enhancedSetTheme = createEnhancedSetter('theme', setTheme);
  const enhancedSetSuccessNotifications = createEnhancedSetter('successNotifications', setSuccessNotifications);
  const enhancedSetAutoMinimize = createEnhancedSetter('autoMinimize', setAutoMinimize);
  const enhancedSetAnalytics = createEnhancedSetter('analytics', setAnalytics);

  // For settings that are UI-only for now, use regular setters
  const enhancedSetAutoScanWeekly = createEnhancedSetter('autoScanWeekly', setAutoScanWeekly);
  const enhancedSetRealTimeMonitoring = createEnhancedSetter('realTimeMonitoring', setRealTimeMonitoring);
  const enhancedSetMemoryAlerts = createEnhancedSetter('memoryAlerts', setMemoryAlerts);
  const enhancedSetBackgroundLiberation = createEnhancedSetter('backgroundLiberation', setBackgroundLiberation);
  const enhancedSetScanIntensity = createEnhancedSetter('scanIntensity', setScanIntensity);
  const enhancedSetWeeklyReports = createEnhancedSetter('weeklyReports', setWeeklyReports);
  const enhancedSetMonsterAlerts = createEnhancedSetter('monsterAlerts', setMonsterAlerts);
  const enhancedSetTips = createEnhancedSetter('tips', setTips);
  const enhancedSetDeepScanning = createEnhancedSetter('deepScanning', setDeepScanning);
  const enhancedSetMonitorExternal = createEnhancedSetter('monitorExternal', setMonitorExternal);
  
  // AI Learning enhanced setters
  const enhancedSetAiLearningEnabled = createEnhancedSetter('aiLearningEnabled', setAiLearningEnabled);
  const enhancedSetShareOptimizationData = createEnhancedSetter('shareOptimizationData', setShareOptimizationData);
  const enhancedSetReceiveIntelligenceUpdates = createEnhancedSetter('receiveIntelligenceUpdates', setReceiveIntelligenceUpdates);
  const enhancedSetAdaptiveStrategies = createEnhancedSetter('adaptiveStrategies', setAdaptiveStrategies);
  const enhancedSetPersonalizedOptimizations = createEnhancedSetter('personalizedOptimizations', setPersonalizedOptimizations);

  return (
    <>
      <SettingsView
        currentView={currentView}
        setCurrentView={setCurrentView}
        autoScanWeekly={autoScanWeekly}
        setAutoScanWeekly={enhancedSetAutoScanWeekly}
        realTimeMonitoring={realTimeMonitoring}
        setRealTimeMonitoring={enhancedSetRealTimeMonitoring}
        memoryAlerts={memoryAlerts}
        setMemoryAlerts={enhancedSetMemoryAlerts}
        autoMinimize={autoMinimize}
        setAutoMinimize={enhancedSetAutoMinimize}
        backgroundLiberation={backgroundLiberation}
        setBackgroundLiberation={enhancedSetBackgroundLiberation}
        scanIntensity={scanIntensity}
        setScanIntensity={enhancedSetScanIntensity}
        startAtLogin={startAtLogin}
        setStartAtLogin={enhancedSetStartAtLogin}
        keepRunning={keepRunning}
        setKeepRunning={enhancedSetKeepRunning}
        showInMenuBar={showInMenuBar}
        setShowInMenuBar={enhancedSetShowInMenuBar}
        autoUpdate={autoUpdate}
        setAutoUpdate={enhancedSetAutoUpdate}
        theme={theme}
        setTheme={enhancedSetTheme}
        successNotifications={successNotifications}
        setSuccessNotifications={enhancedSetSuccessNotifications}
        weeklyReports={weeklyReports}
        setWeeklyReports={enhancedSetWeeklyReports}
        monsterAlerts={monsterAlerts}
        setMonsterAlerts={enhancedSetMonsterAlerts}
        tips={tips}
        setTips={enhancedSetTips}
        deepScanning={deepScanning}
        setDeepScanning={enhancedSetDeepScanning}
        monitorExternal={monitorExternal}
        setMonitorExternal={enhancedSetMonitorExternal}
        analytics={analytics}
        setAnalytics={enhancedSetAnalytics}
        
        // AI Learning props
        aiLearningEnabled={aiLearningEnabled}
        setAiLearningEnabled={enhancedSetAiLearningEnabled}
        shareOptimizationData={shareOptimizationData}
        setShareOptimizationData={enhancedSetShareOptimizationData}
        receiveIntelligenceUpdates={receiveIntelligenceUpdates}
        setReceiveIntelligenceUpdates={enhancedSetReceiveIntelligenceUpdates}
        adaptiveStrategies={adaptiveStrategies}
        setAdaptiveStrategies={enhancedSetAdaptiveStrategies}
        personalizedOptimizations={personalizedOptimizations}
        setPersonalizedOptimizations={enhancedSetPersonalizedOptimizations}
      />
      
      {/* Disable Auto-Update Confirmation Modal */}
      <DisableAutoUpdateModal
        isVisible={showDisableAutoUpdateModal}
        onConfirm={handleConfirmDisableAutoUpdate}
        onCancel={() => setShowDisableAutoUpdateModal(false)}
      />
    </>
  );
};

export default EnhancedSettingsView;
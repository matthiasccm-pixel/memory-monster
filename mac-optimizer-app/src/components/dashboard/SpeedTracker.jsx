import React, { useState, useEffect } from 'react';
import { Zap, Crown, Activity, Settings, Package } from 'lucide-react';
import { useFeatureGate } from '../../core/licensing/useFeatureGate.js';
import { containerStyle } from '../../styles/commonStyles.js';
import SpeedDial from './SpeedDial.jsx';
import Firefoxlogo from '../shared/Firefoxlogo.jsx';
import ActivatePlanModal from '../modals/ActivatePlanModal.jsx';
import { openUpgradePage } from '../../utils/upgradeUtils.js';
import AppDrawer from './AppDrawer.jsx';

// NEW: Import Intelligence System
import OptimizationEngine from '../../core/intelligence/OptimizationEngine.js';
import ContextualDecisionEngine from '../../core/intelligence/ContextualEngine.js';
import IntelligentConsentManager from '../../core/intelligence/ConsentManager.js';

console.log('🔍 SPEEDTRACKER DEBUG: Component loading...');

const SpeedTracker = ({ 
  currentView, 
  setCurrentView,
  issues: propIssues,
  setIssues: setPropIssues,
  setShowLicenseKeyModal
}) => {
  console.log('🔍 SPEEDTRACKER DEBUG: Component initialized');
  
  // FIXED: Call useFeatureGate at the very top - BEFORE any other logic
  const { 
    hasFeature, 
    getRemainingScans, 
    decrementScans, 
    openUpgradeModal, 
    isPro, 
    isFree,
    simulateProUpgrade,
    simulateFreeReset
  } = useFeatureGate();
  
  // NEW: Intelligence System State - WITH DEBUG
  let optimizationEngine, contextualEngine, consentManager;
  
  try {
    console.log('🔍 Creating OptimizationEngine...');
    optimizationEngine = new OptimizationEngine();
    console.log('✅ OptimizationEngine created');
    
    console.log('🔍 Creating ContextualDecisionEngine...');
    contextualEngine = new ContextualDecisionEngine();
    console.log('✅ ContextualDecisionEngine created');
    
    console.log('🔍 Creating IntelligentConsentManager...');
    consentManager = new IntelligentConsentManager();
    console.log('✅ IntelligentConsentManager created');
  } catch (error) {
    console.error('❌ INTELLIGENCE INIT FAILED:', error);
    optimizationEngine = null;
    contextualEngine = null;
    consentManager = null;
  }

  const [optimizationEngineState] = useState(optimizationEngine);
  
  // Existing state
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [realIssues, setRealIssues] = useState([]);
  const [systemMemory, setSystemMemory] = useState(null);
  const [isIntelligentScanning, setIsIntelligentScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [intelligentIssues, setIntelligentIssues] = useState([]);

  // Community stats state
  const [memoryFreedToday, setMemoryFreedToday] = useState(2847);
  const [scansToday, setScansToday] = useState(1234567890);
  const [proMembers, setProMembers] = useState(1400000);
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);

  // NEW: App Drawer and Speed Integration State
  const [showDrawer, setShowDrawer] = useState(false);
  const [problematicApps, setProblematicApps] = useState([]);
  const [appOptimizationProgress, setAppOptimizationProgress] = useState({});
  const [totalSpeedGain, setTotalSpeedGain] = useState(0);

  const liveUpdates = [
    "2,847 Macs optimized today",
    "Community discovered: Adobe using 40% more memory than needed", 
    "Most freed today: Chrome tabs (avg 3.2GB per user)",
    "Live: Sarah just freed 8GB in San Francisco",
    "Pro tip: Memory Monster works best when running daily",
    "James in London just boosted his Mac by 67%"
  ];

  // Use intelligent issues if we have them, otherwise real issues, otherwise prop issues
  const issues = intelligentIssues.length > 0 ? intelligentIssues : (realIssues.length > 0 ? realIssues : propIssues || []);

  // Community stats cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTickerIndex((prev) => (prev + 1) % liveUpdates.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Slow moving counters
  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryFreedToday(prev => prev + Math.floor(Math.random() * 3));
      setScansToday(prev => prev + Math.floor(Math.random() * 50));
      setProMembers(prev => prev + Math.floor(Math.random() * 2));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B+`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`;
    }
    return num.toString();
  };

  // NEW: App Optimization Handlers
  const handleSpeedScanComplete = () => {
    console.log('🚀 Speed scan completed, showing app drawer');
    console.log('🔍 Current issues available:', issues.length);
    
    // Generate problematic apps from current issues
    const apps = issues.slice(0, 8).map((issue, index) => {
      const app = {
        id: issue.id || `app-${index}`,
        name: issue.app || 'Unknown App',
        memoryMB: issue.actualMemoryMB || Math.random() * 1500 + 500,
        processes: Math.floor(Math.random() * 8) + 1,
        optimizable: true,
        category: issue.type || 'productivity'
      };
      console.log('📱 Generated app:', app.name, app.memoryMB + 'MB');
      return app;
    });

    console.log('🎯 Setting', apps.length, 'apps in drawer');
    setProblematicApps(apps);
    setShowDrawer(true);
  };

  const handleOptimizeApp = async (appId) => {
    console.log('🔧 Optimizing app:', appId);
    
    // Start optimization animation
    setAppOptimizationProgress(prev => ({
      ...prev,
      [appId]: 0
    }));

    // Simulate optimization progress
    const interval = setInterval(() => {
      setAppOptimizationProgress(prev => {
        const currentProgress = prev[appId] || 0;
        const newProgress = Math.min(100, currentProgress + Math.random() * 15 + 5);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Update speed dial in real time
          const app = problematicApps.find(a => a.id === appId);
          if (app) {
            const speedGain = Math.min(8, app.memoryMB * 0.005); // Realistic gain
            setTotalSpeedGain(prev => prev + speedGain);
          }
        }
        
        return { ...prev, [appId]: newProgress };
      });
    }, 200 + Math.random() * 300);
  };

  const handleBulkOptimize = async (appIds) => {
    console.log('🚀 Bulk optimizing apps:', appIds);
    
    // Stagger the optimization start times for visual effect
    appIds.forEach((appId, index) => {
      setTimeout(() => {
        handleOptimizeApp(appId);
      }, index * 500);
    });
  };

  const handleDrawerClose = () => {
    setShowDrawer(false);
    
    // Reset scan state to allow scanning again
    setHasScanned(false);
    
    // If all apps are optimized, show success state
    const optimizedCount = Object.keys(appOptimizationProgress).filter(
      id => appOptimizationProgress[id] === 100
    ).length;
    
    if (optimizedCount === problematicApps.length && problematicApps.length > 0) {
      console.log('🎉 All apps optimized! Speed improvement:', totalSpeedGain);
      // SpeedDial will handle success state automatically
    }
  };

  // EXISTING: Function to transform real processes into issues (kept as fallback)
  const transformProcessesToIssues = (processes, systemMem) => {
    console.log('🔄 Transforming', processes.length, 'processes into issues');
    
    const memoryHogs = processes
      .filter(proc => proc.memoryMB > 500)
      .sort((a, b) => b.memoryMB - a.memoryMB)
      .slice(0, 10);

    console.log('📊 Found', memoryHogs.length, 'processes over 500MB');

    return memoryHogs.map((proc, index) => {
      let severity = 'low';
      let impact = Math.min(Math.floor(proc.memoryMB / 100), 15);
      
      if (proc.memoryMB > 2000) {
        severity = 'critical';
        impact = Math.min(impact + 10, 25);
      } else if (proc.memoryMB > 1000) {
        severity = 'high';
        impact = Math.min(impact + 5, 20);
      } else if (proc.memoryMB > 500) {
        severity = 'medium';
        impact = Math.min(impact + 2, 15);
      }

      const issue = {
        id: `real-${proc.pid}-${index}`,
        app: proc.app || proc.name,
        severity,
        impact,
        storage: proc.memoryMB > 1000 ? 
          (proc.memoryMB / 1000).toFixed(1) : 
          Math.round(proc.memoryMB),
        storageUnit: proc.memoryMB > 1000 ? 'GB' : 'MB',
        fixed: false,
        realProcess: true,
        pid: proc.pid,
        bundleId: proc.bundleId,
        actualMemoryMB: proc.memoryMB,
        // Add intelligence properties for consistency
        type: 'intelligent',
        issue: 'Memory Optimization Available',
        description: `AI recommends optimizing ${proc.app || proc.name} memory usage`
      };

      console.log('✅ Created intelligent-style issue:', issue.app, issue.storage + issue.storageUnit);
      return issue;
    });
  };

  // NEW: Helper functions for intelligent scanning
  const groupProcessesByApp = (processes) => {
    const appGroups = new Map();
    
    processes.forEach(process => {
      const bundleId = process.bundleId || `unknown.${process.name.toLowerCase().replace(/\\s+/g, '.')}`;
      
      if (!appGroups.has(bundleId)) {
        appGroups.set(bundleId, []);
      }
      appGroups.get(bundleId).push(process);
    });
    
    return appGroups;
  };

  const createIntelligentIssue = (analysis) => {
    const bestOptimization = analysis.optimizations[0];
    const estimatedSavings = bestOptimization ? 
      Math.round((bestOptimization.estimatedSavings.min + bestOptimization.estimatedSavings.max) / 2) : 
      Math.round(analysis.totalMemoryMB * 0.3);

    return {
      id: `intelligent_${analysis.bundleId}_${Date.now()}`,
      type: 'intelligent',
      app: analysis.profile.name,
      bundleId: analysis.bundleId,
      category: analysis.profile.category,
      issue: bestOptimization ? bestOptimization.name : 'Memory Optimization Available',
      description: bestOptimization ? bestOptimization.description : 'Optimize memory usage',
      storage: estimatedSavings > 1000 ? (estimatedSavings / 1000).toFixed(1) : estimatedSavings,
      storageUnit: estimatedSavings > 1000 ? 'GB' : 'MB',
      severity: estimatedSavings > 1000 ? 'high' : estimatedSavings > 500 ? 'medium' : 'low',
      impact: Math.min(Math.floor(estimatedSavings / 100), 25),
      fixed: false,
      actualMemoryMB: estimatedSavings
    };
  };

  // NEW: Intelligent scan function
  const handleIntelligentScan = async () => {
    console.log('🧠 Starting intelligent scan...');
    setIsIntelligentScanning(true);
    setScanProgress(0);
    setHasScanned(false);
    
    try {
      // Step 1: Get all running processes
      setScanProgress(20);
      
      const processes = await window.electronAPI.getDetailedProcesses();
      const memoryData = await window.electronAPI.getSystemMemory();
      setSystemMemory(memoryData);
      
      console.log('🧠 Got processes:', processes.length);
      
      // Step 2: Group processes by app
      setScanProgress(40);
      
      const appGroups = groupProcessesByApp(processes);
      console.log('🧠 Grouped into', appGroups.size, 'apps');
      
      let analysisResults = [];
      
      // Step 3: Try intelligent analysis if engines are available
      if (optimizationEngineState) {
        console.log('🧠 Using intelligent analysis...');
        let analysisCount = 0;
        for (const [bundleId] of appGroups) {
          try {
            const analysis = await optimizationEngineState.analyzeApp(bundleId);
            if (analysis && analysis.status === 'analyzed' && analysis.needsOptimization) {
              analysisResults.push(analysis);
            }
            analysisCount++;
            setScanProgress(40 + (analysisCount / appGroups.size) * 40);
          } catch (error) {
            console.error(`Error analyzing ${bundleId}:`, error);
          }
        }
        
        if (analysisResults.length > 0) {
          const newIssues = analysisResults.map(analysis => createIntelligentIssue(analysis));
          setIntelligentIssues(newIssues);
          setRealIssues([]);
          console.log('🧠 Generated', newIssues.length, 'true intelligent issues');
        }
      }
      
      // Step 4: Fallback to enhanced basic scan
      if (analysisResults.length === 0) {
        console.log('🧠 Using enhanced basic scan with intelligence styling...');
        const enhancedIssues = transformProcessesToIssues(processes, memoryData);
        setIntelligentIssues(enhancedIssues);
        setRealIssues([]);
        console.log('🧠 Generated', enhancedIssues.length, 'intelligence-styled issues');
      }
      
      setScanProgress(100);
      
      // Update issues for parent component
      if (setPropIssues) {
        const finalIssues = intelligentIssues.length > 0 ? intelligentIssues : transformProcessesToIssues(processes, memoryData);
        setPropIssues(finalIssues);
      }
      
    } catch (error) {
      console.error('❌ Intelligent scan failed:', error);
    } finally {
      setTimeout(() => {
        setIsIntelligentScanning(false);
        setScanProgress(0);
        setHasScanned(true);
      }, 1000);
    }
  };

  // UPDATED: Handle scan action with intelligence
  const handleScan = async () => {
    console.log('🚀 handleScan called');
    
    if (isFree && getRemainingScans() <= 0) {
      setShowActivationModal(true);
      return;
    }

    setIsScanning(true);
    setHasScanned(false);

    // Decrement scans for free users
    if (isFree) {
      decrementScans();
    }

    try {
      // Use intelligent scan for all users
      console.log('🧠 Starting intelligent scan for all users...');
      await handleIntelligentScan();
    } catch (error) {
      console.error('❌ Scan failed in handleScan:', error);
      setTimeout(() => {
        setIsScanning(false);
        setHasScanned(true);
      }, 1000);
    } finally {
      setIsScanning(false);
    }
  };

  // EXISTING: Handle activation modal actions
  const handleActivateNow = () => {
    setShowActivationModal(false);
    openUpgradePage();
  };

  const handleBuyPlan = () => {
    setShowActivationModal(false);
    openUpgradePage();
  };

  const handleSkipActivation = () => {
    setShowActivationModal(false);
  };

  const handleUnlockFullVersion = () => {
    openUpgradePage();
  };

  // EXISTING: Sidebar styles
  const sidebarStyle = {
    background: `linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.10) 50%, rgba(255, 255, 255, 0.05) 100%)`,
    backdropFilter: 'blur(24px) saturate(180%)',
    borderRight: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 0 40px rgba(0, 0, 0, 0.3) inset'
  };

  const sidebarItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    borderRadius: '16px',
    color: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    fontSize: '15px',
    fontWeight: '600',
    position: 'relative',
    overflow: 'hidden'
  };

  const activeSidebarItemStyle = {
    ...sidebarItemStyle,
    background: `linear-gradient(135deg, rgba(114, 9, 183, 0.4) 0%, rgba(83, 52, 131, 0.3) 100%)`,
    color: 'white',
    boxShadow: `0 8px 32px rgba(114, 9, 183, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset`
  };

  return (
    <div style={containerStyle}>
      {/* Activation Modal */}
      {showActivationModal && (
        <ActivatePlanModal 
          onSkip={handleSkipActivation}
          onActivateNow={handleActivateNow}
          onBuyPlan={handleBuyPlan}
          onUseCode={() => {
            setShowActivationModal(false);
            if (setShowLicenseKeyModal) {
              setShowLicenseKeyModal(true);
            }
          }}
        />
      )}

      {/* Main layout container - FIXED: Only 2 columns now */}
      <div style={{
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Left Sidebar */}
        <div style={sidebarStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', padding: '0 4px' }}>
            <div style={{ width: '48px', height: '48px', background: `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <Firefoxlogo size={32} />
            </div>
            <div>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '800', margin: '0 0 2px 0' }}>Memory Monster</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: '0', fontWeight: '500' }}>
                🚀 Speed Intelligence
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div 
            style={currentView === 'speedTracker' ? activeSidebarItemStyle : sidebarItemStyle} 
            onClick={() => setCurrentView('speedTracker')}
          >
            <Activity size={20} />
            <span>🚀 Speed Tracker</span>
            <div style={{
              background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
              color: 'white',
              fontSize: '8px',
              fontWeight: '700',
              padding: '2px 4px',
              borderRadius: '4px',
              marginLeft: 'auto'
            }}>
              AI
            </div>
          </div>
          <div 
            style={currentView === 'apps' ? activeSidebarItemStyle : sidebarItemStyle} 
            onClick={() => setCurrentView('apps')}
          >
            <Package size={20} />
            <span>Apps</span>
            <div style={{
              background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
              color: 'white',
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '6px',
              marginLeft: 'auto'
            }}>
              PRO
            </div>
          </div>
          <div 
            style={currentView === 'settings' ? activeSidebarItemStyle : sidebarItemStyle} 
            onClick={() => setCurrentView('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </div>

          <div style={{ flex: 1 }}></div>

          {/* Memory Monster Community Stats */}
          {isFree && (
            <div style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)`,
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '20px 16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '16px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: 'white',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                marginBottom: '16px'
              }}>
                🌍 Memory Monster Community
              </div>
              
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: 'white',
                  lineHeight: '1',
                  marginBottom: '4px',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                  {formatNumber(memoryFreedToday)}TB
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500'
                }}>
                  Speed Freed Today
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '600'
              }}>
                <span>{formatNumber(scansToday)} Scans</span>
                <div style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.5)'
                }} />
                <span>{formatNumber(proMembers)} Pro Members</span>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '8px 12px',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500',
                minHeight: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                lineHeight: '1.3'
              }}>
                {liveUpdates[currentTickerIndex]}
              </div>
            </div>
          )}

          {/* Unlock Button */}
          {isFree && (
            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <button
                onClick={handleUnlockFullVersion}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(114, 9, 183, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Crown className="w-4 h-4" />
                🚀 Unlock Pro Today
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area - Centered SpeedDial */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          position: 'relative',
          width: '100%'
        }}>
          <SpeedDial 
            onScanComplete={handleSpeedScanComplete}
            onScanStart={handleScan}
            onOptimizationComplete={() => console.log('🎉 Optimization cycle complete')}
            isScanning={isIntelligentScanning}
            optimizationProgress={totalSpeedGain}
            scanButtonVisible={true}
            size="large"
          />

          {/* Progress bar for intelligent scanning */}
          {isIntelligentScanning && (
            <div style={{
              marginTop: '24px',
              width: '300px',
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${scanProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #7209b7, #533483)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes loadingBar {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>

      {/* App Optimization Drawer */}
      <AppDrawer 
        isOpen={showDrawer}
        onClose={handleDrawerClose}
        problematicApps={problematicApps}
        onOptimizeApp={handleOptimizeApp}
        onBulkOptimize={handleBulkOptimize}
        optimizationProgress={appOptimizationProgress}
        totalSpeedGain={totalSpeedGain}
      />
      
    </div>
  );
};

export default SpeedTracker;
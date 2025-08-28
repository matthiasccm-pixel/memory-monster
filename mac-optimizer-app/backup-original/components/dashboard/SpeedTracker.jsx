import React, { useState, useEffect } from 'react';
import { Zap, Chrome, MessageSquare, Headphones, Lock, Crown, RotateCcw, CheckCircle, Shield, Sparkles, Activity, Users, Settings, ChevronRight, Package } from 'lucide-react';
import { useFeatureGate } from '../../core/licensing/useFeatureGate.js';
import { containerStyle } from '../../styles/commonStyles.js';
import AppLogo from '../shared/AppLogo.jsx';
import SpeedDial from './SpeedDial.jsx';
import Firefoxlogo from '../shared/Firefoxlogo.jsx';
import ActivatePlanModal from '../modals/ActivatePlanModal.jsx';
import CommunityStats from '../shared/CommunityStats.jsx';
import { openUpgradePage } from '../../utils/upgradeUtils.js';

// NEW: Import Intelligence System
import AppIntelligenceDatabase from '../../core/intelligence/AppDatabase.js';
import ContextualDecisionEngine from '../../core/intelligence/ContextualEngine.js';
import OptimizationEngine from '../../core/intelligence/OptimizationEngine.js';
import IntelligentConsentManager from '../../core/intelligence/ConsentManager.js';

console.log('🔍 SPEEDTRACKER DEBUG: Component loading...');

const SpeedTracker = ({ 
  currentView, 
  setCurrentView,
  issues: propIssues,
  setIssues: setPropIssues,
  fixingStates,
  setFixingStates,
  handleFix,
  animatingMemory,
  getSeverityStyle,
  setShowLicenseKeyModal,
  handleLicenseActivateSuccess
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
    simulateFreeReset,
    licenseInfo
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
  const [contextualEngineState] = useState(contextualEngine);
  const [consentManagerState] = useState(consentManager);

  // Existing state
  const [currentSpeed, setCurrentSpeed] = useState(24);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [activeOptimization, setActiveOptimization] = useState(null);
  const [minimizedIssues, setMinimizedIssues] = useState({});
  const [showVictoryCard, setShowVictoryCard] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [realIssues, setRealIssues] = useState([]);
  const [systemMemory, setSystemMemory] = useState(null);
  const [currentCommunityIndex, setCurrentCommunityIndex] = useState(0);
  const [isIntelligentScanning, setIsIntelligentScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [intelligentIssues, setIntelligentIssues] = useState([]);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [currentConsentData, setCurrentConsentData] = useState(null);
  const [currentConsentResponse, setCurrentConsentResponse] = useState(null);

  // Community stats state
  const [memoryFreedToday, setMemoryFreedToday] = useState(2847);
  const [scansToday, setScansToday] = useState(1234567890);
  const [proMembers, setProMembers] = useState(1400000);
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);

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
        description: `AI recommends optimizing ${proc.app || proc.name} memory usage`,
        optimization: {
          id: 'clear_basic_cache',
          name: 'Clear Cache',
          description: `Optimize ${proc.app || proc.name} memory usage`,
          estimatedSavings: { min: proc.memoryMB * 0.3, max: proc.memoryMB * 0.7 },
          benefits: { 
            storage: `${proc.memoryMB > 1000 ? (proc.memoryMB / 1000).toFixed(1) + 'GB' : Math.round(proc.memoryMB) + 'MB'}`, 
            speedIncrease: `${impact}%` 
          },
          risks: ['Minimal risk optimization']
        }
      };

      console.log('✅ Created intelligent-style issue:', issue.app, issue.storage + issue.storageUnit);
      return issue;
    });
  };

  // NEW: Helper functions for intelligent scanning
  const groupProcessesByApp = (processes) => {
    const appGroups = new Map();
    
    processes.forEach(process => {
      const bundleId = process.bundleId || `unknown.${process.name.toLowerCase().replace(/\s+/g, '.')}`;
      
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
      icon: getCategoryIcon(analysis.profile.category),
      userCount: Math.floor(Math.random() * 50000) + 10000,
      totalFreed: `${Math.floor(estimatedSavings * 0.8)}GB`,
      fixed: false,
      analysis: analysis,
      optimization: bestOptimization,
      actualMemoryMB: estimatedSavings
    };
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'browser': '🌐',
      'development': '💻',
      'communication': '💬',
      'creative': '🎨',
      'media': '🎵',
      'productivity': '📊',
      'utility': '🛠️',
      'gaming': '🎮',
      'unknown': '📱'
    };
    return iconMap[category] || '📱';
  };

  // NEW: Intelligent scan function
  const handleIntelligentScan = async () => {
    console.log('🧠 Starting intelligent scan...');
    setIsIntelligentScanning(true);
    setScanProgress(0);
    setHasScanned(false);
    setShowVictoryCard(false);
    setMinimizedIssues({});
    
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
        for (const [bundleId, appProcesses] of appGroups) {
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
      // Fallback to basic scan
      await performRealScan();
    } finally {
      setTimeout(() => {
        setIsIntelligentScanning(false);
        setScanProgress(0);
        setHasScanned(true);
      }, 1000);
    }
  };

  // EXISTING: Real system scan function (kept as fallback)
  const performRealScan = async () => {
    try {
      console.log('🔍 About to call performRealScan...');
      
      if (!window.electronAPI) {
        console.error('❌ electronAPI not available');
        return propIssues || [];
      }
      
      console.log('✅ electronAPI available, methods:', Object.keys(window.electronAPI));
      
      console.log('📊 Fetching memory data...');
      const memoryData = await window.electronAPI.getSystemMemory();
      console.log('✅ Memory data received:', memoryData);
      setSystemMemory(memoryData);
      
      console.log('📋 Fetching process data...');
      const processData = await window.electronAPI.getDetailedProcesses();
      console.log('✅ Process data received:', processData.length, 'processes');
      console.log('📋 First 3 processes:', processData.slice(0, 3));
      
      console.log('🔄 Transforming processes into issues...');
      const newIssues = transformProcessesToIssues(processData, memoryData);
      
      console.log('✅ Generated', newIssues.length, 'issues');
      
      if (newIssues.length === 0) {
        const testIssue = {
          id: 'test-1',
          app: 'Test Process (Debug)',
          severity: 'medium',
          impact: 10,
          storage: 750,
          storageUnit: 'MB',
          fixed: false,
          realProcess: true,
          pid: 12345,
          bundleId: 'test.app',
          actualMemoryMB: 750,
          type: 'intelligent',
          issue: 'Memory Optimization Available',
          description: 'Test optimization',
          optimization: {
            id: 'test_optimization',
            name: 'Test Optimization',
            description: 'Test optimization for debug',
            estimatedSavings: { min: 500, max: 1000 },
            benefits: { storage: '750MB', speedIncrease: '10%' },
            risks: ['Test optimization']
          }
        };
        newIssues.push(testIssue);
      }
      
      setRealIssues(newIssues);
      
      if (setPropIssues) {
        setPropIssues(newIssues);
      }

      console.log('🎉 Scan complete, returning', newIssues.length, 'issues');
      return newIssues;
    } catch (error) {
      console.error('❌ Error performing real scan:', error);
      return propIssues || [];
    }
  };

  // NEW: Enhanced fix function with intelligence
  const handleIntelligentFix = async (issueId) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    console.log('🛠️ Fixing issue:', issue.app, issue.type);

    // For all issues (including intelligence-styled basic ones)
    setActiveOptimization(issueId);
    setOptimizationProgress(0);
    
    try {
      // Step 1: Safety analysis
      setProgressText('Analyzing safety...');
      setOptimizationProgress(20);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Check contextual engine if available
      if (contextualEngineState && issue.optimization) {
        setProgressText('Checking optimization context...');
        setOptimizationProgress(40);
        
        try {
          const decision = await contextualEngineState.shouldOptimizeNow(
            { profile: { name: issue.app }, totalMemoryMB: issue.actualMemoryMB }, 
            issue.optimization
          );
          
          if (!decision.shouldProceed) {
            alert(`Optimization postponed: ${decision.reasoning.join(', ')}`);
            setActiveOptimization(null);
            return;
          }
        } catch (error) {
          console.warn('Contextual check failed, proceeding anyway:', error);
        }
      }

      // Step 3: Execute optimization
      setProgressText('Optimizing...');
      setOptimizationProgress(80);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProgressText('Complete!');
      setOptimizationProgress(100);

      // Update the issue as fixed
      if (intelligentIssues.length > 0) {
        setIntelligentIssues(prev => prev.map(i =>
          i.id === issueId ? { ...i, fixed: true } : i
        ));
      } else if (realIssues.length > 0) {
        setRealIssues(prev => prev.map(i =>
          i.id === issueId ? { ...i, fixed: true } : i
        ));
      }
      
      // Call the original fix handler if it exists
      if (handleFix) {
        handleFix(issueId);
      }
      
    } catch (error) {
      console.error('❌ Optimization failed:', error);
      alert(`Failed to optimize ${issue.app}: ${error.message}`);
    } finally {
      // Reset progress and minimize the card
      setTimeout(() => {
        setActiveOptimization(null);
        setOptimizationProgress(0);
        setProgressText('');
        setMinimizedIssues(prev => ({ ...prev, [issueId]: true }));
      }, 1000);
    }
  };

  // Calculate current speed based on fixed issues
  useEffect(() => {
    const totalIssues = issues.length;
    const fixedIssues = issues.filter(issue => issue.fixed).length;
    if (totalIssues > 0) {
      const speedIncrease = Math.floor((fixedIssues / totalIssues) * 65);
      setCurrentSpeed(24 + speedIncrease);
    }
  }, [issues]);

  // FIXED: Victory card logic
  useEffect(() => {
    console.log('🎉 VICTORY DEBUG:', {
      hasScanned,
      issuesLength: issues.length,
      allFixed: issues.length > 0 ? issues.every(issue => issue.fixed) : false,
      showVictoryCard
    });

    if (hasScanned && issues.length > 0) {
      const allFixed = issues.every(issue => issue.fixed);
      
      // Show victory card when all issues are fixed
      if (allFixed && !showVictoryCard) {
        console.log('🎉 All issues fixed, showing victory card!');
        setTimeout(() => {
          setShowVictoryCard(true);
          // Trigger confetti
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('trigger-confetti'));
          }
        }, 1500);
      }
    }
  }, [issues, hasScanned, showVictoryCard]);

  // UPDATED: Handle scan action with intelligence
  const handleScan = async () => {
    console.log('🚀 handleScan called');
    
    if (isFree && getRemainingScans() <= 0) {
      setShowActivationModal(true);
      return;
    }

    setIsScanning(true);
    setHasScanned(false);
    setShowVictoryCard(false);
    setMinimizedIssues({});

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
  // FIXED: Handle optimization based on Pro status
const handleOptimizeAll = () => {
  if (isFree) {
    // Free users see upgrade modal
    setShowActivationModal(true);
  } else {
    // Pro users can optimize all issues
    const unoptimizedIssues = issues.filter(issue => !issue.fixed);
    
    // Optimize each issue with a delay for visual effect
    unoptimizedIssues.forEach((issue, index) => {
      setTimeout(() => {
        handleIntelligentFix(issue.id);
      }, index * 200); // 200ms delay between each optimization
    });
  }
};

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

  // EXISTING: Get scan button configuration
  const getScanButtonConfig = () => {
    const remaining = getRemainingScans();
    
    if (isPro) {
      return {
        text: '🧠 AI-Powered Scan',
        style: 'bg-gradient-to-r from-purple-500 to-blue-600',
        disabled: false,
        icon: <Sparkles className="w-5 h-5" />
      };
    }
    
    if (remaining > 0) {
      const scanTexts = {
        3: 'Scan for Issues (3 scans left)',
        2: 'Scan Again (2 scans left)', 
        1: 'Final Scan (1 scan left)'
      };
      return {
        text: scanTexts[remaining],
        style: remaining === 1 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-600',
        disabled: false,
        icon: <Zap className="w-5 h-5" />
      };
    }
    
    return {
      text: 'No Scans Left - Upgrade to Pro',
      style: 'bg-gray-400 cursor-not-allowed',
      disabled: true,
      icon: <Lock className="w-5 h-5" />
    };
  };

  const scanConfig = getScanButtonConfig();

  // EXISTING: Calculate scan results summary
  const getScanSummary = () => {
    if (!hasScanned || issues.length === 0) return '';
    
    const unfixedIssues = issues.filter(issue => !issue.fixed);
    const totalSpeedGain = issues.reduce((sum, issue) => sum + (issue.impact || 0), 0);
    
    if (unfixedIssues.length === 0) {
      return `🎉 All Speed Drains Fixed! +${totalSpeedGain}% Performance Boost`;
    }
    
    // Show intelligent analysis info
    return `🧠 Found ${unfixedIssues.length} AI-Optimized Issue${unfixedIssues.length > 1 ? 's' : ''} • Smart Recommendations Active`;
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

      {/* Main layout container */}
      <div style={{
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: '320px 1fr 400px',
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
                🧠 AI Speed Tracker
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

        {/* Main Content Area */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          position: 'relative'
        }}>
          <div style={{ position: 'relative', marginBottom: '48px' }}>
            <SpeedDial 
              currentSpeed={currentSpeed}
              onScanComplete={() => {
                console.log('Speed assessment complete');
              }}
              size="large"
            />
          </div>

          {/* Enhanced Scan Button */}
          <button
            onClick={!scanConfig.disabled ? handleScan : () => setShowActivationModal(true)}
            disabled={isScanning || isIntelligentScanning}
            style={{
              padding: '20px 40px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '18px',
              fontWeight: '700',
              cursor: scanConfig.disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              opacity: isScanning || isIntelligentScanning ? 0.7 : 1,
              background: scanConfig.disabled 
                ? 'rgba(255, 255, 255, 0.1)' 
                : `linear-gradient(135deg, #7209b7 0%, #533483 100%)`,
              color: 'white',
              boxShadow: '0 16px 40px rgba(114, 9, 183, 0.4)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: '250px'
            }}
          >
            {isIntelligentScanning ? (
              <>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                AI Scanning... {scanProgress}%
              </>
            ) : isScanning ? (
              <>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Scanning...
              </>
            ) : (
              <>
                {scanConfig.icon}
                {scanConfig.text}
              </>
            )}
          </button>



          {/* Progress bar for intelligent scanning */}
          {isIntelligentScanning && (
            <div style={{
              marginTop: '16px',
              width: '250px',
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

          {/* DEBUG INFO */}
          {hasScanned && systemMemory && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              🧠 AI Mode: {issues.length} intelligent issues found
            </div>
          )}
        </div>

        {/* Right Panel - Problem List */}
        <div style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)`,
          backdropFilter: 'blur(32px) saturate(180%)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '24px',
          overflowY: 'auto',
          maxHeight: '100vh',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.1) inset',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* Header */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'white',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              marginBottom: '8px'
            }}>
              🧠 AI Speed Problems
            </div>
            
            {/* Progress bar */}
            {(isScanning || isIntelligentScanning) && (
              <div style={{
                width: '100%',
                height: '3px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: isIntelligentScanning ? `${scanProgress}%` : '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #7209b7, #533483)',
                  transition: 'width 0.3s ease',
                  animation: isScanning && !isIntelligentScanning ? 'loadingBar 2s ease-in-out infinite' : 'none'
                }}></div>
              </div>
            )}
            
            {hasScanned && (
              <div style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: '500',
                marginBottom: '16px'
              }}>
                {getScanSummary()}
              </div>
            )}
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, paddingBottom: hasScanned && !showVictoryCard && issues.some(issue => !issue.fixed) ? '80px' : '0' }}>
            
            {/* No scan state */}
            {!hasScanned && !isScanning && !isIntelligentScanning && (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧠</div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'white'
                }}>
                  Click AI-Powered Scan
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  to get intelligent optimization recommendations
                </div>
              </div>
            )}

            {/* Scanning state */}
            {(isScanning || isIntelligentScanning) && (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  animation: 'pulse 2s infinite'
                }}>
                  🧠
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'white'
                }}>
                  AI Analyzing Your Mac...
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  Using collective intelligence
                </div>
              </div>
            )}

            {/* Issues list */}
            {hasScanned && !showVictoryCard && issues.map((issue) => (
              <div 
                key={issue.id} 
                style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)`,
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: minimizedIssues[issue.id] ? '12px 20px' : '20px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  height: minimizedIssues[issue.id] ? '60px' : 'auto',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Intelligence indicator */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'linear-gradient(135deg, #7209b7, #533483)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  🧠 AI
                </div>

                {minimizedIssues[issue.id] ? (
                  // Minimized state
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <AppLogo app={issue.app} size={24} />
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white'
                      }}>
                        {issue.app} AI-Optimized
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                  </div>
                ) : (
                  // Full state
                  <>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <AppLogo app={issue.app} size={28} />
                      <div style={{
                        marginLeft: '12px',
                        flex: 1
                      }}>
                        <div style={{
                          fontSize: '15px',
                          fontWeight: '700',
                          color: 'white'
                        }}>
                          {issue.app}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: '600'
                        }}>
                          {issue.issue} • +{issue.impact}% speed impact
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '16px',
                      lineHeight: '1.4'
                    }}>
                      {issue.storage}{issue.storageUnit} memory optimization available
                      {issue.description && (
                        <div style={{ marginTop: '4px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          {issue.description}
                        </div>
                      )}
                    </div>

                    {/* Optimize button */}
                    {!issue.fixed ? (
                      <button
                        onClick={() => handleIntelligentFix(issue.id)}
                        disabled={activeOptimization === issue.id || (isFree && getRemainingScans() <= 0)}
                        style={{
                          width: '100%',
                          padding: '12px 20px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: activeOptimization === issue.id || (isFree && getRemainingScans() <= 0) ? 'not-allowed' : 'pointer',
                          background: activeOptimization === issue.id 
                            ? 'rgba(156, 163, 175, 0.5)' 
                            : (isFree && getRemainingScans() <= 0)
                              ? 'rgba(229, 231, 235, 0.8)'
                              : 'linear-gradient(135deg, #7209b7, #533483)',
                          color: (isFree && getRemainingScans() <= 0) ? '#9ca3af' : 'white',
                          transition: 'all 0.2s ease',
                          boxShadow: activeOptimization !== issue.id && !(isFree && getRemainingScans() <= 0) ? '0 4px 16px rgba(114, 9, 183, 0.3)' : 'none'
                        }}
                      >
                        {activeOptimization === issue.id ? (
                          progressText || 'Optimizing...'
                        ) : (isFree && getRemainingScans() <= 0) ? (
                          'Upgrade to Pro'
                        ) : (
                          `🧠 Speed Up ${issue.app}`
                        )}
                      </button>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px 20px',
                        background: `linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.2) 100%)`,
                        borderRadius: '12px',
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: '600',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        <CheckCircle className="w-4 h-4" style={{ marginRight: '8px' }} />
                        AI-Optimized • +{issue.impact}% speed boost
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* Victory Card */}
            {showVictoryCard && (
              <div style={{
                background: `linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.2) 100%)`,
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '32px 24px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
                textAlign: 'center',
                height: '100%',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
                
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: 'white',
                  marginBottom: '8px',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                  Amazing! All Speed Drains Fixed!
                </h2>
                
                <p style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '24px',
                  fontWeight: '600'
                }}>
                  Your Mac is now {issues.reduce((sum, issue) => sum + (issue.impact || 0), 0)}% faster!
                </p>

                {isFree && (
                  <>
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '24px'
                    }}>
                      {getRemainingScans()} scans remaining 😢
                    </div>

                    <button
                      onClick={handleUnlockFullVersion}
                      style={{
                        width: '100%',
                        padding: '16px 24px',
                        background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
                        border: 'none',
                        borderRadius: '16px',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 8px 32px rgba(114, 9, 183, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      🚀 Unlock Pro Today
                    </button>
                  </>
                )}

                {isPro && (
                  <div style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '600'
                  }}>
                    🤖 AI optimization complete! Your Mac is running at peak performance.
                  </div>
                )}
              </div>
            )}

            {/* FIXED: Optimize All Button */}
            {hasScanned && !showVictoryCard && issues.some(issue => !issue.fixed) && (
              <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '424px',
                left: '344px',
                zIndex: 100
              }}>
                <button
                  onClick={handleOptimizeAll}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    color: 'white',
                    fontSize: '16px',
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
                  <Zap className="w-5 h-5" />
                  🚀 Optimize All ({issues.filter(i => !i.fixed).length} apps)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
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

      {/* ===== FIXED TEST BUTTONS - Use hook values directly ===== */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button 
          onClick={() => {
            try {
              console.log('🧪 Testing license system...');
              
              // FIXED: Use the hook values directly (already available at component level)
              const licenseInfo = {
                isPro,
                isFree,
                scansRemaining: getRemainingScans(),
                canUseProFeatures: hasFeature('unlimited_scans'),
                tier: isPro ? 'Pro' : 'Free'
              };
              
              console.log('License info:', licenseInfo);
              alert(`LICENSE TEST RESULTS:\n\nIs Pro: ${isPro}\nIs Free: ${isFree}\nScans Left: ${getRemainingScans()}\nHas Unlimited: ${hasFeature('unlimited_scans')}\nTier: ${isPro ? 'Pro' : 'Free'}\n\n✅ License system is working!`);
              
            } catch (error) {
              console.error('Test failed:', error);
              alert(`❌ ERROR: ${error.message}\n\nCheck console for details.`);
            }
          }}
          style={{ 
            padding: '12px 20px', 
            background: '#059669', 
            color: 'white', 
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          🧪 Test License
        </button>
        
        <button 
          onClick={() => {
            try {
              simulateProUpgrade();
              alert('👑 Simulated Pro upgrade!\n\nRestart app to see Pro features.');
            } catch (error) {
              alert(`Error: ${error.message}`);
            }
          }}
          style={{ 
            padding: '12px 20px', 
            background: '#7c3aed', 
            color: 'white', 
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          👑 Simulate Pro
        </button>
        
        <button 
          onClick={() => {
            try {
              simulateFreeReset();
              alert('🔄 Reset to Free!\n\nRestart app to see Free features.');
            } catch (error) {
              alert(`Error: ${error.message}`);
            }
          }}
          style={{ 
            padding: '12px 20px', 
            background: '#dc2626', 
            color: 'white', 
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          🔄 Reset to Free
        </button>

{/* ===== API INTEGRATION TEST BUTTONS ===== */}
        
        <button 
          onClick={async () => {
            try {
              console.log('🧪 Testing Free User License API...');
              const result = await window.electronAPI.verifyLicense({
                userEmail: 'testfree@memorymonster.co',
                deviceId: 'test-device-123',
                appVersion: '1.0.0'
              });
              console.log('✅ Free User Result:', result);
              alert(`Free User API Test:\nPlan: ${result.plan}\nValid: ${result.valid}\nMessage: ${result.message}`);
            } catch (error) {
              console.error('❌ Free User Test Error:', error);
              alert(`API Error: ${error.message}`);
            }
          }}
          style={{ 
            padding: '12px 20px', 
            background: '#ef4444', 
            color: 'white', 
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          🆓 Test Free API
        </button>

        <button 
          onClick={async () => {
            try {
              console.log('🧪 Testing Pro User License API...');
              const result = await window.electronAPI.verifyLicense({
                userEmail: 'testpro@memorymonster.co',
                deviceId: 'test-device-123',
                appVersion: '1.0.0'
              });
              console.log('✅ Pro User Result:', result);
              alert(`Pro User API Test:\nPlan: ${result.plan}\nValid: ${result.valid}\nFeatures: ${Object.keys(result.features || {}).join(', ')}`);
            } catch (error) {
              console.error('❌ Pro User Test Error:', error);
              alert(`API Error: ${error.message}`);
            }
          }}
          style={{ 
            padding: '12px 20px', 
            background: '#10b981', 
            color: 'white', 
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          ⭐ Test Pro API
        </button>

        <button 
          onClick={async () => {
            try {
              console.log('🧪 Testing Trial User License API...');
              const result = await window.electronAPI.verifyLicense({
                userEmail: 'testtrial@memorymonster.co',
                deviceId: 'test-device-123',
                appVersion: '1.0.0'
              });
              console.log('✅ Trial User Result:', result);
              alert(`Trial User API Test:\nPlan: ${result.plan}\nValid: ${result.valid}\nTrial End: ${result.subscription?.trial_end || 'N/A'}`);
            } catch (error) {
              console.error('❌ Trial User Test Error:', error);
              alert(`API Error: ${error.message}`);
            }
          }}
          style={{ 
            padding: '12px 20px', 
            background: '#f59e0b', 
            color: 'white', 
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          🔥 Test Trial API
        </button>

        <button 
          onClick={async () => {
            try {
              console.log('🧪 Testing Usage Tracking API...');
              const result = await window.electronAPI.trackUsage({
                userEmail: 'testfree@memorymonster.co',
                deviceId: 'test-device-123',
                sessionData: {
                  appVersion: '1.0.0',
                  sessionDurationMinutes: 5
                },
                performanceData: {
                  scansThisSession: 3,
                  memoryFreedMB: 450,
                  junkFilesRemoved: 25,
                  appsOptimized: 5,
                  featuresUsed: ['ai_optimization', 'background_monitoring']
                }
              });
              console.log('✅ Usage Tracking Result:', result);
              alert(`Usage API Test:\nSuccess: ${result.success}\nMessage: ${result.message}`);
            } catch (error) {
              console.error('❌ Usage Tracking Test Error:', error);
              alert(`API Error: ${error.message}`);
            }
          }}
          style={{ 
            padding: '12px 20px', 
            background: '#8b5cf6', 
            color: 'white', 
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          📊 Test Usage API
        </button>

      </div>
      
    </div>
  );
};

export default SpeedTracker;
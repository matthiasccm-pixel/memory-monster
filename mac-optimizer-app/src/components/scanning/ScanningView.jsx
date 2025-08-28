import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Zap, TrendingUp, Activity, Clock, X, ArrowRight, Sparkles, Target, Brain, Gauge, Users, Shield, Crown, Lock, Star, Unlock, Settings, User } from 'lucide-react';
import { useFeatureGate } from '../../core/licensing/useFeatureGate.js';
import { GatedButton, GatedSection, LicenseStatusBar } from '../shared/GatedComponents.jsx';
import { openUpgradePage } from '../../utils/upgradeUtils.js';

const ScanningView = ({
  currentView,
  setCurrentView,
  isScanning,
  scanComplete,
  issues,
  setIssues,
  totalMemoryFreed,
  setTotalMemoryFreed,
  remainingMemory,
  setRemainingMemory,
  animatingMemory,
  setAnimatingMemory,
  fixingStates,
  setFixingStates,
  minimizedIssues,
  setMinimizedIssues,
  handleFix,
  handleUnlockAll,
  animateMemoryCounter,
  getSeverityStyle,
  getFixingContent,
  hasCompletedFirstFix,
  onScan,
  setShowActivationModal // We'll use this for upgrade popup
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // FeatureGate integration
  const { 
    hasFeature, 
    getRemainingScans, 
    decrementScans, 
    openUpgradeModal,
    licenseInfo 
  } = useFeatureGate();
  
  const scansRemaining = getRemainingScans();
  const canScanUnlimited = hasFeature('unlimited_scans');
  const canOptimizeMultiple = hasFeature('multiple_optimizations');
  const isPaidUser = licenseInfo?.isPaid;

  // Calculate progress based on memory freed
  const calculateProgress = () => {
    const totalMemory = issues.reduce((sum, issue) => sum + issue.storage, 0);
    return totalMemory > 0 ? Math.round((totalMemoryFreed / totalMemory) * 100) : 0;
  };

  // Speed impact calculations
  const getSpeedImpact = (storage) => {
    if (storage >= 8) return { level: 'CRITICAL', color: '#ef4444', text: 'Major Speed Drain', impact: '+' + Math.floor(storage * 2.8) + '%' };
    if (storage >= 4) return { level: 'HIGH', color: '#f97316', text: 'Slowing You Down', impact: '+' + Math.floor(storage * 2.3) + '%' };
    if (storage >= 2) return { level: 'MEDIUM', color: '#eab308', text: 'Minor Impact', impact: '+' + Math.floor(storage * 1.8) + '%' };
    return { level: 'LOW', color: '#22c55e', text: 'Minimal Impact', impact: '+' + Math.floor(storage * 1.2) + '%' };
  };

  // Convert GB to user-friendly terms
  const getMemoryDescription = (storage) => {
    if (storage >= 8) return `${storage}GB of memory`;
    if (storage >= 4) return `${storage}GB of precious resources`;
    if (storage >= 2) return `${storage}GB of system memory`;
    return `${storage}GB of memory`;
  };

  // Get problem descriptions with speed-focused language
  const getProblemDescription = (issue) => {
    const descriptions = {
      'Chrome': `Chrome is consuming ${getMemoryDescription(issue.storage)} with ${Math.floor(Math.random() * 40 + 10)} tabs slowing down your entire system`,
      'Slack': `Slack has been hogging ${getMemoryDescription(issue.storage)} for ${Math.floor(Math.random() * 5 + 1)} days, making your Mac sluggish`,
      'Adobe Creative Cloud': `Adobe's background processes are consuming ${getMemoryDescription(issue.storage)}, reducing your Mac's responsiveness`,
      'Spotify': `Spotify's cache and background processes are using ${getMemoryDescription(issue.storage)}, impacting system speed`,
      'WhatsApp': `WhatsApp's media files have grown to consume ${getMemoryDescription(issue.storage)}, slowing down performance`
    };
    return descriptions[issue.app] || `${issue.app} is unnecessarily consuming ${getMemoryDescription(issue.storage)}, affecting system speed`;
  };

  // Handle upgrade popup
  const handleShowUpgradePopup = () => {
    setShowUpgradePopup(true);
  };

  // Handle optimize button click - Fixed logic for free users
  const handleOptimizeClick = (issueId) => {
    if (!isPaidUser && scansRemaining <= 0) {
      handleShowUpgradePopup();
      return;
    }
    
    // Free users with scans remaining can optimize
    handleOptimizeIssue(issueId);
  };

  // Handle optimize all click - Fixed logic
  const handleOptimizeAllClick = () => {
    if (!canOptimizeMultiple) {
      handleShowUpgradePopup();
      return;
    }
    
    // Show progress bar and start optimization
    setShowProgressBar(true);
    setIsOptimizing(true);
    
    // Pro users can optimize all
    const unoptimizedIssues = issues.filter(issue => !issue.fixed);
    unoptimizedIssues.forEach((issue, index) => {
      setTimeout(() => {
        handleOptimizeIssue(issue.id);
      }, index * 800);
    });
    
    // Stop optimization animation after all are done
    setTimeout(() => {
      setIsOptimizing(false);
    }, unoptimizedIssues.length * 800 + 4000);
  };

  // Handle single issue optimization
  const handleOptimizeIssue = async (issueId) => {
    const issue = issues.find(i => i.id === issueId);
    const impact = getSpeedImpact(issue.storage);
    
    // Decrement scan for free users
    if (!isPaidUser) {
      decrementScans();
    }
    
    // Show progress bar when individual optimization starts
    setShowProgressBar(true);
    
    // Set fixing state
    setFixingStates(prev => ({ ...prev, [issueId]: 'analyzing' }));
    
    setTimeout(() => {
      setFixingStates(prev => ({ ...prev, [issueId]: 'optimizing' }));
    }, 1200);
    
    setTimeout(() => {
      // Mark as complete and update memory
      setFixingStates(prev => ({ ...prev, [issueId]: 'complete' }));
      setIssues(prev => prev.map(i =>
        i.id === issueId ? { ...i, fixed: true } : i
      ));
      
      // Update totals
      const newTotalFreed = totalMemoryFreed + issue.storage;
      setTotalMemoryFreed(newTotalFreed);
      
      // Minimize after short delay
      setTimeout(() => {
        setMinimizedIssues(prev => ({ ...prev, [issueId]: true }));
      }, 800);
      
      // Check if all complete for confetti
      const allComplete = issues.every(i => i.id === issueId || i.fixed);
      if (allComplete) {
        setTimeout(() => {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
        }, 1000);
      }
      
      // Call original handler if exists
      if (handleFix) handleFix(issueId);
    }, 3800);
  };

  // Upgrade Popup Component
  const UpgradePopup = () => {
    if (!showUpgradePopup) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.10) 100%)',
          backdropFilter: 'blur(24px)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '480px',
          width: '90%',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Close button */}
          <button
            onClick={() => setShowUpgradePopup(false)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            <X size={20} />
          </button>

          {/* Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #7209b7, #533483)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            boxShadow: '0 12px 32px rgba(114, 9, 183, 0.4)'
          }}>
            <Crown size={40} color="white" />
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: 'white',
            margin: '0 0 12px 0'
          }}>
            Unlock Full Speed Power
          </h2>

          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}>
            You've seen what Memory Monster can do. Upgrade to optimize all your apps and keep your Mac running at peak performance every day.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setShowUpgradePopup(false)}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Not Ready Yet
            </button>
            
            <button
              onClick={() => {
                openUpgradePage();
                setShowUpgradePopup(false);
              }}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
                border: 'none',
                borderRadius: '16px',
                padding: '16px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(114, 9, 183, 0.4)',
                animation: 'gentlePulse 3s ease-in-out infinite'
              }}
            >
              Unlock Pro
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Confetti component
  const Confetti = () => {
    if (!showConfetti) return null;
    
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animation: 'confetti 3s linear infinite',
              fontSize: '20px'
            }}
          >
            {['🎉', '⚡', '🚀', '✨', '🎊'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
    );
  };

  if (isScanning) {
    return (
      <div style={{ 
        display: 'flex',
        height: '100vh'
      }}>
        {/* Sidebar Navigation - Matches Dashboard */}
        <div style={{
          width: '280px',
          background: `linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.10) 50%, rgba(255, 255, 255, 0.05) 100%)`,
          backdropFilter: 'blur(24px) saturate(180%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <span style={{ fontSize: '20px' }}>⚡</span>
            </div>
            <div>
              <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '800', margin: 0 }}>Memory Monster</h2>
            </div>
          </div>
          
          {/* Navigation Items - Match Dashboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '12px', 
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }} onClick={() => setCurrentView('dashboard')}>
              <Gauge size={16} />
              Dashboard
            </div>
            
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '12px', 
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Target size={16} />
              Speed Optimization
            </div>
            
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '12px', 
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }} onClick={() => setCurrentView('settings')}>
              <Settings size={16} />
              Settings
            </div>
          </div>
        </div>

        {/* Scanning Content */}
        <div style={{ 
          flex: 1,
          padding: '40px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'transparent'
        }}>
          {/* Speed Analysis Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ 
              fontSize: '64px', 
              marginBottom: '20px',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              🎯
            </div>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: '900', 
              color: 'white', 
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Scanning for Speed Drains
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '500',
              maxWidth: '500px'
            }}>
              Analyzing your Mac for apps that are slowing you down...
            </p>
          </div>

          {/* Animated Speed Scanner */}
          <div style={{ 
            position: 'relative',
            width: '200px',
            height: '200px',
            marginBottom: '40px'
          }}>
            {/* Background Circle */}
            <svg width="200" height="200" style={{ position: 'absolute' }}>
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="8"
              />
            </svg>
            
            {/* Animated Scanner Ring */}
            <svg width="200" height="200" style={{ 
              position: 'absolute',
              animation: 'rotate 2s linear infinite'
            }}>
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="url(#speedGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="50 250"
                style={{ filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.6))' }}
              />
              <defs>
                <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center Icon */}
            <div style={{
              position: 'absolute',
              inset: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Gauge size={48} color="#10b981" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
          </div>

          {/* Scanning Progress */}
          <div style={{ 
            textAlign: 'center',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '600px'
          }}>
            <p style={{ 
              fontSize: '16px', 
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '600',
              animation: 'fadeInOut 2s ease-in-out infinite alternate'
            }}>
              Finding apps that are slowing down your Mac...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Confetti />
      <UpgradePopup />
      <div style={{ 
        display: 'flex',
        height: '100vh',
        background: 'transparent'
      }}>
        {/* Sidebar Navigation - Matches Dashboard */}
        <div style={{
          width: '280px',
          background: `linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.10) 50%, rgba(255, 255, 255, 0.05) 100%)`,
          backdropFilter: 'blur(24px) saturate(180%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <span style={{ fontSize: '20px' }}>⚡</span>
            </div>
            <div>
              <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '800', margin: 0 }}>Memory Monster</h2>
            </div>
          </div>
          
          {/* Navigation Items - Match Dashboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '12px', 
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }} onClick={() => setCurrentView('dashboard')}>
              <Gauge size={16} />
              Dashboard
            </div>
            
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '12px', 
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Target size={16} />
              Speed Optimization
            </div>
            
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '12px', 
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }} onClick={() => setCurrentView('settings')}>
              <Settings size={16} />
              Settings
            </div>
          </div>
        </div>

        {/* Main Content Area - 2/3 width */}
        <div style={{
          flex: 2,
          display: 'flex',
          flexDirection: 'column',
          padding: '40px',
          minHeight: 0
        }}>
          {/* Header Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Title Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)'
              }}>
                <Zap size={32} color="white" style={{ animation: 'gentlePulse 2s ease-in-out infinite' }} />
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '900', 
                  color: 'white',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  {issues.length} Apps Found!
                </h1>
                <p style={{ 
                  fontSize: '16px', 
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0
                }}>
                  These apps are slowing down your Mac
                </p>
              </div>
            </div>
            
            {/* Stats Cards - Side by Side */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
              <div style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: '900', 
                  color: 'white',
                  marginBottom: '4px'
                }}>
                  {Math.max(0, remainingMemory).toFixed(1)}GB
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Memory Being Wasted
                </div>
              </div>
              
              <div style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: '900', 
                  color: 'white',
                  marginBottom: '4px'
                }}>
                  +{Math.floor(issues.reduce((sum, issue) => sum + issue.storage, 0) * 2.5)}%
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Speed Boost Possible
                </div>
              </div>
            </div>
            
            {/* Progress Bar - Hidden initially */}
            {showProgressBar && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>
                    Optimization Progress
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#10b981' }}>
                    {calculateProgress()}% Complete
                  </span>
                </div>
                
                <div style={{
                  width: '100%',
                  height: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    width: `${calculateProgress()}%`,
                    height: '100%',
                    background: isOptimizing 
                      ? 'linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)'
                      : 'linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
                    borderRadius: '20px',
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    boxShadow: calculateProgress() > 0 ? '0 0 20px rgba(16, 185, 129, 0.5)' : 'none'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: isOptimizing 
                        ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)'
                        : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                      animation: isOptimizing ? 'shimmer 1s ease-in-out infinite' : 'shimmer 2s ease-in-out infinite'
                    }} />
                  </div>
                </div>
                
                <div style={{ 
                  fontSize: '14px', 
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginTop: '6px',
                  textAlign: 'center'
                }}>
                  {totalMemoryFreed.toFixed(1)}GB memory recovered • Boosting your Mac's speed!
                </div>
              </div>
            )}

            {/* Optimize All Button */}
            <button
              onClick={handleOptimizeAllClick}
              style={{
                width: '100%',
                background: canOptimizeMultiple 
                  ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: canOptimizeMultiple ? 'white' : 'rgba(255, 255, 255, 0.5)',
                border: canOptimizeMultiple ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {canOptimizeMultiple ? <Zap size={20} /> : <Lock size={20} />}
              {canOptimizeMultiple ? 'Optimize All Apps' : 'Optimize All Apps (Pro Feature)'}
            </button>
          </div>

          {/* Issues List - Scrollable with custom scrollbar */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '8px',
            minHeight: 0
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {issues.map((issue, index) => {
                const impact = getSpeedImpact(issue.storage);
                const isFixing = fixingStates[issue.id];
                const isMinimized = minimizedIssues[issue.id];
                const canOptimize = isPaidUser || scansRemaining > 0; // Fixed logic
                
                return (
                  <div
                    key={issue.id}
                    style={{
                      background: issue.fixed 
                        ? 'rgba(16, 185, 129, 0.1)' 
                        : 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      padding: isMinimized ? '16px 24px' : '24px',
                      border: issue.fixed 
                        ? '1px solid rgba(16, 185, 129, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      height: isMinimized ? '80px' : 'auto',
                      overflow: 'hidden'
                    }}
                  >
                    {isMinimized ? (
                      // Minimized view
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px',
                        height: '48px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.1)', // Removed red border
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px'
                        }}>
                          {issue.app === 'Chrome' ? '🌐' : 
                           issue.app === 'Slack' ? '💬' :
                           issue.app === 'Spotify' ? '🎵' :
                           issue.app === 'Adobe Creative Cloud' ? '🎨' : '📱'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ 
                            color: 'white', 
                            fontSize: '18px', 
                            fontWeight: '700',
                            margin: 0
                          }}>
                            {issue.app}
                          </h3>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          padding: '8px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          <CheckCircle size={16} color="#10b981" />
                          <span style={{ color: '#10b981', fontWeight: '600' }}>
                            {issue.storage}GB Recovered • {impact.impact} Faster
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Full view
                      <>
                        {/* Header Row */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          marginBottom: '16px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '16px',
                              background: 'rgba(255, 255, 255, 0.1)', // Removed colored border
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '24px'
                            }}>
                              {issue.app === 'Chrome' ? '🌐' : 
                               issue.app === 'Slack' ? '💬' :
                               issue.app === 'Spotify' ? '🎵' :
                               issue.app === 'Adobe Creative Cloud' ? '🎨' : '📱'}
                            </div>
                            <div>
                              <h3 style={{ 
                                color: 'white', 
                                fontSize: '20px', 
                                fontWeight: '800',
                                margin: 0,
                                marginBottom: '4px'
                              }}>
                                {issue.app}
                              </h3>
                              <div style={{
                                background: impact.color,
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'inline-block'
                              }}>
                                {impact.text} • {impact.impact} Speed Boost
                              </div>
                            </div>
                          </div>
                          
                          {issue.fixed && (
                            <CheckCircle size={24} color="#10b981" />
                          )}
                        </div>

                        {/* Problem Description */}
                        <p style={{ 
                          color: 'rgba(255, 255, 255, 0.8)', 
                          fontSize: '15px',
                          lineHeight: '1.5',
                          marginBottom: '20px',
                          paddingLeft: '72px'
                        }}>
                          {getProblemDescription(issue)}
                        </p>

                        {/* Stats Row */}
                        <div style={{ 
                          display: 'flex', 
                          gap: '20px',
                          marginBottom: '20px',
                          paddingLeft: '72px'
                        }}>
                          <div style={{ 
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            textAlign: 'center',
                            minWidth: '90px'
                          }}>
                            <Activity size={16} color="#8b5cf6" style={{ marginBottom: '4px' }} />
                            <div style={{ 
                              fontSize: '14px', 
                              fontWeight: '700', 
                              color: 'white',
                              marginBottom: '2px'
                            }}>
                              {issue.storage}GB
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                              Memory Used
                            </div>
                          </div>
                          
                          <div style={{ 
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            textAlign: 'center',
                            minWidth: '90px'
                          }}>
                            <TrendingUp size={16} color="#10b981" style={{ marginBottom: '4px' }} />
                            <div style={{ 
                              fontSize: '14px', 
                              fontWeight: '700', 
                              color: 'white',
                              marginBottom: '2px'
                            }}>
                              {impact.impact}
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                              Speed Boost
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div style={{ paddingLeft: '72px' }}>
                          {!issue.fixed && !isFixing && (
                            <button
                              onClick={() => handleOptimizeClick(issue.id)}
                              disabled={!canOptimize}
                              style={{
                                background: canOptimize 
                                  ? `linear-gradient(135deg, ${impact.color}, ${impact.color}dd)`
                                  : 'rgba(255, 255, 255, 0.1)',
                                color: canOptimize ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                border: canOptimize ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                padding: '12px 20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: canOptimize ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                              onMouseEnter={(e) => {
                                if (canOptimize) {
                                  e.target.style.transform = 'translateY(-1px)';
                                  e.target.style.boxShadow = `0 4px 16px ${impact.color}50`;
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                              }}
                            >
                              {canOptimize ? <Zap size={16} /> : <Lock size={16} />}
                              {canOptimize ? `Optimize ${issue.app}` : `No Scans Left`}
                            </button>
                          )}

                          {/* Fixing State */}
                          {isFixing && (
                            <div style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: '12px',
                              padding: '12px 20px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid #10b981',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }} />
                              <span style={{ color: '#10b981', fontWeight: '600' }}>
                                {isFixing === 'analyzing' ? 'Analyzing Performance...' :
                                 isFixing === 'optimizing' ? 'Optimizing Speed...' :
                                 'Optimization Complete!'}
                              </span>
                            </div>
                          )}

                          {/* Success State */}
                          {issue.fixed && !isMinimized && (
                            <div style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: '12px',
                              padding: '12px 20px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <CheckCircle size={16} color="#10b981" />
                              <span style={{ color: '#10b981', fontWeight: '600' }}>
                                Optimized! {impact.impact} Speed Boost Applied
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - 1/3 width */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '40px 40px 40px 0'
        }}>
          {/* Free User Panel */}
          {!isPaidUser ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(114, 9, 183, 0.15) 0%, rgba(83, 52, 131, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid rgba(114, 9, 183, 0.3)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Premium Glow Background */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(114, 9, 183, 0.2) 0%, transparent 70%)',
                zIndex: 1
              }} />
              
              <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Free Edition Banner */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '4px'
                  }}>
                    Free Edition
                  </div>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '900',
                    color: '#f59e0b',
                    marginBottom: '2px'
                  }}>
                    {scansRemaining}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    Scans Left
                  </div>
                </div>

                {/* Unlock Full Power Header */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '24px',
                  background: 'linear-gradient(135deg, rgba(114, 9, 183, 0.2) 0%, rgba(83, 52, 131, 0.15) 100%)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(114, 9, 183, 0.3)'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #7209b7, #533483)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                    boxShadow: '0 8px 24px rgba(114, 9, 183, 0.4)'
                  }}>
                    <Lock size={24} color="white" />
                  </div>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '900',
                    color: 'white',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    Unlock Full Power
                  </h2>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    lineHeight: '1.3'
                  }}>
                    Keep your Mac running at peak speed every day
                  </p>
                </div>

                {/* Features List */}
                <div style={{ flex: 1, marginBottom: '24px' }}>
                  {[
                    { icon: '🚀', title: 'Unlimited Scans', desc: 'Optimize as often as you want, every day' },
                    { icon: '📈', title: 'Daily Performance Upgrades', desc: 'Automatic speed improvements' },
                    { icon: '📱', title: '250+ Apps & Counting', desc: 'New apps added every week' },
                    { icon: '🤖', title: 'AI-Powered Insights', desc: 'Smart recommendations for your usage' },
                    { icon: '⚡', title: 'Real-time Monitoring', desc: 'Instant alerts when speed drops' },
                    { icon: '🔧', title: 'Advanced Controls', desc: 'Pro settings for power users' }
                  ].map((feature, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '14px',
                      padding: '6px 0'
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                      }}>
                        {feature.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          color: 'white',
                          fontSize: '13px',
                          fontWeight: '700',
                          marginBottom: '1px'
                        }}>
                          {feature.title}
                        </div>
                        <div style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '11px',
                          lineHeight: '1.3'
                        }}>
                          {feature.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '4px'
                  }}>
                    All for the price of coffee every month
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    color: 'white',
                    marginBottom: '2px'
                  }}>
                    Just $3.99<span style={{ fontSize: '12px', fontWeight: '600' }}>/month</span>
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    Cancel anytime • 7-day free trial
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => openUpgradePage()}
                  style={{
                    background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(114, 9, 183, 0.4)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    animation: 'gentlePulse 3s ease-in-out infinite'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = '0 12px 40px rgba(114, 9, 183, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 32px rgba(114, 9, 183, 0.4)';
                  }}
                >
                  <Star size={20} />
                  Unlock Pro
                </button>

                <div style={{
                  textAlign: 'center',
                  marginTop: '12px',
                  fontSize: '10px',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  Join 50,000+ Mac users optimizing daily
                </div>
              </div>
            </div>
          ) : (
            /* Pro User Panel */
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(34, 197, 94, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #10b981, #22c55e)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)'
              }}>
                <Crown size={40} color="white" />
              </div>
              
              <h2 style={{
                fontSize: '24px',
                fontWeight: '900',
                color: 'white',
                margin: '0 0 12px 0'
              }}>
                Memory Monster Pro
              </h2>
              
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '24px',
                lineHeight: '1.5'
              }}>
                Welcome to unlimited speed optimization! Your Mac is now running at peak performance with full access to all features.
              </p>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#10b981',
                  marginBottom: '8px'
                }}>
                  ✨ All Features Unlocked
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.4'
                }}>
                  Unlimited scans, all apps supported, real-time monitoring, and AI-powered insights all working to keep your Mac lightning fast.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Custom Scrollbar Styles */}
      <style>{`
        /* Custom Scrollbar */
        div::-webkit-scrollbar {
          width: 8px;
        }
        
        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(16, 185, 129, 0.6) 0%, rgba(59, 130, 246, 0.6) 100%);
          border-radius: 12px;
          transition: background 0.3s ease;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(16, 185, 129, 0.8) 0%, rgba(59, 130, 246, 0.8) 100%);
        }
        
        /* Firefox scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(16, 185, 129, 0.6) rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </>
  );
};

export default ScanningView;
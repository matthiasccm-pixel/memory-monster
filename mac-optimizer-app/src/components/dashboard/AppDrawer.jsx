import React, { useState, useEffect, useMemo } from 'react';
import { useFeatureGate } from '../../core/licensing/useFeatureGate.js';
import { Zap, X, AlertTriangle, CheckCircle, Loader, ChevronDown } from 'lucide-react';

const AppDrawer = ({ 
  isOpen, 
  onClose, 
  problematicApps = [], 
  onOptimizeApp,
  onBulkOptimize,
  optimizationProgress = {},
  totalSpeedGain = 0,
  className = ""
}) => {
  const { isFree, isPro } = useFeatureGate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedApps, setSelectedApps] = useState(new Set());
  const [showDetails, setShowDetails] = useState(new Set());

  // Group and categorize apps
  const groupedApps = useMemo(() => {
    const systemApps = problematicApps.filter(app => 
      app.name === 'macOS System' || 
      app.id?.includes('com.apple') || 
      app.category === 'system'
    );
    
    const regularApps = problematicApps.filter(app => 
      app.name !== 'macOS System' && 
      !app.id?.includes('com.apple') && 
      app.category !== 'system'
    );

    // Further categorize regular apps by free/pro availability
    const freeApps = regularApps.filter(app => !app.isPro);
    const proApps = regularApps.filter(app => app.isPro);
    
    return {
      system: systemApps,
      free: freeApps,
      pro: proApps,
      all: problematicApps
    };
  }, [problematicApps]);

  // Calculate optimization stats
  const stats = useMemo(() => {
    const totalMemory = problematicApps.reduce((sum, app) => sum + (app.memoryMB || 0), 0);
    const potentialSpeedGain = Math.min(75, totalMemory * 0.01); // Realistic speed gain
    const optimizedCount = Object.keys(optimizationProgress).filter(id => optimizationProgress[id] === 100).length;
    
    return {
      totalMemory,
      potentialSpeedGain,
      optimizedCount,
      totalApps: problematicApps.length,
      systemIssues: groupedApps.system.length,
      freeOptimizations: groupedApps.free.length,
      proOptimizations: groupedApps.pro.length
    };
  }, [problematicApps, optimizationProgress, groupedApps]);

  // Auto-select all optimizable apps on open
  useEffect(() => {
    if (isOpen && problematicApps.length > 0) {
      const optimizableApps = problematicApps
        .filter(app => app.optimizable && optimizationProgress[app.id] !== 100)
        .map(app => app.id);
      setSelectedApps(new Set(optimizableApps));
    }
  }, [isOpen, problematicApps, optimizationProgress]);

  const handleAppSelect = (appId) => {
    const newSelection = new Set(selectedApps);
    if (newSelection.has(appId)) {
      newSelection.delete(appId);
    } else {
      newSelection.add(appId);
    }
    setSelectedApps(newSelection);
  };

  const handleSelectAll = () => {
    const optimizableApps = problematicApps
      .filter(app => app.optimizable && optimizationProgress[app.id] !== 100)
      .map(app => app.id);
    setSelectedApps(new Set(optimizableApps));
  };

  const toggleDetails = (appId) => {
    const newDetails = new Set(showDetails);
    if (newDetails.has(appId)) {
      newDetails.delete(appId);
    } else {
      newDetails.add(appId);
    }
    setShowDetails(newDetails);
  };

  const getAppIcon = (app) => {
    // Map app names to emojis
    const iconMap = {
      'Chrome': '🌐',
      'Safari': '🧭', 
      'Firefox': '🦊',
      'Slack': '💬',
      'Teams': '💼',
      'Spotify': '🎵',
      'Photos': '📸',
      'Mail': '📧',
      'WhatsApp': '💚',
      'Zoom': '📹',
      'macOS System': '🖥️'
    };
    return iconMap[app.name] || '📱';
  };

  const getMemoryColor = (memoryMB) => {
    if (memoryMB > 1000) return '#ef4444'; // Red for heavy apps
    if (memoryMB > 500) return '#f59e0b'; // Orange for moderate
    return '#10b981'; // Green for light apps
  };

  const renderAppSection = (title, apps, sectionType, showUpgradePrompt = false) => {
    if (apps.length === 0) return null;

    return (
      <div style={{ marginBottom: '24px' }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>
              {title}
            </div>
            <div style={{
              background: sectionType === 'system' ? 'rgba(239, 68, 68, 0.2)' : 
                          sectionType === 'pro' ? 'rgba(147, 51, 234, 0.2)' : 
                          'rgba(16, 185, 129, 0.2)',
              color: sectionType === 'system' ? '#fca5a5' : 
                     sectionType === 'pro' ? '#c4b5fd' : 
                     '#a7f3d0',
              padding: '2px 8px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {apps.length}
            </div>
          </div>
          {showUpgradePrompt && isFree && (
            <div style={{
              background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Pro
            </div>
          )}
        </div>

        {/* Apps in Section */}
        {apps.map((app, index) => renderApp(app, index))}
      </div>
    );
  };

  const renderApp = (app, index) => {
    const isOptimizing = optimizationProgress[app.id] > 0 && optimizationProgress[app.id] < 100;
    const isOptimized = optimizationProgress[app.id] === 100;
    const isSelected = selectedApps.has(app.id);
    const showAppDetails = showDetails.has(app.id);

    return (
      <div 
        key={app.id}
        style={{
          background: isOptimized ? 
            'rgba(16, 185, 129, 0.1)' :
            isOptimizing ? 
              'rgba(245, 158, 11, 0.1)' :
              'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${isOptimized ? 
            'rgba(16, 185, 129, 0.3)' :
            isOptimizing ? 
              'rgba(245, 158, 11, 0.3)' :
              'rgba(255, 255, 255, 0.1)'}`,
          borderRadius: '16px',
          padding: '16px',
          marginBottom: index < problematicApps.length - 1 ? '12px' : '0',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onClick={() => handleAppSelect(app.id)}
      >
        {/* Rest of app rendering logic stays the same */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          {/* App Selection Checkbox */}
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '6px',
            border: isSelected ? 
              '2px solid #10b981' : 
              '2px solid rgba(255, 255, 255, 0.3)',
            background: isSelected ? 
              'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
              'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            marginTop: '2px'
          }}>
            {isSelected && (
              <CheckCircle size={12} color="white" />
            )}
          </div>

          {/* App Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flex: 1,
                minWidth: 0
              }}>
                <div style={{
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  {getAppIcon(app)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    color: 'white', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {app.name}
                  </div>
                  <div style={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {app.processes || 1} processes • {app.memoryMB}MB
                  </div>
                </div>
              </div>

              {/* Status/Action */}
              <div style={{ flexShrink: 0 }}>
                {isOptimized ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#10b981',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    <CheckCircle size={16} />
                    Optimized
                  </div>
                ) : isOptimizing ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#f59e0b',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    {optimizationProgress[app.id]}%
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOptimizeApp(app.id);
                    }}
                    style={{
                      padding: '8px 14px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Zap size={12} />
                    Fix
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Optimization Progress Bar */}
        {isOptimizing && (
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginTop: '12px'
          }}>
            <div style={{
              width: `${optimizationProgress[app.id]}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #f59e0b, #10b981)',
              transition: 'width 0.3s ease',
              animation: 'shimmer 1.5s infinite'
            }} />
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Only show when not minimized */}
      {!isMinimized && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={onClose}
        />
      )}

      {/* Sliding Drawer */}
      <div 
        style={{
          position: 'fixed',
          right: isMinimized ? '-520px' : '0',
          top: 0,
          bottom: 0,
          width: '600px',
          background: `linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)`,
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-20px 0 40px rgba(0, 0, 0, 0.3)',
          animation: 'slideInFromRight 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
          transition: 'right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          ...className
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ 
              color: 'white', 
              fontSize: '24px', 
              fontWeight: '800', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <AlertTriangle color="#f59e0b" size={24} />
              Speed Bottlenecks Found
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  padding: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isMinimized ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
              </button>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  padding: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Stats Overview - Apple-esque Design */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '16px 12px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
                {stats.totalMemory.toFixed(0)}MB
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '500' }}>
                Memory Usage
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '16px 12px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
                +{stats.potentialSpeedGain.toFixed(0)}%
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '500' }}>
                Speed Gain
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '16px 12px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
                {stats.optimizedCount}/{stats.totalApps}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '500' }}>
                Optimized
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSelectAll}
              style={{
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1
              }}
            >
              Select All ({stats.totalApps - stats.optimizedCount})
            </button>
            
            <button
              onClick={() => onBulkOptimize(Array.from(selectedApps))}
              disabled={selectedApps.size === 0}
              style={{
                padding: '10px 20px',
                background: selectedApps.size > 0 ? 
                  'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                  'rgba(100, 116, 139, 0.3)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '700',
                cursor: selectedApps.size > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                opacity: selectedApps.size > 0 ? 1 : 0.5,
                flex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Zap size={16} />
              Optimize Selected ({selectedApps.size})
            </button>
          </div>
        </div>

        {/* Apps List - Grouped Sections */}
        {!isMinimized && (
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px'
          }}>
            {problematicApps.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.8)' }}>
                  No apps found yet
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  Run a scan to find speed bottlenecks
                </div>
              </div>
            ) : (
              <>
                {/* System Alerts Section */}
                {renderAppSection(
                  "⚠️ System Alerts",
                  groupedApps.system,
                  "system"
                )}
                
                {/* Free Optimizations Section */}
                {renderAppSection(
                  "✨ Available Optimizations",
                  groupedApps.free,
                  "free"
                )}
                
                {/* Pro Optimizations Section */}
                {renderAppSection(
                  "💎 Advanced Optimizations",
                  groupedApps.pro,
                  "pro",
                  true // Show upgrade prompt
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Style definitions */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default AppDrawer;

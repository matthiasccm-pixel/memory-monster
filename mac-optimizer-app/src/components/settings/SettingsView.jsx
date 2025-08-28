import React from 'react';
import { Settings, User, Shield, Cpu, Bell, Activity, HelpCircle, ExternalLink, RotateCcw, FileText, Crown, Package } from 'lucide-react';
import { useFeatureGate } from '../../core/licensing/useFeatureGate.js';
import { openUpgradePage } from '../../utils/upgradeUtils.js';
import Firefoxlogo from '../shared/Firefoxlogo.jsx';
import SettingRow from '../shared/SettingRow.jsx';
import CommunityStats from '../shared/CommunityStats.jsx';

const SettingsView = ({
  // Current view and navigation
  currentView,
  setCurrentView,
  
  // All the setting states
  autoScanWeekly,
  setAutoScanWeekly,
  realTimeMonitoring,
  setRealTimeMonitoring,
  memoryAlerts,
  setMemoryAlerts,
  autoMinimize,
  setAutoMinimize,
  backgroundLiberation,
  setBackgroundLiberation,
  scanIntensity,
  setScanIntensity,
  startAtLogin,
  setStartAtLogin,
  keepRunning,
  setKeepRunning,
  showInMenuBar,
  setShowInMenuBar,
  autoUpdate,
  setAutoUpdate,
  theme,
  setTheme,
  successNotifications,
  setSuccessNotifications,
  weeklyReports,
  setWeeklyReports,
  monsterAlerts,
  setMonsterAlerts,
  tips,
  setTips,
  deepScanning,
  setDeepScanning,
  monitorExternal,
  setMonitorExternal,
  analytics,
  setAnalytics,
  
  // AI Learning props
  aiLearningEnabled,
  setAiLearningEnabled,
  shareOptimizationData,
  setShareOptimizationData,
  receiveIntelligenceUpdates,
  setReceiveIntelligenceUpdates,
  adaptiveStrategies,
  setAdaptiveStrategies,
  personalizedOptimizations,
  setPersonalizedOptimizations
}) => {
  // Get feature gate info
  const { isFree } = useFeatureGate();

  // Handle unlock full version
  const handleUnlockFullVersion = () => {
    openUpgradePage();
  };

  // Styles
  const mainContentStyle = {
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    overflow: 'hidden',
    position: 'relative'
  };

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

  const hoverSidebarItemStyle = {
    ...sidebarItemStyle,
    background: `linear-gradient(135deg, rgba(114, 9, 183, 0.2) 0%, rgba(83, 52, 131, 0.15) 100%)`,
    color: 'rgba(255, 255, 255, 0.95)',
    boxShadow: `0 4px 16px rgba(114, 9, 183, 0.2)`
  };

  const activeSidebarItemStyle = {
    ...sidebarItemStyle,
    background: `linear-gradient(135deg, rgba(114, 9, 183, 0.4) 0%, rgba(83, 52, 131, 0.3) 100%)`,
    color: 'white',
    boxShadow: `0 8px 32px rgba(114, 9, 183, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset`
  };

  const cardStyle = {
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.90) 100%)`,
    backdropFilter: 'blur(32px) saturate(180%)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2) inset`,
    position: 'relative',
    overflow: 'hidden'
  };

  const premiumCardStyle = {
    ...cardStyle,
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)`,
    boxShadow: `0 32px 64px rgba(114, 9, 183, 0.3), 0 16px 32px rgba(83, 52, 131, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(114, 9, 183, 0.1) inset, 0 1px 0 rgba(255, 255, 255, 0.3) inset`
  };

  return (
    <div style={mainContentStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', padding: '0 4px' }}>
          <div style={{ width: '48px', height: '48px', background: `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <Firefoxlogo size={32} />
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '800', margin: '0 0 2px 0' }}>Memory Monster</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: '0', fontWeight: '500' }}>System Liberation Hub</p>
          </div>
        </div>
        
        {/* Updated Navigation - Clean 3-item structure with hover states */}
        <div 
          style={currentView === 'speedTracker' ? activeSidebarItemStyle : sidebarItemStyle} 
          onClick={() => setCurrentView('speedTracker')}
          onMouseEnter={(e) => {
            if (currentView !== 'speedTracker') {
              Object.assign(e.target.style, hoverSidebarItemStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== 'speedTracker') {
              Object.assign(e.target.style, sidebarItemStyle);
            }
          }}
        >
          <Activity size={20} />
          <span>🚀 Speed Tracker</span>
        </div>
        <div 
          style={currentView === 'apps' ? activeSidebarItemStyle : sidebarItemStyle} 
          onClick={() => setCurrentView('apps')}
          onMouseEnter={(e) => {
            if (currentView !== 'apps') {
              Object.assign(e.target.style, hoverSidebarItemStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== 'apps') {
              Object.assign(e.target.style, sidebarItemStyle);
            }
          }}
        >
          <Package size={20} />
          <span>Apps</span>
          {/* Pro badge for Apps */}
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
          onMouseEnter={(e) => {
            if (currentView !== 'settings') {
              Object.assign(e.target.style, hoverSidebarItemStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== 'settings') {
              Object.assign(e.target.style, sidebarItemStyle);
            }
          }}
        >
          <Settings size={20} />
          <span>Settings</span>
        </div>
        
        <div style={{ flex: 1 }}></div>
        
        {/* Community Stats - Only show for free users - Fixed positioning */}
        {isFree && (
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <CommunityStats onUnlockClick={handleUnlockFullVersion} />
          </div>
        )}
      </div>

      {/* Main Settings Content */}
      <div style={{ 
        padding: '40px', 
        height: '100vh', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '900',
            color: 'white',
            margin: '0 0 8px 0',
            letterSpacing: '-1px',
            textShadow: '0 0 0 1px rgba(31, 41, 55, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Settings
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '16px', 
            margin: '0', 
            fontWeight: '500' 
          }}>
            Customize Memory Monster to protect your Mac's performance
          </p>
        </div>

        {/* Scrollable Settings Content */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          paddingRight: '8px'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr', 
            gap: '32px',
            marginBottom: '40px'
          }}>
            {/* Main Settings Card */}
            <div style={cardStyle}>
              {/* Account Section */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '24px' 
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={18} color="white" />
                  </div>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '800', 
                    color: '#1f2937', 
                    margin: '0' 
                  }}>
                    Account & Profile
                  </h3>
                </div>

                {/* Account Info */}
                <div style={{
                  background: 'rgba(114, 9, 183, 0.05)',
                  border: '1px solid rgba(114, 9, 183, 0.1)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: '700', 
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        user@example.com
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6b7280',
                        fontWeight: '500'
                      }}>
                        {isFree ? 'Free Plan' : 'Pro Plan'} • Joined December 2024
                      </div>
                    </div>
                    <button style={{
                      padding: '8px 16px',
                      background: 'rgba(114, 9, 183, 0.1)',
                      color: '#7209b7',
                      border: '1px solid rgba(114, 9, 183, 0.2)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(114, 9, 183, 0.15)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(114, 9, 183, 0.1)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Memory Protection */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '24px' 
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Shield size={18} color="white" />
                  </div>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '800', 
                    color: '#1f2937', 
                    margin: '0' 
                  }}>
                    Memory Protection
                  </h3>
                </div>

                {/* Protection Settings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <SettingRow
                    title="Auto-scan weekly"
                    description="Automatically scan for memory monsters every week"
                    checked={autoScanWeekly}
                    onChange={() => setAutoScanWeekly(!autoScanWeekly)}
                  />
                  <SettingRow
                    title="Real-time memory monitoring"
                    description="Monitor memory usage continuously in the background"
                    checked={realTimeMonitoring}
                    onChange={() => setRealTimeMonitoring(!realTimeMonitoring)}
                  />
                  <SettingRow
                    title="Memory usage alerts"
                    description="Notify when memory usage exceeds 80%"
                    checked={memoryAlerts}
                    onChange={() => setMemoryAlerts(!memoryAlerts)}
                  />
                  <SettingRow
                    title="Auto-minimize resolved issues"
                    description="Automatically collapse fixed memory issues"
                    checked={autoMinimize}
                    onChange={() => setAutoMinimize(!autoMinimize)}
                  />
                  <SettingRow
                    title="Background memory liberation"
                    description="Automatically free memory when system is idle"
                    checked={backgroundLiberation}
                    onChange={() => setBackgroundLiberation(!backgroundLiberation)}
                    isPremium={true}
                  />

                  {/* Scan Intensity Selector */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 0'
                  }}>
                    <div>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        Scan intensity
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6b7280' 
                      }}>
                        Choose how thoroughly Memory Monster scans your system
                      </div>
                    </div>
                    <select
                      value={scanIntensity}
                      onChange={(e) => setScanIntensity(e.target.value)}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid rgba(114, 9, 183, 0.2)',
                        borderRadius: '8px',
                        background: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="Light">Light</option>
                      <option value="Normal">Normal</option>
                      <option value="Deep">Deep</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* App Behavior */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '24px' 
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Cpu size={18} color="white" />
                  </div>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '800', 
                    color: '#1f2937', 
                    margin: '0' 
                  }}>
                    App Behavior
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <SettingRow
                    title="Start at login"
                    description="Launch Memory Monster when you start your Mac"
                    checked={startAtLogin}
                    onChange={() => setStartAtLogin(!startAtLogin)}
                  />
                  <SettingRow
                    title="Keep running in background"
                    description="Continue monitoring even when app is closed"
                    checked={keepRunning}
                    onChange={() => setKeepRunning(!keepRunning)}
                  />
                  <SettingRow
                    title="Show in menu bar"
                    description="Display Memory Monster icon in the menu bar"
                    checked={showInMenuBar}
                    onChange={() => setShowInMenuBar(!showInMenuBar)}
                  />
                  <SettingRow
                    title="Auto-update Memory Monster"
                    description="Automatically download and install updates"
                    checked={autoUpdate}
                    onChange={() => setAutoUpdate(!autoUpdate)}
                  />

                  {/* Theme Selector */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 0'
                  }}>
                    <div>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        Appearance
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6b7280' 
                      }}>
                        Choose how Memory Monster looks
                      </div>
                    </div>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid rgba(114, 9, 183, 0.2)',
                        borderRadius: '8px',
                        background: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="Auto">Auto</option>
                      <option value="Light">Light</option>
                      <option value="Dark">Dark</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '24px' 
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Bell size={18} color="white" />
                  </div>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '800', 
                    color: '#1f2937', 
                    margin: '0' 
                  }}>
                    Notifications
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <SettingRow
                    title="Liberation success notifications"
                    description="Get notified when memory is successfully freed"
                    checked={successNotifications}
                    onChange={() => setSuccessNotifications(!successNotifications)}
                  />
                  <SettingRow
                    title="Weekly memory health reports"
                    description="Receive weekly summaries of your Mac's performance"
                    checked={weeklyReports}
                    onChange={() => setWeeklyReports(!weeklyReports)}
                  />
                  <SettingRow
                    title="New memory monster alerts"
                    description="Alert when new memory-hogging apps are detected"
                    checked={monsterAlerts}
                    onChange={() => setMonsterAlerts(!monsterAlerts)}
                  />
                  <SettingRow
                    title="Tips and optimization suggestions"
                    description="Get helpful tips to improve your Mac's performance"
                    checked={tips}
                    onChange={() => setTips(!tips)}
                  />
                </div>
              </div>

              {/* Advanced */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '24px' 
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Activity size={18} color="white" />
                  </div>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '800', 
                    color: '#1f2937', 
                    margin: '0' 
                  }}>
                    Advanced
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <SettingRow
                    title="Deep system scanning"
                    description="Scan deeper into system files and processes"
                    checked={deepScanning}
                    onChange={() => setDeepScanning(!deepScanning)}
                    isPremium={true}
                  />
                  <SettingRow
                    title="Monitor external drives"
                    description="Include external drives in memory optimization"
                    checked={monitorExternal}
                    onChange={() => setMonitorExternal(!monitorExternal)}
                  />
                  <SettingRow
                    title="Analytics & crash reports"
                    description="Help improve Memory Monster by sharing usage data"
                    checked={analytics}
                    onChange={() => setAnalytics(!analytics)}
                  />

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(107, 114, 128, 0.1)'
                  }}>
                    <button style={{
                      padding: '10px 20px',
                      background: 'rgba(107, 114, 128, 0.1)',
                      color: '#6b7280',
                      border: '1px solid rgba(107, 114, 128, 0.2)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(107, 114, 128, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(107, 114, 128, 0.1)';
                    }}
                    >
                      <RotateCcw size={16} />
                      Reset Settings
                    </button>
                    <button style={{
                      padding: '10px 20px',
                      background: 'rgba(107, 114, 128, 0.1)',
                      color: '#6b7280',
                      border: '1px solid rgba(107, 114, 128, 0.2)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(107, 114, 128, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(107, 114, 128, 0.1)';
                    }}
                    >
                      <FileText size={16} />
                      Export Logs
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Learning */}
              <div style={{ marginTop: '32px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '24px' 
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Activity size={18} color="white" />
                  </div>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '800', 
                    color: '#1f2937', 
                    margin: '0' 
                  }}>
                    AI Learning & Intelligence
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <SettingRow
                    title="Enable AI Learning"
                    description="Allow Memory Monster to learn from your usage patterns and improve over time"
                    checked={aiLearningEnabled}
                    onChange={() => setAiLearningEnabled(!aiLearningEnabled)}
                  />
                  
                  <SettingRow
                    title="Share optimization data"
                    description="Share anonymized optimization results to help improve Memory Monster for everyone"
                    checked={shareOptimizationData}
                    onChange={() => setShareOptimizationData(!shareOptimizationData)}
                  />
                  
                  <SettingRow
                    title="Receive AI strategy updates"
                    description="Get the latest AI-powered optimization strategies from the community"
                    checked={receiveIntelligenceUpdates}
                    onChange={() => setReceiveIntelligenceUpdates(!receiveIntelligenceUpdates)}
                    isPremium={true}
                  />
                  
                  <SettingRow
                    title="Adaptive strategies"
                    description="Let AI automatically adjust optimization strategies based on your usage"
                    checked={adaptiveStrategies}
                    onChange={() => setAdaptiveStrategies(!adaptiveStrategies)}
                    isPremium={true}
                  />
                  
                  <SettingRow
                    title="Personalized optimizations"
                    description="Enable AI to create custom optimization patterns just for your Mac"
                    checked={personalizedOptimizations}
                    onChange={() => setPersonalizedOptimizations(!personalizedOptimizations)}
                    isPremium={true}
                  />
                </div>
              </div>
              
              {/* Development Testing (Always show for now) */}
              {true && (
                <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    marginBottom: '16px' 
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Package size={18} color="white" />
                    </div>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: '800', 
                      color: '#1f2937', 
                      margin: '0' 
                    }}>
                      Development Testing
                    </h3>
                  </div>
                  
                  <button
                    onClick={() => {
                      // Simulate successful license activation
                      const activationData = {
                        email: 'dev-test@example.com',
                        plan: 'pro',
                        licenseKey: 'dev-test-key'
                      };
                      
                      // Trigger the license activation function
                      if (window.triggerLicenseActivation) {
                        window.triggerLicenseActivation(activationData);
                      } else {
                        // Manual activation
                        localStorage.setItem('memory_monster_license', JSON.stringify({
                          status: 'pro',
                          userEmail: 'dev-test@example.com',
                          licenseKey: 'dev-test-key',
                          lastVerified: new Date().toISOString()
                        }));
                        
                        // Show confetti
                        window.dispatchEvent(new CustomEvent('trigger-confetti'));
                        
                        alert('🎉 Pro license activated for development testing!');
                        window.location.reload();
                      }
                    }}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🧪 Simulate Pro Activation
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Premium & Upsells (Only show for free users) */}
            {isFree && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Premium Upgrade Card */}
                <div style={{
                  ...premiumCardStyle,
                  background: `linear-gradient(135deg, #7209b7 0%, #533483 50%, #16213e 100%)`,
                  color: 'white',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Animated background glow */}
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `conic-gradient(from 0deg, rgba(114, 9, 183, 0.3), rgba(83, 52, 131, 0.2), rgba(15, 52, 96, 0.1), rgba(114, 9, 183, 0.3))`,
                    animation: 'smoothRotate 8s linear infinite',
                    filter: 'blur(20px)',
                    opacity: 0.6
                  }} />

                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px auto',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <Crown size={32} color="white" />
                    </div>

                    <h3 style={{
                      fontSize: '24px',
                      fontWeight: '800',
                      margin: '0 0 12px 0',
                      letterSpacing: '-0.5px'
                    }}>
                      Unlock Memory Monster Pro
                    </h3>

                    <p style={{
                      fontSize: '16px',
                      margin: '0 0 24px 0',
                      fontWeight: '500',
                      opacity: 0.9,
                      lineHeight: '1.5'
                    }}>
                      Get unlimited memory liberation, real-time protection, and advanced optimization tools.
                    </p>

                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      margin: '0 0 24px 0',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        opacity: 0.8
                      }}>
                        Pro Features:
                      </div>
                      <div style={{
                        fontSize: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        textAlign: 'left'
                      }}>
                        <div>✨ Background memory liberation</div>
                        <div>🔍 Deep system scanning</div>
                        <div>📊 Advanced analytics</div>
                        <div>🚀 Priority support</div>
                      </div>
                    </div>

                    <button 
                      onClick={handleUnlockFullVersion}
                      style={{
                        width: '100%',
                        padding: '16px 24px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
                      }}
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                </div>

                {/* System Monitor Card */}
                <div style={cardStyle}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Activity size={18} color="white" />
                    </div>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1f2937',
                      margin: '0'
                    }}>
                      System Status
                    </h4>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Memory Usage</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>78%</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>CPU Usage</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>23%</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Storage Available</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>156GB</span>
                    </div>
                  </div>

                  <button style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '16px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(114, 9, 183, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                  >
                    View Detailed Stats
                  </button>
                </div>

                {/* Help & Support Card */}
                <div style={cardStyle}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <HelpCircle size={18} color="white" />
                    </div>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1f2937',
                      margin: '0'
                    }}>
                      Help & Support
                    </h4>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <button style={{
                      padding: '12px 16px',
                      background: 'rgba(114, 9, 183, 0.05)',
                      color: '#7209b7',
                      border: '1px solid rgba(114, 9, 183, 0.1)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(114, 9, 183, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(114, 9, 183, 0.05)';
                    }}
                    >
                      User Guide
                      <ExternalLink size={16} />
                    </button>
                    <button style={{
                      padding: '12px 16px',
                      background: 'rgba(114, 9, 183, 0.05)',
                      color: '#7209b7',
                      border: '1px solid rgba(114, 9, 183, 0.1)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(114, 9, 183, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(114, 9, 183, 0.05)';
                    }}
                    >
                      Contact Support
                      <ExternalLink size={16} />
                    </button>
                    <button style={{
                      padding: '12px 16px',
                      background: 'rgba(114, 9, 183, 0.05)',
                      color: '#7209b7',
                      border: '1px solid rgba(114, 9, 183, 0.1)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(114, 9, 183, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(114, 9, 183, 0.05)';
                    }}
                    >
                      Privacy Policy
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pro users get a different right column - just system status */}
            {!isFree && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* System Monitor Card */}
                <div style={cardStyle}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Activity size={18} color="white" />
                    </div>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1f2937',
                      margin: '0'
                    }}>
                      System Status
                    </h4>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Memory Usage</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>78%</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>CPU Usage</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>23%</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Storage Available</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>156GB</span>
                    </div>
                  </div>

                  <button style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '16px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(114, 9, 183, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                  >
                    View Detailed Stats
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
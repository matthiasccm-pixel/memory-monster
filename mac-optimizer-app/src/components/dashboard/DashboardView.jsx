import React from 'react';
import { Shield, Sparkles, Activity, Users, Settings } from 'lucide-react';
import Firefoxlogo from '../shared/Firefoxlogo.jsx';
import SpeedDial from './SpeedDial.jsx';
import MyStatsSidebar from '../shared/MyStatsSidebar.jsx';

const DashboardView = ({
  // Navigation
  currentView,
  setCurrentView,
  
  // SpeedDial related
  currentSpeed,
  showSpeedButton,
  setShowSpeedButton,  // ← ADD THIS LINE!
  setShowActivationModal,
  
  // Stats sidebar related
  totalMemoryFreed,
  issues,
  hasCompletedFirstFix,
  scanComplete,
  onScan
}) => {
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

  const activeSidebarItemStyle = {
    ...sidebarItemStyle,
    background: `linear-gradient(135deg, rgba(114, 9, 183, 0.4) 0%, rgba(83, 52, 131, 0.3) 100%)`,
    color: 'white',
    boxShadow: `0 8px 32px rgba(114, 9, 183, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset`
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
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: '0', fontWeight: '500' }}>Speed Command Center</p>
          </div>
        </div>

        <div style={currentView === 'dashboard' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('dashboard')}>
          <Shield size={20} />
          <span>Speed Control</span>
        </div>
        <div style={currentView === 'cleanup' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('cleanup')}>
          <Sparkles size={20} />
          <span>Memory Cleanup</span>
        </div>
        <div style={currentView === 'performance' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('performance')}>
          <Activity size={20} />
          <span>Performance</span>
        </div>
        <div style={currentView === 'community' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('community')}>
          <Users size={20} />
          <span>Community</span>
        </div>
        <div style={currentView === 'settings' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('settings')}>
          <Settings size={20} />
          <span>Settings</span>
        </div>

        <div style={currentView === 'speedTracker' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('speedTracker')}>
          <Activity size={20} />
          <span>🚀 Speed Tracker</span>
        </div>

        <div style={{ flex: 1 }}></div>
        <MyStatsSidebar 
          currentView={currentView}
          totalMemoryFreed={totalMemoryFreed}
          issues={issues}
          hasCompletedFirstFix={hasCompletedFirstFix}
          scanComplete={scanComplete}
          onScan={onScan}
        />
      </div>

      {/* Main Content Area - Simplified Dashboard */}
      <div style={{ 
        padding: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column', 
        position: 'relative',
        height: '100vh',
        transform: 'translateY(-80px)'  // This moves everything up
      }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          width: '100%',
          position: 'relative',
          height: '100%'
        }}>
          {/* SpeedDial Component - LOCKED */}
          <div style={{ position: 'relative' }}>
            <SpeedDial 
  currentSpeed={currentSpeed}
  onScanComplete={() => {
    console.log('🎯 SpeedDial onScanComplete called!');
    console.log('showSpeedButton:', showSpeedButton);
    console.log('setShowSpeedButton:', typeof setShowSpeedButton);
    
    // Safety check and trigger button show
    if (typeof setShowSpeedButton === 'function') {
      if (!showSpeedButton) {
        console.log('🚀 Setting showSpeedButton to true');
        setShowSpeedButton(true);
      } else {
        console.log('⚠️ Button already showing');
      }
    } else {
      console.error('❌ setShowSpeedButton is not a function!', setShowSpeedButton);
    }
  }}
  size="large"
/>
            
            {/* FIXED POSITION BUTTON - Absolutely positioned relative to SpeedDial */}
            {showSpeedButton && (
              <button
                onClick={() => {
                  // ONLY show modal - no other state changes
                  setShowActivationModal(true);
                }}
                style={{
                  position: 'absolute',
                  bottom: '-120px', // Position relative to SpeedDial
                  left: '50%',
                  transform: 'translateX(-50%)', // Center horizontally only
                  padding: '20px 60px',
                  background: `linear-gradient(135deg, #7209b7 0%, #533483 100%)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '20px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 16px 40px rgba(114, 9, 183, 0.4)',
                  transition: 'all 0.3s ease',
                  animation: 'slowPulse 3s ease-in-out infinite',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateX(-50%) translateY(-2px) scale(1.02)';
                  e.target.style.boxShadow = '0 20px 48px rgba(114, 9, 183, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateX(-50%) translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 16px 40px rgba(114, 9, 183, 0.4)';
                }}
              >
                Fix My Speed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
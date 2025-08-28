import React from 'react';
import { OneTimeTickerNumber, OneTimeAbbreviatedTicker } from './TickerComponents.jsx';

const MyStatsSidebar = ({ 
  currentView, 
  totalMemoryFreed, 
  issues, 
  hasCompletedFirstFix, 
  scanComplete, 
  onScan 
}) => {
  const showGlobal = currentView === 'dashboard';
  
  if (showGlobal) {
    // GLOBAL STATS VIEW (Dashboard) - With working tickers
    return (
      <div style={{
        padding: '24px',
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)`,
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `conic-gradient(from 0deg, rgba(114, 9, 183, 0.1), rgba(83, 52, 131, 0.05), rgba(15, 52, 96, 0.03), rgba(114, 9, 183, 0.1))`,
          opacity: 0.6
        }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌍</div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Memory Monster Community</div>
          {/* FIXED: Main animated number with unique ID per view */}
          <OneTimeTickerNumber
            value={2847}
            suffix="TB"
            id={`mainTicker_${currentView}`}
            style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '800',
              marginBottom: '4px',
              fontFamily: 'SF Mono, Consolas, monospace'
            }}
          />
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', fontWeight: '500', marginBottom: '16px' }}>Freed Today</div>
          {/* FIXED: Sub-stats with unique IDs per view */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '6px 8px',
              flex: 1
            }}>
              <OneTimeAbbreviatedTicker
                targetValue={1000000000}
                targetDisplay="1B+"
                id={`scansCounter_${currentView}`}
                style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}
              />
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '9px' }}>Scans Today</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '6px 8px',
              flex: 1
            }}>
              <OneTimeAbbreviatedTicker
                targetValue={500000}
                targetDisplay="500K+"
                id={`activeCounter_${currentView}`}
                style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}
              />
              <div style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '4px',
                  height: '4px',
                  background: '#10b981',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px #10b981, 0 0 12px rgba(16, 185, 129, 0.5)',
                  animation: 'pulse 2s ease-in-out infinite'
                }}></div>
                Active Today
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PERSONAL STATS VIEW (Scanning) - With live updating counter
  return (
    <div style={{
      padding: '24px',
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)`,
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>👤</div>
        <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Your Stats</div>
        
        {/* Start Scan Button instead of ticker for first time */}
        {!scanComplete ? (
          <button
            onClick={onScan}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              margin: '8px 0 16px 0'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            Start Scan
          </button>
        ) : (
          <>
            <div style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '800',
              marginBottom: '4px',
              fontFamily: 'SF Mono, Consolas, monospace'
            }}>
              {totalMemoryFreed.toFixed(1)}GB
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', fontWeight: '500', marginBottom: '16px' }}>Memory Saved</div>
          </>
        )}
        
        {/* Stats Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>1st</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>Scan</div>
          </div>
          <div>
            <div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>New</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>User</div>
          </div>
          <div>
            <div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>
              {scanComplete ? issues.filter(i => i.fixed).length : 0}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>Issues Solved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStatsSidebar;
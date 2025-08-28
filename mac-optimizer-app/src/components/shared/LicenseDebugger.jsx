/**
 * LicenseDebugger.jsx - Test component to verify license system works
 * This will help us see if our FeatureGate is working correctly
 */

import React from 'react';
import { useFeatureGate } from '../../core/licensing/useFeatureGate.js';

const LicenseDebugger = () => {
  const {
    canAccess,
    getAvailableApps,
    license,
    isPro,
    isTrial,
    isFree,
    simulateProUpgrade,
    simulateTrialStart,
    simulateFreeReset,
    getUpgradeMessage
  } = useFeatureGate();

  const availableApps = getAvailableApps();

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h3>🔧 License Debugger</h3>
      
      {/* Current License Status */}
      <div style={{ marginBottom: '15px' }}>
        <strong>Current Status:</strong>
        <div style={{ 
          padding: '5px', 
          background: isPro ? 'green' : isTrial ? 'orange' : 'gray',
          borderRadius: '3px',
          marginTop: '5px'
        }}>
          {isPro ? '👑 PRO' : isTrial ? '⏱️ TRIAL' : '🆓 FREE'}
        </div>
      </div>

      {/* Feature Access Tests */}
      <div style={{ marginBottom: '15px' }}>
        <strong>Feature Access:</strong>
        <div>Basic Scan: {canAccess('basic_scan') ? '✅' : '❌'}</div>
        <div>Auto Optimization: {canAccess('auto_optimization') ? '✅' : '❌'}</div>
        <div>Real-time Monitoring: {canAccess('real_time_monitoring') ? '✅' : '❌'}</div>
        <div>All Apps: {canAccess('all_app_support') ? '✅' : '❌'}</div>
      </div>

      {/* Available Apps Count */}
      <div style={{ marginBottom: '15px' }}>
        <strong>Available Apps:</strong> {availableApps.length}
        <div style={{ fontSize: '10px', opacity: 0.7 }}>
          {isFree ? 'Free: 10 apps' : 'Pro: All apps'}
        </div>
      </div>

      {/* Test Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <button 
          onClick={simulateFreeReset}
          style={{
            padding: '5px',
            background: 'gray',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Reset to Free
        </button>
        
        <button 
          onClick={simulateTrialStart}
          style={{
            padding: '5px',
            background: 'orange',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Start Trial
        </button>
        
        <button 
          onClick={simulateProUpgrade}
          style={{
            padding: '5px',
            background: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Upgrade to Pro
        </button>
      </div>

      {/* Sample Upgrade Message */}
      {isFree && (
        <div style={{ 
          marginTop: '10px', 
          padding: '8px', 
          background: 'rgba(255,165,0,0.2)',
          borderRadius: '3px',
          fontSize: '10px'
        }}>
          <strong>Sample Upgrade Message:</strong>
          <div>{getUpgradeMessage('auto_optimization')}</div>
        </div>
      )}
    </div>
  );
};

export default LicenseDebugger;
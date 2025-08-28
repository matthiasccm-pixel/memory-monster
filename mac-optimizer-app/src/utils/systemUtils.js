import React from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

// System-related utility functions

// Handle disk access grant - Opens actual system preferences
export const handleGrantDiskAccess = (setDiskAccessGranted, setCurrentView) => {
  const confirmOpen = window.confirm('This will open System Preferences where you can grant Memory Monster full disk access. Continue?');
  
  if (confirmOpen) {
    // Actually open System Preferences on macOS
    try {
      // Create a temporary iframe to trigger system preferences without blank window
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles';
      document.body.appendChild(iframe);
      setTimeout(() => document.body.removeChild(iframe), 1000);
    } catch (error) {
      console.log('System Preferences would open here in real app');
    }
    
    // Simulate the user enabling access and auto-detect
    setTimeout(() => {
      setDiskAccessGranted(true);
      setCurrentView('accessGranted');
    }, 3000);
  }
};

// FIXED: External link handling for Electron
export const openExternalLink = (url) => {
  // For Electron - use shell.openExternal when available
  if (window.require) {
    try {
      const { shell } = window.require('electron');
      shell.openExternal(url);
    } catch (error) {
      console.log('External link would open:', url);
      // Show temporary notification
      alert(`This will open: ${url}\n(External links will work in the final app)`);
    }
  } else {
    // Fallback for development
    console.log('External link would open:', url);
    alert(`This will open: ${url}\n(External links will work in the final app)`);
  }
};

// Animate memory counter
export const animateMemoryCounter = (startValue, targetValue, setAnimatingMemory) => {
  const difference = targetValue - startValue;
  const steps = 30;
  const stepValue = difference / steps;
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    const newValue = startValue + (stepValue * currentStep);
    setAnimatingMemory(Math.max(0, newValue));
    
    if (currentStep >= steps) {
      clearInterval(interval);
      setAnimatingMemory(targetValue);
    }
  }, 50);
};

// Get severity style for issues
export const getSeverityStyle = (severity) => {
  const baseStyle = {
    borderRadius: '20px',
    position: 'relative',
    overflow: 'hidden'
  };

  switch(severity) {
    case 'critical': 
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.12) 30%, rgba(59, 130, 246, 0.08) 60%, rgba(236, 72, 153, 0.05) 100%)`,
        border: '1px solid rgba(34, 197, 94, 0.25)',
        boxShadow: `0 8px 32px rgba(34, 197, 94, 0.15), 0 1px 0 rgba(255, 255, 255, 0.05) inset, 0 0 0 1px rgba(34, 197, 94, 0.08) inset`
      };
    case 'high': 
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(34, 197, 94, 0.12) 30%, rgba(59, 130, 246, 0.08) 60%, rgba(236, 72, 153, 0.05) 100%)`,
        border: '1px solid rgba(16, 185, 129, 0.25)',
        boxShadow: `0 8px 32px rgba(16, 185, 129, 0.15), 0 1px 0 rgba(255, 255, 255, 0.05) inset, 0 0 0 1px rgba(16, 185, 129, 0.08) inset`
      };
    case 'medium': 
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.12) 30%, rgba(34, 197, 94, 0.08) 60%, rgba(236, 72, 153, 0.05) 100%)`,
        border: '1px solid rgba(59, 130, 246, 0.25)',
        boxShadow: `0 8px 32px rgba(59, 130, 246, 0.15), 0 1px 0 rgba(255, 255, 255, 0.05) inset, 0 0 0 1px rgba(59, 130, 246, 0.08) inset`
      };
    default: 
      return baseStyle;
  }
};

// Get fixing content for issues
export const getFixingContent = (state, issue, handleFix) => {
  switch(state) {
    case 'analyzing':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', padding: '8px 16px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.05))', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ width: '16px', height: '16px', border: '2px solid rgba(16, 185, 129, 0.3)', borderTop: '2px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <div><div style={{ fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap' }}>Locating...</div></div>
        </div>
      );
    case 'liberating':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', padding: '8px 16px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(34, 197, 94, 0.08))', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <Sparkles size={16} style={{ animation: 'pulse 2s infinite' }} />
          <div><div style={{ fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap' }}>Liberating memory...</div></div>
        </div>
      );
    case 'complete':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', padding: '8px 16px', background: `linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(34, 197, 94, 0.1) 50%, rgba(59, 130, 246, 0.05) 100%)`, borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)', animation: 'success 0.8s ease-out', minWidth: '140px', fontSize: '12px' }}>
          <CheckCircle size={16} />
          <div><div style={{ fontWeight: '700', fontSize: '12px' }}>{issue.storage}GB freed! 🎉</div></div>
        </div>
      );
    default:
      return (
        <button onClick={() => handleFix(issue.id)} style={{ padding: '12px 24px', background: `linear-gradient(135deg, #7209b7 0%, #533483 50%, #16213e 100%)`, color: 'white', border: 'none', borderRadius: '16px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: `0 8px 24px rgba(114, 9, 183, 0.35), 0 4px 12px rgba(83, 52, 131, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset`, transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative', overflow: 'hidden' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px) scale(1.02)'; e.target.style.boxShadow = `0 12px 32px rgba(114, 9, 183, 0.45), 0 6px 18px rgba(83, 52, 131, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15) inset`; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0) scale(1)'; e.target.style.boxShadow = `0 8px 24px rgba(114, 9, 183, 0.35), 0 4px 12px rgba(83, 52, 131, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset`; }}>
          <span style={{ position: 'relative', zIndex: 1 }}>Unlock {issue.storage}GB</span>
        </button>
      );
  }
};
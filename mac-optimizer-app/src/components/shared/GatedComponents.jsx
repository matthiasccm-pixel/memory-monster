/**
 * GatedComponents.jsx - Reusable components that respect licensing
 * These components automatically show/hide features based on license status
 */

import React, { useState } from 'react';
import { Crown, Lock, Zap, Star, ArrowRight, X } from 'lucide-react';
import { useFeatureGate } from '../../core/licensing/useFeatureGate.js';

// ===== GATED BUTTON COMPONENT =====
export const GatedButton = ({ 
  feature, 
  children, 
  onClick, 
  style = {}, 
  className = '',
  showUpgradeModal = true,
  fallbackText = 'Upgrade to Pro',
  ...buttonProps 
}) => {
  const { canAccess, getUpgradeMessage, license } = useFeatureGate();
  const [showModal, setShowModal] = useState(false);
  
  const hasAccess = canAccess(feature);
  
  if (hasAccess) {
    // User has access - show normal button
    return (
      <button 
        onClick={onClick} 
        style={style} 
        className={className}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
  
  // User doesn't have access - show locked button
  const handleLockedClick = () => {
    if (showUpgradeModal) {
      setShowModal(true);
    }
  };
  
  return (
    <>
      <button
        onClick={handleLockedClick}
        style={{
          ...style,
          opacity: 0.7,
          background: 'rgba(107, 114, 128, 0.3)',
          cursor: 'pointer',
          position: 'relative'
        }}
        className={className}
        {...buttonProps}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={16} />
          {fallbackText}
        </div>
      </button>
      
      {showModal && (
        <UpgradeModal 
          feature={feature}
          message={getUpgradeMessage(feature)}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

// ===== GATED SECTION COMPONENT =====
export const GatedSection = ({ 
  feature, 
  children, 
  fallback = null,
  showUpgradePrompt = true 
}) => {
  const { canAccess, getUpgradeMessage } = useFeatureGate();
  const [showModal, setShowModal] = useState(false);
  
  const hasAccess = canAccess(feature);
  
  if (hasAccess) {
    return children;
  }
  
  if (fallback) {
    return fallback;
  }
  
  if (!showUpgradePrompt) {
    return null;
  }
  
  // Show upgrade prompt
  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(114, 9, 183, 0.05), rgba(83, 52, 131, 0.03))',
          border: '2px dashed rgba(114, 9, 183, 0.2)',
          borderRadius: '16px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'linear-gradient(135deg, rgba(114, 9, 183, 0.1), rgba(83, 52, 131, 0.05))';
          e.target.style.borderColor = 'rgba(114, 9, 183, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'linear-gradient(135deg, rgba(114, 9, 183, 0.05), rgba(83, 52, 131, 0.03))';
          e.target.style.borderColor = 'rgba(114, 9, 183, 0.2)';
        }}
      >
        <Crown size={32} color="#7209b7" style={{ marginBottom: '12px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#7209b7', margin: '0 0 8px 0' }}>
          Pro Feature
        </h3>
        <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>
          Click to unlock this premium feature
        </p>
      </div>
      
      {showModal && (
        <UpgradeModal 
          feature={feature}
          message={getUpgradeMessage(feature)}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

// ===== SETTING ROW WITH GATING =====
export const GatedSettingRow = ({ 
  feature,
  title, 
  description, 
  checked, 
  onChange, 
  showProBadge = true 
}) => {
  const { canAccess, license } = useFeatureGate();
  const [showModal, setShowModal] = useState(false);
  
  const hasAccess = canAccess(feature);
  
  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <label style={{
      position: 'relative',
      display: 'inline-block',
      width: '48px',
      height: '28px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{ opacity: 0, width: 0, height: 0 }}
      />
      <span style={{
        position: 'absolute',
        cursor: disabled ? 'not-allowed' : 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: checked ? '#7209b7' : 'rgba(107, 114, 128, 0.3)',
        transition: 'all 0.3s ease',
        borderRadius: '28px',
        boxShadow: checked ? '0 4px 12px rgba(114, 9, 183, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          position: 'absolute',
          height: '20px',
          width: '20px',
          left: checked ? '24px' : '4px',
          bottom: '4px',
          backgroundColor: 'white',
          transition: 'all 0.3s ease',
          borderRadius: '50%',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }} />
      </span>
    </label>
  );
  
  const handleToggleClick = (e) => {
    if (!hasAccess) {
      e.preventDefault();
      setShowModal(true);
      return;
    }
    onChange(e);
  };

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '16px 0',
        borderBottom: '1px solid rgba(107, 114, 128, 0.1)',
        opacity: !hasAccess ? 0.6 : 1
      }}>
        <div style={{ flex: 1, paddingRight: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px'
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              {title}
            </div>
            {!hasAccess && showProBadge && (
              <div style={{
                background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
                color: 'white',
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                PRO
              </div>
            )}
            {!hasAccess && (
              <Lock size={14} color="#7209b7" />
            )}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: '1.4'
          }}>
            {description}
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <ToggleSwitch 
            checked={hasAccess ? checked : false} 
            onChange={handleToggleClick} 
            disabled={!hasAccess}
          />
        </div>
      </div>
      
      {showModal && (
        <UpgradeModal 
          feature={feature}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

// ===== UPGRADE MODAL =====
const UpgradeModal = ({ feature, message, onClose }) => {
  const { getUpgradeMessage, simulateProUpgrade, simulateTrialStart } = useFeatureGate();
  
  const upgradeText = message || getUpgradeMessage(feature);
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        border: '1px solid rgba(114, 9, 183, 0.2)',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        animation: 'slideUp 0.4s ease-out'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(107, 114, 128, 0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'none'}
        >
          <X size={20} color="#6b7280" />
        </button>
        
        {/* Crown icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 24px auto',
          background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 24px rgba(114, 9, 183, 0.4)'
        }}>
          <Crown size={40} color="white" />
        </div>
        
        <h2 style={{
          color: '#1f2937',
          fontSize: '24px',
          fontWeight: '800',
          margin: '0 0 12px 0'
        }}>
          Unlock Pro Feature
        </h2>
        
        <p style={{
          color: '#6b7280',
          fontSize: '16px',
          margin: '0 0 32px 0',
          lineHeight: '1.6'
        }}>
          {upgradeText}
        </p>
        
        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => {
              simulateTrialStart();
              onClose();
            }}
            style={{
              padding: '12px 24px',
              background: 'rgba(114, 9, 183, 0.1)',
              color: '#7209b7',
              border: '1px solid rgba(114, 9, 183, 0.3)',
              borderRadius: '12px',
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
            Start 7-Day Trial
          </button>
          
          <button
            onClick={() => {
              simulateProUpgrade();
              onClose();
            }}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(114, 9, 183, 0.4)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 8px 24px rgba(114, 9, 183, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 16px rgba(114, 9, 183, 0.4)';
            }}
          >
            Upgrade to Pro
            <ArrowRight size={16} />
          </button>
        </div>
        
        {/* Demo notice */}
        <p style={{
          color: '#9ca3af',
          fontSize: '12px',
          margin: '20px 0 0 0',
          fontStyle: 'italic'
        }}>
          * Demo mode - buttons simulate license changes
        </p>
      </div>
    </div>
  );
};

// ===== LICENSE STATUS BAR =====
export const LicenseStatusBar = () => {
  const { license, simulateProUpgrade, simulateTrialStart, simulateFreeReset } = useFeatureGate();
  
  if (license.isPro) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        <Crown size={16} />
        Memory Monster Pro
      </div>
    );
  }
  
  if (license.isTrial) {
    const daysLeft = license.trialEnd ? 
      Math.ceil((new Date(license.trialEnd) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
    
    return (
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        <Star size={16} />
        Trial: {daysLeft} days left
      </div>
    );
  }
  
  return (
    <div style={{
      background: 'rgba(107, 114, 128, 0.1)',
      color: '#6b7280',
      padding: '8px 16px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
      fontWeight: '600'
    }}>
      Free Edition
    </div>
  );
};

// ===== APP LOCK OVERLAY =====
export const AppLockOverlay = ({ appId, appName }) => {
  const { shouldShowUpgrade, getUpgradeMessage } = useFeatureGate();
  const [showModal, setShowModal] = useState(false);
  
  if (!shouldShowUpgrade(appId)) {
    return null; // App is available
  }
  
  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.7)';
        }}
      >
        <Lock size={32} color="white" style={{ marginBottom: '8px' }} />
        <div style={{ 
          color: 'white', 
          fontSize: '14px', 
          fontWeight: '600',
          textAlign: 'center'
        }}>
          Pro Feature
        </div>
        <div style={{ 
          color: 'rgba(255, 255, 255, 0.8)', 
          fontSize: '12px',
          textAlign: 'center'
        }}>
          Click to unlock
        </div>
      </div>
      
      {showModal && (
        <UpgradeModal 
          feature="all_app_support"
          message={`Unlock ${appName} and 240+ other apps with Memory Monster Pro`}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
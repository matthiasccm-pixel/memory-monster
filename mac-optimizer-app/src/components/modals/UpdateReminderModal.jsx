import React, { useState } from 'react';
import { Download, Sparkles, Crown, Zap, X, Clock, CheckCircle } from 'lucide-react';
import settingsManager from '../../utils/settingsManager.js';
import updateReminderManager from '../../utils/updateReminderManager.js';
import { useFeatureGate } from '../../core/licensing/useFeatureGate.js';
import { openUpgradePage } from '../../utils/upgradeUtils.js';

const UpdateReminderModal = ({ isVisible, updateInfo, onClose }) => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isEnablingAutoUpdate, setIsEnablingAutoUpdate] = useState(false);
  const { isFree, isPro } = useFeatureGate();

  if (!isVisible || !updateInfo) return null;

  const { version, reminderCount } = updateInfo;

  const handleInstallUpdate = async () => {
    if (!window.electronAPI) return;
    
    try {
      setIsInstalling(true);
      const result = await window.electronAPI.installUpdate();
      
      if (result.success) {
        updateReminderManager.onUpdateInstalled();
        onClose();
      } else {
        console.error('Failed to install update:', result.error);
      }
    } catch (error) {
      console.error('Error installing update:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleEnableAutoUpdates = async () => {
    try {
      setIsEnablingAutoUpdate(true);
      
      await settingsManager.set('autoUpdate', true);
      updateReminderManager.onAutoUpdateEnabled();
      
      // Show success notification
      await settingsManager.showNotification(
        'Auto-Updates Enabled! 🚀',
        'You\'ll never miss an update again!'
      );
      
      onClose();
    } catch (error) {
      console.error('Failed to enable auto-updates:', error);
    } finally {
      setIsEnablingAutoUpdate(false);
    }
  };

  const handleDismiss = (duration) => {
    updateReminderManager.dismissUpdateReminder(duration);
    onClose();
  };

  const handleUpgrade = () => {
    // Show upgrade prompt first, then onClose
    updateReminderManager.showUpgradeUpdatePrompt();
    openUpgradePage();
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    animation: 'fadeIn 0.3s ease-out'
  };

  const modalStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '32px',
    maxWidth: '520px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    position: 'relative',
    animation: 'slideUp 0.4s ease-out'
  };

  const getUrgencyLevel = () => {
    if (reminderCount <= 1) return 'new';
    if (reminderCount <= 3) return 'moderate';
    return 'urgent';
  };

  const urgencyLevel = getUrgencyLevel();
  
  const getHeaderConfig = () => {
    switch (urgencyLevel) {
      case 'new':
        return {
          icon: Sparkles,
          title: 'Get the New Version! 🚀',
          subtitle: `Memory Monster ${version} has new speed improvements`,
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.1)'
        };
      case 'moderate':
        return {
          icon: Zap,
          title: 'You\'re Missing Out! ⚡',
          subtitle: `Version ${version} makes Memory Monster 30% faster`,
          color: '#f59e0b',
          bgColor: 'rgba(245, 158, 11, 0.1)'
        };
      case 'urgent':
        return {
          icon: Download,
          title: 'Your Memory Monster is Outdated! 🚨',
          subtitle: `Version ${version} has critical improvements you\'re missing`,
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.1)'
        };
    }
  };

  const headerConfig = getHeaderConfig();
  const HeaderIcon = headerConfig.icon;

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '24px'
  };

  const iconContainerStyle = {
    width: '64px',
    height: '64px',
    margin: '0 auto 16px',
    background: `linear-gradient(135deg, ${headerConfig.color} 0%, ${headerConfig.color}dd 100%)`,
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    animation: urgencyLevel === 'urgent' ? 'pulse 2s infinite' : 'none'
  };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#6b7280',
    lineHeight: '1.5'
  };

  // Features based on user type and urgency
  const getFeatures = () => {
    const baseFeatures = [
      {
        icon: CheckCircle,
        title: 'Daily AI Improvements',
        desc: 'Memory Monster learns and gets smarter every day'
      },
      {
        icon: Zap,
        title: 'Speed Enhancements',
        desc: 'Each update makes scanning and optimization faster'
      }
    ];

    if (isFree) {
      return [
        ...baseFeatures,
        {
          icon: Crown,
          title: 'New Pro Features',
          desc: 'Latest Pro capabilities you could be using',
          isPro: true
        }
      ];
    }

    return [
      ...baseFeatures,
      {
        icon: Crown,
        title: 'Enhanced Pro Features',
        desc: 'Your Pro features get better with every update'
      }
    ];
  };

  const features = getFeatures();

  const featuresStyle = {
    marginBottom: '28px'
  };

  const featureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(107, 114, 128, 0.08)'
  };

  const featureIconStyle = {
    width: '18px',
    height: '18px',
    flexShrink: 0
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const primaryButtonStyle = {
    background: `linear-gradient(135deg, ${headerConfig.color} 0%, ${headerConfig.color}dd 100%)`,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: `0 4px 16px ${headerConfig.color}40`,
    opacity: isInstalling ? 0.7 : 1
  };

  const autoUpdateButtonStyle = {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
    opacity: isEnablingAutoUpdate ? 0.7 : 1
  };

  const dismissButtonStyle = {
    background: 'rgba(107, 114, 128, 0.1)',
    color: '#6b7280',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <div style={overlayStyle}>
        <div style={modalStyle}>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(107, 114, 128, 0.1)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            <X size={16} />
          </button>

          <div style={headerStyle}>
            <div style={iconContainerStyle}>
              <HeaderIcon size={28} />
            </div>
            <h2 style={titleStyle}>{headerConfig.title}</h2>
            <p style={subtitleStyle}>{headerConfig.subtitle}</p>
          </div>

          <div style={featuresStyle}>
            {features.map((feature, index) => (
              <div key={index} style={featureItemStyle}>
                <feature.icon 
                  style={{
                    ...featureIconStyle,
                    color: feature.isPro ? '#8b5cf6' : headerConfig.color
                  }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: '15px',
                    marginBottom: '2px'
                  }}>
                    {feature.title}
                    {feature.isPro && <span style={{ color: '#8b5cf6', marginLeft: '4px' }}>👑</span>}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: '1.4'
                  }}>
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={buttonContainerStyle}>
            <button
              onClick={handleInstallUpdate}
              disabled={isInstalling}
              style={primaryButtonStyle}
            >
              {isInstalling ? 'Installing...' : `🚀 Install Version ${version}`}
            </button>

            <button
              onClick={handleEnableAutoUpdates}
              disabled={isEnablingAutoUpdate}
              style={autoUpdateButtonStyle}
            >
              {isEnablingAutoUpdate ? 'Enabling...' : '⚡ Turn On Auto-Updates'}
            </button>

            {isFree && (
              <button
                onClick={handleUpgrade}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
                }}
              >
                👑 Upgrade to Pro First
              </button>
            )}

            <button
              onClick={() => handleDismiss('day')}
              style={dismissButtonStyle}
            >
              Skip For Now
            </button>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: headerConfig.bgColor,
            borderRadius: '12px',
            border: `1px solid ${headerConfig.color}20`
          }}>
            <p style={{
              fontSize: '14px',
              color: headerConfig.color,
              margin: 0,
              textAlign: 'center',
              fontWeight: '600'
            }}>
              🧠 Did you know? Memory Monster gets better every day with updates!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateReminderModal;
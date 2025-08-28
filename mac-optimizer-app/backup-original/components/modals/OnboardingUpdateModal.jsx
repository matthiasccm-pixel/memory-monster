import React, { useState } from 'react';
import { Zap, Shield, TrendingUp, X, Settings } from 'lucide-react';
import settingsManager from '../../utils/settingsManager.js';
import updateReminderManager from '../../utils/updateReminderManager.js';

const OnboardingUpdateModal = ({ isVisible, onClose }) => {
  const [isEnabling, setIsEnabling] = useState(false);

  if (!isVisible) return null;

  const handleEnableAutoUpdates = async () => {
    try {
      setIsEnabling(true);
      
      // Enable auto-updates
      await settingsManager.set('autoUpdate', true);
      
      // Notify the reminder manager
      updateReminderManager.onAutoUpdateEnabled();
      
      // Show success message
      await settingsManager.showNotification(
        'Auto-Updates Enabled! 🚀',
        'Memory Monster will now stay automatically updated with the latest intelligence!'
      );
      
      onClose();
    } catch (error) {
      console.error('Failed to enable auto-updates:', error);
    } finally {
      setIsEnabling(false);
    }
  };

  const handleRemindLater = () => {
    updateReminderManager.dismissUpdateReminder('hour');
    onClose();
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    animation: 'fadeIn 0.3s ease-out'
  };

  const modalStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    maxWidth: '480px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    animation: 'slideUp 0.4s ease-out'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '24px'
  };

  const iconStyle = {
    width: '48px',
    height: '48px',
    margin: '0 auto 16px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#6b7280',
    lineHeight: '1.5'
  };

  const benefitsStyle = {
    marginBottom: '24px'
  };

  const benefitItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(107, 114, 128, 0.1)'
  };

  const benefitIconStyle = {
    width: '20px',
    height: '20px',
    color: '#10b981',
    flexShrink: 0
  };

  const benefitTextStyle = {
    flex: 1
  };

  const benefitTitleStyle = {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: '15px',
    marginBottom: '2px'
  };

  const benefitDescStyle = {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.4'
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const primaryButtonStyle = {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
    opacity: isEnabling ? 0.7 : 1
  };

  const secondaryButtonStyle = {
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

  const closeButtonStyle = {
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
    color: '#6b7280',
    transition: 'all 0.2s ease'
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
      `}</style>

      <div style={overlayStyle}>
        <div style={modalStyle}>
          <button 
            onClick={onClose}
            style={closeButtonStyle}
            onMouseOver={(e) => e.target.style.background = 'rgba(107, 114, 128, 0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(107, 114, 128, 0.1)'}
          >
            <X size={16} />
          </button>

          <div style={headerStyle}>
            <div style={iconStyle}>
              <Zap size={24} />
            </div>
            <h2 style={titleStyle}>Keep Memory Monster Smart! 🧠</h2>
            <p style={subtitleStyle}>
              Enable auto-updates to always have the latest AI intelligence and optimization features
            </p>
          </div>

          <div style={benefitsStyle}>
            <div style={benefitItemStyle}>
              <TrendingUp style={benefitIconStyle} />
              <div style={benefitTextStyle}>
                <div style={benefitTitleStyle}>Always Latest Intelligence</div>
                <div style={benefitDescStyle}>Get smarter AI algorithms and new optimization techniques automatically</div>
              </div>
            </div>

            <div style={benefitItemStyle}>
              <Shield style={benefitIconStyle} />
              <div style={benefitTextStyle}>
                <div style={benefitTitleStyle}>Security & Bug Fixes</div>
                <div style={benefitDescStyle}>Stay protected with automatic security updates and performance improvements</div>
              </div>
            </div>

            <div style={benefitItemStyle}>
              <Settings style={benefitIconStyle} />
              <div style={benefitTextStyle}>
                <div style={benefitTitleStyle}>New Features First</div>
                <div style={benefitDescStyle}>Be the first to get new memory optimization features and system integrations</div>
              </div>
            </div>
          </div>

          <div style={buttonContainerStyle}>
            <button
              onClick={handleEnableAutoUpdates}
              disabled={isEnabling}
              style={primaryButtonStyle}
              onMouseOver={(e) => {
                if (!isEnabling) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isEnabling) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.3)';
                }
              }}
            >
              {isEnabling ? 'Enabling...' : '🚀 Enable Auto-Updates'}
            </button>
            
            <button
              onClick={handleRemindLater}
              style={secondaryButtonStyle}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(107, 114, 128, 0.15)';
                e.target.style.color = '#4b5563';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(107, 114, 128, 0.1)';
                e.target.style.color = '#6b7280';
              }}
            >
              Remind Me Later
            </button>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(16, 185, 129, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.1)'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#059669',
              margin: 0,
              textAlign: 'center',
              fontWeight: '500'
            }}>
              💡 All updates are free and make Memory Monster smarter!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingUpdateModal;
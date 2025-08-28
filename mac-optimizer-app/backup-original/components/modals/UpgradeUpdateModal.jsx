import React, { useState } from 'react';
import { Crown, Zap, Shield, TrendingUp, X } from 'lucide-react';
import settingsManager from '../../utils/settingsManager.js';
import updateReminderManager from '../../utils/updateReminderManager.js';

const UpgradeUpdateModal = ({ isVisible, onClose }) => {
  const [isEnabling, setIsEnabling] = useState(false);

  if (!isVisible) return null;

  const handleEnableAutoUpdates = async () => {
    try {
      setIsEnabling(true);
      
      await settingsManager.set('autoUpdate', true);
      updateReminderManager.onAutoUpdateEnabled();
      
      await settingsManager.showNotification(
        'Auto-Updates Enabled! 🚀',
        'Your Pro features will stay cutting-edge with automatic updates!'
      );
      
      onClose();
    } catch (error) {
      console.error('Failed to enable auto-updates:', error);
    } finally {
      setIsEnabling(false);
    }
  };

  const handleRemindLater = () => {
    updateReminderManager.dismissUpdateReminder('day');
    onClose();
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
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(251, 245, 255, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 60px rgba(139, 92, 246, 0.2)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    position: 'relative',
    animation: 'slideUp 0.4s ease-out'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '28px'
  };

  const crownStyle = {
    width: '64px',
    height: '64px',
    margin: '0 auto 16px',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    animation: 'glow 2s ease-in-out infinite alternate'
  };

  const titleStyle = {
    fontSize: '26px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '17px',
    color: '#6b7280',
    lineHeight: '1.5'
  };

  const benefitsStyle = {
    marginBottom: '28px'
  };

  const benefitItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: 'rgba(139, 92, 246, 0.05)',
    borderRadius: '12px',
    marginBottom: '12px',
    border: '1px solid rgba(139, 92, 246, 0.1)'
  };

  const benefitIconStyle = {
    width: '24px',
    height: '24px',
    color: '#8b5cf6',
    flexShrink: 0
  };

  const benefitTextStyle = {
    flex: 1
  };

  const benefitTitleStyle = {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: '16px',
    marginBottom: '4px'
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
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
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

        @keyframes glow {
          from { 
            box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
          }
          to { 
            box-shadow: 0 8px 32px rgba(139, 92, 246, 0.6);
          }
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
            <div style={crownStyle}>
              <Crown size={32} />
            </div>
            <h2 style={titleStyle}>Welcome to Memory Monster Pro! 👑</h2>
            <p style={subtitleStyle}>
              Now enable auto-updates to keep your Pro features cutting-edge
            </p>
          </div>

          <div style={benefitsStyle}>
            <div style={benefitItemStyle}>
              <TrendingUp style={benefitIconStyle} />
              <div style={benefitTextStyle}>
                <div style={benefitTitleStyle}>Pro Feature Updates</div>
                <div style={benefitDescStyle}>Get the latest enhancements to real-time monitoring, deep scanning, and background optimization</div>
              </div>
            </div>

            <div style={benefitItemStyle}>
              <Shield style={benefitIconStyle} />
              <div style={benefitTextStyle}>
                <div style={benefitTitleStyle}>Priority Updates</div>
                <div style={benefitDescStyle}>Pro users get early access to new features and priority security updates</div>
              </div>
            </div>

            <div style={benefitItemStyle}>
              <Zap style={benefitIconStyle} />
              <div style={benefitTextStyle}>
                <div style={benefitTitleStyle}>Maximum Performance</div>
                <div style={benefitDescStyle}>Your Pro investment stays valuable with constant AI improvements and optimization algorithms</div>
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
                  e.target.style.boxShadow = '0 6px 24px rgba(139, 92, 246, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isEnabling) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.3)';
                }
              }}
            >
              {isEnabling ? 'Enabling...' : '🚀 Enable Pro Auto-Updates'}
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
              Maybe Later
            </button>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(139, 92, 246, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(139, 92, 246, 0.1)'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#8b5cf6',
              margin: 0,
              textAlign: 'center',
              fontWeight: '600'
            }}>
              👑 Pro updates are always included - no additional charges ever!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpgradeUpdateModal;
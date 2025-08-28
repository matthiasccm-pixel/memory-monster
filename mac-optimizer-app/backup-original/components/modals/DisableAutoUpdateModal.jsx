import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, X, Zap, Shield, Sparkles } from 'lucide-react';

const DisableAutoUpdateModal = ({ isVisible, onConfirm, onCancel }) => {
  const [isDisabling, setIsDisabling] = useState(false);

  if (!isVisible) return null;

  const handleConfirmDisable = async () => {
    setIsDisabling(true);
    await onConfirm();
    setIsDisabling(false);
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
    animation: 'fadeIn 0.4s ease-out'
  };

  const modalStyle = {
    background: `linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 50%, rgba(7, 12, 21, 0.98) 100%)`,
    backdropFilter: 'blur(24px)',
    borderRadius: '28px',
    padding: '48px',
    maxWidth: '520px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: `
      0 32px 64px rgba(0, 0, 0, 0.4), 
      0 12px 24px rgba(245, 158, 11, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.05) inset,
      0 0 64px rgba(245, 158, 11, 0.1)
    `,
    border: '2px solid rgba(245, 158, 11, 0.3)',
    position: 'relative',
    animation: 'slideUpScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '32px'
  };

  const iconStyle = {
    width: '80px',
    height: '80px',
    margin: '0 auto 24px',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 12px 24px rgba(245, 158, 11, 0.4)',
    animation: 'pulse 3s infinite'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '12px'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.6'
  };

  const warningBoxStyle = {
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px'
  };

  const warningTextStyle = {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: '1.6'
  };

  const featuresStyle = {
    marginBottom: '24px'
  };

  const featureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    opacity: 0.8
  };

  const featureIconStyle = {
    width: '24px',
    height: '24px',
    color: '#ef4444',
    flexShrink: 0
  };

  const featureTextStyle = {
    flex: 1
  };

  const featureTitleStyle = {
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    marginBottom: '4px',
    textDecoration: 'line-through',
    opacity: 0.8
  };

  const featureDescStyle = {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: '1.4'
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const primaryButtonStyle = {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
    width: '100%'
  };

  const secondaryButtonStyle = {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '16px',
    padding: '14px 32px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    opacity: isDisabling ? 0.5 : 1,
    width: '100%',
    backdropFilter: 'blur(10px)'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '12px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.6)',
    transition: 'all 0.2s ease'
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUpScale {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 8px 24px rgba(245, 158, 11, 0.5);
          }
        }
      `}</style>

      <div style={overlayStyle}>
        <div style={modalStyle}>
          <button 
            onClick={onCancel}
            style={closeButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.color = 'rgba(255, 255, 255, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = 'rgba(255, 255, 255, 0.6)';
            }}
          >
            <X size={20} />
          </button>

          <div style={headerStyle}>
            <div style={iconStyle}>
              <AlertTriangle size={28} />
            </div>
            <h2 style={titleStyle}>Are You Sure? 🤔</h2>
            <p style={subtitleStyle}>
              Memory Monster gets better every day with automatic updates
            </p>
          </div>

          <div style={warningBoxStyle}>
            <p style={warningTextStyle}>
              ⚠️ Did you know? Memory Monster's AI gets smarter with every update. 
              When you disable updates, you miss out on speed improvements, 
              new features, and critical bug fixes.
            </p>
          </div>

          <div style={featuresStyle}>
            <div style={featureItemStyle}>
              <TrendingDown style={featureIconStyle} />
              <div style={featureTextStyle}>
                <div style={featureTitleStyle}>Daily AI Improvements</div>
                <div style={featureDescStyle}>Miss out on smarter optimization algorithms</div>
              </div>
            </div>

            <div style={featureItemStyle}>
              <TrendingDown style={featureIconStyle} />
              <div style={featureTextStyle}>
                <div style={featureTitleStyle}>Speed Enhancements</div>
                <div style={featureDescStyle}>Your scans will get slower over time</div>
              </div>
            </div>

            <div style={featureItemStyle}>
              <TrendingDown style={featureIconStyle} />
              <div style={featureTextStyle}>
                <div style={featureTitleStyle}>New Features</div>
                <div style={featureDescStyle}>No access to new memory optimization tools</div>
              </div>
            </div>

            <div style={featureItemStyle}>
              <TrendingDown style={featureIconStyle} />
              <div style={featureTextStyle}>
                <div style={featureTitleStyle}>Security Updates</div>
                <div style={featureDescStyle}>Potential vulnerabilities won't be patched</div>
              </div>
            </div>
          </div>

          <div style={buttonContainerStyle}>
            <button
              onClick={onCancel}
              style={primaryButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15) inset';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
              }}
            >
              ✅ Keep Auto-Updates On
            </button>
            
            <button
              onClick={handleConfirmDisable}
              disabled={isDisabling}
              style={secondaryButtonStyle}
              onMouseEnter={(e) => {
                if (!isDisabling) {
                  e.target.style.background = 'rgba(239, 68, 68, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabling) {
                  e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {isDisabling ? 'Disabling...' : 'Yes, Turn Off Updates'}
            </button>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              textAlign: 'center',
              fontWeight: '500'
            }}>
              💡 Pro tip: All updates are free and make Memory Monster work better!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisableAutoUpdateModal;
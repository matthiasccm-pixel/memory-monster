import React, { useState } from 'react';
import { Key, CheckCircle, AlertCircle, X } from 'lucide-react';

const LicenseKeyModal = ({ onClose, onActivateSuccess }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleActivate = async () => {
    if (!licenseKey.trim() || !email.trim()) {
      setError('Please enter both license key and email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!window.electronAPI || !window.electronAPI.verifyLicense) {
        throw new Error('App API not available');
      }

      // Get device ID
      const deviceId = localStorage.getItem('memory_monster_device_id') || 
                      'mm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('memory_monster_device_id', deviceId);

      // Verify license with website
      const result = await window.electronAPI.verifyLicense({
        userEmail: email.trim(),
        deviceId: deviceId,
        appVersion: '1.0.0',
        licenseKey: licenseKey.trim()
      });

      if (result.valid && (result.plan === 'pro' || result.plan === 'trial')) {
        // Store license locally
        const licenseData = {
          status: result.plan,
          userEmail: email.trim(),
          licenseKey: licenseKey.trim(),
          lastVerified: new Date().toISOString(),
          features: result.features
        };
        localStorage.setItem('memory_monster_license', JSON.stringify(licenseData));

        // Notify parent component with success data
        onActivateSuccess({
          plan: result.plan,
          email: email.trim(),
          licenseKey: licenseKey.trim(),
          showSuccessModal: true // Add flag to show success modal
        });

        onClose();
      } else {
        setError(result.error || 'Invalid license key or email. Please check your details.');
      }
    } catch (error) {
      console.error('License activation error:', error);
      setError('Failed to activate license. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleActivate();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: `linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)`,
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '500px',
        width: '90%',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        animation: 'slideUp 0.4s ease-out'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px auto',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 24px rgba(59, 130, 246, 0.4)'
          }}>
            <Key size={40} color="white" />
          </div>
          
          <h2 style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: '800',
            margin: '0 0 12px 0'
          }}>
            Activate License
          </h2>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px',
            margin: '0',
            lineHeight: '1.6'
          }}>
            Enter your license key and email to unlock Pro features
          </p>
        </div>

        {/* Form */}
        <div style={{ marginBottom: '24px' }}>
          {/* License Key Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              License Key
            </label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              onKeyPress={handleKeyPress}
              onPaste={(e) => {
                // Ensure paste works properly
                e.stopPropagation();
                const pastedText = e.clipboardData.getData('text');
                if (pastedText) {
                  setLicenseKey(pastedText.trim());
                  e.preventDefault();
                }
              }}
              placeholder="MM-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontFamily: 'monospace',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.8)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.8)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <AlertCircle size={16} color="#ef4444" />
              <span style={{ color: '#ef4444', fontSize: '14px' }}>{error}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleActivate}
            disabled={loading || !licenseKey.trim() || !email.trim()}
            style={{
              flex: 2,
              padding: '12px 24px',
              background: loading ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: loading || !licenseKey.trim() || !email.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !licenseKey.trim() || !email.trim() ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading && licenseKey.trim() && email.trim()) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Activating...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Activate License
              </>
            )}
          </button>
        </div>

        {/* Help Text */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          padding: '12px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '12px',
            margin: '0',
            lineHeight: '1.4'
          }}>
            💡 Your license key can be found in your purchase confirmation email or dashboard.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LicenseKeyModal;
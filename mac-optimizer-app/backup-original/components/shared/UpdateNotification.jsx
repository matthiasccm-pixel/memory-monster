import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, CheckCircle, AlertTriangle, X } from 'lucide-react';

const UpdateNotification = () => {
  const [updateStatus, setUpdateStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      // Listen for update status changes
      window.electronAPI.onUpdateStatus((status) => {
        console.log('Update status:', status);
        setUpdateStatus(status);
        
        // Show notification for certain statuses
        if (status.status === 'available' || status.status === 'downloaded' || status.status === 'error') {
          setIsVisible(true);
        }
      });
    }
  }, []);

  const handleInstallUpdate = async () => {
    if (!window.electronAPI) return;
    
    try {
      setIsInstalling(true);
      const result = await window.electronAPI.installUpdate();
      
      if (!result.success) {
        console.error('Failed to install update:', result.error);
        // Keep the notification visible to show error state
      }
    } catch (error) {
      console.error('Error installing update:', error);
      setIsInstalling(false);
    }
  };

  const handleCheckForUpdates = async () => {
    if (!window.electronAPI) return;
    
    try {
      const result = await window.electronAPI.checkForUpdates();
      console.log('Update check result:', result);
      
      if (result.isDev) {
        // Show dev mode message briefly
        setUpdateStatus({ status: 'dev-mode' });
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 3000);
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || !updateStatus) {
    return null;
  }

  const getStatusConfig = () => {
    switch (updateStatus.status) {
      case 'checking':
        return {
          icon: RefreshCw,
          title: 'Checking for updates...',
          message: 'Looking for the latest version',
          color: 'blue',
          showInstall: false,
          spinning: true
        };
      
      case 'available':
        return {
          icon: Download,
          title: 'Update available',
          message: `Version ${updateStatus.version} is ready to download`,
          color: 'green',
          showInstall: false,
          spinning: false
        };
      
      case 'downloading':
        const progress = updateStatus.progress;
        return {
          icon: Download,
          title: 'Downloading update...',
          message: progress ? `${Math.round(progress.percent)}% complete` : 'Downloading...',
          color: 'blue',
          showInstall: false,
          spinning: true
        };
      
      case 'downloaded':
        return {
          icon: CheckCircle,
          title: 'Update ready to install',
          message: `Version ${updateStatus.version} will be installed on restart`,
          color: 'green',
          showInstall: true,
          spinning: false
        };
      
      case 'not-available':
        return {
          icon: CheckCircle,
          title: 'You\'re up to date',
          message: `Version ${updateStatus.version} is the latest`,
          color: 'green',
          showInstall: false,
          spinning: false
        };
      
      case 'error':
        return {
          icon: AlertTriangle,
          title: 'Update check failed',
          message: updateStatus.error || 'Unable to check for updates',
          color: 'red',
          showInstall: false,
          spinning: false
        };
      
      case 'dev-mode':
        return {
          icon: AlertTriangle,
          title: 'Development mode',
          message: 'Auto-updates are disabled in development',
          color: 'orange',
          showInstall: false,
          spinning: false
        };
      
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();
  if (!statusConfig) return null;

  const IconComponent = statusConfig.icon;

  const containerStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 10000,
    maxWidth: '350px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    animation: 'slideInFromRight 0.3s ease-out'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px'
  };

  const titleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    color: '#1f2937'
  };

  const iconStyle = {
    width: '18px',
    height: '18px',
    color: statusConfig.color === 'green' ? '#10b981' : 
           statusConfig.color === 'blue' ? '#3b82f6' :
           statusConfig.color === 'red' ? '#ef4444' : '#f59e0b',
    ...(statusConfig.spinning ? { animation: 'spin 1s linear infinite' } : {})
  };

  const messageStyle = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: statusConfig.showInstall ? '12px' : '0'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '8px'
  };

  const buttonStyle = {
    flex: 1,
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const installButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white'
  };

  const laterButtonStyle = {
    ...buttonStyle,
    background: 'rgba(107, 114, 128, 0.1)',
    color: '#6b7280'
  };

  return (
    <>
      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div style={titleStyle}>
            <IconComponent style={iconStyle} />
            {statusConfig.title}
          </div>
          <button
            onClick={handleDismiss}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
              padding: '4px'
            }}
          >
            <X size={16} />
          </button>
        </div>
        
        <div style={messageStyle}>
          {statusConfig.message}
        </div>
        
        {statusConfig.showInstall && (
          <div style={buttonContainerStyle}>
            <button
              onClick={handleInstallUpdate}
              disabled={isInstalling}
              style={{
                ...installButtonStyle,
                opacity: isInstalling ? 0.7 : 1,
                cursor: isInstalling ? 'not-allowed' : 'pointer'
              }}
            >
              {isInstalling ? 'Installing...' : 'Install & Restart'}
            </button>
            <button
              onClick={handleDismiss}
              style={laterButtonStyle}
            >
              Later
            </button>
          </div>
        )}
        
        {statusConfig.status === 'not-available' && (
          <div style={buttonContainerStyle}>
            <button
              onClick={handleCheckForUpdates}
              style={laterButtonStyle}
            >
              Check Again
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateNotification;
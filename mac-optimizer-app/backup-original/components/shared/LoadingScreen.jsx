import React from 'react';
import { containerStyle } from '../../styles/commonStyles.js';
import LicenseDebugger from './LicenseDebugger.jsx';

const LoadingScreen = ({ loadingMessage }) => {
  return (
    <div style={containerStyle}>
      {/* Add our license debugger for testing */}
      <LicenseDebugger />
      
      {/* Dynamic purple/blue gradient background orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: '350px', height: '350px', background: `radial-gradient(circle, rgba(114, 9, 183, 0.4) 0%, rgba(83, 52, 131, 0.3) 40%, transparent 70%)`, borderRadius: '50%', filter: 'blur(60px)', animation: 'smoothFloat 12s ease-in-out infinite' }}></div>
      <div style={{ position: 'absolute', top: '60%', right: '10%', width: '280px', height: '280px', background: `radial-gradient(circle, rgba(83, 52, 131, 0.35) 0%, rgba(15, 52, 96, 0.25) 50%, transparent 70%)`, borderRadius: '50%', filter: 'blur(50px)', animation: 'smoothFloat 16s ease-in-out infinite reverse' }}></div>
      <div style={{ position: 'absolute', bottom: '20%', left: '20%', width: '320px', height: '320px', background: `radial-gradient(circle, rgba(15, 52, 96, 0.3) 0%, rgba(114, 9, 183, 0.2) 60%, transparent 70%)`, borderRadius: '50%', filter: 'blur(70px)', animation: 'smoothFloat 10s ease-in-out infinite 3s' }}></div>
      
      {/* Main content */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', zIndex: 10, position: 'relative' }}>
        
        {/* Revolutionary loading spinner */}
        <div style={{ position: 'relative', marginBottom: '64px' }}>
          <div style={{
            width: '160px',
            height: '160px',
            margin: '0 auto',
            position: 'relative'
          }}>
            {/* Background glow ring */}
            <div style={{
              position: 'absolute',
              inset: '-20px',
              background: `conic-gradient(from 0deg, rgba(114, 9, 183, 0.6), rgba(83, 52, 131, 0.4), rgba(15, 52, 96, 0.3), rgba(114, 9, 183, 0.6))`,
              borderRadius: '50%',
              filter: 'blur(20px)',
              animation: 'smoothRotate 8s linear infinite',
              opacity: 0.7
            }}></div>
            
            {/* Outer ring */}
            <svg width="160" height="160" style={{ position: 'absolute', zIndex: 3 }}>
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="2"
              />
            </svg>
            
            {/* Animated progress circle with gradient */}
            <svg width="160" height="160" style={{ position: 'absolute', animation: 'smoothRotate 4s linear infinite', zIndex: 4 }}>
              <defs>
                <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7209b7" />
                  <stop offset="30%" stopColor="#533483" />
                  <stop offset="70%" stopColor="#16213e" />
                  <stop offset="100%" stopColor="#7209b7" />
                </linearGradient>
              </defs>
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#speedGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="150 300"
                style={{ filter: 'drop-shadow(0 0 20px rgba(114, 9, 183, 0.8))' }}
              />
            </svg>
            
            {/* Inner pulsing core */}
            <div style={{
              position: 'absolute',
              inset: '50px',
              background: `linear-gradient(135deg, rgba(114, 9, 183, 0.9) 0%, rgba(83, 52, 131, 0.8) 50%, rgba(15, 52, 96, 0.9) 100%)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'smoothPulse 3s ease-in-out infinite',
              boxShadow: '0 0 40px rgba(114, 9, 183, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.1)',
              zIndex: 5
            }}>
              <div style={{
                fontSize: '40px',
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
                animation: 'smoothSparkle 2s ease-in-out infinite'
              }}>
                ⚡
              </div>
            </div>
          </div>
        </div>
        
        {/* App title with gradient text */}
        <h1 style={{ 
          fontSize: '56px', 
          fontWeight: '900', 
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(114, 9, 183, 0.9) 50%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 4s ease-in-out infinite',
          marginBottom: '20px',
          letterSpacing: '-2px',
          textAlign: 'center',
          textShadow: '0 0 30px rgba(114, 9, 183, 0.3)'
        }}>
          Memory Monster
        </h1>
        
        {/* Exciting subtitle */}
        <p style={{ 
          fontSize: '22px', 
          color: 'rgba(255, 255, 255, 0.95)', 
          marginBottom: '48px',
          textAlign: 'center',
          fontWeight: '600',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(114, 9, 183, 0.8) 50%, rgba(255, 255, 255, 0.95) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 6s ease-in-out infinite reverse',
          letterSpacing: '0.5px'
        }}>
          Unleashing Your Mac's Hidden Speed
        </p>
        
        {/* Dynamic loading message */}
        <div style={{ 
          minHeight: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '12px 32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(114, 9, 183, 0.3)'
        }}>
          <p style={{ 
            fontSize: '18px', 
            color: 'white', 
            textAlign: 'center',
            fontWeight: '700',
            animation: 'smoothPulse 2s ease-in-out infinite',
            margin: 0
          }}>
            {loadingMessage}
          </p>
        </div>
        
        {/* Speed metrics preview - more exciting */}
        <div style={{ 
          marginTop: '56px',
          display: 'flex',
          gap: '48px',
          opacity: 0,
          animation: 'fadeInUp 1s ease-out 1.5s forwards'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '900', 
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
              filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))'
            }}>
              84%
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '600'
            }}>
              Hidden Speed
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '900', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
              filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
            }}>
              2.1TB
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '600'
            }}>
              Memory to Free
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '900', 
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
              filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.5))'
            }}>
              500K+
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '600'
            }}>
              Speed Unlocked
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced keyframes styles */}
      <style>{`
        @keyframes smoothRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes smoothFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-30px) translateX(20px); }
          66% { transform: translateY(15px) translateX(-15px); }
        }

        @keyframes smoothPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        @keyframes smoothSparkle {
          0%, 100% { opacity: 0.8; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
        }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
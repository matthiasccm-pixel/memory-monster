import React from 'react';

const DiskAccessScreen = ({ onContinue, onGrantAccess, onSkip }) => {
  const cardStyle = {
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.90) 100%)`,
    backdropFilter: 'blur(32px) saturate(180%)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2) inset`,
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div style={{ padding: '40px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...cardStyle, maxWidth: '600px', width: '100%', textAlign: 'center', position: 'relative' }}>
        
        {/* Main icon with glow effect */}
        <div style={{ width: '120px', height: '120px', margin: '0 auto 32px auto', background: `linear-gradient(135deg, #7209b7 0%, #533483 100%)`, borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: `0 20px 40px rgba(114, 9, 183, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset` }}>
          <div style={{ fontSize: '48px', zIndex: 2 }}>🔒</div>
          <div style={{ position: 'absolute', top: '85px', right: '15px', width: '24px', height: '24px', background: '#7209b7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(114, 9, 183, 0.4)' }}>
            <span style={{ fontSize: '12px' }}>✓</span>
          </div>
        </div>
        
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1f2937', margin: '0 0 16px 0', letterSpacing: '-1px' }}>Let's Analyze Your Mac's Speed Potential</h1>
        <p style={{ color: '#6b7280', fontSize: '18px', margin: '0 0 32px 0', fontWeight: '500', lineHeight: '1.6' }}>
          To find out how fast your Mac actually is, Memory Monster needs to peek under the hood. We'll show you exactly which apps are hogging your horsepower and how much speed you could unlock.
        </p>
        
        {/* Feature benefits */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '32px 0 40px 0' }}>
          <div style={{ padding: '16px', background: 'rgba(114, 9, 183, 0.1)', borderRadius: '16px', border: '1px solid rgba(114, 9, 183, 0.2)' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏎️</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>See Your True Speed</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(83, 52, 131, 0.1)', borderRadius: '16px', border: '1px solid rgba(83, 52, 131, 0.2)' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💪</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>Free Your Horsepower</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button 
            onClick={onSkip}
            style={{ 
              padding: '12px 24px', 
              background: 'rgba(107, 114, 128, 0.1)', 
              color: '#6b7280', 
              border: '1px solid rgba(107, 114, 128, 0.2)', 
              borderRadius: '12px', 
              fontSize: '16px', 
              fontWeight: '600', 
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(107, 114, 128, 0.15)';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.transition = 'all 0.15s ease';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(107, 114, 128, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Skip for Now
          </button>
          <button 
            onClick={onGrantAccess}
            style={{ 
              padding: '12px 32px', 
              background: `linear-gradient(135deg, #7209b7 0%, #533483 100%)`, 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '16px', 
              fontWeight: '700', 
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(114, 9, 183, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 12px 32px rgba(114, 9, 183, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15) inset';
              e.target.style.transition = 'all 0.15s ease';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 24px rgba(114, 9, 183, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
            }}
          >
            Grant Full Disk Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiskAccessScreen;
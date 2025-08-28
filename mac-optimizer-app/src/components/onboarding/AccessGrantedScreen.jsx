import React from 'react';

const AccessGrantedScreen = ({ onContinue }) => {
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
        
        {/* Success icon with smooth glow */}
        <div style={{ 
          width: '120px', 
          height: '120px', 
          margin: '0 auto 32px auto', 
          background: `linear-gradient(135deg, #7209b7 0%, #533483 100%)`, 
          borderRadius: '32px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          position: 'relative', 
          boxShadow: `0 20px 40px rgba(114, 9, 183, 0.4)`
        }}>
          
          <div style={{ fontSize: '48px', zIndex: 2 }}>✅</div>
          
          {/* Sparkle effects - smoother */}
          <div style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '16px', animation: 'smoothSparkle 3s ease-in-out infinite' }}>✨</div>
          <div style={{ position: 'absolute', bottom: '20px', left: '15px', fontSize: '12px', animation: 'smoothSparkle 3s ease-in-out infinite 1.5s' }}>✨</div>
        </div>
        
        <h1 style={{ fontSize: '36px', fontWeight: '900', background: 'linear-gradient(135deg, #7209b7, #533483)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 16px 0', letterSpacing: '-1px' }}>Ready to Unlock Your Speed!</h1>
        <p style={{ color: '#6b7280', fontSize: '18px', margin: '0 0 24px 0', fontWeight: '500', lineHeight: '1.6' }}>
          Perfect! Now Memory Monster can analyze which apps are stealing your horsepower and show you exactly how much faster your Mac can run.
        </p>

        {/* Info Bubble */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(114, 9, 183, 0.1), rgba(83, 52, 131, 0.05))', 
          border: '1px solid rgba(114, 9, 183, 0.2)', 
          borderRadius: '16px', 
          padding: '20px', 
          margin: '0 0 40px 0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚀</div>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: '0', fontWeight: '500' }}>
            You're about to join <strong style={{ color: '#7209b7' }}>500K+ people worldwide</strong> who use Memory Monster to save memory from all those crazy apps we know and love.
          </p>
        </div>
        
        {/* Button with smooth glow */}
        <button 
          onClick={() => onContinue('speedTracker')}
          style={{ 
            padding: '16px 48px', 
            background: `linear-gradient(135deg, #7209b7 0%, #533483 100%)`, 
            color: 'white', 
            border: 'none', 
            borderRadius: '16px', 
            fontSize: '18px', 
            fontWeight: '700', 
            cursor: 'pointer',
            boxShadow: '0 12px 32px rgba(114, 9, 183, 0.4)',
            transition: 'all 0.15s ease',
            animation: 'fastPulse 2s ease-in-out infinite',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px) scale(1.05)';
            e.target.style.boxShadow = '0 16px 40px rgba(114, 9, 183, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 12px 32px rgba(114, 9, 183, 0.4)';
          }}
        >
          Begin
        </button>
      </div>
    </div>
  );
};

export default AccessGrantedScreen;
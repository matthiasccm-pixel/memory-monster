import React from 'react';
import Firefoxlogo from '../shared/Firefoxlogo.jsx';

const ActivatePlanModal = ({ 
  onSkip, 
  onActivateNow, 
  onBuyPlan,
  onUseCode
}) => (
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
      background: `linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)`,
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '48px',
      maxWidth: '500px',
      width: '90%',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 24px 48px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
      position: 'relative',
      animation: 'slideUp 0.4s ease-out'
    }}>
      {/* App icon */}
      <div style={{ width: '80px', height: '80px', margin: '0 auto 24px auto', background: `linear-gradient(135deg, #7c3aed 0%, #db2777 100%)`, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 24px rgba(124, 58, 237, 0.4)', animation: 'pulse 3s infinite' }}>
        <Firefoxlogo size={48} />
      </div>
      
      <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '800', margin: '0 0 12px 0' }}>Let's fix your speed</h2>
      <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', margin: '0 0 32px 0', lineHeight: '1.6' }}>
        Join millions fighting app bloat daily. Free your Mac from hundreds of speed-stealing apps for the price of a coffee every month.
      </p>
      
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={onSkip}
          style={{ 
            padding: '12px 20px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            color: 'rgba(255, 255, 255, 0.8)', 
            border: '1px solid rgba(255, 255, 255, 0.2)', 
            borderRadius: '12px', 
            fontSize: '14px', 
            fontWeight: '600', 
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.15)';
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateY(0) scale(1)';
          }}
        >
          Skip
        </button>

        <button 
          onClick={onUseCode || onActivateNow}
          style={{ 
            padding: '12px 24px', 
            background: 'rgba(107, 114, 128, 0.3)', 
            color: 'white', 
            border: '1px solid rgba(107, 114, 128, 0.5)', 
            borderRadius: '12px', 
            fontSize: '14px', 
            fontWeight: '600', 
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(107, 114, 128, 0.4)';
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(107, 114, 128, 0.3)';
            e.target.style.transform = 'translateY(0) scale(1)';
          }}
        >
          Use Code
        </button>

        <button 
          onClick={onBuyPlan}
          style={{ 
            padding: '12px 24px', 
            background: `linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)`, 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            fontSize: '14px', 
            fontWeight: '700', 
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px) scale(1.08)';
            e.target.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
          }}
        >
          Activate Now
        </button>
      </div>
    </div>
  </div>
);

export default ActivatePlanModal;
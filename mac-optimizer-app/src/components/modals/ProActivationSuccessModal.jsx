import React from 'react';
import { CheckCircle, Crown, Sparkles, X } from 'lucide-react';
import Firefoxlogo from '../shared/Firefoxlogo.jsx';

const ProActivationSuccessModal = ({ onClose, userEmail, plan }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.4s ease-out'
    }}>
      <div style={{
        background: `linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 50%, rgba(7, 12, 21, 0.98) 100%)`,
        backdropFilter: 'blur(24px)',
        borderRadius: '28px',
        padding: '64px 48px 48px 48px',
        maxWidth: '550px',
        width: '90%',
        border: '2px solid rgba(114, 9, 183, 0.3)',
        boxShadow: `
          0 32px 64px rgba(0, 0, 0, 0.4), 
          0 12px 24px rgba(114, 9, 183, 0.2),
          0 0 0 1px rgba(255, 255, 255, 0.05) inset,
          0 0 64px rgba(114, 9, 183, 0.1)
        `,
        position: 'relative',
        animation: 'slideUpScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        textAlign: 'center'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px',
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.6)',
            transition: 'all 0.2s ease'
          }}
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

        {/* Floating background elements */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '30px',
          width: '6px',
          height: '6px',
          background: 'linear-gradient(135deg, #7209b7, #533483)',
          borderRadius: '50%',
          opacity: 0.6,
          animation: 'float 3s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '40px',
          width: '8px',
          height: '8px',
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          borderRadius: '50%',
          opacity: 0.4,
          animation: 'float 4s ease-in-out infinite 1s'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50px',
          width: '4px',
          height: '4px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '50%',
          opacity: 0.5,
          animation: 'float 3.5s ease-in-out infinite 0.5s'
        }} />

        {/* Success Icon with App Logo */}
        <div style={{ 
          position: 'relative',
          marginBottom: '32px'
        }}>
          {/* Outer glow ring */}
          <div style={{
            width: '140px',
            height: '140px',
            margin: '0 auto',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, rgba(114, 9, 183, 0.4), rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.3), rgba(114, 9, 183, 0.4))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'rotate 8s linear infinite'
          }}>
            {/* Inner circle with app logo */}
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #7209b7 0%, #533483 50%, #16213e 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 0 32px rgba(114, 9, 183, 0.4)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <Firefoxlogo size={48} />
              
              {/* Success checkmark overlay */}
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                right: '-8px',
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4), 0 0 0 3px rgba(30, 41, 59, 1)',
                animation: 'bounceIn 0.6s ease-out 0.8s both'
              }}>
                <CheckCircle size={20} color="white" />
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <Crown size={28} color="#fbbf24" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <h1 style={{
              color: 'white',
              fontSize: '32px',
              fontWeight: '900',
              margin: '0',
              background: 'linear-gradient(135deg, #7209b7, #3b82f6, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome to Pro!
            </h1>
            <Crown size={28} color="#fbbf24" style={{ animation: 'pulse 2s ease-in-out infinite 0.5s' }} />
          </div>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 8px 0',
            lineHeight: '1.4'
          }}>
            🎉 License activated successfully!
          </p>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            margin: '0',
            lineHeight: '1.5'
          }}>
            {userEmail} • {plan === 'trial' ? 'Free Trial' : 'Pro Plan'}
          </p>
        </div>

        {/* Pro Features Unlocked */}
        <div style={{
          background: 'rgba(114, 9, 183, 0.1)',
          border: '1px solid rgba(114, 9, 183, 0.3)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <Sparkles size={20} color="#7209b7" />
            <h3 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '800',
              margin: '0'
            }}>
              Pro Features Unlocked
            </h3>
            <Sparkles size={20} color="#7209b7" />
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            fontSize: '14px'
          }}>
            {[
              { icon: '🚀', text: 'Unlimited Memory Scans' },
              { icon: '📱', text: '250+ Apps Supported' },
              { icon: '⚡', text: 'Real-time Monitoring' },
              { icon: '🤖', text: 'AI-powered Optimization' },
              { icon: '👥', text: 'Community Intelligence' },
              { icon: '💎', text: 'Priority Support' }
            ].map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255, 255, 255, 0.8)',
                animation: `fadeInUp 0.4s ease-out ${0.2 + index * 0.1}s both`
              }}>
                <span style={{ fontSize: '16px' }}>{feature.icon}</span>
                {feature.text}
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #7209b7 0%, #533483 50%, #16213e 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(114, 9, 183, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.02)';
            e.target.style.boxShadow = '0 12px 32px rgba(114, 9, 183, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15) inset';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 8px 24px rgba(114, 9, 183, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
          }}
        >
          🚀 Start Optimizing
        </button>
      </div>

      <style jsx>{`
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
        
        @keyframes bounceIn {
          0% { 
            opacity: 0; 
            transform: scale(0.3); 
          }
          50% { 
            transform: scale(1.05); 
          }
          70% { 
            transform: scale(0.9); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
};

export default ProActivationSuccessModal;
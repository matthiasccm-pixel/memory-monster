import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

const CommunityStats = ({ onUnlockClick }) => {
  // State for dynamic counters
  const [memoryFreedToday, setMemoryFreedToday] = useState(2901);
  const [scansToday, setScansToday] = useState(1234567890);
  const [proMembers, setProMembers] = useState(1400000);
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);

  // Live community updates
  const liveUpdates = [
    "2,847 Macs optimized today",
    "Community discovered: Adobe using 40% more memory than needed", 
    "Most freed today: Chrome tabs (avg 3.2GB per user)",
    "Live: Sarah just freed 8GB in San Francisco",
    "Pro tip: Memory Monster works best when running daily",
    "James in London just boosted his Mac by 67%"
  ];

  // Cycling live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTickerIndex((prev) => (prev + 1) % liveUpdates.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Slow moving counters for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryFreedToday(prev => prev + Math.floor(Math.random() * 3));
      setScansToday(prev => prev + Math.floor(Math.random() * 50));
      setProMembers(prev => prev + Math.floor(Math.random() * 2));
    }, 6000); // Every 6 seconds
    return () => clearInterval(interval);
  }, []);

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B+`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`;
    }
    return num.toString();
  };

  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)`,
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '24px 20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center' // Ensure everything is centered
    }}>
      {/* Subtle background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        background: `radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 50%), 
                     radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)`,
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        gap: '8px'
      }}>
        <div style={{ fontSize: '18px' }}>🌍</div>
        <div style={{
          fontSize: '15px',
          fontWeight: '700',
          color: 'white',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}>
          Memory Monster Community
        </div>
      </div>
      
      {/* Main Stat - Speed Freed Today */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '32px',
          fontWeight: '800',
          color: 'white',
          lineHeight: '1',
          marginBottom: '4px',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}>
          {memoryFreedToday.toLocaleString()}TB
        </div>
        <div style={{
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: '500',
          textAlign: 'center'
        }}>
          Speed Freed Today
        </div>
      </div>
      
      {/* Sub Stats - Single Line - Perfectly Centered */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
        fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        <span>{formatNumber(scansToday)} Scans</span>
        <div style={{
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.5)'
        }} />
        <span>{formatNumber(proMembers)} Pro Members</span>
      </div>

      {/* Live Updates Ticker - Centered */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center' // Center the ticker content
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Center the ticker content
          gap: '8px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#10b981',
            animation: 'pulse 2s infinite',
            flexShrink: 0
          }} />
          <div style={{
            fontSize: '12px',
            color: 'white',
            fontWeight: '500',
            lineHeight: '1.3',
            flex: 1,
            opacity: 0.9,
            textAlign: 'center' // Center the text
          }}>
            {liveUpdates[currentTickerIndex]}
          </div>
        </div>
      </div>

      {/* Unlock Button - Perfectly Centered */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        width: '100%'
      }}>
        <button
          onClick={onUnlockClick}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: `linear-gradient(135deg, #7209b7 0%, #533483 100%)`,
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(114, 9, 183, 0.4)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 24px rgba(114, 9, 183, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 6px 20px rgba(114, 9, 183, 0.4)';
          }}
        >
          {/* Button shine effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            animation: 'shine 3s ease-in-out infinite'
          }} />
          
          <Lock className="w-4 h-4" />
          Unlock Full Version
        </button>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        
        @keyframes shine {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default CommunityStats;
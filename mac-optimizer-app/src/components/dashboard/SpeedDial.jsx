import React, { useState, useEffect, useCallback } from 'react';
import { useFeatureGate } from '../../core/licensing/useFeatureGate.js';
import RealSpeedCalculator from '../../core/performance/RealSpeedCalculator.js';

const SpeedDial = ({
  onScanComplete = () => {},
  onScanStart = () => {},
  onOptimizationComplete = () => {},
  className = "",
  size = 'large',
  isScanning = false,
  optimizationProgress = 0,
  scanButtonVisible = false
}) => {
  // Get user license info
  const { isFree, isPro, getRemainingScans, decrementScans } = useFeatureGate();
  
  // Real system state
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [potentialSpeed, setPotentialSpeed] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('loading');
  const [statusMessage, setStatusMessage] = useState('');
  const [showActionButton, setShowActionButton] = useState(false);
  const [remainingScans, setRemainingScans] = useState(3);
  const [speedCalculator] = useState(() => new RealSpeedCalculator());
  const [systemPerformance, setSystemPerformance] = useState(null);

  const containerSize = size === 'large' ? 500 : 250;
  const strokeWidth = size === 'large' ? 60 : 30;

  // Initialize with real system data
  useEffect(() => {
    const initializeSpeedDial = async () => {
      try {
        setAnimationPhase('analyzing');
        setStatusMessage('Reading your Mac\'s performance...');
        
        // Get real system performance data
        const performance = await speedCalculator.calculateRealSpeed();
        setSystemPerformance(performance);
        
        const realSpeed = performance.currentSpeed;
        const potential = Math.min(100, realSpeed + performance.potentialImprovement);
        
        setCurrentSpeed(realSpeed);
        setPotentialSpeed(potential);
        setAnimationPhase('distressed');
        
        // Show status based on actual bottlenecks
        const primaryBottleneck = performance.bottlenecks[0];
        if (primaryBottleneck === 'memory_pressure') {
          setStatusMessage('Your Mac is struggling with memory pressure...');
        } else if (primaryBottleneck === 'cpu_overload') {
          setStatusMessage('High CPU usage is slowing things down...');
        } else if (primaryBottleneck === 'disk_io') {
          setStatusMessage('Disk activity is creating bottlenecks...');
        } else if (primaryBottleneck === 'swap_usage') {
          setStatusMessage('Heavy swap usage is hurting performance...');
        } else if (primaryBottleneck === 'thermal_throttling') {
          setStatusMessage('Thermal throttling is limiting speed...');
        } else if (realSpeed < 40) {
          setStatusMessage('Multiple issues are affecting performance...');
        } else if (realSpeed < 60) {
          setStatusMessage('Performance is being held back...');
        } else {
          setStatusMessage('Running well, but could be optimized...');
        }
        
        setRemainingScans(getRemainingScans());
        setIsInitialized(true);
        setShowActionButton(true);
        
        // Real-time performance monitoring with actual updates
        const monitorInterval = setInterval(async () => {
          if (animationPhase !== 'scanning' && animationPhase !== 'optimizing') {
            try {
              const updatedPerformance = await speedCalculator.calculateRealSpeed();
              setSystemPerformance(updatedPerformance);
              setCurrentSpeed(updatedPerformance.currentSpeed);
            } catch (error) {
              console.error('Performance monitoring update failed:', error);
            }
          }
        }, 5000); // Update every 5 seconds with real data
        
        return () => clearInterval(monitorInterval);
        
      } catch (error) {
        console.error('Failed to initialize SpeedDial:', error);
        setCurrentSpeed(25); // Fallback to distressed state
        setAnimationPhase('error');
        setStatusMessage('Unable to read system performance');
      }
    };
    
    if (!isInitialized) {
      initializeSpeedDial();
    }
  }, [isInitialized, speedCalculator, getRemainingScans, animationPhase]);

  // Handle scan button press
  const handleScanPress = useCallback(() => {
    if (isFree && remainingScans <= 0) {
      // Show upgrade prompt
      setStatusMessage('No scans remaining this month');
      return;
    }
    
    // Call the parent's scan logic
    onScanStart();
    
  }, [isFree, remainingScans, onScanStart]);

  // Handle real-time optimization updates
  useEffect(() => {
    if (animationPhase === 'optimizing') {
      const optimizedSpeed = currentSpeed + (optimizationProgress * 0.6); // Gradual speed increase
      setCurrentSpeed(optimizedSpeed);
      
      if (optimizationProgress >= 100) {
        setAnimationPhase('success');
        setStatusMessage(isPro ? 
          'Optimization complete! Running at peak speed.' :
          `Speed improved! ${remainingScans} scans remaining this month.`
        );
        onOptimizationComplete();
      }
    }
  }, [optimizationProgress, currentSpeed, animationPhase, isPro, remainingScans, onOptimizationComplete]);

  // Handle scan completion from external scanning
  useEffect(() => {
    if (isScanning) {
      setAnimationPhase('scanning');
      setStatusMessage('AI scanning for speed bottlenecks...');
    } else if (!isScanning && animationPhase === 'scanning') {
      // Scanning completed externally
      setAnimationPhase('results');
      setStatusMessage('Found apps slowing you down!');
      setTimeout(() => {
        onScanComplete();
        // Reset to normal state once drawer opens
        setTimeout(() => {
          setAnimationPhase('distressed');
          setStatusMessage('Ready for another scan');
        }, 1000);
      }, 500);
    }
  }, [isScanning, animationPhase, onScanComplete]);

  // Calculate progress bars
  const circumference = 2 * Math.PI * ((containerSize - strokeWidth) / 2);
  const maxArcDegrees = 260; // Half circle speedometer
  
  // Current speed progress
  const currentProgressDegrees = (currentSpeed / 100) * maxArcDegrees;
  const currentProgressLength = (currentProgressDegrees / 360) * circumference;
  
  // Potential speed backdrop (showing what COULD be achieved)
  const potentialProgressDegrees = (potentialSpeed / 100) * maxArcDegrees;
  const potentialProgressLength = (potentialProgressDegrees / 360) * circumference;

  // Dynamic colors based on performance
  const getSpeedColor = () => {
    if (currentSpeed < 30) return '#ef4444'; // Red for poor performance
    if (currentSpeed < 60) return '#f59e0b'; // Orange for moderate
    return '#10b981'; // Green for good performance
  };

  return (
    <div style={{ position: 'relative', textAlign: 'center', ...className }}>
      {/* Main Speedometer Container */}
      <div style={{ 
        position: 'relative', 
        width: `${containerSize}px`, 
        height: `${containerSize}px`, 
        margin: '0 auto' 
      }}>
        {/* Beautiful Background Glow */}
        <div style={{
          position: 'absolute',
          inset: '-40px',
          background: `radial-gradient(circle, ${getSpeedColor()}20 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(20px)',
          opacity: animationPhase === 'distressed' ? 0.6 : 0.3,
          transition: 'all 1s ease-in-out'
        }} />
        
        <svg width={containerSize} height={containerSize}>
          <defs>
            {/* Dynamic gradients based on performance */}
            <linearGradient id={`currentGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={getSpeedColor()} />
              <stop offset="100%" stopColor={`${getSpeedColor()}cc`} />
            </linearGradient>
            <linearGradient id={`potentialGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b40" />
              <stop offset="100%" stopColor="#64748b20" />
            </linearGradient>
          </defs>

          {/* Background ring showing full potential */}
          <circle
            cx={containerSize / 2}
            cy={containerSize / 2}
            r={(containerSize - strokeWidth) / 2}
            fill="none"
            stroke="rgba(100,116,139,0.15)"
            strokeWidth={strokeWidth * 0.8}
            strokeDasharray={`${circumference * 0.722} ${circumference * 0.278}`}
            strokeDashoffset={circumference * 0.361}
            transform={`rotate(-90 ${containerSize / 2} ${containerSize / 2})`}
          />

          {/* Potential speed indicator (what Mac COULD achieve) */}
          <circle
            cx={containerSize / 2}
            cy={containerSize / 2}
            r={(containerSize - strokeWidth) / 2}
            fill="none"
            stroke="url(#potentialGradient-${size})"
            strokeWidth={strokeWidth * 0.3}
            strokeLinecap="round"
            strokeDasharray={`${potentialProgressLength} ${circumference - potentialProgressLength}`}
            strokeDashoffset={circumference * 0.361}
            transform={`rotate(-90 ${containerSize / 2} ${containerSize / 2})`}
            style={{
              transition: 'all 1s ease-out',
              opacity: 0.7
            }}
          />

          {/* Current speed bar - shows actual performance */}
          <circle
            cx={containerSize / 2}
            cy={containerSize / 2}
            r={(containerSize - strokeWidth) / 2}
            fill="none"
            stroke="url(#currentGradient-${size})"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${currentProgressLength} ${circumference - currentProgressLength}`}
            strokeDashoffset={circumference * 0.361}
            transform={`rotate(-90 ${containerSize / 2} ${containerSize / 2})`}
            style={{
              transition: animationPhase === 'optimizing' ? 'all 0.3s ease-out' : 'all 1s ease-out',
              filter: `drop-shadow(0 4px 12px ${getSpeedColor()}40)`,
              animation: animationPhase === 'scanning' ? 'pulse 1s infinite' : 'none'
            }}
          />

          {/* Scanning pulse ring */}
          {animationPhase === 'scanning' && (
            <circle
              cx={containerSize / 2}
              cy={containerSize / 2}
              r={(containerSize - strokeWidth) / 2 + 20}
              fill="none"
              stroke={getSpeedColor()}
              strokeWidth="3"
              opacity="0.4"
              style={{
                animation: 'scanPulse 2s infinite'
              }}
            />
          )}
        </svg>

        {/* Center Display */}
        <div style={{
          position: 'absolute',
          inset: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translateY(10px)'
        }}>
          {/* Speed Number */}
          <div style={{ 
            fontSize: size === 'large' ? '88px' : '44px', 
            fontWeight: '800',
            color: getSpeedColor(),
            transition: 'color 0.5s ease',
            lineHeight: '1',
            textShadow: `0 0 20px ${getSpeedColor()}40`
          }}>
            {Math.round(currentSpeed)}
          </div>
          
          {/* Speed Label */}
          <div style={{ 
            fontSize: size === 'large' ? '20px' : '14px', 
            fontWeight: '600', 
            color: 'rgba(255, 255, 255, 0.8)', 
            marginTop: '-8px' 
          }}>
            % speed
          </div>
          
          {/* Potential Indicator */}
          <div style={{ 
            fontSize: size === 'large' ? '14px' : '12px', 
            fontWeight: '500', 
            color: 'rgba(255, 255, 255, 0.5)', 
            marginTop: '4px',
            opacity: potentialSpeed > currentSpeed + 10 ? 1 : 0,
            transition: 'opacity 0.5s ease'
          }}>
            {Math.round(potentialSpeed)}% possible
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div style={{ 
        marginTop: size === 'large' ? '32px' : '20px',
        minHeight: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          color: 'white', 
          fontSize: size === 'large' ? '18px' : '14px',
          fontWeight: '500',
          textAlign: 'center',
          lineHeight: '1.4',
          opacity: statusMessage ? 1 : 0.7,
          transition: 'opacity 0.3s ease'
        }}>
          {statusMessage}
        </div>
        
      </div>

      {/* Action Button - Always show, with different states */}
      <div style={{ 
        marginTop: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={handleScanPress}
          disabled={(isFree && remainingScans <= 0) || isScanning}
          style={{
            padding: size === 'large' ? '16px 32px' : '12px 24px',
            background: (isFree && remainingScans <= 0) || isScanning ? 
              'rgba(100, 116, 139, 0.3)' :
              'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: size === 'large' ? '16px' : '14px',
            fontWeight: '700',
            cursor: (isFree && remainingScans <= 0) || isScanning ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 32px rgba(114, 9, 183, 0.4)',
            transition: 'all 0.3s ease',
            opacity: (isFree && remainingScans <= 0) || isScanning ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isScanning ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              AI Scanning...
            </>
          ) : isFree && remainingScans <= 0 ? 
            'Upgrade for More Scans' :
            '⚡ Scan for Speed Issues'
          }
        </button>

        {/* Scan Count for Free Users - Moved under button */}
        {isFree && remainingScans > 0 && (
          <div style={{
            padding: '6px 12px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '500'
          }}>
            {remainingScans} scans remaining this month
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes scanPulse {
          0% { 
            transform: scale(1);
            opacity: 0.4; 
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.2; 
          }
          100% { 
            transform: scale(1.2);
            opacity: 0; 
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

export default SpeedDial;
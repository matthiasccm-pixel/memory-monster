import React, { useState, useEffect } from 'react';

const SpeedDial = ({
  currentSpeed = 24,
  onScanComplete = () => {},
  className = "",
  size = 'large'
}) => {
  // LOCKED ANIMATION STATE - Only runs once, never resets
  const [isAnimationComplete, setIsAnimationComplete] = useState(() => {
    return sessionStorage.getItem('speedDial_completed') === 'true';
  });
  
  const [displaySpeed, setDisplaySpeed] = useState(() => {
    return sessionStorage.getItem('speedDial_completed') === 'true' ? 26 : 0;
  });
  
  const [animationPhase, setAnimationPhase] = useState(() => {
    return sessionStorage.getItem('speedDial_completed') === 'true' ? 'completed' : 'waiting';
  });
  
  const [showStatusText, setShowStatusText] = useState(() => {
    return sessionStorage.getItem('speedDial_completed') === 'true';
  });
  
  const [statusMessage, setStatusMessage] = useState(() => {
    return sessionStorage.getItem('speedDial_completed') === 'true' 
      ? "Oh dear, your Mac could be 85% faster..." 
      : "";
  });
  
  const [showMissingSpeed, setShowMissingSpeed] = useState(() => {
    return sessionStorage.getItem('speedDial_completed') === 'true';
  });

  const containerSize = size === 'large' ? 500 : 250;
  const strokeWidth = size === 'large' ? 60 : 30;

  // SINGLE ANIMATION SEQUENCE - Only runs once ever
  useEffect(() => {
    if (isAnimationComplete) return; // NEVER animate if already complete
    
    // Start the one-time animation sequence
    setAnimationPhase('startup');
    
    let progress = 0;
    const startupInterval = setInterval(() => {
      progress += 1.3;
      
      if (progress <= 62) {
        setDisplaySpeed((progress / 62) * 100);
      } else if (progress <= 124) {
        setDisplaySpeed(((124 - progress) / 62) * 100);
      } else {
        clearInterval(startupInterval);
        setDisplaySpeed(0);
        
        // Phase 2: Show first message and settle
        setTimeout(() => {
          setStatusMessage("Alright, let's test this bad boy");
          setShowStatusText(true);
          
          // Phase 3: Settling animation
          setTimeout(() => {
            setAnimationPhase('settling');
            let settleProgress = 0;
            const settlingInterval = setInterval(() => {
              settleProgress += 1.5;
              const baseSpeed = 24 + Math.random() * 6; // 24-30% range
              const smoothedSpeed = (settleProgress / 100) * baseSpeed;
              setDisplaySpeed(Math.min(baseSpeed, smoothedSpeed));
              
              if (settleProgress >= 100) {
                clearInterval(settlingInterval);
                setAnimationPhase('hovering');
                
                // Start continuous elegant twitching immediately
                const startContinuousTwitching = () => {
                  const twitchInterval = setInterval(() => {
                    if (isAnimationComplete) {
                      clearInterval(twitchInterval);
                      return;
                    }
                    const baseSpeed = 24 + Math.random() * 6; // 24-30% range
                    const twitchAmount = (Math.random() - 0.5) * 1.5; // ±0.75% smooth twitch
                    const newSpeed = Math.max(22, Math.min(30, baseSpeed + twitchAmount));
                    setDisplaySpeed(newSpeed);
                  }, 800 + Math.random() * 600); // 800-1400ms intervals for elegance
                  
                  return twitchInterval;
                };
                
                const twitchInterval = startContinuousTwitching();
                
                // Messages run independently of twitching
                setTimeout(() => {
                  setStatusMessage("Yikes! Your Mac Is Struggling...");
                  setTimeout(() => {
                    setStatusMessage("Oh dear, your Mac could be 85% faster...");
                    setShowMissingSpeed(true);
                    
                    setTimeout(() => {
                      // LOCK THE ANIMATION AS COMPLETE  
                      setTimeout(() => {
                        clearInterval(twitchInterval); // Stop twitching
                        setIsAnimationComplete(true);
                        setDisplaySpeed(26); // Final locked speed
                        setAnimationPhase('completed');
                        sessionStorage.setItem('speedDial_completed', 'true');
                        onScanComplete(); // This triggers the button!
                      }, 1000);
                    }, 2000);
                  }, 1500);
                }, 200);
              }
            }, 50);
          }, 500);
        }, 500);
      }
    }, 55);

    return () => clearInterval(startupInterval);
  }, []); // Empty dependency array - only runs once ever

  // Gentle hovering for completed state only
  useEffect(() => {
    if (animationPhase !== 'completed') return;
    
    const hoverInterval = setInterval(() => {
      const baseSpeed = 24 + Math.random() * 6; // 24-30% range
      const twitchAmount = (Math.random() - 0.5) * 2; // ±1% twitch
      setDisplaySpeed(Math.max(22, Math.min(30, baseSpeed + twitchAmount)));
    }, 1200 + Math.random() * 800);

    return () => clearInterval(hoverInterval);
  }, [animationPhase]);

  // Force onScanComplete if animation was already completed
useEffect(() => {
  if (isAnimationComplete && onScanComplete) {
    console.log('🔄 Animation already complete, calling onScanComplete');
    onScanComplete();
  }
}, [isAnimationComplete, onScanComplete]);

  // Calculate progress bar fill - FIXED to match background ring
  const circumference = 2 * Math.PI * ((containerSize - strokeWidth) / 2);
  const maxArcDegrees = 260; // Our background ring is 260 degrees (0.722 * 360)
  const progressDegrees = (displaySpeed / 100) * maxArcDegrees; // Scale to our actual arc length
  const progressLength = (progressDegrees / 360) * circumference;

  return (
    <div style={{ position: 'relative', textAlign: 'center', ...className }}>
      {/* Main Speedometer Container */}
      <div style={{ 
        position: 'relative', 
        width: `${containerSize}px`, 
        height: `${containerSize}px`, 
        margin: '0 auto' 
      }}>
        {/* SVG Speedometer - FIXED: Proper 9 to 3 o'clock horizontal orientation */}
        <svg
          width={containerSize}
          height={containerSize}
        >
          <defs>
            <linearGradient id={`progressGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5A96" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
            <linearGradient id={`missingGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Background ring - FIXED: Half circle from 8 to 4 */}
          <circle
            cx={containerSize / 2}
            cy={containerSize / 2}
            r={(containerSize - strokeWidth) / 2}
            fill="none"
            stroke="rgba(168,85,247,0.1)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.722} ${circumference * 0.278}`}
            strokeDashoffset={circumference * 0.361}
            transform={`rotate(-90 ${containerSize / 2} ${containerSize / 2})`}
          />

          {/* Missing speed background bar - red/orange gradient - UNDERNEATH purple bar */}
          {showMissingSpeed && (
            <circle
              cx={containerSize / 2}
              cy={containerSize / 2}
              r={(containerSize - strokeWidth) / 2}
              fill="none"
              stroke={`url(#missingGradient-${size})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray="0 999"
              strokeDashoffset={circumference * 0.0}
              transform={`rotate(-90 ${containerSize / 2} ${containerSize / 2})`}
              style={{
                opacity: showMissingSpeed ? 1 : 0,
                animation: showMissingSpeed ? 'redBarFill 2s ease-out forwards' : 'none'
              }}
            />
          )}

          {/* Progress ring - FIXED: Starts at 9 o'clock */}
          <circle
            cx={containerSize / 2}
            cy={containerSize / 2}
            r={(containerSize - strokeWidth) / 2}
            fill="none"
            stroke={`url(#progressGradient-${size})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${progressLength} ${circumference - progressLength}`}
            strokeDashoffset={circumference * 0.361}
            transform={`rotate(-90 ${containerSize / 2} ${containerSize / 2})`}
            style={{
              transition: isAnimationComplete ? 'none' : 'all 0.8s ease-out',
              filter: 'drop-shadow(0 4px 8px rgba(168,85,247,0.3))'
            }}
          />
        </svg>

        {/* Center Speed Display */}
        <div style={{
          position: 'absolute',
          inset: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translateY(10px)'
        }}>
          <div style={{ 
            fontSize: size === 'large' ? '96px' : '48px', 
            fontWeight: '700',
            color: '#A855F7',
            transition: 'none',
            lineHeight: '1'
          }}>
            {Math.round(displaySpeed)}
          </div>
          <div style={{ 
            fontSize: size === 'large' ? '24px' : '16px', 
            fontWeight: '600', 
            color: '#A855F7', 
            marginTop: '-8px' 
          }}>
            % speed
          </div>
        </div>
      </div>

      {/* Status Text - RESTORED with cycling */}
      {showStatusText && (
        <div style={{ 
          marginTop: '-60px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ 
            color: 'white', 
            fontSize: size === 'large' ? '20px' : '16px',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            {statusMessage}
          </div>
        </div>
      )}

      {/* Scanning Status */}
      {false && ( // Removed isScanning prop dependency
        <div style={{ 
          marginTop: '20px',
          color: '#7209b7', 
          fontSize: size === 'large' ? '20px' : '16px',
          fontWeight: '600' 
        }}>
          Analyzing performance...
        </div>
      )}
    </div>
  );
};

export default SpeedDial;
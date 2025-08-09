
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, AlertTriangle, Zap, Sparkles, Shield, Send, Users, TrendingUp, Heart, Star, Activity, Clock, Cpu, Swords, Settings, User, X, Lock, Bell, HardDrive, Crown, RotateCcw, FileText, ExternalLink, HelpCircle } from 'lucide-react';



// ===== TRULY PERSISTENT FLAGS USING SESSIONSTORAGE =====

const MacOptimizerApp = () => {
// ===== ALL STATE VARIABLES =====
const [isLoading, setIsLoading] = useState(true);
const [loadingMessage, setLoadingMessage] = useState('');
const [currentView, setCurrentView] = useState('userType'); // New flow: userType → appShowcase → diskAccess → accessGranted → dashboard → activatePlan → scanning
const [diskAccessGranted, setDiskAccessGranted] = useState(false);
const [speedDialScanning, setSpeedDialScanning] = useState(false);
const [currentSpeed, setCurrentSpeed] = useState(24);
const [dashboardLayout, setDashboardLayout] = useState('center'); // 'center' or 'split'
// Two completely separate modal systems
const [showWelcomeModal, setShowWelcomeModal] = useState(false);
const [showActivationModal, setShowActivationModal] = useState(false);
const [dashboardWelcomeShown, setDashboardWelcomeShown] = useState(false);
const [activationReminderShown, setActivationReminderShown] = useState(false);
// NEW: Track if user has completed first memory fix for stats visibility
const [hasCompletedFirstFix, setHasCompletedFirstFix] = useState(false);
// Removed modalTimerRef state - using direct timer reference instead
const [isScanning, setIsScanning] = useState(false);
const [scanComplete, setScanComplete] = useState(false);
const [fixingStates, setFixingStates] = useState({});
const [minimizedIssues, setMinimizedIssues] = useState({}); // Track which issues are minimized
const [userInput, setUserInput] = useState('');
const [totalMemoryFreed, setTotalMemoryFreed] = useState(0);
const [remainingMemory, setRemainingMemory] = useState(0);
const [animatingMemory, setAnimatingMemory] = useState(0);
const [showConfetti, setShowConfetti] = useState(false);
const [currentCommunityIndex, setCurrentCommunityIndex] = useState(0);
// Settings state variables
const [autoScanWeekly, setAutoScanWeekly] = useState(true);
const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);
const [memoryAlerts, setMemoryAlerts] = useState(true);
const [autoMinimize, setAutoMinimize] = useState(true);
const [backgroundLiberation, setBackgroundLiberation] = useState(false);
const [scanIntensity, setScanIntensity] = useState('Normal');
const [startAtLogin, setStartAtLogin] = useState(true);
const [keepRunning, setKeepRunning] = useState(true);
const [showInMenuBar, setShowInMenuBar] = useState(true);
const [autoUpdate, setAutoUpdate] = useState(true);
const [theme, setTheme] = useState('Auto');
const [successNotifications, setSuccessNotifications] = useState(true);
const [weeklyReports, setWeeklyReports] = useState(true);
const [monsterAlerts, setMonsterAlerts] = useState(true);
const [tips, setTips] = useState(true);
const [deepScanning, setDeepScanning] = useState(false);
const [monitorExternal, setMonitorExternal] = useState(true);
const [analytics, setAnalytics] = useState(true);
const [atlasMessages, setAtlasMessages] = useState([
  "Hey there! I'm Byte, your Memory Hunter companion. I've been scanning your system and spotted some memory monsters holding your RAM hostage. Ready to free that memory together? ⚔️"
]);
  const messagesEndRef = useRef(null);
  // FIXED: Prevent modal from re-showing

  // Loading messages
  const loadingMessages = [
    "Powering up memory liberation systems...",
    "Calibrating monster detection algorithms...",
    "Loading memory rescue protocols...",
    "Preparing to free trapped memory...",
    "Getting ready to save your Mac...",
    "Memory monsters beware - liberation incoming!",
    "Initializing freedom protocols...",
    "Ready to reclaim your memory!"
  ];

  // Community users data
  const communityUsers = [
    { user: "Sarah C", action: "freed memory from Spotify", time: "2 min ago", avatar: "👩🏻‍💻", savings: "12.3GB", userCount: "12,429", totalFreed: "847TB" },
    { user: "Marcus R", action: "liberated Chrome processes", time: "4 min ago", avatar: "👨🏽‍💼", savings: "1.7GB", userCount: "8,924", totalFreed: "156TB" },
    { user: "Emma T", action: "rescued WhatsApp media", time: "7 min ago", avatar: "👩🏾‍🎨", savings: "8.1GB", userCount: "15,883", totalFreed: "1.2PB" },
    { user: "Alex K", action: "freed system memory", time: "11 min ago", avatar: "👨🏻‍🔬", savings: "1.9GB", userCount: "6,742", totalFreed: "89TB" },
    { user: "Lisa M", action: "liberated Zoom cache", time: "15 min ago", avatar: "👩🏼‍🏫", savings: "3.2GB", userCount: "9,156", totalFreed: "234TB" },
    { user: "David L", action: "freed Teams data", time: "18 min ago", avatar: "👨🏾‍💻", savings: "2.8GB", userCount: "7,329", totalFreed: "178TB" },
    { user: "Maria S", action: "rescued Safari cache", time: "22 min ago", avatar: "👩🏽‍🔬", savings: "4.5GB", userCount: "11,847", totalFreed: "445TB" },
    { user: "Tom W", action: "liberated Photoshop temp", time: "25 min ago", avatar: "👨🏻‍🎨", savings: "6.7GB", userCount: "5,438", totalFreed: "298TB" }
  ];
  
  // Memory issues - UPDATED WITH APP NAMES
  const [issues, setIssues] = useState([
    {
      id: 1,
      app: "WhatsApp", 
      title: "WhatsApp",
      description: "This popular messaging app has imprisoned 11.9GB of photos, videos, and documents in its cache system",
      storage: 11.9,
      storageUnit: "GB",
      severity: "critical",
      fixed: false,
      userCount: "15,883",
      totalFreed: "1.2PB",
      fileCount: "12,847 cached files",
      lastOptimized: "Never"
    },
    {
      id: 2,
      app: "Spotify",
      title: "Spotify", 
      description: "The music streaming giant is hoarding your storage with downloaded tracks and album artwork",
      storage: 9.5,
      storageUnit: "GB", 
      severity: "high",
      fixed: false,
      userCount: "12,429",
      totalFreed: "847TB",
      fileCount: "3,291 cached tracks",
      lastOptimized: "6 months ago"
    },
    {
      id: 3,
      app: "Chrome",
      title: "Chrome",
      description: "Google's browser is spawning multiple processes that devour your precious RAM and slow performance",
      storage: 1.7,
      storageUnit: "GB",
      severity: "medium", 
      fixed: false,
      userCount: "8,924",
      totalFreed: "156TB",
      processCount: "47 active processes",
      lastOptimized: "2 weeks ago"
    }
  ]);
// Calculate initial remaining memory from issues
useEffect(() => {
  const totalIssuesMemory = issues.reduce((sum, issue) => sum + issue.storage, 0);
  const newRemainingMemory = totalIssuesMemory - totalMemoryFreed;
  setRemainingMemory(newRemainingMemory);
  setAnimatingMemory(newRemainingMemory);
}, [issues, totalMemoryFreed]);
  const [systemHealth] = useState({
    cpu: { usage: 23, temp: 45, efficiency: 94 },
    memory: { usage: 78, pressure: "Medium", available: "6.2GB" },
    storage: { available: "156GB", total: "512GB", usage: 69 },
    battery: { health: 87, cycles: 342, timeRemaining: "4h 23m" }
  });
// ===== FIREFOX LOGO COMPONENT =====
 const FirefoxLogo = ({ size = 32 }) => (
   <svg width={size} height={size} viewBox="0 0 100 100">
     <defs>
       <radialGradient id="firefox-orange" cx="50%" cy="30%">
         <stop offset="0%" stopColor="#ff9500" />
         <stop offset="50%" stopColor="#ff6900" />
         <stop offset="100%" stopColor="#ff3300" />
       </radialGradient>
       <radialGradient id="firefox-yellow" cx="30%" cy="20%">
         <stop offset="0%" stopColor="#ffdc00" />
         <stop offset="50%" stopColor="#ff9500" />
         <stop offset="100%" stopColor="#ff6900" />
       </radialGradient>
       <radialGradient id="firefox-purple" cx="70%" cy="40%">
         <stop offset="0%" stopColor="#9059ff" />
         <stop offset="50%" stopColor="#722ed1" />
         <stop offset="100%" stopColor="#531dab" />
       </radialGradient>
     </defs>
     
     <circle cx="50" cy="50" r="45" fill="url(#firefox-orange)" />
     <path d="M25 35 Q40 15 65 25 Q75 35 70 50 Q65 60 50 65 Q35 60 30 45 Q25 40 25 35 Z" 
           fill="url(#firefox-yellow)" opacity="0.9" />
     <path d="M60 30 Q75 25 80 40 Q85 55 75 65 Q65 70 55 60 Q50 50 55 40 Q58 35 60 30 Z" 
           fill="url(#firefox-purple)" opacity="0.7" />
     <path d="M35 40 Q50 30 65 45 Q70 55 60 65 Q45 70 35 55 Q30 45 35 40 Z" 
           fill="url(#firefox-yellow)" opacity="0.8" />
     <path d="M20 60 Q30 50 45 55 Q55 60 50 70 Q40 75 30 70 Q20 65 20 60 Z" 
           fill="url(#firefox-orange)" opacity="0.9" />
   </svg>
 );

 // ===== SPEED DIAL COMPONENT =====
const SpeedDial = ({
  currentSpeed = 24,
  isScanning = false,
  onScanComplete = () => {},
  className = "",
  size = 'large',
  shouldAnimate = true
}) => {
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('waiting');
  const [showStatusText, setShowStatusText] = useState(false);
  const [showTargetIndicator, setShowTargetIndicator] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Your Mac looks like it's struggling...");

  const containerSize = size === 'large' ? 500 : 250;
  const strokeWidth = size === 'large' ? 60 : 30;

  // Only start animation when shouldAnimate becomes true
  useEffect(() => {
    if (shouldAnimate && animationPhase === 'waiting') {
      setAnimationPhase('startup');
    }
  }, [shouldAnimate, animationPhase]);

  // Startup sequence animation - RESTORED
  useEffect(() => {
    if (!isScanning && animationPhase === 'startup') {
      let progress = 0;
      const startupInterval = setInterval(() => {
        progress += 2.5; // 40 steps = 2 seconds at 50ms intervals
        
        if (progress <= 50) {
          // Rising to 100%
          setDisplaySpeed((progress / 50) * 100);
        } else if (progress <= 100) {
          // Falling back to 0%
          setDisplaySpeed(((100 - progress) / 50) * 100);
        } else {
          clearInterval(startupInterval);
          setDisplaySpeed(0);
          
          // Phase 2: Wait 0.5 seconds
          setTimeout(() => {
            setAnimationPhase('settling');
          }, 500);
        }
      }, 50);

      return () => clearInterval(startupInterval);
    }
  }, [animationPhase, isScanning]);

  // Settling to hover state - RESTORED
  useEffect(() => {
    if (!isScanning && animationPhase === 'settling') {
      let progress = 0;
      const settlingInterval = setInterval(() => {
        progress += 2; // 50 steps = 2 seconds at 40ms intervals
        const targetSpeed = 22 + Math.random() * 8; // 22-30% range
        setDisplaySpeed((progress / 100) * targetSpeed);
        
        if (progress >= 100) {
clearInterval(settlingInterval);
setAnimationPhase('hovering');

// Show FIRST message immediately after settling
setTimeout(() => {
setShowStatusText(true);
// Keep the struggling message for a bit, then show target indicator
setTimeout(() => {
setShowTargetIndicator(true);
// THEN change message after target appears
setTimeout(() => {
setStatusMessage("Your Speed Could be at 84%");
}, 1000);
}, 2000); // Increased delay so struggling message shows longer
}, 200);
}
      }, 40);

      return () => clearInterval(settlingInterval);
    }
  }, [animationPhase, isScanning]);

  // Hovering/twitching animation - RESTORED
  useEffect(() => {
    if (!isScanning && animationPhase === 'hovering') {
      const hoverInterval = setInterval(() => {
        const baseSpeed = 22 + Math.random() * 8; // 22-30% range
        const twitchAmount = (Math.random() - 0.5) * 4; // ±2% twitch
        setDisplaySpeed(Math.max(20, Math.min(32, baseSpeed + twitchAmount)));
      }, 800 + Math.random() * 400); // Irregular timing

      return () => clearInterval(hoverInterval);
    }
  }, [animationPhase, isScanning]);

  // Scanning animation - RESTORED
  useEffect(() => {
    if (isScanning) {
      setAnimationPhase('scanning');
      let progress = 0;
      const scanInterval = setInterval(() => {
        progress += 0.5;
        const revSpeed = 30 + Math.sin(progress * 0.3) * 25 + Math.random() * 20;
        setDisplaySpeed(Math.max(20, Math.min(90, revSpeed)));
        
        if (progress >= 100) {
          clearInterval(scanInterval);
          setTimeout(() => {
            setDisplaySpeed(currentSpeed);
            onScanComplete();
          }, 500);
        }
      }, 60);

      return () => clearInterval(scanInterval);
    }
  }, [isScanning, currentSpeed, onScanComplete]);

 // Calculate progress bar fill - FIXED to match background ring
const circumference = 2 * Math.PI * ((containerSize - strokeWidth) / 2);
const maxArcDegrees = 260; // Our background ring is 260 degrees (0.722 * 360)
const progressDegrees = (displaySpeed / 100) * maxArcDegrees; // Scale to our actual arc length
const progressLength = (progressDegrees / 360) * circumference;

// Calculate target position for 84% indicator - FIXED to match background ring exactly
const backgroundStartAngle = -90 - (maxArcDegrees / 2); // Background ring starts here
const targetAngleAlongArc = backgroundStartAngle + (84 / 100) * maxArcDegrees; // 84% along the background ring
const targetRadians = (targetAngleAlongArc * Math.PI) / 180;
const radius = (containerSize - strokeWidth) / 2;
const targetX = containerSize / 2 + radius * Math.cos(targetRadians);
const targetY = containerSize / 2 + radius * Math.sin(targetRadians);

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
transition: animationPhase === 'hovering' ? 'all 0.8s ease-out' : 'all 0.1s ease',
filter: 'drop-shadow(0 4px 8px rgba(168,85,247,0.3))'
}}
/>

  {showTargetIndicator && (
<g>
<defs>
<linearGradient id={`targetGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" stopColor="#3b82f6" />
<stop offset="50%" stopColor="#10b981" />
<stop offset="100%" stopColor="#3b82f6" />
</linearGradient>
</defs>
{/* Chunky pulsing line indicator - FIXED POSITION */}
<line
x1={containerSize / 2 + (radius - 40) * Math.cos(targetRadians)}
y1={containerSize / 2 + (radius - 40) * Math.sin(targetRadians)}
x2={containerSize / 2 + (radius + 40) * Math.cos(targetRadians)}
y2={containerSize / 2 + (radius + 40) * Math.sin(targetRadians)}
stroke={`url(#targetGradient-${size})`}
strokeWidth="12"
strokeLinecap="round"
style={{
filter: 'drop-shadow(0 0 16px rgba(16, 185, 129, 0.6))',
opacity: '1'
}}
>
<animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
</line>
</g>
)}
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
            transition: animationPhase === 'hovering' ? 'all 0.8s ease-out' : 'all 0.1s ease',
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
      {showStatusText && !isScanning && (
        <div style={{ 
          marginTop: '-60px',
          animation: 'fadeIn 0.5s ease-out',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div 
            key={statusMessage}
            style={{ 
              color: 'white', 
              fontSize: size === 'large' ? '20px' : '16px',
              fontWeight: '500',
              animation: 'fadeIn 0.5s ease-out',
              textAlign: 'center'
            }}
          >
            {statusMessage}
          </div>
        </div>
      )}

      {/* Scanning Status */}
      {isScanning && (
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

 // ===== APP LOGOS =====
 const AppLogo = ({ app, size = 48 }) => {
   const logoComponents = {
     WhatsApp: () => (
       <svg width={size} height={size} viewBox="0 0 100 100">
         <circle cx="50" cy="50" r="45" fill="#25D366"/>
         <path d="M30 65 Q30 35 50 35 Q70 35 70 50 Q70 65 50 65 L30 65 Z" fill="white"/>
         <circle cx="40" cy="45" r="2" fill="#25D366"/>
         <circle cx="50" cy="45" r="2" fill="#25D366"/>
         <circle cx="60" cy="45" r="2" fill="#25D366"/>
         <path d="M30 65 L25 70 L30 65" fill="#25D366"/>
       </svg>
     ),
     
     Spotify: () => (
       <svg width={size} height={size} viewBox="0 0 100 100">
         <circle cx="50" cy="50" r="45" fill="#1DB954"/>
         <path d="M25 30 Q50 20 75 30" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
         <path d="M30 42 Q50 35 70 42" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
         <path d="M35 54 Q50 49 65 54" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
       </svg>
     ),
     
     Chrome: () => (
       <svg width={size} height={size} viewBox="0 0 100 100">
         <circle cx="50" cy="50" r="45" fill="white"/>
         <circle cx="50" cy="50" r="40" fill="#4285F4"/>
         <circle cx="50" cy="50" r="30" fill="#34A853"/>
         <circle cx="50" cy="50" r="20" fill="#EA4335"/>
         <circle cx="50" cy="50" r="10" fill="#FBBC05"/>
         <circle cx="50" cy="50" r="6" fill="white"/>
       </svg>
     )
    };

   const LogoComponent = logoComponents[app];
   
   return LogoComponent ? (
     <div style={{
       width: size,
       height: size,
       borderRadius: '12px',
       boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
       overflow: 'hidden',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center'
     }}>
       <LogoComponent />
     </div>
   ) : (
     <div style={{ 
       width: size,
       height: size,
       background: '#6b7280',
       borderRadius: '12px',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
       fontSize: size * 0.4,
       color: 'white',
       fontWeight: 'bold',
       boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
     }}>
       {app[0]}
     </div>
   );
 };

 // ===== TRULY PERSISTENT FLAGS USING SESSIONSTORAGE =====
const getSessionFlag = (key) => sessionStorage.getItem(key) === 'true';
const setSessionFlag = (key) => sessionStorage.setItem(key, 'true');

const OneTimeTickerNumber = ({ value, suffix = '', style = {}, id = 'ticker' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const flagKey = `animated_${id}`;

  // Add comma formatting function
  const formatNumber = (num) => {
    // For TB values, show abbreviated form during counting
    if (value >= 1000 && suffix === 'TB') {
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      if (num >= 100) return Math.floor(num).toLocaleString();
      return num.toFixed(1);
    }
    
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num.toFixed(value < 10 ? 1 : 0);
  };

  useEffect(() => {
  if (!getSessionFlag(flagKey) && value > 0) {
    setSessionFlag(flagKey);
    let step = 0;
    const totalSteps = 90; // Much longer for enjoyment
    
    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      
      // Smoother easing with gentle acceleration then deceleration
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const current = value * easeInOutCubic;
      
      if (step >= totalSteps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, 50); // Smoother intervals
  } else if (getSessionFlag(flagKey)) {
    setDisplayValue(value);
  }
}, [value, flagKey]);

  return (
    <div style={style}>
      {displayValue === value ? 
        // Final display with comma
        value.toLocaleString() + suffix :
        // Animated display with abbreviation
        formatNumber(displayValue) + (value >= 1000 && suffix === 'TB' ? 'TB' : suffix)
      }
    </div>
  );
};
const OneTimeAbbreviatedTicker = ({ targetValue, targetDisplay, style = {}, id = 'abbrevTicker' }) => {
  const [displayValue, setDisplayValue] = useState('');
  const flagKey = `animated_${id}`;

  const formatAbbreviated = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(0) + 'B';
    if (num >= 1000000) return Math.floor(num / 1000000) + 'M';
    if (num >= 1000) return Math.floor(num / 1000) + 'K';
    return Math.floor(num).toString();
  };

  useEffect(() => {
    if (!getSessionFlag(flagKey) && targetValue > 0) {
      setSessionFlag(flagKey);
      
      // Start from 50% of target value for realistic counting
      let current = targetValue * 0.5;
      let step = 0;
      const totalSteps = 60; // Same as main ticker for consistency
      
      const timer = setInterval(() => {
        step++;
        const progress = step / totalSteps;
        
        // Enhanced easing - much more pronounced slowdown
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        current = (targetValue * 0.5) + (targetValue * 0.5 * easeOutQuart);
        
        if (step >= totalSteps) {
          setDisplayValue(targetDisplay); // Show final abbreviated form
          clearInterval(timer);
        } else {
          setDisplayValue(formatAbbreviated(current));
        }
      }, 70); // 15% slower as requested
    } else if (getSessionFlag(flagKey)) {
      setDisplayValue(targetDisplay);
    }
  }, [targetValue, targetDisplay, flagKey]);

  return (
    <div style={style}>
      {displayValue}
    </div>
  );
};

// ===== SETTING ROW COMPONENT =====
const SettingRow = ({ title, description, checked, onChange, isPremium = false }) => {
  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <label style={{
      position: 'relative',
      display: 'inline-block',
      width: '48px',
      height: '28px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{ opacity: 0, width: 0, height: 0 }}
      />
      <span style={{
        position: 'absolute',
        cursor: disabled ? 'not-allowed' : 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: checked ? '#7209b7' : 'rgba(107, 114, 128, 0.3)',
        transition: 'all 0.3s ease',
        borderRadius: '28px',
        boxShadow: checked ? '0 4px 12px rgba(114, 9, 183, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          position: 'absolute',
          height: '20px',
          width: '20px',
          left: checked ? '24px' : '4px',
          bottom: '4px',
          backgroundColor: 'white',
          transition: 'all 0.3s ease',
          borderRadius: '50%',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }} />
      </span>
    </label>
  );

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '16px 0',
      borderBottom: '1px solid rgba(107, 114, 128, 0.1)',
      opacity: isPremium && !checked ? 0.6 : 1
    }}>
      <div style={{ flex: 1, paddingRight: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            {title}
          </div>
          {isPremium && (
<div style={{
background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
color: 'white',
fontSize: '10px',
fontWeight: '700',
padding: '2px 6px',
borderRadius: '4px',
textTransform: 'uppercase',
letterSpacing: '0.5px'
}}>
PRO
</div>
)}
        </div>
        <div style={{
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: '1.4'
        }}>
          {description}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>
        <ToggleSwitch 
          checked={checked} 
          onChange={onChange} 
          disabled={isPremium && !checked}
        />
      </div>
    </div>
  );
};
// ===== GLOBAL STATS MODULE =====
const MyStatsSidebar = () => {
  const showGlobal = currentView === 'dashboard';
  
  if (showGlobal) {
    // GLOBAL STATS VIEW (Dashboard) - With working tickers
    return (
      <div style={{
        padding: '24px',
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)`,
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `conic-gradient(from 0deg, rgba(114, 9, 183, 0.1), rgba(83, 52, 131, 0.05), rgba(15, 52, 96, 0.03), rgba(114, 9, 183, 0.1))`,
          opacity: 0.6
        }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌍</div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Memory Monster Community</div>
          {/* FIXED: Main animated number with unique ID per view */}
          <OneTimeTickerNumber
            value={2847}
            suffix="TB"
            id={`mainTicker_${currentView}`}
            style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '800',
              marginBottom: '4px',
              fontFamily: 'SF Mono, Consolas, monospace'
            }}
          />
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', fontWeight: '500', marginBottom: '16px' }}>Freed Today</div>
          {/* FIXED: Sub-stats with unique IDs per view */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '6px 8px',
              flex: 1
            }}>
              <OneTimeAbbreviatedTicker
                targetValue={1000000000}
                targetDisplay="1B+"
                id={`scansCounter_${currentView}`}
                style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}
              />
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '9px' }}>Scans Today</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '6px 8px',
              flex: 1
            }}>
              <OneTimeAbbreviatedTicker
                targetValue={500000}
                targetDisplay="500K+"
                id={`activeCounter_${currentView}`}
                style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}
              />
              <div style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '4px',
                  height: '4px',
                  background: '#10b981',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px #10b981, 0 0 12px rgba(16, 185, 129, 0.5)',
                  animation: 'pulse 2s ease-in-out infinite'
                }}></div>
                Active Today
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PERSONAL STATS VIEW (Scanning) - With live updating counter
return (
<div style={{
padding: '24px',
background: `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)`,
borderRadius: '20px',
border: '1px solid rgba(255, 255, 255, 0.18)',
textAlign: 'center',
position: 'relative',
overflow: 'hidden'
}}>
<div style={{ position: 'relative', zIndex: 2 }}>
<div style={{ fontSize: '32px', marginBottom: '12px' }}>👤</div>
<div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Your Stats</div>
<div style={{
color: 'white',
fontSize: '18px',
fontWeight: '800',
marginBottom: '4px',
fontFamily: 'SF Mono, Consolas, monospace'
}}>
{totalMemoryFreed.toFixed(1)}GB
</div>
<div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', fontWeight: '500', marginBottom: '16px' }}>Memory Saved</div>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<div>
<div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>1st</div>
<div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>Scan</div>
</div>
<div>
<div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>New</div>
<div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>User</div>
</div>
<div>
<div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>
{issues.filter(i => i.fixed).length} / {issues.length}
</div>
<div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>Issues Solved</div>
</div>
</div>
</div>
</div>
);
};

 // ===== FIXED CAROUSEL - PROPER CYCLING & SPEED =====
const AppCarousel = () => {
  const [offset, setOffset] = useState(0);
  const apps = [
    { name: 'Photoshop', logo: 'photoshop' },    // P
    { name: 'Teams', logo: 'teams' },            // T  
    { name: 'Safari', logo: 'safari' },          // S
    { name: 'Spotify', logo: 'Spotify' },        // S
    { name: 'Chrome', logo: 'Chrome' },          // C
    { name: 'WhatsApp', logo: 'WhatsApp' },      // W
    { name: 'Dropbox', logo: 'dropbox' },        // D
    { name: 'Slack', logo: 'slack' }             // S
  ];

  // Smooth continuous movement
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => prev + 0.015); // Slightly slower for smoother feel
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const getVisibleApps = () => {
    const visible = [];
    // Show 7 apps (3 on each side + center)
    for (let i = -3; i <= 3; i++) {
      const index = Math.floor((offset + i) + apps.length * 100) % apps.length;
      const position = i - (offset % 1);
      
      visible.push({
        ...apps[index],
        position,
        key: `${index}-${Math.floor(offset * 100)}-${i}` // Unique key
      });
    }
    return visible;
  };

  const getTransform = (position) => {
    const angle = position * 15; // Slightly tighter spacing
    const radius = 180;
    const absPos = Math.abs(position);
    
    // Smooth scaling
    let scale;
    if (absPos < 0.5) scale = 1.4 - (absPos * 0.5);
    else if (absPos < 1.5) scale = 1.15 - ((absPos - 0.5) * 0.25);
    else if (absPos < 2.5) scale = 0.9 - ((absPos - 1.5) * 0.15);
    else scale = 0.75;

    const opacity = absPos < 0.5 ? 1 : Math.max(0.4, 1 - absPos * 0.2);
    
    const x = Math.sin((angle * Math.PI) / 180) * radius;
    const y = -Math.cos((angle * Math.PI) / 180) * 20 + 20;
    const rotateY = -angle * 0.3;

    return {
      transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotateY(${rotateY}deg)`,
      opacity,
      zIndex: Math.round(20 - absPos * 3),
      transition: 'none'
    };
  };

  // Get current center app
  const currentCenterIndex = Math.floor(offset) % apps.length;
  const centerApp = apps[currentCenterIndex];

  return (
    <div style={{ position: 'relative', width: '100%', height: '220px' }}>
      <div style={{
        height: '160px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'visible',
        perspective: '1000px',
        padding: '20px 0'
      }}>
        {getVisibleApps().map((app) => (
          <div
            key={app.key}
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              ...getTransform(app.position)
            }}
          >
            <div style={{
              filter: Math.abs(app.position) < 0.5 ? 'drop-shadow(0 12px 32px rgba(114, 9, 183, 0.4))' : 'none'
            }}>
              <AppLogo
                app={app.logo}
                size={Math.abs(app.position) < 0.5 ? 85 : (Math.abs(app.position) < 1.5 ? 65 : 50)}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginTop: '10px',
        height: '40px'
      }}>
        <span style={{ color: '#7209b7', fontWeight: '700', fontSize: '14px' }}>
          Saving bloat from
        </span>
        <span style={{
          color: '#1f2937',
          fontWeight: '800',
          fontSize: '20px',
          textShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}>
          {centerApp.name}
        </span>
        <span style={{
          color: '#7209b7',
          fontWeight: '700',
          fontSize: '14px',
          background: 'rgba(114, 9, 183, 0.1)',
          padding: '4px 12px',
          borderRadius: '12px',
          border: '1px solid rgba(114, 9, 183, 0.2)'
        }}>
          & 250+ other apps
        </span>
      </div>
    </div>
  );
};

// ===== ONBOARDING SCREEN COMPONENTS =====
// App Showcase Screen
const AppShowcaseScreen = () => {
  const [selectedTypes, setSelectedTypes] = useState(() => {
    // Get selected types from localStorage or default to empty
    return JSON.parse(localStorage.getItem('selectedUserTypes') || '[]');
  });

  const userTypes = {
    creative: {
      title: 'Creative Pro',
      emoji: '🎨',
      apps: [
        { name: 'Photoshop', issues: ['Massive cache files', 'Background processing', 'Plugin memory leaks'] },
        { name: 'Figma', issues: ['Browser memory buildup', 'Component caching', 'Version history storage'] },
        { name: 'Final Cut Pro', issues: ['Render cache bloat', 'Timeline memory usage', 'Export temp files'] },
        { name: 'After Effects', issues: ['RAM preview buildup', 'Media cache explosion', 'Plugin overhead'] },
        { name: 'Sketch', issues: ['Symbol cache growth', 'Version file buildup', 'Plugin memory usage'] },
        { name: 'Lightroom', issues: ['Preview cache bloat', 'Catalog file growth', 'Import temp storage'] }
      ]
    },
    developer: {
      title: 'Developer',
      emoji: '👨‍💻',
      apps: [
        { name: 'VS Code', issues: ['Extension memory leaks', 'Language server overhead', 'Git cache buildup'] },
        { name: 'Xcode', issues: ['Derived data explosion', 'Simulator cache bloat', 'Build artifact storage'] },
        { name: 'Docker', issues: ['Container image storage', 'Volume cache buildup', 'Log file accumulation'] },
        { name: 'Node.js', issues: ['npm cache growth', 'Module memory usage', 'Dev server overhead'] },
        { name: 'Chrome DevTools', issues: ['Debug session memory', 'Network cache storage', 'Source map buildup'] },
        { name: 'Terminal', issues: ['Command history growth', 'Log file accumulation', 'Session memory usage'] }
      ]
    },
    gamer: {
      title: 'Gamer',
      emoji: '🎮',
      apps: [
        { name: 'Steam', issues: ['Game cache buildup', 'Workshop content storage', 'Update file residue'] },
        { name: 'Discord', issues: ['Voice chat memory usage', 'Media cache growth', 'Bot data storage'] },
        { name: 'OBS', issues: ['Recording buffer overflow', 'Scene cache buildup', 'Plugin memory leaks'] },
        { name: 'Epic Games', issues: ['Game library cache', 'Update download residue', 'Launcher memory usage'] },
        { name: 'Battle.net', issues: ['Game patch storage', 'Chat history buildup', 'Launcher cache growth'] },
        { name: 'Twitch', issues: ['Stream cache storage', 'Chat history memory', 'Extension overhead'] }
      ]
    },
    business: {
      title: 'Business Pro',
      emoji: '💼',
      apps: [
        { name: 'Microsoft Office', issues: ['AutoRecover file buildup', 'Template cache growth', 'Add-in memory usage'] },
        { name: 'Slack', issues: ['Message cache explosion', 'File download buildup', 'Workspace data storage'] },
        { name: 'Zoom', issues: ['Recording temp storage', 'Chat history cache', 'Plugin memory overhead'] },
        { name: 'Teams', issues: ['Call history storage', 'File cache buildup', 'App data accumulation'] },
        { name: 'Notion', issues: ['Offline sync cache', 'Media file storage', 'Database cache growth'] },
        { name: 'Salesforce', issues: ['Local data cache', 'Report file storage', 'Session memory buildup'] }
      ]
    },
    keyboard: {
      title: 'Keyboard Junkie',
      emoji: '⌨️',
      apps: [
        { name: 'Alfred', issues: ['Search index growth', 'Workflow cache buildup', 'Clipboard history storage'] },
        { name: 'Raycast', issues: ['Extension cache growth', 'Command history buildup', 'Plugin memory usage'] },
        { name: 'iTerm', issues: ['Session history storage', 'Profile cache buildup', 'Log file accumulation'] },
        { name: 'Homebrew', issues: ['Package cache growth', 'Formula storage buildup', 'Download residue'] },
        { name: 'vim', issues: ['Swap file accumulation', 'Plugin cache growth', 'Session data storage'] },
        { name: 'tmux', issues: ['Session buffer buildup', 'History file growth', 'Plugin memory usage'] }
      ]
    },
    content: {
      title: 'Content Creator',
      emoji: '📹',
      apps: [
        { name: 'DaVinci Resolve', issues: ['Media pool cache', 'Render queue storage', 'Project file buildup'] },
        { name: 'Logic Pro', issues: ['Audio sample cache', 'Plugin memory usage', 'Project backup storage'] },
        { name: 'Canva', issues: ['Design cache buildup', 'Template storage growth', 'Export file residue'] },
        { name: 'ScreenFlow', issues: ['Recording cache storage', 'Export temp files', 'Media library buildup'] },
        { name: 'Audacity', issues: ['Audio cache growth', 'Project temp storage', 'Plugin memory overhead'] },
        { name: 'Reeder', issues: ['Article cache buildup', 'Media storage growth', 'Sync data accumulation'] }
      ]
    }
  };

  const getSelectedApps = () => {
    const allApps = [];
    selectedTypes.forEach(typeId => {
      if (userTypes[typeId]) {
        allApps.push(...userTypes[typeId].apps.map(app => ({
          ...app,
          userType: userTypes[typeId].title,
          emoji: userTypes[typeId].emoji
        })));
      }
    });
    return allApps;
  };

  const selectedApps = getSelectedApps();

  return (
    <div style={{ padding: '16px', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <div style={{ ...cardStyle, maxWidth: '850px', width: '100%', margin: '0 auto', height: 'calc(100vh - 32px)', display: 'flex', flexDirection: 'column' }}>
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#1f2937', margin: '0', letterSpacing: '-0.5px' }}>
        How Memory Monster Helps {selectedTypes.map(id => userTypes[id]?.emoji).join(' ')} Like You
      </h1>
    </div>

        {/* App Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px', flex: 1 }}>
          {(() => {
  // Get balanced apps from selected user types
  const getBalancedApps = () => {
    const appsByType = {};
    selectedTypes.forEach(typeId => {
      if (userTypes[typeId]) {
        appsByType[typeId] = userTypes[typeId].apps;
      }
    });
    
    const result = [];
    const maxPerType = Math.ceil(5 / selectedTypes.length);
    
    selectedTypes.forEach(typeId => {
      if (appsByType[typeId] && result.length < 5) {
        const typeApps = appsByType[typeId].slice(0, maxPerType);
        typeApps.forEach(app => {
          if (result.length < 5) {
            result.push({
              ...app,
              userType: userTypes[typeId].title,
              emoji: userTypes[typeId].emoji,
              typeId: typeId
            });
          }
        });
      }
    });
    
    return result;
  };
  
  const balancedApps = getBalancedApps();
  
  const appIcons = {
    'Steam': '🎮', 'Discord': '💬', 'OBS': '📹', 'Epic Games': '🎯', 'Battle.net': '⚔️',
    'Photoshop': '🎨', 'Figma': '📐', 'Final Cut Pro': '🎬', 'After Effects': '🎭', 'Sketch': '✏️', 'Lightroom': '📸',
    'VS Code': '💻', 'Xcode': '🔨', 'Docker': '📦', 'Node.js': '🟢', 'Chrome DevTools': '🔍', 'Terminal': '⚡',
    'Microsoft Office': '📊', 'Slack': '💼', 'Zoom': '📞', 'Teams': '👥', 'Notion': '📝', 'Salesforce': '☁️',
    'Alfred': '🔍', 'Raycast': '⚡', 'iTerm': '💻', 'Homebrew': '🍺', 'vim': '📝', 'tmux': '🖥️',
    'DaVinci Resolve': '🎞️', 'Logic Pro': '🎵', 'Canva': '🎨', 'ScreenFlow': '📺', 'Audacity': '🎤', 'Reeder': '📰'
  };
  
  const appDescriptions = {
    'Steam': 'Gaming platform, notorious memory hog',
    'Discord': 'Chat app, silent background monster',
    'OBS': 'Streaming software, performance drain',
    'Epic Games': 'Game launcher, resource thief',
    'Battle.net': 'Blizzard launcher, cache accumulator',
    'Photoshop': 'Creative powerhouse, RAM devourer',
    'Figma': 'Design tool, browser memory hog',
    'Final Cut Pro': 'Video editor, cache monster',
    'After Effects': 'Motion graphics, memory beast',
    'Sketch': 'Design app, file bloat creator',
    'Lightroom': 'Photo editor, preview hoarder',
    'VS Code': 'Code editor, extension memory leak',
    'Xcode': 'Dev tool, cache explosion expert',
    'Docker': 'Container platform, storage thief',
    'Node.js': 'Runtime, npm cache monster',
    'Chrome DevTools': 'Debug tool, session hog',
    'Terminal': 'Command line, history accumulator',
    'Microsoft Office': 'Office suite, background processor',
    'Slack': 'Team chat, workspace data hog',
    'Zoom': 'Video calls, cache builder',
    'Teams': 'Microsoft chat, file accumulator',
    'Notion': 'Note app, sync cache monster',
    'Salesforce': 'CRM platform, session data hog'
  };
  
  return balancedApps.map((app, index) => (
    <div
      key={`${app.name}-${index}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
        border: '1px solid rgba(114, 9, 183, 0.15)',
        borderRadius: '16px',
        padding: '20px',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-4px) scale(1.02)';
        e.target.style.boxShadow = '0 20px 40px rgba(114, 9, 183, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0) scale(1)';
        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)';
      }}
    >
      {/* User type badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'linear-gradient(135deg, rgba(114, 9, 183, 0.1), rgba(83, 52, 131, 0.05))',
        border: '1px solid rgba(114, 9, 183, 0.2)',
        borderRadius: '12px',
        padding: '4px 8px',
        fontSize: '10px',
        fontWeight: '600',
        color: '#7209b7'
      }}>
        {app.emoji} {app.userType}
      </div>
      
      {/* App Icon */}
      <div style={{ 
        fontSize: '32px', 
        marginBottom: '12px',
        background: 'rgba(114, 9, 183, 0.1)',
        borderRadius: '12px',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 12px auto'
      }}>
        {appIcons[app.name] || '📱'}
      </div>
      
      {/* App Name */}
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '800', 
        color: '#1f2937', 
        margin: '0 0 8px 0'
      }}>
        {app.name}
      </h3>
      
      {/* App Description */}
      <p style={{ 
        fontSize: '12px', 
        color: '#6b7280', 
        marginBottom: '16px',
        lineHeight: '1.4'
      }}>
        {appDescriptions[app.name] || 'Popular app, known performance drain'}
      </p>
      
      {/* Naughty List */}
      <div style={{ 
        background: 'rgba(239, 68, 68, 0.05)', 
        borderRadius: '8px', 
        padding: '12px'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#ef4444' }}>
          Naughty List:
        </div>
        <ul style={{ fontSize: '10px', color: '#6b7280', margin: '0', paddingLeft: '0', lineHeight: '1.4', listStyle: 'none' }}>
          {app.issues.slice(0, 3).map((issue, idx) => (
            <li key={idx} style={{ marginBottom: '3px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '6px' }}>
                {idx === 0 ? '💾' : idx === 1 ? '🔄' : '📱'}
              </span>
              {issue}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ));
})()}
          
          {/* Special 6th tile - Pro Upgrade Style */}
<div 
  onClick={() => openExternalLink('https://memorymonster.co/join')}
  style={{
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '16px',
    padding: '20px',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    color: 'white',
    textAlign: 'center'
  }}
  onMouseEnter={(e) => {
    e.target.style.transform = 'translateY(-4px) scale(1.02)';
    e.target.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.4)';
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = 'translateY(0) scale(1)';
    e.target.style.boxShadow = 'none';
  }}
>
  {/* Rotating glow background */}
  <div style={{
    position: 'absolute',
    inset: '-2px',
    background: 'conic-gradient(from 0deg, rgba(139, 92, 246, 0.8), rgba(124, 58, 237, 0.6), rgba(109, 40, 217, 0.4), rgba(139, 92, 246, 0.8))',
    borderRadius: '18px',
    animation: 'rotate 8s linear infinite',
    opacity: 0.7,
    filter: 'blur(8px)'
  }}></div>
  
  {/* Content */}
  <div style={{ position: 'relative', zIndex: 2 }}>
    {/* Crown icon */}
    <div style={{ 
      fontSize: '32px', 
      marginBottom: '12px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 12px auto'
    }}>
      👑
    </div>
    
    <h3 style={{ 
      fontSize: '18px', 
      fontWeight: '800', 
      color: 'white', 
      margin: '0 0 8px 0',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    }}>
      Unlock Memory Monster Pro
    </h3>
    
    <p style={{ 
      fontSize: '12px', 
      color: 'rgba(255, 255, 255, 0.9)', 
      marginBottom: '16px',
      lineHeight: '1.4'
    }}>
      ...and 250+ other apps you can't live without
    </p>
    
    {/* Pro Features */}
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.1)', 
      borderRadius: '8px', 
      padding: '12px'
    }}>
      <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
        Pro Features:
      </div>
      <ul style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.9)', margin: '0', paddingLeft: '0', lineHeight: '1.4', listStyle: 'none' }}>
        <li style={{ marginBottom: '3px', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '6px' }}>🤖</span>
          AI-powered optimization
        </li>
        <li style={{ marginBottom: '3px', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '6px' }}>👥</span>
          Community intelligence
        </li>
        <li style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '6px' }}>📱</span>
          New apps added daily
        </li>
      </ul>
    </div>
  </div>
</div>
        </div>

        {/* Bottom CTA Section */}
<div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '20px' }}>
  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1f2937', marginBottom: '8px' }}>
    Ready to join the speed revolution?
  </h3>
  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
    <strong style={{ color: '#7209b7' }}>500K+ users</strong> unlocked the equivalent of <strong style={{ color: '#7209b7' }}>647,000 Ferraris</strong> this month alone
  </p>
  <button
    onClick={() => setCurrentView('diskAccess')}
    style={{
      padding: '12px 32px',
      background: `linear-gradient(135deg, #7209b7 0%, #533483 100%)`,
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 8px 24px rgba(114, 9, 183, 0.4)',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px) scale(1.02)';
      e.target.style.boxShadow = '0 12px 32px rgba(114, 9, 183, 0.5)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0) scale(1)';
      e.target.style.boxShadow = '0 8px 24px rgba(114, 9, 183, 0.4)';
    }}
  >
    🚀 Let's Unlock My Speed
  </button>
</div>
      </div>
    </div>
  );
};

// User Type Selection Screen
const UserTypeScreen = () => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  
  const userTypes = [
    { 
      id: 'creative', 
      title: 'Creative Pro', 
      emoji: '🎨', 
      description: 'Designer, video editor, photographer',
      apps: ['Photoshop', 'Figma', 'Final Cut Pro', 'After Effects', 'Sketch', 'Lightroom']
    },
    { 
      id: 'developer', 
      title: 'Developer', 
      emoji: '👨‍💻', 
      description: 'Coder, engineer, technical builder',
      apps: ['VS Code', 'Xcode', 'Docker', 'Node.js', 'Chrome DevTools', 'Terminal']
    },
    { 
      id: 'gamer', 
      title: 'Gamer', 
      emoji: '🎮', 
      description: 'Gaming enthusiast, streamer',
      apps: ['Steam', 'Discord', 'OBS', 'Epic Games', 'Battle.net', 'Twitch']
    },
    { 
      id: 'business', 
      title: 'Business Pro', 
      emoji: '💼', 
      description: 'Manager, consultant, analyst',
      apps: ['Microsoft Office', 'Slack', 'Zoom', 'Teams', 'Notion', 'Salesforce']
    },
    { 
      id: 'keyboard', 
      title: 'Keyboard Junkie', 
      emoji: '⌨️', 
      description: 'Power user, productivity obsessed',
      apps: ['Alfred', 'Raycast', 'iTerm', 'Homebrew', 'vim', 'tmux']
    },
    { 
      id: 'content', 
      title: 'Content Creator', 
      emoji: '📹', 
      description: 'YouTuber, podcaster, influencer',
      apps: ['DaVinci Resolve', 'Logic Pro', 'Canva', 'ScreenFlow', 'Audacity', 'Reeder']
    }
  ];

  const toggleType = (typeId) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  return (
    <div style={{ padding: '40px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...cardStyle, maxWidth: '800px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1f2937', margin: '0 0 16px 0', letterSpacing: '-1px' }}>
          Welcome to Memory Monster
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px', margin: '0 0 40px 0', fontWeight: '500', lineHeight: '1.6', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
Your Mac is probably at 25% capacity right now. Apps like Chrome, Slack, Spotify and 250+ others are hogging your computer's speed. We need to know who you are so we can help unlock that hidden performance.
</p>
        
        {/* User Type Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '0 0 40px 0' }}>
          {userTypes.map(type => (
            <div
              key={type.id}
              onClick={() => toggleType(type.id)}
              style={{
padding: '20px',
border: '2px solid transparent',
borderColor: selectedTypes.includes(type.id) 
  ? '#7209b7' 
  : 'rgba(107, 114, 128, 0.2)',
borderRadius: '16px',
background: selectedTypes.includes(type.id)
  ? 'linear-gradient(135deg, rgba(114, 9, 183, 0.1), rgba(83, 52, 131, 0.05))'
  : 'rgba(255, 255, 255, 0.5)',
cursor: 'pointer',
transition: 'all 0.3s ease',
position: 'relative',
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center'
}}
              onMouseEnter={(e) => {
e.target.style.borderColor = selectedTypes.includes(type.id) 
  ? '#7209b7' 
  : 'rgba(114, 9, 183, 0.4)';
e.target.style.transform = 'translateY(-2px)';
}}
onMouseLeave={(e) => {
e.target.style.borderColor = selectedTypes.includes(type.id) 
  ? '#7209b7' 
  : 'rgba(107, 114, 128, 0.2)';
e.target.style.transform = 'translateY(0)';
}}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{type.emoji}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
                {type.title}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                {type.description}
              </div>
              <div style={{
position: 'absolute',
top: '8px',
right: '8px',
width: '20px',
height: '20px',
background: selectedTypes.includes(type.id) ? '#7209b7' : 'transparent',
borderRadius: '50%',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
color: 'white',
fontSize: '12px',
fontWeight: '700',
opacity: selectedTypes.includes(type.id) ? 1 : 0,
transition: 'all 0.3s ease'
}}>
✓
</div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={() => setCurrentView('diskAccess')}
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
          >
            Skip for Now
          </button>
          <button
            onClick={() => {
  if (selectedTypes.length > 0) {
    localStorage.setItem('selectedUserTypes', JSON.stringify(selectedTypes));
    setCurrentView('appShowcase');
  } else {
    setCurrentView('diskAccess');
  }
}}
            style={{
              padding: '12px 32px',
              background: `linear-gradient(135deg, #7209b7 0%, #533483 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(114, 9, 183, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {selectedTypes.length > 0 ? 'Show Me How Memory Monster Helps' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
// Disk Access Request Screen
const DiskAccessScreen = () => (
   <div style={{ padding: '40px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
     <div style={{ ...cardStyle, maxWidth: '600px', width: '100%', textAlign: 'center', position: 'relative' }}>
       
       {/* Removed floating particles - they were causing animation issues */}
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
           onClick={() => setCurrentView('dashboard')}
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
           onClick={handleGrantDiskAccess}
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

 // Access Granted Screen - Fixed Animations
 const AccessGrantedScreen = () => (
   <div style={{ padding: '40px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
     <div style={{ ...cardStyle, maxWidth: '600px', width: '100%', textAlign: 'center', position: 'relative' }}>
       
       {/* Removed floating particles */}
       {/* Success icon with smooth glow - no green ring */}
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
       
       {/* Button with smooth glow - no green ring */}
       <button 
  onClick={handleBeginFromAccess}
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

 // Activate Plan Modal - PARTICLES REMOVED, STABLE
const ActivatePlanModal = () => (
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
      {/* Particles removed for stability */}
       
       {/* App icon */}
       <div style={{ width: '80px', height: '80px', margin: '0 auto 24px auto', background: `linear-gradient(135deg, #7c3aed 0%, #db2777 100%)`, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 24px rgba(124, 58, 237, 0.4)', animation: 'pulse 3s infinite' }}>
         <FirefoxLogo size={48} />
       </div>
       
       <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '800', margin: '0 0 12px 0' }}>Let's activate your plan</h2>
       <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', margin: '0 0 32px 0', lineHeight: '1.6' }}>
         Your Memory Monster journey begins. Sign in to activate your free trial or use the plan you purchased.
       </p>
       
       <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
         <button 
  onClick={handleSkipActivation}
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
           Skip for Now
         </button>
         
         <button 
  onClick={handleActivateNow}
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
           Activate Now
         </button>
         
         <button 
  onClick={handleBuyPlan}
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
           Buy Plan
         </button>
       </div>
     </div>
   </div>
 );

// ===== ENHANCED CONFETTI COMPONENT =====
const Confetti = () => {
const pieces = Array.from({ length: 100 }, (_, i) => (
<div
key={i}
style={{
position: 'absolute',
left: `${Math.random() * 100}%`,
top: '-20px',
width: `${Math.random() * 8 + 6}px`, // 6-14px variety
height: `${Math.random() * 8 + 6}px`,
background: ['#7209b7', '#533483', '#16213e', '#0f3460', '#10b981', '#f59e0b'][Math.floor(Math.random() * 6)],
animation: `confetti 3s ease-out forwards`,
animationDelay: `${Math.random() * 0.5}s`, // Much faster start
borderRadius: Math.random() > 0.5 ? '50%' : '2px', // Mix of circles and squares
transform: `rotate(${Math.random() * 360}deg)`
}}
/>
));
return (
<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }}>
{pieces}
</div>
);
};

 

 // ===== ALL FUNCTIONS =====
 
 const scrollToBottom = () => {
   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
 };

 useEffect(() => {
   scrollToBottom();
 }, [atlasMessages]);

 

// Initial loading sequence
  useEffect(() => {
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      setLoadingMessage(loadingMessages[messageIndex]);
      messageIndex = (messageIndex + 1) % loadingMessages.length;
    }, 600);

    const loadingTimer = setTimeout(() => {
clearInterval(messageInterval);
setIsLoading(false);
// Don't override currentView here - let the initial state handle it
}, 4500);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(loadingTimer);
    };
  }, []);


  // Community cycling effect - TEMPORARILY DISABLED FOR TESTING
/*
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentCommunityIndex((prev) => (prev + 1) % communityUsers.length);
  }, 4000);
  return () => clearInterval(interval);
}, []);
*/
// SYSTEM 1: Welcome modal - ONLY on dashboard, never again on any other view
useEffect(() => {
const sessionKey = 'globalWelcomeShown';
const hasShown = sessionStorage.getItem(sessionKey) === 'true';
// ONLY trigger on dashboard view AND never shown before
if (currentView === 'dashboard' && !hasShown && !dashboardWelcomeShown) {
// Set the flag IMMEDIATELY to prevent multiple timers
sessionStorage.setItem(sessionKey, 'true');
const timer = setTimeout(() => {
setShowWelcomeModal(true);
setDashboardWelcomeShown(true);
}, 4000);
return () => clearTimeout(timer);
}
}, [currentView, dashboardWelcomeShown]);

// SYSTEM 2: Activation reminder - DISABLED (modal should only show once on dashboard)
/*
useEffect(() => {
const sessionKey = 'activationReminderShown';
const hasShown = sessionStorage.getItem(sessionKey) === 'true';
if (currentView === 'scanning' && scanComplete && !hasShown) {
// Set the flag IMMEDIATELY to prevent multiple timers
sessionStorage.setItem(sessionKey, 'true');
const timer = setTimeout(() => {
setShowActivationModal(true);
setActivationReminderShown(true);
}, 8000);
return () => clearTimeout(timer);
}
}, [currentView, scanComplete]);
*/
// Handle disk access grant - Opens actual system preferences
  const handleGrantDiskAccess = () => {
  const confirmOpen = window.confirm('This will open System Preferences where you can grant Memory Monster full disk access. Continue?');
  
  if (confirmOpen) {
    // Actually open System Preferences on macOS
    try {
      // Create a temporary iframe to trigger system preferences without blank window
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles';
      document.body.appendChild(iframe);
      setTimeout(() => document.body.removeChild(iframe), 1000);
    } catch (error) {
      console.log('System Preferences would open here in real app');
    }
    
    // Simulate the user enabling access and auto-detect
    setTimeout(() => {
      setDiskAccessGranted(true);
      setCurrentView('accessGranted');
    }, 3000);
  }
};

// Handle begin from access granted screen - MANUAL TRIGGER ONLY
  const handleBeginFromAccess = () => {
    setCurrentView('dashboard');
  };

  // Handle activate plan actions with proper state cleanup
 // FIXED: External link handling for Electron
const openExternalLink = (url) => {
  // For Electron - use shell.openExternal when available
  if (window.require) {
    try {
      const { shell } = window.require('electron');
      shell.openExternal(url);
    } catch (error) {
      console.log('External link would open:', url);
      // Show temporary notification
      alert(`This will open: ${url}\n(External links will work in the final app)`);
    }
  } else {
    // Fallback for development
    console.log('External link would open:', url);
    alert(`This will open: ${url}\n(External links will work in the final app)`);
  }
};

const handleActivateNow = () => {
  setShowWelcomeModal(false);
  setShowActivationModal(false);
  setTimeout(() => {
    openExternalLink('https://memorymonster.co/join');
  }, 100);
};

const handleBuyPlan = () => {
  setShowWelcomeModal(false);
  setShowActivationModal(false);
  setTimeout(() => {
    openExternalLink('https://memorymonster.co/join');
  }, 100);
};

const handleSkipActivation = () => {
  setShowWelcomeModal(false);
  setShowActivationModal(false);
};



// Animate memory counter
const animateMemoryCounter = (targetValue) => {
  const startValue = animatingMemory;
   const difference = targetValue - startValue;
   const steps = 30;
   const stepValue = difference / steps;
   let currentStep = 0;

   const interval = setInterval(() => {
     currentStep++;
     const newValue = startValue + (stepValue * currentStep);
     setAnimatingMemory(Math.max(0, newValue));
     
     if (currentStep >= steps) {
       clearInterval(interval);
       setAnimatingMemory(targetValue);
     }
   }, 50);
 };

const handleScan = () => {
   setCurrentView('scanning'); // Change to scanning view
// Clean up any lingering modal states
setShowWelcomeModal(false);
setShowActivationModal(false);
   setIsScanning(true);
   setScanComplete(false);
   setAtlasMessages(prev => [...prev, "Memory liberation systems activated! Scanning for trapped memory... 🔍"]);
   
   setTimeout(() => {
     setIsScanning(false);
     setScanComplete(true);
     setAtlasMessages(prev => [...prev, "Liberation complete! ⚔️ I've located several memory monsters holding 21.4GB of your Mac's memory hostage. Based on intel from millions of fellow liberators, freeing this memory typically results in 23% faster performance and 31% better efficiency. Ready to start the rescue mission? 🚀"]);
   }, 4000);
 };

 const handleSendMessage = () => {
   if (userInput.trim()) {
     setAtlasMessages(prev => [...prev, `You: ${userInput}`]);
     
     setTimeout(() => {
       const responses = [
         "Great question! Based on data from 50,000+ successful liberations, I'd recommend freeing storage monsters first for maximum impact. 💚",
         "Smart thinking! Users who liberate memory regularly (every 2-3 weeks) maintain 34% better system performance over time. 🛡️",
         "Excellent observation! WhatsApp cache monsters are usually the easiest to free - users report immediate satisfaction after liberation. ⚡",
         "Perfect timing for that question! I've learned from thousands of successful rescues that steady, systematic memory liberation delivers the best results. ✨",
         "That's exactly the strategic approach that leads to victory! The liberation community discusses this tactic frequently. 💫"
       ];
       const randomResponse = responses[Math.floor(Math.random() * responses.length)];
       setAtlasMessages(prev => [...prev, randomResponse]);
     }, 1200);
     
     setUserInput('');
   }
 };

 const handleKeyPress = (e) => {
   if (e.key === 'Enter') {
     handleSendMessage();
   }
 };

 const calculateProgress = () => {
   const totalMemory = issues.reduce((sum, issue) => sum + issue.storage, 0);
   return totalMemoryFreed > 0 ? Math.round((totalMemoryFreed / totalMemory) * 100) : 0;
 };

 const handleFix = async (issueId) => {
const issue = issues.find(i => i.id === issueId);
setFixingStates(prev => ({ ...prev, [issueId]: 'analyzing' }));
setTimeout(() => {
setFixingStates(prev => ({ ...prev, [issueId]: 'liberating' }));
}, 1200);
setTimeout(() => {
setFixingStates(prev => ({ ...prev, [issueId]: 'complete' }));
setIssues(prev => prev.map(i =>
i.id === issueId ? { ...i, fixed: true } : i
));
const memoryAmount = issue.storage;
const newTotalFreed = totalMemoryFreed + memoryAmount;
const totalIssuesMemory = issues.reduce((sum, issue) => sum + issue.storage, 0);
const newRemainingMemory = totalIssuesMemory - newTotalFreed;
setTotalMemoryFreed(newTotalFreed);
setRemainingMemory(newRemainingMemory);
animateMemoryCounter(Math.max(0, newRemainingMemory));
// NEW: Mark that user has completed their first fix
if (!hasCompletedFirstFix) {
setHasCompletedFirstFix(true);
}
// NEW: Minimize immediately after completion (no delay)
setMinimizedIssues(prev => ({ ...prev, [issueId]: true }));
const allFixed = issues.filter(i => i.id !== issueId).every(i => i.fixed);
if (allFixed) {
setShowConfetti(true);
setTimeout(() => setShowConfetti(false), 4000);
setAtlasMessages(prev => [...prev, "🎉 INCREDIBLE! You've liberated ALL trapped memory! Your Mac is now running at peak performance. The Memory Monster community salutes your victory! 🏆✨"]);
}
const celebrationMessage = `🏆 Victory! The ${issue.app} monster has been defeated! You just freed ${issue.storage}${issue.storageUnit} of memory and your Mac's performance is restored. ${issue.userCount} users freed ${issue.totalFreed} from ${issue.app} today! ✨`;
setAtlasMessages(prev => [...prev, celebrationMessage]);
}, 3800);
};

// NEW: Function to unlock all issues at once
const handleUnlockAll = async () => {
const unlockedIssues = issues.filter(issue => !issue.fixed);
for (let i = 0; i < unlockedIssues.length; i++) {
const issue = unlockedIssues[i];
setTimeout(() => {
handleFix(issue.id);
}, i * 500);
}
};
 // ===== STYLING FUNCTIONS =====
 
 const getSeverityStyle = (severity) => {
   const baseStyle = {
     borderRadius: '20px',
     position: 'relative',
     overflow: 'hidden'
   };

   switch(severity) {
     case 'critical': 
       return {
         ...baseStyle,
         background: `linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.12) 30%, rgba(59, 130, 246, 0.08) 60%, rgba(236, 72, 153, 0.05) 100%)`,
         border: '1px solid rgba(34, 197, 94, 0.25)',
         boxShadow: `0 8px 32px rgba(34, 197, 94, 0.15), 0 1px 0 rgba(255, 255, 255, 0.05) inset, 0 0 0 1px rgba(34, 197, 94, 0.08) inset`
       };
     case 'high': 
       return {
         ...baseStyle,
         background: `linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(34, 197, 94, 0.12) 30%, rgba(59, 130, 246, 0.08) 60%, rgba(236, 72, 153, 0.05) 100%)`,
         border: '1px solid rgba(16, 185, 129, 0.25)',
         boxShadow: `0 8px 32px rgba(16, 185, 129, 0.15), 0 1px 0 rgba(255, 255, 255, 0.05) inset, 0 0 0 1px rgba(16, 185, 129, 0.08) inset`
       };
     case 'medium': 
       return {
         ...baseStyle,
         background: `linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.12) 30%, rgba(34, 197, 94, 0.08) 60%, rgba(236, 72, 153, 0.05) 100%)`,
         border: '1px solid rgba(59, 130, 246, 0.25)',
         boxShadow: `0 8px 32px rgba(59, 130, 246, 0.15), 0 1px 0 rgba(255, 255, 255, 0.05) inset, 0 0 0 1px rgba(59, 130, 246, 0.08) inset`
       };
     default: 
       return baseStyle;
   }
 };

 const getFixingContent = (state, issue) => {
switch(state) {
case 'analyzing':
return (
<div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', padding: '8px 16px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.05))', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
<div style={{ width: '16px', height: '16px', border: '2px solid rgba(16, 185, 129, 0.3)', borderTop: '2px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
<div><div style={{ fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap' }}>Locating...</div></div>
</div>
);
case 'liberating':
return (
<div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', padding: '8px 16px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(34, 197, 94, 0.08))', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
<Sparkles size={16} style={{ animation: 'pulse 2s infinite' }} />
<div><div style={{ fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap' }}>Liberating memory...</div></div>
</div>
);
     case 'complete':
       return (
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', padding: '8px 16px', background: `linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(34, 197, 94, 0.1) 50%, rgba(59, 130, 246, 0.05) 100%)`, borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)', animation: 'success 0.8s ease-out', minWidth: '140px', fontSize: '12px' }}>
           <CheckCircle size={16} />
           <div><div style={{ fontWeight: '700', fontSize: '12px' }}>{issue.storage}GB freed! 🎉</div></div>
         </div>
       );
     default:
       return (
         <button onClick={() => handleFix(issue.id)} style={{ padding: '12px 24px', background: `linear-gradient(135deg, #7209b7 0%, #533483 50%, #16213e 100%)`, color: 'white', border: 'none', borderRadius: '16px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: `0 8px 24px rgba(114, 9, 183, 0.35), 0 4px 12px rgba(83, 52, 131, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset`, transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative', overflow: 'hidden' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px) scale(1.02)'; e.target.style.boxShadow = `0 12px 32px rgba(114, 9, 183, 0.45), 0 6px 18px rgba(83, 52, 131, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15) inset`; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0) scale(1)'; e.target.style.boxShadow = `0 8px 24px rgba(114, 9, 183, 0.35), 0 4px 12px rgba(83, 52, 131, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset`; }}>
           <span style={{ position: 'relative', zIndex: 1 }}>Unlock {issue.storage}GB</span>
         </button>
       );
   }
 };

// ===== MAIN STYLES =====
 
 const containerStyle = {
  height: '100vh',
  background: `linear-gradient(135deg, #0f0f23 0%, #1a1a2e 20%, #16213e 40%, #0f3460 60%, #533483 80%, #7209b7 100%)`,
  backgroundSize: '400% 400%',
  animation: 'gradientShift 20s ease-in-out infinite',
  overflow: 'hidden',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  position: 'relative'
};

 const mainContentStyle = {
   height: '100vh',
   display: 'grid',
   gridTemplateColumns: '320px 1fr',
   overflow: 'hidden',
   position: 'relative'
 };

 const sidebarStyle = {
   background: `linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.10) 50%, rgba(255, 255, 255, 0.05) 100%)`,
   backdropFilter: 'blur(24px) saturate(180%)',
   borderRight: '1px solid rgba(255, 255, 255, 0.2)',
   padding: '40px 32px',
   display: 'flex',
   flexDirection: 'column',
   gap: '12px',
   boxShadow: '0 0 40px rgba(0, 0, 0, 0.3) inset'
 };

 const sidebarItemStyle = {
   display: 'flex',
   alignItems: 'center',
   gap: '16px',
   padding: '16px 20px',
   borderRadius: '16px',
   color: 'rgba(255, 255, 255, 0.8)',
   cursor: 'pointer',
   transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
   fontSize: '15px',
   fontWeight: '600',
   position: 'relative',
   overflow: 'hidden'
 };

 const activeSidebarItemStyle = {
   ...sidebarItemStyle,
   background: `linear-gradient(135deg, rgba(114, 9, 183, 0.4) 0%, rgba(83, 52, 131, 0.3) 100%)`,
   color: 'white',
   boxShadow: `0 8px 32px rgba(114, 9, 183, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset`
 };

 const contentAreaStyle = {
   padding: '40px',
   overflow: 'hidden',
   display: 'grid',
   gridTemplateColumns: '1fr 400px',
   gap: '40px',
   height: '100vh' // Fixed height
 };

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

 const premiumCardStyle = {
   ...cardStyle,
   background: `linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)`,
   boxShadow: `0 32px 64px rgba(114, 9, 183, 0.3), 0 16px 32px rgba(83, 52, 131, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(114, 9, 183, 0.1) inset, 0 1px 0 rgba(255, 255, 255, 0.3) inset`
 };

 const byteCardStyle = {
...cardStyle,
background: `linear-gradient(135deg, rgba(114, 9, 183, 0.08) 0%, rgba(255, 255, 255, 0.95) 20%, rgba(255, 255, 255, 0.90) 100%)`,
border: '2px solid rgba(114, 9, 183, 0.2)',
boxShadow: `0 24px 48px rgba(114, 9, 183, 0.25), 0 12px 24px rgba(83, 52, 131, 0.15), 0 6px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(114, 9, 183, 0.15) inset, 0 1px 0 rgba(255, 255, 255, 0.3) inset`
};
 // ===== LOADING SCREEN =====
if (isLoading) {
  return (
    <div style={containerStyle}>
      {/* Speed-focused ambient orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: '250px', height: '250px', background: `radial-gradient(circle, rgba(114, 9, 183, 0.3) 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(50px)', animation: 'float 8s ease-in-out infinite' }}></div>
      <div style={{ position: 'absolute', top: '55%', right: '15%', width: '300px', height: '300px', background: `radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite reverse' }}></div>
      <div style={{ position: 'absolute', bottom: '25%', left: '25%', width: '200px', height: '200px', background: `radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(45px)', animation: 'float 7s ease-in-out infinite 2s' }}></div>
      
      {/* Main content */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', zIndex: 10, position: 'relative' }}>
        
       {/* Central loading spinner */}
<div style={{ position: 'relative', marginBottom: '48px' }}>
<div style={{
width: '120px',
height: '120px',
margin: '0 auto',
position: 'relative'
}}>
{/* Background circle */}
<svg width="120" height="120" style={{ position: 'absolute' }}>
<circle
cx="60"
cy="60"
r="50"
fill="none"
stroke="rgba(255, 255, 255, 0.2)"
strokeWidth="16"
/>
</svg>
{/* Animated progress circle */}
<svg width="120" height="120" style={{ position: 'absolute', animation: 'rotate 1.5s linear infinite' }}>
<circle
cx="60"
cy="60"
r="50"
fill="none"
stroke="url(#loadingGradient)"
strokeWidth="16"
strokeLinecap="round"
strokeDasharray="100 200"
style={{ filter: 'drop-shadow(0 0 12px rgba(114, 9, 183, 0.6))' }}
/>
<defs>
<linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stopColor="#7209b7" />
<stop offset="50%" stopColor="#A855F7" />
<stop offset="100%" stopColor="#10b981" />
</linearGradient>
</defs>
</svg>
{/* Center icon */}
<div style={{
position: 'absolute',
inset: '0',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontSize: '32px'
}}>
⚡
</div>
</div>
</div>
        
        {/* App title */}
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: '900', 
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px',
          letterSpacing: '-1px',
          textAlign: 'center'
        }}>
          Memory Monster
        </h1>
        
        {/* Subtitle */}
        <p style={{ 
          fontSize: '18px', 
          color: 'rgba(255, 255, 255, 0.7)', 
          marginBottom: '32px',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          Unleashing Your Mac's True Speed
        </p>
        
        {/* Loading message */}
        <div style={{ 
          minHeight: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <p style={{ 
            fontSize: '16px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            textAlign: 'center',
            fontWeight: '600',
            animation: 'fadeInOut 0.8s ease-in-out infinite alternate'
          }}>
            {loadingMessage}
          </p>
        </div>
        
        {/* Speed metrics preview */}
        <div style={{ 
          marginTop: '40px',
          display: 'flex',
          gap: '32px',
          opacity: 0,
          animation: 'fadeInUp 1s ease-out 1s forwards'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: '#10b981',
              marginBottom: '4px'
            }}>
              84%
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '500'
            }}>
              Potential Speed
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: '#3b82f6',
              marginBottom: '4px'
            }}>
              2.1TB
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '500'
            }}>
              Memory to Free
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: '#f59e0b',
              marginBottom: '4px'
            }}>
              500K+
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '500'
            }}>
              Users Helped
            </div>
          </div>
        </div>
      </div>
      
      {/* Add the necessary keyframes styles */}
<style>{`
@keyframes rotate {
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
}

@keyframes fadeInOut {
0% { opacity: 0.7; }
100% { opacity: 1; }
}

@keyframes fadeInUp {
0% { opacity: 0; transform: translateY(20px); }
100% { opacity: 1; transform: translateY(0); }
}
`}</style>
    </div>
  );
}

// ===== MAIN APP RENDER =====
 return (
   <div style={containerStyle}>
     {/* Confetti Animation */}
     {showConfetti && <Confetti />}
     
     {/* Activate Plan Modal */}
     {/* Activate Plan Modal - Only show on dashboard */}
{(currentView === 'dashboard' && (showWelcomeModal || showActivationModal)) && <ActivatePlanModal />}

    {/* Floating Unlock Button - Updated for memorymonster.co/join */}
     <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 999 }}>
       {/* Subtle rotating glow for scanning view */}
       {currentView === 'scanning' && (
         <div style={{ 
           position: 'absolute', 
           top: '-2px', 
           left: '-2px', 
           right: '-2px', 
           bottom: '-2px', 
           borderRadius: '18px', 
           background: `conic-gradient(from 0deg, rgba(114, 9, 183, 0.4), rgba(83, 52, 131, 0.3), rgba(15, 52, 96, 0.2), rgba(114, 9, 183, 0.4))`, 
           animation: 'smoothRotate 8s linear infinite', 
           filter: 'blur(4px)' 
         }}></div>
       )}
       
       {/* Main rotating glow for other views */}
       {currentView !== 'scanning' && (
         <div style={{ 
           position: 'absolute', 
           top: '-4px', 
           left: '-4px', 
           right: '-4px', 
           bottom: '-4px', 
           borderRadius: '20px', 
           background: `conic-gradient(from 0deg, rgba(114, 9, 183, 0.8), rgba(83, 52, 131, 0.8), rgba(15, 52, 96, 0.8), rgba(114, 9, 183, 0.8))`, 
           animation: 'smoothRotate 5s linear infinite', 
           filter: 'blur(8px)' 
         }}></div>
       )}
       
       <button
  onClick={() => openExternalLink('https://memorymonster.co/join')}
         style={{ 
           position: 'relative',
           padding: '12px 24px', 
           background: `linear-gradient(135deg, #7209b7 0%, #533483 50%, #16213e 100%)`, 
           color: 'white', 
           border: 'none', 
           borderRadius: '16px', 
           fontSize: '14px', 
           fontWeight: '600', 
           cursor: 'pointer',
           boxShadow: '0 8px 32px rgba(114, 9, 183, 0.4)',
           transition: 'all 0.3s ease',
           zIndex: 2
         }}
         onMouseEnter={(e) => {
           e.target.style.transform = 'translateY(-2px) scale(1.05)';
           e.target.style.boxShadow = '0 12px 40px rgba(114, 9, 183, 0.5)';
         }}
         onMouseLeave={(e) => {
           e.target.style.transform = 'translateY(0) scale(1)';
           e.target.style.boxShadow = '0 8px 32px rgba(114, 9, 183, 0.4)';
         }}
       >
         🔓 Unlock Full Version
       </button>
     </div>
     {/* ONBOARDING SCREENS */}
{currentView === 'userType' && <UserTypeScreen />}
{currentView === 'appShowcase' && <AppShowcaseScreen />}
{currentView === 'diskAccess' && <DiskAccessScreen />}
{currentView === 'accessGranted' && <AccessGrantedScreen />}
    
    {currentView === 'dashboard' && (
       <div style={mainContentStyle}>
         {/* Sidebar */}
         <div style={sidebarStyle}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', padding: '0 4px' }}>
             <div style={{ width: '48px', height: '48px', background: `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
               <FirefoxLogo size={32} />
             </div>
             <div>
               <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '800', margin: '0 0 2px 0' }}>Memory Monster</h2>
               <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: '0', fontWeight: '500' }}>System Liberation Hub</p>
             </div>
           </div>

           <div style={currentView === 'dashboard' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('dashboard')}>
  <Shield size={20} />
  <span>Smart Care</span>
</div>
<div style={currentView === 'cleanup' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('cleanup')}>
  <Sparkles size={20} />
  <span>Cleanup</span>
</div>
<div style={currentView === 'performance' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('performance')}>
  <Activity size={20} />
  <span>Performance</span>
</div>
<div style={currentView === 'community' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('community')}>
  <Users size={20} />
  <span>Community</span>
</div>
{/* Settings moved to main nav */}
<div style={currentView === 'settings' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('settings')}>
<Settings size={20} />
<span>Settings</span>
</div>

<div style={{ flex: 1 }}></div>

{/* Global Stats at bottom */}
<MyStatsSidebar />
         </div>

         {/* Main Content Area - Simplified Dashboard */}
<div style={{ 
  padding: '40px', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  flexDirection: 'column', 
  position: 'relative',
  height: '100vh'
}}>
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%'
  }}>
    {/* Massive SpeedDial Component */}
    <SpeedDial 
  currentSpeed={currentSpeed}
  isScanning={speedDialScanning}
  onScanComplete={() => {
    setSpeedDialScanning(false);
    setDashboardLayout('split');
    handleScan();
  }}
  size="large"
  shouldAnimate={!showWelcomeModal && !showActivationModal}
/>

    {/* Check Speed Button - with pulsing animation */}
    <button
  onClick={() => setSpeedDialScanning(true)}
  disabled={speedDialScanning}
  style={{
    padding: '20px 60px',
    background: speedDialScanning 
      ? 'rgba(114, 9, 183, 0.3)' 
      : `linear-gradient(135deg, #7209b7 0%, #533483 100%)`,
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '20px',
    fontWeight: '700',
    cursor: speedDialScanning ? 'not-allowed' : 'pointer',
    boxShadow: speedDialScanning 
      ? 'none' 
      : '0 16px 40px rgba(114, 9, 183, 0.4)',
    transition: 'all 0.3s ease',
    marginTop: '48px',
    animation: speedDialScanning ? 'none' : 'slowPulse 3s ease-in-out infinite'
  }}
  onMouseEnter={(e) => {
    if (!speedDialScanning) {
      e.target.style.transform = 'translateY(-3px) scale(1.05)';
      e.target.style.boxShadow = '0 20px 50px rgba(114, 9, 183, 0.5)';
    }
  }}
  onMouseLeave={(e) => {
    if (!speedDialScanning) {
      e.target.style.transform = 'translateY(0) scale(1)';
      e.target.style.boxShadow = '0 16px 40px rgba(114, 9, 183, 0.4)';
    }
  }}
>
  {speedDialScanning ? 'Analyzing...' : 'Check My Speed'}
</button>
  </div>
</div>
       </div>
     )}
     // ===== MAIN APP RENDER =====
return (
<div style={containerStyle}>
{/* Confetti Animation */}
{showConfetti && <Confetti />}
{/* ... all your existing content ... */}

{/* ADD THIS STYLE BLOCK RIGHT HERE */}
<style jsx>{`
  @keyframes slowPulse {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 16px 40px rgba(114, 9, 183, 0.4);
    }
    50% { 
      transform: scale(1.02);
      box-shadow: 0 20px 50px rgba(114, 9, 183, 0.6);
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes targetPulse {
    0%, 100% { 
      transform: scale(1);
      opacity: 1;
    }
    50% { 
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
`}</style>

{/* Keep these existing closing tags */}
</div>
);
};

export default MacOptimizerApp;
{/* SETTINGS VIEW */}
{currentView === 'settings' && (
<div style={mainContentStyle}>
{/* Sidebar */}
<div style={sidebarStyle}>
<div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', padding: '0 4px' }}>
<div style={{ width: '48px', height: '48px', background: `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
<FirefoxLogo size={32} />
</div>
<div>
<h2 style={{ color: 'white', fontSize: '18px', fontWeight: '800', margin: '0 0 2px 0' }}>Memory Monster</h2>
<p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: '0', fontWeight: '500' }}>System Liberation Hub</p>
</div>
</div>
<div style={currentView === 'dashboard' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('dashboard')}>
<Shield size={20} />
<span>Smart Care</span>
</div>
<div style={currentView === 'cleanup' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('cleanup')}>
<Sparkles size={20} />
<span>Cleanup</span>
</div>
<div style={currentView === 'performance' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('performance')}>
<Activity size={20} />
<span>Performance</span>
</div>
<div style={currentView === 'community' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('community')}>
<Users size={20} />
<span>Community</span>
</div>
{/* Settings Button - Active */}
<div style={currentView === 'settings' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('settings')}>
<Settings size={20} />
<span>Settings</span>
</div>
<div style={{ flex: 1 }}></div>
{/* Global Stats at bottom */}
<MyStatsSidebar />
</div>

{/* Main Settings Content */}
<div style={{ 
  padding: '40px', 
  height: '100vh', 
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
}}>
{/* Header */}
<div style={{ marginBottom: '32px' }}>
<h1 style={{
fontSize: '36px',
fontWeight: '900',
color: 'white',
margin: '0 0 8px 0',
letterSpacing: '-1px',
textShadow: '0 0 0 1px rgba(31, 41, 55, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)'
}}>
Settings
</h1>
<p style={{ 
  color: '#6b7280', 
  fontSize: '16px', 
  margin: '0', 
  fontWeight: '500' 
}}>
Customize Memory Monster to protect your Mac's performance
</p>
</div>

{/* Scrollable Settings Content */}
<div style={{ 
  flex: 1, 
  overflow: 'auto',
  paddingRight: '8px'
}}>
<div style={{ 
  display: 'grid', 
  gridTemplateColumns: '2fr 1fr', 
  gap: '32px',
  marginBottom: '40px'
}}>
{/* Main Settings Card */}
<div style={cardStyle}>
{/* Account Section */}
<div style={{ marginBottom: '40px' }}>
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '12px', 
  marginBottom: '24px' 
}}>
<div style={{
  width: '32px',
  height: '32px',
  background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
<User size={18} color="white" />
</div>
<h3 style={{ 
  fontSize: '20px', 
  fontWeight: '800', 
  color: '#1f2937', 
  margin: '0' 
}}>
Account & Profile
</h3>
</div>

{/* Account Info */}
<div style={{
  background: 'rgba(114, 9, 183, 0.05)',
  border: '1px solid rgba(114, 9, 183, 0.1)',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '24px'
}}>
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between',
  marginBottom: '12px'
}}>
<div>
<div style={{ 
  fontSize: '16px', 
  fontWeight: '700', 
  color: '#1f2937',
  marginBottom: '4px'
}}>
user@example.com
</div>
<div style={{ 
  fontSize: '14px', 
  color: '#6b7280',
  fontWeight: '500'
}}>
Free Plan • Joined December 2024
</div>
</div>
<button style={{
  padding: '8px 16px',
  background: 'rgba(114, 9, 183, 0.1)',
  color: '#7209b7',
  border: '1px solid rgba(114, 9, 183, 0.2)',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}}
onMouseEnter={(e) => {
  e.target.style.background = 'rgba(114, 9, 183, 0.15)';
  e.target.style.transform = 'translateY(-1px)';
}}
onMouseLeave={(e) => {
  e.target.style.background = 'rgba(114, 9, 183, 0.1)';
  e.target.style.transform = 'translateY(0)';
}}
>
Edit Profile
</button>
</div>
</div>
</div>

{/* Memory Protection */}
<div style={{ marginBottom: '40px' }}>
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '12px', 
  marginBottom: '24px' 
}}>
<div style={{
  width: '32px',
  height: '32px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
<Shield size={18} color="white" />
</div>
<h3 style={{ 
  fontSize: '20px', 
  fontWeight: '800', 
  color: '#1f2937', 
  margin: '0' 
}}>
Memory Protection
</h3>
</div>

{/* Protection Settings */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
<SettingRow
title="Auto-scan weekly"
description="Automatically scan for memory monsters every week"
checked={autoScanWeekly}
onChange={() => setAutoScanWeekly(!autoScanWeekly)}
/>
<SettingRow
title="Real-time memory monitoring"
description="Monitor memory usage continuously in the background"
checked={realTimeMonitoring}
onChange={() => setRealTimeMonitoring(!realTimeMonitoring)}
/>
<SettingRow
title="Memory usage alerts"
description="Notify when memory usage exceeds 80%"
checked={memoryAlerts}
onChange={() => setMemoryAlerts(!memoryAlerts)}
/>
<SettingRow
title="Auto-minimize resolved issues"
description="Automatically collapse fixed memory issues"
checked={autoMinimize}
onChange={() => setAutoMinimize(!autoMinimize)}
/>
<SettingRow
title="Background memory liberation"
description="Automatically free memory when system is idle"
checked={backgroundLiberation}
onChange={() => setBackgroundLiberation(!backgroundLiberation)}
isPremium={true}
/>

{/* Scan Intensity Selector */}
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 0'
}}>
<div>
<div style={{ 
  fontSize: '16px', 
  fontWeight: '600', 
  color: '#1f2937',
  marginBottom: '4px'
}}>
Scan intensity
</div>
<div style={{ 
  fontSize: '14px', 
  color: '#6b7280' 
}}>
Choose how thoroughly Memory Monster scans your system
</div>
</div>
<select
value={scanIntensity}
onChange={(e) => setScanIntensity(e.target.value)}
style={{
padding: '8px 16px',
border: '1px solid rgba(114, 9, 183, 0.2)',
borderRadius: '8px',
background: 'white',
fontSize: '14px',
fontWeight: '500',
cursor: 'pointer',
outline: 'none'
}}
>
<option value="Light">Light</option>
<option value="Normal">Normal</option>
<option value="Deep">Deep</option>
</select>
</div>
</div>
</div>

{/* App Behavior */}
<div style={{ marginBottom: '40px' }}>
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '12px', 
  marginBottom: '24px' 
}}>
<div style={{
  width: '32px',
  height: '32px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
<Cpu size={18} color="white" />
</div>
<h3 style={{ 
  fontSize: '20px', 
  fontWeight: '800', 
  color: '#1f2937', 
  margin: '0' 
}}>
App Behavior
</h3>
</div>

<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
<SettingRow
title="Start at login"
description="Launch Memory Monster when you start your Mac"
checked={startAtLogin}
onChange={() => setStartAtLogin(!startAtLogin)}
/>
<SettingRow
title="Keep running in background"
description="Continue monitoring even when app is closed"
checked={keepRunning}
onChange={() => setKeepRunning(!keepRunning)}
/>
<SettingRow
title="Show in menu bar"
description="Display Memory Monster icon in the menu bar"
checked={showInMenuBar}
onChange={() => setShowInMenuBar(!showInMenuBar)}
/>
<SettingRow
title="Auto-update Memory Monster"
description="Automatically download and install updates"
checked={autoUpdate}
onChange={() => setAutoUpdate(!autoUpdate)}
/>

{/* Theme Selector */}
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 0'
}}>
<div>
<div style={{ 
  fontSize: '16px', 
  fontWeight: '600', 
  color: '#1f2937',
  marginBottom: '4px'
}}>
Appearance
</div>
<div style={{ 
  fontSize: '14px', 
  color: '#6b7280' 
}}>
Choose how Memory Monster looks
</div>
</div>
<select
value={theme}
onChange={(e) => setTheme(e.target.value)}
style={{
padding: '8px 16px',
border: '1px solid rgba(114, 9, 183, 0.2)',
borderRadius: '8px',
background: 'white',
fontSize: '14px',
fontWeight: '500',
cursor: 'pointer',
outline: 'none'
}}
>
<option value="Auto">Auto</option>
<option value="Light">Light</option>
<option value="Dark">Dark</option>
</select>
</div>
</div>
</div>

{/* Notifications */}
<div style={{ marginBottom: '40px' }}>
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '12px', 
  marginBottom: '24px' 
}}>
<div style={{
  width: '32px',
  height: '32px',
  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
<Bell size={18} color="white" />
</div>
<h3 style={{ 
  fontSize: '20px', 
  fontWeight: '800', 
  color: '#1f2937', 
  margin: '0' 
}}>
Notifications
</h3>
</div>

<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
<SettingRow
title="Liberation success notifications"
description="Get notified when memory is successfully freed"
checked={successNotifications}
onChange={() => setSuccessNotifications(!successNotifications)}
/>
<SettingRow
title="Weekly memory health reports"
description="Receive weekly summaries of your Mac's performance"
checked={weeklyReports}
onChange={() => setWeeklyReports(!weeklyReports)}
/>
<SettingRow
title="New memory monster alerts"
description="Alert when new memory-hogging apps are detected"
checked={monsterAlerts}
onChange={() => setMonsterAlerts(!monsterAlerts)}
/>
<SettingRow
title="Tips and optimization suggestions"
description="Get helpful tips to improve your Mac's performance"
checked={tips}
onChange={() => setTips(!tips)}
/>
</div>
</div>

{/* Advanced */}
<div>
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '12px', 
  marginBottom: '24px' 
}}>
<div style={{
  width: '32px',
  height: '32px',
  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
<Activity size={18} color="white" />
</div>
<h3 style={{ 
  fontSize: '20px', 
  fontWeight: '800', 
  color: '#1f2937', 
  margin: '0' 
}}>
Advanced
</h3>
</div>

<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
<SettingRow
title="Deep system scanning"
description="Scan deeper into system files and processes"
checked={deepScanning}
onChange={() => setDeepScanning(!deepScanning)}
isPremium={true}
/>
<SettingRow
title="Monitor external drives"
description="Include external drives in memory optimization"
checked={monitorExternal}
onChange={() => setMonitorExternal(!monitorExternal)}
/>
<SettingRow
title="Analytics & crash reports"
description="Help improve Memory Monster by sharing usage data"
checked={analytics}
onChange={() => setAnalytics(!analytics)}
/>

{/* Action Buttons */}
<div style={{
  display: 'flex',
  gap: '12px',
  paddingTop: '16px',
  borderTop: '1px solid rgba(107, 114, 128, 0.1)'
}}>
<button style={{
  padding: '10px 20px',
  background: 'rgba(107, 114, 128, 0.1)',
  color: '#6b7280',
  border: '1px solid rgba(107, 114, 128, 0.2)',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}}
onMouseEnter={(e) => {
  e.target.style.background = 'rgba(107, 114, 128, 0.15)';
}}
onMouseLeave={(e) => {
  e.target.style.background = 'rgba(107, 114, 128, 0.1)';
}}
>
<RotateCcw size={16} />
Reset Settings
</button>
<button style={{
  padding: '10px 20px',
  background: 'rgba(107, 114, 128, 0.1)',
  color: '#6b7280',
  border: '1px solid rgba(107, 114, 128, 0.2)',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}}
onMouseEnter={(e) => {
  e.target.style.background = 'rgba(107, 114, 128, 0.15)';
}}
onMouseLeave={(e) => {
  e.target.style.background = 'rgba(107, 114, 128, 0.1)';
}}
>
<FileText size={16} />
Export Logs
</button>
</div>
</div>
</div>
</div>

{/* Right Column - Premium & Upsells */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
{/* Premium Upgrade Card */}
<div style={{
  ...premiumCardStyle,
  background: `linear-gradient(135deg, #7209b7 0%, #533483 50%, #16213e 100%)`,
  color: 'white',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden'
}}>
{/* Animated background glow */}
<div style={{
  position: 'absolute',
  top: '-50%',
  left: '-50%',
  width: '200%',
  height: '200%',
  background: `conic-gradient(from 0deg, rgba(114, 9, 183, 0.3), rgba(83, 52, 131, 0.2), rgba(15, 52, 96, 0.1), rgba(114, 9, 183, 0.3))`,
  animation: 'smoothRotate 8s linear infinite',
  filter: 'blur(20px)',
  opacity: 0.6
}} />

<div style={{ position: 'relative', zIndex: 2 }}>
<div style={{
  width: '64px',
  height: '64px',
  background: 'rgba(255, 255, 255, 0.15)',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 20px auto',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)'
}}>
<Crown size={32} color="white" />
</div>

<h3 style={{
  fontSize: '24px',
  fontWeight: '800',
  margin: '0 0 12px 0',
  letterSpacing: '-0.5px'
}}>
Unlock Memory Monster Pro
</h3>

<p style={{
  fontSize: '16px',
  margin: '0 0 24px 0',
  fontWeight: '500',
  opacity: 0.9,
  lineHeight: '1.5'
}}>
Get unlimited memory liberation, real-time protection, and advanced optimization tools.
</p>

<div style={{
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '16px',
  margin: '0 0 24px 0',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.15)'
}}>
<div style={{
  fontSize: '14px',
  fontWeight: '600',
  marginBottom: '8px',
  opacity: 0.8
}}>
Pro Features:
</div>
<div style={{
  fontSize: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  textAlign: 'left'
}}>
<div>✨ Background memory liberation</div>
<div>🔍 Deep system scanning</div>
<div>📊 Advanced analytics</div>
<div>🚀 Priority support</div>
</div>
</div>

<button style={{
  width: '100%',
  padding: '16px 24px',
  background: 'rgba(255, 255, 255, 0.15)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
}}
onMouseEnter={(e) => {
  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
  e.target.style.transform = 'translateY(-2px)';
  e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
}}
onMouseLeave={(e) => {
  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
  e.target.style.transform = 'translateY(0)';
  e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
}}
>
Upgrade to Pro
</button>
</div>
</div>

{/* System Monitor Card */}
<div style={cardStyle}>
<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px'
}}>
<div style={{
  width: '32px',
  height: '32px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
<Activity size={18} color="white" />
</div>
<h4 style={{
  fontSize: '18px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0'
}}>
System Status
</h4>
</div>

<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
}}>
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}}>
<span style={{ fontSize: '14px', color: '#6b7280' }}>Memory Usage</span>
<span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>78%</span>
</div>
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}}>
<span style={{ fontSize: '14px', color: '#6b7280' }}>CPU Usage</span>
<span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>23%</span>
</div>
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}}>
<span style={{ fontSize: '14px', color: '#6b7280' }}>Storage Available</span>
<span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>156GB</span>
</div>
</div>

<button style={{
  width: '100%',
  padding: '12px',
  background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '16px',
  transition: 'all 0.2s ease'
}}
onMouseEnter={(e) => {
  e.target.style.transform = 'translateY(-1px)';
  e.target.style.boxShadow = '0 4px 12px rgba(114, 9, 183, 0.3)';
}}
onMouseLeave={(e) => {
  e.target.style.transform = 'translateY(0)';
  e.target.style.boxShadow = 'none';
}}
>
View Detailed Stats
</button>
</div>

{/* Help & Support Card */}
<div style={cardStyle}>
<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px'
}}>
<div style={{
  width: '32px',
  height: '32px',
  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
<HelpCircle size={18} color="white" />
</div>
<h4 style={{
  fontSize: '18px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0'
}}>
Help & Support
</h4>
</div>

<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
}}>
<button style={{
  padding: '12px 16px',
  background: 'rgba(114, 9, 183, 0.05)',
  color: '#7209b7',
  border: '1px solid rgba(114, 9, 183, 0.1)',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all 0.2s ease'
}}
onMouseEnter={(e) => {
  e.target.style.background = 'rgba(114, 9, 183, 0.1)';
}}
onMouseLeave={(e) => {
  e.target.style.background = 'rgba(114, 9, 183, 0.05)';
}}
>
User Guide
<ExternalLink size={16} />
</button>
<button style={{
  padding: '12px 16px',
  background: 'rgba(114, 9, 183, 0.05)',
  color: '#7209b7',
  border: '1px solid rgba(114, 9, 183, 0.1)',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all 0.2s ease'
}}
onMouseEnter={(e) => {
  e.target.style.background = 'rgba(114, 9, 183, 0.1)';
}}
onMouseLeave={(e) => {
  e.target.style.background = 'rgba(114, 9, 183, 0.05)';
}}
>
Contact Support
<ExternalLink size={16} />
</button>
<button style={{
  padding: '12px 16px',
  background: 'rgba(114, 9, 183, 0.05)',
  color: '#7209b7',
  border: '1px solid rgba(114, 9, 183, 0.1)',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all 0.2s ease'
}}
onMouseEnter={(e) => {
  e.target.style.background = 'rgba(114, 9, 183, 0.1)';
}}
onMouseLeave={(e) => {
  e.target.style.background = 'rgba(114, 9, 183, 0.05)';
}}
>
Privacy Policy
<ExternalLink size={16} />
</button>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
)}
{/* SCANNING RESULTS VIEW */}
{currentView === 'scanning' && (
<div style={mainContentStyle}>
{/* Sidebar */}
<div style={sidebarStyle}>
<div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', padding: '0 4px' }}>
<div style={{ width: '48px', height: '48px', background: `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
<FirefoxLogo size={32} />
</div>
<div>
<h2 style={{ color: 'white', fontSize: '18px', fontWeight: '800', margin: '0 0 2px 0' }}>Memory Monster</h2>
<p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: '0', fontWeight: '500' }}>System Liberation Hub</p>
</div>
</div>
{/* Free Edition Banner */}
<div style={{
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1))',
border: '1px solid rgba(255, 255, 255, 0.2)',
borderRadius: '12px',
padding: '8px 16px',
margin: '0 4px',
position: 'relative',
overflow: 'hidden'
}}>
{/* Subtle glow effect */}
<div style={{
position: 'absolute',
top: 0,
left: 0,
right: 0,
bottom: 0,
background: 'linear-gradient(135deg, rgba(114, 9, 183, 0.1), rgba(83, 52, 131, 0.05))',
borderRadius: '12px'
}} />
<div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
<span style={{ fontSize: '16px' }}>🆓</span>
<span style={{
color: 'rgba(255, 255, 255, 0.9)',
fontSize: '12px',
fontWeight: '700',
textTransform: 'uppercase',
letterSpacing: '0.5px'
}}>
Free Edition
</span>
</div>
</div>
<div style={currentView === 'dashboard' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('dashboard')}>
<Shield size={20} />
<span>Smart Care</span>
</div>
<div style={currentView === 'cleanup' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('cleanup')}>
<Sparkles size={20} />
<span>Cleanup</span>
</div>
<div style={currentView === 'performance' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('performance')}>
<Activity size={20} />
<span>Performance</span>
</div>
<div style={currentView === 'community' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('community')}>
<Users size={20} />
<span>Community</span>
</div>
{/* Settings Button - Left Aligned */}
<div style={currentView === 'settings' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setCurrentView('settings')}>
<Settings size={18} />
<span>Settings</span>
</div>
<div style={{ flex: 1 }}></div>
{/* My Stats - Show only after first fix */}
{hasCompletedFirstFix && (
<div style={{ padding: '24px', background: `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)`, borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.18)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
{/* Static background glow - no animation */}
<div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `conic-gradient(from 0deg, rgba(114, 9, 183, 0.1), rgba(83, 52, 131, 0.05), rgba(15, 52, 96, 0.03), rgba(114, 9, 183, 0.1))`, opacity: 0.6 }}></div>
<div style={{ position: 'relative', zIndex: 2 }}>
<div style={{ fontSize: '32px', marginBottom: '12px' }}>👤</div>
<div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>My Stats</div>
{/* Start Scan Button instead of ticker for first time */}
{!scanComplete ? (
<button
onClick={handleScan}
style={{
padding: '12px 24px',
background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
color: 'white',
border: 'none',
borderRadius: '16px',
fontSize: '14px',
fontWeight: '700',
cursor: 'pointer',
transition: 'all 0.2s ease',
margin: '8px 0 16px 0'
}}
onMouseEnter={(e) => {
e.target.style.transform = 'scale(1.05)';
}}
onMouseLeave={(e) => {
e.target.style.transform = 'scale(1)';
}}
>
Start Scan
</button>
) : (
<>
<div style={{
color: 'white',
fontSize: '18px',
fontWeight: '800',
marginBottom: '4px',
fontFamily: 'SF Mono, Consolas, monospace'
}}>
{totalMemoryFreed.toFixed(1)}GB
</div>
<div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', fontWeight: '500', marginBottom: '16px' }}>Memory Saved</div>
</>
)}
{/* Stats Row */}
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<div>
<div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>1st</div>
<div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>Scan</div>
</div>
<div>
<div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>New</div>
<div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>User</div>
</div>
<div>
<div style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>
{issues.filter(i => i.fixed).length}
</div>
<div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>Issues Solved</div>
</div>
</div>
</div>
</div>
)}
</div>

{/* Main Content */}
<div style={{
padding: '40px 40px 40px 40px',
overflow: 'hidden',
display: 'grid',
gridTemplateColumns: '1fr 400px',
gap: '40px',
height: 'calc(100vh - 80px)',
gridTemplateRows: '1fr'
}}>
{/* LEFT COLUMN - Main Results Card */}
<div style={{
...premiumCardStyle,
height: 'calc(100vh - 120px)',
display: 'flex',
flexDirection: 'column',
position: 'relative',
minHeight: 0,
marginTop: '0'
}}>
{/* Scanning State */}
{!scanComplete && (
<div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
<div style={{ width: '120px', height: '120px', margin: '0 auto 24px auto', background: `linear-gradient(135deg, rgba(114, 9, 183, 0.9) 0%, rgba(83, 52, 131, 0.8) 100%)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: `0 20px 40px rgba(114, 9, 183, 0.3), 0 0 0 6px rgba(114, 9, 183, 0.1), 0 0 0 12px rgba(83, 52, 131, 0.05)`, animation: 'logoSpin 4s linear infinite' }}>
<FirefoxLogo size={80} />
</div>
<h2 style={{ fontSize: '28px', fontWeight: '900', background: `linear-gradient(135deg, #7209b7 0%, #533483 50%, #16213e 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>Memory Monster is Scanning! 🛡️</h2>
<p style={{ color: '#6b7280', fontSize: '16px', margin: '0 0 24px 0', fontWeight: '500', lineHeight: '1.5', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>Finding memory monsters and locating trapped memory across your Mac...</p>
{isScanning && (
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '20px 0' }}>
<div style={{ width: '20px', height: '20px', border: '2px solid rgba(114, 9, 183, 0.3)', borderTop: '2px solid #7209b7', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
<span style={{ color: '#7209b7', fontWeight: '600' }}>Scanning for memory monsters...</span>
</div>
)}
</div>
)}
{/* SCROLLABLE Issues List */}
{scanComplete && (
<div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
<div style={{ marginBottom: '24px' }}>
{/* Top Row - Icon, Title, and Amount */}
<div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
<div style={{ width: '56px', height: '56px', background: `linear-gradient(135deg, #7209b7 0%, #533483 100%)`, borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 32px rgba(114, 9, 183, 0.3)' }}>
<Sparkles size={28} color="white" />
</div>
<div style={{ flex: 1 }}>
<h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1f2937', margin: '0 0 4px 0' }}>
{issues.every(i => i.fixed) ? 'Memory Monsters Defeated' : 'Memory Monsters Detected'}
</h3>
<p style={{ color: '#6b7280', margin: '0', fontSize: '16px' }}>
{issues.every(i => i.fixed)
? `You've unburdened your Mac from ${issues.length} memory thieves hogging ${issues.reduce((sum, issue) => sum + issue.storage, 0).toFixed(1)}GB of memory`
: `Found ${issues.length} memory thieves hoarding your system resources`
}
</p>
</div>
<div style={{ textAlign: 'right' }}>
<div style={{ fontSize: '32px', fontWeight: '900', background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{Math.max(0, remainingMemory).toFixed(1)}GB</div>
<div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>held hostage</div>
</div>
</div>
{/* Progress Bar */}
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
<div>
<span style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>Memory Freed</span>
<div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{totalMemoryFreed.toFixed(1)}GB freed • {Math.max(0, remainingMemory).toFixed(1)}GB remaining</div>
</div>
<span style={{ fontSize: '16px', fontWeight: '800', color: '#7209b7' }}>{calculateProgress()}% Complete</span>
</div>
<div style={{ width: '100%', height: '12px', background: 'rgba(114, 9, 183, 0.1)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(114, 9, 183, 0.1) inset' }}>
<div style={{ width: `${calculateProgress()}%`, height: '100%', background: `linear-gradient(90deg, #7209b7 0%, #533483 30%, #16213e 70%, #0f3460 100%)`, borderRadius: '16px', boxShadow: '0 0 16px rgba(114, 9, 183, 0.5)', transition: 'width 0.8s ease-out', position: 'relative' }}>
<div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)', animation: calculateProgress() > 0 ? 'shimmer 2s ease-in-out infinite' : 'none' }}></div>
</div>
</div>
{/* Clear All Button */}
{issues.some(issue => !issue.fixed) && (
<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
<button
onClick={handleUnlockAll}
style={{
padding: '12px 24px',
background: `linear-gradient(135deg, #7209b7 0%, #533483 50%, #16213e 100%)`,
color: 'white',
border: 'none',
borderRadius: '16px',
fontSize: '14px',
fontWeight: '700',
cursor: 'pointer',
boxShadow: '0 8px 24px rgba(114, 9, 183, 0.35)',
transition: 'all 0.3s ease',
display: 'flex',
alignItems: 'center',
gap: '8px'
}}
onMouseEnter={(e) => {
e.target.style.transform = 'translateY(-2px) scale(1.02)';
e.target.style.boxShadow = '0 12px 32px rgba(114, 9, 183, 0.45)';
}}
onMouseLeave={(e) => {
e.target.style.transform = 'translateY(0) scale(1)';
e.target.style.boxShadow = '0 8px 24px rgba(114, 9, 183, 0.35)';
}}
>
<Sparkles size={16} />
Clear All {issues.filter(i => !i.fixed).reduce((sum, issue) => sum + issue.storage, 0).toFixed(1)}GB
</button>
</div>
)}
</div>
{/* PROPERLY SCROLLABLE Issues Container */}
<div style={{
height: 'calc(100% - 120px)',
overflowY: 'auto',
paddingRight: '8px',
scrollBehavior: 'smooth',
maxHeight: '60vh'
}}>
<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
{issues.map((issue) => (
<div key={issue.id} style={{
...getSeverityStyle(issue.severity),
padding: minimizedIssues[issue.id] ? '12px 20px' : (issue.fixed ? '16px 24px' : '24px'),
opacity: issue.fixed ? 0.7 : 1,
transform: minimizedIssues[issue.id] ? 'scale(1)' : (issue.fixed ? 'scale(0.95)' : 'scale(1)'),
transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
position: 'relative',
height: minimizedIssues[issue.id] ? '60px' : 'auto',
overflow: 'hidden'
}}>
{minimizedIssues[issue.id] ? (
<div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '36px' }}>
<AppLogo app={issue.app} size={36} />
<div style={{ flex: 1 }}>
<h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', margin: '0' }}>{issue.title}</h4>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '14px', fontWeight: '600' }}>
<CheckCircle size={16} />
{issue.storage}GB freed!
</div>
</div>
) : (
<>
{issue.fixed && !minimizedIssues[issue.id] && (
<div style={{ position: 'absolute', top: '12px', right: '16px', width: '32px', height: '32px', background: 'linear-gradient(135deg, #7209b7, #533483)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(114, 9, 183, 0.4)' }}>
<CheckCircle size={18} color="white" />
</div>
)}
{/* Top Row: App Icon, Title, and Action Button */}
<div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
<AppLogo app={issue.app} size={56} />
<div style={{ flex: 1 }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
<h4 style={{ fontSize: '20px', fontWeight: '800', color: '#1f2937', margin: '0' }}>{issue.title}</h4>
<div style={{
padding: '4px 12px',
borderRadius: '12px',
fontSize: '12px',
fontWeight: '700',
background: issue.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : issue.severity === 'high' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
color: issue.severity === 'critical' ? '#ef4444' : issue.severity === 'high' ? '#f59e0b' : '#3b82f6'
}}>
{issue.severity.toUpperCase()}
</div>
</div>
{/* Last optimized on same line */}
<div style={{ fontSize: '13px', color: '#6b7280' }}>
{issue.lastOptimized && `Last optimized: ${issue.lastOptimized}`}
{issue.fileCount && ` • 📁 ${issue.fileCount}`}
{issue.processCount && ` • ⚡ ${issue.processCount}`}
</div>
</div>
{/* Action Button - Same Row */}
<div style={{ flexShrink: 0 }}>
{getFixingContent(fixingStates[issue.id], issue)}
</div>
</div>
{/* Description */}
<p style={{ color: '#374151', margin: '0 0 16px 0', lineHeight: '1.5', fontSize: '15px', paddingLeft: '72px' }}>{issue.description}</p>
{/* Stats Row */}
<div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingLeft: '72px' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
<div style={{ width: '8px', height: '8px', background: '#7209b7', borderRadius: '50%' }}></div>
<span style={{ fontSize: '14px', color: '#7209b7', fontWeight: '700' }}>{issue.storage}{issue.storageUnit} can be freed</span>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
<Users size={14} color="#533483" />
<span style={{ fontSize: '14px', color: '#533483', fontWeight: '600' }}>{issue.userCount} users</span>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
<TrendingUp size={14} color="#6b7280" />
<span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>{issue.totalFreed} freed globally</span>
</div>
</div>
</>
)}
</div>
))}
</div>
</div>
</div>
)}
</div>

{/* RIGHT COLUMN - Fixed Height Sidebars */}
<div style={{
display: 'flex',
flexDirection: 'column',
gap: '32px',
height: 'calc(100vh - 120px)',
overflow: 'hidden'
}}>
{/* Byte Assistant - Fixed Height */}
<div style={{
...cardStyle,
height: 'calc(100vh - 160px)',
display: 'flex',
flexDirection: 'column',
minHeight: 0,
borderRadius: '20px'
}}>
<div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexShrink: 0 }}>
<div style={{ width: '48px', height: '48px', background: `linear-gradient(135deg, #7209b7 0%, #533483 100%)`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(114, 9, 183, 0.3)' }}>
<span style={{ fontSize: '24px' }}>🤖</span>
</div>
<div>
<h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1f2937', margin: '0 0 2px 0' }}>Byte</h4>
<p style={{ fontSize: '14px', color: '#6b7280', margin: '0', fontWeight: '500' }}>Your memory liberation companion</p>
</div>
<div style={{ marginLeft: 'auto', width: '12px', height: '12px', background: '#7209b7', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
</div>
{/* Messages Area - Scrollable */}
<div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', paddingRight: '8px', minHeight: 0 }}>
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
{atlasMessages.map((message, index) => (
<div key={index} style={{
padding: '16px 20px',
borderRadius: '16px',
background: message.startsWith('You:')
? 'linear-gradient(135deg, #7209b7, #533483)'
: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
color: message.startsWith('You:') ? 'white' : '#1f2937',
fontSize: '14px',
lineHeight: '1.5',
boxShadow: message.startsWith('You:')
? '0 8px 24px rgba(114, 9, 183, 0.3)'
: '0 4px 12px rgba(0, 0, 0, 0.05)',
fontWeight: '500',
maxWidth: message.startsWith('You:') ? '85%' : '100%',
marginLeft: message.startsWith('You:') ? 'auto' : '0',
position: 'relative',
border: message.startsWith('You:') ? 'none' : '1px solid rgba(114, 9, 183, 0.1)'
}}>
{!message.startsWith('You:') && (
<div style={{ position: 'absolute', top: '-8px', left: '16px', width: '16px', height: '16px', background: '#7209b7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
<span style={{ fontSize: '8px' }}>🤖</span>
</div>
)}
{message}
</div>
))}
<div ref={messagesEndRef} />
</div>
</div>
{/* Input Area - Fixed at Bottom */}
<div style={{ display: 'flex', gap: '12px', padding: '16px', background: 'rgba(248, 250, 252, 0.5)', borderRadius: '16px', border: '1px solid rgba(114, 9, 183, 0.1)', flexShrink: 0 }}>
<input
type="text"
value={userInput}
onChange={(e) => setUserInput(e.target.value)}
onKeyPress={handleKeyPress}
placeholder="Ask Byte anything about memory liberation..."
style={{
flex: 1,
padding: '12px 16px',
border: '1px solid rgba(114, 9, 183, 0.2)',
borderRadius: '12px',
background: 'rgba(255, 255, 255, 0.9)',
fontSize: '14px',
outline: 'none',
transition: 'all 0.3s ease',
fontWeight: '500'
}}
onFocus={(e) => {
e.target.style.borderColor = '#7209b7';
e.target.style.boxShadow = '0 0 0 3px rgba(114, 9, 183, 0.1)';
}}
onBlur={(e) => {
e.target.style.borderColor = 'rgba(114, 9, 183, 0.2)';
e.target.style.boxShadow = 'none';
}}
/>
<button
onClick={handleSendMessage}
style={{
padding: '12px 16px',
background: `linear-gradient(135deg, #7209b7 0%, #533483 100%)`,
color: 'white',
border: 'none',
borderRadius: '12px',
cursor: 'pointer',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
boxShadow: '0 4px 12px rgba(114, 9, 183, 0.3)',
transition: 'all 0.3s ease'
}}
onMouseEnter={(e) => {
e.target.style.transform = 'translateY(-2px)';
e.target.style.boxShadow = '0 8px 24px rgba(114, 9, 183, 0.4)';
}}
onMouseLeave={(e) => {
e.target.style.transform = 'translateY(0)';
e.target.style.boxShadow = '0 4px 12px rgba(114, 9, 183, 0.3)';
}}
>
<Send size={16} />
</button>
</div>
</div>
</div>
</div>
</div>
)}
     
     {/* CSS Animations */}
     <style>{`
       @keyframes spin {
         0% { transform: rotate(0deg); }
         100% { transform: rotate(360deg); }
       }
       
       @keyframes pulse {
         0%, 100% { opacity: 1; transform: scale(1); }
         50% { opacity: 0.8; transform: scale(1.05); }
       }
       
       @keyframes heartbeat {
         0%, 100% { transform: scale(1); }
         14% { transform: scale(1.1); }
         28% { transform: scale(1); }
         42% { transform: scale(1.1); }
         70% { transform: scale(1); }
       }
       
       @keyframes rotate {
         0% { transform: rotate(0deg); }
         100% { transform: rotate(360deg); }
       }
       
       @keyframes loadingBar {
         0% { width: 0%; }
         50% { width: 100%; }
         100% { width: 0%; }
       }
       
       @keyframes fadeInOut {
         0% { opacity: 1; }
         100% { opacity: 0.6; }
       }
       
       @keyframes float {
         0%, 100% { transform: translateY(0px); }
         50% { transform: translateY(-20px); }
       }
       
       @keyframes confetti {
         0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
         100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
       }
       
       @keyframes gentlePulse {
         0%, 100% { transform: scale(1); box-shadow: 0 20px 60px rgba(16, 185, 129, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.8), 0 0 0 8px rgba(16, 185, 129, 0.2); }
         50% { transform: scale(1.02); box-shadow: 0 24px 72px rgba(16, 185, 129, 0.5), 0 0 0 6px rgba(255, 255, 255, 0.9), 0 0 0 12px rgba(16, 185, 129, 0.3); }
       }
       
       @keyframes logoSpin {
         0% { transform: rotate(0deg); }
         100% { transform: rotate(360deg); }
       }
       
       @keyframes success {
         0% { transform: scale(0.8); opacity: 0; }
         50% { transform: scale(1.1); }
         100% { transform: scale(1); opacity: 1; }
       }
       
       @keyframes shimmer {
         0% { transform: translateX(-100%); }
         100% { transform: translateX(100%); }
       }
       
       @keyframes slideIn {
         0% { transform: translateY(20px); opacity: 0; }
         100% { transform: translateY(0); opacity: 1; }
       }
       
       @keyframes fadeIn {
         0% { opacity: 0; }
         100% { opacity: 1; }
       }
       
       @keyframes slideUp {
         0% { transform: translateY(30px); opacity: 0; }
         100% { transform: translateY(0); opacity: 1; }
       }
       
       @keyframes sparkle {
         0%, 100% { opacity: 0.5; transform: scale(1); }
         50% { opacity: 1; transform: scale(1.2); }
       }
         @keyframes smoothFloat {
         0%, 100% { transform: translateY(0px); }
         50% { transform: translateY(-15px); }
       }
       
       @keyframes smoothPulse {
         0%, 100% { transform: scale(1); opacity: 1; }
         50% { transform: scale(1.05); opacity: 0.9; }
       }
       
       @keyframes smoothRotate {
         0% { transform: rotate(0deg); }
         100% { transform: rotate(360deg); }
       }
       
       @keyframes smoothSparkle {
         0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
         50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
       }
         @keyframes smoothSparkle {
  0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}

@keyframes fastPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}
       
       /* Scrollbar Styling */
       ::-webkit-scrollbar {
         width: 8px;
       }
       
       ::-webkit-scrollbar-track {
         background: rgba(16, 185, 129, 0.1);
         border-radius: 12px;
       }
       
       ::-webkit-scrollbar-thumb {
         background: rgba(16, 185, 129, 0.3);
         border-radius: 12px;
         transition: background 0.3s ease;
       }
       
       ::-webkit-scrollbar-thumb:hover {
         background: rgba(16, 185, 129, 0.5);
       }
       
       /* Firefox scrollbar */
       * {
         scrollbar-width: thin;
         scrollbar-color: rgba(16, 185, 129, 0.3) rgba(16, 185, 129, 0.1);
       }
       
       /* Focus states for accessibility */
       button:focus-visible {
         outline: 2px solid #10b981;
         outline-offset: 2px;
       }
       
       input:focus-visible {
         outline: 2px solid #10b981;
         outline-offset: 2px;
       }
     `}</style>
    </div>
  );
};

export default MacOptimizerApp;
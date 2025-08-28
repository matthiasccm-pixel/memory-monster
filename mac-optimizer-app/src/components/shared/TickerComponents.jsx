import React, { useState, useEffect } from 'react';

// ===== TRULY PERSISTENT FLAGS USING SESSIONSTORAGE =====
const getSessionFlag = (key) => sessionStorage.getItem(key) === 'true';
const setSessionFlag = (key) => sessionStorage.setItem(key, 'true');

export const OneTimeTickerNumber = ({ value, suffix = '', style = {}, id = 'ticker' }) => {
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

export const OneTimeAbbreviatedTicker = ({ targetValue, targetDisplay, style = {}, id = 'abbrevTicker' }) => {
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
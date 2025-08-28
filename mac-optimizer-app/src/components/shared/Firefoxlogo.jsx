import React from 'react';

const Firefoxlogo = ({ size = 32 }) => (
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

export default Firefoxlogo;
import React from 'react';

const AppLogo = ({ app, appId, size = 48 }) => {
  // Use app prop first, then appId, then fallback
  const appName = app || appId || 'Unknown';
  
  // Map common app identifiers to standardized names
  const appNameMapping = {
    'com.google.Chrome': 'Chrome',
    'com.spotify.client': 'Spotify', 
    'com.whatsapp.WhatsApp': 'WhatsApp',
    'com.apple.Safari': 'Safari',
    'com.tinyspeck.slackmacgap': 'Slack',
    'com.microsoft.teams': 'Teams',
    'com.zoom.xos': 'Zoom',
    'org.mozilla.firefox': 'Firefox',
    'com.adobe.Photoshop': 'Photoshop',
    'com.figma.Desktop': 'Figma',
    'com.apple.mail': 'Mail',
    'com.apple.Photos': 'Photos',
    // Add more as needed - this scales to 250+ easily
  };

  // Get the clean app name
  const cleanAppName = appNameMapping[appName] || appName;

  // Try to load app icon from multiple sources
  const getAppIcon = (appName) => {
    const sources = [
      // Option 1: Local icons folder (best performance)
      `/icons/apps/${appName.toLowerCase()}.png`,
      
      // Option 2: CDN with app icons (macOS app icons database)
      `https://cdn.jsdelivr.net/gh/get-icon/geticon@main/icons/${appName.toLowerCase()}.svg`,
      
      // Option 3: Alternative icon service
      `https://logo.clearbit.com/${appName.toLowerCase()}.com`,
      
      // Option 4: Fallback to generated icon
      null
    ];
    
    return sources[0]; // For now, use local icons
  };

  // Color scheme for fallback icons based on app name
  const getAppColors = (appName) => {
    const colors = {
      'Chrome': { bg: '#4285F4', text: '#fff' },
      'Safari': { bg: '#006CFF', text: '#fff' },
      'Spotify': { bg: '#1DB954', text: '#fff' },
      'WhatsApp': { bg: '#25D366', text: '#fff' },
      'Slack': { bg: '#4A154B', text: '#fff' },
      'Teams': { bg: '#6264A7', text: '#fff' },
      'Zoom': { bg: '#2D8CFF', text: '#fff' },
      'Firefox': { bg: '#FF7139', text: '#fff' },
      'Photoshop': { bg: '#31A8FF', text: '#fff' },
      'Figma': { bg: '#F24E1E', text: '#fff' },
      'Mail': { bg: '#007AFF', text: '#fff' },
      'Photos': { bg: '#FFCC02', text: '#000' },
    };
    
    // Fallback to hash-based color if app not in list
    if (!colors[appName]) {
      const hash = appName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const hue = Math.abs(hash) % 360;
      return {
        bg: `hsl(${hue}, 70%, 50%)`,
        text: '#fff'
      };
    }
    
    return colors[appName];
  };

  const iconUrl = getAppIcon(cleanAppName);
  const colors = getAppColors(cleanAppName);
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Fallback icon component
  const FallbackIcon = () => (
    <div style={{ 
      width: size,
      height: size,
      background: colors.bg,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.4,
      color: colors.text,
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle gradient overlay for premium feel */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
        borderRadius: '12px'
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>
        {cleanAppName && cleanAppName.length > 0 ? cleanAppName[0].toUpperCase() : '?'}
      </span>
    </div>
  );

  // If no icon URL or image failed to load, show fallback
  if (!iconUrl || imageError) {
    return <FallbackIcon />;
  }

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Show fallback while loading */}
      {!imageLoaded && <FallbackIcon />}
      
      {/* Actual app icon */}
      <img
        src={iconUrl}
        alt={`${cleanAppName} icon`}
        width={size}
        height={size}
        style={{
          borderRadius: '12px',
          opacity: imageLoaded ? 1 : 0,
          position: imageLoaded ? 'static' : 'absolute',
          transition: 'opacity 0.3s ease'
        }}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default AppLogo;
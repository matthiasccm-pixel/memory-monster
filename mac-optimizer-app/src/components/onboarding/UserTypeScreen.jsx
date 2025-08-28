import React, { useState } from 'react';

const UserTypeScreen = ({ onContinue }) => {
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
      <div style={{ ...cardStyle, maxWidth: '800px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#1f2937', margin: '0 0 16px 0', letterSpacing: '-1.5px' }}>
          Welcome to Memory Monster
        </h1>
        <p style={{ color: '#6b7280', fontSize: '19px', margin: '0 0 40px 0', fontWeight: '500', lineHeight: '1.5', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
          Your Mac has hidden speed trapped by memory-hungry apps. Tell us what you do so we can unlock your computer's full potential.
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
            onClick={() => onContinue('diskAccess')}
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
                onContinue('appShowcase');
              } else {
                onContinue('diskAccess');
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
{selectedTypes.length > 0 ? 'Show My Speed Potential' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeScreen;
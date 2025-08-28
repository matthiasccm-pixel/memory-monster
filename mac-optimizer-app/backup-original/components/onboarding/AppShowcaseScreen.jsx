import React, { useState } from 'react';
import { openUpgradePage } from '../../utils/upgradeUtils.js';

const AppShowcaseScreen = ({ onContinue, openExternalLink }) => {
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
            onClick={openUpgradePage}
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
            onClick={() => onContinue('diskAccess')}
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

export default AppShowcaseScreen;
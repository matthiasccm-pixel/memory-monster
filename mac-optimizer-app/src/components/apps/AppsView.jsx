import React, { useState, useEffect } from 'react';
import { Package, Lock, Crown, Activity, Settings, Zap, Shield, Cpu, Monitor, TrendingUp, TrendingDown, ChevronDown, Sparkles } from 'lucide-react';
import { useFeatureGate } from '../../core/licensing/useFeatureGate.js';
import Firefoxlogo from '../shared/Firefoxlogo.jsx';
import CommunityStats from '../shared/CommunityStats.jsx';
import { openUpgradePage } from '../../utils/upgradeUtils.js';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const AppsView = ({ currentView, setCurrentView }) => {
  // FIXED: Get both isFree AND isPro
  const { isFree, isPro } = useFeatureGate();
  
  // State for learning intelligence data
  const [learningData, setLearningData] = useState(null);
  const [speedData, setSpeedData] = useState([]);
  const [appIntelligence, setAppIntelligence] = useState({});
  const [loading, setLoading] = useState(true);

  // Handle unlock full version
  const handleUnlockFullVersion = () => {
    openUpgradePage();
  };

  // Free tier apps (from FeatureGate.js) - including macOS System
  const freeApps = [
    { id: 'com.apple.macOS', name: 'macOS System', icon: '🖥️', category: 'System', isSystem: true },
    { id: 'com.google.Chrome', name: 'Chrome', icon: '🌐', category: 'Browser' },
    { id: 'com.apple.Safari', name: 'Safari', icon: '🧭', category: 'Browser' },
    { id: 'com.spotify.client', name: 'Spotify', icon: '🎵', category: 'Media' },
    { id: 'com.tinyspeck.slackmacgap', name: 'Slack', icon: '💬', category: 'Communication' },
    { id: 'com.whatsapp.WhatsApp', name: 'WhatsApp', icon: '💚', category: 'Communication' },
    { id: 'com.zoom.xos', name: 'Zoom', icon: '📹', category: 'Communication' },
    { id: 'com.microsoft.teams', name: 'Teams', icon: '💼', category: 'Communication' },
    { id: 'com.apple.mail', name: 'Mail', icon: '📧', category: 'Productivity' },
    { id: 'com.apple.Photos', name: 'Photos', icon: '📸', category: 'Media' },
    { id: 'org.mozilla.firefox', name: 'Firefox', icon: '🦊', category: 'Browser' }
  ];

  // Mock apps data for Pro users - including enhanced System app
  const mockApps = [
    { name: 'macOS System', icon: '🖥️', category: 'System', processes: 25, memoryMB: 3500, optimizable: true, isSystem: true, systemOptimizations: ['WindowServer Reset', 'Cache Purge', 'Memory Compression'] },
    { name: 'Chrome', icon: '🌐', category: 'Browser', processes: 12, memoryMB: 2840, optimizable: true },
    { name: 'Slack', icon: '💬', category: 'Communication', processes: 4, memoryMB: 1250, optimizable: true },
    { name: 'Adobe Photoshop', icon: '🎨', category: 'Creative', processes: 8, memoryMB: 3200, optimizable: true, premium: true },
    { name: 'VS Code', icon: '💻', category: 'Development', processes: 6, memoryMB: 1580, optimizable: true },
    { name: 'Spotify', icon: '🎵', category: 'Media', processes: 3, memoryMB: 890, optimizable: false },
    { name: 'Figma', icon: '🎨', category: 'Design', processes: 5, memoryMB: 1920, optimizable: true, premium: true },
    { name: 'Docker', icon: '🐳', category: 'Development', processes: 15, memoryMB: 4100, optimizable: true, premium: true },
    { name: 'Teams', icon: '💼', category: 'Communication', processes: 7, memoryMB: 1680, optimizable: true }
  ];

  // Fetch learning intelligence data
  useEffect(() => {
    const fetchLearningIntelligence = async () => {
      try {
        // Simulate fetching learning data from our intelligence system
        // In real implementation, this would connect to the learning database
        const mockLearningData = {
          totalSpeedGain: 42.8,
          weeklyTrend: '+12%',
          totalMemoryFreed: 3240,
          optimizedApps: isFree ? 10 : 47,
          avgSessionSpeed: 2.3
        };
        
        // Generate daily speed data for the last 7 days
        const mockSpeedData = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return {
            date: date.toISOString().split('T')[0],
            speed: 1.8 + Math.random() * 0.8 + (i * 0.1), // Trending upward
            memory: 2800 + Math.random() * 800,
            apps: Math.floor(8 + Math.random() * 5)
          };
        });
        
        // Generate app-specific intelligence
        const mockAppIntelligence = {};
        freeApps.forEach(app => {
          if (app.isSystem) {
            // Special enhanced intelligence for macOS System
            mockAppIntelligence[app.id] = {
              memoryFreedMB: Math.floor(800 + Math.random() * 1200), // 800MB-2GB potential
              speedGainPercent: Math.floor(25 + Math.random() * 35), // Higher gains from system optimization
              successRate: Math.floor(90 + Math.random() * 8),
              lastOptimized: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
              optimalTime: Math.floor(9 + Math.random() * 8),
              personalizedTip: generatePersonalizedTip(app.name),
              recentOptimizations: Math.floor(5 + Math.random() * 10),
              osVersion: 'macOS Sonoma 14.6.1',
              systemIssues: ['WindowServer Memory Leak', 'Spotlight Index Bloat', 'Control Center Cache'],
              estimatedSystemSavings: Math.floor(1500 + Math.random() * 2000)
            };
          } else {
            mockAppIntelligence[app.id] = {
              memoryFreedMB: Math.floor(200 + Math.random() * 500),
              speedGainPercent: Math.floor(15 + Math.random() * 25),
              successRate: Math.floor(85 + Math.random() * 12),
              lastOptimized: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
              optimalTime: Math.floor(9 + Math.random() * 8),
              personalizedTip: generatePersonalizedTip(app.name),
              recentOptimizations: Math.floor(3 + Math.random() * 7)
            };
          }
        });
        
        setLearningData(mockLearningData);
        setSpeedData(mockSpeedData);
        setAppIntelligence(mockAppIntelligence);
      } catch (error) {
        console.error('Failed to fetch learning data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLearningIntelligence();
  }, [isFree]);
  
  // Generate personalized tips based on app usage patterns
  const generatePersonalizedTip = (appName) => {
    const tips = {
      'macOS System': 'WindowServer memory leak detected - system optimization can free 800MB-2GB',
      'Chrome': 'Heavy usage detected on Tuesdays - we optimize more aggressively',
      'Safari': 'Best performance gains seen during morning optimizations',
      'Spotify': 'Memory usage spikes during playlist changes - auto-optimizing',
      'Slack': 'Workspace switching creates memory leaks - we clean them up',
      'WhatsApp': 'Media cache builds up quickly - optimized every 2 hours',
      'Zoom': 'Meeting recordings consume RAM - cleaned after sessions',
      'Teams': 'Background sync causes slowdowns - optimized proactively',
      'Mail': 'Attachment cache grows large - cleaned automatically',
      'Photos': 'Thumbnail generation uses memory - optimized after imports',
      'Firefox': 'Tab restoration creates memory pressure - managed smartly'
    };
    return tips[appName] || 'Learning your usage patterns for better optimization';
  };

  // Styles
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

  const hoverSidebarItemStyle = {
    ...sidebarItemStyle,
    background: `linear-gradient(135deg, rgba(114, 9, 183, 0.2) 0%, rgba(83, 52, 131, 0.15) 100%)`,
    color: 'rgba(255, 255, 255, 0.95)',
    boxShadow: `0 4px 16px rgba(114, 9, 183, 0.2)`
  };

  const activeSidebarItemStyle = {
    ...sidebarItemStyle,
    background: `linear-gradient(135deg, rgba(114, 9, 183, 0.4) 0%, rgba(83, 52, 131, 0.3) 100%)`,
    color: 'white',
    boxShadow: `0 8px 32px rgba(114, 9, 183, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset`
  };

  return (
    <div style={mainContentStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', padding: '0 4px' }}>
          <div style={{ width: '48px', height: '48px', background: `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <Firefoxlogo size={32} />
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '800', margin: '0 0 2px 0' }}>Memory Monster</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: '0', fontWeight: '500' }}>
              {isPro ? '🧠 AI Speed Tracker' : 'App Library'}
            </p>
          </div>
        </div>
        
        {/* Navigation with hover states */}
        <div 
          style={currentView === 'speedTracker' ? activeSidebarItemStyle : sidebarItemStyle} 
          onClick={() => setCurrentView('speedTracker')}
          onMouseEnter={(e) => {
            if (currentView !== 'speedTracker') {
              Object.assign(e.target.style, hoverSidebarItemStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== 'speedTracker') {
              Object.assign(e.target.style, sidebarItemStyle);
            }
          }}
        >
          <Activity size={20} />
          <span>🚀 Speed Tracker</span>
          <div style={{
            background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
            color: 'white',
            fontSize: '8px',
            fontWeight: '700',
            padding: '2px 4px',
            borderRadius: '4px',
            marginLeft: 'auto'
          }}>
            AI
          </div>
        </div>
        <div 
          style={currentView === 'apps' ? activeSidebarItemStyle : sidebarItemStyle} 
          onClick={() => setCurrentView('apps')}
          onMouseEnter={(e) => {
            if (currentView !== 'apps') {
              Object.assign(e.target.style, hoverSidebarItemStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== 'apps') {
              Object.assign(e.target.style, sidebarItemStyle);
            }
          }}
        >
          <Package size={20} />
          <span>Apps</span>
          {/* Pro badge for Apps */}
          <div style={{
            background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
            color: 'white',
            fontSize: '10px',
            fontWeight: '700',
            padding: '2px 6px',
            borderRadius: '6px',
            marginLeft: 'auto'
          }}>
            PRO
          </div>
        </div>
        <div 
          style={currentView === 'settings' ? activeSidebarItemStyle : sidebarItemStyle} 
          onClick={() => setCurrentView('settings')}
          onMouseEnter={(e) => {
            if (currentView !== 'settings') {
              Object.assign(e.target.style, hoverSidebarItemStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== 'settings') {
              Object.assign(e.target.style, sidebarItemStyle);
            }
          }}
        >
          <Settings size={20} />
          <span>Settings</span>
        </div>
        
        <div style={{ flex: 1 }}></div>
        
        {/* Community Stats - Only show for free users */}
        {isFree && (
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <CommunityStats onUnlockClick={handleUnlockFullVersion} />
          </div>
        )}
      </div>

      {/* MAIN CONTENT - DIFFERENT FOR FREE VS PRO */}
      {isFree ? (
        // FREE USER EXPERIENCE - Split screen with learning data + upsell
        <div style={{
          padding: '40px',
          overflowY: 'auto',
          background: 'transparent',
          height: '100vh',
          display: 'flex',
          gap: '32px'
        }}>          
          {/* Left Side - Learning Intelligence Dashboard (60%) */}
          <div style={{ flex: '0 0 60%' }}>            
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>              
              <h1 style={{
                fontSize: '28px',
                fontWeight: '800',
                color: 'white',
                margin: '0 0 8px 0',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                🚀 Your Apps Are Getting Faster
              </h1>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0',
                fontWeight: '500'
              }}>
                AI is learning how you work and optimizing {freeApps.length} apps to run faster
              </p>
            </div>
            
            {/* Learning Stats Overview */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>              
              <div style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)`,
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}>                
                <div style={{ color: '#22c55e', fontWeight: '800', fontSize: '20px', marginBottom: '4px' }}>
                  {learningData?.totalSpeedGain || 0}%
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Speed Boost</div>
              </div>              
              <div style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)`,
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}>                
                <div style={{ color: '#7209b7', fontWeight: '800', fontSize: '20px', marginBottom: '4px' }}>
                  {learningData?.totalMemoryFreed || 0}MB
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Memory Freed</div>
              </div>              
              <div style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)`,
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}>                
                <div style={{ color: '#f59e0b', fontWeight: '800', fontSize: '20px', marginBottom: '4px' }}>
                  {freeApps.length}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Smart Apps</div>
              </div>
            </div>
            
            {/* App Learning Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>              
              {freeApps.map(app => {
                const intelligence = appIntelligence[app.id] || {};
                return (
                  <div key={app.id} style={{
                    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)`,
                    backdropFilter: 'blur(16px)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease'
                  }}>                    
                    {/* App Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>                      
                      <div style={{
                        fontSize: '20px',
                        marginRight: '8px'
                      }}>
                        {app.icon}
                      </div>
                      <div>                        
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '2px'
                        }}>
                          {app.name}
                        </div>
                        <div style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.5)'
                        }}>
                          {app.category}
                        </div>
                      </div>                      
                      {intelligence.successRate && (
                        <div style={{
                          marginLeft: 'auto',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          background: intelligence.successRate >= 90 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: intelligence.successRate >= 90 ? '#22c55e' : '#f59e0b',
                          fontSize: '10px',
                          fontWeight: '600'
                        }}>
                          {intelligence.successRate}%
                        </div>
                      )}
                    </div>
                    
                    {/* Quick Stats */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>                      
                      <div>                        
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#22c55e'
                        }}>
                          +{intelligence.speedGainPercent || 0}%
                        </div>
                        <div style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                          Speed Gain
                        </div>
                      </div>                      
                      <div style={{ textAlign: 'right' }}>                        
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white'
                        }}>
                          {intelligence.memoryFreedMB || 0}MB
                        </div>
                        <div style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                          Freed This Week
                        </div>
                      </div>
                    </div>
                    
                    {/* Personalized Insight */}
                    <div style={{
                      padding: '8px',
                      background: app.isSystem ? 'rgba(34, 197, 94, 0.1)' : 'rgba(114, 9, 183, 0.1)',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.3',
                      fontStyle: 'italic'
                    }}>
                      {app.isSystem ? '🖥️' : '💡'} {intelligence.personalizedTip}
                    </div>
                    
                    {/* System-specific additional info */}
                    {app.isSystem && intelligence.systemIssues && (
                      <div style={{
                        padding: '6px 8px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '6px',
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginTop: '6px'
                      }}>
                        🔧 Detected: {intelligence.systemIssues.slice(0, 2).join(', ')}
                        {intelligence.systemIssues.length > 2 && ' +' + (intelligence.systemIssues.length - 2) + ' more'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Right Side - Existing Upsell Module (40%) */}
          <div style={{ flex: '0 0 38%', display: 'flex', alignItems: 'center' }}>            
            <div style={{
              background: `linear-gradient(135deg, #7209b7 0%, #533483 50%, #16213e 100%)`,
              borderRadius: '24px',
              padding: '40px 32px',
              textAlign: 'center',
              color: 'white',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 24px 48px rgba(114, 9, 183, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
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
              {/* Icon */}
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <Package size={40} color="white" />
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: '28px',
                fontWeight: '800',
                margin: '0 0 16px 0',
                letterSpacing: '-1px'
              }}>
                Unlock Full Speed
              </h1>

              {/* Description */}
              <p style={{
                fontSize: '16px',
                margin: '0 0 24px 0',
                fontWeight: '500',
                opacity: 0.9,
                lineHeight: '1.4'
              }}>
                Experience the full power of AI optimization across 250+ apps with real-time monitoring.
              </p>

              {/* Features list */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                margin: '0 0 32px 0',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                textAlign: 'left'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  Pro Features:
                </div>
                <div style={{
                  fontSize: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div>🚀 240+ more apps including Adobe, Office, Dev tools</div>
                  <div>⚡ Real-time speed monitoring & optimization</div>
                  <div>🧠 Advanced AI learning from your patterns</div>
                  <div>📊 Detailed speed analytics & predictions</div>
                  <div>⚙️ Custom automation rules & schedules</div>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={handleUnlockFullVersion}
                style={{
                  width: '100%',
                  padding: '16px 28px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                }}
              >
                <Sparkles size={20} />
                Unlock Pro Speed
              </button>
            </div>
          </div>
          </div>
        </div>
      ) : (
        // PRO USER EXPERIENCE - Speed dashboard with comprehensive app intelligence
        <div style={{
          padding: '40px',
          overflowY: 'auto',
          background: 'transparent'
        }}>          
          {/* Header with Speed Chart */}
          <div style={{ marginBottom: '32px' }}>            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px'
            }}>              
              <div>                
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                  🚀 Speed Intelligence Hub
                </h1>
                <p style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: '0',
                  fontWeight: '500'
                }}>
                  AI-powered optimization across {mockApps.length + 40} apps with real-time learning
                </p>
              </div>              
              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>                
                <div style={{
                  textAlign: 'center',
                  padding: '12px 16px',
                  background: `linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)`,
                  borderRadius: '12px',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>                  
                  <div style={{ color: '#22c55e', fontWeight: '800', fontSize: '18px' }}>
                    +{learningData?.totalSpeedGain || 0}%
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Speed Gain</div>
                </div>
              </div>
            </div>
            
            {/* Speed Over Time Chart */}
            <div style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)`,
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '24px'
            }}>              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>                
                <h3 style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: '0'
                }}>
                  Daily Speed Performance
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px'
                }}>                  
                  <TrendingUp size={16} style={{ color: '#22c55e' }} />
                  <span>+{learningData?.weeklyTrend || '+12%'} this week</span>
                </div>
              </div>              
              <div style={{ width: '100%', height: 200 }}>                
                <ResponsiveContainer>
                  <AreaChart data={speedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>                    
                    <defs>
                      <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.6)"
                      fontSize={12}
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        return (d.getMonth() + 1) + '/' + d.getDate();
                      }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.6)"
                      fontSize={12}
                      domain={[0, 'dataMax']}
                      tickFormatter={(value) => `${value.toFixed(1)}x`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: 'white'
                      }}
                      formatter={(value) => [`${value.toFixed(2)}x`, 'Speed Multiplier']}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Area
                      type="monotone"
                      dataKey="speed"
                      stroke="#22c55e"
                      strokeWidth={3}
                      fill="url(#speedGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Intelligence Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>            
            <div style={{
              background: `linear-gradient(135deg, rgba(114, 9, 183, 0.2) 0%, rgba(114, 9, 183, 0.1) 100%)`,
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(114, 9, 183, 0.3)',
              textAlign: 'center'
            }}>              
              <Monitor size={32} style={{ color: '#7209b7', marginBottom: '12px' }} />
              <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>{mockApps.length + 40} Apps Monitored</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Real-time intelligence</div>
            </div>            
            <div style={{
              background: `linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)`,
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              textAlign: 'center'
            }}>              
              <Cpu size={32} style={{ color: '#f59e0b', marginBottom: '12px' }} />
              <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>{learningData?.totalMemoryFreed || 3240}MB Freed</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>This week</div>
            </div>            
            <div style={{
              background: `linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)`,
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              textAlign: 'center'
            }}>              
              <TrendingUp size={32} style={{ color: '#22c55e', marginBottom: '12px' }} />
              <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>{learningData?.avgSessionSpeed || 2.3}x Faster</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Average sessions</div>
            </div>
          </div>

          {/* Comprehensive App Intelligence Library */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {mockApps.map((app, index) => {
              // Generate enhanced intelligence data for pro users
              const intelligence = app.isSystem ? {
                // Enhanced system intelligence
                memoryFreedMB: Math.floor(1200 + Math.random() * 1800), // 1.2GB-3GB potential
                speedGainPercent: Math.floor(30 + Math.random() * 40), // Higher system gains
                successRate: Math.floor(92 + Math.random() * 6),
                lastOptimized: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toISOString(),
                optimalTime: Math.floor(9 + Math.random() * 8),
                personalizedTip: generatePersonalizedTip(app.name),
                recentOptimizations: Math.floor(8 + Math.random() * 12),
                systemSpecific: {
                  osVersion: 'macOS Sonoma 14.6.1',
                  systemIssues: ['WindowServer Leak (800MB)', 'Spotlight Cache (400MB)', 'Control Center (300MB)'],
                  systemUptime: Math.floor(2 + Math.random() * 12) + ' days',
                  criticalProcesses: 25,
                  systemOptimizations: app.systemOptimizations || []
                },
                userPatterns: {
                  peakUsage: Math.floor(14 + Math.random() * 8), // Higher for system
                  avgMemoryUsage: Math.floor(2500 + Math.random() * 1500), // System baseline
                  crashesAvoided: Math.floor(5 + Math.random() * 8)
                },
                collectiveInsights: {
                  globalSuccessRate: Math.floor(90 + Math.random() * 8),
                  avgGlobalSavings: Math.floor(1500 + Math.random() * 1000) // Higher system savings
                }
              } : {
                memoryFreedMB: Math.floor(300 + Math.random() * 800),
                speedGainPercent: Math.floor(20 + Math.random() * 30),
                successRate: Math.floor(88 + Math.random() * 10),
                lastOptimized: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toISOString(),
                optimalTime: Math.floor(9 + Math.random() * 8),
                personalizedTip: generatePersonalizedTip(app.name),
                recentOptimizations: Math.floor(5 + Math.random() * 10),
                userPatterns: {
                  peakUsage: Math.floor(10 + Math.random() * 8),
                  avgMemoryUsage: Math.floor(400 + Math.random() * 600),
                  crashesAvoided: Math.floor(2 + Math.random() * 5)
                },
                collectiveInsights: {
                  globalSuccessRate: Math.floor(85 + Math.random() * 12),
                  avgGlobalSavings: Math.floor(250 + Math.random() * 400)
                }
              };
              
              return (
                <div key={index} style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)`,
                backdropFilter: 'blur(24px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}>
                {/* Intelligence Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Sparkles size={10} />
                  AI SMART
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontSize: '32px',
                    marginRight: '12px'
                  }}>
                    {app.icon}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '2px'
                    }}>
                      {app.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontWeight: '500'
                    }}>
                      {app.category} • Last optimized {Math.floor((Date.now() - new Date(intelligence.lastOptimized)) / (60 * 60 * 1000))}h ago
                    </div>
                  </div>
                </div>

                {/* Performance Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    padding: '12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#22c55e'
                    }}>
                      +{intelligence.speedGainPercent}%
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      Speed Gain
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '12px',
                    background: 'rgba(114, 9, 183, 0.1)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#7209b7'
                    }}>
                      {intelligence.memoryFreedMB}MB
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      Memory Freed
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '12px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#f59e0b'
                    }}>
                      {intelligence.successRate}%
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      Success Rate
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '12px',
                    background: 'rgba(6, 182, 212, 0.1)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#06b6d4'
                    }}>
                      {intelligence.recentOptimizations}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      This Week
                    </div>
                  </div>
                </div>
                
                {/* Personalized Intelligence */}
                <div style={{
                  padding: '12px',
                  background: app.isSystem ? 'rgba(34, 197, 94, 0.1)' : 'rgba(114, 9, 183, 0.1)',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: app.isSystem ? '#22c55e' : '#7209b7',
                    marginBottom: '4px'
                  }}>
                    {app.isSystem ? '🖥️ System Intelligence' : '🧠 Personal Intelligence'}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.3'
                  }}>
                    {intelligence.personalizedTip}
                  </div>
                  
                  {/* System-specific details for Pro users */}
                  {app.isSystem && intelligence.systemSpecific && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '4px'
                      }}>
                        Running: {intelligence.systemSpecific.osVersion} • Uptime: {intelligence.systemSpecific.systemUptime}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#f59e0b',
                        fontWeight: '600'
                      }}>
                        🔧 {intelligence.systemSpecific.systemIssues.length} system issues detected
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Collective Intelligence */}
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '10px',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  📊 Users like you save {intelligence.collectiveInsights.avgGlobalSavings}MB on average with {intelligence.collectiveInsights.globalSuccessRate}% success rate
                </div>

                {app.optimizable ? (
                  <button style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <Zap size={16} />
                    Optimize Now ({intelligence.optimalTime}:00 optimal)
                  </button>
                ) : (
                  <div style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    color: '#22c55e',
                    fontSize: '14px',
                    fontWeight: '600',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <Shield size={16} />
                    Running at Peak Speed
                  </div>
                )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppsView;
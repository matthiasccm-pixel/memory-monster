/**
 * App Intelligence Database
 * Contains profiles for optimizing specific Mac apps
 */

class AppIntelligenceDatabase {
  constructor() {
    this.staticProfiles = new Map();
    this.dynamicProfiles = new Map();
    this.loadStaticProfiles();
  }

  loadStaticProfiles() {
    // Example profiles - this will be populated by research
    const profiles = {
      'com.google.Chrome': {
        name: 'Google Chrome',
        category: 'browser',
        memoryProfile: {
          baselineUsage: '200-400MB',
          heavyUsageThreshold: 2000, // MB
          commonLeakPatterns: ['tab_accumulation', 'extension_bloat', 'gpu_process_leak']
        },
        optimizationStrategies: {
          safe: [
            {
              id: 'clear_browser_cache',
              name: 'Clear Browser Cache',
              description: 'Remove cached web data and temporary files',
              estimatedSavings: { min: 500, max: 2000 }, // MB
              riskLevel: 'low',
              requiresRestart: false,
              userPrompt: 'none',
              implementation: 'clearChromeCache'
            },
            {
              id: 'close_inactive_tabs',
              name: 'Close Inactive Tabs',
              description: 'Close tabs that have been inactive for 30+ minutes',
              estimatedSavings: { min: 100, max: 500 }, // MB per tab
              riskLevel: 'low',
              requiresRestart: false,
              userPrompt: 'optional',
              implementation: 'closeChromeInactiveTabs'
            }
          ],
          moderate: [
            {
              id: 'restart_browser',
              name: 'Restart Chrome',
              description: 'Restart Chrome to clear memory leaks',
              estimatedSavings: { min: 500, max: 2000 }, // MB
              riskLevel: 'medium',
              requiresRestart: true,
              userPrompt: 'required',
              implementation: 'restartChrome'
            }
          ]
        },
        contextualRules: {
          neverOptimizeWhen: [
            'downloading_files',
            'video_call_active',
            'forms_with_unsaved_data',
            'incognito_windows_open'
          ],
          safeOptimizeWhen: [
            'browser_minimized_15min',
            'no_active_downloads',
            'user_idle_10min'
          ],
          promptUserWhen: [
            'multiple_tabs_open',
            'recent_form_activity'
          ]
        },
        detectionMethods: {
          processNames: ['Google Chrome', 'Google Chrome Helper'],
          cacheDirectories: [
            '~/Library/Caches/com.google.Chrome',
            '~/Library/Application Support/Google/Chrome/Default/GPUCache'
          ],
          configFiles: ['~/Library/Preferences/com.google.Chrome.plist']
        }
      },

      'com.microsoft.VSCode': {
        name: 'Visual Studio Code',
        category: 'development',
        memoryProfile: {
          baselineUsage: '150-300MB',
          heavyUsageThreshold: 1500,
          commonLeakPatterns: ['extension_memory_leak', 'language_server_bloat', 'typescript_service_leak']
        },
        optimizationStrategies: {
          safe: [
            {
              id: 'clear_extension_cache',
              name: 'Clear Extension Cache',
              description: 'Clear cached extension data and logs',
              estimatedSavings: { min: 200, max: 800 },
              riskLevel: 'low',
              requiresRestart: false,
              userPrompt: 'none',
              implementation: 'clearVSCodeExtensionCache'
            }
          ],
          moderate: [
            {
              id: 'restart_language_servers',
              name: 'Restart Language Servers',
              description: 'Restart TypeScript and other language servers',
              estimatedSavings: { min: 300, max: 1000 },
              riskLevel: 'medium',
              requiresRestart: false,
              userPrompt: 'optional',
              implementation: 'restartVSCodeLanguageServers'
            }
          ]
        },
        contextualRules: {
          neverOptimizeWhen: [
            'unsaved_files_detected',
            'debugging_session_active',
            'terminal_processes_running',
            'git_operations_in_progress'
          ],
          safeOptimizeWhen: [
            'no_unsaved_changes',
            'no_active_debugging',
            'workspace_idle_20min'
          ]
        }
      },

      'com.tinyspeck.slackmacgap': {
        name: 'Slack',
        category: 'communication',
        memoryProfile: {
          baselineUsage: '100-200MB',
          heavyUsageThreshold: 1000,
          commonLeakPatterns: ['message_cache_bloat', 'emoji_cache_accumulation', 'notification_memory_leak']
        },
        optimizationStrategies: {
          safe: [
            {
              id: 'clear_message_cache',
              name: 'Clear Message Cache',
              description: 'Clear cached messages and media files',
              estimatedSavings: { min: 300, max: 1200 },
              riskLevel: 'low',
              requiresRestart: false,
              userPrompt: 'none',
              implementation: 'clearSlackCache'
            }
          ],
          moderate: [
            {
              id: 'restart_slack',
              name: 'Restart Slack',
              description: 'Restart Slack to clear memory accumulation',
              estimatedSavings: { min: 200, max: 800 },
              riskLevel: 'medium',
              requiresRestart: true,
              userPrompt: 'optional',
              implementation: 'restartSlack'
            }
          ]
        },
        contextualRules: {
          neverOptimizeWhen: [
            'in_active_call',
            'screen_sharing_active',
            'typing_in_channel',
            'unread_mentions'
          ],
          safeOptimizeWhen: [
            'status_away',
            'no_recent_activity_30min'
          ]
        }
      }
    };

    // Load profiles into memory
    Object.entries(profiles).forEach(([bundleId, profile]) => {
      this.staticProfiles.set(bundleId, profile);
    });
  }

  getProfile(bundleId) {
    // Try static profiles first, then dynamic, then generate basic
    return this.staticProfiles.get(bundleId) || 
           this.dynamicProfiles.get(bundleId) || 
           this.generateBasicProfile(bundleId);
  }

  generateBasicProfile(bundleId) {
    // Fallback for unknown apps
    const appName = bundleId.split('.').pop() || bundleId;
    return {
      name: appName,
      category: 'unknown',
      optimizationStrategies: {
        safe: [
          {
            id: 'clear_basic_cache',
            name: 'Clear Cache',
            description: `Clear basic cache files for ${appName}`,
            estimatedSavings: { min: 50, max: 200 },
            riskLevel: 'low',
            requiresRestart: false,
            userPrompt: 'required',
            implementation: 'clearBasicCache'
          }
        ]
      },
      contextualRules: {
        neverOptimizeWhen: ['app_in_foreground'],
        promptUserWhen: ['any_optimization']
      }
    };
  }

  addDynamicProfile(bundleId, profile) {
    this.dynamicProfiles.set(bundleId, profile);
  }
}

export default AppIntelligenceDatabase;
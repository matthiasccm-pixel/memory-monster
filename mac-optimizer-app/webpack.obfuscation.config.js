/**
 * Webpack Configuration for Code Obfuscation
 * This configuration adds multiple layers of protection to the desktop app
 */

const path = require('path');
const WebpackObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    // Main application entry points
    'FeatureGate': './src/core/licensing/FeatureGate.js',
    'AppleSecurityManager': './src/core/security/AppleSecurityManager.js',
    'AdaptiveLearningEngine': './src/core/intelligence/AdaptiveLearningEngine.js',
    'OptimizationEngine': './src/core/intelligence/OptimizationEngine.js',
    'RealOptimizationEngine': './src/core/intelligence/RealOptimizationEngine.js'
  },
  output: {
    path: path.resolve(__dirname, 'src-protected'),
    filename: '[name].protected.js',
    library: '[name]',
    libraryTarget: 'commonjs2'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // Aggressive compression options
            drop_console: true, // Remove console.logs
            drop_debugger: true, // Remove debugger statements
            pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific functions
            passes: 3, // Multiple compression passes
            unsafe: true, // Apply unsafe optimizations
            unsafe_arrows: true,
            unsafe_methods: true,
            unsafe_proto: true
          },
          mangle: {
            // Aggressive variable name mangling
            toplevel: true,
            safari10: true,
            properties: {
              regex: /^[_$]/  // Mangle properties starting with _ or $
            }
          },
          output: {
            comments: false, // Remove all comments
            beautify: false
          }
        },
        extractComments: false
      })
    ]
  },
  plugins: [
    new WebpackObfuscator({
      // String obfuscation
      stringArray: true,
      stringArrayCallsTransform: true,
      stringArrayCallsTransformThreshold: 0.75,
      stringArrayEncoding: ['base64'], // Encode strings
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 2,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 4,
      stringArrayWrappersType: 'function',
      stringArrayThreshold: 0.8,

      // Control flow obfuscation
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,

      // Dead code injection
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,

      // Debug protection (anti-debugging)
      debugProtection: true,
      debugProtectionInterval: 2000, // Check every 2 seconds
      disableConsoleOutput: true,

      // Domain locking (optional - only works on specific domains)
      domainLock: [], // Add your domains here if needed

      // Variable name transformation
      identifierNamesGenerator: 'hexadecimal',
      identifiersPrefix: 'mm',

      // Number obfuscation
      numbersToExpressions: true,

      // Object keys obfuscation
      transformObjectKeys: true,

      // Rename properties
      renameProperties: false, // Can break functionality if too aggressive

      // Reserved names (don't obfuscate these)
      reservedNames: [
        'require',
        'module',
        'exports',
        '__dirname',
        '__filename',
        'process',
        'global',
        'window',
        'document',
        'electronAPI',
        'ipcRenderer'
      ],

      // Reserved strings (don't obfuscate these)
      reservedStrings: [
        'electron',
        'node',
        'require',
        'module',
        'exports'
      ],

      // Split strings to make reverse engineering harder
      splitStrings: true,
      splitStringsChunkLength: 5,

      // Unicode escape sequences
      unicodeEscapeSequence: true,

      // Self defending - crash if tampering detected
      selfDefending: true,

      // Compact mode - remove whitespace
      compact: true,

      // Advanced options
      target: 'node', // Target Node.js environment
      sourceMap: false, // Don't generate source maps in production
      
      // Performance options
      simplify: true,
      seed: Math.floor(Math.random() * 10000) // Random seed for obfuscation
    }, [
      // Don't obfuscate node_modules
      'node_modules/**/*.js'
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              // Additional obfuscation through Babel
              ['transform-remove-console', { exclude: ['error', 'warn'] }],
              'transform-remove-debugger'
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: {
    // Don't bundle these - they should be available in the Electron environment
    'electron': 'commonjs2 electron',
    'fs': 'commonjs2 fs',
    'path': 'commonjs2 path',
    'crypto': 'commonjs2 crypto',
    'os': 'commonjs2 os'
  }
};
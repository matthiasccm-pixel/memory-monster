/**
 * Secure Build Script for Memory Monster Desktop App
 * This script creates a production-ready, protected build
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔐 Starting protected build process...');

// Step 1: Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('build')) {
  fs.rmSync('build', { recursive: true, force: true });
}
if (fs.existsSync('src-protected')) {
  fs.rmSync('src-protected', { recursive: true, force: true });
}

// Step 2: Obfuscate critical JavaScript files
console.log('🛡️ Obfuscating critical JavaScript files...');
exec('npx webpack --config webpack.obfuscation.config.js', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Obfuscation failed:', error);
    process.exit(1);
  }
  
  console.log('✅ JavaScript obfuscation complete');
  
  // Step 3: Replace original files with obfuscated versions
  console.log('🔄 Replacing original files with protected versions...');
  
  const protectedFiles = [
    'FeatureGate.protected.js',
    'AppleSecurityManager.protected.js',
    'AdaptiveLearningEngine.protected.js',
    'OptimizationEngine.protected.js',
    'RealOptimizationEngine.protected.js'
  ];
  
  protectedFiles.forEach(file => {
    const protectedPath = path.join('src-protected', file);
    const originalPath = path.join('src/core/', file.replace('.protected.js', '.js').includes('FeatureGate') ? 'licensing/FeatureGate.js' :
                                   file.replace('.protected.js', '.js').includes('AppleSecurity') ? 'security/AppleSecurityManager.js' :
                                   'intelligence/' + file.replace('.protected.js', '.js'));
    
    if (fs.existsSync(protectedPath)) {
      // Backup original
      fs.copyFileSync(originalPath, originalPath + '.backup');
      
      // Replace with obfuscated version
      fs.copyFileSync(protectedPath, originalPath);
      console.log(`✅ Protected: ${file}`);
    }
  });
  
  // Step 4: Build the React app
  console.log('⚛️ Building React application...');
  exec('npm run build', (buildError, buildStdout, buildStderr) => {
    if (buildError) {
      console.error('❌ React build failed:', buildError);
      restoreBackups();
      process.exit(1);
    }
    
    console.log('✅ React build complete');
    
    // Step 5: Additional build security measures
    console.log('🔒 Applying additional security measures...');
    
    // Remove source maps from production build
    removeSourceMaps();
    
    // Minify HTML files
    minifyHTML();
    
    // Remove debug information
    removeDebugInfo();
    
    // Step 6: Restore original files
    console.log('🔄 Restoring original source files...');
    restoreBackups();
    
    // Step 7: Create final secure package
    console.log('📦 Creating final secure package...');
    createSecurePackage();
    
    console.log('🎉 Protected build complete!');
    console.log('📊 Build statistics:');
    
    // Show build statistics
    showBuildStats();
  });
});

function removeSourceMaps() {
  const buildDir = 'build/static/js';
  if (fs.existsSync(buildDir)) {
    const files = fs.readdirSync(buildDir);
    files.forEach(file => {
      if (file.endsWith('.map')) {
        fs.unlinkSync(path.join(buildDir, file));
        console.log(`🗑️ Removed source map: ${file}`);
      }
    });
  }
  
  const cssDir = 'build/static/css';
  if (fs.existsSync(cssDir)) {
    const files = fs.readdirSync(cssDir);
    files.forEach(file => {
      if (file.endsWith('.map')) {
        fs.unlinkSync(path.join(cssDir, file));
        console.log(`🗑️ Removed CSS source map: ${file}`);
      }
    });
  }
}

function minifyHTML() {
  const htmlFile = 'build/index.html';
  if (fs.existsSync(htmlFile)) {
    let html = fs.readFileSync(htmlFile, 'utf8');
    
    // Remove comments and extra whitespace
    html = html.replace(/<!--.*?-->/gs, '');
    html = html.replace(/>\s+</g, '><');
    html = html.replace(/\s{2,}/g, ' ');
    
    fs.writeFileSync(htmlFile, html);
    console.log('✅ HTML minified');
  }
}

function removeDebugInfo() {
  const buildDir = 'build/static/js';
  if (fs.existsSync(buildDir)) {
    const files = fs.readdirSync(buildDir);
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = path.join(buildDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove console statements that might have survived
        content = content.replace(/console\.(log|debug|info)\([^)]*\);?/g, '');
        
        // Remove debugger statements
        content = content.replace(/debugger;?/g, '');
        
        fs.writeFileSync(filePath, content);
      }
    });
    console.log('✅ Debug information removed');
  }
}

function restoreBackups() {
  const backupFiles = [
    'src/core/licensing/FeatureGate.js.backup',
    'src/core/security/AppleSecurityManager.js.backup',
    'src/core/intelligence/AdaptiveLearningEngine.js.backup',
    'src/core/intelligence/OptimizationEngine.js.backup',
    'src/core/intelligence/RealOptimizationEngine.js.backup'
  ];
  
  backupFiles.forEach(backupPath => {
    if (fs.existsSync(backupPath)) {
      const originalPath = backupPath.replace('.backup', '');
      fs.copyFileSync(backupPath, originalPath);
      fs.unlinkSync(backupPath);
    }
  });
  
  console.log('✅ Original files restored');
}

function createSecurePackage() {
  // Create a deployment-ready package with security information
  const securityInfo = {
    buildDate: new Date().toISOString(),
    obfuscated: true,
    codeProtection: {
      stringObfuscation: true,
      controlFlowFlattening: true,
      deadCodeInjection: true,
      debugProtection: true,
      selfDefending: true
    },
    securityFeatures: [
      'JavaScript obfuscation',
      'Source map removal',
      'Debug information removal',
      'Console statement removal',
      'Apple Security Manager',
      'Hardware-based device binding',
      'Anti-tampering protection'
    ]
  };
  
  fs.writeFileSync('build/security-info.json', JSON.stringify(securityInfo, null, 2));
  console.log('✅ Security information added to build');
}

function showBuildStats() {
  if (fs.existsSync('build')) {
    const stats = getBuildSize('build');
    console.log(`📊 Total build size: ${formatBytes(stats.totalSize)}`);
    console.log(`📊 JavaScript size: ${formatBytes(stats.jsSize)}`);
    console.log(`📊 CSS size: ${formatBytes(stats.cssSize)}`);
    console.log(`📊 Files count: ${stats.fileCount}`);
  }
}

function getBuildSize(dir) {
  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;
  let fileCount = 0;
  
  function traverseDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        traverseDir(filePath);
      } else {
        totalSize += stats.size;
        fileCount++;
        
        if (file.endsWith('.js')) {
          jsSize += stats.size;
        } else if (file.endsWith('.css')) {
          cssSize += stats.size;
        }
      }
    });
  }
  
  traverseDir(dir);
  return { totalSize, jsSize, cssSize, fileCount };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Build process interrupted');
  restoreBackups();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Build process terminated');
  restoreBackups();
  process.exit(0);
});
/**
 * macOS Notarization Script for Memory Monster
 * This script handles the notarization process after code signing
 */

const { notarize } = require('@electron/notarize');
const path = require('path');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  
  // Only notarize on macOS
  if (electronPlatformName !== 'darwin') {
    console.log('🔍 Skipping notarization - not macOS platform');
    return;
  }

  // Check if we're in CI/release environment
  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD || !process.env.APPLE_TEAM_ID) {
    console.log('🔍 Skipping notarization - credentials not available');
    console.log('ℹ️ Set APPLE_ID, APPLE_ID_PASSWORD, and APPLE_TEAM_ID for notarization');
    return;
  }

  console.log('🍎 Starting macOS notarization process...');

  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);

  console.log(`📱 App path: ${appPath}`);
  console.log(`🆔 Apple ID: ${process.env.APPLE_ID}`);
  console.log(`🏢 Team ID: ${process.env.APPLE_TEAM_ID}`);

  try {
    await notarize({
      appBundleId: 'com.memorymonster.app',
      appPath: appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });

    console.log('✅ Notarization completed successfully!');
    console.log('🎉 App is now notarized and ready for distribution');
    
  } catch (error) {
    console.error('❌ Notarization failed:');
    console.error(error);
    
    // Provide helpful error guidance
    if (error.message.includes('password')) {
      console.log('💡 Tip: Make sure APPLE_ID_PASSWORD is set to an app-specific password');
      console.log('🔗 Create one at: https://appleid.apple.com/account/manage');
    }
    
    if (error.message.includes('team')) {
      console.log('💡 Tip: Make sure APPLE_TEAM_ID matches your Apple Developer Team ID');
      console.log('🔗 Find it at: https://developer.apple.com/account/#/membership/');
    }
    
    throw error;
  }
};
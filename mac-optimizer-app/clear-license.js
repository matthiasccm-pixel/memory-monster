// Quick script to clear license data and simulate fresh install
const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing license data...');

// In Electron, localStorage data is stored in the user data directory
// For development, we can clear it by running this in the app's console
// Or by deleting the Local Storage file

console.log('To clear license in the app:');
console.log('1. Open DevTools in the Electron app');
console.log('2. Go to Application tab > Local Storage');
console.log('3. Delete "memory_monster_license" key');
console.log('4. Refresh the app');

console.log('\nOr run this in the DevTools console:');
console.log('localStorage.removeItem("memory_monster_license"); window.location.reload();');
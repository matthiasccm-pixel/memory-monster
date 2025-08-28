const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
mainWindow = new BrowserWindow({
  width: 1450,  // Wider to fit all 3 panels
  height: 900,  // Taller for better content
  minWidth: 1450,  // Prevent shrinking too small
  minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    titleBarStyle: 'hiddenInset'
  });

  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Real system functions
ipcMain.handle('get-chrome-processes', async () => {
  return new Promise((resolve) => {
    exec('ps aux | grep -i chrome | grep -v grep', (error, stdout) => {
      if (error || !stdout.trim()) {
        resolve({ count: 0, message: 'No Chrome processes found' });
        return;
      }
      
      const lines = stdout.split('\n').filter(line => line.trim());
      resolve({
        count: lines.length,
        message: `Found ${lines.length} Chrome processes`,
        details: lines.slice(0, 3) // First 3 for display
      });
    });
  });
});
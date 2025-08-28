const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getChromeProcesses: () => ipcRenderer.invoke('get-chrome-processes'),
  getDirectorySize: (path) => ipcRenderer.invoke('get-directory-size', path),
  getSystemMemory: () => ipcRenderer.invoke('get-system-memory'),
  getDiskUsage: () => ipcRenderer.invoke('get-disk-usage'),
  scanAppDirectories: () => ipcRenderer.invoke('scan-app-directories')
});
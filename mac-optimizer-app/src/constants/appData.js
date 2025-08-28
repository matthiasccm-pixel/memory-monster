// Application data constants

// Community users data
export const communityUsers = [
  { user: "Sarah C", action: "freed memory from Spotify", time: "2 min ago", avatar: "👩🏻‍💻", savings: "12.3GB", userCount: "12,429", totalFreed: "847TB" },
  { user: "Marcus R", action: "liberated Chrome processes", time: "4 min ago", avatar: "👨🏽‍💼", savings: "1.7GB", userCount: "8,924", totalFreed: "156TB" },
  { user: "Emma T", action: "rescued WhatsApp media", time: "7 min ago", avatar: "👩🏾‍🎨", savings: "8.1GB", userCount: "15,883", totalFreed: "1.2PB" },
  { user: "Alex K", action: "freed system memory", time: "11 min ago", avatar: "👨🏻‍🔬", savings: "1.9GB", userCount: "6,742", totalFreed: "89TB" },
  { user: "Lisa M", action: "liberated Zoom cache", time: "15 min ago", avatar: "👩🏼‍🏫", savings: "3.2GB", userCount: "9,156", totalFreed: "234TB" },
  { user: "David L", action: "freed Teams data", time: "18 min ago", avatar: "👨🏾‍💻", savings: "2.8GB", userCount: "7,329", totalFreed: "178TB" },
  { user: "Maria S", action: "rescued Safari cache", time: "22 min ago", avatar: "👩🏽‍🔬", savings: "4.5GB", userCount: "11,847", totalFreed: "445TB" },
  { user: "Tom W", action: "liberated Photoshop temp", time: "25 min ago", avatar: "👨🏻‍🎨", savings: "6.7GB", userCount: "5,438", totalFreed: "298TB" }
];

// Memory issues - UPDATED WITH APP NAMES
export const initialIssues = [
  {
    id: 1,
    app: "WhatsApp", 
    title: "WhatsApp",
    description: "This popular messaging app has imprisoned 11.9GB of photos, videos, and documents in its cache system",
    storage: 11.9,
    storageUnit: "GB",
    severity: "critical",
    fixed: false,
    userCount: "15,883",
    totalFreed: "1.2PB",
    fileCount: "12,847 cached files",
    lastOptimized: "Never"
  },
  {
    id: 2,
    app: "Spotify",
    title: "Spotify", 
    description: "The music streaming giant is hoarding your storage with downloaded tracks and album artwork",
    storage: 9.5,
    storageUnit: "GB", 
    severity: "high",
    fixed: false,
    userCount: "12,429",
    totalFreed: "847TB",
    fileCount: "3,291 cached tracks",
    lastOptimized: "6 months ago"
  },
  {
    id: 3,
    app: "Chrome",
    title: "Chrome",
    description: "Google's browser is spawning multiple processes that devour your precious RAM and slow performance",
    storage: 1.7,
    storageUnit: "GB",
    severity: "medium", 
    fixed: false,
    userCount: "8,924",
    totalFreed: "156TB",
    processCount: "47 active processes",
    lastOptimized: "2 weeks ago"
  }
];

// System health data
export const systemHealth = {
  cpu: { usage: 23, temp: 45, efficiency: 94 },
  memory: { usage: 78, pressure: "Medium", available: "6.2GB" },
  storage: { available: "156GB", total: "512GB", usage: 69 },
  battery: { health: 87, cycles: 342, timeRemaining: "4h 23m" }
};
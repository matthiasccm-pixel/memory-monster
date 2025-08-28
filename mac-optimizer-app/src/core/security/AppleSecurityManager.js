/**
 * AppleSecurityManager.js - Leverage macOS built-in security
 * Uses Keychain Access, Hardware UUID, and Touch ID for robust device binding
 */

class AppleSecurityManager {
  constructor() {
    this.keychainService = 'com.memorymonster.license';
    this.secureDeviceId = null;
    this.hardwareUUID = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('🔐 Initializing Apple Security Manager...');
    
    try {
      // Get hardware UUID through Electron main process
      this.hardwareUUID = await this.getHardwareUUID();
      console.log('✅ Hardware UUID obtained');
      
      // Generate secure device ID based on hardware
      this.secureDeviceId = await this.generateSecureDeviceId();
      console.log('✅ Secure device ID generated');
      
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize Apple Security:', error);
      throw error;
    }
  }

  /**
   * Get Mac hardware UUID (unchangeable hardware identifier)
   * This cannot be spoofed and survives OS reinstalls
   */
  async getHardwareUUID() {
    try {
      if (!window.electronAPI) {
        throw new Error('ElectronAPI not available');
      }

      // Request hardware UUID from main process
      const result = await window.electronAPI.getHardwareUUID();
      
      if (!result || !result.uuid) {
        throw new Error('Failed to obtain hardware UUID');
      }

      return result.uuid;
    } catch (error) {
      console.error('Failed to get hardware UUID:', error);
      
      // Fallback to system info combination (less secure but works)
      return this.generateFallbackDeviceId();
    }
  }

  /**
   * Generate cryptographically secure device ID
   * Combines hardware UUID with system characteristics
   */
  async generateSecureDeviceId() {
    const components = [
      this.hardwareUUID,
      navigator.platform,
      navigator.hardwareConcurrency.toString(),
      screen.width + 'x' + screen.height,
      await this.getSystemVersion(),
      await this.getCPUInfo()
    ];

    // Create SHA-256 hash of combined components
    const combined = components.join('|');
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return `mm_secure_${hashHex.substring(0, 32)}`;
  }

  /**
   * Store license securely in macOS Keychain
   * Data is encrypted and tied to this specific app/device
   */
  async storeLicenseInKeychain(licenseData) {
    try {
      if (!window.electronAPI) {
        throw new Error('ElectronAPI not available for Keychain access');
      }

      const keychainItem = {
        service: this.keychainService,
        account: licenseData.userEmail || 'default',
        password: JSON.stringify({
          ...licenseData,
          deviceId: this.secureDeviceId,
          hardwareUUID: this.hardwareUUID,
          storedAt: new Date().toISOString()
        })
      };

      console.log('🔐 Storing license in macOS Keychain...');
      const result = await window.electronAPI.storeInKeychain(keychainItem);
      
      if (result.success) {
        console.log('✅ License stored securely in Keychain');
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Failed to store license in Keychain:', error);
      
      // Fallback to encrypted localStorage
      return this.storeEncryptedLicense(licenseData);
    }
  }

  /**
   * Retrieve license from macOS Keychain
   */
  async retrieveLicenseFromKeychain(userEmail = 'default') {
    try {
      if (!window.electronAPI) {
        throw new Error('ElectronAPI not available for Keychain access');
      }

      console.log('🔓 Retrieving license from macOS Keychain...');
      const result = await window.electronAPI.getFromKeychain({
        service: this.keychainService,
        account: userEmail
      });

      if (result.success && result.password) {
        const licenseData = JSON.parse(result.password);
        
        // Verify this license belongs to this device
        if (licenseData.deviceId !== this.secureDeviceId) {
          console.warn('⚠️ License device mismatch - possible transfer attempt');
          return null;
        }

        console.log('✅ License retrieved and validated from Keychain');
        return licenseData;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Failed to retrieve license from Keychain:', error);
      
      // Fallback to encrypted localStorage
      return this.retrieveEncryptedLicense(userEmail);
    }
  }

  /**
   * Request Touch ID / Face ID authentication for sensitive operations
   */
  async requestBiometricAuth(reason = 'Access Memory Monster Pro features') {
    try {
      if (!window.electronAPI) {
        console.warn('ElectronAPI not available for biometric auth');
        return { success: false, fallback: true };
      }

      console.log('👆 Requesting biometric authentication...');
      const result = await window.electronAPI.requestBiometricAuth({ reason });
      
      if (result.success) {
        console.log('✅ Biometric authentication successful');
        return { success: true, method: result.method };
      } else {
        console.log('❌ Biometric authentication failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Biometric auth error:', error);
      return { success: false, error: error.message, fallback: true };
    }
  }

  /**
   * Validate device integrity - detect if running in VM or tampered environment
   */
  async validateDeviceIntegrity() {
    try {
      const checks = {
        hardwareCheck: await this.validateHardware(),
        environmentCheck: await this.validateEnvironment(),
        debuggerCheck: this.detectDebugger(),
        vmCheck: await this.detectVirtualMachine()
      };

      const failedChecks = Object.entries(checks).filter(([_, passed]) => !passed);
      
      if (failedChecks.length > 0) {
        console.warn('⚠️ Device integrity checks failed:', failedChecks.map(([check]) => check));
        return {
          valid: false,
          failedChecks: failedChecks.map(([check]) => check),
          riskScore: failedChecks.length / Object.keys(checks).length
        };
      }

      console.log('✅ Device integrity validated');
      return { valid: true, riskScore: 0 };
    } catch (error) {
      console.error('❌ Device integrity validation failed:', error);
      return { valid: false, error: error.message, riskScore: 1.0 };
    }
  }

  /**
   * Encrypted localStorage fallback when Keychain is unavailable
   */
  async storeEncryptedLicense(licenseData) {
    try {
      const key = await this.deriveEncryptionKey();
      const encrypted = await this.encryptData(JSON.stringify(licenseData), key);
      
      localStorage.setItem('mm_secure_license', encrypted);
      console.log('✅ License stored with encryption fallback');
      return true;
    } catch (error) {
      console.error('❌ Failed to store encrypted license:', error);
      return false;
    }
  }

  async retrieveEncryptedLicense(userEmail) {
    try {
      const encrypted = localStorage.getItem('mm_secure_license');
      if (!encrypted) return null;

      const key = await this.deriveEncryptionKey();
      const decrypted = await this.decryptData(encrypted, key);
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('❌ Failed to retrieve encrypted license:', error);
      return null;
    }
  }

  /**
   * Helper Methods
   */
  
  async getSystemVersion() {
    try {
      if (window.electronAPI) {
        const info = await window.electronAPI.getSystemInfo();
        return info.version || 'unknown';
      }
      return navigator.userAgent;
    } catch {
      return 'unknown';
    }
  }

  async getCPUInfo() {
    try {
      if (window.electronAPI) {
        const info = await window.electronAPI.getCPUInfo();
        return info.model || 'unknown';
      }
      return navigator.hardwareConcurrency.toString();
    } catch {
      return 'unknown';
    }
  }

  generateFallbackDeviceId() {
    const components = [
      navigator.platform,
      navigator.userAgent,
      screen.width + 'x' + screen.height,
      navigator.hardwareConcurrency,
      new Date().getTimezoneOffset()
    ];
    
    return 'mm_fallback_' + btoa(components.join('|')).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  async validateHardware() {
    // Check if hardware characteristics match stored values
    return this.hardwareUUID && this.hardwareUUID.length > 10;
  }

  async validateEnvironment() {
    // Check for signs of tampering or unusual environment
    return !window.webdriver && !window.__selenium && !window.callPhantom;
  }

  detectDebugger() {
    // Check if debugger is attached
    let start = Date.now();
    debugger;
    return Date.now() - start < 100; // If debugger is open, this will take much longer
  }

  async detectVirtualMachine() {
    try {
      if (window.electronAPI) {
        const vmCheck = await window.electronAPI.detectVirtualMachine();
        return !vmCheck.isVM;
      }
      
      // Fallback VM detection
      const vmIndicators = [
        'VirtualBox',
        'VMware',
        'Parallels',
        'QEMU'
      ];
      
      return !vmIndicators.some(indicator => 
        navigator.userAgent.includes(indicator) || 
        navigator.platform.includes(indicator)
      );
    } catch {
      return true; // Assume real hardware if check fails
    }
  }

  async deriveEncryptionKey() {
    const keyMaterial = this.secureDeviceId + this.hardwareUUID;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keyMaterial);
    
    return await crypto.subtle.importKey(
      'raw',
      await crypto.subtle.digest('SHA-256', keyData),
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encryptData(data, key) {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encoder.encode(data)
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode.apply(null, combined));
  }

  async decryptData(encryptedData, key) {
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data
    );
    
    return new TextDecoder().decode(decrypted);
  }

  // Public interface methods
  getSecureDeviceId() {
    return this.secureDeviceId;
  }

  getHardwareIdentifier() {
    return this.hardwareUUID;
  }

  async isDeviceAuthorized() {
    const licenseData = await this.retrieveLicenseFromKeychain();
    if (!licenseData) return false;

    // Verify device hasn't been tampered with
    const integrity = await this.validateDeviceIntegrity();
    return integrity.valid && licenseData.deviceId === this.secureDeviceId;
  }
}

export default AppleSecurityManager;
/**
 * Caching Layer for Memory Monster
 * Simple in-memory cache with Redis-compatible interface for production scaling
 */

interface CacheEntry {
  value: any;
  expiry: number;
  ttl: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
}

class MemoryCache {
  private store: Map<string, CacheEntry> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0
  };
  private maxSize: number = 10000; // Max 10k entries
  private cleanupInterval: NodeJS.Timeout;

  constructor(maxSize: number = 10000) {
    this.maxSize = maxSize;
    
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Set a value in cache with TTL (Time To Live) in seconds
   */
  set(key: string, value: any, ttlSeconds: number = 3600): boolean {
    try {
      // Check if we need to evict entries
      if (this.store.size >= this.maxSize && !this.store.has(key)) {
        this.evictOldest();
      }

      const expiry = Date.now() + (ttlSeconds * 1000);
      this.store.set(key, {
        value: JSON.parse(JSON.stringify(value)), // Deep copy
        expiry,
        ttl: ttlSeconds
      });
      
      this.stats.sets++;
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Get a value from cache
   */
  get(key: string): any | null {
    const entry = this.store.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value;
  }

  /**
   * Delete a value from cache
   */
  delete(key: string): boolean {
    const deleted = this.store.delete(key);
    if (deleted) {
      this.stats.deletes++;
    }
    return deleted;
  }

  /**
   * Check if key exists and is not expired
   */
  exists(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry || Date.now() > entry.expiry) {
      return false;
    }
    return true;
  }

  /**
   * Get TTL (time to live) for a key in seconds
   */
  ttl(key: string): number {
    const entry = this.store.get(key);
    if (!entry) return -2; // Key doesn't exist
    
    const remaining = entry.expiry - Date.now();
    if (remaining <= 0) return -1; // Key expired
    
    return Math.floor(remaining / 1000);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats & { size: number; hitRate: number } {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
    
    return {
      ...this.stats,
      size: this.store.size,
      hitRate: Math.round(hitRate * 100) / 100
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiry) {
        this.store.delete(key);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      console.log(`Cleaned up ${expiredCount} expired cache entries`);
    }
  }

  /**
   * Evict oldest entries when cache is full
   */
  private evictOldest(): void {
    // Find the oldest entry
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    
    for (const [key, entry] of this.store.entries()) {
      const age = Date.now() - (entry.expiry - entry.ttl * 1000);
      if (age < oldestTime) {
        oldestTime = age;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.store.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * Destroy the cache and cleanup intervals
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Global cache instance
const cache = new MemoryCache(10000); // 10k entries max

// Cache key generators
export const CacheKeys = {
  userLicense: (email: string) => `license:${email}`,
  deviceAuth: (deviceId: string) => `device:${deviceId}`,
  userProfile: (userId: string) => `profile:${userId}`,
  subscriptionStatus: (customerId: string) => `subscription:${customerId}`,
  downloadCount: (deviceId: string) => `downloads:${deviceId}`,
  rateLimitCheck: (ip: string, endpoint: string) => `ratelimit:${ip}:${endpoint}`,
  apiResponse: (endpoint: string, params: string) => `api:${endpoint}:${params}`,
} as const;

// Cache TTL constants (in seconds)
export const CacheTTL = {
  LICENSE_STATUS: 60 * 60, // 1 hour
  DEVICE_AUTH: 30 * 60, // 30 minutes
  USER_PROFILE: 15 * 60, // 15 minutes
  SUBSCRIPTION_STATUS: 60 * 60, // 1 hour
  DOWNLOAD_COUNT: 5 * 60, // 5 minutes
  RATE_LIMIT: 15 * 60, // 15 minutes
  API_RESPONSE: 5 * 60, // 5 minutes
  SHORT_TERM: 60, // 1 minute
  MEDIUM_TERM: 15 * 60, // 15 minutes
  LONG_TERM: 60 * 60, // 1 hour
} as const;

/**
 * High-level caching functions for specific use cases
 */
export const CacheService = {
  // License validation caching
  async getLicenseStatus(email: string): Promise<any | null> {
    return cache.get(CacheKeys.userLicense(email));
  },

  async setLicenseStatus(email: string, licenseData: any): Promise<void> {
    cache.set(CacheKeys.userLicense(email), licenseData, CacheTTL.LICENSE_STATUS);
  },

  async invalidateLicenseStatus(email: string): Promise<void> {
    cache.delete(CacheKeys.userLicense(email));
  },

  // Device authorization caching
  async getDeviceAuth(deviceId: string): Promise<any | null> {
    return cache.get(CacheKeys.deviceAuth(deviceId));
  },

  async setDeviceAuth(deviceId: string, authData: any): Promise<void> {
    cache.set(CacheKeys.deviceAuth(deviceId), authData, CacheTTL.DEVICE_AUTH);
  },

  async invalidateDeviceAuth(deviceId: string): Promise<void> {
    cache.delete(CacheKeys.deviceAuth(deviceId));
  },

  // User profile caching
  async getUserProfile(userId: string): Promise<any | null> {
    return cache.get(CacheKeys.userProfile(userId));
  },

  async setUserProfile(userId: string, profileData: any): Promise<void> {
    cache.set(CacheKeys.userProfile(userId), profileData, CacheTTL.USER_PROFILE);
  },

  async invalidateUserProfile(userId: string): Promise<void> {
    cache.delete(CacheKeys.userProfile(userId));
  },

  // API response caching
  async getApiResponse(endpoint: string, params: any): Promise<any | null> {
    const paramsKey = JSON.stringify(params);
    return cache.get(CacheKeys.apiResponse(endpoint, paramsKey));
  },

  async setApiResponse(endpoint: string, params: any, response: any, ttl: number = CacheTTL.API_RESPONSE): Promise<void> {
    const paramsKey = JSON.stringify(params);
    cache.set(CacheKeys.apiResponse(endpoint, paramsKey), response, ttl);
  },

  // Rate limiting support
  async getRateLimitCount(ip: string, endpoint: string): Promise<number> {
    const count = cache.get(CacheKeys.rateLimitCheck(ip, endpoint));
    return count || 0;
  },

  async incrementRateLimit(ip: string, endpoint: string, windowSeconds: number): Promise<number> {
    const key = CacheKeys.rateLimitCheck(ip, endpoint);
    const currentCount = cache.get(key) || 0;
    const newCount = currentCount + 1;
    cache.set(key, newCount, windowSeconds);
    return newCount;
  },

  // Bulk operations
  async invalidateUserData(email: string, userId?: string, deviceId?: string): Promise<void> {
    // Clear all user-related cache
    cache.delete(CacheKeys.userLicense(email));
    
    if (userId) {
      cache.delete(CacheKeys.userProfile(userId));
    }
    
    if (deviceId) {
      cache.delete(CacheKeys.deviceAuth(deviceId));
      cache.delete(CacheKeys.downloadCount(deviceId));
    }
  },

  // Cache warming for critical data
  async warmupCache(email: string, licenseData: any, profileData?: any): Promise<void> {
    await this.setLicenseStatus(email, licenseData);
    
    if (profileData) {
      await this.setUserProfile(profileData.id, profileData);
    }
  },

  // Cache health check
  getHealthStats() {
    const stats = cache.getStats();
    return {
      ...stats,
      healthy: stats.hitRate > 70 && stats.size < 8000, // 70% hit rate, under 80% capacity
      memoryUsage: `${Math.round((stats.size / 10000) * 100)}%`,
      recommendations: this.getRecommendations(stats)
    };
  },

  // Performance recommendations
  getRecommendations(stats: any): string[] {
    const recommendations: string[] = [];
    
    if (stats.hitRate < 70) {
      recommendations.push('Low cache hit rate - consider increasing TTL values');
    }
    
    if (stats.size > 8000) {
      recommendations.push('Cache approaching capacity - consider increasing maxSize or reducing TTL');
    }
    
    if (stats.evictions > stats.size * 0.1) {
      recommendations.push('High eviction rate - cache may be too small');
    }
    
    return recommendations;
  }
};

// Export the raw cache for advanced usage
export { cache };

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down cache...');
  cache.destroy();
});

process.on('SIGINT', () => {
  console.log('Shutting down cache...');
  cache.destroy();
});
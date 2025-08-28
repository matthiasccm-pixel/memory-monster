/**
 * Rate Limiting Middleware for Memory Monster API
 * Implements IP-based and license-based rate limiting for security
 */

import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (for production, use Redis)
const store: RateLimitStore = {};

// Different rate limits for different endpoint types
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // License verification - strict limiting
  LICENSE_VERIFY: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // 10 attempts per 15 min per IP
  },
  
  // Download tracking - moderate limiting
  DOWNLOAD_TRACK: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // 5 downloads per hour per IP
  },
  
  // General API access - lenient for legitimate use
  GENERAL_API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 min per IP
  },
  
  // Stripe webhook - very strict
  STRIPE_WEBHOOK: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 webhooks per minute
  },
  
  // Authentication endpoints - strict
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 auth attempts per 15 min per IP
  }
};

/**
 * Get rate limit key from request
 */
function getRateLimitKey(request: NextRequest, prefix: string): string {
  // Primary key: IP address
  const ip = request.ip || 
    request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.headers.get('x-real-ip') || 
    'anonymous';

  // For license verification, also include user agent for additional uniqueness
  if (prefix === 'license') {
    const userAgent = request.headers.get('user-agent')?.substring(0, 50) || 'unknown';
    return `${prefix}:${ip}:${Buffer.from(userAgent).toString('base64')}`;
  }

  return `${prefix}:${ip}`;
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(request: NextRequest, config: RateLimitConfig, keyPrefix: string) {
  const key = getRateLimitKey(request, keyPrefix);
  const now = Date.now();
  
  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    cleanupExpiredEntries();
  }
  
  // Get or create rate limit entry
  let entry = store[key];
  
  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    entry = {
      count: 0,
      resetTime: now + config.windowMs
    };
    store[key] = entry;
  }
  
  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      resetIn,
      error: `Rate limit exceeded. Try again in ${resetIn} seconds.`
    };
  }
  
  // Increment counter
  entry.count++;
  
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
    resetIn: Math.ceil((entry.resetTime - now) / 1000)
  };
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  const keys = Object.keys(store);
  
  for (const key of keys) {
    if (store[key] && now > store[key].resetTime) {
      delete store[key];
    }
  }
}

/**
 * Rate limiting middleware factory
 */
export function createRateLimit(config: RateLimitConfig, keyPrefix: string) {
  return (request: NextRequest) => {
    return checkRateLimit(request, config, keyPrefix);
  };
}

/**
 * Advanced rate limiting with multiple tiers
 * Free users get lower limits than Pro users
 */
export function checkTieredRateLimit(
  request: NextRequest, 
  config: RateLimitConfig,
  keyPrefix: string,
  userTier: 'free' | 'pro' | 'admin' = 'free'
) {
  // Adjust limits based on user tier
  const tierMultipliers = {
    free: 1,
    pro: 3,     // Pro users get 3x the limits
    admin: 10   // Admin gets 10x the limits
  };
  
  const adjustedConfig = {
    ...config,
    maxRequests: Math.floor(config.maxRequests * tierMultipliers[userTier])
  };
  
  return checkRateLimit(request, adjustedConfig, `${keyPrefix}_${userTier}`);
}

/**
 * Special rate limiting for license verification
 * Includes additional security checks
 */
export function checkLicenseVerificationRateLimit(request: NextRequest) {
  // Standard IP-based rate limiting
  const standardResult = checkRateLimit(request, RATE_LIMITS.LICENSE_VERIFY, 'license_verify');
  
  if (!standardResult.success) {
    return standardResult;
  }
  
  // Additional check: Limit based on User-Agent
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const uaKey = `ua_license:${Buffer.from(userAgent.substring(0, 100)).toString('base64')}`;
  
  let uaEntry = store[uaKey];
  const now = Date.now();
  
  if (!uaEntry || now > uaEntry.resetTime) {
    uaEntry = {
      count: 0,
      resetTime: now + (60 * 60 * 1000) // 1 hour window for user agent
    };
    store[uaKey] = uaEntry;
  }
  
  // Limit to 50 license verifications per hour per User-Agent
  if (uaEntry.count >= 50) {
    return {
      success: false,
      remaining: 0,
      resetTime: uaEntry.resetTime,
      resetIn: Math.ceil((uaEntry.resetTime - now) / 1000),
      error: 'License verification limit exceeded for this client'
    };
  }
  
  uaEntry.count++;
  
  return standardResult;
}

/**
 * Get current rate limit status for debugging
 */
export function getRateLimitStatus(request: NextRequest, keyPrefix: string) {
  const key = getRateLimitKey(request, keyPrefix);
  const entry = store[key];
  
  if (!entry) {
    return null;
  }
  
  const now = Date.now();
  return {
    key,
    count: entry.count,
    resetTime: entry.resetTime,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
    expired: now > entry.resetTime
  };
}

/**
 * Emergency rate limit reset (admin function)
 */
export function resetRateLimit(keyPattern?: string) {
  if (keyPattern) {
    const keys = Object.keys(store);
    for (const key of keys) {
      if (key.includes(keyPattern)) {
        delete store[key];
      }
    }
  } else {
    // Clear all rate limits
    Object.keys(store).forEach(key => delete store[key]);
  }
}

/**
 * Get rate limit statistics
 */
export function getRateLimitStats() {
  const now = Date.now();
  const active = Object.keys(store).filter(key => now <= store[key].resetTime);
  const expired = Object.keys(store).filter(key => now > store[key].resetTime);
  
  return {
    totalEntries: Object.keys(store).length,
    activeEntries: active.length,
    expiredEntries: expired.length,
    memoryUsage: JSON.stringify(store).length
  };
}
/**
 * Input Validation Library for Memory Monster API
 * Comprehensive validation and sanitization for all API endpoints
 */

import { z } from 'zod';

// Common validation schemas
export const commonSchemas = {
  email: z.string().email().max(254).toLowerCase(),
  deviceId: z.string().min(10).max(100).regex(/^[a-zA-Z0-9_-]+$/),
  platform: z.enum(['silicon', 'intel', 'desktop', 'web']),
  version: z.string().max(20).regex(/^\d+\.\d+\.\d+$/),
  uuid: z.string().uuid(),
  objectId: z.string().min(20).max(30),
  url: z.string().url().max(2000),
  licenseKey: z.string().min(20).max(100).regex(/^[A-Z0-9-]+$/),
  planId: z.enum(['free', 'trial', 'pro_monthly', 'pro_yearly']),
  subscriptionStatus: z.enum(['active', 'canceled', 'past_due', 'trialing', 'incomplete']),
};

// License verification schema
export const licenseVerificationSchema = z.object({
  userEmail: commonSchemas.email,
  deviceId: commonSchemas.deviceId,
  appVersion: commonSchemas.version.optional(),
  platform: commonSchemas.platform.optional(),
  hardwareId: z.string().min(10).max(100).optional(),
});

// Download tracking schema
export const downloadTrackingSchema = z.object({
  userEmail: commonSchemas.email,
  deviceId: commonSchemas.deviceId,
  appVersion: commonSchemas.version.optional(),
  platform: commonSchemas.platform.default('desktop'),
});

// Usage tracking schema
export const usageTrackingSchema = z.object({
  userEmail: commonSchemas.email,
  deviceId: commonSchemas.deviceId,
  sessionData: z.object({
    appVersion: commonSchemas.version,
    sessionDurationMinutes: z.number().min(0).max(1440), // Max 24 hours
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
  }).optional(),
  performanceData: z.object({
    scansPerformed: z.number().min(0).max(1000),
    memoryFreedMB: z.number().min(0).max(100000),
    junkFilesRemoved: z.number().min(0).max(1000000),
    appsOptimized: z.number().min(0).max(1000),
    featuresUsed: z.array(z.string().max(50)).max(20),
  }).optional(),
});

// Subscription sync schema
export const subscriptionSyncSchema = z.object({
  userEmail: commonSchemas.email,
  deviceId: commonSchemas.deviceId,
  subscriptionData: z.object({
    planId: commonSchemas.planId,
    status: commonSchemas.subscriptionStatus,
    cancelAtPeriodEnd: z.boolean(),
    currentPeriodStart: z.string().datetime(),
    currentPeriodEnd: z.string().datetime(),
    trialEnd: z.string().datetime().nullable().optional(),
    customerId: z.string().max(100).optional(),
    subscriptionId: z.string().max(100).optional(),
  }),
});

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: commonSchemas.email,
  subject: z.string().min(1).max(200).trim(),
  message: z.string().min(10).max(5000).trim(),
  category: z.enum(['support', 'sales', 'bug', 'feature', 'other']).optional(),
});

// Admin analytics schema
export const adminAnalyticsSchema = z.object({
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  metrics: z.array(z.enum([
    'downloads',
    'active_users',
    'revenue',
    'support_tickets',
    'performance',
    'feature_usage'
  ])).optional(),
  filters: z.object({
    platform: commonSchemas.platform.optional(),
    planType: commonSchemas.planId.optional(),
    userSegment: z.enum(['new', 'returning', 'churned']).optional(),
  }).optional(),
});

/**
 * Validate and sanitize input data
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    return { success: false, errors: new z.ZodError([]) };
  }
}

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Basic HTML sanitization
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Sanitize SQL to prevent injection
 */
export function sanitizeSQL(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove dangerous SQL keywords and characters
  const dangerous = [
    ';', '--', '/*', '*/', 'xp_', 'sp_', 'union', 'select', 'insert',
    'update', 'delete', 'drop', 'create', 'alter', 'exec', 'execute'
  ];

  let sanitized = input;
  dangerous.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  return sanitized.trim();
}

/**
 * Validate file upload
 */
export const fileUploadSchema = z.object({
  filename: z.string().min(1).max(255).refine(
    (name) => /^[a-zA-Z0-9._-]+$/.test(name),
    'Invalid filename characters'
  ),
  size: z.number().min(1).max(10 * 1024 * 1024), // 10MB max
  type: z.enum([
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'text/plain'
  ]),
});

/**
 * Validate JSON structure for API requests
 */
export function validateJSON(jsonString: string): {
  success: boolean;
  data?: any;
  error?: string;
} {
  try {
    const data = JSON.parse(jsonString);
    
    // Check for dangerous payloads
    const jsonStr = JSON.stringify(data);
    const dangerousPatterns = [
      /__proto__/,
      /constructor/,
      /prototype/,
      /function\s*\(/,
      /javascript:/,
      /data:text\/html/,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(jsonStr)) {
        return { success: false, error: 'Potentially dangerous JSON payload' };
      }
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Invalid JSON format' };
  }
}

/**
 * Rate limit validation for different user tiers
 */
export function validateRateLimit(
  userTier: 'free' | 'pro' | 'admin',
  action: 'scan' | 'optimize' | 'api_call' | 'download',
  currentCount: number
): { allowed: boolean; limit: number; message?: string } {
  const limits = {
    free: {
      scan: 3,
      optimize: 1,
      api_call: 100,
      download: 1,
    },
    pro: {
      scan: 999,
      optimize: 999,
      api_call: 1000,
      download: 10,
    },
    admin: {
      scan: 9999,
      optimize: 9999,
      api_call: 10000,
      download: 100,
    }
  };

  const limit = limits[userTier][action];
  
  if (currentCount >= limit) {
    return {
      allowed: false,
      limit,
      message: `${userTier} tier limit of ${limit} ${action}s exceeded`
    };
  }

  return { allowed: true, limit };
}

/**
 * Device ID validation and normalization
 */
export function validateDeviceId(deviceId: string): {
  valid: boolean;
  normalized?: string;
  type?: 'secure' | 'legacy' | 'fallback';
} {
  if (!deviceId || typeof deviceId !== 'string') {
    return { valid: false };
  }

  // Secure device ID (from Apple Security Manager)
  if (deviceId.startsWith('mm_secure_') && deviceId.length >= 32) {
    return { 
      valid: true, 
      normalized: deviceId.toLowerCase(), 
      type: 'secure' 
    };
  }

  // Legacy device ID
  if (deviceId.startsWith('mm_') && deviceId.length >= 20) {
    return { 
      valid: true, 
      normalized: deviceId.toLowerCase(), 
      type: 'legacy' 
    };
  }

  // Fallback device ID
  if (/^[a-zA-Z0-9_-]{10,100}$/.test(deviceId)) {
    return { 
      valid: true, 
      normalized: deviceId.toLowerCase(), 
      type: 'fallback' 
    };
  }

  return { valid: false };
}

/**
 * Email validation with additional security checks
 */
export function validateEmail(email: string): {
  valid: boolean;
  normalized?: string;
  type?: 'personal' | 'business' | 'disposable' | 'suspicious';
  warnings?: string[];
} {
  if (!email || typeof email !== 'string') {
    return { valid: false };
  }

  const normalized = email.toLowerCase().trim();
  const warnings: string[] = [];

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalized)) {
    return { valid: false };
  }

  // Check for disposable email providers
  const disposableProviders = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com',
    'trash-mail.com',
  ];

  const domain = normalized.split('@')[1];
  let type: 'personal' | 'business' | 'disposable' | 'suspicious' = 'personal';

  if (disposableProviders.includes(domain)) {
    type = 'disposable';
    warnings.push('Disposable email provider detected');
  }

  // Check for business domains
  const businessProviders = ['company.com', 'corp.com', 'enterprise.com'];
  if (businessProviders.some(provider => domain.includes(provider))) {
    type = 'business';
  }

  // Check for suspicious patterns
  if (normalized.includes('admin') || normalized.includes('test') || normalized.includes('noreply')) {
    type = 'suspicious';
    warnings.push('Suspicious email pattern detected');
  }

  return {
    valid: true,
    normalized,
    type,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Create validation middleware for API routes
 */
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return async (req: Request) => {
    try {
      const body = await req.json();
      const validation = validateInput(schema, body);
      
      if (!validation.success) {
        return {
          valid: false,
          errors: validation.errors?.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code
          }))
        };
      }

      return { valid: true, data: validation.data };
    } catch (error) {
      return {
        valid: false,
        errors: [{ field: 'body', message: 'Invalid JSON format', code: 'invalid_json' }]
      };
    }
  };
}
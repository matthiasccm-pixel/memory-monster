/**
 * Security Headers Middleware for Memory Monster
 * Implements comprehensive security headers for production deployment
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Apply comprehensive security headers to response
 */
export function applySecurityHeaders(response: NextResponse, request: NextRequest) {
  // Content Security Policy - Prevent XSS and injection attacks
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.clerk.dev https://js.stripe.com https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob:",
    "connect-src 'self' https: wss: https://api.clerk.dev https://api.stripe.com https://*.supabase.co",
    "frame-src https://js.stripe.com https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // XSS Protection (legacy but still useful)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer Policy - Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Strict Transport Security (HTTPS only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Permissions Policy (formerly Feature Policy)
  const permissionsPolicy = [
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=()',
    'battery=()',
    'camera=()',
    'cross-origin-isolated=()',
    'display-capture=()',
    'document-domain=()',
    'encrypted-media=()',
    'execution-while-not-rendered=()',
    'execution-while-out-of-viewport=()',
    'fullscreen=()',
    'geolocation=()',
    'gyroscope=()',
    'keyboard-map=()',
    'magnetometer=()',
    'microphone=()',
    'midi=()',
    'navigation-override=()',
    'payment=(self)',
    'picture-in-picture=()',
    'publickey-credentials-get=()',
    'screen-wake-lock=()',
    'sync-xhr=()',
    'usb=()',
    'web-share=()',
    'xr-spatial-tracking=()'
  ].join(', ');

  response.headers.set('Permissions-Policy', permissionsPolicy);

  // Cross-Origin Policies
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  // Cache Control for sensitive routes
  const pathname = request.nextUrl.pathname;
  
  if (pathname.startsWith('/api/') || pathname.includes('license') || pathname.includes('auth')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // Remove potentially revealing headers
  response.headers.delete('X-Powered-By');
  response.headers.delete('Server');

  // Add custom security identifier
  response.headers.set('X-Security-Level', 'enhanced');

  return response;
}

/**
 * Validate request for suspicious patterns
 */
export function validateRequest(request: NextRequest): { valid: boolean; reason?: string } {
  const userAgent = request.headers.get('user-agent') || '';
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // Block known malicious user agents
  const maliciousPatterns = [
    /sqlmap/i,
    /nikto/i,
    /nessus/i,
    /masscan/i,
    /zap/i,
    /burpsuite/i,
    /curl.*python/i,
    /python-requests/i,
    /wget/i
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(userAgent)) {
      return { valid: false, reason: 'Blocked user agent' };
    }
  }

  // Validate content length for POST requests
  if (request.method === 'POST') {
    const contentLength = request.headers.get('content-length');
    if (contentLength) {
      const length = parseInt(contentLength, 10);
      if (length > 10 * 1024 * 1024) { // 10MB limit
        return { valid: false, reason: 'Content too large' };
      }
    }
  }

  // Check for suspicious paths
  const pathname = request.nextUrl.pathname.toLowerCase();
  const suspiciousPaths = [
    '/wp-admin',
    '/phpmyadmin',
    '/.env',
    '/config',
    '/backup',
    '/.git',
    '/debug',
    '/.aws',
    '/ssh',
    '/mysql'
  ];

  if (suspiciousPaths.some(path => pathname.includes(path))) {
    return { valid: false, reason: 'Suspicious path access' };
  }

  // Validate origin for API requests
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://memorymonster.co',
      'https://www.memorymonster.co'
    ];

    if (origin && !allowedOrigins.includes(origin)) {
      // Allow requests without origin (native apps, Postman, etc.)
      // But be suspicious of web browser requests from other domains
      if (userAgent.includes('Mozilla') && !userAgent.includes('Electron')) {
        return { valid: false, reason: 'Invalid origin for API request' };
      }
    }
  }

  return { valid: true };
}

/**
 * Add rate limiting headers
 */
export function addRateLimitHeaders(
  response: NextResponse, 
  rateLimitResult: { remaining: number; resetTime: number; resetIn: number }
) {
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
  response.headers.set('X-RateLimit-Reset-In', rateLimitResult.resetIn.toString());
  
  return response;
}

/**
 * Log security events
 */
export function logSecurityEvent(
  request: NextRequest,
  event: 'rate_limit_exceeded' | 'invalid_request' | 'suspicious_activity' | 'blocked_request',
  details?: any
) {
  const ip = request.ip || 
    request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.headers.get('x-real-ip') || 
    'unknown';

  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ip,
    userAgent: request.headers.get('user-agent'),
    url: request.url,
    method: request.method,
    details
  };

  // In production, send to your logging service
  console.warn('🚨 SECURITY EVENT:', JSON.stringify(logEntry));

  // TODO: Send to external logging service in production
  // Example: sendToLogService(logEntry);
}

/**
 * Create security-focused error response
 */
export function createSecurityErrorResponse(
  message: string = 'Request blocked',
  status: number = 429
): NextResponse {
  const response = NextResponse.json(
    { 
      error: message,
      timestamp: new Date().toISOString()
    },
    { status }
  );

  // Add security headers even to error responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  
  return response;
}
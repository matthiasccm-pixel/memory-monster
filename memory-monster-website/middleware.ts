import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, RATE_LIMITS } from './lib/rateLimit';
import { applySecurityHeaders, validateRequest, addRateLimitHeaders, logSecurityEvent, createSecurityErrorResponse } from './lib/securityHeaders';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/features',
  '/pricing', 
  '/about',
  '/blog',
  '/blog/(.*)',
  '/contact',
  '/download',
  '/download/(.*)',
  '/help',
  '/help/(.*)',
  '/privacy',
  '/terms',
  '/signin',
  '/for-developers',
  '/for-designers', 
  '/for-gamers',
  '/for-analysts',
  '/for-streamers',
  '/mission',
  '/api/webhooks/(.*)',
  '/api/test',
  '/success'
]);

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard',
  '/pro/(.*)',
  '/admin/(.*)',
  '/api/admin/(.*)',
  '/api/user/(.*)',
  '/api/license/(.*)',
  '/api/create-checkout-session',
  '/api/customer-portal'
]);

// Define API routes that need rate limiting
const isAPIRoute = createRouteMatcher(['/api/(.*)']);

export default clerkMiddleware((auth, req: NextRequest) => {
  // 1. SECURITY VALIDATION - Block suspicious requests
  const validationResult = validateRequest(req);
  if (!validationResult.valid) {
    logSecurityEvent(req, 'blocked_request', { reason: validationResult.reason });
    return createSecurityErrorResponse('Access denied', 403);
  }

  // 2. RATE LIMITING - Apply to API routes
  if (isAPIRoute(req)) {
    const pathname = req.nextUrl.pathname;
    let rateLimitConfig = RATE_LIMITS.GENERAL_API;
    let rateLimitKey = 'general';

    // Apply specific rate limits based on endpoint
    if (pathname.includes('/api/license') || pathname.includes('/api/verify')) {
      rateLimitConfig = RATE_LIMITS.LICENSE_VERIFY;
      rateLimitKey = 'license';
    } else if (pathname.includes('/api/download') || pathname.includes('/api/track-download')) {
      rateLimitConfig = RATE_LIMITS.DOWNLOAD_TRACK;
      rateLimitKey = 'download';
    } else if (pathname.includes('/api/webhooks/stripe')) {
      rateLimitConfig = RATE_LIMITS.STRIPE_WEBHOOK;
      rateLimitKey = 'stripe';
    } else if (pathname.includes('/api/signin') || pathname.includes('/api/auth')) {
      rateLimitConfig = RATE_LIMITS.AUTH;
      rateLimitKey = 'auth';
    }

    const rateLimitResult = checkRateLimit(req, rateLimitConfig, rateLimitKey);
    
    if (!rateLimitResult.success) {
      logSecurityEvent(req, 'rate_limit_exceeded', { 
        endpoint: pathname,
        resetIn: rateLimitResult.resetIn 
      });
      
      const response = createSecurityErrorResponse(rateLimitResult.error, 429);
      return addRateLimitHeaders(response, {
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime,
        resetIn: rateLimitResult.resetIn
      });
    }
  }

  // 3. AUTHENTICATION - Protect routes that require it
  if (isProtectedRoute(req)) {
    auth().protect();
  }

  // 4. PROCEED WITH REQUEST
  let response = NextResponse.next();
  
  // 5. APPLY SECURITY HEADERS
  response = applySecurityHeaders(response, req);

  // 6. ADD RATE LIMIT HEADERS FOR API ROUTES
  if (isAPIRoute(req)) {
    const pathname = req.nextUrl.pathname;
    let rateLimitConfig = RATE_LIMITS.GENERAL_API;
    let rateLimitKey = 'general';

    if (pathname.includes('/api/license') || pathname.includes('/api/verify')) {
      rateLimitConfig = RATE_LIMITS.LICENSE_VERIFY;
      rateLimitKey = 'license';
    }

    const rateLimitResult = checkRateLimit(req, rateLimitConfig, rateLimitKey);
    if (rateLimitResult.success) {
      response = addRateLimitHeaders(response, rateLimitResult);
    }
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
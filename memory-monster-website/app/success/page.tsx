// app/success/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useUser, useSignUp } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Download, Key, Copy, ExternalLink, ArrowRight, UserPlus, Lock } from 'lucide-react';
import { Navigation, Footer, FloatingElements } from '../lib/components';

export default function SuccessPage() {
  const { user } = useUser();
  const { signUp, setActive } = useSignUp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activationTriggered, setActivationTriggered] = useState(false);
  
  // Account creation states
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [accountCreationError, setAccountCreationError] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationStep, setShowVerificationStep] = useState(false);

  useEffect(() => {
    const fetchLicenseAndActivate = async () => {
      try {
        // Get session ID from URL (Stripe redirects here with session_id)
        const sessionId = searchParams.get('session_id');
        const deviceId = searchParams.get('device_id');
        const returnUrl = searchParams.get('return_url');
        
        if (sessionId) {
          // For guest checkouts, use the session-based license endpoint
          const response = await fetch(`/api/license/session?session_id=${sessionId}`);
          if (response.ok) {
            const data = await response.json();
            console.log('✅ License data from session:', data);
            setLicenseKey(data.profile?.license_key);
            setUserEmail(data.profile?.email);
            
            // If came from desktop app, trigger deep link activation
            if (deviceId && !activationTriggered && data.profile?.license_key) {
              setActivationTriggered(true);
              setTimeout(() => {
                const activationUrl = `memorymonster://activate?license_key=${data.profile?.license_key}&email=${data.profile?.email}&plan=pro`;
                console.log('🚀 Triggering desktop app activation:', activationUrl);
                window.location.href = activationUrl;
              }, 2000); // Give user time to see success message
            }
          } else {
            console.error('Failed to fetch license from session:', response.status);
            // Fallback: try the user profile endpoint if user is logged in
            if (user) {
              const fallbackResponse = await fetch('/api/user/profile');
              if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                setLicenseKey(fallbackData.profile?.license_key);
                setUserEmail(fallbackData.profile?.email || user?.emailAddresses[0]?.emailAddress);
              }
            }
          }
        } else {
          // No session ID, try user profile if logged in
          if (user) {
            const response = await fetch('/api/user/profile');
            if (response.ok) {
              const data = await response.json();
              setLicenseKey(data.profile?.license_key);
              setUserEmail(data.profile?.email || user?.emailAddresses[0]?.emailAddress);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching license:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenseAndActivate();
  }, [searchParams, user, activationTriggered]);

  const copyLicenseKey = async () => {
    if (licenseKey) {
      try {
        await navigator.clipboard.writeText(licenseKey);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error('Failed to copy license key:', error);
      }
    }
  };

  const openDesktopApp = () => {
    // Attempt to open the desktop app with activation
    const activationUrl = `memorymonster://activate?license_key=${licenseKey}&email=${userEmail}&plan=pro`;
    window.location.href = activationUrl;
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp || !verificationCode) return;
    
    console.log('🔐 Attempting to verify email with code:', verificationCode);
    setCreatingAccount(true);
    setAccountCreationError(null);
    
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode
      });
      
      console.log('✅ Verification result:', result.status);
      
      if (result.status === 'complete') {
        // Sign up is complete, set the session
        await setActive({ session: result.createdSessionId });
        
        // Link the Clerk account to the existing Supabase profile
        if (result.createdUserId) {
          await linkClerkToProfile(result.createdUserId);
        }
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setAccountCreationError('Verification failed. Please check the code and try again.');
      }
    } catch (error: any) {
      console.error('❌ Verification error:', error);
      setAccountCreationError('Invalid verification code. Please try again.');
    } finally {
      setCreatingAccount(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp || !userEmail) return;
    
    console.log('🚀 Starting account creation for:', userEmail);
    setCreatingAccount(true);
    setAccountCreationError(null);
    
    try {
      // Create the Clerk account
      console.log('📝 Calling signUp.create with email:', userEmail);
      const result = await signUp.create({
        emailAddress: userEmail,
        password: password
      });
      
      console.log('✅ SignUp result:', result.status, result);
      console.log('📋 Full result details:', {
        status: result.status,
        createdUserId: result.createdUserId,
        createdSessionId: result.createdSessionId,
        unverifiedFields: result.unverifiedFields,
        verifications: result.verifications
      });

      // Check if we need email verification
      if (result.status === 'complete') {
        // Sign up is complete, set the session
        await setActive({ session: result.createdSessionId });
        
        // Link the Clerk account to the existing Supabase profile
        await linkClerkToProfile(result.createdUserId);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else if (result.status === 'missing_requirements') {
        console.log('📧 Missing requirements detected, checking if email verification needed...');
        
        if (result.unverifiedFields?.includes('email_address')) {
          // Try to prepare email verification
          console.log('📨 Preparing email address verification...');
          try {
            await signUp.prepareEmailAddressVerification({ 
              strategy: 'email_code' 
            });
            console.log('✅ Email verification code sent successfully');
            setShowVerificationStep(true);
            setAccountCreationError(null);
          } catch (verifyError) {
            console.error('❌ Failed to send verification email:', verifyError);
            setAccountCreationError(`Unable to send verification email. Please try signing up directly.`);
          }
        } else {
          console.log('⚠️ Other missing requirements:', result.unverifiedFields);
          setAccountCreationError(`Account setup incomplete. Please try signing in.`);
        }
      }
    } catch (error: any) {
      console.error('❌ Account creation error:', error);
      console.error('❌ Error details:', error.errors);
      
      // Check for specific Clerk errors
      if (error.errors?.[0]?.code === 'form_password_pwned') {
        setAccountCreationError('This password has been found in a data breach. Please choose a more secure password.');
      } else if (error.errors?.[0]?.code === 'form_identifier_exists') {
        setAccountCreationError('An account with this email already exists. Please sign in instead.');
      } else if (error.errors?.[0]?.code === 'form_password_length_too_short') {
        setAccountCreationError('Password must be at least 8 characters long.');
      } else {
        setAccountCreationError(error.errors?.[0]?.longMessage || error.errors?.[0]?.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setCreatingAccount(false);
    }
  };

  const linkClerkToProfile = async (clerkUserId?: string | null) => {
    if (!userEmail) return;
    
    try {
      const response = await fetch('/api/link-clerk-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: userEmail,
          clerkUserId: clerkUserId || user?.id 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Link profile error:', errorData);
        throw new Error(errorData.error || 'Failed to link account to purchase');
      }
    } catch (error) {
      console.error('Failed to link Clerk profile:', error);
      // Don't throw - we still want the user to be able to sign in
    }
  };

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingElements />
      <Navigation />
      
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Animation */}
          <motion.div 
            className="text-center mb-12"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2 
            }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-20 h-20 text-white" />
            </div>
            
            <h1 className="text-5xl font-black text-white mb-4">
              Welcome to <span className="morphing-gradient">Memory Monster Pro!</span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Your purchase was successful! Your Mac is about to become lightning fast.
            </p>
          </motion.div>

          {/* Main Content Card */}
          <motion.div 
            className="glass-card rounded-3xl p-8 border border-glass-200 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-white/70">Setting up your Pro account...</p>
              </div>
            ) : (
              <>
                {/* Step 1: License Key Section */}
                {licenseKey && (
                  <motion.div 
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center font-bold text-white text-lg">
                        1
                      </div>
                      <h2 className="text-white font-bold text-2xl">Your License Key</h2>
                    </div>
                    
                    <div className="bg-glass-100 rounded-2xl p-8 border border-glass-200">
                      <div className="text-center mb-6">
                        <Key className="w-16 h-16 text-primary mx-auto mb-4" />
                        <p className="text-white/90 text-lg font-semibold mb-2">
                          ⚠️ Save this key - you'll need it to unlock Pro features
                        </p>
                        <p className="text-white/70 text-sm">
                          Copy this license key and enter it into the Memory Monster app to activate your Pro subscription.
                        </p>
                      </div>

                      <div className="bg-glass-200 rounded-xl p-6 border border-glass-200 mb-4">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <code className="text-primary font-mono text-xl font-bold">{licenseKey}</code>
                          <motion.button
                            onClick={copyLicenseKey}
                            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {copySuccess ? (
                              <>
                                <CheckCircle className="w-5 h-5" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-5 h-5" />
                                Copy Key
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                      
                      <p className="text-white/60 text-sm text-center">
                        💌 This key has also been sent to your email: <strong>{userEmail}</strong>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Create Your Account */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-emerald-500 rounded-full flex items-center justify-center font-bold text-white text-lg">
                      2
                    </div>
                    <h2 className="text-white font-bold text-2xl">Create Your Account</h2>
                  </div>

                  {!user && userEmail ? (
                    // Side-by-side layout: explanation on left, form on right
                    <div className="bg-glass-100 rounded-2xl p-8 border border-glass-200">
                      <div className="grid lg:grid-cols-2 gap-8 items-start">
                        {/* Left side - Explanation */}
                        <div className="space-y-6">
                          <div className="text-center lg:text-left">
                            <UserPlus className="w-16 h-16 text-primary mx-auto lg:mx-0 mb-4" />
                            <h3 className="text-white font-bold text-xl mb-4">Secure Your Pro Access</h3>
                          </div>
                          
                          <div className="space-y-4 text-white/80 leading-relaxed">
                            <p>
                              <strong className="text-white">Create a password</strong> to secure your Memory Monster Pro subscription and manage your account.
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="text-sm">Access your dashboard anytime</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="text-sm">Manage your subscription & billing</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="text-sm">Download app updates</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="text-sm">Get priority support</span>
                              </div>
                            </div>
                          </div>
                          
                        </div>

                        {/* Right side - Account creation form */}
                        <div className="bg-glass-200/50 rounded-xl p-6 border border-glass-200">
                          {showVerificationStep ? (
                            // Verification code form
                            <form onSubmit={handleVerifyEmail} className="space-y-5">
                              <div className="text-center mb-4">
                                <h3 className="text-white font-bold text-xl mb-2">Verify Your Email</h3>
                                <p className="text-white/70 text-sm">
                                  We've sent a verification code to {userEmail}
                                </p>
                              </div>
                              
                              <div>
                                <label className="block text-white font-medium mb-2">
                                  Verification Code
                                </label>
                                <input
                                  type="text"
                                  value={verificationCode}
                                  onChange={(e) => setVerificationCode(e.target.value)}
                                  placeholder="Enter 6-digit code"
                                  required
                                  maxLength={6}
                                  className="w-full bg-gray-800 border-2 border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none transition-all duration-300 font-medium text-base text-center text-2xl tracking-widest"
                                />
                                <p className="text-white/60 text-xs mt-1 text-center">Check your email for the code</p>
                              </div>
                              
                              {accountCreationError && (
                                <div className="bg-red-500/10 border-red-500/20 rounded-xl p-4">
                                  <p className="text-red-400 text-sm text-center font-medium">
                                    {accountCreationError}
                                  </p>
                                </div>
                              )}
                              
                              <motion.button
                                type="submit"
                                disabled={creatingAccount || !verificationCode}
                                className="w-full bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                                whileHover={{ y: -2 }}
                              >
                                {creatingAccount ? (
                                  <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Verifying...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-5 h-5" />
                                    Verify & Complete
                                  </>
                                )}
                              </motion.button>
                            </form>
                          ) : (
                            // Password creation form
                            <form onSubmit={handleCreateAccount} className="space-y-5">
                              <div>
                                <label className="block text-white font-medium mb-2">
                                  Email Address
                                </label>
                                <input
                                  type="email"
                                  value={userEmail || ''}
                                  disabled
                                  className="w-full bg-gray-800 border-2 border-gray-600 rounded-xl px-4 py-3 text-white font-medium text-base"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-white font-medium mb-2">
                                  Create Password
                                </label>
                                <input
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Enter a secure password (8+ characters)"
                                  required
                                  minLength={8}
                                  className="w-full bg-gray-800 border-2 border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none transition-all duration-300 font-medium text-base"
                                />
                                <p className="text-white/60 text-xs mt-1">Must be at least 8 characters long</p>
                              </div>
                            
                            {accountCreationError && (
                              <div className={`${
                                accountCreationError.includes('Account created') 
                                  ? 'bg-green-500/10 border-green-500/20' 
                                  : 'bg-red-500/10 border-red-500/20'
                              } rounded-xl p-4`}>
                                <p className={`text-sm text-center font-medium ${
                                  accountCreationError.includes('Account created') 
                                    ? 'text-black' 
                                    : 'text-red-400'
                                }`}>
                                  {accountCreationError}
                                </p>
                              </div>
                            )}
                            
                            {accountCreated ? (
                              <motion.a
                                href="/signin"
                                className="w-full bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2"
                                whileHover={{ y: -2 }}
                              >
                                <ArrowRight className="w-5 h-5" />
                                Sign In
                              </motion.a>
                            ) : (
                              <motion.button
                                type="submit"
                                disabled={creatingAccount || !password}
                                className="w-full bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                                whileHover={{ y: -2 }}
                              >
                                {creatingAccount ? (
                                  <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Creating Account...
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-5 h-5" />
                                    Create Account
                                  </>
                                )}
                              </motion.button>
                            )}
                          </form>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Account management for logged-in users
                    <div className="bg-glass-100 rounded-2xl p-8 border border-glass-200 text-center">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-white font-bold text-xl mb-4">Account Ready</h3>
                      <p className="text-white/70 mb-6">
                        You're all set! Access your dashboard to manage your subscription and downloads.
                      </p>
                      <motion.a
                        href="/dashboard"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary via-secondary to-primary bg-400% animate-gradient text-white font-bold py-4 px-8 rounded-2xl"
                        whileHover={{ y: -2, scale: 1.05 }}
                      >
                        Go to Dashboard
                        <ArrowRight className="w-5 h-5" />
                      </motion.a>
                    </div>
                  )}
                </motion.div>

                {/* Step 3: Next Steps */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-white text-lg">
                      3
                    </div>
                    <h2 className="text-white font-bold text-2xl">Next Steps</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Download App */}
                    <motion.div 
                      className="bg-glass-100 rounded-2xl p-6 border border-glass-200"
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Download className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg mb-2">Download the App</h3>
                          <p className="text-white/70 text-sm mb-4 leading-relaxed">
                            Get Memory Monster for your Mac if you haven't already. Choose your Mac type below.
                          </p>
                          <motion.a
                            href="/download"
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
                            whileHover={{ x: 4 }}
                          >
                            Download Now
                            <ArrowRight className="w-4 h-4" />
                          </motion.a>
                        </div>
                      </div>
                    </motion.div>

                    {/* Enter License Key */}
                    <motion.div 
                      className="bg-glass-100 rounded-2xl p-6 border border-glass-200"
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg mb-2">Enter License Key</h3>
                          <p className="text-white/70 text-sm mb-4 leading-relaxed">
                            Open Memory Monster, go to Settings → License, and enter your key to unlock Pro features.
                          </p>
                          <motion.button
                            onClick={openDesktopApp}
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
                            whileHover={{ x: 4 }}
                          >
                            Open App
                            <ExternalLink className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Auto-activation Notice */}
                  {activationTriggered && (
                    <motion.div 
                      className="mt-6 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <div className="flex items-center gap-4">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <div>
                          <div className="text-white font-semibold">Activating your desktop app...</div>
                          <div className="text-white/70 text-sm">
                            Memory Monster should open automatically with Pro features unlocked.
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Help Section */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-white/60 text-sm">
              Need help? Check out our{' '}
              <a href="/help" className="text-primary hover:text-primary/80 underline">
                setup guide
              </a>
              {' '}or{' '}
              <a href="/help" className="text-primary hover:text-primary/80 underline">
                contact support
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
// app/api/webhooks/stripe/route.ts (UPDATED VERSION)
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Generate a secure license key
function generateLicenseKey(): string {
  const prefix = 'MM';
  const random = randomBytes(16).toString('hex').toUpperCase();
  const formatted = random.match(/.{1,4}/g)?.join('-') || random;
  return `${prefix}-${formatted}`;
}

export async function POST(request: NextRequest) {
  console.log('🎯 WEBHOOK HIT - Stripe webhook received');
  
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  console.log('📝 Webhook signature present:', !!signature);

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('❌ Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  console.log(`🔔 Webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('🛒 Processing checkout completion:', session.id);
  console.log('📧 Session email:', session.customer_details?.email || session.customer_email);
  console.log('🔑 Session metadata:', session.metadata);
  
  const userEmail = session.customer_details?.email || session.customer_email;
  const clerkUserId = session.metadata?.userId;
  const planType = session.metadata?.planType || 'monthly';

  if (!userEmail) {
    console.error('❌ No email found in checkout session:', session.id);
    return;
  }

  console.log('📧 Processing for email:', userEmail, 'Clerk ID:', clerkUserId);

  try {
    let profileId: string;
    let licenseKey: string;

    // Check if user already exists by Clerk ID or email
    let existingProfile = null;
    
    if (clerkUserId) {
      const { data } = await supabase
        .from('profiles')
        .select('id, license_key')
        .eq('clerk_user_id', clerkUserId)
        .single();
      existingProfile = data;
    }
    
    if (!existingProfile) {
      const { data } = await supabase
        .from('profiles')
        .select('id, license_key')
        .eq('email', userEmail)
        .single();
      existingProfile = data;
    }

    if (existingProfile) {
      // Update existing profile
      licenseKey = existingProfile.license_key || generateLicenseKey();
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email: userEmail,
          stripe_customer_id: session.customer as string,
          plan: 'pro',
          license_key: licenseKey,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProfile.id);

      if (updateError) {
        console.error('❌ Failed to update existing profile:', updateError);
        return;
      }
      
      profileId = existingProfile.id;
      console.log('✅ Updated existing profile:', profileId);
    } else {
      // Create new profile
      licenseKey = generateLicenseKey();
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{
          clerk_user_id: clerkUserId || `guest_${Date.now()}`,
          email: userEmail,
          stripe_customer_id: session.customer as string,
          plan: 'pro',
          license_key: licenseKey,
          created_at: new Date().toISOString(),
        }])
        .select('id')
        .single();

      if (createError) {
        console.error('❌ Failed to create profile:', createError);
        return;
      }
      
      profileId = newProfile.id;
      console.log('✅ Created new profile:', profileId);
    }

    // Create subscription record
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      
      const priceId = subscription.items.data[0].price.id;
      const isMonthly = priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY;
      const finalPlanType = isMonthly ? 'pro_monthly' : 'pro_yearly';

      // Calculate trial end (7 days from now if it's a new subscription)
      const trialEnd = subscription.trial_end 
        ? new Date(subscription.trial_end * 1000).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: profileId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          plan_id: finalPlanType,
          price_id: priceId,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          trial_end: trialEnd,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'stripe_subscription_id'
        });

      if (subscriptionError) {
        console.error('❌ Failed to create/update subscription:', subscriptionError);
      } else {
        console.log('✅ Successfully created/updated subscription for profile:', profileId);
      }
    }

    // Initialize app usage tracking
    const { error: usageError } = await supabase
      .from('app_usage')
      .upsert({
        user_id: profileId,
        memory_scans_performed: 0,
        memory_freed_mb: 0,
        apps_optimized: 0,
        total_usage_time_minutes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (usageError) {
      console.error('❌ Failed to initialize app usage:', usageError);
    }

  } catch (error) {
    console.error('❌ Error in handleCheckoutCompleted:', error);
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('🔄 Processing subscription change:', subscription.id);
  
  try {
    const periodStart = subscription.current_period_start 
      ? new Date(subscription.current_period_start * 1000).toISOString()
      : null;
    const periodEnd = subscription.current_period_end 
      ? new Date(subscription.current_period_end * 1000).toISOString() 
      : null;
    const trialEnd = subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null;

    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        trial_end: trialEnd,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('❌ Failed to update subscription:', error);
    } else {
      console.log('✅ Updated subscription:', subscription.id, 'cancel_at_period_end:', subscription.cancel_at_period_end);
    }

  } catch (error) {
    console.error('❌ Error in handleSubscriptionChange:', error);
  }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  console.log('❌ Processing subscription cancellation:', subscription.id);
  
  try {
    // Update subscription status
    const { error: subError } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (subError) {
      console.error('❌ Failed to update subscription status:', subError);
    }

    // Downgrade user plan
    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (subscriptionData) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          plan: 'free',
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriptionData.user_id);

      if (profileError) {
        console.error('❌ Failed to downgrade user plan:', profileError);
      } else {
        console.log('✅ Successfully downgraded user to free plan');
      }
    }

  } catch (error) {
    console.error('❌ Error in handleSubscriptionCancelled:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('✅ Payment succeeded for invoice:', invoice.id);
  
  if (invoice.subscription) {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', invoice.subscription as string);

    if (error) {
      console.error('❌ Failed to update subscription to active:', error);
    } else {
      console.log('✅ Updated subscription to active');
    }
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('💳 Payment failed for invoice:', invoice.id);
  
  if (invoice.subscription) {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', invoice.subscription as string);

    if (error) {
      console.error('❌ Failed to update subscription to past_due:', error);
    } else {
      console.log('⚠️ Updated subscription to past_due');
    }
  }
}